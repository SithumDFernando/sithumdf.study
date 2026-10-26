// Retro 8-bit sound synthesizer using Web Audio API
let audioCtx = null;

/**
 * Plays a cheerful retro 8-bit arpeggio sound when the sprite is clicked.
 */
export function playMascotFlipSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Triangle wave gives a warm, melodic 8-bit chime
    osc.type = 'triangle';

    // Bouncy retro ascending chime: C5 -> E5 -> G5 -> C6
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(659.25, now + 0.06);
    osc.frequency.setValueAtTime(783.99, now + 0.12);
    osc.frequency.setValueAtTime(1046.50, now + 0.18);

    // Smooth envelope with no popping
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  } catch (err) {
    // Silently continue if audio permissions are blocked
    console.debug('Audio playback skipped:', err);
  }
}
