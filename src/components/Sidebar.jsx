import React from 'react';
import {
  Folder,
  GraduationCap,
  Briefcase,
  FlaskConical,
  Lightbulb,
  Users,
  User,
  Star,
  Pin,
  Sparkles,
  Tag,
  Zap,
} from 'lucide-react';

export const Sidebar = ({
  activeCategory,
  onSelectCategory,
  categoryCounts = {},
  filterPinned,
  onToggleFilterPinned,
  filterFavorite,
  onToggleFilterFavorite,
  filterHasAi,
  onToggleFilterHasAi,
  tags = [],
  activeTag,
  onSelectTag,
}) => {
  const categories = [
    { id: 'All', label: 'All Notes', icon: Folder, color: '#6366f1' },
    { id: 'Study', label: 'Study & Academics', icon: GraduationCap, color: '#818cf8' },
    { id: 'Work', label: 'Work & Projects', icon: Briefcase, color: '#ec4899' },
    { id: 'Research', label: 'Research & Science', icon: FlaskConical, color: '#06b6d4' },
    { id: 'Ideas', label: 'Ideas & Innovation', icon: Lightbulb, color: '#f59e0b' },
    { id: 'Meeting', label: 'Meetings & Syncs', icon: Users, color: '#10b981' },
    { id: 'Personal', label: 'Personal & Journal', icon: User, color: '#a855f7' },
  ];

  return (
    <aside
      style={{
        width: '270px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        padding: '24px 16px',
        height: 'calc(100vh - 70px)',
        position: 'sticky',
        top: '70px',
        overflowY: 'auto',
        borderRight: '1px solid var(--border-color)',
        background: 'var(--bg-glass)',
      }}
    >
      {/* Categories */}
      <div>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            padding: '0 8px',
            marginBottom: '10px',
          }}
        >
          Categories
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            const count = cat.id === 'All'
              ? Object.values(categoryCounts).reduce((a, b) => a + b, 0)
              : categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: isSelected ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                  fontWeight: isSelected ? 600 : 500,
                  fontSize: '0.88rem',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'var(--bg-input)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={16} color={cat.color} />
                  <span>{cat.label}</span>
                </div>
                {count > 0 && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-full)',
                      background: isSelected ? 'var(--accent-primary)' : 'var(--bg-input)',
                      color: isSelected ? '#ffffff' : 'var(--text-muted)',
                      fontWeight: 600,
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            padding: '0 8px',
            marginBottom: '10px',
          }}
        >
          Quick Filters
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button
            onClick={onToggleFilterPinned}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              background: filterPinned ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: filterPinned ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: filterPinned ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
              fontSize: '0.88rem',
              fontWeight: 500,
              transition: 'var(--transition)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Pin size={16} color="#6366f1" />
              <span>Pinned Notes</span>
            </div>
            {filterPinned && <span style={{ fontSize: '0.75rem', color: '#818cf8' }}>Active</span>}
          </button>

          <button
            onClick={onToggleFilterFavorite}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              background: filterFavorite ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              color: filterFavorite ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: filterFavorite ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
              fontSize: '0.88rem',
              fontWeight: 500,
              transition: 'var(--transition)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Star size={16} color="#f59e0b" fill={filterFavorite ? '#f59e0b' : 'none'} />
              <span>Favorites</span>
            </div>
            {filterFavorite && <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>Active</span>}
          </button>

          <button
            onClick={onToggleFilterHasAi}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              background: filterHasAi ? 'rgba(236, 72, 153, 0.15)' : 'transparent',
              color: filterHasAi ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: filterHasAi ? '1px solid rgba(236, 72, 153, 0.3)' : '1px solid transparent',
              fontSize: '0.88rem',
              fontWeight: 500,
              transition: 'var(--transition)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={16} color="#ec4899" />
              <span>AI Summarized</span>
            </div>
            {filterHasAi && <span style={{ fontSize: '0.75rem', color: '#ec4899' }}>Active</span>}
          </button>
        </div>
      </div>

      {/* Tags Cloud */}
      {tags.length > 0 && (
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              padding: '0 8px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Tag size={13} />
            <span>Tags</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '0 4px' }}>
            {tags.map((tag) => {
              const isSelected = activeTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => onSelectTag(isSelected ? 'All' : tag)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: isSelected ? 'var(--accent-primary)' : 'var(--bg-input)',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                    transition: 'var(--transition)',
                  }}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Assistant Quick Info Card */}
      <div
        className="glass-panel"
        style={{
          marginTop: 'auto',
          padding: '16px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Zap size={16} color="#6366f1" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Smart AI Assistant
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          Generate instant bullet points, flashcards, and ELI5 summaries from any note!
        </p>
      </div>
    </aside>
  );
};
