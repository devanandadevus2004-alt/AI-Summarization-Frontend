import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 size={20} color="#10b981" />,
    error: <AlertCircle size={20} color="#f43f5e" />,
    info: <Info size={20} color="#06b6d4" />,
  };

  const borderColors = {
    success: 'rgba(16, 185, 129, 0.4)',
    error: 'rgba(244, 63, 94, 0.4)',
    info: 'rgba(6, 182, 212, 0.4)',
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 20px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-elevated)',
        color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-lg)',
        border: `1px solid ${borderColors[type] || 'var(--border-color)'}`,
        backdropFilter: 'blur(12px)',
        animation: 'scaleUp 0.25s ease-out',
        maxWidth: '420px',
      }}
    >
      {icons[type] || icons.info}
      <span style={{ fontSize: '0.95rem', fontWeight: 500, flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
