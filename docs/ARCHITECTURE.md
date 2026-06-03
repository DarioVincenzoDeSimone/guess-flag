# Architecture

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Angular 21 (standalone, zoneless) | Matches Impiccato; signals-first |
| Styling | Tailwind CSS v4 + inline component styles | Matches Impiccato; zero-runtime |
| State | Angular Signals | Fine-grained reactivity, no RxJS overhead |
| Routing | Angular Router + HashLocationStrategy | GitHub Pages SPA compatibility |
| Build | `@angular/build:application` | Modern ESBuild pipeline |
| Deploy | `angular-cli-ghpages` | One-command deploy to `gh-pages` branch |

---

## Project Structure

```
src/
  app/
    data/
      flags.ts               # ~195 FlagEntry records (code, nameIt, nameEn, difficulty)
    services/
      settings.service.ts    # Difficulty, gameMode, language, sound — persisted to localStorage
      game.service.ts        # All game state as signals; unified selectOption() for both modes
      sound.service.ts       # Web Audio API beeps (no audio files)
    components/
      settings-modal/        # Overlays current route; emits (close)
    pages/
      home/                  # Lazy-loaded; mode+difficulty picker; starts session
      game/                  # Lazy-loaded; Mode 1 and Mode 2 rendered via @if
      results/               # Lazy-loaded; reads roundResults from GameService
    app.ts                   # Root: centered frame (max 480×900px) + <router-outlet>
    app.routes.ts            # Lazy routes: '' / game / results
    app.config.ts            # provideZonelessChangeDetection + provideRouter(HashLocation)
  index.html                 # lang="it", Material Icons CDN
  styles.css                 # Tailwind import + shared .btn utilities
  main.ts                    # bootstrapApplication
public/
  assets/flags/              # ~196 SVG files downloaded by `npm run download-flags`
  404.html                   # SPA fallback for GitHub Pages
scripts/
  download-flags.mjs         # Node.js script — downloads from flagcdn.com
```

---

## Data Flow

```
SettingsService (localStorage) ──→ GameService ──→ game/results pages
                                       ↑
                              HomeComponent.startGame()
                                   calls startSession()
```

`GameService` is a singleton (`providedIn: 'root'`). Key signals:
- `rounds` — 10 shuffled FlagEntry objects for the current session
- `roundIndex` — 0–10; reaching 10 triggers navigation to /results via `effect()`
- `roundResults` — accumulated `RoundResult[]` (score, correct, hintUsed, wrongAttempts)
- `multiChoiceOptions` — 10 country-name options for Mode 1 (hint → 5)
- `flagOptions` — 10 flag options for Mode 2 (hint → 5)
- `wrongClicks: Set<string>` — codes of wrong-clicked options, shared across both modes
- `correctClicked`, `lastWrongClick` — drive CSS animations

Both modes share a single `selectOption(flag)` method. Wrong-click tracking is unified.

### Mid-game settings reset

`GameComponent.closeSettings()` compares settings before/after the modal. If
`difficulty` or `gameMode` changed, it calls `game.restartCurrentRound()` which
regenerates the current and remaining rounds from the new pool, then calls `initRound()`.

---

## Layout & Viewport

`app.ts` renders a centered frame:
```
:host  { display: flex; height: 100dvh; padding: 0.5rem; }
.frame { width: 100%; max-width: 480px; max-height: 900px; height: 100%; }
```

Pages use `height: 100%` (not `100dvh`) to fill the frame. The shell div inside
each page uses `overflow: clip` to contain animations without blocking internal
scroll containers (used by the Mode 2 flag grid).

---

## Change Detection

All components use `ChangeDetectionStrategy.OnPush`. The app is zoneless
(`provideZonelessChangeDetection()`). Angular re-renders only when a signal
dependency in the template changes — essential for smooth 60fps on low-end mobile.

---

## i18n Strategy

A lightweight translation map lives inside `SettingsService`:
- `TRANSLATIONS` constant: `{ key: { it: '…', en: '…' } }`
- `s.t(key)` method: returns the string for the current `language()` signal
- Flag names: `FlagEntry.nameIt` / `FlagEntry.nameEn`, selected at runtime

No Angular built-in i18n or third-party library — overhead exceeds benefit for
a two-language hobby game.

---

## GitHub Pages Deploy Pipeline

```
npm run deploy
  └─ ng build --base-href "https://DarioVincenzoDeSimone.github.io/guess-flag/"
       └─ output: dist/guess-flag/browser/   (includes public/assets/flags/*.svg)
  └─ npx angular-cli-ghpages --dir=dist/guess-flag/browser
       └─ force-pushes to gh-pages branch
```

Asset paths in the app are **relative** (`assets/flags/it.svg`, no leading `/`)
so they resolve correctly under the `/guess-flag/` base href on GitHub Pages.

HashLocationStrategy: all `/#/…` routes work without server-side rewrites.
