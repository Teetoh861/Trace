# TRACE: deploy instructions

TRACE is an Expo (React Native) app that builds to a static web app.

## Build
```
npm install
npm run build:web      # outputs ./dist
```

## Deploy
1. Create a GitHub repo and push this folder. `.gitignore` already excludes `node_modules` and `dist`.
2. Import the repo in Vercel. `vercel.json` already sets:
   - build command: `npx expo export --platform web`
   - output directory: `dist`
   - SPA rewrite to `/index.html`
3. Deploy and share the generated URL.

Netlify also works (`netlify.toml` is included).

## Local preview
```
npm run web
```

## Notes
- All data is mock data in `src/data.ts` (prices, findings, grades are placeholders).
- No backend or environment variables are needed.
