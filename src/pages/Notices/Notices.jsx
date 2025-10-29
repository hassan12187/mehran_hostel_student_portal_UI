import React, { useState } from 'react';
import './Notices.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBullhorn,
  faSearch,
  faFilter,
  faBell,
  faExclamationTriangle,
  faInfoCircle,
  faCalendarAlt,
  faUser,
  faDownload,
  faShare,
  faBookmark,
  faClock,
  faEye,
  faTimesCircle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const Notices = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedNotices, setBookmarkedNotices] = useState(['NOTICE-2024-001', 'NOTICE-2024-003']);

  // Notice Categories
  const noticeCategories = [
    { id: 'all', name: 'All Notices', count: 15, color: '#2c5530' },
    { id: 'emergency', name: 'Emergency', count: 3, color: '#ef4444' },
    { id: 'academic', name: 'Academic', count: 5, color: '#3b82f6' },
    { id: 'hostel', name: 'Hostel', count: 4, color: '#f59e0b' },
    { id: 'mess', name: 'Mess', count: 2, color: '#10b981' },
    { id: 'general', name: 'General', count: 1, color: '#6b7280' }
  ];

  // Notice Priority Levels
  const noticePriority = {
    high: { label: 'High Priority', icon: faExclamationTriangle, color: '#ef4444', bgColor: '#fef2f2' },
    medium: { label: 'Medium Priority', icon: faInfoCircle, color: '#f59e0b', bgColor: '#fffbeb' },
    low: { label: 'Low Priority', icon: faInfoCircle, color: '#10b981', bgColor: '#f0fdf4' }
  };

  // Sample Notices Data
  const noticesData = [
    {
      id: 'NOTICE-2024-001',
      title: 'Emergency Power Maintenance',
      category: 'emergency',
      priority: 'high',
      content: 'There will be an emergency power shutdown for maintenance work in all hostel blocks from 10:00 AM to 4:00 PM on January 25, 2024. Students are advised to make necessary arrangements.',
      issuedBy: 'Hostel Administration',
      issueDate: '2024-01-23',
      effectiveDate: '2024-01-25',
      expiryDate: '2024-01-25',
      attachments: ['maintenance_schedule.pdf'],
      views: 245,
      isActive: true
    },
    {
      id: 'NOTICE-2024-002',
      title: 'Mid-Term Examination Schedule',
      category: 'academic',
      priority: 'high',
      content: 'The mid-term examination schedule for Spring 2024 semester has been released. Please check the attached timetable. All students must carry their university ID cards during exams.',
      issuedBy: 'Examination Department',
      issueDate: '2024-01-22',
      effectiveDate: '2024-02-01',
      expiryDate: '2024-02-15',
      attachments: ['exam_schedule.pdf', 'exam_guidelines.pdf'],
      views: 189,
      isActive: true
    },
    {
      id: 'NOTICE-2024-003',
      title: 'Hostel Fee Payment Deadline',
      category: 'hostel',
      priority: 'medium',
      content: 'This is to inform all students that the last date for hostel fee payment for January 2024 is 25th January 2024. Late payments will incur a fine of PKR 500 per day.',
      issuedBy: 'Finance Office',
      issueDate: '2024-01-20',
      effectiveDate: '2024-01-20',
      expiryDate: '2024-01-25',
      attachments: ['fee_structure.pdf'],
      views: 167,
      isActive: true
    },
    {
      id: 'NOTICE-2024-004',
      title: 'Special Mess Menu for Republic Day',
      category: 'mess',
      priority: 'low',
      content: 'On the occasion of Republic Day, a special dinner will be served on 23rd March 2024. The menu includes Biryani, Kheer, and traditional desserts.',
      issuedBy: 'Mess Committee',
      issueDate: '2024-01-19',
      effectiveDate: '2024-03-23',
      expiryDate: '2024-03-23',
      attachments: ['special_menu.pdf'],
      views: 134,
      isActive: true
    },
    {
      id: 'NOTICE-2024-005',
      title: 'Internet Maintenance Work',
      category: 'general',
      priority: 'medium',
      content: 'Internet services in the hostel will be unavailable from 2:00 AM to 6:00 AM on January 24, 2024 due to scheduled maintenance. We apologize for any inconvenience.',
      issuedBy: 'IT Department',
      issueDate: '2024-01-18',
      effectiveDate: '2024-01-24',
      expiryDate: '2024-01-24',
      attachments: [],
      views: 98,
      isActive: true
    },
    {
      id: 'NOTICE-2024-006',
      title: 'Sports Week Announcement',
      category: 'general',
      priority: 'low',
      content: 'Annual Hostel Sports Week will be held from February 1-7, 2024. Registration forms are available at the sports office. Last date for registration is January 28, 2024.',
      issuedBy: 'Sports Committee',
      issueDate: '2024-01-15',
      effectiveDate: '2024-01-15',
      expiryDate: '2024-02-07',
      attachments: ['sports_schedule.pdf', 'registration_form.pdf'],
      views: 156,
      isActive: true
    },
    {
      id: 'NOTICE-2023-015',
      title: 'Winter Vacation Announcement',
      category: 'academic',
      priority: 'medium',
      content: 'Hostels will remain closed during winter vacation from December 20, 2023 to January 5, 2024. All students must vacate their rooms by December 19, 2023.',
      issuedBy: 'Hostel Administration',
      issueDate: '2023-12-10',
      effectiveDate: '2023-12-20',
      expiryDate: '2024-01-05',
      attachments: ['vacation_guidelines.pdf'],
      views: 278,
      isActive: false
    }
  ];

  // Filter notices based on active category and search
  const filteredNotices = noticesData.filter(notice => {
    const matchesCategory = activeCategory === 'all' || notice.category === activeCategory;
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.issuedBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getPriorityInfo = (priority) => noticePriority[priority] || noticePriority.medium;

  const getCategoryInfo = (categoryId) => 
    noticeCategories.find(cat => cat.id === categoryId) || noticeCategories[0];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-PK', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isBookmarked = (noticeId) => bookmarkedNotices.includes(noticeId);

  const toggleBookmark = (noticeId) => {
    if (bookmarkedNotices.includes(noticeId)) {
      setBookmarkedNotices(bookmarkedNotices.filter(id => id !== noticeId));
    } else {
      setBookmarkedNotices([...bookmarkedNotices, noticeId]);
    }
  };

  const getActiveNoticesCount = () => {
    return noticesData.filter(notice => notice.isActive).length;
  };

  const getExpiredNoticesCount = () => {
    return noticesData.filter(notice => !notice.isActive).length;
  };

  const renderNoticeCard = (notice) => {
    const priorityInfo = getPriorityInfo(notice.priority);
    const categoryInfo = getCategoryInfo(notice.category);

    return (
      <div key={notice.id} className={`notice-card ${!notice.isActive ? 'expired' : ''}`}>
        <div className="notice-header">
          <div className="notice-category">
            <div 
              className="category-badge" 
              style={{ backgroundColor: categoryInfo.color }}
            >
              {categoryInfo.name}
            </div>
            <div className="notice-id">{notice.id}</div>
          </div>
          <div className="notice-actions">
            <button 
              className={`bookmark-btn ${isBookmarked(notice.id) ? 'bookmarked' : ''}`}
              onClick={() => toggleBookmark(notice.id)}
            >
              <FontAwesomeIcon icon={faBookmark} />
            </button>
          </div>
        </div>

        <div className="notice-body">
          <div className="notice-title-section">
            <h3>{notice.title}</h3>
            <div className={`priority-badge ${notice.priority}`} style={{ 
              backgroundColor: priorityInfo.bgColor,
              color: priorityInfo.color
            }}>
              <FontAwesomeIcon icon={priorityInfo.icon} />
              <span>{priorityInfo.label}</span>
            </div>
          </div>

          <div className="notice-content">
            <p>{notice.content}</p>
          </div>

          <div className="notice-meta">
            <div className="meta-item">
              <FontAwesomeIcon icon={faUser} />
              <span>Issued by: <strong>{notice.issuedBy}</strong></span>
            </div>
            <div className="meta-item">
              <FontAwesomeIcon icon={faCalendarAlt} />
              <span>Issued: {formatDate(notice.issueDate)}</span>
            </div>
            {notice.effectiveDate && (
              <div className="meta-item">
                <FontAwesomeIcon icon={faClock} />
                <span>Effective: {formatDate(notice.effectiveDate)}</span>
              </div>
            )}
          </div>

          {notice.attachments.length > 0 && (
            <div className="notice-attachments">
              <strong>Attachments:</strong>
              <div className="attachments-list">
                {notice.attachments.map((attachment, index) => (
                  <div key={index} className="attachment-item">
                    <FontAwesomeIcon icon={faDownload} />
                    <span>{attachment}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="notice-stats">
            <div className="stat-item">
              <FontAwesomeIcon icon={faEye} />
              <span>{notice.views} views</span>
            </div>
            <div className="stat-item">
              {notice.isActive ? (
                <>
                  <FontAwesomeIcon icon={faCheckCircle} className="active" />
                  <span>Active</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faTimesCircle} className="expired" />
                  <span>Expired</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="notice-footer">
          <button className="btn btn-outline small">
            <FontAwesomeIcon icon={faShare} />
            Share
          </button>
          {notice.attachments.length > 0 && (
            <button className="btn btn-primary small">
              <FontAwesomeIcon icon={faDownload} />
              Download
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="notices-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>
            <FontAwesomeIcon icon={faBullhorn} />
            Notices & Announcements
          </h1>
          <p>Stay updated with important announcements, alerts, and notifications</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <FontAwesomeIcon icon={faBell} />
            <span>{getActiveNoticesCount()} Active</span>
          </div>
          <div className="stat-badge">
            <FontAwesomeIcon icon={faClock} />
            <span>{getExpiredNoticesCount()} Expired</span>
          </div>
        </div>
      </div>

      {/* Emergency Alert Banner */}
      <div className="emergency-alert">
        <div className="alert-content">
          <FontAwesomeIcon icon={faExclamationTriangle} className="alert-icon" />
          <div className="alert-text">
            <strong>Emergency Alert:</strong> Power maintenance scheduled on January 25, 2024. Please check notice board for details.
          </div>
        </div>
        <button className="alert-action">
          View Details
        </button>
      </div>

      {/* Controls Section */}
      <div className="controls-section">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search notices by title, content, or issuer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filters">
          {noticeCategories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
              style={{ 
                borderColor: category.color,
                color: activeCategory === category.id ? 'white' : category.color,
                backgroundColor: activeCategory === category.id ? category.color : 'transparent'
              }}
            >
              {category.name}
              <span className="category-count">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notices Grid */}
      <div className="notices-content">
        {filteredNotices.length > 0 ? (
          <div className="notices-grid">
            {filteredNotices.map(renderNoticeCard)}
          </div>
        ) : (
          <div className="empty-state">
            <FontAwesomeIcon icon={faBullhorn} className="empty-icon" />
            <h4>No Notices Found</h4>
            <p>
              {searchTerm ? 'Try changing your search terms' : 'No notices to display for this category'}
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats Sidebar */}
      <div className="stats-sidebar">
        <div className="sidebar-card">
          <h3>Notice Statistics</h3>
          <div className="stats-list">
            <div className="stat-item">
              <div className="stat-icon total">
                <FontAwesomeIcon icon={faBullhorn} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{noticesData.length}</span>
                <span className="stat-label">Total Notices</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon active">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{getActiveNoticesCount()}</span>
                <span className="stat-label">Active Notices</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon emergency">
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
              <div className="stat-content">
                <span className="stat-value">
                  {noticesData.filter(n => n.priority === 'high').length}
                </span>
                <span className="stat-label">Emergency</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon bookmarked">
                <FontAwesomeIcon icon={faBookmark} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{bookmarkedNotices.length}</span>
                <span className="stat-label">Bookmarked</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-card">
          <h3>Recent Activities</h3>
          <div className="activities-list">
            <div className="activity-item">
              <div className="activity-icon new">
                <FontAwesomeIcon icon={faBullhorn} />
              </div>
              <div className="activity-content">
                <p>New emergency notice issued</p>
                <span>2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon update">
                <FontAwesomeIcon icon={faInfoCircle} />
              </div>
              <div className="activity-content">
                <p>Exam schedule updated</p>
                <span>1 day ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon expired">
                <FontAwesomeIcon icon={faTimesCircle} />
              </div>
              <div className="activity-content">
                <p>3 notices expired</p>
                <span>2 days ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-card">
          <h3>Important Links</h3>
          <div className="links-list">
            <a href="#academic-calendar" className="link-item">
              <FontAwesomeIcon icon={faCalendarAlt} />
              Academic Calendar
            </a>
            <a href="#hostel-rules" className="link-item">
              <FontAwesomeIcon icon={faInfoCircle} />
              Hostel Rules
            </a>
            <a href="#emergency-contacts" className="link-item">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              Emergency Contacts
            </a>
            <a href="#faq" className="link-item">
              <FontAwesomeIcon icon={faInfoCircle} />
              FAQ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notices;