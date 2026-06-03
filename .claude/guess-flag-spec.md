# 🎌 Guess Flag — Claude Code Build Specification

## Overview

Build an Angular web game called **Guess Flag** for children aged 5–10. The game teaches geography and world flags through two interactive game modes, multiple difficulty levels, and a custom on-screen keyboard. The project must be deployable to **GitHub Pages** as a Single Page Application (SPA).

---

## Reference Project — "Impiccato"

> **IMPORTANT**: Before writing a single line of code, open the `../Impiccato` sibling folder and study it thoroughly:

- Read its `package.json` to understand which Angular version, libraries, and tools are already in use. Reuse any relevant dependencies (routing, i18n, animations, etc.) rather than introducing new ones.
- Copy its entire visual identity: color palette, typography, CSS variables, button styles, card styles, layout system, spacing scale, border radii, shadows, and icon usage.
- Copy its project structure (folder organization, naming conventions, module/component architecture).
- Copy its `angular.json`, `tsconfig.json`, and build configuration where applicable.
- Copy its `gh-pages` / deploy setup exactly (base-href strategy, 404.html SPA redirect hack, `ngh` or custom deploy script).
- Copy its routing strategy (HashLocationStrategy or the 404-redirect trick) to ensure deep links work on GitHub Pages.
- Copy its keyboard component (the custom on-screen keyboard already built in Impiccato) and adapt it for this game — **do not rebuild it from scratch**.
- Copy its hint/suggestion icon interaction pattern.
- Copy its settings menu component and pattern.
- Copy its i18n setup (Italian + English).

The two projects will live side by side and must look like they belong to the same family. A user switching between them should feel no visual discontinuity.

---

## Project Bootstrap

```bash
# From the parent folder (same level as Impiccato/)
ng new guess-flag --routing --style=scss --standalone false
cd guess-flag
```

Check `../Impiccato/package.json` and install the same versions of shared dependencies. Do **not** introduce heavy libraries (no NgRx, no Angular Material, no Bootstrap). Keep the bundle small.

---

## Flag Assets

Download SVG flags for every country in the world from **flagcdn.com** (e.g. `https://flagcdn.com/it.svg`). Use the ISO 3166-1 alpha-2 code as the filename (`it.svg`, `fr.svg`, `us.svg`, …).

Create a script `scripts/download-flags.sh` (or `scripts/download-flags.ts`) that:
1. Iterates over the full list of ISO codes defined in `src/assets/data/flags.ts`.
2. Downloads each SVG into `src/assets/flags/`.
3. Is idempotent (skips already downloaded files).

Add an npm script: `"download-flags": "ts-node scripts/download-flags.ts"`.

---

## Flag Data File

Create `src/assets/data/flags.ts` exporting a typed array:

```ts
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface FlagEntry {
  code: string;        // ISO 3166-1 alpha-2, lowercase  e.g. "it"
  nameIt: string;      // Italian name  e.g. "Italia"
  nameEn: string;      // English name  e.g. "Italy"
  difficulty: Difficulty;
}

export const FLAGS: FlagEntry[] = [ ... ];
```

### Difficulty assignment guidelines

| Difficulty | Criteria |
|---|---|
| `easy` | ~30 flags: major European nations (Italy, France, Germany, Spain, Portugal, Switzerland, Netherlands, Belgium, Austria, Sweden, Norway, Denmark, Finland, Greece, Poland), UK, USA, Canada, Brazil, Argentina, Mexico, Australia, Japan, China, India, Russia, South Africa, Egypt, Turkey, South Korea |
| `medium` | ~70 additional flags: rest of Europe, Southeast Asia, Middle East, larger African and Latin American nations |
| `hard` | All remaining flags (~100+): small island nations, territories, less-known states |

---

## Game Modes

### Mode 1 — "Indovina il Paese" (Guess the Country)

- A flag SVG is displayed prominently at the center of the screen.
- The player must type the country name using the **custom keyboard** (copied from Impiccato). Letters appear in a display row above the keyboard, one slot per character (like hangman).
- Comparison is **case-insensitive** and **accent-insensitive** (normalize with `normalize('NFD').replace(/\p{Diacritic}/gu, '')`).
- A ✅ animation plays on correct answer; a ❌ shake animation plays on wrong attempt. Track wrong attempts.
- **Hint action**: replace the keyboard with a multiple-choice panel of **6 country names** (all in uppercase block letters), one of which is the correct answer.

### Mode 2 — "Indovina la Bandiera" (Guess the Flag)

- The country name is displayed prominently.
- The player sees a **grid of 10 flag SVGs** to choose from (one correct, nine random distractors matching the current difficulty level).
- Tap/click a flag to answer. Correct = ✅ animation; wrong = ❌ shake on the tapped flag.
- **Hint action**: reduce the choices from 10 to **5** (remove 5 wrong options with a fade-out animation).

---

## Settings Menu

Replicate the settings menu from Impiccato. Add the following settings:

| Setting | Options | Default |
|---|---|---|
| Difficulty | Easy / Medium / Hard | Easy |
| Game mode | Mode 1 / Mode 2 | Mode 1 |
| Language | Italiano / English | Italiano |
| Sound effects | On / Off | On |

Settings must be persisted in `localStorage`.

---

## Hint System

Each round the player has **one hint** available (indicated by an icon — reuse the hint icon style from Impiccato). After using it:
- The icon becomes disabled/greyed for the rest of the round.
- In mode 1: keyboard area slides out, multiple-choice panel slides in (CSS transition).
- In mode 2: 5 wrong flags fade out.
- Track hint usage in the session score.

---

## Score & Progress

- Show a **round counter** (e.g. "3 / 10").
- Show a **score** incrementing on correct answers. Bonus points for answering without hints.
- At the end of a session (10 rounds): show a **results screen** with score, accuracy %, and a "Play again" button. Match the results screen style of Impiccato.

---

## Routing

```
/              → Home / game mode selector
/game          → Active game screen
/settings      → Settings screen
/results       → End-of-round results
```

**GitHub Pages SPA fix**: use the same strategy as Impiccato (either `HashLocationStrategy` or the `404.html` copy trick). Document the chosen strategy in a comment inside `app-routing.module.ts`.

---

## i18n

Support **Italian** (default) and **English**. Use the same i18n pattern as Impiccato (Angular built-in `$localize` / `i18n` attributes, or a lightweight custom service — match whatever Impiccato uses). All UI strings must be translatable. Flag names come from `FlagEntry.nameIt` / `FlagEntry.nameEn` and are selected at runtime based on the active language.

---

## Animations & UX

- All transitions must respect a child-friendly feel: bouncy, colorful, never jarring.
- Use the same animation tokens (duration, easing) as Impiccato.
- Flag images must load lazily; show a placeholder skeleton while loading.
- The keyboard must be thumb-friendly on mobile (large tap targets, minimum 48 × 48 px).
- The flag grid in Mode 2 must be scrollable on small screens.

---

## Accessibility

- All interactive elements must have `aria-label`.
- Minimum contrast ratio 4.5:1.
- Focus ring visible on keyboard navigation.
- Images: `alt` = country name in current language.

---

## Project Documents to Generate

Claude Code must also create the following markdown files inside the project root:

### `README.md`
Write a compelling English README. Cover:
- The philosophy behind building educational STEM games **together with your children** — how play is the most natural form of learning, and how geography games spark curiosity about the world.
- The importance of **vibe coding** as a parenting practice: sitting side by side, explaining what the code does, letting children suggest features and watch them come to life — turning screen time into a creative, collaborative, and educational activity.
- How this project is part of a growing **family game suite** — a collection of games built game by game as the children grow, each one designed by a parent who cares deeply about what their kids play and how they learn.
- Technical highlights: Angular, GitHub Pages, SVG flags, offline-friendly, mobile-first, zero tracking, zero ads.
- How to run locally and how to deploy.
- A "Games in the suite" section listing Impiccato (Hangman) and Guess Flag, with a note that more games are planned.

### `docs/SCOPE.md`
Project scope: goals, non-goals, target users (children 5–10), supported platforms, out-of-scope features (backend, accounts, ads).

### `docs/BRAND_GUIDELINES.md`
Document the shared visual identity of the game suite: color palette (extract exact hex values from Impiccato), typography, spacing scale, component library (buttons, cards, keyboard, modals), tone of voice, icon style. This file is the source of truth for any future game in the suite.

### `docs/ARCHITECTURE.md`
Describe the Angular project structure, module breakdown, data flow, state management approach, i18n strategy, and GitHub Pages deploy pipeline.

### `docs/GAME_DESIGN.md`
Full game design document: both modes, difficulty system, hint system, scoring, round structure, and future ideas (timed mode, continent filter, flag quiz history).

---

## Deploy

Replicate the exact deploy setup from Impiccato. The `package.json` must include:

```json
"scripts": {
  "build:prod": "ng build --configuration production",
  "deploy": "ng build --configuration production && npx ngh --dir=dist/guess-flag"
}
```

Verify that `angular.json` has the correct `baseHref` for GitHub Pages (`/guess-flag/`).

Add a `docs/DEPLOY.md` explaining step-by-step how to deploy to GitHub Pages.

---

## Quality Checklist

Before considering the project complete, verify:

- [ ] `npm run download-flags` downloads all SVGs without errors.
- [ ] Both game modes work end-to-end on desktop and mobile.
- [ ] Hint system works correctly in both modes.
- [ ] Settings persist across page reloads.
- [ ] i18n switches correctly between Italian and English.
- [ ] `npm run deploy` publishes to GitHub Pages without routing errors.
- [ ] No `console.error` in production build.
- [ ] Lighthouse mobile score ≥ 85 (Performance, Accessibility, Best Practices).
- [ ] Visual identity is indistinguishable from Impiccato's family style.
