import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Toast } from '../components/Toast';
import {
  Shield,
  Users,
  FileText,
  Sparkles,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Activity,
  UserCheck,
  UserX,
} from 'lucide-react';

export const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [deleteTargetUser, setDeleteTargetUser] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers({ search, role: roleFilter, status: statusFilter }),
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
        setRecentLogs(statsRes.recentLogs || []);
      }

      if (usersRes.success) {
        setUsers(usersRes.users || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [search, roleFilter, statusFilter]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.updateUserRole(userId, newRole);
      if (res.success) {
        showToast(res.message);
        fetchAdminData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update role', 'error');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await api.toggleUserStatus(userId);
      if (res.success) {
        showToast(res.message);
        fetchAdminData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to toggle status', 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTargetUser) return;
    try {
      const res = await api.deleteAdminUser(deleteTargetUser._id);
      if (res.success) {
        showToast(res.message, 'info');
        setDeleteTargetUser(null);
        fetchAdminData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete user', 'error');
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
          }}
        >
          <Shield size={24} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800 }}>Admin Console & Telemetry</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage platform users, roles, system health, and review real-time audit logs.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Users</span>
              <Users size={18} color="#6366f1" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalUsers || 0}</div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>
              {stats.activeUsers || 0} Active • {stats.suspendedUsers || 0} Suspended
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Notes</span>
              <FileText size={18} color="#06b6d4" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalNotes || 0}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Stored in MongoDB database
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>AI Summaries</span>
              <Sparkles size={18} color="#ec4899" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalSummaries || 0}</div>
            <div style={{ fontSize: '0.75rem', color: '#ec4899', marginTop: '4px' }}>
              Multi-modal AI processed
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Admin Accounts</span>
              <Shield size={18} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.adminUsers || 0}</div>
            <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '4px' }}>
              Full RBAC privileged
            </div>
          </div>
        </div>
      )}

      {/* Users Management Section */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>User Accounts Management</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Search, promote roles, suspend, or delete user accounts
            </p>
          </div>

          {/* Search & Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px' }} />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: '8px 14px 8px 34px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            >
              <option value="all" style={{ background: 'var(--bg-elevated)' }}>All Roles</option>
              <option value="user" style={{ background: 'var(--bg-elevated)' }}>Users Only</option>
              <option value="admin" style={{ background: 'var(--bg-elevated)' }}>Admins Only</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            >
              <option value="all" style={{ background: 'var(--bg-elevated)' }}>All Statuses</option>
              <option value="active" style={{ background: 'var(--bg-elevated)' }}>Active</option>
              <option value="suspended" style={{ background: 'var(--bg-elevated)' }}>Suspended</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px' }}>User</th>
                <th style={{ padding: '12px 14px' }}>Email</th>
                <th style={{ padding: '12px 14px' }}>Role</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px' }}>Notes Created</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.88rem' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=6366f1&color=fff`}
                        alt={u.name}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        background: u.role === 'admin' ? 'rgba(236, 72, 153, 0.15)' : 'var(--bg-input)',
                        color: u.role === 'admin' ? '#f472b6' : 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="user" style={{ background: 'var(--bg-elevated)' }}>user</option>
                      <option value="admin" style={{ background: 'var(--bg-elevated)' }}>admin</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: u.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                        color: u.status === 'active' ? '#34d399' : '#fb7185',
                      }}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                    {u.totalNotes || 0} notes ({u.totalSummaries || 0} summarized)
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        className="btn-icon"
                        style={{ width: '30px', height: '30px' }}
                        onClick={() => handleToggleStatus(u._id)}
                        title={u.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                      >
                        {u.status === 'active' ? <UserX size={15} color="#f59e0b" /> : <UserCheck size={15} color="#10b981" />}
                      </button>
                      <button
                        className="btn-icon"
                        style={{ width: '30px', height: '30px' }}
                        onClick={() => setDeleteTargetUser(u)}
                        title="Delete User and Data"
                      >
                        <Trash2 size={15} color="#f43f5e" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Activity Audit Feed */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Activity size={18} color="#6366f1" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Real-time Audit Logs</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recentLogs.map((log) => (
            <div
              key={log._id}
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: '#818cf8',
                  }}
                >
                  {log.action}
                </span>
                <span style={{ color: 'var(--text-primary)' }}>{log.details}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Delete User Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTargetUser}
        title="Delete User Account"
        message={`Are you sure you want to permanently delete user "${deleteTargetUser?.email}" and all associated notes?`}
        confirmText="Delete User"
        isDanger={true}
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteTargetUser(null)}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
};
