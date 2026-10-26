import React from 'react';
import Navbar from './components/Navbar';
import InteractiveVisualCanvas from './components/InteractiveVisualCanvas';
import UpcomingStudies from './components/UpcomingStudies';
import Footer from './components/Footer';
import { CheckCircle2, XCircle } from 'lucide-react';
import './App.css';

// Note: ClaudeTerminalHero is preserved in codebase for future use:
// import ClaudeTerminalHero from './components/ClaudeTerminalHero';

export default function App() {
  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar />

      <main className="main-content">
        {/* Hero Section */}
        <section style={{ textAlign: 'center', paddingTop: '2.5rem', paddingBottom: '1.5rem' }}>
          {/* Status Badge */}
          <div className="hero-badge">
            <span className="live-pulse" />
            <span>COMING SOON • sithumdf.study</span>
          </div>

          {/* Main Headline */}
          <h1 className="hero-title">
            Interactive Visuals for{' '}
            <span className="hero-title-highlight">Intuitive Studies</span>.
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            A digital laboratory designed for deeper learning. In the near future,{' '}
            <strong style={{ color: 'var(--text-primary)' }}>sithumdf.study</strong> will host touchable,
            real-time simulations that translate difficult mathematics, physics, and computer science concepts into visual clarity.
          </p>
        </section>

        {/* The Core Live Interactive Visual Simulator */}
        <section style={{ margin: '1.5rem 0 3.5rem 0', textAlign: 'center' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto 1.25rem auto' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--claude-terracotta)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              Interactive Prototype Preview
            </span>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginTop: '4px',
              letterSpacing: '-0.02em',
            }}>
              Touch, Disturb &amp; Explore the Models
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              Here is a glimpse of how future studies will behave. Choose a study mode below, move your cursor across the canvas, or adjust the parameters in real time.
            </p>
          </div>

          <InteractiveVisualCanvas />
        </section>

        {/* Upcoming Studies Roadmap */}
        <UpcomingStudies />

        {/* Study Philosophy: Static vs Interactive */}
        <section className="philosophy-banner">
          <div className="philosophy-col philosophy-old">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem', color: '#6B7280' }}>
              <XCircle size={18} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600 }}>
                Traditional Textbook Studies
              </span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Static Formulas &amp; Memorization
            </h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Dense pages of symbolic algebraic proofs without visual intuition. You are asked to memorize equations rather than understand what causes what.
            </p>
          </div>

          <div className="philosophy-col philosophy-new">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem', color: 'var(--claude-terracotta)' }}>
              <CheckCircle2 size={18} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700 }}>
                The sithumdf.study Approach
              </span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--claude-terracotta)', marginBottom: '0.4rem' }}>
              Tactile, Visual Comprehension
            </h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Every theorem and law of physics has a live simulation. You pull the springs, disturb the wave packets, adjust matrices, and physically see the mathematical beauty unfold.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
