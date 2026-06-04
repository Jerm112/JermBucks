# Hermida Portfolio PWA

Personal investment dashboard. Deploys to Vercel as a Progressive Web App — installs on iPhone home screen like a native app.

## Deploy to Vercel (5 steps)

1. **Upload to GitHub**
   - Go to github.com → New repository → name it `hermida-portfolio`
   - Upload this entire folder

2. **Connect to Vercel**
   - Go to vercel.com → Add New Project
   - Import your `hermida-portfolio` GitHub repo
   - Framework: Vite (auto-detected)
   - Hit Deploy

3. **Install on iPhone**
   - Open the Vercel URL in Safari (must be Safari)
   - Tap the Share button (box with arrow)
   - Tap "Add to Home Screen"
   - Tap "Add"
   - Done — opens full screen like a native app

## Update your portfolio data

When you buy or sell, edit `src/App.jsx` and update the `SEED_DATA` object at the top.
Then push to GitHub — Vercel auto-redeploys in ~30 seconds.

## Local development

```bash
npm install
npm run dev
```
