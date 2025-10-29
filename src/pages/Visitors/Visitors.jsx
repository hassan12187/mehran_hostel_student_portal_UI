import React, { useState } from 'react';
import './Visitors.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers,
  faPlus,
  faSearch,
  faFilter,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faUser,
  faPhone,
  faIdCard,
  faMapMarkerAlt,
  faCalendarAlt,
  faQrcode,
  faDownload,
  faEdit,
  faTrash,
  faPaperPlane,
  faHistory
} from '@fortawesome/free-solid-svg-icons';

const Visitors = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [showVisitorForm, setShowVisitorForm] = useState(false);

  // Visitor Types
  const visitorTypes = [
    { id: 'family', name: 'Family Member', color: '#10b981' },
    { id: 'friend', name: 'Friend', color: '#3b82f6' },
    { id: 'relative', name: 'Relative', color: '#8b5cf6' },
    { id: 'official', name: 'Official Visit', color: '#f59e0b' },
    { id: 'other', name: 'Other', color: '#6b7280' }
  ];

  // Visitor Status
  const visitorStatus = {
    pending: { label: 'Pending Approval', icon: faClock, color: '#f59e0b', bgColor: '#fef3c7' },
    approved: { label: 'Approved', icon: faCheckCircle, color: '#10b981', bgColor: '#d1fae5' },
    rejected: { label: 'Rejected', icon: faTimesCircle, color: '#ef4444', bgColor: '#fef2f2' },
    completed: { label: 'Visit Completed', icon: faCheckCircle, color: '#3b82f6', bgColor: '#dbeafe' },
    cancelled: { label: 'Cancelled', icon: faTimesCircle, color: '#6b7280', bgColor: '#f3f4f6' }
  };

  // Sample Visitors Data
  const [visitors, setVisitors] = useState([
    {
      id: 'VIS-2024-001',
      name: "Ahmed Khan",
      type: "family",
      relation: "Father",
      contact: "+92 300 1234567",
      cnic: "42201-1234567-8",
      purpose: "Family visit and lunch",
      scheduledDate: "2024-01-25",
      scheduledTime: "14:00",
      expectedDuration: "3 hours",
      status: "approved",
      approvedBy: "Security Incharge",
      approvedDate: "2024-01-24 10:30",
      entryTime: "",
      exitTime: "",
      vehicleNumber: "ABC-123",
      itemsCarrying: "Food items, documents",
      submittedDate: "2024-01-23 15:45"
    },
    {
      id: 'VIS-2024-002',
      name: "Sara Ahmed",
      type: "friend",
      relation: "University Friend",
      contact: "+92 312 9876543",
      cnic: "42201-7654321-9",
      purpose: "Study group meeting",
      scheduledDate: "2024-01-26",
      scheduledTime: "16:00",
      expectedDuration: "2 hours",
      status: "pending",
      approvedBy: "Pending",
      approvedDate: "Pending",
      entryTime: "",
      exitTime: "",
      vehicleNumber: "",
      itemsCarrying: "Books, laptop",
      submittedDate: "2024-01-24 09:20"
    },
    {
      id: 'VIS-2024-003',
      name: "Mr. Raza",
      type: "official",
      relation: "University Professor",
      contact: "+92 321 1122334",
      cnic: "42201-1122334-5",
      purpose: "Academic discussion",
      scheduledDate: "2024-01-22",
      scheduledTime: "11:00",
      expectedDuration: "1 hour",
      status: "completed",
      approvedBy: "Warden Office",
      approvedDate: "2024-01-21 14:15",
      entryTime: "2024-01-22 11:05",
      exitTime: "2024-01-22 12:00",
      vehicleNumber: "XYZ-789",
      itemsCarrying: "Documents",
      submittedDate: "2024-01-20 16:30"
    },
    {
      id: 'VIS-2024-004',
      name: "Bilal Siddiqui",
      type: "relative",
      relation: "Cousin",
      contact: "+92 333 4455667",
      cnic: "42201-4455667-8",
      purpose: "Personal meeting",
      scheduledDate: "2024-01-27",
      scheduledTime: "19:00",
      expectedDuration: "2 hours",
      status: "rejected",
      approvedBy: "Security Incharge",
      approvedDate: "2024-01-25 11:20",
      entryTime: "",
      exitTime: "",
      vehicleNumber: "",
      itemsCarrying: "Personal items",
      rejectionReason: "Evening visits not allowed after 6 PM",
      submittedDate: "2024-01-24 18:15"
    }
  ]);

  // New Visitor Form State
  const [newVisitor, setNewVisitor] = useState({
    name: '',
    type: '',
    relation: '',
    contact: '',
    cnic: '',
    purpose: '',
    scheduledDate: '',
    scheduledTime: '',
    expectedDuration: '1 hour',
    vehicleNumber: '',
    itemsCarrying: ''
  });

  // Filter visitors based on active tab and search
  const filteredVisitors = visitors.filter(visitor => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'upcoming' && ['pending', 'approved'].includes(visitor.status)) ||
      (activeTab === 'history' && ['completed', 'rejected', 'cancelled'].includes(visitor.status)) ||
      visitor.status === activeTab;
    
    const matchesSearch = visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const getStatusInfo = (status) => visitorStatus[status] || visitorStatus.pending;

  const getTypeInfo = (typeId) => 
    visitorTypes.find(type => type.id === typeId) || visitorTypes[4];

  const handleSubmitVisitor = (e) => {
    e.preventDefault();
    
    const visitor = {
      id: `VIS-2024-00${visitors.length + 1}`,
      ...newVisitor,
      status: 'pending',
      approvedBy: 'Pending',
      approvedDate: 'Pending',
      entryTime: '',
      exitTime: '',
      rejectionReason: '',
      submittedDate: new Date().toLocaleString()
    };

    setVisitors([visitor, ...visitors]);
    setNewVisitor({
      name: '',
      type: '',
      relation: '',
      contact: '',
      cnic: '',
      purpose: '',
      scheduledDate: '',
      scheduledTime: '',
      expectedDuration: '1 hour',
      vehicleNumber: '',
      itemsCarrying: ''
    });
    setShowVisitorForm(false);
  };

  const handleInputChange = (field, value) => {
    setNewVisitor(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr) return 'Not specified';
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleString('en-PK', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVisitStats = () => {
    const stats = {
      total: visitors.length,
      pending: visitors.filter(v => v.status === 'pending').length,
      approved: visitors.filter(v => v.status === 'approved').length,
      completed: visitors.filter(v => v.status === 'completed').length,
      rejected: visitors.filter(v => v.status === 'rejected').length
    };
    return stats;
  };

  const stats = getVisitStats();

  const renderVisitorCard = (visitor) => {
    const statusInfo = getStatusInfo(visitor.status);
    const typeInfo = getTypeInfo(visitor.type);

    return (
      <div key={visitor.id} className="visitor-card">
        <div className="visitor-header">
          <div className="visitor-info">
            <div className="type-badge" style={{ backgroundColor: typeInfo.color }}>
              {typeInfo.name}
            </div>
            <div className="visitor-id">{visitor.id}</div>
          </div>
          <div className={`status-badge ${visitor.status}`} style={{ 
            backgroundColor: statusInfo.bgColor,
            color: statusInfo.color
          }}>
            <FontAwesomeIcon icon={statusInfo.icon} />
            <span>{statusInfo.label}</span>
          </div>
        </div>

        <div className="visitor-body">
          <div className="visitor-details">
            <div className="detail-row">
              <div className="detail-item">
                <FontAwesomeIcon icon={faUser} />
                <div className="detail-content">
                  <label>Visitor Name</label>
                  <span>{visitor.name}</span>
                </div>
              </div>
              <div className="detail-item">
                <FontAwesomeIcon icon={faUser} />
                <div className="detail-content">
                  <label>Relation</label>
                  <span>{visitor.relation}</span>
                </div>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-item">
                <FontAwesomeIcon icon={faPhone} />
                <div className="detail-content">
                  <label>Contact</label>
                  <span>{visitor.contact}</span>
                </div>
              </div>
              <div className="detail-item">
                <FontAwesomeIcon icon={faIdCard} />
                <div className="detail-content">
                  <label>CNIC</label>
                  <span>{visitor.cnic}</span>
                </div>
              </div>
            </div>

            <div className="detail-item full-width">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <div className="detail-content">
                <label>Visit Purpose</label>
                <span>{visitor.purpose}</span>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-item">
                <FontAwesomeIcon icon={faCalendarAlt} />
                <div className="detail-content">
                  <label>Scheduled Date & Time</label>
                  <span>{formatDateTime(visitor.scheduledDate, visitor.scheduledTime)}</span>
                </div>
              </div>
              <div className="detail-item">
                <FontAwesomeIcon icon={faClock} />
                <div className="detail-content">
                  <label>Expected Duration</label>
                  <span>{visitor.expectedDuration}</span>
                </div>
              </div>
            </div>

            {visitor.vehicleNumber && (
              <div className="detail-item">
                <FontAwesomeIcon icon={faQrcode} />
                <div className="detail-content">
                  <label>Vehicle Number</label>
                  <span>{visitor.vehicleNumber}</span>
                </div>
              </div>
            )}

            {visitor.itemsCarrying && (
              <div className="detail-item full-width">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                <div className="detail-content">
                  <label>Items Carrying</label>
                  <span>{visitor.itemsCarrying}</span>
                </div>
              </div>
            )}

            {visitor.status === 'approved' && (
              <div className="approval-info">
                <div className="approved-by">
                  <FontAwesomeIcon icon={faUser} />
                  <span>Approved by: <strong>{visitor.approvedBy}</strong></span>
                </div>
                <div className="approval-date">
                  On: {visitor.approvedDate}
                </div>
              </div>
            )}

            {visitor.status === 'rejected' && visitor.rejectionReason && (
              <div className="rejection-info">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                <div className="rejection-content">
                  <strong>Rejection Reason:</strong>
                  <span>{visitor.rejectionReason}</span>
                </div>
              </div>
            )}

            {visitor.status === 'completed' && (
              <div className="visit-timeline">
                <div className="timeline-item">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <div className="timeline-content">
                    <strong>Entry Time</strong>
                    <span>{visitor.entryTime}</span>
                  </div>
                </div>
                <div className="timeline-item">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <div className="timeline-content">
                    <strong>Exit Time</strong>
                    <span>{visitor.exitTime}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="visitor-actions">
          {visitor.status === 'pending' && (
            <>
              <button className="action-btn outline">
                <FontAwesomeIcon icon={faEdit} />
                Edit
              </button>
              <button className="action-btn outline danger">
                <FontAwesomeIcon icon={faTrash} />
                Cancel
              </button>
            </>
          )}
          {visitor.status === 'approved' && (
            <button className="action-btn outline">
              <FontAwesomeIcon icon={faDownload} />
              Download Pass
            </button>
          )}
          <button className="action-btn outline">
            <FontAwesomeIcon icon={faHistory} />
            View Details
          </button>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'all', label: 'All Visitors', count: stats.total },
    { id: 'upcoming', label: 'Upcoming', count: stats.pending + stats.approved },
    { id: 'pending', label: 'Pending', count: stats.pending },
    { id: 'approved', label: 'Approved', count: stats.approved },
    { id: 'history', label: 'History', count: stats.completed + stats.rejected }
  ];

  const visitorRules = [
    "All visitors must be pre-registered at least 24 hours in advance",
    "Visitors must carry original CNIC for verification",
    "Maximum visit duration: 4 hours",
    "Visiting hours: 9:00 AM to 6:00 PM only",
    "Overnight stays are not permitted",
    "Visitors must follow all hostel rules and regulations",
    "The student is responsible for their visitor's conduct",
    "Security has the right to deny entry without proper documentation"
  ];

  return (
    <div className="visitors-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <FontAwesomeIcon icon={faUsers} />
            Visitors Management
          </h1>
          <p>Manage visitor registrations, track approvals, and view visit history</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowVisitorForm(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            New Visitor Request
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className="stat-content">
              <h3>{stats.total}</h3>
              <p>Total Visitors</p>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div className="stat-content">
              <h3>{stats.pending}</h3>
              <p>Pending Approval</p>
            </div>
          </div>
          <div className="stat-card approved">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div className="stat-content">
              <h3>{stats.approved}</h3>
              <p>Approved</p>
            </div>
          </div>
          <div className="stat-card completed">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faHistory} />
            </div>
            <div className="stat-content">
              <h3>{stats.completed}</h3>
              <p>Completed Visits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="controls-bar">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search by visitor name, relation, or purpose..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Visitors Content */}
      <div className="visitors-content">
        {filteredVisitors.length > 0 ? (
          <div className="visitors-grid">
            {filteredVisitors.map(renderVisitorCard)}
          </div>
        ) : (
          <div className="empty-state">
            <FontAwesomeIcon icon={faUsers} className="empty-icon" />
            <h4>No Visitors Found</h4>
            <p>
              {searchTerm ? 'Try changing your search terms' : 'No visitors to display for this category'}
            </p>
            {!searchTerm && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowVisitorForm(true)}
              >
                <FontAwesomeIcon icon={faPlus} />
                Register Your First Visitor
              </button>
            )}
          </div>
        )}
      </div>

      {/* Visitor Rules Sidebar */}
      <div className="visitor-rules">
        <div className="rules-card">
          <h3>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            Visitor Rules
          </h3>
          <div className="rules-list">
            {visitorRules.map((rule, index) => (
              <div key={index} className="rule-item">
                <FontAwesomeIcon icon={faCheckCircle} className="rule-icon" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Visitor Modal */}
      {showVisitorForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Register New Visitor</h2>
              <button 
                className="close-btn"
                onClick={() => setShowVisitorForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitVisitor} className="visitor-form">
              <div className="form-section">
                <h3>Visitor Information</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Visitor Name *</label>
                    <input
                      type="text"
                      value={newVisitor.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Full name of visitor"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Visitor Type *</label>
                    <select
                      value={newVisitor.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      required
                      className="form-input"
                    >
                      <option value="">Select Type</option>
                      {visitorTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Relation with Visitor *</label>
                    <input
                      type="text"
                      value={newVisitor.relation}
                      onChange={(e) => handleInputChange('relation', e.target.value)}
                      placeholder="e.g., Father, Friend, Relative"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Number *</label>
                    <input
                      type="tel"
                      value={newVisitor.contact}
                      onChange={(e) => handleInputChange('contact', e.target.value)}
                      placeholder="+92 XXX XXXXXXX"
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>CNIC Number *</label>
                  <input
                    type="text"
                    value={newVisitor.cnic}
                    onChange={(e) => handleInputChange('cnic', e.target.value)}
                    placeholder="XXXXX-XXXXXXX-X"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Purpose of Visit *</label>
                  <textarea
                    value={newVisitor.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    placeholder="Please describe the purpose of visit in detail..."
                    required
                    rows="3"
                    className="form-input textarea"
                  ></textarea>
                </div>
              </div>

              <div className="form-section">
                <h3>Visit Details</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Scheduled Date *</label>
                    <input
                      type="date"
                      value={newVisitor.scheduledDate}
                      onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Scheduled Time *</label>
                    <input
                      type="time"
                      value={newVisitor.scheduledTime}
                      onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expected Duration *</label>
                    <select
                      value={newVisitor.expectedDuration}
                      onChange={(e) => handleInputChange('expectedDuration', e.target.value)}
                      required
                      className="form-input"
                    >
                      <option value="1 hour">1 Hour</option>
                      <option value="2 hours">2 Hours</option>
                      <option value="3 hours">3 Hours</option>
                      <option value="4 hours">4 Hours (Maximum)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Vehicle Number (if any)</label>
                    <input
                      type="text"
                      value={newVisitor.vehicleNumber}
                      onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                      placeholder="ABC-123"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Items Carrying (if any)</label>
                  <textarea
                    value={newVisitor.itemsCarrying}
                    onChange={(e) => handleInputChange('itemsCarrying', e.target.value)}
                    placeholder="List any items the visitor will be carrying..."
                    rows="2"
                    className="form-input textarea"
                  ></textarea>
                </div>
              </div>

              <div className="form-notice">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                <p>
                  <strong>Important:</strong> Visitor requests must be submitted at least 24 hours in advance. 
                  Approval is subject to security clearance and hostel rules. Please ensure all information is accurate.
                </p>
              </div>

              <div className="form-actions">
                <button 
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowVisitorForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Visitors;