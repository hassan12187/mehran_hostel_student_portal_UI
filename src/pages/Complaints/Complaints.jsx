import React, { useMemo, useState } from 'react';
import './Complaints.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCommentDots,
  faPlus,
  faFilter,
  faSearch,
  faClock,
  faCheckCircle,
  faExclamationTriangle,
  faTools,
  faBolt,
  faTint,
  faTrash,
  faWifi,
  faEye,
  faEdit,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import useGetQuery from "../../hooks/useGetQuery";
import {useCustom} from "../../context/Store";
import { PostService } from '../../services/requestService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const Complaints = () => {
  const queryClient=useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const {token}=useCustom();

  const {data}=useGetQuery("complaints",'/api/student/complaints',token);
  const memoizedData=useMemo(()=>data?.data || [],[data]);
  const mutate=useMutation({
    mutationFn:async({url,data})=>await PostService(url,data,token),
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["complaints"]});
    }
  })
  console.log(memoizedData);

  // Complaint Categories
  const complaintCategories = [
    { id: 'electrical', name: 'Electrical', icon: faBolt, color: '#f59e0b' },
    { id: 'plumbing', name: 'Plumbing', icon: faTint, color: '#3b82f6' },
    { id: 'cleaning', name: 'Cleaning', icon: faTrash, color: '#10b981' },
    { id: 'internet', name: 'Internet', icon: faWifi, color: '#8b5cf6' },
    { id: 'furniture', name: 'Furniture', icon: faTools, color: '#ef4444' },
    { id: 'other', name: 'Other', icon: faCommentDots, color: '#6b7280' }
  ];

  // Complaint Status
  const complaintStatus = {
    pending: { label: 'Pending', icon: faClock, color: '#f59e0b', bgColor: '#fef3c7' },
    inProgress: { label: 'In Progress', icon: faTools, color: '#3b82f6', bgColor: '#dbeafe' },
    resolved: { label: 'Resolved', icon: faCheckCircle, color: '#10b981', bgColor: '#d1fae5' },
    rejected: { label: 'Rejected', icon: faExclamationTriangle, color: '#ef4444', bgColor: '#fef2f2' }
  };

  // Sample Complaints Data
  const [complaints, setComplaints] = useState([
    {
      id: 'COMP-2024-001',
      title: 'AC Not Working',
      category: 'electrical',
      description: 'The air conditioner in room G-104 is not cooling properly. It makes strange noises when turned on.',
      room: 'G-104',
      date: '2024-01-15',
      status: 'inProgress',
      priority: 'high',
      assignedTo: 'Electrician Team',
      lastUpdate: '2024-01-16 14:30',
      comments: [
        {
          id: 1,
          user: 'Maintenance',
          message: 'Technician has been assigned. Will visit tomorrow.',
          timestamp: '2024-01-15 16:45'
        }
      ]
    },
    {
      id: 'COMP-2024-002',
      title: 'Water Leakage in Bathroom',
      category: 'plumbing',
      description: 'Water is leaking from the ceiling in the bathroom. Creating puddles on the floor.',
      room: 'G-104',
      date: '2024-01-10',
      status: 'resolved',
      priority: 'high',
      assignedTo: 'Plumbing Team',
      lastUpdate: '2024-01-12 11:20',
      comments: [
        {
          id: 1,
          user: 'Plumbing Team',
          message: 'Pipe has been repaired. Leakage fixed.',
          timestamp: '2024-01-12 11:20'
        }
      ]
    },
    {
      id: 'COMP-2024-003',
      title: 'WiFi Connection Issues',
      category: 'internet',
      description: 'Intermittent WiFi connectivity in room. Signal drops frequently.',
      room: 'G-104',
      date: '2024-01-08',
      status: 'pending',
      priority: 'medium',
      assignedTo: 'IT Support',
      lastUpdate: '2024-01-08 09:15',
      comments: []
    },
    {
      id: 'COMP-2024-004',
      title: 'Room Cleaning Required',
      category: 'cleaning',
      description: 'Room needs thorough cleaning. Dust accumulation in corners.',
      room: 'G-104',
      date: '2024-01-05',
      status: 'resolved',
      priority: 'low',
      assignedTo: 'Cleaning Staff',
      lastUpdate: '2024-01-06 08:30',
      comments: [
        {
          id: 1,
          user: 'Cleaning Staff',
          message: 'Room has been cleaned thoroughly.',
          timestamp: '2024-01-06 08:30'
        }
      ]
    }
  ]);

  // New Complaint Form State
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    category: '',
    description: '',
    priority: '',
    room: ''
  });

  // Filter complaints based on active tab and search
  // const filteredComplaints = complaints.filter(complaint => {
  //   const matchesTab = activeTab === 'all' || complaint.status === activeTab;
  //   const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
  //   return matchesTab && matchesSearch;
  // });

  const getStatusInfo = (status) => complaintStatus[status] || complaintStatus.pending;

  const getCategoryInfo = (categoryId) => 
    complaintCategories.find(cat => cat.id === categoryId) || complaintCategories[5];

  const handleSubmitComplaint =async (e) => {
    e.preventDefault();
    mutate.mutate({url:"/api/student/complaint",data:newComplaint});
    // const result = await PostService("/api/student/complaint",newComplaint,token);
    // console.log(result);
    // const complaint = {
    //   id: `COMP-2024-00${complaints.length + 1}`,
    //   ...newComplaint,
    //   date: new Date().toISOString().split('T')[0],
    //   status: 'pending',
    //   assignedTo: 'Pending Assignment',
    //   lastUpdate: new Date().toLocaleString(),
    //   comments: []
    // };

    // setComplaints([complaint, ...complaints]);
    setNewComplaint({
      title: '',
      category: '',
      description: '',
      priority: '',
      room: ''
    });
    setShowComplaintForm(false);
  };

  const handleInputChange = (field, value) => {
    setNewComplaint(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const renderComplaintCard = (complaint) => {
    const statusInfo = getStatusInfo(complaint.status);
    const categoryInfo = getCategoryInfo(complaint.category);

    return (
      <div key={complaint._id} className="complaint-card">
        <div className="complaint-header">
          <div className="complaint-title-section">
            <div className="category-badge" style={{ backgroundColor: categoryInfo.color }}>
              <FontAwesomeIcon icon={categoryInfo.icon} />
              <span>{categoryInfo.name}</span>
            </div>
            <h3>{complaint.title}</h3>
          </div>
          <div className={`status-badge ${complaint.status}`} style={{ 
            backgroundColor: statusInfo.bgColor,
            color: statusInfo.color
          }}>
            <FontAwesomeIcon icon={statusInfo.icon} />
            <span>{statusInfo.label}</span>
          </div>
        </div>

        <div className="complaint-body">
          <p className="complaint-description">{complaint.description}</p>
          
          <div className="complaint-details">
            <div className="detail-item">
              <strong>Room:</strong>
              <span>{complaint?.room_id?.room_no}</span>
            </div>
            <div className="detail-item">
              <strong>Date:</strong>
              <span>{new Date(complaint?.created_at).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <strong>Priority:</strong>
              <span className="priority-badge" style={{ color: getPriorityColor(complaint.priority) }}>
                ● {complaint.priority.toUpperCase()}
              </span>
            </div>
            <div className="detail-item">
              <strong>Assigned To:</strong>
              <span>{complaint.assignedTo}</span>
            </div>
          </div>

          {complaint?.comments?.length > 0 && (
            <div className="complaint-comments">
              <div className="comments-header">
                <strong>Latest Update:</strong>
                <span>{complaint.lastUpdate}</span>
              </div>
              {complaint.comments.slice(-1).map(comment => (
                <div key={comment.id} className="comment">
                  <strong>{comment.user}:</strong>
                  <p>{comment.message}</p>
                  <span className="comment-time">{comment.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="complaint-actions">
          <button className="action-btn outline">
            <FontAwesomeIcon icon={faEye} />
            View Details
          </button>
          {complaint.status === 'pending' && (
            <button className="action-btn outline">
              <FontAwesomeIcon icon={faEdit} />
              Edit
            </button>
          )}
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'all', label: 'All Complaints', count: complaints.length },
    { id: 'pending', label: 'Pending', count: complaints.filter(c => c.status === 'pending').length },
    { id: 'inProgress', label: 'In Progress', count: complaints.filter(c => c.status === 'inProgress').length },
    { id: 'resolved', label: 'Resolved', count: complaints.filter(c => c.status === 'resolved').length }
  ];

  return (
    <div className="complaints-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <FontAwesomeIcon icon={faCommentDots} />
            Complaints Management
          </h1>
          <p>Report issues, track complaints, and get updates on maintenance requests</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowComplaintForm(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            New Complaint
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon pending">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div className="stat-content">
              <h3>{complaints.filter(c => c.status === 'pending').length}</h3>
              <p>Pending Complaints</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon inProgress">
              <FontAwesomeIcon icon={faTools} />
            </div>
            <div className="stat-content">
              <h3>{complaints.filter(c => c.status === 'inProgress').length}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon resolved">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div className="stat-content">
              <h3>{complaints.filter(c => c.status === 'resolved').length}</h3>
              <p>Resolved</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon total">
              <FontAwesomeIcon icon={faCommentDots} />
            </div>
            <div className="stat-content">
              <h3>{complaints.length}</h3>
              <p>Total Complaints</p>
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
            placeholder="Search complaints..."
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

      {/* Complaints List */}
      <div className="complaints-content">
        {memoizedData?.length > 0 ? (
          <div className="complaints-grid">
            {memoizedData?.map(renderComplaintCard)}
          </div>
        ) : (
          <div className="empty-state">
            <FontAwesomeIcon icon={faCommentDots} className="empty-icon" />
            <h4>No Complaints Found</h4>
            <p>
              {searchTerm ? 'Try changing your search terms' : 'No complaints to display for this category'}
            </p>
            {!searchTerm && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowComplaintForm(true)}
              >
                <FontAwesomeIcon icon={faPlus} />
                Create Your First Complaint
              </button>
            )}
          </div>
        )}
      </div>

      {/* New Complaint Modal */}
      {showComplaintForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Complaint</h2>
              <button 
                className="close-btn"
                onClick={() => setShowComplaintForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitComplaint} className="complaint-form">
              <div className="form-group">
                <label>Complaint Title *</label>
                <input
                  type="text"
                  value={newComplaint.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Brief description of the issue"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={newComplaint.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    required
                    className="form-input"
                  >
                    <option value="">Select Category</option>
                    {complaintCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority *</label>
                  <select
                    value={newComplaint.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    required
                    className="form-input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Room Number</label>
                <input
                  type="text"
                  value={newComplaint.room}
                  onChange={(e) => handleInputChange('room', e.target.value)}
                  className="form-input"
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Detailed Description *</label>
                <textarea
                  value={newComplaint.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Please provide detailed information about the issue..."
                  required
                  rows="5"
                  className="form-input textarea"
                ></textarea>
              </div>

              <div className="form-actions">
                <button 
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowComplaintForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;