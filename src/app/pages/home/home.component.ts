import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../../services/settings.service';
import { GameService } from '../../services/game.service';
import { SettingsModalComponent } from '../../components/settings-modal/settings-modal.component';
import { Difficulty } from '../../data/flags';
import { GameMode } from '../../services/settings.service';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SettingsModalComponent],
  template: `
    <div class="shell">

      <!-- Settings button -->
      <button type="button" class="icon-btn settings-btn"
        (click)="settingsOpen.set(true)"
        [attr.aria-label]="s.t('settings')">
        <span class="material-icons" aria-hidden="true">settings</span>
      </button>

      <!-- Hero -->
      <div class="hero">
        <div class="globe-emoji" aria-hidden="true">🌍</div>
        <h1 class="game-title">Guess<br>Flag!</h1>
        <p class="subtitle">
          {{ s.language() === 'it'
            ? 'Impara le bandiere del mondo'
            : 'Learn the world flags' }}
        </p>
      </div>

      <!-- Quick-select mode -->
      <div class="mode-cards" role="group" [attr.aria-label]="s.t('mode')">
        @for (m of modes; track m.value) {
          <button type="button"
            class="mode-card"
            [class.mode-card--active]="s.gameMode() === m.value"
            (click)="s.gameMode.set(m.value)"
            [attr.aria-pressed]="s.gameMode() === m.value">
            <span class="mode-icon" aria-hidden="true">{{ m.icon }}</span>
            <span class="mode-label">{{ m.label }}</span>
          </button>
        }
      </div>

      <!-- Quick-select difficulty -->
      <div class="diff-row" role="group" [attr.aria-label]="s.t('difficulty')">
        @for (d of difficulties; track d.value) {
          <button type="button"
            class="diff-btn"
            [class.diff-btn--active]="s.difficulty() === d.value"
            (click)="s.difficulty.set(d.value)"
            [attr.aria-pressed]="s.difficulty() === d.value">
            {{ d.label }}
          </button>
        }
      </div>

      <!-- Play button -->
      <button type="button" class="btn btn--play" (click)="startGame()"
        [attr.aria-label]="s.t('play')">
        {{ s.t('play') }} 🎮
      </button>

    </div>

    @if (settingsOpen()) {
      <app-settings-modal (close)="settingsOpen.set(false)" />
    }
  `,
  styles: [`
    :host { display: block; height: 100%; }

    .shell {
      display: flex; flex-direction: column;
      align-items: center; justify-content: space-evenly;
      height: 100%; padding: 1.5rem;
      background: #e0f2fe;
      border: 8px solid #bae6fd; border-radius: 1.5rem;
      box-shadow: inset 0 2px 16px rgba(0,0,0,0.08);
      box-sizing: border-box; position: relative; overflow: hidden;
    }

    .settings-btn {
      position: absolute; top: 1rem; right: 1rem;
      width: 3rem; height: 3rem;
      background: white; border: 2px solid #bae6fd;
      border-radius: 9999px;
      display: flex; align-items: center; justify-content: center;
      color: #0284c7; cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      transition: transform 0.1s;
    }
    .settings-btn:active { transform: scale(0.95); }

    .hero { text-align: center; }

    .globe-emoji {
      font-size: 4rem;
      animation: spin-slow 8s linear infinite;
      display: inline-block;
    }

    .game-title {
      font-size: clamp(2.8rem, 10vw, 4rem);
      font-weight: 900;
      color: #ec4899;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      line-height: 1;
      margin: 0.25rem 0;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
    }

    .subtitle {
      font-size: 1rem; color: #0369a1; font-weight: 600;
      margin: 0;
    }

    .mode-cards {
      display: flex; gap: 0.75rem; width: 100%; max-width: 22rem;
    }

    .mode-card {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; gap: 0.4rem;
      padding: 0.9rem 0.5rem; border-radius: 1.25rem;
      background: white; border: 3px solid #bae6fd;
      cursor: pointer; transition: border-color 0.15s, transform 0.1s;
      color: #0369a1;
    }
    .mode-card:active  { transform: scale(0.97); }
    .mode-card--active { border-color: #0ea5e9; background: #e0f2fe; }

    .mode-icon { font-size: 1.75rem; }
    .mode-label { font-size: 0.75rem; font-weight: 700; text-align: center; }

    .diff-row {
      display: flex; gap: 0.5rem;
    }

    .diff-btn {
      padding: 0.5rem 1.25rem; border-radius: 9999px;
      font-weight: 700; font-size: 0.95rem;
      border: 2px solid #e0f2fe; background: white;
      color: #0369a1; cursor: pointer;
      transition: background 0.15s;
    }
    .diff-btn--active { background: #0ea5e9; color: white; border-color: #0ea5e9; }

    .btn {
      display: inline-flex; align-items: center; justify-content: center;
      gap: 0.5rem; padding: 1rem 2.5rem;
      border-radius: 1.25rem; font-weight: 900; font-size: 1.4rem;
      border: none; cursor: pointer;
      transition: transform 0.1s, box-shadow 0.1s;
      touch-action: manipulation;
    }
    .btn:active { transform: translateY(3px); box-shadow: none !important; }

    .btn--play {
      background: #fb923c; color: white;
      box-shadow: 0 6px 0 #ea8c00;
      width: 100%; max-width: 22rem;
    }
    .btn--play:hover { background: #f97316; }

    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
  `]
})
export class HomeComponent {
  protected readonly s      = inject(SettingsService);
  private  readonly game    = inject(GameService);
  private  readonly router  = inject(Router);

  protected readonly settingsOpen = signal(false);

  protected get modes(): { value: GameMode; icon: string; label: string }[] {
    return [
      { value: 1, icon: '🏳️', label: this.s.t('mode1') },
      { value: 2, icon: '🗺️', label: this.s.t('mode2') },
    ];
  }

  protected get difficulties(): { value: Difficulty; label: string }[] {
    return [
      { value: 'easy',   label: this.s.t('diffEasy')   },
      { value: 'medium', label: this.s.t('diffMedium') },
      { value: 'hard',   label: this.s.t('diffHard')   },
    ];
  }

  startGame(): void {
    this.game.startSession();
    this.router.navigate(['/game']);
  }
}
