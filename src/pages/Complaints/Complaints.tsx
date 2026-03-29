import React, { useMemo, useState } from "react";
import "./Complaints.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faPlus,
  faSearch,
  faClock,
  faCheckCircle,
  faExclamationTriangle,
  faTools,
  faBolt,
  faTint,
  faTrash,
  faWifi,
  faEye,
  faPaperPlane,
  faRefresh,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import { useComplaints, useCreateComplaint, complaintKeys } from "./useComplaints";
import { useCustom } from "../../context/Store";
import {
  Complaint,
  ComplaintCategory,
  ComplaintFormState,
  ComplaintPriority,
  ComplaintStatus,
  ComplaintTab,
  RoomRef,
} from "./complaint.types";
import { useQueryClient } from "@tanstack/react-query";

// ─── Static config ────────────────────────────────────────────────────────────

interface CategoryConfig {
  id: ComplaintCategory;
  name: string;
  icon: IconDefinition;
  color: string;
}

interface StatusConfig {
  label: string;
  icon: IconDefinition;
  color: string;
  bgColor: string;
}

const COMPLAINT_CATEGORIES: CategoryConfig[] = [
  { id: "electrical", name: "Electrical", icon: faBolt,        color: "#f59e0b" },
  { id: "plumbing",   name: "Plumbing",   icon: faTint,        color: "#3b82f6" },
  { id: "cleaning",   name: "Cleaning",   icon: faTrash,       color: "#10b981" },
  { id: "internet",   name: "Internet",   icon: faWifi,        color: "#8b5cf6" },
  { id: "furniture",  name: "Furniture",  icon: faTools,       color: "#ef4444" },
  { id: "other",      name: "Other",      icon: faCommentDots, color: "#6b7280" },
];

const STATUS_CONFIG: Record<string, StatusConfig> = {
  Pending:     { label: "Pending",     icon: faClock,             color: "#f59e0b", bgColor: "#fef3c7" },
  "In Progress":{ label: "In Progress", icon: faTools,            color: "#3b82f6", bgColor: "#dbeafe" },
  Resolved:    { label: "Resolved",    icon: faCheckCircle,       color: "#10b981", bgColor: "#d1fae5" },
  Rejected:    { label: "Rejected",    icon: faExclamationTriangle,color: "#ef4444", bgColor: "#fef2f2" },
};

const PRIORITY_COLOR: Record<ComplaintPriority, string> = {
  high:   "#ef4444",
  medium: "#f59e0b",
  low:    "#10b981",
};

const EMPTY_FORM: ComplaintFormState = {
  title:       "",
  description: "",
  category:    "",
  priority:    "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategoryConfig(id: ComplaintCategory): CategoryConfig {
  return COMPLAINT_CATEGORIES.find((c) => c.id === id) ?? COMPLAINT_CATEGORIES[5];
}

function getStatusConfig(status: string): StatusConfig {
  return STATUS_CONFIG[status] ?? STATUS_CONFIG["Pending"];
}

function getRoomNo(room: Complaint["room_id"]): string {
  if (!room) return "N/A";
  if (typeof room === "string") return room;
  return (room as RoomRef).room_no ?? "N/A";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PK", {
    day:   "2-digit",
    month: "short",
    year:  "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ComplaintCardProps {
  complaint: Complaint;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint }) => {
  const statusInfo   = getStatusConfig(complaint.status);
  const categoryInfo = getCategoryConfig(complaint.category);

  return (
    <div className="complaint-card">
      <div className="complaint-header">
        <div className="complaint-title-section">
          <div className="category-badge" style={{ backgroundColor: categoryInfo.color }}>
            <FontAwesomeIcon icon={categoryInfo.icon} />
            <span>{categoryInfo.name}</span>
          </div>
          <h3>{complaint.title}</h3>
        </div>
        <div
          className={`status-badge ${complaint.status.replace(" ", "-").toLowerCase()}`}
          style={{ backgroundColor: statusInfo.bgColor, color: statusInfo.color }}
        >
          <FontAwesomeIcon icon={statusInfo.icon} />
          <span>{statusInfo.label}</span>
        </div>
      </div>

      <div className="complaint-body">
        <p className="complaint-description">{complaint.description}</p>

        <div className="complaint-details">
          <div className="detail-item">
            <strong>Room:</strong>
            <span>{getRoomNo(complaint.room_id)}</span>
          </div>
          <div className="detail-item">
            <strong>Date:</strong>
            <span>{formatDate(complaint.createdAt)}</span>
          </div>
          <div className="detail-item">
            <strong>Priority:</strong>
            <span
              className="priority-badge"
              style={{ color: PRIORITY_COLOR[complaint.priority] }}
            >
              ● {complaint.priority.toUpperCase()}
            </span>
          </div>
          {complaint.assignedTo && (
            <div className="detail-item">
              <strong>Assigned To:</strong>
              <span>{complaint.assignedTo}</span>
            </div>
          )}
        </div>

        {complaint?.comments?.length > 0 && (
          <div className="complaint-comments">
            <div className="comments-header">
              <strong>Latest Update:</strong>
              {complaint.lastUpdate && (
                <span>{formatDate(complaint.lastUpdate)}</span>
              )}
            </div>
            {complaint.comments.slice(-1).map((comment) => (
              <div key={comment._id} className="comment">
                <strong>{comment.user}:</strong>
                <p>{comment.message}</p>
                <span className="comment-time">
                  {new Date(comment.timestamp).toLocaleString("en-PK")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="complaint-actions">
        <button className="action-btn outline">
          <FontAwesomeIcon icon={faEye} />
          View Details
        </button>
      </div>
    </div>
  );
};

// ─── Complaint Form Modal ─────────────────────────────────────────────────────

interface ComplaintFormProps {
  onClose:  () => void;
  onSubmit: (form: ComplaintFormState) => void;
  isSubmitting: boolean;
  submitError:  string | null;
}

const ComplaintFormModal: React.FC<ComplaintFormProps> = ({
  onClose,
  onSubmit,
  isSubmitting,
  submitError,
}) => {
  const [form, setForm] = useState<ComplaintFormState>(EMPTY_FORM);

  const handleChange = (
    field: keyof ComplaintFormState,
    value: string
  ) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="modal-title">Create New Complaint</h2>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="complaint-form" noValidate>
          {submitError && (
            <div className="form-error-banner" role="alert">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              {submitError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="complaint-title">Complaint Title *</label>
            <input
              id="complaint-title"
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Brief description of the issue"
              minLength={5}
              maxLength={150}
              required
              className="form-input"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="complaint-category">Category *</label>
              <select
                id="complaint-category"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                required
                className="form-input"
                disabled={isSubmitting}
              >
                <option value="">Select Category</option>
                {COMPLAINT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="complaint-priority">Priority *</label>
              <select
                id="complaint-priority"
                value={form.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                required
                className="form-input"
                disabled={isSubmitting}
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="complaint-description">Detailed Description *</label>
            <textarea
              id="complaint-description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Please provide detailed information about the issue…"
              minLength={10}
              maxLength={2000}
              required
              rows={5}
              className="form-input textarea"
              disabled={isSubmitting}
            />
            <span className="char-count">{form.description.length}/2000</span>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Submitting…
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPaperPlane} />
                  Submit Complaint
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const Complaints: React.FC = () => {
  const [activeTab,         setActiveTab]         = useState<ComplaintTab>("all");
  const [searchTerm,        setSearchTerm]        = useState<string>("");
  const [showForm,          setShowForm]          = useState<boolean>(false);
  const [submitError,       setSubmitError]       = useState<string | null>(null);

  const { token } = useCustom() as { token: string };
  const queryClient = useQueryClient();

  // ── Data fetching ───────────────────────────────────────────────────────────
  const {
    data: complaintsResponse,
    isLoading,
    isError,
    error,
    isFetching,
  } = useComplaints(token, { sortOrder: "desc", limit: 50 });

  const allComplaints: Complaint[] = complaintsResponse?.data ?? [];

  // ── Mutation ────────────────────────────────────────────────────────────────
  const createMutation = useCreateComplaint(token, {
    onSuccess: () => {
      setShowForm(false);
      setSubmitError(null);
    },
    onError: (msg) => setSubmitError(msg),
  });

  // ── Client-side filtering (avoids re-fetches for tab/search changes) ────────
  const filteredComplaints = useMemo(() => {
    const needle = searchTerm.toLowerCase();
    return allComplaints.filter((c) => {
      const matchesTab =
        activeTab === "all" || c.status === activeTab;
      const matchesSearch =
        !needle ||
        c.title.toLowerCase().includes(needle) ||
        c.description.toLowerCase().includes(needle);
      return matchesTab && matchesSearch;
    });
  }, [allComplaints, activeTab, searchTerm]);

  // ── Tab counts from live data ───────────────────────────────────────────────
  const counts = useMemo(
    () => ({
      all:         allComplaints.length,
      Pending:     allComplaints.filter((c) => c.status === "Pending").length,
      "In Progress": allComplaints.filter((c) => c.status === "In Progress").length,
      Resolved:    allComplaints.filter((c) => c.status === "Resolved").length,
    }),
    [allComplaints]
  );

  const TABS: { id: ComplaintTab; label: string }[] = [
    { id: "all",         label: "All Complaints" },
    { id: "Pending",     label: "Pending"        },
    { id: "In Progress", label: "In Progress"    },
    { id: "Resolved",    label: "Resolved"       },
  ];

  // ── Form submit handler ─────────────────────────────────────────────────────
  const handleFormSubmit = (form: ComplaintFormState) => {
    setSubmitError(null);
    createMutation.mutate({
      title:       form.title,
      description: form.description,
      ...(form.priority && { priority: form.priority as ComplaintPriority }),
      ...(form.category && { category: form.category as ComplaintCategory }),
    });
  };

  // ── Global refresh ──────────────────────────────────────────────────────────
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: complaintKeys.all(token) });
  };

  // ── Loading / Error states ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="complaints-page">
        <div className="loading-state">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          <p>Loading complaints…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="complaints-page">
        <div className="error-state">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <p>{error?.message ?? "Unable to load complaints."}</p>
          <button className="btn btn-primary" onClick={handleRefresh}>
            <FontAwesomeIcon icon={faRefresh} /> Retry
          </button>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="complaints-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <FontAwesomeIcon icon={faCommentDots} />
            Complaints Management
          </h1>
          <p>Report issues, track complaints, and get updates on maintenance requests</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-icon"
            onClick={handleRefresh}
            disabled={isFetching}
            title="Refresh complaints"
            aria-label="Refresh complaints"
          >
            <FontAwesomeIcon icon={faRefresh} spin={isFetching} />
          </button>
          <button
            className="btn btn-primary"
            onClick={() => { setSubmitError(null); setShowForm(true); }}
          >
            <FontAwesomeIcon icon={faPlus} />
            New Complaint
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stats-grid">
          {[
            { label: "Pending",     count: counts["Pending"],      icon: faClock,        cls: "pending"     },
            { label: "In Progress", count: counts["In Progress"],  icon: faTools,        cls: "inProgress"  },
            { label: "Resolved",    count: counts["Resolved"],     icon: faCheckCircle,  cls: "resolved"    },
            { label: "Total",       count: counts["all"],          icon: faCommentDots,  cls: "total"       },
          ].map(({ label, count, icon, cls }) => (
            <div key={cls} className="stat-card">
              <div className={`stat-icon ${cls}`}>
                <FontAwesomeIcon icon={icon} />
              </div>
              <div className="stat-content">
                <h3>{count}</h3>
                <p>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="controls-bar">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search complaints…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Search complaints"
          />
        </div>

        <div className="filter-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span className="tab-count">{counts[tab.id as keyof typeof counts] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Complaints List */}
      <div className="complaints-content">
        {filteredComplaints.length > 0 ? (
          <div className="complaints-grid">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard key={complaint._id} complaint={complaint} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FontAwesomeIcon icon={faCommentDots} className="empty-icon" />
            <h4>No Complaints Found</h4>
            <p>
              {searchTerm
                ? "Try adjusting your search terms."
                : "No complaints to display for this category."}
            </p>
            {!searchTerm && (
              <button
                className="btn btn-primary"
                onClick={() => { setSubmitError(null); setShowForm(true); }}
              >
                <FontAwesomeIcon icon={faPlus} />
                Create Your First Complaint
              </button>
            )}
          </div>
        )}
      </div>

      {/* New Complaint Modal */}
      {showForm && (
        <ComplaintFormModal
          onClose={() => { setShowForm(false); setSubmitError(null); }}
          onSubmit={handleFormSubmit}
          isSubmitting={createMutation.isPending}
          submitError={submitError}
        />
      )}
    </div>
  );
};

export default Complaints;