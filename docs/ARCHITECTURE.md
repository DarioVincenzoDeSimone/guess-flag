# Architecture

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Angular 21 (standalone, zoneless) | Matches Impiccato; signals-first |
| Styling | Tailwind CSS v4 | Matches Impiccato; zero-runtime |
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
      game.service.ts        # All game state as signals; actions as methods
      sound.service.ts       # Web Audio API beeps
    components/
      keyboard/              # A–Z grid, highlights correct/wrong letters
      settings-modal/        # Overlays current route; emits (close)
    pages/
      home/                  # Lazy-loaded; mode+difficulty picker; starts session
      game/                  # Lazy-loaded; Mode 1 and Mode 2 rendered via @if
      results/               # Lazy-loaded; reads roundResults from GameService
    app.ts                   # Root: <router-outlet> only
    app.routes.ts            # Lazy routes: '' / game / results
    app.config.ts            # provideZonelessChangeDetection + provideRouter(HashLocation)
  index.html                 # lang="it", Material Icons CDN
  styles.css                 # Tailwind import + shared .btn utilities
  main.ts                    # bootstrapApplication
public/
  assets/flags/              # SVG files downloaded by `npm run download-flags`
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

`GameService` is a singleton (`providedIn: 'root'`). It holds:
- `rounds` — 10 shuffled FlagEntry objects for the current session
- `roundIndex` — 0–10 (10 = session complete, triggers navigation to /results)
- `roundResults` — accumulated scores/outcomes
- Mode 1 state: `guessedLetters`, `wrongLetterCount`, `showMultipleChoice`
- Mode 2 state: `flagOptions`, `wrongClicks`, `correctClicked`

The `results` page reads `roundResults()` and `totalScore()` directly from `GameService`.
Navigation from `game` → `results` happens inside a signal `effect()` watching `isSessionComplete`.

---

## Change Detection

All components use `ChangeDetectionStrategy.OnPush`. The app is zoneless
(`provideZonelessChangeDetection()`). Angular schedules re-renders only when
a signal read inside the component's template changes. This gives native-app
performance on low-end mobile devices.

---

## i18n Strategy

A lightweight custom translation system lives inside `SettingsService`:
- `TRANSLATIONS` constant object: `{ key: { it: '…', en: '…' } }`
- `s.t(key)` method: returns the string for the current `language` signal
- Flag names come from `FlagEntry.nameIt` / `FlagEntry.nameEn`, selected at runtime

No Angular built-in i18n or third-party libraries are used; the overhead would
exceed the benefit for a two-language hobby game.

---

## GitHub Pages Deploy Pipeline

1. `ng build --configuration production` — sets `baseHref=/guess-flag/`
2. Output lands in `dist/guess-flag/browser/`
3. `npx angular-cli-ghpages --dir=dist/guess-flag/browser` — force-pushes to `gh-pages`
4. HashLocationStrategy ensures all `/#/…` routes work without server rewrites
