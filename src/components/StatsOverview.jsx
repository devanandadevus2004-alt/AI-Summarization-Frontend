import React from 'react';
import { FileText, Sparkles, Clock, BookOpen, TrendingUp } from 'lucide-react';

export const StatsOverview = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    {
      label: 'Total Notes',
      value: stats.totalNotes || 0,
      subtext: `${stats.totalWords || 0} total words stored`,
      icon: FileText,
      color: '#6366f1',
      bgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.03))',
    },
    {
      label: 'AI Summaries',
      value: stats.aiSummariesCount || 0,
      subtext: `${stats.summarizedWordsSaved || 0} words compressed`,
      icon: Sparkles,
      color: '#ec4899',
      bgGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(236, 72, 153, 0.03))',
    },
    {
      label: 'Time Saved',
      value: `${stats.readingTimeSavedMinutes || 0} min`,
      subtext: 'Estimated reading time saved',
      icon: Clock,
      color: '#06b6d4',
      bgGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(6, 182, 212, 0.03))',
    },
    {
      label: 'Flashcards',
      value: stats.totalFlashcards || 0,
      subtext: 'Active revision cards generated',
      icon: BookOpen,
      color: '#10b981',
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.03))',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="glass-panel"
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              background: card.bgGradient,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {card.label}
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-color)',
                }}
              >
                <Icon size={18} color={card.color} />
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.5px',
                  marginBottom: '4px',
                }}
              >
                {card.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {card.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
