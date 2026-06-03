# 🌍 Guess Flag!

> *A world-flags geography game for children aged 5–10, built together.*

---

## The Philosophy — Playing Side by Side

The best education doesn't look like education. It looks like a parent and a child sitting together at a keyboard, asking *"do you know which country this is?"*, watching a little face light up, and realising that geography — one of the richest subjects in the world — can be as natural as a bedtime story.

**Guess Flag** was designed from scratch with children in mind: no ads, no accounts, no dark patterns. Just flags, names, and the slow joy of recognising a corner of the world you hadn't noticed before.

---

## Vibe Coding as a Parenting Practice

*Vibe coding* means sitting side by side with your child and building something together — explaining what the code does in plain words, letting them suggest features, and watching those features come to life on screen. It turns screen time into collaborative, creative, educational time.

When your child says *"can we add a timer?"* or *"why is that flag so simple?"*, a whole conversation about the world opens up. That is the real lesson.

---

## A Growing Family Game Suite

This game is part of a collection built game by game as children grow:

| Game | Description |
|---|---|
| [**L'Impiccato**](../Impiccato) | Classic Hangman in Italian & English |
| **Guess Flag!** | World flags geography game *(this project)* |
| *More coming…* | Each game designed by a parent who cares |

The suite shares a visual identity so switching between games feels seamless.

---

## How to Play

**Mode 1 — Guess the Country 🏳️**
A flag appears on screen. Use the on-screen keyboard to type the country's name, letter by letter. Stuck? Use the 💡 hint to get six multiple-choice options.

**Mode 2 — Guess the Flag 🗺️**
A country name appears. Pick the correct flag from a grid of ten. The hint removes five wrong options.

Settings let you choose:
- **Difficulty** — Easy (30 countries), Medium (~100), Hard (all ~195)
- **Language** — Italiano / English
- **Sound** — On / Off

Each session is 10 rounds. Score up to 10 points per round — more wrong guesses or hints reduce the score.

---

## Technical Highlights

- **Angular 21** with standalone components, signals, OnPush everywhere
- **Tailwind CSS v4** — zero runtime CSS overhead
- **GitHub Pages SPA** via `HashLocationStrategy` (no server config needed)
- **SVG flags** from [flagcdn.com](https://flagcdn.com) — crisp at any resolution
- **Web Audio API** sound effects — no audio files to download
- **Zero tracking, zero ads, offline-friendly** after the first load
- **Mobile-first** — thumb-friendly keyboard, scrollable flag grid

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Download flag SVGs (one-time setup, ~200 files from flagcdn.com)
npm run download-flags

# 3. Start dev server
npm start
# Opens at http://localhost:4201
```

---

## Deploying to GitHub Pages

```bash
npm run deploy
```

Builds with `--configuration production` (sets `baseHref=/guess-flag/`) and
publishes via `angular-cli-ghpages` to the `gh-pages` branch.

See [`docs/DEPLOY.md`](docs/DEPLOY.md) for the full step-by-step guide.

---

## Project Structure

```
src/app/
  data/flags.ts          # ~195 countries with IT/EN names + difficulty
  services/
    settings.service.ts  # Persisted settings (localStorage)
    game.service.ts      # Core game state (Angular signals)
    sound.service.ts     # Web Audio sound effects
  components/
    keyboard/            # On-screen A–Z keyboard (adapted from Impiccato)
    settings-modal/      # Settings overlay
  pages/
    home/                # Mode & difficulty selector
    game/                # Active game (both modes)
    results/             # End-of-session scoreboard
scripts/
  download-flags.mjs     # Downloads flag SVGs from flagcdn.com
public/assets/flags/     # Flag SVG files (populated by download-flags)
docs/                    # Architecture, brand, design & deploy docs
```
