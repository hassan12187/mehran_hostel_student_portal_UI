// ─── Complaint Domain Types ───────────────────────────────────────────────────
// Mirrors the backend ComplaintService response shapes exactly.

export type ComplaintCategory =
  | "electrical"
  | "plumbing"
  | "cleaning"
  | "furniture"
  | "internet"
  | "other";

export type ComplaintPriority = "high" | "medium" | "low";

export type ComplaintStatus = "Pending" | "In Progress" | "Resolved" | "Rejected";

export type SortOrder = "asc" | "desc";

// ─── Nested shapes ────────────────────────────────────────────────────────────

export interface RoomRef {
  _id: string;
  room_no: string;
  floor?: string;
  block?: string;
}

export interface StudentRef {
  _id: string;
  student_name?: string;
  student_roll_no?: string;
}

export interface ComplaintComment {
  _id: string;
  user: string;
  message: string;
  timestamp: string; // ISO string
}

// ─── Core complaint document ──────────────────────────────────────────────────

export interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  student_id: StudentRef | string;
  room_id: RoomRef | string;
  assignedTo?: string;
  lastUpdate?: string;     // ISO string
  comments: ComplaintComment[];
  createdAt: string;       // ISO string
  updatedAt: string;       // ISO string
}

// ─── API response shapes ──────────────────────────────────────────────────────

export interface ComplaintListResponse {
  success: boolean;
  data: Complaint[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ComplaintDetailResponse {
  success: boolean;
  data: Complaint;
}

export interface ComplaintCreateResponse {
  success: boolean;
  message: string;
  data: Complaint;
}

// ─── Query params for GET /complaints ────────────────────────────────────────

export interface ComplaintQueryParams {
  status?: ComplaintStatus;
  category?: ComplaintCategory;
  page?: number;
  limit?: number;
  sortOrder?: SortOrder;
}

// ─── Form state for creating a complaint ─────────────────────────────────────

export interface ComplaintFormState {
  title: string;
  description: string;
  category: ComplaintCategory | "";
  priority: ComplaintPriority | "";
}

// ─── Create payload (matches backend Zod schema exactly) ─────────────────────

export interface CreateComplaintPayload {
  title: string;
  description: string;
  priority?: ComplaintPriority;
  category?: ComplaintCategory;
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export type ComplaintTab = "all" | ComplaintStatus;