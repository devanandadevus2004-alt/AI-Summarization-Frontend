import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, Tag as TagIcon, Palette } from 'lucide-react';

export const NoteEditorModal = ({
  isOpen,
  initialNote = null,
  onClose,
  onSave,
  onOpenAiForDraft,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState('Medium');
  const [color, setColor] = useState('#6366f1');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [isPinned, setIsPinned] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const colors = [
    { label: 'Indigo', value: '#6366f1' },
    { label: 'Rose', value: '#ec4899' },
    { label: 'Cyan', value: '#06b6d4' },
    { label: 'Emerald', value: '#10b981' },
    { label: 'Amber', value: '#f59e0b' },
    { label: 'Purple', value: '#a855f7' },
  ];

  const categories = ['Study', 'Work', 'Research', 'Ideas', 'Meeting', 'Personal', 'General'];

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title || '');
      setContent(initialNote.content || '');
      setCategory(initialNote.category || 'General');
      setPriority(initialNote.priority || 'Medium');
      setColor(initialNote.color || '#6366f1');
      setTags(initialNote.tags || []);
      setIsPinned(initialNote.isPinned || false);
      setIsFavorite(initialNote.isFavorite || false);
    } else {
      setTitle('');
      setContent('');
      setCategory('General');
      setPriority('Medium');
      setColor('#6366f1');
      setTags([]);
      setIsPinned(false);
      setIsFavorite(false);
    }
  }, [initialNote, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSave({
      _id: initialNote?._id,
      title: title.trim(),
      content: content.trim(),
      category,
      priority,
      color,
      tags,
      isPinned,
      isFavorite,
    });
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '780px', maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: color,
                boxShadow: `0 0 10px ${color}`,
              }}
            />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {initialNote ? 'Edit Note' : 'Create New Note'}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {content.length > 30 && (
              <button
                type="button"
                className="btn-secondary"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.82rem',
                  borderColor: 'rgba(236, 72, 153, 0.4)',
                  color: '#f472b6',
                }}
                onClick={() => onOpenAiForDraft({ title, content, _id: initialNote?._id })}
              >
                <Sparkles size={14} color="#ec4899" />
                <span>AI Studio</span>
              </button>
            )}
            <button
              onClick={onClose}
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
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Title */}
            <div>
              <input
                type="text"
                placeholder="Note Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  width: '100%',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--border-focus)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
              />
            </div>

            {/* Meta Row: Category, Priority, Color Accent */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '14px' }}>
              {/* Category */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} style={{ background: 'var(--bg-elevated)' }}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                >
                  <option value="Low" style={{ background: 'var(--bg-elevated)' }}>Low</option>
                  <option value="Medium" style={{ background: 'var(--bg-elevated)' }}>Medium</option>
                  <option value="High" style={{ background: 'var(--bg-elevated)' }}>High</option>
                </select>
              </div>

              {/* Color Preset */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Accent Color
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '4px' }}>
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(c.value)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: c.value,
                        border: color === c.value ? '2px solid #ffffff' : '2px solid transparent',
                        boxShadow: color === c.value ? `0 0 10px ${c.value}` : 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        transform: color === c.value ? 'scale(1.15)' : 'scale(1)',
                      }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Note Content Textarea */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Note Content & Body
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {wordCount} words
                </span>
              </div>
              <textarea
                placeholder="Write your note, study material, meeting takeaways, or research ideas here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={11}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem',
                  lineHeight: 1.6,
                  resize: 'vertical',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--border-focus)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
              />
            </div>

            {/* Tags Manager */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Tags
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="Add a tag (e.g. AI, Calculus, Roadmap)..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '8px 14px' }}
                  onClick={handleAddTag}
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
              </div>

              {tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.78rem',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: '#818cf8',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                      }}
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#818cf8',
                          cursor: 'pointer',
                          display: 'flex',
                        }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div
            style={{
              padding: '16px 24px',
              background: 'var(--bg-input)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                />
                <span>Pin to top</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                />
                <span>Add to favorites</span>
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {initialNote ? 'Save Changes' : 'Create Note'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
