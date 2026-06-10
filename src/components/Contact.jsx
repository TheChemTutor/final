/*
  Contact.jsx — Two-panel contact section.

  Both panels share identical card geometry (border, surface, padding, accent bar)
  so the layout reads as a coherent pair rather than a loose left column next to
  a boxed right column.  The section headline lives above the grid as a shared header.

  Left panel  : contact info rows, quick-action buttons, and .vcf business card download.
  Right panel : direct message form POSTing to the Resend-backed API server.

  Contact form — posts to /api/contact, handled by api/contact.js on Vercel.
*/
import React, { useState } from 'react'

const EMAIL    = 'kuwalisean5@gmail.com'
const PHONE    = '+267 777 983 92'
const LOCATION = 'Gaborone / Palapye, Botswana'

// The API is same-origin on Vercel — /api/contact is served by api/contact.js
// automatically. No environment variable needed; works in local dev
// (via `vercel dev`) and production without any configuration.
const API_BASE = ''

const LINKS = [
  { icon: '✉',  href: `mailto:${EMAIL}`,                               label: EMAIL,                                  external: false },
  { icon: 'in', href: 'https://linkedin.com/in/sean-kuwali-07b5932aa', label: 'linkedin.com/in/sean-kuwali-07b5932aa', external: true  },
  { icon: '📷', href: 'https://instagram.com/Scared_Of_Therapy',       label: '@Scared_Of_Therapy',                   external: true  },
  { icon: '📍', label: LOCATION, noLink: true },
  { icon: '📞', label: PHONE,    noLink: true },
]

/**
 * downloadVCF — Builds a RFC 6350 vCard string and triggers a browser download.
 *
 * Generated client-side to avoid a server round-trip.
 * CRLF line endings (\r\n) are required by the spec — some iOS parsers reject LF-only.
 */
function downloadVCF() {
  const vcf = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Sean Kuwali',
    'N:Kuwali;Sean;;;',
    'TITLE:Computer Science & Software Engineering Student',
    'ORG:Spectrum Analytics (Intern)',
    `EMAIL;TYPE=INTERNET:${EMAIL}`,
    `TEL;TYPE=CELL:${PHONE}`,
    'ADR;TYPE=HOME:;;Gaborone;Gaborone;BW',
    'URL:https://linkedin.com/in/sean-kuwali-07b5932aa',
    'X-SOCIALPROFILE;TYPE=instagram:https://instagram.com/Scared_Of_Therapy',
    'NOTE:CS & Software Eng. Student. Open to opportunities in software development and backend systems.',
    'END:VCARD',
  ].join('\r\n')

  const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = 'sean-kuwali.vcf'
  a.click()
  // Revoke immediately so the blob URL doesn't linger in memory
  URL.revokeObjectURL(url)
}

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const [form,   setForm]   = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true)
      // Reset the label after 2 s so the user knows the action is repeatable
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  /**
   * handleSubmit — POSTs form data to the Resend-backed API server.
   *
   * Guards against double-submit during slow connections.
   * On failure, shows a fallback mailto so the user always has a way to reach Sean.
   *
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async e => {
    e.preventDefault()
    if (status === 'sending') return // prevent double-submit on slow connections

    setStatus('sending')
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      if (!res.ok) throw new Error(`Server responded with ${res.status}`)
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      console.error('[Contact] Message dispatch failed:', err)
      setStatus('error')
    }
  }

  // Allows the user to retry without a full page reload
  const handleRetry = () => setStatus('idle')

  return (
    <div id="contact">

      {/* ── Section header — shared above both panels ── */}
      <div className="contact-header fade-in">
        <div className="contact-header-meta">
          <span className="section-num">06</span>
          <span className="contact-header-rule" />
          <span className="contact-header-tag">CONTACT</span>
        </div>
        <h2 className="contact-headline">
          Let's Build <em>Something Great</em>
        </h2>
        <p className="contact-subline">
          Currently interning at Spectrum Analytics and open to new opportunities,
          collaborations, and interesting projects.
        </p>
      </div>

      {/* ── Two matched panel cards ── */}
      <div className="contact-inner">

        {/* ── LEFT PANEL — Info ── */}
        <div className="contact-panel contact-info-panel fade-in">

          {/* Panel header — mirrors right panel structure */}
          <div className="cp-header">
            <span className="cp-tag">INFO</span>
            <h3 className="cp-title">Get In <em>Touch</em></h3>
          </div>

          {/* Contact info rows */}
          <div className="contact-links">
            {LINKS.map((link, i) =>
              link.noLink ? (
                <div key={i} className="contact-link static">
                  <span className="cl-icon">{link.icon}</span>
                  <span className="cl-text">{link.label}</span>
                </div>
              ) : (
                <a key={i} href={link.href} className="contact-link"
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                >
                  <span className="cl-icon">{link.icon}</span>
                  <span className="cl-text">{link.label}</span>
                  <span className="cl-arrow">→</span>
                </a>
              )
            )}
          </div>

          {/* Quick-action buttons — styled to match form's submit button weight */}
          <div className="contact-actions">
            <a href={`mailto:${EMAIL}`} className="cp-action-btn cp-action-primary">
              <span>✉</span> Send Email
            </a>
            <button onClick={copyEmail} className="cp-action-btn cp-action-secondary">
              <span>{copied ? '✓' : '⎘'}</span> {copied ? 'Copied!' : 'Copy Email'}
            </button>
          </div>

          {/* Digital Business Card — visual weight anchors the bottom of the left panel,
              balancing the submit button at the bottom of the right panel */}
          <div className="contact-vcard">
            <div className="vcard-eyebrow">DIGITAL BUSINESS CARD</div>
            <div className="vcard-identity">
              <div className="vcard-avatar">SK</div>
              <div className="vcard-meta">
                <div className="vcard-name">Sean Kuwali</div>
                <div className="vcard-role">CS &amp; Software Eng. Student</div>
                <div className="vcard-org">Spectrum Analytics · Intern</div>
              </div>
            </div>
            <button onClick={downloadVCF} className="cp-action-btn cp-action-vcf">
              <span>⬇</span> Download .vcf Contact
            </button>
          </div>

        </div>

        {/* ── RIGHT PANEL — Message Form ── */}
        <div className="contact-panel contact-form-panel fade-in" style={{ transitionDelay: '0.12s' }}>

          {/* Panel header — mirrors left panel structure */}
          <div className="cp-header">
            <span className="cp-tag">MSG</span>
            <h3 className="cp-title">Direct <em>Message</em></h3>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="cf-row">
              <div className="cf-field">
                <label className="cf-label">YOUR NAME</label>
                <div className="cf-input-wrap">
                  <span className="cf-icon">👤</span>
                  <input className="cf-input" type="text" name="name"
                    placeholder="e.g. John Doe"
                    value={form.name} onChange={handleChange}
                    required autoComplete="name"
                  />
                </div>
              </div>
              <div className="cf-field">
                <label className="cf-label">EMAIL ADDRESS</label>
                <div className="cf-input-wrap">
                  <span className="cf-icon">✉</span>
                  <input className="cf-input" type="email" name="email"
                    placeholder="e.g. john@example.com"
                    value={form.email} onChange={handleChange}
                    required autoComplete="email"
                  />
                </div>
              </div>
            </div>

            <div className="cf-field">
              <label className="cf-label">SUBJECT</label>
              <div className="cf-input-wrap">
                <span className="cf-icon">📄</span>
                <input className="cf-input" type="text" name="subject"
                  placeholder="e.g. Recruiting Inquiry / Collaboration Idea"
                  value={form.subject} onChange={handleChange} required
                />
              </div>
            </div>

            <div className="cf-field">
              <label className="cf-label">MESSAGE</label>
              <textarea className="cf-textarea" name="message"
                placeholder="Draft your message here…"
                value={form.message} onChange={handleChange}
                rows={6} required
              />
            </div>

            <button type="submit" className="cf-submit"
              disabled={status === 'sending' || status === 'success'}
            >
              {status === 'sending' ? (
                <><span className="cf-spinner" /> Dispatching…</>
              ) : status === 'success' ? (
                <>✓ Message Sent!</>
              ) : (
                <><span className="cf-arrow-icon">➤</span> Dispatch Message</>
              )}
            </button>

            {status === 'error' && (
              <div className="cf-error">
                <p>Something went wrong. Email directly at{' '}
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </p>
                {/* Let the user retry without a page reload */}
                <button type="button" className="cf-retry-btn" onClick={handleRetry}>
                  ↩ Try Again
                </button>
              </div>
            )}
          </form>
        </div>

      </div>
    </div>
  )
}
