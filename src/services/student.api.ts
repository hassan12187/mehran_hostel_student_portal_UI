// ─────────────────────────────────────────────────────────────────────────────
// student.api.ts  —  all student portal API calls + types, self-contained
// ─────────────────────────────────────────────────────────────────────────────

// ─── Re-used types ────────────────────────────────────────────────────────────
export type InvoiceStatus    = "Pending" | "Partially Paid" | "Paid" | "Overdue" | "Cancelled"
export type ComplaintStatus  = "Pending" | "In Progress" | "Resolved" | "Rejected"
export type ComplaintCat     = "electrical" | "plumbing" | "cleaning" | "furniture" | "internet" | "other"
export type ComplaintPrio    = "high" | "medium" | "low"
export type MealType         = "Breakfast" | "Lunch" | "Dinner"
export type MealStatus       = "Present" | "Absent" | "Leave"
export type SubStatus        = "Active" | "Suspended" | "Cancelled"
export type SubPlan          = "Monthly" | "Semester" | "Pay_Per_Meal"

// ─── Profile ──────────────────────────────────────────────────────────────────
export interface StudentRoom {
  _id:     string
  room_no: string
  floor?:  string
  block?:  string
  fees?:   number
}

export interface StudentProfile {
  _id:             string
  student_name:    string
  student_roll_no: string | number
  student_email:   string
  status:          string
  messEnabled:     boolean
  room_id:         StudentRoom | null
  hostelJoinDate?: string
}

// ─── Invoices ─────────────────────────────────────────────────────────────────
export interface InvoiceLineItem {
  description: string
  amount:      number
}

export interface Invoice {
  _id:           string
  invoiceNumber: string
  billingMonth:  string
  totalAmount:   number
  totalPaid:     number
  balanceDue:    number
  status:        InvoiceStatus
  dueDate:       string
  issueDate:     string
  lineItems:     InvoiceLineItem[]
  room_no?:      string
  createdAt:     string
}

export interface InvoiceSummary {
  totalInvoices:    number
  totalPaid:        number
  totalOutstanding: number
  overdueCount:     number
  lastPaymentDate:  string | null
}

// ─── Complaints ───────────────────────────────────────────────────────────────
export interface StatusHistoryEntry {
  status:     ComplaintStatus
  changed_at: string
  note?:      string
}

export interface StudentComplaint {
  _id:            string
  title:          string
  description:    string
  category:       ComplaintCat
  priority:       ComplaintPrio
  status:         ComplaintStatus
  admin_comments: string | null
  resolved_at:    string | null
  status_history: StatusHistoryEntry[]
  createdAt:      string
  updatedAt:      string
}

export interface CreateComplaintPayload {
  title:        string
  description:  string
  priority?:    ComplaintPrio
  category?:    ComplaintCat
}

// ─── Attendance ───────────────────────────────────────────────────────────────
export interface AttendanceEntry {
  _id:      string
  date:     string
  mealType: MealType
  status:   MealStatus
  markedAt: string | null
  note:     string | null
}

export interface MealAttendanceSummary {
  totalMeals:    number
  present:       number
  absent:        number
  onLeave:       number
  attendancePct: number
  byMeal: Record<MealType, { present: number; absent: number; onLeave: number }>
}

// ─── Subscription ─────────────────────────────────────────────────────────────
export interface MessSubscription {
  _id:        string
  planType:   SubPlan
  status:     SubStatus
  monthlyFee: number
  validUntil: string | null
  createdAt:  string
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface StudentDashboard {
  profile:    StudentProfile | null
  fees:       InvoiceSummary
  complaints: { pendingCount: number }
  attendance: { today: AttendanceEntry[] }
  subscription: MessSubscription | null
}

// ─── Paginated wrapper ────────────────────────────────────────────────────────
export interface Paginated<T> {
  success:    boolean
  data:       T[]
  total:      number
  page:       number
  limit:      number
  totalPages: number
}

// ─── Base URL ─────────────────────────────────────────────────────────────────
const BASE =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
  "http://localhost:8000/api"
  // process.env.NEXT_PUBLIC_API_URL ||

const EP = `${BASE}/student`

async function req<T>(url: string, token: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    ...opts,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message ?? `Request failed: ${res.status}`)
  return json as T
}

// ─── API ──────────────────────────────────────────────────────────────────────
export const StudentAPI = {

  /** GET /student/dashboard — all-in-one call for the student home page */
  getDashboard(token: string): Promise<{ success: boolean; data: StudentDashboard }> {
    return req(`${EP}/dashboard`, token)
  },

  /** GET /student/profile */
  getProfile(token: string): Promise<{ success: boolean; data: StudentProfile }> {
    return req(`${EP}/profile`, token)
  },

  // ── Invoices ────────────────────────────────────────────────────────────────

  /** GET /student/invoices/summary */
  getInvoiceSummary(token: string): Promise<{ success: boolean; data: InvoiceSummary }> {
    return req(`${EP}/invoices/summary`, token)
  },

  /** GET /student/invoices?status=&billingMonth=&page=&limit= */
  getInvoices(
    params: { status?: InvoiceStatus; billingMonth?: string; page?: number; limit?: number },
    token:  string
  ): Promise<Paginated<Invoice>> {
    const p = new URLSearchParams()
    if (params.status)       p.set("status",       params.status)
    if (params.billingMonth) p.set("billingMonth",  params.billingMonth)
    if (params.page)         p.set("page",          String(params.page))
    if (params.limit)        p.set("limit",         String(params.limit))
    return req(`${EP}/invoices?${p.toString()}`, token)
  },

  /** GET /student/invoices/:id */
  getInvoiceById(id: string, token: string): Promise<{ success: boolean; data: Invoice }> {
    return req(`${EP}/invoices/${id}`, token)
  },

  // ── Complaints ──────────────────────────────────────────────────────────────

  /** GET /student/complaints?status=&category=&page= */
  getComplaints(
    params: { status?: ComplaintStatus; category?: ComplaintCat; page?: number; limit?: number },
    token:  string
  ): Promise<Paginated<StudentComplaint>> {
    const p = new URLSearchParams()
    if (params.status)   p.set("status",   params.status)
    if (params.category) p.set("category", params.category)
    if (params.page)     p.set("page",     String(params.page))
    if (params.limit)    p.set("limit",    String(params.limit))
    return req(`${EP}/complaints?${p.toString()}`, token)
  },

  /** GET /student/complaints/:id */
  getComplaintById(
    id: string, token: string
  ): Promise<{ success: boolean; data: StudentComplaint }> {
    return req(`${EP}/complaints/${id}`, token)
  },

  /**
   * POST /student/complaints
   * The room_id is resolved server-side from the student's application.
   */
  submitComplaint(
    payload: CreateComplaintPayload,
    token:   string
  ): Promise<{ success: boolean; message: string; data: StudentComplaint }> {
    return req(`${EP}/complaints`, token, {
      method: "POST",
      body:   JSON.stringify(payload),
    })
  },

  // ── Attendance ──────────────────────────────────────────────────────────────

  /** GET /student/attendance/summary?from=&to= */
  getAttendanceSummary(
    params: { from?: string; to?: string },
    token:  string
  ): Promise<{ success: boolean; data: MealAttendanceSummary }> {
    const p = new URLSearchParams()
    if (params.from) p.set("from", params.from)
    if (params.to)   p.set("to",   params.to)
    return req(`${EP}/attendance/summary?${p.toString()}`, token)
  },

  /** GET /student/attendance?date=&mealType=&status=&page= */
  getAttendance(
    params: {
      date?: string; from?: string; to?: string
      mealType?: MealType; status?: MealStatus
      page?: number; limit?: number
    },
    token: string
  ): Promise<Paginated<AttendanceEntry>> {
    const p = new URLSearchParams()
    if (params.date)     p.set("date",     params.date)
    if (params.from)     p.set("from",     params.from)
    if (params.to)       p.set("to",       params.to)
    if (params.mealType) p.set("mealType", params.mealType)
    if (params.status)   p.set("status",   params.status)
    if (params.page)     p.set("page",     String(params.page))
    if (params.limit)    p.set("limit",    String(params.limit))
    return req(`${EP}/attendance?${p.toString()}`, token)
  },

  // ── Mess subscription ───────────────────────────────────────────────────────

  /** GET /student/subscription */
  getSubscription(
    token: string
  ): Promise<{ success: boolean; data: MessSubscription | null }> {
    return req(`${EP}/subscription`, token)
  },
}