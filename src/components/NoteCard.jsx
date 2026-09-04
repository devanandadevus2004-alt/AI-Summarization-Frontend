import React from 'react';
import {
  Pin,
  Star,
  Sparkles,
  Edit3,
  Trash2,
  Download,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const NoteCard = ({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleFavorite,
  onOpenAiStudio,
  onExport,
  viewMode = 'grid',
}) => {
  const categoryClasses = {
    Study: 'badge-study',
    Work: 'badge-work',
    Research: 'badge-research',
    Ideas: 'badge-ideas',
    Meeting: 'badge-meeting',
    Personal: 'badge-personal',
    General: 'badge-general',
  };

  const priorityClasses = {
    High: 'badge-priority-high',
    Medium: 'badge-priority-medium',
    Low: 'badge-priority-low',
  };

  const wordCount = note.content ? note.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const formattedDate = new Date(note.updatedAt || note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const hasAi = !!(note.aiSummary && note.aiSummary.summary);

  if (viewMode === 'list') {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          borderRadius: 'var(--radius-md)',
          borderLeft: `4px solid ${note.color || '#6366f1'}`,
          transition: 'var(--transition)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 auto', minWidth: 0 }}>
          {/* Pin & Favorite */}
          <button
            onClick={() => onTogglePin(note._id)}
            style={{
              color: note.isPinned ? '#818cf8' : 'var(--text-muted)',
              display: 'flex',
              padding: '4px',
            }}
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin size={17} style={{ transform: note.isPinned ? 'rotate(45deg)' : 'none' }} />
          </button>
          <button
            onClick={() => onToggleFavorite(note._id)}
            style={{
              color: note.isFavorite ? '#f59e0b' : 'var(--text-muted)',
              display: 'flex',
              padding: '4px',
            }}
            title={note.isFavorite ? 'Remove favorite' : 'Add favorite'}
          >
            <Star size={17} fill={note.isFavorite ? '#f59e0b' : 'none'} />
          </button>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
              <h4
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  cursor: 'pointer',
                }}
                onClick={() => onEdit(note)}
              >
                {note.title}
              </h4>
              <span className={`badge ${categoryClasses[note.category] || 'badge-general'}`}>
                {note.category}
              </span>
              {hasAi && (
                <span
                  className="badge ai-pulse-badge"
                  style={{ fontSize: '0.65rem' }}
                >
                  AI Summarized
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '600px',
              }}
            >
              {note.content}
            </p>
          </div>
        </div>

        {/* Date & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{formattedDate}</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              className="btn-icon"
              style={{ width: '32px', height: '32px' }}
              onClick={() => onOpenAiStudio(note)}
              title="AI Summarizer Studio"
            >
              <Sparkles size={15} color="#ec4899" />
            </button>
            <button
              className="btn-icon"
              style={{ width: '32px', height: '32px' }}
              onClick={() => onEdit(note)}
              title="Edit Note"
            >
              <Edit3 size={15} />
            </button>
            <button
              className="btn-icon"
              style={{ width: '32px', height: '32px' }}
              onClick={() => onExport(note)}
              title="Export Note"
            >
              <Download size={15} />
            </button>
            <button
              className="btn-icon"
              style={{ width: '32px', height: '32px' }}
              onClick={() => onDelete(note._id)}
              title="Delete Note"
            >
              <Trash2 size={15} color="#f43f5e" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid Card View
  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 'var(--radius-lg)',
        padding: '22px',
        borderLeft: `4px solid ${note.color || '#6366f1'}`,
        position: 'relative',
        transition: 'var(--transition)',
        minHeight: '280px',
      }}
    >
      {/* Top Meta Bar */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`badge ${categoryClasses[note.category] || 'badge-general'}`}>
              {note.category}
            </span>
            <span className={`badge ${priorityClasses[note.priority] || 'badge-priority-medium'}`}>
              {note.priority}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => onTogglePin(note._id)}
              style={{
                color: note.isPinned ? '#818cf8' : 'var(--text-muted)',
                background: note.isPinned ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                borderRadius: 'var(--radius-sm)',
                padding: '5px',
                display: 'flex',
              }}
              title={note.isPinned ? 'Unpin note' : 'Pin note'}
            >
              <Pin size={16} style={{ transform: note.isPinned ? 'rotate(45deg)' : 'none' }} />
            </button>
            <button
              onClick={() => onToggleFavorite(note._id)}
              style={{
                color: note.isFavorite ? '#f59e0b' : 'var(--text-muted)',
                background: note.isFavorite ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                borderRadius: 'var(--radius-sm)',
                padding: '5px',
                display: 'flex',
              }}
              title={note.isFavorite ? 'Remove favorite' : 'Add favorite'}
            >
              <Star size={16} fill={note.isFavorite ? '#f59e0b' : 'none'} />
            </button>
          </div>
        </div>

        {/* Note Title */}
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            marginBottom: '10px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            lineHeight: 1.35,
          }}
          onClick={() => onEdit(note)}
        >
          {note.title}
        </h3>

        {/* Content Excerpt */}
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: hasAi ? 3 : 5,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {note.content}
        </p>

        {/* AI Summary Highlight Box (if available) */}
        {hasAi && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.08))',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              marginBottom: '14px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color="#ec4899" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f472b6' }}>
                  AI Summary
                </span>
              </div>
              {note.aiSummary.wordReductionPercent > 0 && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#34d399',
                    background: 'rgba(16, 185, 129, 0.15)',
                    padding: '1px 6px',
                    borderRadius: '4px',
                  }}
                >
                  ↓ {note.aiSummary.wordReductionPercent}% saved
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-primary)',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {note.aiSummary.summary}
            </p>
          </div>
        )}

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: '16px',
            }}
          >
            {note.tags.map((t, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-color)',
                }}
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Metadata & Actions */}
      <div
        style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '14px',
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Clock size={13} />
          <span>{formattedDate}</span>
          <span>•</span>
          <span>{wordCount} words</span>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            className="btn-icon"
            style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2))',
              borderColor: 'rgba(99, 102, 241, 0.3)',
            }}
            onClick={() => onOpenAiStudio(note)}
            title="Open AI Summarizer Studio"
          >
            <Sparkles size={15} color="#ec4899" />
          </button>
          <button
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
            onClick={() => onEdit(note)}
            title="Edit Note"
          >
            <Edit3 size={15} />
          </button>
          <button
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
            onClick={() => onExport(note)}
            title="Export Note as Markdown"
          >
            <Download size={15} />
          </button>
          <button
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
            onClick={() => onDelete(note._id)}
            title="Delete Note"
          >
            <Trash2 size={15} color="#f43f5e" />
          </button>
        </div>
      </div>
    </div>
  );
};
