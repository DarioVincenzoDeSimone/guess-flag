# 🌍 Guess Flag!

> *A world-flags geography game for children aged 5–10, built together.*

<img width="416" height="896" alt="Image" src="https://github.com/user-attachments/assets/085c6599-8baa-4af1-bf61-feb1321ad8a1" />

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

| Game | Description | Live |
|---|---|---|
| [**L'Impiccato**](https://github.com/DarioVincenzoDeSimone/impiccato) | Classic Hangman — Italian vocabulary, multiplayer mode | [▶ Play](https://DarioVincenzoDeSimone.github.io/impiccato/) |
| **Guess Flag!** | World-flags geography quiz — 195 countries, two modes *(this project)* | [▶ Play](https://DarioVincenzoDeSimone.github.io/guess-flag/) |
| [**Guess Brand!**](https://github.com/DarioVincenzoDeSimone/guess-brand) | Car-brand logo quiz — 44 brands, two modes | [▶ Play](https://DarioVincenzoDeSimone.github.io/guess-brand/) |
| *More coming…* | Each game designed by a parent who cares | |

The suite shares a visual identity so switching between games feels seamless.

---

## How to Play

**Mode 1 — Guess the Country 🏳️**
A flag appears on screen. Ten country names are shown at the bottom — tap the right one.
You have 3 lives ❤️❤️❤️ per round. Wrong taps cost a life; lose all three and the round fails.
The 💡 hint cuts the choices from 10 down to 5.

**Mode 2 — Guess the Flag 🗺️**
A country name appears. Ten flags are shown in a grid — tap the right one.
Same 3-life rule applies. The 💡 hint removes 5 wrong flags.

Settings let you choose:
- **Difficulty** — Easy (~30 countries), Medium (~100), Hard (all ~195)
- **Language** — Italiano / English
- **Sound** — On / Off

Each session is 10 rounds. Score up to 10 points per round: −2 per wrong tap, −3 for using the hint. Failing a round (3 wrong taps) scores 0.

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
