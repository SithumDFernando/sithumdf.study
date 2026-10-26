
(() => {
  const LABEL = {
    idle: 'Idle · floating',
    wave: 'Waving hello',
    jump: 'Happy jump!',
    surprise: 'Surprised!',
    cheer: 'Super excited!',
    wink: 'Wink!',
    spin: 'Little spin!',
    blink: 'Blink!'
  };

  const SEQUENCES = {
    wave: [
      { sprite:'wave', ms:110, rot:-2, ty:-1 },
      { sprite:'wave', ms:120, rot:3, ty:-5 },
      { sprite:'wave', ms:120, rot:-3, ty:-2 },
      { sprite:'wave', ms:120, rot:3, ty:-5 },
      { sprite:'wave', ms:110, rot:-1, ty:-1 },
      { sprite:'idle', ms:120, rot:0, ty:0 }
    ],
    jump: [
      { sprite:'idle', ms:95, sx:1.05, sy:.94, ty:2 },
      { sprite:'idle', ms:85, sx:.98, sy:1.04, ty:-6 },
      { sprite:'jump', ms:120, sx:1.01, sy:1.01, ty:-30, rot:-5 },
      { sprite:'jump', ms:120, ty:-52, rot:-2 },
      { sprite:'jump', ms:110, ty:-38, rot:4 },
      { sprite:'idle', ms:90, sx:1.07, sy:.92, ty:3 },
      { sprite:'idle', ms:100, sx:1, sy:1, ty:0, rot:0 }
    ],
    surprise: [
      { sprite:'surprise', ms:110, sx:1.04, sy:1.04, ty:-2, rot:-2 },
      { sprite:'surprise', ms:120, sx:1.11, sy:1.11, ty:-4, rot:2 },
      { sprite:'surprise', ms:110, sx:.97, sy:.97, ty:0, rot:-1 },
      { sprite:'idle', ms:110, sx:1, sy:1, ty:0, rot:0 }
    ],
    cheer: [
      { sprite:'cheer', ms:110, ty:-10, rot:-4 },
      { sprite:'cheer', ms:110, ty:-18, rot:4 },
      { sprite:'cheer', ms:110, ty:-12, rot:-5 },
      { sprite:'cheer', ms:110, ty:-20, rot:5 },
      { sprite:'cheer', ms:110, ty:-12, rot:-4 },
      { sprite:'cheer', ms:110, ty:-20, rot:4 },
      { sprite:'idle', ms:120, ty:0, rot:0 }
    ],
    wink: [
      { sprite:'wink', ms:130, rot:-4, ty:-2 },
      { sprite:'wink', ms:130, rot:5, ty:-4, sx:1.02, sy:1.02 },
      { sprite:'wink', ms:120, rot:0, ty:0, sx:1, sy:1 },
      { sprite:'idle', ms:100, rot:0, ty:0 }
    ],
    spin: [
      { sprite:'idle', ms:100, rot:0, sx:.98, sy:.98 },
      { sprite:'idle', ms:120, rot:90, ty:-8, sx:1.02, sy:1.02 },
      { sprite:'idle', ms:120, rot:180, ty:-12, sx:1.04, sy:1.04 },
      { sprite:'idle', ms:120, rot:270, ty:-8, sx:1.02, sy:1.02 },
      { sprite:'idle', ms:120, rot:360, ty:0, sx:1, sy:1 },
      { sprite:'idle', ms:80, rot:0, ty:0, sx:1, sy:1 }
    ]
  };

  function initPixelMascot(root) {
    if (root.__pixelMascot) return root.__pixelMascot;
    const button = root.querySelector('.pixel-mascot__button');
    const image = root.querySelector('.pixel-mascot__sprite');
    const host = root.closest('.playground');
    const assetRoot = (root.dataset.assetRoot || 'assets').replace(/\/$/, '');
    const assetURL = name => (window.PIXEL_MASCOT_ASSETS && window.PIXEL_MASCOT_ASSETS[name]) || `${assetRoot}/${name}.png`;
    const status = document.querySelector(root.dataset.statusTarget || '#mascot-status');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let hover = false;
    let busy = false;
    let destroyed = false;
    let clickTimer = null;
    let blinkTimer = null;
    let singleTimer = null;
    let recentClicks = [];
    let seqToken = 0;
    let currentSprite = 'idle';

    ['idle','blink','wave','jump','surprise','cheer','wink'].forEach(name => {
      const prefetch = new Image();
      prefetch.src = assetURL(name);
    });

    function setStatus(key) {
      if (status) status.textContent = LABEL[key] || LABEL.idle;
      if (host) host.dataset.pose = key;
    }

    function setVars(frame = {}) {
      const ms = frame.ms ?? 120;
      image.style.setProperty('--frame-ms', `${ms}ms`);
      image.style.setProperty('--tx', `${frame.tx || 0}px`);
      image.style.setProperty('--ty', `${frame.ty || 0}px`);
      image.style.setProperty('--rot', `${frame.rot || 0}deg`);
      image.style.setProperty('--sx', frame.sx || 1);
      image.style.setProperty('--sy', frame.sy || 1);
    }

    function showSprite(name) {
      if (name === currentSprite) return;
      currentSprite = name;
      image.src = assetURL(name);
    }

    function setMode(mode, blinking = false) {
      root.dataset.mode = mode;
      root.classList.toggle('is-blinking', !!blinking);
    }

    function idle() {
      if (destroyed) return;
      busy = false;
      seqToken++;
      showSprite('idle');
      setVars({ ms: 130, tx:0, ty:0, rot:0, sx:1, sy:1 });
      setMode('idle');
      setStatus('idle');
    }

    function afterInteraction() {
      if (hover) startWaveLoop();
      else idle();
    }

    async function playSequence(name, opts = {}) {
      const sequence = SEQUENCES[name];
      if (!sequence) { idle(); return; }
      const token = ++seqToken;
      busy = name !== 'wave';
      setMode('sequence');
      setStatus(name);
      const frames = reducedMotion.matches ? [sequence[0], sequence[sequence.length - 1]] : sequence;
      for (const frame of frames) {
        if (destroyed || token !== seqToken) return;
        showSprite(frame.sprite);
        setVars(frame);
        await new Promise(r => setTimeout(r, reducedMotion.matches ? Math.min(frame.ms || 120, 90) : (frame.ms || 120)));
      }
      if (destroyed || token !== seqToken) return;
      if (opts.loop && hover) {
        playSequence(name, opts);
      } else {
        afterInteraction();
      }
    }

    function startWaveLoop() {
      hover = true;
      if (busy) return;
      playSequence('wave', { loop: true });
    }

    function stopHover() {
      hover = false;
      if (!busy) idle();
    }

    function blinkOnce() {
      if (destroyed || busy || hover || document.hidden) return;
      const token = ++seqToken;
      setMode('idle', true);
      setStatus('blink');
      showSprite('blink');
      setVars({ ms: 60, ty:0, rot:0, sx:1, sy:1 });
      setTimeout(() => {
        if (destroyed || token !== seqToken || busy || hover) return;
        idle();
      }, reducedMotion.matches ? 70 : 120);
    }

    function scheduleBlink() {
      clearInterval(blinkTimer);
      blinkTimer = setInterval(() => blinkOnce(), 4000 + Math.floor(Math.random() * 1800));
    }

    function onClick() {
      const now = performance.now();
      recentClicks = recentClicks.filter(t => now - t < 1000);
      recentClicks.push(now);
      clearTimeout(singleTimer);
      if (recentClicks.length >= 3) {
        recentClicks = [];
        playSequence('cheer');
        return;
      }
      if (recentClicks.length === 2) {
        playSequence('surprise');
        return;
      }
      singleTimer = setTimeout(() => {
        if (recentClicks.length === 1) playSequence('jump');
      }, 220);
    }

    button.addEventListener('pointerenter', e => {
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') startWaveLoop();
    });
    button.addEventListener('pointerleave', stopHover);
    button.addEventListener('click', onClick);

    scheduleBlink();
    idle();

    const api = {
      play(name) {
        if (name === 'idle') idle();
        else if (name === 'flip') api.flip();
        else playSequence(name);
      },
      flip() {
        const flipped = root.dataset.flipped === 'true';
        root.dataset.flipped = flipped ? 'false' : 'true';
        root.style.setProperty('--flip', flipped ? 1 : -1);
        return !flipped;
      },
      reset() { hover = false; recentClicks = []; clearTimeout(singleTimer); idle(); },
      destroy() {
        destroyed = true; clearInterval(blinkTimer); clearTimeout(singleTimer); seqToken++;
      }
    };
    root.__pixelMascot = api;
    return api;
  }

  window.initPixelMascot = initPixelMascot;
  const ready = () => document.querySelectorAll('.pixel-mascot').forEach(initPixelMascot);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();
