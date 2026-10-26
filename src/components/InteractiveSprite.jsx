import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  playMascotJumpSound,
  playMascotSurpriseSound,
  playMascotCheerSound,
} from '../utils/audio';

const SPRITE_NAMES = ['idle', 'blink', 'wave', 'jump', 'surprise', 'cheer', 'wink'];

export default function InteractiveSprite({
  size,
  height = 36,
  className = '',
  style = {},
  enableSound = true,
  interactive = true,
}) {
  const actualSize = size || height;
  const [sprite, setSprite] = useState('idle');
  const [mode, setMode] = useState('idle'); // 'idle' | 'sequence'
  const [isBlinking, setIsBlinking] = useState(false);
  const [transformVars, setTransformVars] = useState({
    tx: 0,
    ty: 0,
    rot: 0,
    sx: 1,
    sy: 1,
    frameMs: 120,
  });

  const isHoveredRef = useRef(false);
  const isBusyRef = useRef(false);
  const seqTokenRef = useRef(0);
  const recentClicksRef = useRef([]);
  const singleTimerRef = useRef(null);
  const blinkTimerRef = useRef(null);
  const loopTimerRef = useRef(null);

  // Normalize translations so small UI icons (36px, 44px) don't jump out of container
  const scaleFactor = actualSize / 280;

  // Preload all sprites on mount for instant zero-flash transitions
  useEffect(() => {
    SPRITE_NAMES.forEach((name) => {
      const img = new Image();
      img.src = `/mascot/${name}.png`;
    });
  }, []);

  const resetToIdle = useCallback(() => {
    seqTokenRef.current += 1;
    isBusyRef.current = false;
    setSprite('idle');
    setTransformVars({
      tx: 0,
      ty: 0,
      rot: 0,
      sx: 1,
      sy: 1,
      frameMs: 130,
    });
    setMode('idle');
    setIsBlinking(false);
  }, []);

  // Frame sequence runner with cancellation token support
  const playSequence = useCallback(
    async (sequenceName, opts = {}) => {
      const token = ++seqTokenRef.current;
      isBusyRef.current = sequenceName !== 'wave';
      setMode('sequence');
      setIsBlinking(false);

      // Animation sequences calibrated with height-compensations to prevent body flicking:
      // Note: wave.png has sy: 1.075 with 50% 85% origin to match idle.png body height exactly.
      const sequences = {
        wave: [
          { sprite: 'wave', ms: 110, rot: -2, ty: -1 * scaleFactor, sy: 1.075, sx: 1 },
          { sprite: 'wave', ms: 120, rot: 3, ty: -3 * scaleFactor, sy: 1.075, sx: 1 },
          { sprite: 'wave', ms: 120, rot: -3, ty: -2 * scaleFactor, sy: 1.075, sx: 1 },
          { sprite: 'wave', ms: 120, rot: 3, ty: -3 * scaleFactor, sy: 1.075, sx: 1 },
          { sprite: 'wave', ms: 110, rot: -1, ty: -1 * scaleFactor, sy: 1.075, sx: 1 },
          { sprite: 'idle', ms: 120, rot: 0, ty: 0, sy: 1, sx: 1 },
        ],
        jump: [
          { sprite: 'idle', ms: 90, sx: 1.05, sy: 0.94, ty: 1 * scaleFactor, rot: 0 },
          { sprite: 'idle', ms: 80, sx: 0.98, sy: 1.04, ty: -4 * scaleFactor, rot: 0 },
          { sprite: 'jump', ms: 120, sx: 1.01, sy: 1.01, ty: -20 * scaleFactor, rot: -4 },
          { sprite: 'jump', ms: 120, ty: -36 * scaleFactor, rot: -1, sx: 1, sy: 1 },
          { sprite: 'jump', ms: 110, ty: -24 * scaleFactor, rot: 3, sx: 1, sy: 1 },
          { sprite: 'idle', ms: 90, sx: 1.07, sy: 0.92, ty: 2 * scaleFactor, rot: 0 },
          { sprite: 'idle', ms: 100, sx: 1, sy: 1, ty: 0, rot: 0 },
        ],
        surprise: [
          { sprite: 'surprise', ms: 110, sx: 1.05, sy: 1.05, ty: -2 * scaleFactor, rot: -2 },
          { sprite: 'surprise', ms: 120, sx: 1.10, sy: 1.10, ty: -4 * scaleFactor, rot: 2 },
          { sprite: 'surprise', ms: 110, sx: 0.98, sy: 0.98, ty: 0, rot: -1 },
          { sprite: 'idle', ms: 110, sx: 1, sy: 1, ty: 0, rot: 0 },
        ],
        cheer: [
          { sprite: 'cheer', ms: 110, ty: -8 * scaleFactor, rot: -4, sy: 1.10, sx: 1.02 },
          { sprite: 'cheer', ms: 110, ty: -15 * scaleFactor, rot: 4, sy: 1.10, sx: 1.02 },
          { sprite: 'cheer', ms: 110, ty: -8 * scaleFactor, rot: -4, sy: 1.10, sx: 1.02 },
          { sprite: 'cheer', ms: 110, ty: -15 * scaleFactor, rot: 4, sy: 1.10, sx: 1.02 },
          { sprite: 'idle', ms: 120, ty: 0, rot: 0, sy: 1, sx: 1 },
        ],
      };

      const frames = sequences[sequenceName];
      if (!frames) {
        resetToIdle();
        return;
      }

      for (const frame of frames) {
        if (token !== seqTokenRef.current) return;
        setSprite(frame.sprite);
        setTransformVars({
          tx: frame.tx || 0,
          ty: frame.ty || 0,
          rot: frame.rot || 0,
          sx: frame.sx || 1,
          sy: frame.sy || 1,
          frameMs: frame.ms || 120,
        });
        await new Promise((resolve) => setTimeout(resolve, frame.ms || 120));
      }

      if (token !== seqTokenRef.current) return;

      if (opts.loop && isHoveredRef.current) {
        playSequence(sequenceName, opts);
      } else {
        if (isHoveredRef.current) {
          playSequence('wave', { loop: true });
        } else {
          resetToIdle();
        }
      }
    },
    [scaleFactor, resetToIdle]
  );

  // Periodic natural eye blinking when idle
  useEffect(() => {
    const triggerBlink = () => {
      if (isBusyRef.current || isHoveredRef.current || document.hidden) return;
      const token = ++seqTokenRef.current;
      setMode('idle');
      setIsBlinking(true);
      setSprite('blink');
      setTransformVars((prev) => ({
        ...prev,
        frameMs: 80,
        tx: 0,
        rot: 0,
        sx: 1,
        sy: 1,
      }));

      setTimeout(() => {
        if (token !== seqTokenRef.current || isBusyRef.current || isHoveredRef.current) return;
        setSprite('idle');
        setIsBlinking(false);
      }, 100);
    };

    const interval = setInterval(() => {
      triggerBlink();
    }, 4200 + Math.floor(Math.random() * 1600));

    blinkTimerRef.current = interval;
    return () => clearInterval(interval);
  }, []);

  // Hover handlers - strictly silent (mute on hover as requested)
  const handlePointerEnter = (e) => {
    if (!interactive) return;
    if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
      isHoveredRef.current = true;
      if (!isBusyRef.current) {
        playSequence('wave', { loop: true });
      }
    }
  };

  const handlePointerLeave = () => {
    if (!interactive) return;
    isHoveredRef.current = false;
    clearTimeout(loopTimerRef.current);
    if (!isBusyRef.current) {
      resetToIdle();
    }
  };

  // Click gesture accumulator:
  // 1 click -> Happy Jump + Jump Sound
  // 2 clicks -> Surprise + Surprise Sound
  // 3+ clicks -> Celebration Cheer + Cheer Sound
  const handleClick = (e) => {
    if (!interactive) return;
    e.stopPropagation();

    const now = performance.now();
    recentClicksRef.current = recentClicksRef.current.filter((t) => now - t < 900);
    recentClicksRef.current.push(now);

    clearTimeout(singleTimerRef.current);

    if (recentClicksRef.current.length >= 3) {
      recentClicksRef.current = [];
      if (enableSound) playMascotCheerSound();
      playSequence('cheer');
      return;
    }

    if (recentClicksRef.current.length === 2) {
      if (enableSound) playMascotSurpriseSound();
      playSequence('surprise');
      return;
    }

    singleTimerRef.current = setTimeout(() => {
      if (recentClicksRef.current.length === 1) {
        if (enableSound) playMascotJumpSound();
        playSequence('jump');
      }
    }, 220);
  };

  return (
    <div
      className={`pixel-mascot-container ${className}`}
      data-mode={mode}
      style={{
        width: `${actualSize}px`,
        height: `${actualSize}px`,
        ...style,
      }}
    >
      <button
        type="button"
        className="pixel-mascot-btn"
        aria-label="Pixel Pal Mascot · Hover to wave, click to jump, double click for surprise, rapid clicks to celebrate."
        title="Pixel Pal · Click to jump, double click for surprise, rapid clicks to cheer!"
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e);
          }
        }}
        style={{
          cursor: interactive ? 'pointer' : 'default',
        }}
      >
        <span className="pixel-mascot-flip">
          <span className="pixel-mascot-stage">
            <img
              src={`/mascot/${sprite}.png`}
              alt="sithumdf.study mascot"
              className="pixel-mascot-sprite"
              draggable={false}
              style={{
                '--frame-ms': `${transformVars.frameMs}ms`,
                '--tx': `${transformVars.tx}px`,
                '--ty': `${transformVars.ty}px`,
                '--rot': `${transformVars.rot}deg`,
                '--sx': transformVars.sx,
                '--sy': transformVars.sy,
              }}
            />
          </span>
        </span>
      </button>
    </div>
  );
}
