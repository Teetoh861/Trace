# TRACE: deploy instructions

TRACE is a portfolio-grade concept built with mock data. One repo ships three things:

| URL | What | Source |
| --- | --- | --- |
| `/` | Marketing landing page (hero "trace" animation, offset slider, sample report) | `landing/index.html` |
| `/app` | The buyer app (Expo / React Native, built to web) | `App.tsx`, `src/` |
| `/console` | Staff console demo (case queue, grading, second review) | `landing/console.html` |

## Build
```
npm install
npm run build:web      # expo export, then scripts/postbuild.js assembles ./dist
```

`scripts/postbuild.js` renames the app's `index.html` to `app.html` and copies the pages in `landing/` into `dist/`.

## Deploy
Vercel: import the repo. `vercel.json` already sets the build command, output directory and the rewrites for `/app/*` and `/console`.
Netlify also works (`netlify.toml` has the same redirects).

## Local preview
```
npm run web            # the app only, at http://localhost:8081
```
To preview the whole site, run `npm run build:web` and serve `dist/` with the rewrites above.

## Notes
- All data is mock data in `src/data.ts` (prices, findings, grades, messages, notifications).
- App state (cases, messages, sign-in) is saved in the browser's localStorage. Profile > "Reset demo data" restores the seed data.
- Attached documents are not uploaded anywhere; only the file name is kept in the browser.
- Site photos: add up to three image URLs to `SITE_PHOTOS` in `src/data.ts`.
- No backend or environment variables are needed.
