# Deploy to GitHub Pages

## Prerequisites

- Node.js 20+
- A GitHub repository named `guess-flag` under your account
- GitHub Pages enabled on the `gh-pages` branch (Settings → Pages → Branch: `gh-pages`)
- **On Windows**: run deploy commands from **Git Bash** (not PowerShell/cmd) so that `angular-cli-ghpages` can find the `git` executable

## One-time setup

```bash
npm install
npm run download-flags   # downloads ~196 SVG flags from flagcdn.com into public/assets/flags/
```

## Deploy

```bash
# From Git Bash:
npm run deploy
```

This single command:
1. Builds: `ng build --base-href "https://DarioVincenzoDeSimone.github.io/guess-flag/"`
   - Bundles and hashes all assets
   - Sets the absolute base href so all relative asset paths resolve correctly
2. Publishes `dist/guess-flag/browser/` to the `gh-pages` branch via `angular-cli-ghpages`

Live URL: **https://DarioVincenzoDeSimone.github.io/guess-flag/**

## Important: asset paths must be relative

Flag images in the app use **relative paths** (`assets/flags/it.svg`, no leading `/`).
A leading `/` would resolve to the domain root (`github.io/assets/…`) and miss the
`/guess-flag/` base path, causing 404s on GitHub Pages.

## Routing

The app uses **HashLocationStrategy** (`#`-based URLs), so all routes work on GitHub Pages without a server:

- `https://…/guess-flag/#/` — Home
- `https://…/guess-flag/#/game` — Game
- `https://…/guess-flag/#/results` — Results

A `404.html` fallback is also included in `public/` as an extra safety net.

## Local production preview

```bash
npm run build:prod
npx http-server dist/guess-flag/browser -p 8080
# Open http://localhost:8080/guess-flag/
```

> Note: `npm run build:prod` uses `--configuration production` without a `--base-href` override,
> so links resolve from `/` — correct for local previewing with the http-server above.
