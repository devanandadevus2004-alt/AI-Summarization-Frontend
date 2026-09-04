import React, { useState, useEffect } from 'react';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Shuffle,
  Trophy,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FlashcardViewer = ({ flashcards = [], noteTitle = 'All Notes' }) => {
  const [cards, setCards] = useState(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState(new Set());
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCards(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
    setCompleted(false);
  }, [flashcards]);

  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const toggleMastered = (cardIndex) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardIndex)) {
        next.delete(cardIndex);
      } else {
        next.add(cardIndex);
      }
      return next;
    });
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCompleted(false);
    setMasteredIds(new Set());
  };

  if (!cards || cards.length === 0) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '60px 20px',
          textAlign: 'center',
          borderRadius: 'var(--radius-lg)',
          marginTop: '20px',
        }}
      >
        <Sparkles size={40} color="#818cf8" style={{ marginBottom: '16px' }} />
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
          No Flashcards Found
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto' }}>
          Generate AI summaries on your notes to automatically create active-recall revision flashcards!
        </p>
      </div>
    );
  }

  if (completed) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '60px 20px',
          textAlign: 'center',
          borderRadius: 'var(--radius-lg)',
          marginTop: '20px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(16, 185, 129, 0.15))',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
          }}
        >
          <Trophy size={32} color="#10b981" />
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
          Deck Complete! 🎉
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          You mastered {masteredIds.size} out of {cards.length} cards in this study session.
        </p>
        <button className="btn-primary" onClick={handleRestart}>
          <RefreshCw size={16} />
          <span>Study Deck Again</span>
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header with Progress */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
            {noteTitle}
          </span>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Card {currentIndex + 1} of {cards.length}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={handleShuffle}>
            <Shuffle size={14} />
            <span>Shuffle</span>
          </button>
          <button
            className={`btn-secondary ${masteredIds.has(currentIndex) ? 'active' : ''}`}
            style={{
              padding: '6px 12px',
              fontSize: '0.8rem',
              color: masteredIds.has(currentIndex) ? '#10b981' : 'var(--text-secondary)',
              borderColor: masteredIds.has(currentIndex) ? '#10b981' : 'var(--border-color)',
            }}
            onClick={() => toggleMastered(currentIndex)}
          >
            <CheckCircle size={14} />
            <span>{masteredIds.has(currentIndex) ? 'Mastered' : 'Mark Mastered'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '6px',
          background: 'var(--bg-input)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'var(--accent-gradient)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* 3D Flashcard Flip Card */}
      <div className="flashcard-container" onClick={handleFlip}>
        <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
          {/* Front (Question) */}
          <div className="flashcard-front">
            <span
              style={{
                position: 'absolute',
                top: '20px',
                left: '24px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#818cf8',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Question
            </span>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {currentCard?.question}
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
              }}
            >
              <RotateCw size={13} />
              <span>Click or tap card to flip for answer</span>
            </div>
          </div>

          {/* Back (Answer) */}
          <div className="flashcard-back">
            <span
              style={{
                position: 'absolute',
                top: '20px',
                left: '24px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#34d399',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Key Answer
            </span>
            <div style={{ fontSize: '1.15rem', fontWeight: 500, color: '#ffffff', lineHeight: 1.6 }}>
              {currentCard?.answer}
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              <RotateCw size={13} />
              <span>Click to flip back</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          className="btn-secondary"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
        >
          <ChevronLeft size={18} />
          <span>Previous</span>
        </button>

        <button className="btn-secondary" onClick={handleFlip}>
          <RotateCw size={16} />
          <span>Flip Card</span>
        </button>

        <button className="btn-primary" onClick={handleNext}>
          <span>{currentIndex === cards.length - 1 ? 'Complete Deck' : 'Next Card'}</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
