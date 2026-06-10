/*
  api/contact.js — Vercel Serverless Function: contact form handler.

  Vercel automatically serves any file inside /api as a serverless endpoint.
  This file is available at POST /api/contact — matching exactly what
  Contact.jsx posts to. No routing config needed.

  Secrets are set in the Vercel dashboard:
    Project → Settings → Environment Variables
  They are injected at runtime as process.env.* — never in this file,
  never in git, never exposed to the browser.

  Required environment variables:
    RESEND_API_KEY   — from resend.com/api-keys
    TO_EMAIL         — inbox that receives portfolio messages
    FROM_EMAIL       — verified Resend sender address
    ALLOWED_ORIGIN   — your Vercel deployment URL, e.g. https://yoursite.vercel.app
*/

export default async function handler(req, res) {
  const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'

  res.setHeader('Access-Control-Allow-Origin',  ALLOWED_ORIGIN)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const { name, email, subject, message } = req.body || {}

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' })
  }

  const { RESEND_API_KEY, TO_EMAIL, FROM_EMAIL } = process.env

  if (!RESEND_API_KEY || !TO_EMAIL || !FROM_EMAIL) {
    console.error('[contact] Missing required environment variable(s).')
    return res.status(500).json({ error: 'Server email configuration is incomplete.' })
  }

  const esc = (str) =>
    String(str)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#39;')

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      from:     FROM_EMAIL,
      to:       [TO_EMAIL],
      reply_to: email,
      subject:  `[Portfolio] ${subject}`,
      html: `
        <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:24px;background:#0e0e0e;color:#e0e0e0;border:1px solid #2a2a2a">
          <h2 style="color:#ff8800;letter-spacing:0.08em;margin:0 0 20px">New Portfolio Message</h2>
          <table style="width:100%;border-collapse:collapse;font-size:0.9rem">
            <tr>
              <td style="padding:8px 12px;border:1px solid #2a2a2a;color:#aaa;width:100px">From</td>
              <td style="padding:8px 12px;border:1px solid #2a2a2a">${esc(name)}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;border:1px solid #2a2a2a;color:#aaa">Reply-To</td>
              <td style="padding:8px 12px;border:1px solid #2a2a2a">
                <a href="mailto:${esc(email)}" style="color:#cc77ff">${esc(email)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 12px;border:1px solid #2a2a2a;color:#aaa">Subject</td>
              <td style="padding:8px 12px;border:1px solid #2a2a2a">${esc(subject)}</td>
            </tr>
          </table>
          <div style="margin-top:20px;padding:16px;border:1px solid #2a2a2a;background:#141414;line-height:1.7;white-space:pre-wrap">${esc(message)}</div>
          <p style="margin-top:20px;font-size:0.75rem;color:#555">
            Sent via Sean Kuwali's portfolio contact form · ${new Date().toUTCString()}
          </p>
        </div>
      `,
    }),
  })

  if (!resendRes.ok) {
    const errText = await resendRes.text()
    console.error('[contact] Resend error:', resendRes.status, errText)
    return res.status(500).json({ error: 'Failed to send email. Please try again later.' })
  }

  console.log(`[contact] Email dispatched — from: ${email}, subject: "${subject}"`)
  return res.status(200).json({ success: true })
}
