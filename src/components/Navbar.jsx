import React from 'react';
import { Eye } from 'lucide-react';

export default function Navbar() {
  const scrollToLab = () => {
    const el = document.querySelector('.visual-lab-container');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header style={{
      width: '100%',
      padding: '1.25rem 0',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(250, 248, 245, 0.85)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo and Domain */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img 
            src="/sprite.png" 
            alt="sithumdf.study mascot"
            style={{
              height: '36px',
              width: 'auto',
              imageRendering: 'pixelated',
              display: 'block',
              transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '1.15rem',
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}>
                sithumdf<span style={{ color: 'var(--claude-terracotta)' }}>.study</span>
              </span>
              <span style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'var(--claude-terracotta-subtle)',
                color: 'var(--claude-terracotta)',
                fontWeight: 700,
              }}>
                v0.1
              </span>
            </div>
            <div style={{
              fontSize: '0.74rem',
              color: 'var(--text-muted)',
              lineHeight: 1.2,
            }}>
              Interactive Visual Studies
            </div>
          </div>
        </div>

        {/* Center / Right status & action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-muted)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
          }} className="nav-status-pill">
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 6px #10B981',
            }} />
            <span>Active Development</span>
          </div>

          <button
            onClick={scrollToLab}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--claude-terracotta)';
              e.currentTarget.style.color = 'var(--claude-terracotta)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
          >
            <Eye size={14} color="var(--claude-terracotta)" />
            <span>Try Visualizer</span>
          </button>
        </div>
      </div>
    </header>
  );
}
