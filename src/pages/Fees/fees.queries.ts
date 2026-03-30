// Fees.queries.ts — React Query hooks for the Fees feature

import { useQuery } from '@tanstack/react-query';
import { fetchInvoicesSummary, fetchInvoices, fetchInvoiceById } from './fees.api';
import type { InvoicesListParams } from './fees.types';

// ── Query keys ─────────────────────────────────────────────────────────────────

export const feesKeys = {
  all:      ['invoices'] as const,
  summary:  () => ['invoices', 'summary']  as const,
  list:     (p: InvoicesListParams) => ['invoices', 'list', p] as const,
  detail:   (id: string)        => ['invoices', 'detail', id] as const,
};

// ── useInvoicesSummaryQuery ────────────────────────────────────────────────────

/**
 * Fetches the fee summary card data.
 * Used by the Overview tab.
 */
export const useInvoicesSummaryQuery = (token:string) =>
  useQuery({
    queryKey: feesKeys.summary(),
    queryFn:  ()=>fetchInvoicesSummary(token).then((r)=>r),
    staleTime: 2 * 60 * 1000, // 2 min
    retry: 1,
  });

// ── useInvoicesQuery ───────────────────────────────────────────────────────────

/**
 * Fetches a paginated & filterable list of invoices.
 * Used by the Fee Structure tab (all) and Payment History tab (status=paid).
 */
export const useInvoicesQuery = (params: InvoicesListParams = {},token:string) =>
  useQuery({
    queryKey: feesKeys.list(params),
    queryFn:  () => fetchInvoices(token,params).then((r)=>r),
    staleTime: 2 * 60 * 1000,
    retry: 1,
    placeholderData: (prev) => prev, // keep previous data while fetching new page
  });

// ── useInvoiceDetailQuery ──────────────────────────────────────────────────────

/**
 * Fetches a single invoice by id.
 * Enabled only when id is a non-empty string.
 */
export const useInvoiceDetailQuery = (id: string,token:string) =>
  useQuery({
    queryKey: feesKeys.detail(id),
    queryFn:  () => fetchInvoiceById(token,id).then((r)=>r),
    enabled:  Boolean(id),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });