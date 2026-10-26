// Retro 8-bit sound synthesizer using Web Audio API
let audioCtx = null;

function getAudioContext() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Plays a bouncy ascending 8-bit jump chime (C5 -> E5 -> G5 -> C6).
 */
export function playMascotJumpSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now);         // C5
    osc.frequency.setValueAtTime(659.25, now + 0.05);   // E5
    osc.frequency.setValueAtTime(783.99, now + 0.10);   // G5
    osc.frequency.setValueAtTime(1046.50, now + 0.16);  // C6

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.33);
  } catch (err) {
    console.debug('Audio playback skipped:', err);
  }
}

/**
 * Plays a startled, playful double-pip chirp for surprise interactions.
 */
export function playMascotSurpriseSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now);          // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.07); // A5
    osc.frequency.setValueAtTime(987.77, now + 0.12);   // B5

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.16, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.29);
  } catch (err) {
    console.debug('Audio playback skipped:', err);
  }
}

/**
 * Plays a rapid, celebratory retro fanfare for cheer interactions.
 */
export function playMascotCheerSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    // Ascending arpeggio fanfare: C5 -> G5 -> C6 -> E6 -> G6
    const freqs = [523.25, 783.99, 1046.50, 1318.51, 1567.98];
    freqs.forEach((freq, idx) => {
      osc.frequency.setValueAtTime(freq, now + idx * 0.045);
    });

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.39);
  } catch (err) {
    console.debug('Audio playback skipped:', err);
  }
}

/**
 * Backward compatibility alias for flip/click sound.
 */
export function playMascotFlipSound() {
  playMascotJumpSound();
}

