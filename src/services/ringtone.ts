/**
 * Realistic synthetic phone ringtone generator using Web Audio API.
 * Uses dual-tone multi-frequency (440Hz + 480Hz) with phone ring cadence (2s ring, 4s pause).
 * Zero external audio assets needed.
 */
class RingtonePlayer {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;

  private initCtx() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.initCtx();

    const ringCycle = () => {
      if (!this.isPlaying || !this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      // Dual-tone frequencies standard for telecom telephone ringing
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(440, now);
      osc2.frequency.setValueAtTime(480, now);

      // Ring pulse: 2 seconds on
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.setValueAtTime(0.2, now + 1.9);
      gain.gain.linearRampToValueAtTime(0, now + 2.0);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 2.0);
      osc2.stop(now + 2.0);

      // Schedule next ring after 4 seconds pause (total 6 second loop)
      this.timer = window.setTimeout(ringCycle, 4000);
    };

    ringCycle();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

export const ringtonePlayer = new RingtonePlayer();
