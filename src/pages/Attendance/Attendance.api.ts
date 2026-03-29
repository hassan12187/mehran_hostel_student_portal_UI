// ─── attendance.api.ts ────────────────────────────────────────────────────────
// Pure fetch functions consumed by React Query hooks.
// No React imports — fully testable in isolation.

import {
  AttendanceSummaryData,
  AttendanceSummaryResponse,
  AttendanceListResponse,
  AttendanceRecord,
  MonthlyTrend,
} from "./Attendance.types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

// ─── Shared fetch wrapper ─────────────────────────────────────────────────────

async function apiFetch<T>(url: string, token: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Date utilities ───────────────────────────────────────────────────────────

/**
 * "2024-01" → { from: "2024-01-01", to: "2024-01-31" }
 */
export function monthToRange(yearMonth: string): { from: string; to: string } {
  const [year, month] = yearMonth.split("-").map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  return {
    from: `${yearMonth}-01`,
    to:   `${yearMonth}-${String(lastDay).padStart(2, "0")}`,
  };
}

/**
 * Returns the last `n` months as "YYYY-MM" strings, oldest first.
 */
export function lastNMonths(n: number): string[] {
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
}

/**
 * "2024-01" → "Jan 2024"
 */
export function formatYearMonth(ym: string): string {
  const [year, month] = ym.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "short",
    year:  "numeric",
  });
}

// ─── API calls ────────────────────────────────────────────────────────────────

/**
 * GET /api/student/attendance/summary?from=&to=
 */
export async function fetchAttendanceSummary(
  token: string,
  from?: string,
  to?:   string
): Promise<AttendanceSummaryData> {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to)   params.set("to",   to);

  const qs = params.toString() ? `?${params.toString()}` : "";
  const json = await apiFetch<AttendanceSummaryResponse>(
    `/student/attendance/summary${qs}`,
    token
  );
  return json.data;
}

/**
 * GET /api/student/attendance?from=&to=&limit=100
 * Always fetches up to 100 records per month (backend max is 100).
 */
export async function fetchAttendanceRecords(
  token:  string,
  from:   string,
  to:     string,
  signal?: AbortSignal
): Promise<AttendanceRecord[]> {
  const params = new URLSearchParams({ from, to, limit: "100" });
  const json = await apiFetch<AttendanceListResponse>(
    `/student/attendance?${params.toString()}`,
    token,
    signal
  );
  return json.data;
}

/**
 * Fetches summaries for the last TREND_MONTHS months in parallel and
 * returns an array of { month, percentage } trend points.
 * Individual month failures resolve to 0% so the chart always renders.
 */
export async function fetchAttendanceTrends(
  token: string,
  trendMonths = 6
): Promise<MonthlyTrend[]> {
  const months = lastNMonths(trendMonths);

  const settled = await Promise.allSettled(
    months.map(async (ym) => {
      const { from, to } = monthToRange(ym);
      const summary = await fetchAttendanceSummary(token, from, to);
      return { month: formatYearMonth(ym), percentage: summary.overall.percentage };
    })
  );

  return settled.map((result, i) =>
    result.status === "fulfilled"
      ? result.value
      : { month: formatYearMonth(months[i]), percentage: 0 }
  );
}