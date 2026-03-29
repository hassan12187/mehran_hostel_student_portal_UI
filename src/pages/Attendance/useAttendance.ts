// ─── useAttendance.ts ─────────────────────────────────────────────────────────
// React Query hooks for all attendance data.
//
// Three focused hooks (composable, individually cacheable):
//   • useAttendanceSummary  — GET /student/attendance/summary
//   • useAttendanceRecords  — GET /student/attendance (paginated by month)
//   • useAttendanceTrends   — parallel summary calls for last N months
//
// One convenience hook:
//   • useAttendance         — composes all three + derives DailyAttendanceRow[]

import { useQuery, useQueries, UseQueryResult } from "@tanstack/react-query";
import {
  fetchAttendanceSummary,
  fetchAttendanceRecords,
  fetchAttendanceTrends,
  monthToRange,
  lastNMonths,
  formatYearMonth,
} from "./Attendance.api";
import {
  AttendanceSummaryData,
  AttendanceRecord,
  DailyAttendanceRow,
  MonthlyTrend,
  AttendanceStatus,
} from "./Attendance.types";

// ─── Query key factory (centralised, avoids magic strings) ────────────────────
export const attendanceKeys = {
  all:     (token: string)                          => ["attendance", token]          as const,
  summary: (token: string, from?: string, to?: string) =>
    ["attendance", token, "summary", from, to]                                        as const,
  records: (token: string, month: string)           =>
    ["attendance", token, "records", month]                                           as const,
  trends:  (token: string, months: number)          =>
    ["attendance", token, "trends", months]                                           as const,
};

// ─── Shared stale / gc times ──────────────────────────────────────────────────
const FIVE_MINUTES  = 5  * 60 * 1_000;
const TEN_MINUTES   = 10 * 60 * 1_000;
const TREND_MONTHS  = 6;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

/**
 * Groups flat per-meal AttendanceRecord[] into per-day DailyAttendanceRow[].
 */
function groupByDay(records: AttendanceRecord[]): DailyAttendanceRow[] {
  const map = new Map<string, DailyAttendanceRow>();

  for (const rec of records) {
    if (!map.has(rec.date)) {
      const dateObj = new Date(`${rec.date}T00:00:00`);
      map.set(rec.date, {
        date:          rec.date,
        day:           DAYS[dateObj.getDay()],
        overallStatus: "absent",
        remarks:       "",
      });
    }

    const row = map.get(rec.date)!;
    if (rec.mealType === "Breakfast") row.breakfast = rec.status;
    if (rec.mealType === "Lunch")     row.lunch      = rec.status;
    if (rec.mealType === "Dinner")    row.dinner     = rec.status;
    if (rec.remarks)                  row.remarks    = rec.remarks;
  }

  // Derive overall status from present meal slots
  for (const row of map.values()) {
    const slots   = [row.breakfast, row.lunch, row.dinner].filter(Boolean) as AttendanceStatus[];
    const present = slots.filter((s) => s === "Present").length;

    row.overallStatus =
      slots.length === 0 || present === 0 ? "absent"
      : present === slots.length           ? "present"
      :                                      "partial";
  }

  // Sort newest → oldest
  return Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date));
}

// ─── 1. useAttendanceSummary ──────────────────────────────────────────────────
/**
 * Fetches GET /student/attendance/summary for a given date range.
 * Cached for 5 minutes; re-fetches on window focus.
 */
export function useAttendanceSummary(
  token:  string,
  from?:  string,
  to?:    string
): UseQueryResult<AttendanceSummaryData, Error> {
  return useQuery({
    queryKey:  attendanceKeys.summary(token, from, to),
    queryFn:   () => fetchAttendanceSummary(token, from, to),
    enabled:   !!token,
    staleTime: FIVE_MINUTES,
    gcTime:    TEN_MINUTES,
    retry:     2,
  });
}

// ─── 2. useAttendanceRecords ──────────────────────────────────────────────────
/**
 * Fetches GET /student/attendance for a "YYYY-MM" month string.
 * Returns raw records AND the derived DailyAttendanceRow[].
 * Cached per month — switching months never re-fetches a previously loaded one.
 */
export function useAttendanceRecords(
  token:        string,
  selectedMonth: string
): UseQueryResult<AttendanceRecord[], Error> & { rows: DailyAttendanceRow[] } {
  const { from, to } = monthToRange(selectedMonth);

  const query = useQuery({
    queryKey:  attendanceKeys.records(token, selectedMonth),
    queryFn:   ({ signal }) => fetchAttendanceRecords(token, from, to, signal),
    enabled:   !!token && !!selectedMonth,
    staleTime: FIVE_MINUTES,
    gcTime:    TEN_MINUTES,
    retry:     2,
  });

  return {
    ...query,
    rows: query.data ? groupByDay(query.data) : [],
  };
}

// ─── 3. useAttendanceTrends ───────────────────────────────────────────────────
/**
 * Fires N parallel summary queries (one per month) via useQueries.
 * Each month is independently cached — only missing months are fetched.
 * Returns a stable MonthlyTrend[] array once all queries settle.
 */
export function useAttendanceTrends(
  token:       string,
  trendMonths: number = TREND_MONTHS
): { trends: MonthlyTrend[]; isLoading: boolean; isError: boolean } {
  const months = lastNMonths(trendMonths);

  const results = useQueries({
    queries: months.map((ym) => {
      const { from, to } = monthToRange(ym);
      return {
        queryKey:  attendanceKeys.summary(token, from, to),
        queryFn:   () => fetchAttendanceSummary(token, from, to),
        enabled:   !!token,
        staleTime: TEN_MINUTES,
        gcTime:    20 * 60 * 1_000,
        retry:     1,
      };
    }),
  });

  const isLoading = results.some((r) => r.isLoading);
  const isError   = results.every((r) => r.isError);   // only "error" if ALL fail

  const trends: MonthlyTrend[] = results.map((r, i) => ({
    month:      formatYearMonth(months[i]),
    percentage: r.data?.overall?.percentage ?? 0,
  }));

  return { trends, isLoading, isError };
}

// ─── 4. useAttendance (convenience facade) ────────────────────────────────────
/**
 * Composes all three hooks. This is the only import the Attendance page needs.
 *
 * @param selectedMonth  "YYYY-MM" — drives the records table + summary range
 * @param token          JWT from auth context
 */
export function useAttendance(selectedMonth: string, token: string) {
  const { from, to } = monthToRange(selectedMonth);

  const summaryQuery  = useAttendanceSummary(token, from, to);
  const recordsQuery  = useAttendanceRecords(token, selectedMonth);
  const trendsResult  = useAttendanceTrends(token);

  return {
    // Summary
    summaryData:       summaryQuery.data   ?? null,
    isSummaryLoading:  summaryQuery.isLoading,
    isSummaryError:    summaryQuery.isError,
    summaryError:      summaryQuery.error?.message ?? null,

    // Records
    records:           recordsQuery.rows,
    rawRecords:        recordsQuery.data   ?? [],
    isFetchingRecords: recordsQuery.isFetching,
    isRecordsError:    recordsQuery.isError,

    // Trends
    monthlyTrends:     trendsResult.trends,
    isTrendsLoading:   trendsResult.isLoading,

    // Aggregate helpers
    isLoading:  summaryQuery.isLoading,
    isError:    summaryQuery.isError,
    error:      summaryQuery.error?.message ?? null,

    // Invalidate all attendance cache (e.g. after a manual refresh)
    refetchSummary: summaryQuery.refetch,
    refetchRecords: recordsQuery.refetch,
  };
}