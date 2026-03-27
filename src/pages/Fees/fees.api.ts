// Fees.api.ts — all fetch calls for the Fees feature

import type {
  InvoicesSummary,
  InvoicesListResponse,
  InvoicesListParams,
  Invoice,
} from './fees.types';

// ── helpers ────────────────────────────────────────────────────────────────────

// const getToken = (): string => localStorage.getItem('token') ?? '';



async function handleResponse<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { message?: string }).message ?? `HTTP ${res.status}`);
  }
  return body as T;
}

// ── GET /api/student/invoices/summary ─────────────────────────────────────────

export const fetchInvoicesSummary = async (token:string): Promise<InvoicesSummary> => {
  const res = await fetch('/api/student/invoices/summary', {
    headers: {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
},
  });
  const json = await handleResponse<{ success: boolean; data: InvoicesSummary }>(res);
  return json.data;
};

// ── GET /api/student/invoices ─────────────────────────────────────────────────

export const fetchInvoices = async (
    token:string,
  params: InvoicesListParams = {},
): Promise<InvoicesListResponse> => {
  const qs = new URLSearchParams();
  if (params.status)       qs.set('status',       params.status);
  if (params.billingMonth) qs.set('billingMonth',  params.billingMonth);
  if (params.page)         qs.set('page',          String(params.page));
  if (params.limit)        qs.set('limit',         String(params.limit));

  const res = await fetch(`/api/student/invoices?${qs.toString()}`, {
    headers: {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
},
  });
  const json = await handleResponse<{ success: boolean } & InvoicesListResponse>(res);
  const { success: _s, ...rest } = json;
  return rest as InvoicesListResponse;
};

// ── GET /api/student/invoices/:id ─────────────────────────────────────────────

export const fetchInvoiceById = async (token:string,id: string): Promise<Invoice> => {
  const res = await fetch(`/api/student/invoices/${id}`, {
    headers: {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
},
  });
  const json = await handleResponse<{ success: boolean; data: Invoice }>(res);
  return json.data;
};