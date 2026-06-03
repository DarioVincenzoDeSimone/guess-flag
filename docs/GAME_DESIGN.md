# Game Design Document

## Overview

**Guess Flag!** is a geography card game for children aged 5–10.
A session is 10 rounds. Each round presents a flag puzzle in one of two modes.
The session ends on a results screen with score, accuracy, and a recap.

---

## Game Modes

### Mode 1 — Guess the Country (🏳️ → Country name)

1. A flag SVG is displayed prominently at the top.
2. Ten country-name buttons appear at the bottom of the screen.
3. The player taps a button:
   - **Correct**: button turns green, ✅ badge on the flag, success sound.
   - **Wrong**: button turns red, ❌ shake animation, one life lost.
4. After **3 wrong taps** the round fails automatically (0 points); the correct answer is highlighted in green.
5. **Hint**: reduces the 10 options to 5 by removing 5 wrong choices.

### Mode 2 — Guess the Flag (Country name → 🏳️)

1. The country name is displayed prominently at the top.
2. Ten flag SVGs are shown in a 2-column grid at the bottom.
3. The player taps a flag:
   - **Correct**: flag card turns green, ✅ badge, success sound.
   - **Wrong**: flag card turns red, ❌ shake animation, one life lost.
4. After **3 wrong taps** the round fails automatically (0 points); the correct flag is highlighted.
5. **Hint**: removes 5 wrong flags (randomly chosen, excluding already-clicked ones).

---

## Difficulty System

| Difficulty | Pool size | Criteria |
|---|---|---|
| Easy | ~30 | Major recognisable nations (Europe, Americas, Asia/Pacific, Africa leaders) |
| Medium | ~100 | Easy + rest of Europe, SE Asia, Middle East, larger African/Latin American nations |
| Hard | ~195 | All countries including small island states and territories |

The pool is shuffled at session start; the first 10 entries become the rounds.

---

## Lives System

Each round starts with **3 lives** displayed as ❤️❤️❤️ hearts below the stats bar.
Every wrong tap removes one heart. Reaching 0 lives ends the round as a failure.
Lives reset to 3 at the start of each new round.

---

## Hint System

- Each round has **one hint** (💡 button in the header).
- Using it is irreversible for that round; the icon becomes greyed.
- The hint resets at the start of each new round.
- Hint usage is recorded in `RoundResult.hintUsed` for scoring.

---

## Scoring

| Event | Points |
|---|---|
| Correct answer | +10 base |
| Each wrong tap (either mode) | −2 |
| Using hint | −3 |
| Round failure (3 wrong taps) | 0 (regardless of other deductions) |
| Minimum round score on success | 0 |

Maximum session score: 10 rounds × 10 points = **100 points**.

---

## Settings & Mid-Game Reset

Settings (difficulty, mode, language, sound) are persisted to `localStorage`.
If the player changes **difficulty** or **game mode** via the settings modal while
a game is in progress, the current round is regenerated from the new pool when
the modal closes. Completed rounds and their scores are preserved.

---

## Session Flow

```
Home → [startGame()] → startSession() → /game
  Round 1 … Round 10
    → Player taps correct option → finishRound(true)
    → OR 3 wrong taps → finishRound(false)
    → setTimeout 2s (show result animation)
    → roundIndex++
    → isSessionComplete() → navigate /results
Results → [Play Again] → startSession() → /game
        → [Home]       → /
```

---

## Future Ideas

- **Timed mode**: 30 seconds per round, bonus for speed
- **Continent filter**: play only European, Asian, African flags
- **Flag quiz history**: track which flags you've seen and how well you did
- **Multiplayer**: two players on the same device, alternating rounds
- **Progressive difficulty**: start easy, unlock harder flags as you improve
- **Streak bonus**: extra points for consecutive correct answers without hints
