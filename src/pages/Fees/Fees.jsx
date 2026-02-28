import React, { useState } from 'react';
import './Fees.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMoneyBillWave,
  faReceipt,
  faCalendarAlt,
  faCreditCard,
  faDownload,
  faPrint,
  faHistory,
  faExclamationTriangle,
  faCheckCircle,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import useGetQuery from '../../hooks/useGetQuery';
import { useCustom } from '../../context/Store';

const Fees = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const {token}=useCustom();

  const {data}=useGetQuery("fee","/api/student/fees",token);
  console.log(data)
  // Fees Data
  const feesData = {
    overview: {
      totalFees: 125000,
      paidAmount: 85000,
      dueAmount: 40000,
      dueDate: "2024-03-15",
      currency: "PKR",
      paymentProgress: 68
    },
    feeStructure: [
      {
        id: 1,
        category: "Hostel Charges",
        amount: 45000,
        dueDate: "2024-01-15",
        status: "paid",
        description: "Semester hostel accommodation charges"
      },
      {
        id: 2,
        category: "Mess Charges",
        amount: 40000,
        dueDate: "2024-02-01",
        status: "paid",
        description: "Monthly mess food charges"
      },
      {
        id: 3,
        category: "Security Deposit",
        amount: 10000,
        dueDate: "2024-01-10",
        status: "paid",
        description: "Refundable security deposit"
      },
      {
        id: 4,
        category: "Electricity Charges",
        amount: 15000,
        dueDate: "2024-03-15",
        status: "pending",
        description: "Quarterly electricity bill"
      },
      {
        id: 5,
        category: "Maintenance Fee",
        amount: 15000,
        dueDate: "2024-03-15",
        status: "pending",
        description: "Hostel maintenance charges"
      }
    ],
    paymentHistory: [
      {
        id: 1,
        transactionId: "TXN-2024-001",
        date: "2024-01-12",
        amount: 45000,
        category: "Hostel Charges",
        method: "Bank Transfer",
        status: "completed"
      },
      {
        id: 2,
        transactionId: "TXN-2024-002",
        date: "2024-01-28",
        amount: 40000,
        category: "Mess Charges",
        method: "JazzCash",
        status: "completed"
      },
      {
        id: 3,
        transactionId: "TXN-2024-003",
        date: "2024-01-05",
        amount: 10000,
        category: "Security Deposit",
        method: "EasyPaisa",
        status: "completed"
      }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Fee Overview', icon: faMoneyBillWave },
    { id: 'structure', label: 'Fee Structure', icon: faReceipt },
    { id: 'history', label: 'Payment History', icon: faHistory }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon paid" />;
      case 'pending':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="status-icon pending" />;
      case 'completed':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon completed" />;
      default:
        return <FontAwesomeIcon icon={faClock} className="status-icon pending" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      default:
        return 'Pending';
    }
  };

  const formatCurrency = (amount) => {
    return `${feesData.overview.currency} ${amount.toLocaleString()}`;
  };

  const renderOverview = () => (
    <div className="fees-overview">
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card total">
          <div className="card-icon">
            <FontAwesomeIcon icon={faMoneyBillWave} />
          </div>
          <div className="card-content">
            <h3>Total Fees</h3>
            {/* <p className="amount">{formatCurrency(feesData.overview.totalFees)}</p> */}
            <p className="amount">PKR {data?.totalAmount}</p>
          </div>
        </div>

        <div className="summary-card paid">
          <div className="card-icon">
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <div className="card-content">
            <h3>Paid Amount</h3>
            {/* <p className="amount">{formatCurrency(feesData.overview.paidAmount)}</p> */}
            <p className="amount">PKR {data?.totalPaid}</p>
          </div>
        </div>

        <div className="summary-card due">
          <div className="card-icon">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <div className="card-content">
            <h3>Due Amount</h3>
            {/* <p className="amount">{formatCurrency(feesData.overview.dueAmount)}</p> */}
            <p className="amount">PKR {data?.balanceDue}</p>
            <span className="due-date">Due: {feesData.overview.dueDate}</span>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="progress-section">
        <div className="progress-header">
          <h3>Payment Progress</h3>
          <span>{data?.progress}% Complete</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${data?.progress}%` }}
          ></div>
        </div>
        <div className="progress-stats">
          <div className="stat">
            <span>Paid: PKR {data?.totalPaid}</span>
          </div>
          <div className="stat">
            <span>Due: PKR {data?.balanceDue}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn primary">
            <FontAwesomeIcon icon={faCreditCard} />
            Pay Online
          </button>
          <button className="action-btn secondary">
            <FontAwesomeIcon icon={faReceipt} />
            Generate Challan
          </button>
          <button className="action-btn outline">
            <FontAwesomeIcon icon={faDownload} />
            Download Fee Slip
          </button>
          <button className="action-btn outline">
            <FontAwesomeIcon icon={faPrint} />
            Print Receipt
          </button>
        </div>
      </div>

      {/* Upcoming Dues */}
      <div className="upcoming-dues">
        <h3>Upcoming Due Payments</h3>
        <div className="dues-list">
          {feesData.feeStructure
            .filter(fee => fee.status === 'pending')
            .map(fee => (
              <div key={fee.id} className="due-item">
                <div className="due-info">
                  <h4>{fee.category}</h4>
                  <p>{fee.description}</p>
                  <span className="due-date">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    Due: {fee.dueDate}
                  </span>
                </div>
                <div className="due-amount">
                  <strong>{formatCurrency(fee.amount)}</strong>
                  <button className="pay-now-btn">Pay Now</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderFeeStructure = () => (
    <div className="fee-structure">
      <div className="section-header">
        <h3>Detailed Fee Structure</h3>
        <p>Complete breakdown of all hostel fees and charges</p>
      </div>

      <div className="fees-table-container">
        <table className="fees-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {feesData.feeStructure.map(fee => (
              <tr key={fee.id}>
                <td>
                  <div className="fee-category">
                    <strong>{fee.category}</strong>
                  </div>
                </td>
                <td>
                  <span className="fee-description">{fee.description}</span>
                </td>
                <td>
                  <strong className="fee-amount">{formatCurrency(fee.amount)}</strong>
                </td>
                <td>
                  <span className="due-date">{fee.dueDate}</span>
                </td>
                <td>
                  <div className={`status-badge ${fee.status}`}>
                    {getStatusIcon(fee.status)}
                    {getStatusText(fee.status)}
                  </div>
                </td>
                <td>
                  {fee.status === 'pending' ? (
                    <button className="action-btn small primary">Pay Now</button>
                  ) : (
                    <button className="action-btn small outline">View Receipt</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="fees-summary">
        <div className="summary-total">
          <div className="summary-row">
            <span>Total Fees:</span>
            <strong>{formatCurrency(feesData.overview.totalFees)}</strong>
          </div>
          <div className="summary-row">
            <span>Total Paid:</span>
            <strong className="paid">{formatCurrency(feesData.overview.paidAmount)}</strong>
          </div>
          <div className="summary-row">
            <span>Total Due:</span>
            <strong className="due">{formatCurrency(feesData.overview.dueAmount)}</strong>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Balance:</span>
            <strong className="due">{formatCurrency(feesData.overview.dueAmount)}</strong>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentHistory = () => (
    <div className="payment-history">
      <div className="section-header">
        <h3>Payment History</h3>
        <p>Record of all your fee payments and transactions</p>
      </div>

      <div className="history-cards">
        {feesData.paymentHistory.map(payment => (
          <div key={payment.id} className="payment-card">
            <div className="payment-header">
              <div className="payment-info">
                <h4>{payment.category}</h4>
                <span className="transaction-id">{payment.transactionId}</span>
              </div>
              <div className={`payment-status ${payment.status}`}>
                {getStatusIcon(payment.status)}
                {getStatusText(payment.status)}
              </div>
            </div>

            <div className="payment-details">
              <div className="detail-item">
                <span>Date:</span>
                <strong>{payment.date}</strong>
              </div>
              <div className="detail-item">
                <span>Amount:</span>
                <strong className="amount">{formatCurrency(payment.amount)}</strong>
              </div>
              <div className="detail-item">
                <span>Method:</span>
                <span className="method">{payment.method}</span>
              </div>
            </div>

            <div className="payment-actions">
              <button className="action-btn small outline">
                <FontAwesomeIcon icon={faDownload} />
                Download
              </button>
              <button className="action-btn small outline">
                <FontAwesomeIcon icon={faPrint} />
                Print
              </button>
              <button className="action-btn small outline">
                <FontAwesomeIcon icon={faReceipt} />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {feesData.paymentHistory.length === 0 && (
        <div className="empty-state">
          <FontAwesomeIcon icon={faHistory} className="empty-icon" />
          <h4>No Payment History</h4>
          <p>You haven't made any payments yet.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="fees-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <FontAwesomeIcon icon={faMoneyBillWave} />
            Fees Management
          </h1>
          <p>Manage your hostel fees, view payment history, and make payments</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">
            <FontAwesomeIcon icon={faCreditCard} />
            Make Payment
          </button>
        </div>
      </div>

      {/* Fees Tabs */}
      <div className="fees-tabs">
        <div className="tabs-container">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <FontAwesomeIcon icon={tab.icon} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fees Content */}
      <div className="fees-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'structure' && renderFeeStructure()}
        {activeTab === 'history' && renderPaymentHistory()}
      </div>
    </div>
  );
};

export default Fees;