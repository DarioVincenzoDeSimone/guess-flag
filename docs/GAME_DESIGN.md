# Game Design Document

## Overview

**Guess Flag!** is a geography card game for children aged 5–10.
A session is 10 rounds. Each round presents a flag puzzle in one of two modes.
The session ends on a results screen with score, accuracy, and a recap.

---

## Game Modes

### Mode 1 — Guess the Country (🏳️ → Country name)

1. A flag SVG is displayed prominently in the center.
2. Below the flag, letter slots appear — one per character of the country name (spaces auto-revealed).
3. The player taps letters on the on-screen keyboard.
   - **Correct letter**: revealed in all matching slots; correct sound plays.
   - **Wrong letter**: keyboard key turns red; shake animation; wrong-count increments.
4. The round ends when all letters are revealed.
5. **Hint**: the keyboard area slides out; a grid of 6 country-name buttons slides in (one is correct). Wrong choices are removed on tap.

Country names are normalized before comparison: upper-case, NFD-decomposed, diacritics stripped, non-letters become spaces.

### Mode 2 — Guess the Flag (Country name → 🏳️)

1. The country name is shown in large text.
2. A 5×2 (or responsive) grid of 10 flag SVGs is displayed.
3. The player taps a flag:
   - **Correct**: border turns green, ✅ badge appears, success sound plays.
   - **Wrong**: border turns red, ❌ badge appears, shake animation, wrong-count increments. The flag stays but is dimmed and disabled.
4. The round ends when the correct flag is tapped.
5. **Hint**: 5 wrong flags fade out (randomly chosen, avoiding already-clicked ones).

---

## Difficulty System

| Difficulty | Pool size | Criteria |
|---|---|---|
| Easy | ~30 | Major recognisable nations (Europe, Americas, Asia/Pacific, Africa leaders) |
| Medium | ~100 | Easy + rest of Europe, SE Asia, Middle East, larger African/Latin American nations |
| Hard | ~195 | All countries including small island states and territories |

The pool for a given difficulty is shuffled and the first 10 entries become the session's rounds. This means each session is unique.

---

## Hint System

- Each round has **one hint** available (💡 icon in the header).
- Using the hint is irreversible for that round.
- After use: icon becomes greyed/disabled for the rest of the round.
- Hint usage is recorded per round in `RoundResult.hintUsed`.

---

## Scoring

| Event | Points |
|---|---|
| Correct answer | +10 base |
| Each wrong letter guess (Mode 1) | −1 |
| Each wrong flag click (Mode 2) | −2 |
| Using hint | −3 |
| Minimum round score | 0 |

Maximum session score: 10 rounds × 10 points = **100 points**.

---

## Session Flow

```
Home → [startSession()] → /game
  Round 1 … Round 10
    → finishRound() after correct answer
    → setTimeout 2s (show animation)
    → roundIndex++
  After round 10: isSessionComplete() → navigate /results
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
