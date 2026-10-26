import React from 'react';
import InteractiveSprite from './InteractiveSprite';
import { Eye } from 'lucide-react';

export default function Navbar() {
  const scrollToLab = () => {
    const el = document.querySelector('.visual-lab-container');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Logo and Domain */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <InteractiveSprite height={36} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="brand-title">
                sithumdf<span style={{ color: 'var(--claude-terracotta)' }}>.study</span>
              </span>
              <span className="brand-badge">
                v0.1
              </span>
            </div>
            <div className="brand-subtitle">
              Interactive Visual Studies
            </div>
          </div>
        </div>

        {/* Center / Right status & action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="nav-status-pill">
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
            className="nav-action-btn"
          >
            <Eye size={14} color="var(--claude-terracotta)" />
            <span>Try Visualizer</span>
          </button>
        </div>
      </div>
    </header>
  );
}
