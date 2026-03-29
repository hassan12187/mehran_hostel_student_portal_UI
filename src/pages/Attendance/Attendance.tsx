import React, { useState, useMemo } from "react";
import "./Attendance.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faChartLine,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faDownload,
  faPrint,
  faCalendarAlt,
  faUtensils,
  faHome,
  faHistory,
  faSearch,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "@tanstack/react-query";

import { useAttendance, attendanceKeys } from "./useAttendance";
import { useCustom } from "../../context/Store";
import {
  AttendanceTab,
  AttendanceStatus,
  DailyAttendanceRow,
} from "./Attendance.types";

// ─── Static data ──────────────────────────────────────────────────────────────

const ATTENDANCE_RULES = [
  {
    category: "Mess Attendance",
    rules: [
      "Breakfast: 7:00 AM – 9:00 AM",
      "Lunch: 12:30 PM – 2:30 PM",
      "Dinner: 7:00 PM – 9:00 PM",
      "Latecomers will not be served",
      "Minimum 75% attendance required monthly",
    ],
  },
  {
    category: "Hostel Attendance",
    rules: [
      "Morning Check-in: 6:00 AM – 8:00 AM",
      "Evening Check-in: 5:00 PM – 7:00 PM",
      "Night Check-in: 9:00 PM – 11:00 PM",
      "Night out requires prior gate pass",
      "80% minimum attendance mandatory",
    ],
  },
  {
    category: "Leave Policy",
    rules: [
      "Medical leave requires doctor's certificate",
      "Emergency leave: Inform warden immediately",
      "Planned leave: Apply 3 days in advance",
      "Maximum 5 leaves per month allowed",
      "Exceeding limits may lead to fine",
    ],
  },
];

/** Last 12 months as { value: "YYYY-MM", label: "January 2024" } */
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - i);
  const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  const label = d.toLocaleString("en-US", { month: "long", year: "numeric" });
  return { value, label };
});

const TABS: { id: AttendanceTab; label: string; icon: any }[] = [
  { id: "overview", label: "Overview",       icon: faChartLine          },
  { id: "records",  label: "Daily Records",  icon: faCalendarCheck      },
  { id: "trends",   label: "Monthly Trends", icon: faHistory            },
  { id: "rules",    label: "Rules",          icon: faExclamationTriangle },
];

// ─── Tiny presentational components ──────────────────────────────────────────

function StatusIcon({ status }: { status: AttendanceStatus | "partial" | undefined }) {
  if (!status || status === "partial")
    return <FontAwesomeIcon icon={faClock} className="status-icon leave" />;
  if (status === "Present")
    return <FontAwesomeIcon icon={faCheckCircle} className="status-icon present" />;
  if (status === "Leave")
    return <FontAwesomeIcon icon={faClock} className="status-icon leave" />;
  return <FontAwesomeIcon icon={faTimesCircle} className="status-icon absent" />;
}

function MealBadge({ status }: { status: AttendanceStatus | undefined }) {
  if (!status)              return <FontAwesomeIcon icon={faTimesCircle} className="absent" />;
  if (status === "Present") return <FontAwesomeIcon icon={faCheckCircle} className="present" />;
  if (status === "Leave")   return <FontAwesomeIcon icon={faClock}       className="leave"   />;
  return <FontAwesomeIcon icon={faTimesCircle} className="absent" />;
}

function ProgressRing({ percentage, size = 80 }: { percentage?: number; size?: number }) {
  const r      = (size - 10) / 2;
  const circ   = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;
  const color  =
    percentage >= 80 ? "var(--color-success)"
    : percentage >= 60 ? "var(--color-warning)"
    : "var(--color-danger)";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`${percentage}%`}>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="var(--color-border)" strokeWidth={8}
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x="50%" y="50%"
        dominantBaseline="middle" textAnchor="middle"
        fontSize="13" fontWeight="700" fill={color}
      >
        {percentage}%
      </text>
    </svg>
  );
}

// ─── Export helpers ───────────────────────────────────────────────────────────

function exportToCSV(rows: DailyAttendanceRow[], month: string) {
  const header = "Date,Day,Breakfast,Lunch,Dinner,Overall Status,Remarks";
  const body   = rows
    .map((r) =>
      [
        r.date, r.day,
        r.breakfast ?? "N/A",
        r.lunch     ?? "N/A",
        r.dinner    ?? "N/A",
        r.overallStatus,
        `"${r.remarks}"`,
      ].join(",")
    )
    .join("\n");

  const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), {
    href:     url,
    download: `attendance_${month}.csv`,
  });
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main component ───────────────────────────────────────────────────────────

const Attendance: React.FC = () => {
  const [activeTab,     setActiveTab]     = useState<AttendanceTab>("overview");
  const [selectedMonth, setSelectedMonth] = useState<string>(MONTH_OPTIONS[0].value);
  const [searchTerm,    setSearchTerm]    = useState<string>("");
  const [statusFilter,  setStatusFilter]  = useState<"" | "present" | "absent" | "partial">("");

  const { token } = useCustom() as { token: string };
  const queryClient = useQueryClient();

  const {
    summaryData,
    records,
    monthlyTrends,
    isLoading,
    isError,
    error,
    isFetchingRecords,
    isTrendsLoading,
    refetchSummary,
    refetchRecords,
  } = useAttendance(selectedMonth, token);
console.log(monthlyTrends);
  // Invalidate ALL attendance cache and refetch everything
  const handleRefreshAll = () => {
    queryClient.invalidateQueries({ queryKey: attendanceKeys.all(token) });
  };

  // ── Filtered records ────────────────────────────────────────────────────────
  const filteredRecords = useMemo(
    () =>
      records.filter((r) => {
        const matchSearch =
          !searchTerm ||
          r.date.includes(searchTerm) ||
          r.day.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.remarks.toLowerCase().includes(searchTerm.toLowerCase());

        const matchStatus = !statusFilter || r.overallStatus === statusFilter;

        return matchSearch && matchStatus;
      }),
    [records, searchTerm, statusFilter]
  );

  // ── Global loading state ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="attendance-page">
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading attendance data…</p>
        </div>
      </div>
    );
  }

  if (isError || !summaryData) {
    return (
      <div className="attendance-page">
        <div className="error-state">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <p>{error ?? "Unable to load attendance data."}</p>
          <button className="btn btn-primary" onClick={() => refetchSummary()}>
            <FontAwesomeIcon icon={faRefresh} /> Retry
          </button>
        </div>
      </div>
    );
  }

  const { Breakfast, Lunch, Dinner } = summaryData?.byMeal;
  const overall = {absent:summaryData?.absent,present:summaryData?.present,leave:summaryData?.onLeave,total:summaryData?.totalMeals};
  // console.log(summaryData);
  // console.log(overall);
  // console.log(Breakfast);
  // console.log(Lunch);
  // console.log(Dinner);

  // ──────────────────────────────────────────────────────────────────────────
  // TAB: OVERVIEW
  // ──────────────────────────────────────────────────────────────────────────
  const renderOverviewTab = () => (
    <div className="overview-tab">
      <div className="stats-section">
        <h3>Attendance Summary</h3>
        <div className="stats-grid">
          {[
            { label: "Overall",   data: overall,    cls: "overall"   },
            { label: "Breakfast", data: Breakfast,  cls: "breakfast" },
            { label: "Lunch",     data: Lunch,      cls: "lunch"     },
            { label: "Dinner",    data: Dinner,     cls: "dinner"    },
          ].map(({ label, data, cls }) => (
            <div key={cls} className={`stat-card ${cls}`}>
              <ProgressRing percentage={
                Math.floor(((data?.present||0+data?.absent||0+data?.onLeave||0)/overall?.total||0)*100)
                // console.log(data?.onLeave)
                // data?.percentage
                } />
              <div className="stat-content">
                <p className="stat-label">{label}</p>
                <div className="stat-details">
                  <span>Present: {data?.present}</span>
                  <span>Absent:  {data?.absent}</span>
                  <span>Total:   {data?.total}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Month summary */}
      <div className="month-summary">
        <div className="summary-header">
          <h3>{MONTH_OPTIONS.find((o) => o.value === selectedMonth)?.label ?? selectedMonth}</h3>
          <div className="month-actions">
            <button className="btn btn-outline" onClick={() => exportToCSV(records, selectedMonth)}>
              <FontAwesomeIcon icon={faDownload} /> Download
            </button>
            <button className="btn btn-outline" onClick={() => window.print()}>
              <FontAwesomeIcon icon={faPrint} /> Print
            </button>
          </div>
        </div>

        <div className="summary-cards">
          {[
            { label: "Working Days", value: overall?.total,   icon: faCalendarAlt, cls: "working" },
            { label: "Present Days", value: overall?.present, icon: faCheckCircle, cls: "present" },
            { label: "Absent Days",  value: overall?.absent,  icon: faTimesCircle, cls: "absent"  },
            { label: "Leave Days",   value: overall?.leave,   icon: faClock,       cls: "leave"   },
          ].map(({ label, value, icon, cls }) => (
            <div key={cls} className="summary-card">
              <div className={`card-icon ${cls}`}>
                <FontAwesomeIcon icon={icon} />
              </div>
              <div className="card-content">
                <h4>{value}</h4>
                <p>{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="progress-section">
          <div className="progress-header">
            <span>Monthly Progress</span>
            <span>{summaryData?.attendancePct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${summaryData?.attendancePct}%` }} />
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="recent-activity">
        <h3>Recent Attendance</h3>
        {isFetchingRecords ? (
          <div className="loading-inline">
            <div className="spinner spinner-sm" /> Loading recent records…
          </div>
        ) : (
          <div className="activity-list">
            {records.slice(0, 7).map((record) => (
              <div key={record?.date} className="activity-item">
                <div className="activity-date">
                  <strong>{new Date(record?.date).toLocaleDateString()}</strong>
                  <span>{record?.day}</span>
                </div>
                <div className="activity-status">
                  <StatusIcon status={record.overallStatus} />
                  <span className={`status-text ${record.overallStatus}`}>
                    {record.overallStatus.charAt(0).toUpperCase() + record.overallStatus.slice(1)}
                  </span>
                </div>
                <div className="activity-details">
                  <div className="detail">
                    <FontAwesomeIcon icon={faUtensils} />
                    <span>
                      {[record.breakfast, record.lunch, record.dinner].filter((s) => s === "Present").length}
                      /3 meals
                    </span>
                  </div>
                </div>
                <div className="activity-remarks">
                  <span>{record.remarks || "—"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ──────────────────────────────────────────────────────────────────────────
  // TAB: RECORDS
  // ──────────────────────────────────────────────────────────────────────────
  const renderRecordsTab = () => (
    <div className="records-tab">
      <div className="records-header">
        <h3>Daily Attendance Records</h3>
        <div className="records-controls">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search by date, day or remarks…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setSearchTerm("");
              setStatusFilter("");
            }}
            className="month-select"
          >
            {MONTH_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="month-select"
          >
            <option value="">All Statuses</option>
            <option value="present">Present</option>
            <option value="partial">Partial</option>
            <option value="absent">Absent</option>
          </select>
        </div>
      </div>

      {isFetchingRecords ? (
        <div className="loading-inline">
          <div className="spinner spinner-sm" /> Fetching records…
        </div>
      ) : (
        <>
          <div className="records-table">
            <div className="table-header">
              <span>Date</span>
              <span>Day</span>
              <span>Breakfast</span>
              <span>Lunch</span>
              <span>Dinner</span>
              <span>Status</span>
              <span>Remarks</span>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="empty-state">No records found for the selected filters.</div>
            ) : (
              filteredRecords.map((record) => (
                <div key={record.date} className="table-row">
                  <span className="date-cell"><strong>{new Date(record.date).toLocaleDateString()}</strong></span>
                  <span className="day-cell">{record?.day}</span>

                  {(["breakfast", "lunch", "dinner"] as const).map((meal) => (
                    <span key={meal} className="meal-cell">
                      <div className="meal-item">
                        <MealBadge status={record[meal]} />
                        <span className={record[meal] === "Present" ? "present" : record[meal] === "Leave" ? "leave" : "absent"}>
                          {record[meal] ?? "N/A"}
                        </span>
                      </div>
                    </span>
                  ))}

                  <span className="status-cell">
                    <div className={`status-badge ${record.overallStatus}`}>
                      <StatusIcon status={record.overallStatus} />
                      {record.overallStatus.charAt(0).toUpperCase() + record.overallStatus.slice(1)}
                    </div>
                  </span>

                  <span className="remarks-cell">{record.remarks || "—"}</span>
                </div>
              ))
            )}
          </div>

          <div className="records-actions">
            <button
              className="btn btn-primary"
              onClick={() => exportToCSV(filteredRecords, selectedMonth)}
              disabled={filteredRecords.length === 0}
            >
              <FontAwesomeIcon icon={faDownload} /> Export Records
            </button>
            <button className="btn btn-outline" onClick={() => window.print()}>
              <FontAwesomeIcon icon={faPrint} /> Print Report
            </button>
          </div>
        </>
      )}
    </div>
  );

  // ──────────────────────────────────────────────────────────────────────────
  // TAB: TRENDS
  // ──────────────────────────────────────────────────────────────────────────
  const renderTrendsTab = () => {
    if (isTrendsLoading) {
      return (
        <div className="loading-inline">
          <div className="spinner spinner-sm" /> Loading trend data…
        </div>
      );
    }

    if (!monthlyTrends.length) {
      return <div className="empty-state">No trend data available.</div>;
    }

    const maxPct  = Math.max(...monthlyTrends.map((t) => t?.percentage));
    const avgPct  = Math.round(
      monthlyTrends.reduce((a, c) => a + c?.percentage, 0) / monthlyTrends.length
    );
    const bestMon = monthlyTrends.find((t) => t?.percentage === maxPct);
    const delta   = monthlyTrends[monthlyTrends.length - 1]?.percentage - monthlyTrends[0]?.percentage;

    return (
      <div className="trends-tab">
        <div className="trends-header">
          <h3>Monthly Attendance Trends</h3>
          <p>Track your attendance performance over time</p>
        </div>

        <div className="trends-chart">
          <div className="chart-container">
            <div className="chart-bars">
              {monthlyTrends.map((trend, idx) => (
                <div key={idx} className="chart-bar-container">
                  <div className="chart-bar">
                    <div
                      className="bar-fill"
                      style={{ height: `${trend?.percentage}%` }}
                      title={`${trend.month}: ${trend?.percentage}%`}
                    />
                  </div>
                  <div className="chart-label">
                    <span>{trend.month}</span>
                    <strong>{trend?.percentage}%</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="trends-stats">
          <div className="trend-stat">
            <h4>Best Month</h4>
            <div className="stat-value">{maxPct}%</div>
            <span>{bestMon?.month}</span>
          </div>
          <div className="trend-stat">
            <h4>Average</h4>
            <div className="stat-value">{avgPct}%</div>
            <span>6-month average</span>
          </div>
          <div className="trend-stat">
            <h4>Trend</h4>
            <div className={`stat-value ${delta >= 0 ? "positive" : "negative"}`}>
              {delta >= 0 ? "+" : ""}{delta}%
            </div>
            <span>vs. {monthlyTrends[0]?.month}</span>
          </div>
        </div>

        <div className="performance-insights">
          <h4>Performance Insights</h4>
          <div className="insights-list">
            {avgPct >= 90 && (
              <div className="insight-item positive">
                <FontAwesomeIcon icon={faCheckCircle} />
                <div>
                  <strong>Consistent Performer</strong>
                  <p>Your attendance has been consistently above 90% for the last 6 months.</p>
                </div>
              </div>
            )}
            {avgPct < 75 && (
              <div className="insight-item warning">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                <div>
                  <strong>Below Minimum Threshold</strong>
                  <p>Your average is below the 75% minimum. Please improve your regularity.</p>
                </div>
              </div>
            )}
            <div className={`insight-item ${delta >= 0 ? "positive" : "warning"}`}>
              <FontAwesomeIcon icon={delta >= 0 ? faCheckCircle : faExclamationTriangle} />
              <div>
                <strong>{delta >= 0 ? "Improving Trend" : "Declining Trend"}</strong>
                <p>
                  {delta >= 0
                    ? `+${delta}% improvement since ${monthlyTrends[0]?.month}. Keep it up!`
                    : `${Math.abs(delta)}% decline since ${monthlyTrends[0]?.month}. Try to be more regular.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ──────────────────────────────────────────────────────────────────────────
  // TAB: RULES
  // ──────────────────────────────────────────────────────────────────────────
  const renderRulesTab = () => (
    <div className="rules-tab">
      <div className="rules-header">
        <h3>Attendance Rules &amp; Policies</h3>
        <p>Important guidelines for maintaining your attendance</p>
      </div>

      <div className="rules-categories">
        {ATTENDANCE_RULES.map((cat, idx) => (
          <div key={idx} className="rules-category">
            <h4>
              <FontAwesomeIcon icon={faExclamationTriangle} /> {cat.category}
            </h4>
            <div className="rules-list">
              {cat.rules.map((rule, ri) => (
                <div key={ri} className="rule-item">
                  <FontAwesomeIcon icon={faCheckCircle} className="rule-icon" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="important-notices">
        <div className="notice-card critical">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <div className="notice-content">
            <h5>Critical Notices</h5>
            <ul>
              <li>Attendance below 75% may lead to disciplinary action</li>
              <li>Repeated absenteeism can result in hostel suspension</li>
              <li>Fake medical certificates will lead to strict penalties</li>
              <li>Always carry your hostel ID for attendance marking</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="contact-support">
        <div className="support-card">
          <h5>Need Help with Attendance?</h5>
          <p>Report discrepancies or reach out for support:</p>
          <div className="contact-details">
            <div className="contact-item">
              <strong>Warden Office:</strong>
              <span>+92 21 1234567</span>
            </div>
            <div className="contact-item">
              <strong>Mess Incharge:</strong>
              <span>+92 300 9876543</span>
            </div>
            <div className="contact-item">
              <strong>Email:</strong>
              <span>attendance@hostel.edu.pk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="attendance-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <FontAwesomeIcon icon={faCalendarCheck} />
            Attendance Management
          </h1>
          <p>Track your mess and hostel attendance, view trends, and maintain records</p>
        </div>

        <div className="header-stats">
          {/* <div className="stat-badge">
            <FontAwesomeIcon icon={faChartLine} />
            <span>{overall?.percentage}% Overall</span>
          </div>
          <div className="stat-badge">
            <FontAwesomeIcon icon={faUtensils} />
            <span>{Breakfast?.percentage}% Breakfast</span>
          </div>
          <div className="stat-badge">
            <FontAwesomeIcon icon={faHome} />
            <span>{Dinner?.percentage}% Dinner</span>
          </div> */}
          <button
            className="btn btn-icon"
            onClick={handleRefreshAll}
            title="Refresh all attendance data"
            aria-label="Refresh all attendance data"
          >
            <FontAwesomeIcon icon={faRefresh} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="attendance-tabs">
        <div className="tabs-container">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <FontAwesomeIcon icon={tab.icon} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="attendance-content">
        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "records"  && renderRecordsTab()}
        {activeTab === "trends"   && renderTrendsTab()}
        {activeTab === "rules"    && renderRulesTab()}
      </div>
    </div>
  );
};

export default Attendance;