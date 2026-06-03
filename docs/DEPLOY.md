# Deploy to GitHub Pages

## Prerequisites

- Node.js 20+
- A GitHub repository named `guess-flag` under your account
- GitHub Pages enabled on the `gh-pages` branch (Settings → Pages → Branch: `gh-pages`)

## One-time setup

```bash
npm install
npm run download-flags   # downloads ~195 SVG flags from flagcdn.com
```

## Deploy

```bash
npm run deploy
```

This single command:
1. Builds with `ng build --configuration production`
   - Sets `baseHref=/guess-flag/` (defined in `angular.json`)
   - Bundles and hashes all assets
2. Publishes `dist/guess-flag/browser/` to the `gh-pages` branch via `angular-cli-ghpages`

The live URL will be: `https://<your-github-username>.github.io/guess-flag/`

## Routing

The app uses **HashLocationStrategy** (`#`-based URLs), so all routes work on GitHub Pages without a server:

- `https://…/guess-flag/#/` — Home
- `https://…/guess-flag/#/game` — Game
- `https://…/guess-flag/#/results` — Results

A `404.html` fallback is also included in `public/` as an extra safety net for browsers that don't follow the hash.

## Local production preview

```bash
npm run build:prod
npx http-server dist/guess-flag/browser -p 8080
# Open http://localhost:8080/guess-flag/
```
