import { Injectable, effect, signal } from '@angular/core';
import { Difficulty } from '../data/flags';

export type Language = 'it' | 'en';
export type GameMode = 1 | 2;

const TRANSLATIONS = {
  modeTitle1:    { it: 'Indovina il Paese',    en: 'Guess the Country' },
  modeTitle2:    { it: 'Indovina la Bandiera', en: 'Guess the Flag'    },
  round:         { it: 'Round',                en: 'Round'             },
  score:         { it: 'Punteggio',            en: 'Score'             },
  hint:          { it: 'Suggerimento',         en: 'Hint'              },
  settings:      { it: 'Impostazioni',         en: 'Settings'          },
  difficulty:    { it: 'Difficoltà',           en: 'Difficulty'        },
  diffEasy:      { it: 'Facile',               en: 'Easy'              },
  diffMedium:    { it: 'Medio',                en: 'Medium'            },
  diffHard:      { it: 'Difficile',            en: 'Hard'              },
  mode:          { it: 'Modalità',             en: 'Mode'              },
  language:      { it: 'Lingua',               en: 'Language'          },
  sound:         { it: 'Suoni',                en: 'Sounds'            },
  on:            { it: 'Sì',                   en: 'On'                },
  off:           { it: 'No',                   en: 'Off'               },
  play:          { it: 'GIOCA',                en: 'PLAY'              },
  home:          { it: 'HOME',                 en: 'HOME'              },
  playAgain:     { it: 'GIOCA ANCORA',         en: 'PLAY AGAIN'        },
  results:       { it: 'RISULTATI',            en: 'RESULTS'           },
  correct:       { it: 'Corrette',             en: 'Correct'           },
  accuracy:      { it: 'Precisione',           en: 'Accuracy'          },
  well:          { it: 'Ottimo!',              en: 'Great!'            },
  tryAgain:      { it: 'Riprova!',             en: 'Try again!'        },
  closeSettings: { it: 'CHIUDI',              en: 'CLOSE'             },
  hintUsed:      { it: 'Suggerimento usato',   en: 'Hint used'         },
  mode1:         { it: 'Bandiera → Paese',     en: 'Flag → Country'    },
  mode2:         { it: 'Paese → Bandiera',     en: 'Country → Flag'    },
} as const;

type TranslationKey = keyof typeof TRANSLATIONS;

const STORAGE_KEYS = {
  difficulty: 'gf_difficulty',
  gameMode:   'gf_game_mode',
  language:   'gf_language',
  sound:      'gf_sound',
} as const;

@Injectable({ providedIn: 'root' })
export class SettingsService {
  readonly difficulty = signal<Difficulty>(this.load(STORAGE_KEYS.difficulty, 'easy') as Difficulty);
  readonly gameMode   = signal<GameMode>(Number(this.load(STORAGE_KEYS.gameMode, '1')) as GameMode);
  readonly language   = signal<Language>(this.load(STORAGE_KEYS.language, 'it') as Language);
  readonly sound      = signal<boolean>(this.load(STORAGE_KEYS.sound, 'true') === 'true');

  constructor() {
    effect(() => localStorage.setItem(STORAGE_KEYS.difficulty, this.difficulty()));
    effect(() => localStorage.setItem(STORAGE_KEYS.gameMode,   String(this.gameMode())));
    effect(() => localStorage.setItem(STORAGE_KEYS.language,   this.language()));
    effect(() => localStorage.setItem(STORAGE_KEYS.sound,      String(this.sound())));
  }

  t(key: TranslationKey): string {
    return TRANSLATIONS[key][this.language()];
  }

  private load(key: string, fallback: string): string {
    if (typeof localStorage === 'undefined') return fallback;
    return localStorage.getItem(key) ?? fallback;
  }
}
