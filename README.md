# Sean Takunda Kuwali — Portfolio

Personal portfolio built with React and Vite, deployed on GitHub Pages.

**Live site:** `https://YOUR_USERNAME.github.io/portfolio/`  
**Contact:** kuwalisean5@gmail.com  
**GitHub:** [Scaredtotherapy](https://github.com/Scaredtotherapy)

---

## Tech stack

| Layer     | Choice                          |
|-----------|---------------------------------|
| Framework | React 18                        |
| Bundler   | Vite 5                          |
| Hosting   | GitHub Pages via GitHub Actions |
| Fonts     | Bebas Neue, Syne, IBM Plex Mono |
| Styling   | Plain CSS with custom properties|

---

## Local development

```bash
# Install dependencies (run once)
npm install

# Start the dev server with hot reload
npm run dev
# Opens at http://localhost:5173/portfolio/

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## Deploy to GitHub Pages

**Step 1 — create the repo**

Create a public GitHub repository named exactly `portfolio`.

**Step 2 — push the code**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

**Step 3 — enable Pages**

Go to your repo on GitHub: **Settings > Pages > Source > GitHub Actions**.

The workflow in `.github/workflows/deploy.yml` builds and deploys automatically on every push to `main`.

**Step 4 — update for future changes**

```bash
git add .
git commit -m "Your message"
git push
```

> If your repo is named something other than `portfolio`, update `base` in `vite.config.js` to match.

---

## Project structure

```
portfolio/
├── public/
│   ├── images/            # 52 project and personal photos (img_00 ... img_51)
│   ├── favicon.svg        # Site icon
│   └── 404.html           # Redirects unknown paths to index for SPA routing
│
├── src/
│   ├── components/
│   │   ├── Nav.jsx        # Fixed nav bar with active section tracking
│   │   ├── Hero.jsx       # Landing section with profile photo and stats
│   │   ├── About.jsx      # Bio, interests, and portrait photos
│   │   ├── Projects.jsx   # Project cards with descriptions and tech tags
│   │   ├── Code.jsx       # Syntax-highlighted code samples
│   │   ├── Experience.jsx # Work history as an amber timeline
│   │   ├── Skills.jsx     # Animated skill bars triggered by scroll
│   │   ├── Gallery.jsx    # Tabbed image gallery with lightbox
│   │   ├── Leadership.jsx # Community and leadership role cards
│   │   ├── Creative.jsx   # Poem excerpt and creative writing section
│   │   ├── Contact.jsx    # Contact links and copy-email button
│   │   └── Footer.jsx     # Copyright and availability status
│   │
│   ├── App.jsx            # Root component, circuit overlay, scroll effects
│   ├── main.jsx           # React entry point, mounts App to #root
│   └── index.css          # Design system: CSS variables, layout, all styles
│
├── index.html             # HTML shell with font imports and meta tags
├── vite.config.js         # Vite config with base path for GitHub Pages
├── package.json           # Scripts and dependencies
├── .gitignore             # Excludes node_modules and dist from git
└── .github/
    └── workflows/
        └── deploy.yml     # CI/CD pipeline that deploys to GitHub Pages
```

---

## Updating content

All content lives in the component files as plain JavaScript arrays or JSX. No CMS, no database.

| What to update       | File                    | What to edit               |
|----------------------|-------------------------|----------------------------|
| Profile photo        | `Hero.jsx`              | `PROFILE_IMG` constant     |
| Hero stats           | `Hero.jsx`              | `STATS` array              |
| Bio text             | `About.jsx`             | The paragraph blocks       |
| Interests            | `About.jsx`             | `INTERESTS` array          |
| Projects             | `Projects.jsx`          | `PROJECTS` array           |
| Work experience      | `Experience.jsx`        | `TIMELINE` array           |
| Skill bars           | `Skills.jsx`            | `GROUPS` array, `w` values |
| Gallery tabs/images  | `Gallery.jsx`           | `TABS` array               |
| Leadership roles     | `Leadership.jsx`        | `CARDS` array              |
| Poem text            | `Creative.jsx`          | The blockquote block       |
| Contact links        | `Contact.jsx`           | `LINKS` array              |

**Adding a new image:**
1. Drop the file into `public/images/`
2. Reference it as `/portfolio/images/your-file.jpg`

---

## Design system

Defined as CSS custom properties in `index.css`:

```css
--amber:    #ff8800   /* primary accent, CTAs, timeline markers */
--violet:   #aa00ff   /* secondary accent, code tokens, hover states */
--lavender: #cc77ff   /* labels and subtitles */
--gold:     #ffcc00   /* gradient mid-stop */
--neon-cyan:#00ffe0   /* circuit veins, tertiary accents */
--bg:       #060309   /* root background */
```

Fonts: **Bebas Neue** for headings, **Syne** for body, **IBM Plex Mono** for labels and code.

---

## Resend Integration Guide

The contact form in `src/components/Contact.jsx` sends a `POST` to `/api/contact`. You need a small backend function to receive that payload and forward it via [Resend](https://resend.com).

### 1 — Install the Resend SDK

```bash
npm install resend
```

### 2 — Get your API key

Sign up at [resend.com](https://resend.com), verify a sending domain (or use `onboarding@resend.dev` for testing), then copy your API key from **API Keys → Create API Key**.

### 3 — Store the key safely

Never hard-code the key in client-side code. Use an environment variable:

```bash
# .env (local) — git-ignored
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
```

For production (Vercel, Netlify, Cloudflare Pages), add `RESEND_API_KEY` in your hosting dashboard's environment variables panel.

---

### 4 — Create the serverless API route

#### Option A — Vercel (recommended for Vite + React)

Create `api/contact.js` at the project root:

```js
// api/contact.js  (Vercel serverless function)
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const { data, error } = await resend.emails.send({
    from: 'Portfolio Contact <onboarding@resend.dev>',  // replace with your verified domain
    to:   ['kuwalisean5@gmail.com'],
    replyTo: email,
    subject: `[Portfolio] ${subject}`,
    html: `
      <h2>New message from your portfolio</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr />
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `,
  });

  if (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }

  return res.status(200).json({ id: data.id });
}
```

#### Option B — Netlify Functions

Create `netlify/functions/contact.js`:

```js
// netlify/functions/contact.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, email, subject, message } = JSON.parse(event.body);

  const { data, error } = await resend.emails.send({
    from:    'Portfolio Contact <onboarding@resend.dev>',
    to:      ['kuwalisean5@gmail.com'],
    replyTo: email,
    subject: `[Portfolio] ${subject}`,
    html:    `<p><strong>${name}</strong> (${email}) says:</p><p>${message}</p>`,
  });

  if (error) return { statusCode: 500, body: JSON.stringify({ error }) };
  return { statusCode: 200, body: JSON.stringify({ id: data.id }) };
};
```

Then in `netlify.toml` add a redirect so `/api/contact` maps to the function:

```toml
[[redirects]]
  from = "/api/contact"
  to   = "/.netlify/functions/contact"
  status = 200
```

#### Option C — Cloudflare Pages Functions

Create `functions/api/contact.js`:

```js
// functions/api/contact.js
import { Resend } from 'resend';

export async function onRequestPost(context) {
  const { name, email, subject, message } = await context.request.json();
  const resend = new Resend(context.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from:    'Portfolio Contact <onboarding@resend.dev>',
    to:      ['kuwalisean5@gmail.com'],
    replyTo: email,
    subject: `[Portfolio] ${subject}`,
    html:    `<p><strong>${name}</strong> (${email}):</p><p>${message}</p>`,
  });

  if (error) return new Response(JSON.stringify({ error }), { status: 500 });
  return new Response(JSON.stringify({ id: data.id }), { status: 200 });
}
```

---

### 5 — Configure vite.config.js for local development

Add a proxy so the dev server forwards `/api/contact` to your local function runner:

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',  // adjust to match your local function port
        changeOrigin: true,
      },
    },
  },
})
```

For **Vercel** local dev, run `vercel dev` instead of `vite` — it starts both Vite and the serverless functions together.

---

### 6 — Using a verified sending domain (production)

Replace `onboarding@resend.dev` with your own domain once verified in Resend:

```js
from: 'Sean Kuwali Portfolio <noreply@yourdomain.com>',
```

Resend will ask you to add DNS records (SPF, DKIM). Follow the steps in your Resend dashboard under **Domains → Add Domain**.

---

### Quick Reference — Resend SDK methods used

| Operation | Code |
|-----------|------|
| Send email | `await resend.emails.send({ from, to, subject, html })` |
| Send with reply-to | add `replyTo: senderEmail` to the send options |
| Check send result | destructure `{ data, error }` — if `error` is set, the send failed |

Full API docs: [resend.com/docs](https://resend.com/docs)
