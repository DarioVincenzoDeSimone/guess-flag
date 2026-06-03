# Brand Guidelines — Family Game Suite

Both **L'Impiccato** and **Guess Flag!** share a single visual identity.
This file is the source of truth for any future game in the suite.

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| Background | `#e0f2fe` | Game shell background (sky-100) |
| Border | `#bae6fd` | Shell border, card borders (sky-200) |
| Primary text | `#0c4a6e` | Body text, headings (sky-900) |
| Accent blue | `#0284c7` | Links, icon buttons (sky-600) |
| Accent blue light | `#0ea5e9` | Primary action buttons (sky-500) |
| Page background | `#f0f9ff` | Body background (sky-50) |
| **Title pink** | `#ec4899` | Game titles — the signature brand color |
| Orange button | `#fb923c` / shadow `#ea8c00` | Primary CTA (Play, Try Again) |
| Sky button | `#0ea5e9` / shadow `#0284c7` | Secondary CTA (Settings, Close) |
| Green button | `#22c55e` / shadow `#16a34a` | Positive actions |
| Yellow button | `#facc15` / shadow `#ca8a04` | Hint / warning actions |
| Correct | `#4ade80` | Green-400 — correct answer highlight |
| Wrong | `#f87171` | Red-400 — wrong answer highlight |
| Score chip | `#fb923c` | Orange-400 |
| Lives chip | `#f87171` | Red-400 |
| Purple chip | `#a78bfa` | Score display |

---

## Typography

- **Font stack**: `system-ui, sans-serif` — native system fonts, zero latency
- **Weights**: 900 (game titles, stats, buttons), 700 (labels, categories), 500 (body)
- **Title style**: uppercase, letter-spacing 0.05–0.1em, pink (#ec4899), drop shadow

---

## Spacing Scale (Tailwind defaults)

Consistent spacing keeps both games feeling like one family:
- Component gap: `0.5rem` (8px)
- Section gap: `1rem` (16px)
- Card padding: `1.5–2rem`
- Border radius: `0.75rem` (cards), `9999px` (pills/chips), `1.5rem` (modals)

---

## Component Library

### Buttons
```
.btn            — base: flex, weight 900, border-radius 1rem, touch-manipulation
.btn--orange    — #fb923c, shadow 0 6px 0 #ea8c00
.btn--sky       — #0ea5e9, shadow 0 6px 0 #0284c7
.btn--green     — #22c55e, shadow 0 4px 0 #16a34a
.btn--yellow    — #facc15, shadow 0 4px 0 #ca8a04
.btn--full      — width: 100%
```

### Icon Buttons (header)
```
Circle: 3rem×3rem, white bg, 2px solid #bae6fd, border-radius 9999px
Color: #0284c7, hover: scale(0.95)
```

### Modal / Card
```
background: white, border-radius: 1.5rem, padding: 2rem
border-top: 8px solid (accent color per context)
box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25)
animation: zoom-in 0.25–0.3s ease-out
```

### Stat Chips
```
display: flex, gap 0.35rem, padding 0.35rem 0.75rem
border-radius: 0.75rem, font-weight: 900, color: white
border-bottom: 3–4px solid (darker variant)
```

### Lives Row (Guess Flag)
```
3 × Material Icons "favorite" in a flex row, gap 0.25rem, centered
Active: color #f87171 (red-400)
Lost:   color #cbd5e1 (slate-300), scale 0.75
Transition: color + transform 0.25s
```

### App Frame (desktop containment)
```
:host  — display:flex, justify-content:center, height:100dvh, padding:0.5rem
.frame — width:100%, max-width:480px, max-height:900px, height:100%
Body background (#f0f9ff / sky-50) shows outside the frame on large screens.
```

### Game Shell
```
display: flex, flex-direction: column, height: 100%  (NOT 100dvh — fills .frame)
background: #e0f2fe, border: 8px solid #bae6fd, border-radius: 1.5rem
box-shadow: inset 0 2px 16px rgba(0,0,0,0.08)
overflow: clip  (contains animations; child scroll containers still scroll)
padding: 0.75rem, gap: 0.4rem
```

### Flag Image Cards (Guess Flag — Mode 1 hero flag)
```
Container: width 100%, max-width 300px, no fixed aspect-ratio (adapts to flag)
border-radius: 0.75rem, border: 3px solid #bae6fd
Image: width 100%, height auto — preserves each flag's natural proportions
filter: drop-shadow(0 1px 3px rgba(0,0,0,0.12)) — outlines flag pixels
```

### Flag Option Buttons (Guess Flag — Mode 2 grid)
```
height: 4.5rem (72px), border-radius: 0.875rem
border: 2.5px solid #bae6fd, background: #f0f9ff (sky-50, not white)
Image: width 100%, height 100%, object-fit:contain
filter: drop-shadow(0 0 2px rgba(0,0,0,0.18)) — ensures white flags stay visible
```

---

## Animations

| Token | Duration | Easing |
|---|---|---|
| Button press | 0.1s | linear |
| Modal enter | 0.25–0.3s | ease-out |
| Shake (wrong) | 0.4s | ease |
| Pop-in (result badge) | 0.35s | ease-out |
| Tile reveal | 0.2s | ease |

---

## Tone of Voice

- Friendly, encouraging, never condescending
- Short sentences — children are the primary reader
- Emoji used sparingly: one per major UI element, zero in body text
- Italian is the default language; English is equally supported

---

## Icon Library

Material Icons (loaded from Google CDN):
`settings`, `lightbulb`, `star`, `flag`, `home`, `refresh`, `favorite`
