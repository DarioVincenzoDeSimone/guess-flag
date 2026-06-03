import { Injectable, computed, inject, signal } from '@angular/core';
import { FLAGS, FlagEntry } from '../data/flags';
import { SettingsService } from './settings.service';
import { SoundService } from './sound.service';

export interface RoundResult {
  flag: FlagEntry;
  correct: boolean;
  hintUsed: boolean;
  wrongAttempts: number;
  score: number;
}

const MAX_WRONG = 3;

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly settings = inject(SettingsService);
  private readonly sound    = inject(SoundService);

  // ── Session ──────────────────────────────────────────────────────
  readonly rounds       = signal<FlagEntry[]>([]);
  readonly roundIndex   = signal<number>(0);
  readonly roundResults = signal<RoundResult[]>([]);

  // ── Mode 1: multiple-choice country names ─────────────────────────
  readonly multiChoiceOptions = signal<FlagEntry[]>([]);

  // ── Mode 2: flag grid ─────────────────────────────────────────────
  readonly flagOptions = signal<FlagEntry[]>([]);

  // ── Shared per-round state ────────────────────────────────────────
  readonly wrongClicks    = signal<Set<string>>(new Set());
  readonly lastWrongClick = signal<string | null>(null);
  readonly correctClicked = signal<string | null>(null);
  readonly hintUsed       = signal<boolean>(false);
  readonly roundComplete  = signal<boolean>(false);
  readonly roundCorrect   = signal<boolean>(false);

  // ── Computed ──────────────────────────────────────────────────────
  readonly currentFlag = computed(() => this.rounds()[this.roundIndex()]);

  readonly currentName = computed(() => {
    const flag = this.currentFlag();
    if (!flag) return '';
    return this.settings.language() === 'it' ? flag.nameIt : flag.nameEn;
  });

  readonly isSessionComplete = computed(() => this.roundIndex() >= 10);

  readonly totalScore = computed(() =>
    this.roundResults().reduce((s, r) => s + r.score, 0)
  );

  readonly roundNumber = computed(() => Math.min(this.roundIndex() + 1, 10));

  // ── Session ───────────────────────────────────────────────────────

  startSession(): void {
    const pool = this.getPool();
    this.rounds.set(this.shuffle(pool).slice(0, 10));
    this.roundIndex.set(0);
    this.roundResults.set([]);
    this.initRound();
  }

  /** Regenerate current + remaining rounds from the current pool and reset the round. */
  restartCurrentRound(): void {
    if (this.rounds().length === 0 || this.isSessionComplete()) return;
    const pool = this.getPool();
    const usedCodes = new Set(this.roundResults().map(r => r.flag.code));
    const available = pool.filter(f => !usedCodes.has(f.code));
    const base = available.length > 0 ? available : pool;
    const shuffled = this.shuffle(base);
    const newRounds = [...this.rounds()];
    const remaining = 10 - this.roundIndex();
    for (let i = 0; i < remaining; i++) {
      newRounds[this.roundIndex() + i] = shuffled[i % shuffled.length];
    }
    this.rounds.set(newRounds);
    this.initRound();
  }

  initRound(): void {
    this.wrongClicks.set(new Set());
    this.lastWrongClick.set(null);
    this.correctClicked.set(null);
    this.hintUsed.set(false);
    this.roundComplete.set(false);
    this.roundCorrect.set(false);

    if (this.settings.gameMode() === 1) {
      this.generateMultiChoiceOptions(10);
      this.flagOptions.set([]);
    } else {
      this.generateFlagOptions(10);
      this.multiChoiceOptions.set([]);
    }
  }

  // ── Primary action (both modes) ───────────────────────────────────

  selectOption(flag: FlagEntry): void {
    if (this.roundComplete() || this.wrongClicks().has(flag.code)) return;

    const correct = flag.code === this.currentFlag().code;
    if (correct) {
      this.correctClicked.set(flag.code);
      this.sound.playCorrect();
      this.finishRound(true);
    } else {
      const newClicks = new Set([...this.wrongClicks(), flag.code]);
      this.wrongClicks.set(newClicks);
      this.lastWrongClick.set(flag.code);
      this.sound.playWrong();
      setTimeout(() => this.lastWrongClick.set(null), 600);

      if (newClicks.size >= MAX_WRONG) {
        setTimeout(() => this.finishRound(false), 800);
      }
    }
  }

  // ── Hint ──────────────────────────────────────────────────────────

  useHint(): void {
    if (this.hintUsed() || this.roundComplete()) return;
    this.hintUsed.set(true);

    const current = this.currentFlag();
    if (this.settings.gameMode() === 1) {
      const wrong = this.multiChoiceOptions().filter(
        f => f.code !== current.code && !this.wrongClicks().has(f.code)
      );
      const toRemove = new Set(this.shuffle(wrong).slice(0, 5).map(f => f.code));
      this.multiChoiceOptions.update(opts => opts.filter(f => !toRemove.has(f.code)));
    } else {
      const wrong = this.flagOptions().filter(
        f => f.code !== current.code && !this.wrongClicks().has(f.code)
      );
      const toRemove = new Set(this.shuffle(wrong).slice(0, 5).map(f => f.code));
      this.flagOptions.update(opts => opts.filter(f => !toRemove.has(f.code)));
    }
  }

  // ── Private ───────────────────────────────────────────────────────

  private finishRound(correct: boolean): void {
    if (this.roundComplete()) return;
    this.roundComplete.set(true);
    this.roundCorrect.set(correct);
    if (correct) this.sound.playRoundWin();

    this.roundResults.update(r => [...r, {
      flag:         this.currentFlag(),
      correct,
      hintUsed:     this.hintUsed(),
      wrongAttempts: this.wrongClicks().size,
      score:        this.calculateScore(correct),
    }]);

    setTimeout(() => {
      this.roundIndex.update(i => i + 1);
      if (!this.isSessionComplete()) this.initRound();
    }, 2000);
  }

  private calculateScore(correct: boolean): number {
    if (!correct) return 0;
    let score = 10;
    if (this.hintUsed()) score -= 3;
    score -= this.wrongClicks().size * 2;
    return Math.max(0, score);
  }

  private generateMultiChoiceOptions(count: number): void {
    const current = this.currentFlag();
    const pool = this.getPool().filter(f => f.code !== current.code);
    const options = this.shuffle([current, ...this.shuffle(pool).slice(0, count - 1)]);
    this.multiChoiceOptions.set(options);
  }

  private generateFlagOptions(count: number): void {
    const current = this.currentFlag();
    const pool = this.getPool().filter(f => f.code !== current.code);
    const options = this.shuffle([current, ...this.shuffle(pool).slice(0, count - 1)]);
    this.flagOptions.set(options);
  }

  private getPool(): FlagEntry[] {
    const d = this.settings.difficulty();
    if (d === 'easy')   return FLAGS.filter(f => f.difficulty === 'easy');
    if (d === 'medium') return FLAGS.filter(f => f.difficulty !== 'hard');
    return FLAGS;
  }

  private shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
