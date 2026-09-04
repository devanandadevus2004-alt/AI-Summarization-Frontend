import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmationModal = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDanger = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-content"
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '24px 24px 16px 24px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-full)',
              background: isDanger ? 'rgba(244, 63, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={22} color={isDanger ? '#f43f5e' : '#6366f1'} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{message}</p>
          </div>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            padding: '16px 24px',
            background: 'var(--bg-input)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <button className="btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className="btn-primary"
            style={
              isDanger
                ? {
                    background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                    boxShadow: '0 0 15px rgba(244, 63, 94, 0.35)',
                  }
                : {}
            }
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
