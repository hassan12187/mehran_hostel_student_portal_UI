// ─── Attendance Domain Types ──────────────────────────────────────────────────
// Mirrors the backend AttendanceService response shapes exactly.

export type MealType = "Breakfast" | "Lunch" | "Dinner";
export type AttendanceStatus = "Present" | "Absent" | "Leave";
export type AttendanceTab = "overview" | "records" | "trends" | "rules";

// ─── Single attendance record returned by GET /student/attendance ─────────────
export interface AttendanceRecord {
  _id: string;
  student: string;
  date: string; // "YYYY-MM-DD"
  mealType: MealType;
  status: AttendanceStatus;
  markedAt?: string;
  remarks?: string;
}

// ─── Paginated list response ──────────────────────────────────────────────────
export interface AttendanceListResponse {
  success: boolean;
  data: AttendanceRecord[];
  total: number;
  page: number;
  totalPages: number;
}

// ─── Summary returned by GET /student/attendance/summary ─────────────────────
export interface MealSummary {
  total: number;
  present: number;
  absent: number;
  leave: number;
  percentage: number;
}

export interface AttendanceSummaryData {
  overall: MealSummary;
  Breakfast: MealSummary;
  Lunch: MealSummary;
  Dinner: MealSummary;
  from: string;
  to: string;
}

export interface AttendanceSummaryResponse {
  success: boolean;
  data: AttendanceSummaryData;
}

// ─── UI-layer grouped record (one row per day, three meals) ──────────────────
export interface DailyAttendanceRow {
  date: string; // "YYYY-MM-DD"
  day: string;  // "Monday"
  breakfast?: AttendanceStatus;
  lunch?: AttendanceStatus;
  dinner?: AttendanceStatus;
  overallStatus: "present" | "absent" | "partial";
  remarks: string;
}

// ─── Monthly trend point ──────────────────────────────────────────────────────
export interface MonthlyTrend {
  month: string;      // "Jan 2024"
  percentage: number;
}

// ─── Query params ─────────────────────────────────────────────────────────────
export interface AttendanceQueryParams {
  date?: string;
  from?: string;
  to?: string;
  mealType?: MealType;
  status?: AttendanceStatus;
  page?: number;
  limit?: number;
}