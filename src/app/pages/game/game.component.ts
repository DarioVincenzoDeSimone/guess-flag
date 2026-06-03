import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { SettingsService } from '../../services/settings.service';
import { SettingsModalComponent } from '../../components/settings-modal/settings-modal.component';

const LIVES = [0, 1, 2] as const;

@Component({
  selector: 'app-game',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SettingsModalComponent],
  template: `
    <div class="shell">

      <!-- ── Header ─────────────────────────────────────── -->
      <div class="header-actions">
        <button type="button" class="icon-btn"
          [attr.aria-label]="s.t('hint')"
          [disabled]="game.hintUsed() || game.roundComplete()"
          (click)="game.useHint()"
          [class.icon-btn--used]="game.hintUsed()">
          <span class="material-icons" aria-hidden="true">lightbulb</span>
        </button>
        <button type="button" class="icon-btn"
          (click)="openSettings()"
          [attr.aria-label]="s.t('settings')">
          <span class="material-icons" aria-hidden="true">settings</span>
        </button>
      </div>

      <header class="game-header">
        <h1 class="game-title">
          {{ s.gameMode() === 1 ? s.t('modeTitle1') : s.t('modeTitle2') }}
        </h1>
        <div class="stats-bar">
          <div class="stat-chip stat-chip--round" aria-label="Round">
            <span class="material-icons" aria-hidden="true">flag</span>
            <span>{{ game.roundNumber() }} / 10</span>
          </div>
          <div class="stat-chip stat-chip--score" [attr.aria-label]="s.t('score')">
            <span class="material-icons" aria-hidden="true">star</span>
            <span>{{ game.totalScore() }}</span>
          </div>
        </div>

        <!-- Lives / remaining attempts -->
        <div class="lives-row"
             role="status"
             [attr.aria-label]="'Tentativi rimasti: ' + (3 - game.wrongClicks().size)">
          @for (i of lives; track i) {
            <span class="material-icons live"
                  [class.live--lost]="game.wrongClicks().size > i"
                  aria-hidden="true">favorite</span>
          }
        </div>
      </header>

      <!-- ── Mode 1: Flag → guess country name ──────────── -->
      @if (s.gameMode() === 1) {

        <div class="flag-stage">
          @if (game.currentFlag()) {
            <!-- Natural-ratio container: adapts to each flag's aspect ratio -->
            <div class="flag-wrap" [class.flag-win]="game.roundComplete() && game.roundCorrect()">
              <img [src]="flagSrc()" [alt]="game.currentName()"
                   class="flag-img" loading="eager"
                   (error)="onFlagError($event)">
            </div>
          }
          @if (game.roundComplete()) {
            <div class="result-badge" aria-live="polite">
              {{ game.roundCorrect() ? '✅' : '❌' }}
            </div>
          }
        </div>

        <!-- MC options pushed to bottom -->
        <div class="mc-area">
          <div class="mc-grid">
            @for (opt of game.multiChoiceOptions(); track opt.code) {
              @let isWrong   = game.wrongClicks().has(opt.code);
              @let isCorrect = game.correctClicked() === opt.code ||
                               (game.roundComplete() && !game.roundCorrect() && opt.code === game.currentFlag().code);
              @let isShaking = game.lastWrongClick() === opt.code;

              <button type="button"
                class="mc-btn"
                [class.mc-btn--wrong]="isWrong"
                [class.mc-btn--correct]="isCorrect"
                [class.shake]="isShaking"
                [disabled]="game.roundComplete() || isWrong"
                (click)="game.selectOption(opt)"
                [attr.aria-label]="s.language() === 'it' ? opt.nameIt : opt.nameEn">
                {{ s.language() === 'it' ? opt.nameIt : opt.nameEn }}
              </button>
            }
          </div>
        </div>
      }

      <!-- ── Mode 2: Country name → guess flag ──────────── -->
      @if (s.gameMode() === 2) {

        <div class="country-name-display" aria-live="polite">
          {{ game.currentName() }}
          @if (game.roundComplete()) {
            <span>{{ game.roundCorrect() ? ' ✅' : ' ❌' }}</span>
          }
        </div>

        <!-- Flag options: flex:1 fills remaining space, scrollable if needed -->
        <div class="fg-area">
          <div class="fg-grid" role="group"
               [attr.aria-label]="s.language() === 'it' ? 'Scegli la bandiera' : 'Choose the flag'">
            @for (flag of game.flagOptions(); track flag.code) {
              @let isWrong   = game.wrongClicks().has(flag.code);
              @let isCorrect = game.correctClicked() === flag.code ||
                               (game.roundComplete() && !game.roundCorrect() && flag.code === game.currentFlag().code);
              @let isShaking = game.lastWrongClick() === flag.code;

              <button type="button"
                class="fg-btn"
                [class.fg-btn--wrong]="isWrong"
                [class.fg-btn--correct]="isCorrect"
                [class.shake]="isShaking"
                [disabled]="game.roundComplete() || isWrong"
                (click)="game.selectOption(flag)"
                [attr.aria-label]="s.language() === 'it' ? flag.nameIt : flag.nameEn">
                <img [src]="'assets/flags/' + flag.code + '.svg'"
                     [alt]="s.language() === 'it' ? flag.nameIt : flag.nameEn"
                     loading="lazy" class="fg-img"
                     (error)="onFlagImgError($event)">
                @if (isWrong) {
                  <div class="fg-badge" aria-hidden="true">❌</div>
                }
                @if (isCorrect) {
                  <div class="fg-badge" aria-hidden="true">✅</div>
                }
              </button>
            }
          </div>
        </div>
      }

    </div>

    @if (settingsOpen()) {
      <app-settings-modal (close)="closeSettings()" />
    }
  `,
  styles: [`
    :host { display: block; height: 100%; }

    .shell {
      display: flex; flex-direction: column; align-items: center;
      height: 100%; padding: 0.75rem;
      background: #e0f2fe;
      border: 8px solid #bae6fd; border-radius: 1.5rem;
      box-shadow: inset 0 2px 16px rgba(0,0,0,0.08);
      box-sizing: border-box; position: relative;
      /* overflow: clip allows child scroll containers without clipping them */
      overflow: clip;
      gap: 0.4rem;
    }

    /* ── Header ── */
    .header-actions {
      position: absolute; top: 0.75rem; right: 0.75rem;
      display: flex; gap: 0.5rem; z-index: 10;
    }

    .icon-btn {
      width: 2.75rem; height: 2.75rem; min-width: 2.75rem;
      background: white; border: 2px solid #bae6fd; border-radius: 9999px;
      display: flex; align-items: center; justify-content: center;
      color: #0284c7; cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1); transition: transform 0.1s;
    }
    .icon-btn:active { transform: scale(0.95); }
    .icon-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
    .icon-btn--used  { color: #94a3b8; }

    .game-header  { text-align: center; margin-top: 2.75rem; flex-shrink: 0; }

    .game-title {
      font-size: clamp(1rem, 3.5vw, 1.4rem);
      font-weight: 900; color: #ec4899; text-transform: uppercase;
      letter-spacing: 0.05em; margin: 0 0 0.3rem;
    }

    .stats-bar { display: flex; gap: 0.75rem; justify-content: center; }

    .stat-chip {
      display: flex; align-items: center; gap: 0.3rem;
      padding: 0.3rem 0.7rem; border-radius: 0.75rem;
      font-weight: 900; font-size: 0.95rem; color: white; flex-shrink: 0;
    }
    .stat-chip .material-icons { font-size: 1rem; }
    .stat-chip--round { background: #fb923c; border-bottom: 3px solid #ea8c00; }
    .stat-chip--score { background: #a78bfa; border-bottom: 3px solid #7c3aed; }

    /* Lives row */
    .lives-row {
      display: flex; gap: 0.25rem; justify-content: center;
      margin-top: 0.4rem;
    }
    .live {
      font-size: 1.25rem; color: #f87171;
      transition: color 0.25s, transform 0.25s;
    }
    .live--lost { color: #cbd5e1; transform: scale(0.75); }

    /* ── Mode 1: flag stage ── */
    .flag-stage {
      position: relative; width: 100%; max-width: 300px; flex-shrink: 0;
      display: flex; justify-content: center; align-items: center;
    }

    /* No aspect-ratio: adapts to the flag's natural proportions */
    .flag-wrap {
      width: 100%;
      border-radius: 0.75rem; overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      border: 3px solid #bae6fd;
      transition: transform 0.3s, border-color 0.3s;
      line-height: 0; /* remove inline gap below img */
    }
    .flag-img {
      display: block; width: 100%; height: auto;
      /* drop-shadow outlines actual flag pixels, not the rectangular box */
      filter: drop-shadow(0 1px 3px rgba(0,0,0,0.12));
    }
    .flag-win { transform: scale(1.03); border-color: #4ade80; }

    .result-badge {
      position: absolute; font-size: 3rem;
      animation: pop-in 0.35s ease-out; pointer-events: none; z-index: 5;
    }

    /* ── Mode 1: multiple choice ── */
    .mc-area {
      margin-top: auto; width: 100%; max-width: 32rem; flex-shrink: 0;
    }
    .mc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; }

    .mc-btn {
      padding: 0.7rem 0.4rem; border-radius: 1rem;
      background: white; border: 2px solid #bae6fd;
      font-weight: 900; font-size: clamp(0.75rem, 2.5vw, 0.9rem);
      color: #0369a1; cursor: pointer;
      transition: background 0.15s, border-color 0.15s, transform 0.1s;
      text-transform: uppercase; letter-spacing: 0.04em;
      min-height: 3rem; touch-action: manipulation;
    }
    .mc-btn:hover:not(:disabled) { background: #e0f2fe; }
    .mc-btn:active:not(:disabled) { transform: scale(0.97); }
    .mc-btn:disabled { cursor: not-allowed; opacity: 0.45; }
    .mc-btn--wrong   { background: #fef2f2; border-color: #fca5a5; color: #dc2626; opacity: 0.55; }
    .mc-btn--correct { background: #dcfce7; border-color: #4ade80; color: #15803d; }

    /* ── Mode 2: country name ── */
    .country-name-display {
      font-size: clamp(1.4rem, 5.5vw, 2.2rem);
      font-weight: 900; color: #0c4a6e; text-transform: uppercase;
      letter-spacing: 0.05em; text-align: center;
      padding: 0.5rem 1rem; background: white;
      border-radius: 1rem; border: 3px solid #bae6fd;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      max-width: 90%; flex-shrink: 0;
    }

    /* ── Mode 2: flag grid ── */
    /* flex:1 fills remaining space; flex-direction:column lets margin-top:auto work on child */
    .fg-area {
      flex: 1; min-height: 0;
      width: 100%; max-width: 32rem;
      display: flex; flex-direction: column;
      overflow-y: auto; padding-bottom: 0.25rem;
    }

    .fg-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 0.5rem; align-items: start;
      margin-top: auto; /* push grid to bottom of the flex column */
    }

    .fg-btn {
      position: relative;
      /* Fixed height makes grid rows uniform and prevents layout thrash */
      height: 4.5rem;
      border-radius: 0.875rem;
      border: 2.5px solid #bae6fd;
      /* Sky-50 background: distinct from white flag backgrounds */
      background: #f0f9ff;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden; padding: 0.3rem;
      cursor: pointer;
      transition: border-color 0.15s, transform 0.1s, background 0.15s;
      touch-action: manipulation;
    }
    .fg-btn:hover:not(:disabled) { border-color: #7dd3fc; background: #e0f2fe; }
    .fg-btn:active:not(:disabled) { transform: scale(0.97); }
    .fg-btn:disabled { cursor: not-allowed; }

    .fg-img {
      /* Fills button width; object-fit:contain keeps natural ratio */
      width: 100%; height: 100%; object-fit: contain;
      pointer-events: none;
      /* drop-shadow traces actual flag pixels → white flags stay visible */
      filter: drop-shadow(0 0 2px rgba(0,0,0,0.18));
    }

    .fg-btn--wrong   { border-color: #fca5a5; background: #fef2f2; opacity: 0.5; }
    .fg-btn--correct { border-color: #4ade80; background: #dcfce7; }

    .fg-badge {
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem; background: rgba(255,255,255,0.65);
      pointer-events: none;
    }

    /* ── Animations ── */
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      60%      { transform: translateX(6px); }
    }
    .shake { animation: shake 0.4s ease; }

    @keyframes pop-in {
      from { transform: scale(0.4); opacity: 0; }
      to   { transform: scale(1);   opacity: 1; }
    }
  `]
})
export class GameComponent implements OnInit {
  protected readonly game   = inject(GameService);
  protected readonly s      = inject(SettingsService);
  private   readonly router = inject(Router);

  protected readonly settingsOpen = signal(false);
  protected readonly lives = LIVES;

  private settingsSnapshot: { difficulty: string; gameMode: number } | null = null;

  readonly flagSrc = computed(() => {
    const flag = this.game.currentFlag();
    return flag ? `assets/flags/${flag.code}.svg` : '';
  });

  constructor() {
    effect(() => {
      if (this.game.isSessionComplete()) {
        this.router.navigate(['/results']);
      }
    });
  }

  ngOnInit(): void {
    if (this.game.rounds().length === 0) {
      this.game.startSession();
    }
  }

  openSettings(): void {
    this.settingsSnapshot = { difficulty: this.s.difficulty(), gameMode: this.s.gameMode() };
    this.settingsOpen.set(true);
  }

  closeSettings(): void {
    this.settingsOpen.set(false);
    if (this.settingsSnapshot) {
      const changed =
        this.settingsSnapshot.difficulty !== this.s.difficulty() ||
        this.settingsSnapshot.gameMode   !== this.s.gameMode();
      if (changed) this.game.restartCurrentRound();
      this.settingsSnapshot = null;
    }
  }

  onFlagError(event: Event): void {
    (event.target as HTMLImageElement).style.visibility = 'hidden';
  }

  onFlagImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.visibility = 'hidden';
    img.closest('.fg-btn')?.classList.add('fg-btn--missing');
  }
}
