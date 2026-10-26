import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      width: '100%',
      padding: '3rem 0 2rem',
      borderTop: '1px solid var(--border-default)',
      background: 'var(--bg-muted)',
      marginTop: '4rem',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 1.5rem',
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          {/* Brand info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
            <img 
              src="/sprite.png" 
              alt="sithumdf.study mascot"
              style={{
                height: '34px',
                width: 'auto',
                imageRendering: 'pixelated',
                display: 'block',
              }}
            />
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '1.05rem',
                color: 'var(--text-primary)',
              }}>
                sithumdf<span style={{ color: 'var(--claude-terracotta)' }}>.study</span>
              </div>
              <p style={{
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                marginTop: '2px',
              }}>
                Visual and interactive laboratories for learning without friction.
              </p>
            </div>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--claude-terracotta)';
              e.currentTarget.style.color = 'var(--claude-terracotta)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <span>Back to top</span>
            <ArrowUp size={13} />
          </button>
        </div>

        {/* Bottom Credits & Copyright */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '1.5rem',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          gap: '1rem',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)' }}>
            © {new Date().getFullYear()} sithumdf.study • All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Crafted with</span>
            <span style={{ color: 'var(--claude-terracotta)' }}>♥</span>
            <span>in warm light aesthetic &amp; React Vite</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
