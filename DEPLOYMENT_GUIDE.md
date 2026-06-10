# Deployment Guide — Sean Kuwali Portfolio v2 (Vercel Edition)

## Architecture

| Piece | Platform | Cost | How it deploys |
|---|---|---|---|
| **Frontend** (Vite + React) | Vercel | Free | Auto on every push to `main` |
| **Contact API** (`api/contact.js`) | Vercel Serverless | Free | Same deploy — automatic |

Everything is in one repo and deploys together in a single step.
No separate server, no Cloudflare account, no wrangler CLI needed.

---

## Part 1 — Set Up Resend

1. Go to [resend.com](https://resend.com) and sign up for free.
2. Go to **API Keys → Create API Key**. Name: `portfolio-contact`, Permission: **Sending access**.
3. Copy the key (starts with `re_`). You won't see it again.
4. Optionally verify a sender domain under **Domains → Add Domain**.
   Until verified, use `onboarding@resend.dev` as `FROM_EMAIL` — Resend delivers
   to your Resend account email only in this mode, which is fine for testing.

---

## Part 2 — Deploy to Vercel

### Option A — Vercel Dashboard (easiest, no CLI needed)

**1. Create a Vercel account**

Go to [vercel.com](https://vercel.com) and sign up. Use **Continue with GitHub** for the
easiest repo connection.

**2. Import your repo**

In the Vercel dashboard click **Add New → Project → Import Git Repository**.
Select your portfolio repo.

**3. Configure the project**

Vercel auto-detects Vite. Confirm these settings:

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Leave everything else as default. Click **Deploy**.

Your site and the contact API deploy together in ~30 seconds.

**4. Set environment variables**

After the first deploy, go to **Project → Settings → Environment Variables**
and add each of the following. Set **Environment** to `Production, Preview, Development`
for all of them:

| Key | Value |
|---|---|
| `RESEND_API_KEY` | `re_BccQuSUN_GjwnAJNQjGnT9ex6x1diAAUZ` |
| `TO_EMAIL` | `kuwalisean5@gmail.com` |
| `FROM_EMAIL` | `portfolio@yourdomain.com` (or `onboarding@resend.dev` for testing) |
| `ALLOWED_ORIGIN` | `https://yoursite.vercel.app` |

> These are server-side only. Vercel injects them into `api/contact.js` at
> runtime — they are never bundled into the browser build.

**5. Redeploy**

Go to **Deployments → the latest deployment → ⋯ menu → Redeploy**.
This ensures the function picks up the new environment variables.

**6. Test**

Open your Vercel URL, fill in the contact form, and submit.
You should receive an email at `TO_EMAIL` within seconds.
Check **Project → Functions → contact → View Logs** if something doesn't arrive.

---

### Option B — GitHub Actions (automated CI/CD)

Every push to `main` deploys automatically.

**1. Link the project locally (one-time)**

```bash
npm install
npx vercel link
# Follow the prompts — signs in and links to your Vercel project
# Creates .vercel/project.json — DO NOT commit this file
```

After linking, open `.vercel/project.json` and copy `orgId` and `projectId`.

**2. Add GitHub secrets**

Go to your repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Name | Value |
|---|---|
| `VERCEL_TOKEN` | from vercel.com → Account Settings → Tokens → Create |
| `VERCEL_ORG_ID` | `orgId` from `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `projectId` from `.vercel/project.json` |

> `RESEND_API_KEY` and other email variables are set in the **Vercel dashboard** (Part 2 step 4)
> — not here. They are read at runtime by the serverless function.

**3. Push to main**

```bash
git add .
git commit -m "deploy: Vercel setup"
git push origin main
```

Watch it run under the **Actions** tab.

---

## Part 3 — Local Development

```bash
# 1. Copy env example and fill in your values
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Start Vercel's local dev server (runs frontend + API together)
npm run dev:full
# Opens on http://localhost:3000
```

`vercel dev` runs both Vite and `api/contact.js` on the same port — identical to production.
The contact form POSTs to `/api/contact` and the function responds exactly as it would live.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Contact form error on live site | Env vars not set in Vercel | Project → Settings → Environment Variables; redeploy |
| Function logs: "configuration incomplete" | RESEND_API_KEY / TO_EMAIL / FROM_EMAIL missing | Add missing var in Vercel dashboard; redeploy |
| Email not arriving | Wrong TO_EMAIL or FROM_EMAIL not verified | Check Resend dashboard → Logs |
| CORS error in browser | ALLOWED_ORIGIN doesn't match Vercel URL | Update the variable in Vercel dashboard; redeploy |
| GitHub Actions deploy fails | Missing VERCEL_TOKEN / ORG / PROJECT secrets | Add all three secrets in repo → Settings → Secrets |
| White screen locally | base is '/portfolio/' in vite.config.js | Already fixed — base is '/' in this version |
