// Fees.types.ts — shared TypeScript types for the Fees feature

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'partial';
export type TabId = 'overview' | 'structure' | 'history';

// ── GET /api/student/invoices/summary ─────────────────────────────────────────

export interface InvoicesSummary {
  totalAmount:  number;
  totalPaid:    number;
  balanceDue:   number;
  progress:     number;          // 0-100 percentage
  overdueCount: number;
  pendingCount: number;
  lastPaymentDate?: string;
  nextDueDate?: string;
}

// ── GET /api/student/invoices ─────────────────────────────────────────────────

export interface Invoice {
  _id:          string;
  invoiceNo:    string;
  category:     string;
  description?: string;
  totalAmount:  number;
  paidAmount:   number;
  balanceDue:   number;
  billingMonth?: string;         // "2024-03"
  dueDate?:     string;          // ISO date
  status:       InvoiceStatus;
  paymentMethod?: string;
  transactionId?: string;
  paidAt?:      string;          // ISO date
  createdAt:    string;
}

export interface InvoicesListResponse {
  data:  Invoice[];
  total: number;
  page:  number;
  limit: number;
  pages: number;
}

export interface InvoicesListParams {
  status?:       string;
  billingMonth?: string;
  page?:         number;
  limit?:        number;
}