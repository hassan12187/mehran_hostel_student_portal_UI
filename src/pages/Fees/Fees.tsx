// Fees.tsx — UI only; all data logic lives in Fees.queries.ts

import React, { useState } from 'react';
import './Fees.css';
import {
  useInvoicesSummaryQuery,
  useInvoicesQuery,
  useInvoiceDetailQuery,
} from './fees.queries';
import type { Invoice, TabId } from './fees.types';
import { useCustom } from '../../context/Store';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n?: number) =>
  n !== undefined ? `PKR ${n.toLocaleString('en-PK')}` : 'PKR —';

const fmtDate = (iso?: string) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-PK', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

const fmtMonth = (s?: string) => {
  if (!s) return '—';
  const [y, m] = s.split('-');
  return new Date(Number(y), Number(m) - 1).toLocaleDateString('en-PK', {
    month: 'long', year: 'numeric',
  });
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const AlertTriIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const ReceiptIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
    <rect x="6" y="14" width="12" height="8"/>
  </svg>
);
const HistoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
  </svg>
);
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const CreditCardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton: React.FC<{ w?: string; h?: string; className?: string }> = ({
  w = '100%', h = '1rem', className = '',
}) => (
  <span
    className={`f-skeleton ${className}`}
    style={{ width: w, height: h, display: 'block', borderRadius: 6 }}
    aria-hidden="true"
  />
);

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: Invoice['status'] }> = ({ status }) => {
  const map: Record<Invoice['status'], { label: string; cls: string; icon: React.ReactNode }> = {
    paid:     { label: 'Paid',     cls: 'paid',    icon: <CheckIcon /> },
    pending:  { label: 'Pending',  cls: 'pending', icon: <ClockIcon /> },
    overdue:  { label: 'Overdue',  cls: 'overdue', icon: <AlertTriIcon /> },
    partial:  { label: 'Partial',  cls: 'partial', icon: <ClockIcon /> },
  };
  const { label, cls, icon } = map[status] ?? map.pending;
  return (
    <span className={`f-badge f-badge-${cls}`}>
      {icon}{label}
    </span>
  );
};

// ─── Invoice Detail Modal ─────────────────────────────────────────────────────

const InvoiceModal: React.FC<{ id: string; onClose: () => void,token:string }> = ({ id, onClose,token }) => {
  const { data, isLoading } = useInvoiceDetailQuery(id,token);

  return (
    <div className="f-modal-backdrop" onClick={onClose}>
      <div className="f-modal" onClick={(e) => e.stopPropagation()}>
        <div className="f-modal-header">
          <div>
            <h2>Invoice Details</h2>
            {data && <p className="f-modal-sub">#{data.invoiceNo}</p>}
          </div>
          <button className="f-modal-close" onClick={onClose}><XIcon /></button>
        </div>

        {isLoading ? (
          <div className="f-modal-body">
            <Skeleton h="2rem" /><br />
            <Skeleton h="1rem" /><br />
            <Skeleton h="1rem" w="60%" />
          </div>
        ) : data ? (
          <div className="f-modal-body">
            <div className="f-modal-amount">
              <span className="f-modal-amount-label">Total Amount</span>
              <span className="f-modal-amount-value">{fmt(data.totalAmount)}</span>
            </div>

            <div className="f-modal-grid">
              <div className="f-modal-row"><span>Category</span><strong>{data.category}</strong></div>
              {data.billingMonth && <div className="f-modal-row"><span>Billing Month</span><strong>{fmtMonth(data.billingMonth)}</strong></div>}
              {data.dueDate && <div className="f-modal-row"><span>Due Date</span><strong>{fmtDate(data.dueDate)}</strong></div>}
              <div className="f-modal-row"><span>Paid</span><strong className="c-green">{fmt(data.paidAmount)}</strong></div>
              <div className="f-modal-row"><span>Balance</span><strong className="c-amber">{fmt(data.balanceDue)}</strong></div>
              <div className="f-modal-row"><span>Status</span><StatusBadge status={data.status} /></div>
              {data.paymentMethod && <div className="f-modal-row"><span>Payment Method</span><strong>{data.paymentMethod}</strong></div>}
              {data.transactionId && <div className="f-modal-row"><span>Transaction ID</span><code className="f-mono">{data.transactionId}</code></div>}
              {data.paidAt && <div className="f-modal-row"><span>Paid On</span><strong>{fmtDate(data.paidAt)}</strong></div>}
              {data.description && <div className="f-modal-row full"><span>Description</span><strong>{data.description}</strong></div>}
            </div>

            <div className="f-modal-actions">
              <button className="f-btn f-btn-ghost"><DownloadIcon /> Download Receipt</button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ─── Overview Tab ─────────────────────────────────────────────────────────────

const OverviewTab: React.FC = () => {
  const {token}=useCustom() as {token:string};
  const { data: summary, isLoading } = useInvoicesSummaryQuery(token);
  // Pending invoices for the "Upcoming Dues" section
  const { data: pendingList, isLoading: pendingLoading } = useInvoicesQuery({ status: 'pending', limit: 5 },token);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const progress = summary?.progress ?? 0;

  return (
    <div className="f-overview">
      {/* Summary cards */}
      <div className="f-summary-grid">
        {[
          {
            label: 'Total Fees',
            value: isLoading ? null : fmt(summary?.totalAmount),
            icon: <WalletIcon />,
            cls: 'total',
          },
          {
            label: 'Amount Paid',
            value: isLoading ? null : fmt(summary?.totalPaid),
            icon: <CheckIcon />,
            cls: 'paid',
          },
          {
            label: 'Balance Due',
            value: isLoading ? null : fmt(summary?.balanceDue),
            sub: summary?.nextDueDate ? `Due ${fmtDate(summary.nextDueDate)}` : undefined,
            icon: <AlertTriIcon />,
            cls: 'due',
          },
          {
            label: 'Pending Invoices',
            value: isLoading ? null : String(summary?.pendingCount ?? 0),
            icon: <ClockIcon />,
            cls: 'pending',
          },
        ].map((card) => (
          <div key={card.label} className={`f-summary-card f-summary-${card.cls}`}>
            <div className="f-summary-icon">{card.icon}</div>
            <div className="f-summary-body">
              <span className="f-summary-label">{card.label}</span>
              {card.value === null
                ? <Skeleton h="1.75rem" w="120px" />
                : <strong className="f-summary-value">{card.value}</strong>
              }
              {card.sub && <span className="f-summary-sub">{card.sub}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="f-progress-card">
        <div className="f-progress-header">
          <span>Payment Progress</span>
          {isLoading
            ? <Skeleton w="40px" h="1rem" />
            : <span className="f-progress-pct">{progress}%</span>
          }
        </div>
        <div className="f-progress-track">
          <div
            className="f-progress-fill"
            style={{ width: isLoading ? '0%' : `${progress}%` }}
          />
        </div>
        <div className="f-progress-legend">
          <span className="c-green">Paid: {isLoading ? '…' : fmt(summary?.totalPaid)}</span>
          <span className="c-amber">Due: {isLoading ? '…' : fmt(summary?.balanceDue)}</span>
        </div>
      </div>

      {/* Upcoming dues */}
      <div className="f-section">
        <h3 className="f-section-title">Upcoming Due Payments</h3>
        {pendingLoading ? (
          <div className="f-dues-list">
            {[1,2].map((i) => (
              <div key={i} className="f-due-item">
                <Skeleton h="1.2rem" w="160px" />
                <Skeleton h="1.5rem" w="100px" />
              </div>
            ))}
          </div>
        ) : pendingList && pendingList?.data?.length > 0 ? (
          <div className="f-dues-list">
            {pendingList.data.map((inv) => (
              <div key={inv._id} className="f-due-item">
                <div className="f-due-left">
                  <strong>{inv.category}</strong>
                  {inv.description && <p>{inv.description}</p>}
                  {inv.dueDate && (
                    <span className="f-due-date">
                      <CalendarIcon /> Due {fmtDate(inv.dueDate)}
                    </span>
                  )}
                </div>
                <div className="f-due-right">
                  <strong className="f-due-amount">{fmt(inv.balanceDue)}</strong>
                  <button className="f-btn f-btn-primary f-btn-sm" onClick={() => setSelectedId(inv._id)}>
                    View Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="f-empty">
            <CheckIcon />
            <p>No pending payments — you're all caught up!</p>
          </div>
        )}
      </div>

      {selectedId && (
        <InvoiceModal id={selectedId} onClose={() => setSelectedId(null)} token={token} />
      )}
    </div>
  );
};

// ─── Fee Structure Tab ────────────────────────────────────────────────────────

const FeeStructureTab: React.FC = () => {
  const [page, setPage] = useState(1);
  const {token}=useCustom() as {token:string}
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, isLoading, isFetching } = useInvoicesQuery({ page, limit: 10 },token);

  const invoices = data?.data ?? [];
  const totalPages = data?.pages ?? 1;

  return (
    <div className="f-structure">
      <div className="f-section-header">
        <div>
          <h3>Fee Structure</h3>
          <p>Detailed breakdown of all hostel charges</p>
        </div>
        {data && <span className="f-record-count">{data.total} records</span>}
      </div>

      <div className="f-table-wrap">
        <table className="f-table" aria-busy={isFetching}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Billing Month</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Due Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="f-table-skeleton-row">
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j}><Skeleton h="1rem" /></td>
                    ))}
                  </tr>
                ))
              : invoices.map((inv) => (
                  <tr key={inv._id} className={isFetching ? 'f-row-dimmed' : ''}>
                    <td><strong>{inv.category}</strong></td>
                    <td>{fmtMonth(inv.billingMonth)}</td>
                    <td>{fmt(inv.totalAmount)}</td>
                    <td className="c-green">{fmt(inv.paidAmount)}</td>
                    <td className={inv.balanceDue > 0 ? 'c-amber' : 'c-green'}>{fmt(inv.balanceDue)}</td>
                    <td>{fmtDate(inv.dueDate)}</td>
                    <td><StatusBadge status={inv.status} /></td>
                    <td>
                      <button className="f-btn f-btn-ghost f-btn-sm" onClick={() => setSelectedId(inv._id)}>
                        Details
                      </button>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="f-pagination">
          <button className="f-pag-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft />
          </button>
          <span className="f-pag-info">Page {page} of {totalPages}</span>
          <button className="f-pag-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            <ChevronRight />
          </button>
        </div>
      )}

      {selectedId && (
        <InvoiceModal id={selectedId} onClose={() => setSelectedId(null)} token={token} />
      )}
    </div>
  );
};

// ─── Payment History Tab ──────────────────────────────────────────────────────

const PaymentHistoryTab: React.FC = () => {
  const [page, setPage] = useState(1);
  const {token}=useCustom() as {token:string}
  const [billingMonth, setBillingMonth] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useInvoicesQuery({
    status: 'paid',
    billingMonth: billingMonth || undefined,
    page,
    limit: 10,
  },token);

  const invoices = data?.data ?? [];
  const totalPages = data?.pages ?? 1;

  return (
    <div className="f-history">
      <div className="f-section-header">
        <div>
          <h3>Payment History</h3>
          <p>Record of all completed transactions</p>
        </div>
        {/* Month filter */}
        <input
          type="month"
          className="f-month-filter"
          value={billingMonth}
          onChange={(e) => { setBillingMonth(e.target.value); setPage(1); }}
        />
      </div>

      {isLoading ? (
        <div className="f-history-grid">
          {[1,2,3].map((i) => (
            <div key={i} className="f-payment-card">
              <Skeleton h="1.2rem" w="160px" />
              <br />
              <Skeleton h="1rem" />
              <Skeleton h="1rem" w="80%" />
            </div>
          ))}
        </div>
      ) : invoices.length > 0 ? (
        <div className={`f-history-grid ${isFetching ? 'f-dimmed' : ''}`}>
          {invoices.map((inv) => (
            <div key={inv._id} className="f-payment-card" onClick={() => setSelectedId(inv._id)}>
              <div className="f-payment-top">
                <div>
                  <strong className="f-payment-cat">{inv.category}</strong>
                  {inv.transactionId && (
                    <span className="f-payment-txn">{inv.transactionId}</span>
                  )}
                </div>
                <StatusBadge status={inv.status} />
              </div>

              <div className="f-payment-amount">{fmt(inv.totalAmount)}</div>

              <div className="f-payment-meta">
                {inv.billingMonth && (
                  <span><CalendarIcon /> {fmtMonth(inv.billingMonth)}</span>
                )}
                {inv.paymentMethod && (
                  <span><CreditCardIcon /> {inv.paymentMethod}</span>
                )}
                {inv.paidAt && (
                  <span>Paid {fmtDate(inv.paidAt)}</span>
                )}
              </div>

              <div className="f-payment-footer">
                <button
                  className="f-btn f-btn-ghost f-btn-sm"
                  onClick={(e) => { e.stopPropagation(); setSelectedId(inv._id); }}
                >
                  <ReceiptIcon /> View Receipt
                </button>
                <button className="f-btn f-btn-ghost f-btn-sm">
                  <DownloadIcon /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="f-empty">
          <HistoryIcon />
          <p>No paid invoices found{billingMonth ? ' for this month' : ''}.</p>
          {billingMonth && (
            <button className="f-btn f-btn-ghost f-btn-sm" onClick={() => setBillingMonth('')}>
              Clear filter
            </button>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="f-pagination">
          <button className="f-pag-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft />
          </button>
          <span className="f-pag-info">Page {page} of {totalPages}</span>
          <button className="f-pag-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            <ChevronRight />
          </button>
        </div>
      )}

      {selectedId && (
        <InvoiceModal id={selectedId} onClose={() => setSelectedId(null)} token={token} />
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const Fees: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview',  label: 'Overview',        icon: <WalletIcon /> },
    { id: 'structure', label: 'Fee Structure',   icon: <ReceiptIcon /> },
    { id: 'history',   label: 'Payment History', icon: <HistoryIcon /> },
  ];

  return (
    <div className="f-page">
      <div className="f-bg-blob f-blob-1" aria-hidden="true" />
      <div className="f-bg-blob f-blob-2" aria-hidden="true" />

      {/* Header */}
      <header className="f-page-header">
        <div className="f-header-left">
          <div className="f-header-icon"><WalletIcon /></div>
          <div>
            <h1>Fees Management</h1>
            <p>Track payments, view invoices, and manage your hostel dues</p>
          </div>
        </div>
        <div className="f-header-actions">
          <button className="f-btn f-btn-primary">
            <CreditCardIcon /> Make Payment
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="f-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`f-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="f-tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="f-panel" key={activeTab}>
        {activeTab === 'overview'  && <OverviewTab />}
        {activeTab === 'structure' && <FeeStructureTab />}
        {activeTab === 'history'   && <PaymentHistoryTab />}
      </div>
    </div>
  );
};

export default Fees;