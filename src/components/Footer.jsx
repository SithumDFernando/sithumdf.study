import React from 'react';
import InteractiveSprite from './InteractiveSprite';

export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      padding: '2.5rem 0 2rem',
      borderTop: '1px solid var(--border-default)',
      background: 'var(--bg-muted)',
      marginTop: '4rem',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 1.5rem',
      }}>
        {/* Main Footer Row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}>
          {/* Brand info with interactive sprite */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
            <InteractiveSprite height={36} />
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
                fontSize: '0.84rem',
                color: 'var(--text-secondary)',
                marginTop: '2px',
                lineHeight: 1.4,
              }}>
                Visual and interactive laboratories for learning without friction.
              </p>
            </div>
          </div>

          {/* Social Links: GitHub & LinkedIn */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* GitHub */}
            <a
              href="https://github.com/SithumDFernando/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Sithum Fernando on GitHub"
              title="GitHub Profile"
              className="footer-social-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-secondary)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/sithum-fernando/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Sithum Fernando on LinkedIn"
              title="LinkedIn Profile"
              className="footer-social-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-secondary)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '1.5rem',
          marginTop: '1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          gap: '0.5rem',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)' }}>
            © {new Date().getFullYear()} sithumdf.study • All rights reserved.
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            Domain reserved • Built for curious learners
          </div>
        </div>
      </div>
    </footer>
  );
}
