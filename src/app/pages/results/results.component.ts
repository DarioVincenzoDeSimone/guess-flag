import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-results',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  template: `
    <div class="shell">

      <!-- Decorations -->
      <div class="decor decor--tl" aria-hidden="true"></div>
      <div class="decor decor--br" aria-hidden="true"></div>

      <!-- Title -->
      <h1 class="results-title">
        {{ game.totalScore() >= 70 ? '🎉' : game.totalScore() >= 40 ? '👍' : '😊' }}
        {{ s.t('results') }}
      </h1>

      <!-- Score big display -->
      <div class="score-big" aria-label="Punteggio totale">
        <span class="score-number">{{ game.totalScore() }}</span>
        <span class="score-max"> / 100</span>
      </div>

      <!-- Stats row -->
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-value">{{ correctCount() }}</span>
          <span class="stat-label">{{ s.t('correct') }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ accuracy() }}%</span>
          <span class="stat-label">{{ s.t('accuracy') }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ hintsUsed() }}</span>
          <span class="stat-label">{{ s.t('hint') }}</span>
        </div>
      </div>

      <!-- Round summary -->
      <div class="round-list" role="list">
        @for (r of game.roundResults(); track r.flag.code) {
          <div class="round-item" role="listitem">
            <div class="round-flag">
              <img [ngSrc]="'assets/flags/' + r.flag.code + '.svg'"
                   width="40" height="27"
                   style="object-fit: contain; border-radius: 3px;"
                   [alt]="s.language() === 'it' ? r.flag.nameIt : r.flag.nameEn"
                   (error)="onFlagError($event)">
            </div>
            <div class="round-name">
              {{ s.language() === 'it' ? r.flag.nameIt : r.flag.nameEn }}
            </div>
            <div class="round-score" [class.round-score--zero]="r.score === 0">
              {{ r.correct ? '+' + r.score : '❌' }}
            </div>
          </div>
        }
      </div>

      <!-- Actions -->
      <div class="actions">
        <button type="button" class="btn btn--orange" (click)="playAgain()"
          [attr.aria-label]="s.t('playAgain')">
          <span class="material-icons" aria-hidden="true">refresh</span>
          {{ s.t('playAgain') }}
        </button>
        <button type="button" class="btn btn--sky" (click)="goHome()"
          [attr.aria-label]="s.t('home')">
          <span class="material-icons" aria-hidden="true">home</span>
          {{ s.t('home') }}
        </button>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }

    .shell {
      display: flex; flex-direction: column; align-items: center;
      height: 100%; padding: 1.5rem;
      background: #e0f2fe;
      border: 8px solid #bae6fd; border-radius: 1.5rem;
      box-shadow: inset 0 2px 16px rgba(0,0,0,0.08);
      box-sizing: border-box; position: relative; overflow-y: auto;
      gap: 0.75rem;
    }

    .decor {
      position: absolute; width: 10rem; height: 10rem;
      border-radius: 9999px; z-index: 0; pointer-events: none;
    }
    .decor--tl { top: -3rem; left: -3rem; background: #fce7f3; }
    .decor--br { bottom: -3rem; right: -3rem; background: #d1fae5; }

    .results-title {
      font-size: clamp(1.8rem, 6vw, 2.5rem); font-weight: 900; color: #0c4a6e;
      text-transform: uppercase; letter-spacing: 0.05em; text-align: center;
      animation: zoom-in 0.4s ease-out;
      position: relative; z-index: 1;
    }

    .score-big {
      display: flex; align-items: baseline; gap: 0.25rem;
      animation: zoom-in 0.5s ease-out;
    }
    .score-number {
      font-size: clamp(3.5rem, 14vw, 5rem); font-weight: 900;
      color: #ec4899; line-height: 1;
    }
    .score-max { font-size: 1.5rem; color: #94a3b8; font-weight: 700; }

    .stats-row {
      display: flex; gap: 0.75rem; justify-content: center;
    }

    .stat-card {
      display: flex; flex-direction: column; align-items: center;
      padding: 0.75rem 1.25rem; background: white;
      border-radius: 1rem; border: 2px solid #bae6fd;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .stat-value { font-size: 1.5rem; font-weight: 900; color: #0284c7; }
    .stat-label { font-size: 0.75rem; font-weight: 600; color: #64748b; margin-top: 0.1rem; }

    .round-list {
      width: 100%; max-width: 24rem;
      display: flex; flex-direction: column; gap: 0.3rem;
      flex: 1; overflow-y: auto;
    }

    .round-item {
      display: flex; align-items: center; gap: 0.75rem;
      background: white; border-radius: 0.75rem; padding: 0.4rem 0.75rem;
      border: 2px solid #e0f2fe;
    }
    .round-flag { flex-shrink: 0; width: 40px; height: 27px; }
    .round-name { flex: 1; font-weight: 700; color: #0369a1; font-size: 0.875rem; }
    .round-score { font-weight: 900; color: #22c55e; font-size: 1rem; }
    .round-score--zero { color: #f87171; }

    .actions { display: flex; gap: 0.75rem; width: 100%; max-width: 24rem; }

    .btn {
      flex: 1; display: flex; align-items: center; justify-content: center;
      gap: 0.4rem; padding: 0.85rem 1rem; border-radius: 1rem;
      font-weight: 900; font-size: 1rem; border: none; cursor: pointer;
      transition: transform 0.1s, box-shadow 0.1s;
      touch-action: manipulation;
    }
    .btn .material-icons { font-size: 1.1rem; }
    .btn:active { transform: translateY(2px); box-shadow: none !important; }

    .btn--orange { background: #fb923c; color: white; box-shadow: 0 4px 0 #ea8c00; }
    .btn--orange:hover { background: #f97316; }
    .btn--sky    { background: #0ea5e9; color: white; box-shadow: 0 4px 0 #0284c7; }
    .btn--sky:hover { background: #0284c7; }

    @keyframes zoom-in {
      from { opacity: 0; transform: scale(0.9); }
      to   { opacity: 1; transform: scale(1); }
    }
  `]
})
export class ResultsComponent {
  protected readonly game   = inject(GameService);
  protected readonly s      = inject(SettingsService);
  private   readonly router = inject(Router);

  readonly correctCount = computed(() => this.game.roundResults().filter(r => r.correct).length);
  readonly accuracy     = computed(() => Math.round(this.correctCount() / 10 * 100));
  readonly hintsUsed    = computed(() => this.game.roundResults().filter(r => r.hintUsed).length);

  playAgain(): void {
    this.game.startSession();
    this.router.navigate(['/game']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  onFlagError(event: Event): void {
    (event.target as HTMLImageElement).style.visibility = 'hidden';
  }
}
