import React, { useState } from 'react';
import './Gatepass.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faIdCard,
  faPlus,
  faFilter,
  faSearch,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faMapMarkerAlt,
  faCalendarAlt,
  faUser,
  faPaperPlane,
  faDownload,
  faEdit,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

const Gatepass = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showGatepassForm, setShowGatepassForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Gate Pass Types
  const gatePassTypes = [
    { id: 'weekend', name: 'Weekend Pass', duration: '48 hours', color: '#10b981' },
    { id: 'day', name: 'Day Pass', duration: '12 hours', color: '#3b82f6' },
    { id: 'night', name: 'Night Out', duration: 'Overnight', color: '#8b5cf6' },
    { id: 'emergency', name: 'Emergency', duration: '6 hours', color: '#ef4444' },
    { id: 'medical', name: 'Medical', duration: 'As needed', color: '#f59e0b' }
  ];

  // Gate Pass Status
  const gatePassStatus = {
    pending: { label: 'Pending', icon: faClock, color: '#f59e0b', bgColor: '#fef3c7' },
    approved: { label: 'Approved', icon: faCheckCircle, color: '#10b981', bgColor: '#d1fae5' },
    rejected: { label: 'Rejected', icon: faTimesCircle, color: '#ef4444', bgColor: '#fef2f2' },
    expired: { label: 'Expired', icon: faExclamationTriangle, color: '#6b7280', bgColor: '#f3f4f6' },
    active: { label: 'Active', icon: faCheckCircle, color: '#3b82f6', bgColor: '#dbeafe' }
  };

  // Sample Gate Pass Data
  const [gatePasses, setGatePasses] = useState([
    {
      id: 'GP-2024-001',
      type: 'weekend',
      destination: 'Home - Gulshan-e-Iqbal',
      purpose: 'Family function',
      departure: '2024-01-19 18:00',
      return: '2024-01-21 18:00',
      status: 'approved',
      submittedDate: '2024-01-18 14:30',
      approvedBy: 'Warden Ahmed',
      approvedDate: '2024-01-18 16:45',
      emergencyContact: '+92 300 1234567',
      address: 'House No. 123, Street 5, Gulshan-e-Iqbal, Karachi',
      transport: 'Personal Car'
    },
    {
      id: 'GP-2024-002',
      type: 'day',
      destination: 'University Library',
      purpose: 'Study group meeting',
      departure: '2024-01-20 10:00',
      return: '2024-01-20 22:00',
      status: 'active',
      submittedDate: '2024-01-19 09:15',
      approvedBy: 'Warden Ahmed',
      approvedDate: '2024-01-19 10:30',
      emergencyContact: '+92 321 7654321',
      address: 'NED University Library, Karachi',
      transport: 'University Bus'
    },
    {
      id: 'GP-2024-003',
      type: 'medical',
      destination: 'Aga Khan Hospital',
      purpose: 'Medical checkup',
      departure: '2024-01-18 14:00',
      return: '2024-01-18 18:00',
      status: 'expired',
      submittedDate: '2024-01-18 10:20',
      approvedBy: 'Warden Ahmed',
      approvedDate: '2024-01-18 11:45',
      emergencyContact: '+92 300 1234567',
      address: 'Aga Khan University Hospital, Karachi',
      transport: 'Taxi'
    },
    {
      id: 'GP-2024-004',
      type: 'emergency',
      destination: 'Home - North Nazimabad',
      purpose: 'Family emergency',
      departure: '2024-01-22 16:00',
      return: '2024-01-22 22:00',
      status: 'pending',
      submittedDate: '2024-01-22 15:30',
      approvedBy: 'Pending',
      approvedDate: 'Pending',
      emergencyContact: '+92 321 7654321',
      address: 'House No. 456, Block B, North Nazimabad, Karachi',
      transport: 'Ride-hailing'
    }
  ]);

  // New Gate Pass Form State
  const [newGatepass, setNewGatepass] = useState({
    type: '',
    destination: '',
    purpose: '',
    departureDate: '',
    departureTime: '',
    returnDate: '',
    returnTime: '',
    emergencyContact: '+92 300 1234567',
    address: '',
    transport: ''
  });

  // Filter gate passes based on active tab and search
  const filteredGatePasses = gatePasses.filter(pass => {
    const matchesTab = activeTab === 'all' || pass.status === activeTab;
    const matchesSearch = pass.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pass.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusInfo = (status) => gatePassStatus[status] || gatePassStatus.pending;

  const getTypeInfo = (typeId) => 
    gatePassTypes.find(type => type.id === typeId) || gatePassTypes[0];

  const handleSubmitGatepass = (e) => {
    e.preventDefault();
    
    const departure = `${newGatepass.departureDate} ${newGatepass.departureTime}`;
    const returnTime = `${newGatepass.returnDate} ${newGatepass.returnTime}`;
    
    const gatepass = {
      id: `GP-2024-00${gatePasses.length + 1}`,
      ...newGatepass,
      departure,
      return: returnTime,
      status: 'pending',
      submittedDate: new Date().toLocaleString(),
      approvedBy: 'Pending',
      approvedDate: 'Pending'
    };

    setGatePasses([gatepass, ...gatePasses]);
    setNewGatepass({
      type: '',
      destination: '',
      purpose: '',
      departureDate: '',
      departureTime: '',
      returnDate: '',
      returnTime: '',
      emergencyContact: '+92 300 1234567',
      address: '',
      transport: ''
    });
    setShowGatepassForm(false);
  };

  const handleInputChange = (field, value) => {
    setNewGatepass(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-PK', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isReturnValid = () => {
    if (!newGatepass.departureDate || !newGatepass.returnDate) return true;
    
    const departure = new Date(`${newGatepass.departureDate} ${newGatepass.departureTime}`);
    const returnTime = new Date(`${newGatepass.returnDate} ${newGatepass.returnTime}`);
    
    return returnTime > departure;
  };

  const renderGatepassCard = (pass) => {
    const statusInfo = getStatusInfo(pass.status);
    const typeInfo = getTypeInfo(pass.type);

    return (
      <div key={pass.id} className="gatepass-card">
        <div className="gatepass-header">
          <div className="pass-info">
            <div className="type-badge" style={{ backgroundColor: typeInfo.color }}>
              {typeInfo.name}
            </div>
            <div className="pass-id">{pass.id}</div>
          </div>
          <div className={`status-badge ${pass.status}`} style={{ 
            backgroundColor: statusInfo.bgColor,
            color: statusInfo.color
          }}>
            <FontAwesomeIcon icon={statusInfo.icon} />
            <span>{statusInfo.label}</span>
          </div>
        </div>

        <div className="gatepass-body">
          <div className="destination-section">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="destination-icon" />
            <div className="destination-info">
              <h3>{pass.destination}</h3>
              <p>{pass.purpose}</p>
            </div>
          </div>

          <div className="timeline">
            <div className="timeline-item">
              <FontAwesomeIcon icon={faCalendarAlt} />
              <div className="timeline-content">
                <strong>Departure</strong>
                <span>{formatDateTime(pass.departure)}</span>
              </div>
            </div>
            <div className="timeline-item">
              <FontAwesomeIcon icon={faCalendarAlt} />
              <div className="timeline-content">
                <strong>Return</strong>
                <span>{formatDateTime(pass.return)}</span>
              </div>
            </div>
          </div>

          <div className="pass-details">
            <div className="detail-row">
              <div className="detail-item">
                <strong>Transport:</strong>
                <span>{pass.transport}</span>
              </div>
              <div className="detail-item">
                <strong>Emergency Contact:</strong>
                <span>{pass.emergencyContact}</span>
              </div>
            </div>
            {pass.address && (
              <div className="detail-item full-width">
                <strong>Address:</strong>
                <span>{pass.address}</span>
              </div>
            )}
          </div>

          {pass.status === 'approved' && (
            <div className="approval-info">
              <div className="approved-by">
                <FontAwesomeIcon icon={faUser} />
                <span>Approved by: <strong>{pass.approvedBy}</strong></span>
              </div>
              <div className="approval-date">
                On: {formatDateTime(pass.approvedDate)}
              </div>
            </div>
          )}
        </div>

        <div className="gatepass-actions">
          <button className="action-btn outline">
            <FontAwesomeIcon icon={faDownload} />
            Download Pass
          </button>
          {pass.status === 'pending' && (
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
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'all', label: 'All Passes', count: gatePasses.length },
    { id: 'pending', label: 'Pending', count: gatePasses.filter(p => p.status === 'pending').length },
    { id: 'approved', label: 'Approved', count: gatePasses.filter(p => p.status === 'approved').length },
    { id: 'active', label: 'Active', count: gatePasses.filter(p => p.status === 'active').length },
    { id: 'expired', label: 'Expired', count: gatePasses.filter(p => p.status === 'expired').length }
  ];

  const stats = {
    monthlyLimit: 8,
    usedThisMonth: 3,
    remaining: 5
  };

  return (
    <div className="gatepass-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <FontAwesomeIcon icon={faIdCard} />
            Gate Pass Management
          </h1>
          <p>Apply for gate passes, track approvals, and manage your outings</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowGatepassForm(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            New Gate Pass
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">
              <FontAwesomeIcon icon={faIdCard} />
            </div>
            <div className="stat-content">
              <h3>{stats.usedThisMonth}/{stats.monthlyLimit}</h3>
              <p>Monthly Passes Used</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(stats.usedThisMonth / stats.monthlyLimit) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div className="stat-content">
              <h3>{gatePasses.filter(p => p.status === 'pending').length}</h3>
              <p>Pending Approval</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon active">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div className="stat-content">
              <h3>{gatePasses.filter(p => p.status === 'active').length}</h3>
              <p>Active Passes</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon remaining">
              <FontAwesomeIcon icon={faIdCard} />
            </div>
            <div className="stat-content">
              <h3>{stats.remaining}</h3>
              <p>Passes Remaining</p>
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
            placeholder="Search by destination or purpose..."
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

      {/* Gate Passes List */}
      <div className="gatepasses-content">
        {filteredGatePasses.length > 0 ? (
          <div className="gatepasses-grid">
            {filteredGatePasses.map(renderGatepassCard)}
          </div>
        ) : (
          <div className="empty-state">
            <FontAwesomeIcon icon={faIdCard} className="empty-icon" />
            <h4>No Gate Passes Found</h4>
            <p>
              {searchTerm ? 'Try changing your search terms' : 'No gate passes to display for this category'}
            </p>
            {!searchTerm && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowGatepassForm(true)}
              >
                <FontAwesomeIcon icon={faPlus} />
                Apply for Your First Gate Pass
              </button>
            )}
          </div>
        )}
      </div>

      {/* New Gate Pass Modal */}
      {showGatepassForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Apply for Gate Pass</h2>
              <button 
                className="close-btn"
                onClick={() => setShowGatepassForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitGatepass} className="gatepass-form">
              <div className="form-section">
                <h3>Pass Information</h3>
                
                <div className="form-group">
                  <label>Pass Type *</label>
                  <select
                    value={newGatepass.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    required
                    className="form-input"
                  >
                    <option value="">Select Pass Type</option>
                    {gatePassTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name} ({type.duration})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Destination *</label>
                  <input
                    type="text"
                    value={newGatepass.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    placeholder="Where are you going?"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Purpose *</label>
                  <textarea
                    value={newGatepass.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    placeholder="Please provide detailed reason for your outing..."
                    required
                    rows="3"
                    className="form-input textarea"
                  ></textarea>
                </div>
              </div>

              <div className="form-section">
                <h3>Timing Details</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Departure Date *</label>
                    <input
                      type="date"
                      value={newGatepass.departureDate}
                      onChange={(e) => handleInputChange('departureDate', e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Departure Time *</label>
                    <input
                      type="time"
                      value={newGatepass.departureTime}
                      onChange={(e) => handleInputChange('departureTime', e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Return Date *</label>
                    <input
                      type="date"
                      value={newGatepass.returnDate}
                      onChange={(e) => handleInputChange('returnDate', e.target.value)}
                      required
                      min={newGatepass.departureDate || new Date().toISOString().split('T')[0]}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Return Time *</label>
                    <input
                      type="time"
                      value={newGatepass.returnTime}
                      onChange={(e) => handleInputChange('returnTime', e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                {!isReturnValid() && (
                  <div className="error-message">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    Return time must be after departure time
                  </div>
                )}
              </div>

              <div className="form-section">
                <h3>Additional Information</h3>
                
                <div className="form-group">
                  <label>Transport Mode *</label>
                  <select
                    value={newGatepass.transport}
                    onChange={(e) => handleInputChange('transport', e.target.value)}
                    required
                    className="form-input"
                  >
                    <option value="">Select Transport</option>
                    <option value="Personal Car">Personal Car</option>
                    <option value="University Bus">University Bus</option>
                    <option value="Taxi">Taxi</option>
                    <option value="Ride-hailing">Ride-hailing (Careem/UBER)</option>
                    <option value="Public Transport">Public Transport</option>
                    <option value="Walking">Walking</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Emergency Contact *</label>
                  <input
                    type="tel"
                    value={newGatepass.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Complete Address</label>
                  <textarea
                    value={newGatepass.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Full address of your destination..."
                    rows="2"
                    className="form-input textarea"
                  ></textarea>
                </div>
              </div>

              <div className="form-notice">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                <p>
                  <strong>Important:</strong> Gate passes must be applied at least 6 hours in advance. 
                  Emergency passes require valid documentation. Please ensure all information is accurate.
                </p>
              </div>

              <div className="form-actions">
                <button 
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowGatepassForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={!isReturnValid()}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gatepass;