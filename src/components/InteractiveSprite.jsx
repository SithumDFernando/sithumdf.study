import React, { useState } from 'react';
import { playMascotFlipSound } from '../utils/audio';

export default function InteractiveSprite({ height = 36, className = '', style = {} }) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipCount, setFlipCount] = useState(0);

  const handleClick = () => {
    // Play retro 8-bit chime
    playMascotFlipSound();

    // Trigger flip animation
    setIsFlipping(true);
    setFlipCount((prev) => prev + 1);

    setTimeout(() => {
      setIsFlipping(false);
    }, 600);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      title="Click me for a flip!"
      className={`interactive-sprite-btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
        outline: 'none',
        perspective: '600px',
        ...style,
      }}
    >
      <img
        key={flipCount}
        src="/sprite.png"
        alt="sithumdf.study mascot"
        className={isFlipping ? 'sprite-flipping' : 'sprite-idle'}
        style={{
          height: `${height}px`,
          width: 'auto',
          imageRendering: 'pixelated',
          display: 'block',
          userSelect: 'none',
          WebkitUserDrag: 'none',
        }}
      />
    </div>
  );
}
