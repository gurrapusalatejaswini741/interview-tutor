/**
 * Audio processing utilities for Gemini Live API & Web Audio API
 */

// Convert Float32Array from microphone (16kHz) to 16-bit PCM ArrayBuffer/Base64
export function float32To16BitPCM(float32Array: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Convert 16-bit PCM (little endian) ArrayBuffer to Float32Array for AudioBuffer playback
export function pcm16BitToFloat32(buffer: ArrayBuffer): Float32Array {
  const view = new DataView(buffer);
  const numSamples = buffer.byteLength / 2;
  const float32 = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const int16 = view.getInt16(i * 2, true);
    float32[i] = int16 < 0 ? int16 / 0x8000 : int16 / 0x7fff;
  }
  return float32;
}

/**
 * Audio player class that handles 24kHz raw PCM gapless streaming playback
 */
export class LiveAudioPlayer {
  private ctx: AudioContext | null = null;
  private nextStartTime = 0;
  private isMuted = false;
  private activeSources: AudioBufferSourceNode[] = [];

  constructor() {
    // Lazily initialized on user interaction
  }

  private initCtx() {
    if (!this.ctx || this.ctx.state === "closed") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx({ sampleRate: 24000 });
      this.nextStartTime = this.ctx.currentTime;
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public playPcmChunk(base64Audio: string) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const arrayBuffer = base64ToArrayBuffer(base64Audio);
      const float32Data = pcm16BitToFloat32(arrayBuffer);
      if (float32Data.length === 0) return;

      const audioBuffer = this.ctx.createBuffer(1, float32Data.length, 24000);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = this.ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.ctx.destination);

      const currentTime = this.ctx.currentTime;
      if (this.nextStartTime < currentTime) {
        this.nextStartTime = currentTime;
      }

      source.start(this.nextStartTime);
      this.nextStartTime += audioBuffer.duration;

      this.activeSources.push(source);
      source.onended = () => {
        const idx = this.activeSources.indexOf(source);
        if (idx !== -1) {
          this.activeSources.splice(idx, 1);
        }
      };
    } catch (e) {
      console.error("Error playing PCM audio chunk:", e);
    }
  }

  public stop() {
    for (const src of this.activeSources) {
      try {
        src.stop();
        src.disconnect();
      } catch (err) {
        // ignore
      }
    }
    this.activeSources = [];
    if (this.ctx) {
      this.nextStartTime = this.ctx.currentTime;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public close() {
    this.stop();
    if (this.ctx && this.ctx.state !== "closed") {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

/**
 * Plays standard WAV or MP3 audio encoded in base64
 */
export function playWavBase64(base64Data: string, mimeType = "audio/wav"): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio(`data:${mimeType};base64,${base64Data}`);
      audio.onended = () => resolve();
      audio.onerror = (e) => reject(e);
      audio.play().catch(reject);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Text & Audio metrics analysis
 * Detects common filler words: "um", "uh", "actually", "basically", "like", "you know"
 */
export function analyzeSpeechMetrics(text: string, durationSec: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const fillerRegex = /\b(um|uh|er|ah|actually|basically|literally|honestly|you know|sort of|kind of|i mean)\b/gi;
  const matches = text.match(fillerRegex) || [];
  const fillerWordCount = matches.length;

  const wpm = durationSec > 0 ? Math.round((wordCount / durationSec) * 60) : 0;

  return {
    wordCount,
    durationSec: Math.max(1, Math.round(durationSec)),
    wordsPerMinute: wpm,
    fillerWordCount,
    fillerWords: matches.map((m) => m.toLowerCase()),
  };
}
