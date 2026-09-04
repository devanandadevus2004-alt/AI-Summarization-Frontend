import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { FlashcardViewer } from '../components/FlashcardViewer';
import { BookOpen, Sparkles, Filter, CheckCircle2, Flame } from 'lucide-react';

export const StudyCenterPage = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudyNotes = async () => {
      try {
        setLoading(true);
        const res = await api.getNotes({ hasAiSummary: 'true' });
        if (res.success) {
          setNotes(res.notes || []);
        }
      } catch (err) {
        console.warn('Failed to load study notes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudyNotes();
  }, []);

  // Aggregate flashcards based on selection
  let activeFlashcards = [];
  let currentTitle = 'All AI Flashcards';

  if (selectedNoteId === 'all') {
    notes.forEach((n) => {
      if (n.aiSummary && Array.isArray(n.aiSummary.flashcards)) {
        activeFlashcards.push(...n.aiSummary.flashcards);
      }
    });
  } else {
    const found = notes.find((n) => n._id === selectedNoteId);
    if (found && found.aiSummary && Array.isArray(found.aiSummary.flashcards)) {
      activeFlashcards = found.aiSummary.flashcards;
      currentTitle = found.title;
    }
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1080px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '28px 32px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.1))',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          marginBottom: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <BookOpen size={28} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Study & Revision Hub</h1>
              <span className="badge ai-pulse-badge">Active Recall</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Master your notes with interactive AI-generated flashcards and spaced repetition.
            </p>
          </div>
        </div>

        {/* Note Selector Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            value={selectedNoteId}
            onChange={(e) => setSelectedNoteId(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer',
              maxWidth: '260px',
            }}
          >
            <option value="all" style={{ background: 'var(--bg-elevated)' }}>
              All Flashcards ({activeFlashcards.length})
            </option>
            {notes.map((n) => (
              <option key={n._id} value={n._id} style={{ background: 'var(--bg-elevated)' }}>
                {n.title} ({(n.aiSummary?.flashcards || []).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Flashcards Viewer */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Loading your study deck...
        </div>
      ) : (
        <FlashcardViewer flashcards={activeFlashcards} noteTitle={currentTitle} />
      )}
    </div>
  );
};
