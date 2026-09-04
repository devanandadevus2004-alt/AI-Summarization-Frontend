import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Sidebar } from '../components/Sidebar';
import { StatsOverview } from '../components/StatsOverview';
import { SmartSearch } from '../components/SmartSearch';
import { NoteCard } from '../components/NoteCard';
import { NoteEditorModal } from '../components/NoteEditorModal';
import { AISummaryModal } from '../components/AISummaryModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Toast } from '../components/Toast';
import { Pin, Sparkles, Plus, AlertCircle } from 'lucide-react';

export const DashboardPage = ({ isNewNoteModalOpen, onCloseNewNoteModal }) => {
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTag, setActiveTag] = useState('All');
  const [filterPinned, setFilterPinned] = useState(false);
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [filterHasAi, setFilterHasAi] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  // Modals state
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiTargetNote, setAiTargetNote] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Toast
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  useEffect(() => {
    if (isNewNoteModalOpen) {
      setSelectedNote(null);
      setIsEditorOpen(true);
    }
  }, [isNewNoteModalOpen]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await api.getNotes({
        search,
        category: activeCategory,
        tag: activeTag,
        isPinned: filterPinned ? 'true' : '',
        isFavorite: filterFavorite ? 'true' : '',
        hasAiSummary: filterHasAi ? 'true' : '',
        sortBy,
      });

      if (res.success) {
        setNotes(res.notes || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load notes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.getNoteStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.warn('Failed to load stats:', err);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await api.getDistinctTags();
      if (res.success) {
        setTags(res.tags || []);
      }
    } catch (err) {
      console.warn('Failed to load tags:', err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [activeCategory, activeTag, filterPinned, filterFavorite, filterHasAi, search, sortBy]);

  useEffect(() => {
    fetchStats();
    fetchTags();
  }, []);

  const handleSaveNote = async (noteData) => {
    try {
      if (noteData._id) {
        // Update
        const res = await api.updateNote(noteData._id, noteData);
        if (res.success) {
          showToast('Note updated successfully!');
        }
      } else {
        // Create
        const res = await api.createNote(noteData);
        if (res.success) {
          showToast('New note created successfully!');
        }
      }

      setIsEditorOpen(false);
      setSelectedNote(null);
      if (onCloseNewNoteModal) onCloseNewNoteModal();

      fetchNotes();
      fetchStats();
      fetchTags();
    } catch (err) {
      showToast(err.message || 'Failed to save note', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await api.deleteNote(deleteTargetId);
      if (res.success) {
        showToast('Note deleted successfully', 'info');
        setDeleteTargetId(null);
        fetchNotes();
        fetchStats();
        fetchTags();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete note', 'error');
    }
  };

  const handleTogglePin = async (id) => {
    try {
      const res = await api.togglePin(id);
      if (res.success) {
        showToast(res.message);
        fetchNotes();
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to toggle pin', 'error');
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const res = await api.toggleFavorite(id);
      if (res.success) {
        showToast(res.message);
        fetchNotes();
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to toggle favorite', 'error');
    }
  };

  const handleExport = (note) => {
    const mdContent = `
# ${note.title}
**Category:** ${note.category} | **Priority:** ${note.priority}
**Date:** ${new Date(note.createdAt).toLocaleDateString()}
${note.tags?.length ? `**Tags:** ${note.tags.map((t) => `#${t}`).join(' ')}\n` : ''}
---

${note.content}

${
  note.aiSummary?.summary
    ? `\n---\n## ✨ AI Summary\n${note.aiSummary.summary}\n\n### Key Takeaways\n${(note.aiSummary.keyPoints || [])
        .map((k) => `- ${k}`)
        .join('\n')}`
    : ''
}
`;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Note exported as Markdown');
  };

  const pinnedNotes = notes.filter((n) => n.isPinned);
  const otherNotes = notes.filter((n) => !n.isPinned);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      {/* Left Sidebar */}
      <Sidebar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setActiveTag('All');
        }}
        categoryCounts={stats?.categoryCounts || {}}
        filterPinned={filterPinned}
        onToggleFilterPinned={() => setFilterPinned(!filterPinned)}
        filterFavorite={filterFavorite}
        onToggleFilterFavorite={() => setFilterFavorite(!filterFavorite)}
        filterHasAi={filterHasAi}
        onToggleFilterHasAi={() => setFilterHasAi(!filterHasAi)}
        tags={tags}
        activeTag={activeTag}
        onSelectTag={setActiveTag}
      />

      {/* Main Content Hub */}
      <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
        {/* Top Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Search, Filter & View Mode Controls */}
        <SmartSearch
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalResults={notes.length}
        />

        {/* Loading Indicator */}
        {loading ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 0',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '3px solid rgba(99, 102, 241, 0.2)',
                borderTopColor: '#6366f1',
                animation: 'spin 1s linear infinite',
              }}
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Loading your notes...</span>
          </div>
        ) : notes.length === 0 ? (
          /* Empty State */
          <div
            className="glass-panel"
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              borderRadius: 'var(--radius-lg)',
              marginTop: '20px',
            }}
          >
            <Sparkles size={44} color="#818cf8" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>
              No Notes Found
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 24px auto' }}>
              {search || activeCategory !== 'All' || filterPinned || filterFavorite || filterHasAi
                ? 'No notes match your current active filters. Try clearing some filters or searching for different keywords.'
                : 'You have not created any notes yet. Create your first note and explore AI-powered summarization!'}
            </p>
            <button
              className="btn-primary"
              onClick={() => {
                setSelectedNote(null);
                setIsEditorOpen(true);
              }}
            >
              <Plus size={18} />
              <span>Create First Note</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Pinned Notes Section (if any & not filtering by pinned specifically) */}
            {pinnedNotes.length > 0 && !filterPinned && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '14px',
                  }}
                >
                  <Pin size={16} color="#818cf8" style={{ transform: 'rotate(45deg)' }} />
                  <span>Pinned Notes ({pinnedNotes.length})</span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr',
                    gap: '18px',
                  }}
                >
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      viewMode={viewMode}
                      onEdit={(n) => {
                        setSelectedNote(n);
                        setIsEditorOpen(true);
                      }}
                      onDelete={(id) => setDeleteTargetId(id)}
                      onTogglePin={handleTogglePin}
                      onToggleFavorite={handleToggleFavorite}
                      onOpenAiStudio={(n) => {
                        setAiTargetNote(n);
                        setIsAiModalOpen(true);
                      }}
                      onExport={handleExport}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Notes Section */}
            {otherNotes.length > 0 && (
              <div>
                {pinnedNotes.length > 0 && !filterPinned && (
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '14px',
                    }}
                  >
                    All Notes ({otherNotes.length})
                  </div>
                )}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr',
                    gap: '18px',
                  }}
                >
                  {otherNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      viewMode={viewMode}
                      onEdit={(n) => {
                        setSelectedNote(n);
                        setIsEditorOpen(true);
                      }}
                      onDelete={(id) => setDeleteTargetId(id)}
                      onTogglePin={handleTogglePin}
                      onToggleFavorite={handleToggleFavorite}
                      onOpenAiStudio={(n) => {
                        setAiTargetNote(n);
                        setIsAiModalOpen(true);
                      }}
                      onExport={handleExport}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Note Editor Modal */}
      <NoteEditorModal
        isOpen={isEditorOpen}
        initialNote={selectedNote}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedNote(null);
          if (onCloseNewNoteModal) onCloseNewNoteModal();
        }}
        onSave={handleSaveNote}
        onOpenAiForDraft={(draft) => {
          setAiTargetNote(draft);
          setIsAiModalOpen(true);
        }}
      />

      {/* AI Summarization Studio Modal */}
      <AISummaryModal
        isOpen={isAiModalOpen}
        note={aiTargetNote}
        onClose={() => {
          setIsAiModalOpen(false);
          setAiTargetNote(null);
        }}
        onSummarySaved={(updatedSummary) => {
          fetchNotes();
          fetchStats();
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTargetId}
        title="Delete Note"
        message="Are you sure you want to permanently delete this note and its AI summaries? This action cannot be undone."
        confirmText="Delete Note"
        isDanger={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Floating Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
};
