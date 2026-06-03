import { Injectable, inject } from '@angular/core';
import { SettingsService } from './settings.service';

@Injectable({ providedIn: 'root' })
export class SoundService {
  private readonly settings = inject(SettingsService);
  private ctx: AudioContext | null = null;

  private getCtx(): AudioContext | null {
    if (typeof AudioContext === 'undefined') return null;
    if (!this.ctx) this.ctx = new AudioContext();
    return this.ctx;
  }

  private beep(freq: number, duration: number, type: OscillatorType = 'sine', gain = 0.3): void {
    if (!this.settings.sound()) return;
    const ctx = this.getCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    osc.connect(vol);
    vol.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    vol.gain.setValueAtTime(gain, ctx.currentTime);
    vol.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  playCorrect(): void {
    this.beep(523, 0.12); // C5
    setTimeout(() => this.beep(659, 0.15), 100); // E5
    setTimeout(() => this.beep(784, 0.2),  200); // G5
  }

  playWrong(): void {
    this.beep(220, 0.25, 'sawtooth', 0.2); // A3 buzz
    setTimeout(() => this.beep(196, 0.25, 'sawtooth', 0.15), 150); // G3
  }

  playRoundWin(): void {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.beep(f, 0.2), i * 120));
  }
}
