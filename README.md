# MyLawyer — Deploy with Working AI Legal Advice

This package contains everything needed to deploy MyLawyer as a live
prototype with a **working AI legal advice feature**.

## What's in here

- `index.html` — the entire app (HTML, CSS, JS, Penal Code data all in one file)
- `api/legal-advice.js` — a serverless function that securely talks to the
  Anthropic API on behalf of the app

## Why GitHub Pages alone won't work

GitHub Pages only serves static files (HTML/CSS/JS) — it cannot run the
`api/legal-advice.js` function. Without it, the "Seek Legal Assistance"
feature will show "Network error" or "service unavailable," because:

1. Browsers block direct calls to `api.anthropic.com` from a webpage (CORS)
2. Even if allowed, calling the API requires a secret key that must never
   be visible in your website's code

The `api/legal-advice.js` file solves both problems by acting as a secure
middleman — but it needs a host that can *run code*, not just serve files.

## Deploy on Vercel (free, ~5 minutes)

Vercel runs both your static site **and** the `/api` function together,
and connects directly to GitHub with automatic deploys on every push.

### Step 1 — Push to GitHub

```bash
cd mylawyer-deploy
git init
git add .
git commit -m "MyLawyer prototype with AI proxy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mylawyer-app.git
git push -u origin main
```

### Step 2 — Import into Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New" → "Project"**
3. Select your `mylawyer-app` repository
4. Leave all settings as default (Vercel auto-detects the `/api` folder)
5. Click **Deploy**

### Step 3 — Add your Anthropic API key

1. In your Vercel project, go to **Settings → Environment Variables**
2. Add a new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your Anthropic API key (starts with `sk-ant-...`)
   - Get one at [console.anthropic.com](https://console.anthropic.com)
   if you don't have one
3. Click **Save**
4. Go to the **Deployments** tab and **redeploy** (so the new variable
   takes effect)

### Step 4 — Done

Your prototype is now live at:
```
https://your-project-name.vercel.app
```

Open it, type a legal question, and the AI should respond properly.

## Important notes

- **Never commit your API key to GitHub.** It only goes into Vercel's
  Environment Variables, never into any file in this repo.
- **API costs**: each question asked uses your Anthropic API credits.
  For a prototype/demo, costs are typically very small (a few cents per
  question), but keep an eye on usage at console.anthropic.com if you're
  showing this to many people.
- Every time you push changes to GitHub, Vercel automatically redeploys.

## Emergency numbers used in the app

- Police: **117**
- Fire: **118**

These trigger the phone's native dialer via `tel:` links — they work on
mobile devices, not on desktop browsers.

## Roadmap

- Wire up real government office / NGO contact directories under Services
- Replace `console.log` incident reports with real backend storage
- Add SMS gateway integration for emergency contact alerts
