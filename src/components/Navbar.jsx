import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sparkles,
  Plus,
  BookOpen,
  Shield,
  Sun,
  Moon,
  LogOut,
  User,
  Key,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react';

export const Navbar = ({ currentTab, onSelectTab, onOpenNewNote, onOpenApiKeyModal }) => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0 24px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Brand Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
        }}
        onClick={() => onSelectTab('dashboard')}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
          }}
        >
          <Sparkles size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '-0.5px',
              }}
              className="gradient-text"
            >
              Notes.AI
            </span>
            <span
              className="ai-pulse-badge"
              style={{
                fontSize: '0.65rem',
                padding: '2px 6px',
                borderRadius: '6px',
                textTransform: 'uppercase',
              }}
            >
              Smart AI
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '-2px' }}>
            Summarizer & Knowledge Base
          </p>
        </div>
      </div>

      {/* Center Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className={`btn-secondary ${currentTab === 'dashboard' ? 'active' : ''}`}
          style={{
            padding: '8px 16px',
            fontSize: '0.88rem',
            background: currentTab === 'dashboard' ? 'var(--accent-primary)' : 'transparent',
            color: currentTab === 'dashboard' ? '#ffffff' : 'var(--text-secondary)',
            borderColor: currentTab === 'dashboard' ? 'var(--accent-primary)' : 'transparent',
          }}
          onClick={() => onSelectTab('dashboard')}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>

        <button
          className={`btn-secondary ${currentTab === 'study' ? 'active' : ''}`}
          style={{
            padding: '8px 16px',
            fontSize: '0.88rem',
            background: currentTab === 'study' ? 'var(--accent-primary)' : 'transparent',
            color: currentTab === 'study' ? '#ffffff' : 'var(--text-secondary)',
            borderColor: currentTab === 'study' ? 'var(--accent-primary)' : 'transparent',
          }}
          onClick={() => onSelectTab('study')}
        >
          <BookOpen size={16} />
          <span>Study Center</span>
        </button>

        {isAdmin && (
          <button
            className={`btn-secondary ${currentTab === 'admin' ? 'active' : ''}`}
            style={{
              padding: '8px 16px',
              fontSize: '0.88rem',
              background: currentTab === 'admin' ? 'var(--accent-primary)' : 'transparent',
              color: currentTab === 'admin' ? '#ffffff' : 'var(--text-secondary)',
              borderColor: currentTab === 'admin' ? 'var(--accent-primary)' : 'transparent',
            }}
            onClick={() => onSelectTab('admin')}
          >
            <Shield size={16} />
            <span>Admin Console</span>
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Create Note Trigger */}
        <button
          className="btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.88rem' }}
          onClick={onOpenNewNote}
        >
          <Plus size={18} />
          <span>New Note</span>
        </button>

        {/* Theme Switcher */}
        <button
          className="btn-icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Profile Menu */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              padding: '4px 10px 4px 4px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              transition: 'var(--transition)',
            }}
          >
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name || 'User'
                )}&background=6366f1&color=fff`
              }
              alt="Avatar"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  maxWidth: '110px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.name || 'User'}
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  color: isAdmin ? '#818cf8' : 'var(--text-muted)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                {user?.role || 'user'}
              </span>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </div>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: '240px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '8px',
                zIndex: 200,
                animation: 'scaleUp 0.15s ease-out',
              }}
            >
              <div
                style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid var(--border-color)',
                  marginBottom: '6px',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user?.email}</div>
              </div>

              <button
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-input)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                onClick={() => {
                  setDropdownOpen(false);
                  onOpenApiKeyModal();
                }}
              >
                <Key size={16} color="#06b6d4" />
                <span>Configure Gemini API Key</span>
              </button>

              <button
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  fontSize: '0.85rem',
                  color: '#f43f5e',
                  borderRadius: 'var(--radius-sm)',
                  marginTop: '4px',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                onClick={logout}
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
