// Profile.queries.ts — React Query hooks for the Profile feature

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProfileAPI ,type UpdateProfilePayload} from './profile.api';
import type { StudentProfile } from './profile.types';

// ── Query keys ─────────────────────────────────────────────────────────────
// Centralise keys so any component can target the same cache entry.

export const profileKeys = {
  all:    ['profile']            as const,
  detail: () => ['profile', 'detail'] as const,
};

// ── useProfileQuery ────────────────────────────────────────────────────────

/**
 * Fetches the student's own profile.
 * Automatically retries once on network errors; stale after 5 minutes.
 */
export const useProfileQuery = (token:string) =>
  useQuery<StudentProfile, Error>({
    queryKey: profileKeys.detail(),
    queryFn:  ()=>ProfileAPI.fetchProfile(token).then((r)=>r.data),
    staleTime: 5 * 60 * 1000, // 5 min
    retry: 1,
  });

// ── useUpdateProfileMutation ───────────────────────────────────────────────

/**
 * PATCHes editable profile fields.
 * On success: optimistically updates the cache immediately, then invalidates
 * so a background refetch keeps the data fresh.
 */
export const useUpdateProfileMutation = (token:string,data:UpdateProfilePayload) => {
  const queryClient = useQueryClient();

  return useMutation<StudentProfile, Error, UpdateProfilePayload>({
    mutationFn: ()=>ProfileAPI.updateProfile(token,data).then(r=>r.data),

    // Optimistic update — show new data instantly while the request is in-flight
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: profileKeys.detail() });

      const previous = queryClient.getQueryData<StudentProfile>(profileKeys.detail());

      queryClient.setQueryData<StudentProfile>(profileKeys.detail(), (old) =>
        old ? { ...old, ...payload } : old,
      );

      // Return context so onError can roll back
      return { previous };
    },

    onError: (_err, _payload, context) => {
      const ctx = context as { previous?: StudentProfile } | undefined;
      if (ctx?.previous) {
        queryClient.setQueryData(profileKeys.detail(), ctx.previous);
      }
    },

    onSettled: () => {
      // Always refetch to ensure server-truth
      queryClient.invalidateQueries({ queryKey: profileKeys.detail() });
    },
  });
};