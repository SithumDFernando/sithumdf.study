import React from 'react';
import { Cpu, FunctionSquare, Atom } from 'lucide-react';

const STUDY_MODULES = [
  {
    icon: Cpu,
    title: 'Computer Science',
    subtitle: 'Algorithms & Architecture',
    description: 'Step through graph traversals (A*, Dijkstra), watch sorting algorithms dance in memory, and observe neural network activations propagate layer by layer.',
  },
  {
    icon: FunctionSquare,
    title: 'Intuitive Mathematics',
    subtitle: 'Calculus & Linear Algebra',
    description: 'Transform abstract symbolic algebra into tangible geometric structures. Drag vectors, watch matrix transformations warp 2D/3D space, and visualize Fourier series.',
  },
  {
    icon: Atom,
    title: 'Interactive Physics',
    subtitle: 'Mechanics & Wave Dynamics',
    description: 'Directly touch kinetic energy, watch wave interference patterns emerge in real time, and experiment with chaotic pendulums and orbital gravity.',
  },
];

export default function UpcomingStudies() {
  return (
    <section style={{ margin: '3.5rem 0' }}>
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--claude-terracotta-subtle)',
          border: '1px solid var(--claude-terracotta-border)',
          color: 'var(--claude-terracotta)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          fontWeight: 600,
          marginBottom: '0.75rem',
          letterSpacing: '0.04em',
        }}>
          <span>ROADMAP &amp; CURRICULUM</span>
        </div>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '0.5rem',
        }}>
          What's Coming to sithumdf.study
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          maxWidth: '580px',
          margin: '0 auto',
          fontSize: '0.98rem',
          lineHeight: 1.55,
        }}>
          Visual explanations designed to give you an "aha!" moment. Every concept will have its own sandbox to play with.
        </p>
      </div>

      {/* Grid of Cards: 3 columns, clean without hashtags or status tags */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: '1.25rem',
      }}>
        {STUDY_MODULES.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'var(--claude-terracotta)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              {/* Icon Container */}
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-muted)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--claude-terracotta)',
                marginBottom: '1.25rem',
              }}>
                <Icon size={22} />
              </div>

              {/* Title & Subtitle */}
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '0.25rem',
              }}>
                {item.title}
              </h3>
              <div style={{
                fontSize: '0.82rem',
                color: 'var(--claude-terracotta)',
                fontWeight: 600,
                marginBottom: '0.85rem',
              }}>
                {item.subtitle}
              </div>

              {/* Description */}
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
                margin: 0,
              }}>
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
