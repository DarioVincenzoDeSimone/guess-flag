import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { Difficulty } from '../../data/flags';
import { GameMode } from '../../services/settings.service';

@Component({
  selector: 'app-settings-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-backdrop" role="dialog" aria-modal="true" [attr.aria-label]="s.t('settings')">
      <div class="modal-card">
        <h2 class="modal-title">{{ s.t('settings') }}</h2>

        <!-- Difficulty -->
        <div class="setting-row">
          <span class="setting-label">{{ s.t('difficulty') }}</span>
          <div class="pill-group" role="group" [attr.aria-label]="s.t('difficulty')">
            @for (opt of difficulties; track opt.value) {
              <button type="button"
                (click)="s.difficulty.set(opt.value)"
                class="pill-btn"
                [class.pill-btn--active]="s.difficulty() === opt.value"
                [attr.aria-pressed]="s.difficulty() === opt.value">
                {{ opt.label }}
              </button>
            }
          </div>
        </div>

        <!-- Game mode -->
        <div class="setting-row">
          <span class="setting-label">{{ s.t('mode') }}</span>
          <div class="pill-group" role="group" [attr.aria-label]="s.t('mode')">
            @for (opt of modes; track opt.value) {
              <button type="button"
                (click)="s.gameMode.set(opt.value)"
                class="pill-btn pill-btn--wide"
                [class.pill-btn--active]="s.gameMode() === opt.value"
                [attr.aria-pressed]="s.gameMode() === opt.value">
                {{ opt.label }}
              </button>
            }
          </div>
        </div>

        <!-- Language -->
        <div class="setting-row">
          <span class="setting-label">{{ s.t('language') }}</span>
          <div class="pill-group" role="group" [attr.aria-label]="s.t('language')">
            <button type="button" (click)="s.language.set('it')"
              class="pill-btn" [class.pill-btn--active]="s.language() === 'it'"
              [attr.aria-pressed]="s.language() === 'it'">🇮🇹 IT</button>
            <button type="button" (click)="s.language.set('en')"
              class="pill-btn" [class.pill-btn--active]="s.language() === 'en'"
              [attr.aria-pressed]="s.language() === 'en'">🇬🇧 EN</button>
          </div>
        </div>

        <!-- Sound -->
        <div class="setting-row">
          <span class="setting-label">{{ s.t('sound') }}</span>
          <div class="pill-group" role="group" [attr.aria-label]="s.t('sound')">
            <button type="button" (click)="s.sound.set(true)"
              class="pill-btn" [class.pill-btn--active]="s.sound()"
              [attr.aria-pressed]="s.sound()">{{ s.t('on') }}</button>
            <button type="button" (click)="s.sound.set(false)"
              class="pill-btn" [class.pill-btn--active]="!s.sound()"
              [attr.aria-pressed]="!s.sound()">{{ s.t('off') }}</button>
          </div>
        </div>

        <button type="button" (click)="close.emit()" class="btn btn--sky btn--full">
          {{ s.t('closeSettings') }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed; inset: 0;
      background: rgba(12,74,110,0.6);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      padding: 1.5rem; z-index: 50;
    }

    .modal-card {
      background: white; border-radius: 1.5rem; padding: 1.75rem;
      max-width: 22rem; width: 100%; border-top: 8px solid #38bdf8;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
      animation: zoom-in 0.25s ease-out;
    }

    .modal-title {
      font-size: 1.6rem; font-weight: 900; color: #0c4a6e;
      text-align: center; margin-bottom: 1.25rem;
    }

    .setting-row {
      display: flex; align-items: center;
      justify-content: space-between; gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .setting-label {
      font-weight: 700; color: #0369a1; font-size: 1rem;
      white-space: nowrap;
    }

    .pill-group { display: flex; gap: 0.4rem; flex-wrap: wrap; justify-content: flex-end; }

    .pill-btn {
      padding: 0.4rem 0.75rem; border-radius: 9999px;
      font-weight: 700; font-size: 0.875rem;
      border: 2px solid #e0f2fe; background: #e0f2fe;
      color: #0369a1; cursor: pointer;
      transition: background 0.15s, color 0.15s;
      white-space: nowrap;
    }
    .pill-btn--wide { padding: 0.4rem 0.5rem; font-size: 0.75rem; }
    .pill-btn--active { background: #0ea5e9; color: white; border-color: #0ea5e9; }

    .btn { display: flex; align-items: center; justify-content: center;
      padding: 0.75rem 1.25rem; border-radius: 1rem; font-weight: 900;
      font-size: 1.125rem; border: none; cursor: pointer;
      transition: transform 0.1s, background 0.15s;
      margin-top: 0.5rem;
    }
    .btn--full  { width: 100%; }
    .btn--sky   { background: #0ea5e9; color: white; box-shadow: 0 4px 0 #0284c7; }
    .btn--sky:hover  { background: #0284c7; }
    .btn:active { transform: translateY(2px); box-shadow: none !important; }

    @keyframes zoom-in {
      from { opacity: 0; transform: scale(0.95); }
      to   { opacity: 1; transform: scale(1); }
    }
  `]
})
export class SettingsModalComponent {
  protected readonly s = inject(SettingsService);
  readonly close = output<void>();

  protected readonly difficulties: { value: Difficulty; label: string }[] = [
    { value: 'easy',   label: '🌟' },
    { value: 'medium', label: '⭐⭐' },
    { value: 'hard',   label: '💀' },
  ];

  protected get modes(): { value: GameMode; label: string }[] {
    return [
      { value: 1, label: this.s.t('mode1') },
      { value: 2, label: this.s.t('mode2') },
    ];
  }
}
