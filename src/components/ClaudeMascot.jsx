import React, { useState } from 'react';

/**
 * Pixel-art Claude Code Mascot
 * Faithfully styled after the Anthropic Claude Code terminal icon from the user's screenshot.
 */
export default function ClaudeMascot({ size = 36, className = '', interactive = true }) {
  const [isWinking, setIsWinking] = useState(false);

  return (
    <div 
      className={`claude-mascot-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: interactive ? 'pointer' : 'default',
        transformOrigin: 'center bottom',
      }}
      onClick={() => {
        if (!interactive) return;
        setIsWinking(true);
        setTimeout(() => setIsWinking(false), 600);
      }}
      title="Claude Code mascot · Click me!"
    >
      <svg
        width={size}
        height={Math.round(size * 0.85)}
        viewBox="0 0 16 14"
        shapeRendering="crispEdges"
        style={{
          display: 'block',
          transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onMouseEnter={(e) => {
          if (interactive) e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          if (interactive) e.currentTarget.style.transform = 'scale(1) translateY(0)';
        }}
      >
        {/* Main Body & Arms in Claude Terracotta */}
        {/* Row 0: Top Antennas */}
        <rect x="2" y="1" width="2" height="1" fill="#DE5844" />
        <rect x="12" y="1" width="2" height="1" fill="#DE5844" />

        {/* Row 1-2: Head Top */}
        <rect x="2" y="2" width="12" height="2" fill="#DE5844" />

        {/* Row 3-6: Face & Eyes */}
        <rect x="1" y="4" width="14" height="4" fill="#DE5844" />

        {/* Left Eye */}
        <rect 
          x="4" 
          y={isWinking ? "6" : "4"} 
          width="1.5" 
          height={isWinking ? "1" : "3.5"} 
          fill="#1C1B18" 
        />

        {/* Right Eye */}
        <rect 
          x="10.5" 
          y="4" 
          width="1.5" 
          height="3.5" 
          fill="#1C1B18" 
        />

        {/* Row 7-9: Lower Torso & Side Arms */}
        <rect x="0" y="6" width="2" height="3" fill="#DE5844" />
        <rect x="14" y="6" width="2" height="3" fill="#DE5844" />
        <rect x="2" y="8" width="12" height="2" fill="#DE5844" />

        {/* Row 10-12: Legs (4 distinct prongs) */}
        <rect x="2" y="10" width="1.5" height="3" fill="#DE5844" />
        <rect x="5.5" y="10" width="1.5" height="3" fill="#DE5844" />
        <rect x="9" y="10" width="1.5" height="3" fill="#DE5844" />
        <rect x="12.5" y="10" width="1.5" height="3" fill="#DE5844" />
      </svg>
    </div>
  );
}
