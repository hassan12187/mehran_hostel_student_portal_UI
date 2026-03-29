// ─── useComplaints.ts ─────────────────────────────────────────────────────────
// React Query hooks for all complaint operations.
//
// Hooks:
//   • useComplaints        — GET /student/complaints (list, cached)
//   • useComplaint         — GET /student/complaints/:id (single, cached)
//   • useCreateComplaint   — POST /student/complaints (mutation)

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  fetchComplaints,
  fetchComplaintById,
  createComplaint,
} from "./complaint.api";
import {
  Complaint,
  ComplaintListResponse,
  ComplaintQueryParams,
  CreateComplaintPayload,
} from "./complaint.types";

// ─── Query key factory ────────────────────────────────────────────────────────

export const complaintKeys = {
  all:    (token: string)                           => ["complaints", token]               as const,
  list:   (token: string, params: ComplaintQueryParams) =>
    ["complaints", token, "list", params]                                                 as const,
  detail: (token: string, id: string)               => ["complaints", token, "detail", id] as const,
};

// ─── Shared stale times ───────────────────────────────────────────────────────

const TWO_MINUTES  = 2  * 60 * 1_000;
const FIVE_MINUTES = 5  * 60 * 1_000;

// ─── 1. useComplaints ─────────────────────────────────────────────────────────
/**
 * Fetches the paginated complaint list for the authenticated student.
 * Pass `params` to filter by status / category / page on the server.
 *
 * Stale after 2 minutes so new submissions appear quickly on re-focus.
 */
export function useComplaints(
  token: string,
  params: ComplaintQueryParams = {}
): UseQueryResult<ComplaintListResponse, Error> {
  return useQuery({
    queryKey:  complaintKeys.list(token, params),
    queryFn:   ({ signal }) => fetchComplaints(token, params, signal),
    enabled:   !!token,
    staleTime: TWO_MINUTES,
    gcTime:    FIVE_MINUTES,
    retry:     2,
  });
}

// ─── 2. useComplaint (single) ─────────────────────────────────────────────────
/**
 * Fetches a single complaint by ID. Only fires when `id` is truthy.
 * Seeded from the list cache via `initialData` to avoid a loading flash
 * when navigating from the list to a detail view.
 */
export function useComplaint(
  token: string,
  id: string | null
): UseQueryResult<Complaint, Error> {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: complaintKeys.detail(token, id ?? ""),
    queryFn:  ({ signal }) => fetchComplaintById(token, id!, signal),
    enabled:  !!token && !!id,
    staleTime: FIVE_MINUTES,
    gcTime:    10 * 60 * 1_000,
    retry:     2,
    // Seed from the already-cached list so the UI never shows a spinner
    // when the user opens a complaint they just viewed in the list.
    initialData: () => {
      const lists = queryClient
        .getQueriesData<ComplaintListResponse>({ queryKey: ["complaints", token, "list"] });

      for (const [, response] of lists) {
        const found = response?.data?.find((c) => c._id === id);
        if (found) return found;
      }
      return undefined;
    },
  });
}

// ─── 3. useCreateComplaint ────────────────────────────────────────────────────
/**
 * Mutation for POST /student/complaints.
 *
 * On success:
 *   • Invalidates the full complaint list so the new item appears immediately.
 *   • Optionally accepts `onSuccess` / `onError` callbacks for toast feedback.
 */
export function useCreateComplaint(
  token: string,
  callbacks?: {
    onSuccess?: (complaint: Complaint) => void;
    onError?:   (message: string)      => void;
  }
): UseMutationResult<Complaint, Error, CreateComplaintPayload> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateComplaintPayload) => createComplaint(token, payload),

    onSuccess: (newComplaint) => {
      // Invalidate all complaint list queries for this token
      queryClient.invalidateQueries({ queryKey: complaintKeys.all(token) });
      callbacks?.onSuccess?.(newComplaint);
    },

    onError: (err: Error) => {
      callbacks?.onError?.(err.message);
    },
  });
}