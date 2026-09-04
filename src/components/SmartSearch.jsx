import React from 'react';
import { Search, X, ArrowUpDown, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

export const SmartSearch = ({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalResults,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '20px',
      }}
    >
      {/* Search Input */}
      <div
        style={{
          position: 'relative',
          flex: '1 1 320px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Search
          size={18}
          color="var(--text-muted)"
          style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Smart search notes, summaries, keywords, or tags..."
          style={{
            width: '100%',
            padding: '12px 40px 12px 42px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'var(--transition)',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--border-focus)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            style={{
              position: 'absolute',
              right: '12px',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px',
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Sorting and View Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Sort Select */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-input)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
          }}
        >
          <ArrowUpDown size={15} color="var(--text-muted)" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: 500,
              outline: 'none',
              cursor: 'pointer',
              padding: '6px 0',
            }}
          >
            <option value="newest" style={{ background: 'var(--bg-elevated)' }}>
              Newest First
            </option>
            <option value="oldest" style={{ background: 'var(--bg-elevated)' }}>
              Oldest First
            </option>
            <option value="title-asc" style={{ background: 'var(--bg-elevated)' }}>
              Title (A-Z)
            </option>
            <option value="title-desc" style={{ background: 'var(--bg-elevated)' }}>
              Title (Z-A)
            </option>
            <option value="priority" style={{ background: 'var(--bg-elevated)' }}>
              High Priority
            </option>
          </select>
        </div>

        {/* View Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            padding: '3px',
            border: '1px solid var(--border-color)',
          }}
        >
          <button
            onClick={() => onViewModeChange('grid')}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              background: viewMode === 'grid' ? 'var(--accent-primary)' : 'transparent',
              color: viewMode === 'grid' ? '#ffffff' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Grid View"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              background: viewMode === 'list' ? 'var(--accent-primary)' : 'transparent',
              color: viewMode === 'list' ? '#ffffff' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
            title="List View"
          >
            <List size={16} />
          </button>
        </div>

        {/* Results Badge */}
        <span
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {totalResults} {totalResults === 1 ? 'note' : 'notes'}
        </span>
      </div>
    </div>
  );
};
