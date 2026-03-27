// Profile.tsx — UI only; all data logic lives in Profile.queries.ts

import React, { useState } from 'react';
import './Profile.css';
import { useProfileQuery, useUpdateProfileMutation } from './profile.queries';
import type { EditableFields, TabId } from './profile.types';
import { useCustom } from '../../context/Store';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string): string => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-PK', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
};

const getInitials = (name: string): string =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const AcademicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const SaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const DoorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
    <path d="M14 12h.01"/>
  </svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`skeleton ${className}`} aria-hidden="true" />
);

// ─── InfoRow ──────────────────────────────────────────────────────────────────

interface InfoRowProps {
  label: string;
  value?: string | number;
  icon?: React.ReactNode;
  readOnly?: boolean;
  loading?: boolean;
  isEditing?: boolean;
  editNode?: React.ReactNode;
  fullWidth?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({
  label, value, icon, readOnly, loading, isEditing, editNode, fullWidth,
}) => (
  <div className={`info-item${fullWidth ? ' full-width' : ''}`}>
    <label className="info-label">
      {icon && <span className="label-icon">{icon}</span>}
      {label}
    </label>
    {loading ? (
      <Skeleton className="value-skeleton" />
    ) : isEditing && editNode && !readOnly ? (
      editNode
    ) : (
      <p className={`info-value${readOnly ? ' locked' : ''}`}>
        {value ?? '—'}
        {readOnly && <span className="lock-badge" title="Read-only"><LockIcon /></span>}
      </p>
    )}
  </div>
);

// ─── Profile ──────────────────────────────────────────────────────────────────

const Profile: React.FC = () => {
  const {token}=useCustom() as {token:string};
  const { data: profile, isLoading, isError, error, refetch } = useProfileQuery(token);
  const updateMutation = useUpdateProfileMutation(token,{});

  const [activeTab,   setActiveTab]   = useState<TabId>('personal');
  const [isEditing,   setIsEditing]   = useState(false);
  const [editData,    setEditData]    = useState<EditableFields | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ── Edit handlers ──────────────────────────────────────────────────────────

  const handleEdit = () => {
    if (!profile) return;
    setEditData({
      cnic_no:           profile.cnic_no ?? '',
      date_of_birth:     profile.date_of_birth?.slice(0, 10) ?? '',
      gender:            profile.gender ?? 'Male',
      blood_group:       profile.blood_group ?? '',
      student_email:     profile.student_email ?? '',
      student_cellphone: profile.student_cellphone ?? '',
      emergency_contact: profile.emergency_contact ?? '',
      postal_address:    profile.postal_address ?? '',
      permanent_address: profile.permanent_address ?? '',
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(null);
  };

  const handleSave = async () => {
    if (!editData) return;
    await updateMutation.mutateAsync(editData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setIsEditing(false);
    setEditData(null);
  };

  const setField = (field: keyof EditableFields, value: string) =>
    setEditData((prev) => (prev ? { ...prev, [field]: value } : prev));

  // ── Tabs ───────────────────────────────────────────────────────────────────

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'personal', label: 'Personal', icon: <UserIcon /> },
    { id: 'contact',  label: 'Contact',  icon: <MailIcon /> },
    { id: 'academic', label: 'Academic', icon: <AcademicIcon /> },
  ];

  const d = profile;

  // ── Panels ─────────────────────────────────────────────────────────────────

  const renderPersonal = () => (
    <div className="info-grid">
      <InfoRow label="Full Name"      value={d?.student_name}    loading={isLoading} readOnly />
      <InfoRow label="Roll Number"    value={d?.student_roll_no} loading={isLoading} readOnly />
      <InfoRow
        label="CNIC"
        value={isEditing && editData ? editData.cnic_no : d?.cnic_no}
        loading={isLoading}
        isEditing={isEditing}
        editNode={
          <input className="edit-input" type="text" placeholder="XXXXX-XXXXXXX-X"
            value={editData?.cnic_no ?? ''}
            onChange={(e) => setField('cnic_no', e.target.value)} />
        }
      />
      <InfoRow
        label="Date of Birth"
        value={isEditing && editData ? editData.date_of_birth : formatDate(d?.date_of_birth ?? '')}
        loading={isLoading}
        isEditing={isEditing}
        editNode={
          <input className="edit-input" type="date"
            value={editData?.date_of_birth ?? ''}
            onChange={(e) => setField('date_of_birth', e.target.value)} />
        }
      />
      <InfoRow
        label="Gender"
        value={isEditing && editData ? editData.gender : d?.gender}
        loading={isLoading}
        isEditing={isEditing}
        editNode={
          <select className="edit-input" value={editData?.gender ?? 'Male'}
            onChange={(e) => setField('gender', e.target.value)}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        }
      />
      <InfoRow
        label="Blood Group"
        value={isEditing && editData ? editData.blood_group : d?.blood_group}
        loading={isLoading}
        isEditing={isEditing}
        editNode={
          <select className="edit-input" value={editData?.blood_group ?? ''}
            onChange={(e) => setField('blood_group', e.target.value)}>
            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        }
      />
      <InfoRow label="Hostel Join Date" value={formatDate(d?.hostelJoinDate ?? '')} loading={isLoading} readOnly />
    </div>
  );

  const renderContact = () => (
    <div className="info-grid">
      <InfoRow
        label="Email Address" icon={<MailIcon />}
        value={isEditing && editData ? editData.student_email : d?.student_email}
        loading={isLoading} isEditing={isEditing}
        editNode={
          <input className="edit-input" type="email"
            value={editData?.student_email ?? ''}
            onChange={(e) => setField('student_email', e.target.value)} />
        }
      />
      <InfoRow
        label="Phone Number" icon={<PhoneIcon />}
        value={isEditing && editData ? editData.student_cellphone : d?.student_cellphone}
        loading={isLoading} isEditing={isEditing}
        editNode={
          <input className="edit-input" type="tel"
            value={editData?.student_cellphone ?? ''}
            onChange={(e) => setField('student_cellphone', e.target.value)} />
        }
      />
      <InfoRow
        label="Emergency Contact" icon={<PhoneIcon />}
        value={isEditing && editData ? editData.emergency_contact : d?.emergency_contact}
        loading={isLoading} isEditing={isEditing}
        editNode={
          <input className="edit-input" type="tel"
            value={editData?.emergency_contact ?? ''}
            onChange={(e) => setField('emergency_contact', e.target.value)} />
        }
      />
      <InfoRow
        label="Hostel / Current Address" icon={<MapPinIcon />} fullWidth
        value={isEditing && editData ? editData.postal_address : d?.postal_address}
        loading={isLoading} isEditing={isEditing}
        editNode={
          <textarea className="edit-input textarea" rows={3}
            value={editData?.postal_address ?? ''}
            onChange={(e) => setField('postal_address', e.target.value)} />
        }
      />
      <InfoRow
        label="Permanent Address" icon={<MapPinIcon />} fullWidth
        value={isEditing && editData ? editData.permanent_address : d?.permanent_address}
        loading={isLoading} isEditing={isEditing}
        editNode={
          <textarea className="edit-input textarea" rows={3}
            value={editData?.permanent_address ?? ''}
            onChange={(e) => setField('permanent_address', e.target.value)} />
        }
      />
    </div>
  );

  const renderAcademic = () => (
    <div className="info-grid">
      <InfoRow label="University"    value={d?.university ?? 'NED University of Engineering & Technology'} loading={isLoading} readOnly />
      <InfoRow label="Department"    value={d?.department}      loading={isLoading} readOnly />
      <InfoRow label="Semester"      value={d?.semester}        loading={isLoading} readOnly />
      <InfoRow label="Batch"         value={d?.batch}           loading={isLoading} readOnly />
      <InfoRow label="Roll Number"   value={d?.student_roll_no} loading={isLoading} readOnly />
      <InfoRow label="CGPA"          value={d?.cgpa}            loading={isLoading} readOnly />
      <InfoRow label="Room Block"    value={d?.room_id ? `Block ${d.room_id.block}` : undefined} loading={isLoading} readOnly />
      <InfoRow label="Room Capacity" value={d?.room_id ? String(d.room_id.capacity) : undefined} loading={isLoading} readOnly />
    </div>
  );

  // ── Error state ────────────────────────────────────────────────────────────

  if (isError && !isLoading) {
    return (
      <div className="profile-page error-state">
        <div className="error-card">
          <span className="error-icon"><AlertIcon /></span>
          <h2>Failed to load profile</h2>
          <p>{(error as Error)?.message ?? 'Something went wrong.'}</p>
          <button className="btn btn-primary" onClick={() => refetch()}>Try Again</button>
        </div>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────

  return (
    <div className="profile-page">

      <div className="bg-blob blob-1" aria-hidden="true" />
      <div className="bg-blob blob-2" aria-hidden="true" />

      {/* ── Header ── */}
      <header className="profile-header">
        <div className="avatar-wrap">
          <div className="avatar">
            {isLoading
              ? <span className="avatar-skeleton" />
              : <span className="avatar-initials">{getInitials(d?.student_name ?? '')}</span>
            }
          </div>
          <span className={`status-dot ${d?.status === 'Active' ? 'active' : 'inactive'}`} />
        </div>

        <div className="header-info">
          {isLoading ? (
            <><Skeleton className="name-skeleton" /><Skeleton className="sub-skeleton" /></>
          ) : (
            <>
              <h1 className="student-name">{d?.student_name}</h1>
              <p className="student-sub">
                {d?.student_roll_no ?? '—'}
                {d?.department && <><span className="sep">·</span>{d.department}</>}
                {d?.semester   && <><span className="sep">·</span>{d.semester}</>}
              </p>
            </>
          )}
          <div className="badge-row">
            {d?.status     && <span className={`badge badge-status ${d.status === 'Active' ? 'green' : 'red'}`}>{d.status}</span>}
            {d?.room_id    && <span className="badge badge-room"><DoorIcon /> {d.room_id.room_no}</span>}
            {d?.messEnabled && <span className="badge badge-mess">Mess Active</span>}
          </div>
        </div>

        <div className="header-actions">
          {isEditing ? (
            <div className="action-group">
              <button className="btn btn-save" onClick={handleSave} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? <span className="spinner" /> : <SaveIcon />}
                {updateMutation.isPending ? 'Saving…' : 'Save'}
              </button>
              <button className="btn btn-cancel" onClick={handleCancel} disabled={updateMutation.isPending}>
                <XIcon /> Cancel
              </button>
            </div>
          ) : (
            <button className="btn btn-edit" onClick={handleEdit} disabled={isLoading}>
              <EditIcon /> Edit Profile
            </button>
          )}
        </div>
      </header>

      {/* ── Toasts ── */}
      {updateMutation.isError && (
        <div className="toast toast-error" role="alert">
          ✕ {(updateMutation.error as Error)?.message ?? 'Failed to save changes.'}
        </div>
      )}
      {saveSuccess && (
        <div className="toast toast-success" role="status">
          ✓ Profile updated successfully
        </div>
      )}

      {/* ── Body ── */}
      <div className="profile-body">

        <div className="profile-main">
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="panel" key={activeTab}>
            {activeTab === 'personal' && renderPersonal()}
            {activeTab === 'contact'  && renderContact()}
            {activeTab === 'academic' && renderAcademic()}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <aside className="profile-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title">Room Details</h3>
            {isLoading ? (
              <><Skeleton className="stat-skeleton" /><Skeleton className="stat-skeleton" /></>
            ) : d?.room_id ? (
              <ul className="stat-list">
                <li><span>Room No.</span>   <strong>{d.room_id.room_no}</strong></li>
                <li><span>Floor</span>      <strong>{d.room_id.floor}</strong></li>
                <li><span>Block</span>      <strong>{d.room_id.block}</strong></li>
                <li><span>Capacity</span>   <strong>{d.room_id.capacity}</strong></li>
                <li><span>Monthly Fee</span><strong>Rs. {d.room_id.fees?.toLocaleString()}</strong></li>
              </ul>
            ) : (
              <p className="no-data">No room assigned.</p>
            )}
          </div>

          <div className="sidebar-card emergency-card">
            <h3 className="sidebar-title">Emergency Contacts</h3>
            <ul className="emergency-list">
              <li><strong>Warden Office</strong>  <a href="tel:+922112345678">+92 21 1234567</a></li>
              <li><strong>Security</strong>        <a href="tel:+923009876543">+92 300 9876543</a></li>
              <li><strong>Medical Center</strong>  <a href="tel:+922176543210">+92 21 7654321</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Profile;