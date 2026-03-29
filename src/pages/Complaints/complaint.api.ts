// ─── complaint.api.ts ─────────────────────────────────────────────────────────
// Pure fetch functions — no React dependency, fully unit-testable.

import {
  Complaint,
  ComplaintListResponse,
  ComplaintDetailResponse,
  ComplaintCreateResponse,
  ComplaintQueryParams,
  CreateComplaintPayload,
} from "./complaint.types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

// ─── Shared fetch wrapper ─────────────────────────────────────────────────────

async function apiFetch<T>(
  url: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── GET /api/student/complaints ─────────────────────────────────────────────

export async function fetchComplaints(
  token: string,
  params: ComplaintQueryParams = {},
  signal?: AbortSignal
): Promise<ComplaintListResponse> {
  const qs = new URLSearchParams();
  if (params.status)    qs.set("status",    params.status);
  if (params.category)  qs.set("category",  params.category);
  if (params.sortOrder) qs.set("sortOrder", params.sortOrder);
  qs.set("page",  String(params.page  ?? 1));
  qs.set("limit", String(params.limit ?? 50)); // fetch all for client-side filter

  return apiFetch<ComplaintListResponse>(
    `/student/complaints?${qs.toString()}`,
    token,
    { signal }
  );
}

// ─── GET /api/student/complaints/:id ─────────────────────────────────────────

export async function fetchComplaintById(
  token: string,
  id: string,
  signal?: AbortSignal
): Promise<Complaint> {
  const res = await apiFetch<ComplaintDetailResponse>(
    `/student/complaints/${id}`,
    token,
    { signal }
  );
  return res.data;
}

// ─── POST /api/student/complaints ────────────────────────────────────────────

export async function createComplaint(
  token: string,
  payload: CreateComplaintPayload
): Promise<Complaint> {
  const res = await apiFetch<ComplaintCreateResponse>(
    "/student/complaints",
    token,
    {
      method: "POST",
      body:   JSON.stringify(payload),
    }
  );
  return res.data;
}