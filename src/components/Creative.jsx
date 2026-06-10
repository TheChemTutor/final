/* Creative section showing a poem excerpt and the writing side of Sean's work. */
import React from 'react'

export default function Creative() {
  return (
    <section
      id="creative"
      style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 3rem' }}
    >
      <div className="section-header fade-in">
        <span className="section-num">07</span>
        <h2>Beyond <em>Code</em></h2>
        <div className="section-line" />
      </div>

      <div
        className="fade-in creative-grid"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}
      >
        {/* Poem excerpt and Instagram link */}
        <div>
          <p style={{
            fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--amber)',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem',
          }}>
            Creative Writing · Poem Excerpt
          </p>

          <blockquote style={{
            borderLeft: '2px solid var(--amber)',
            paddingLeft: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '-4px 0 14px rgba(255,136,0,0.1)',
          }}>
            <p style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '1rem', color: 'var(--text)',
              lineHeight: '1.9', fontStyle: 'italic', marginBottom: '1rem',
            }}>
              "People often say the opposite of love is hate. No, it's indifference.<br /><br />
              Imagine the horror of knowing your actions never covered the distance,<br />
              To reach their heart and make it feel something…<br /><br />
              Have you ever asked yourself, 'what if love and hate are both born from passion?'<br /><br />
              It's an urge, that uncontrollable emotion,<br />
              That cascade of warmth that floods your mind with the weight of an ocean."
            </p>
            <footer style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <cite>Passion</cite>, by Sean T.K.
            </footer>
          </blockquote>

          {/* Link to creative Instagram */}
          <a
            href="https://instagram.com/Scared_Of_Therapy"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'var(--text-muted)',
              textDecoration: 'none', border: '1px solid var(--border)', padding: '0.6rem 1.2rem',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = 'var(--amber)'
              e.currentTarget.style.color       = 'var(--amber)'
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color       = 'var(--text-muted)'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>📷</span>
            @Scared_Of_Therapy
          </a>
        </div>

        {/* Photo and context */}
        <div>
          <div className="creative-photo" style={{ marginBottom: '1.5rem' }}>
            <img src="/images/img_51.jpg" alt="Sean Kuwali" />
            <div className="creative-photo-label">the poet aspect</div>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1rem' }}>
            I chair the{' '}
            <span style={{ color: 'var(--text)' }}>Writing Committee at BIUST's Creatives Club</span>{' '}
            not just because I can write, but because words are how I process the world, the same
            impulse that drives me to build systems that actually mean something.
          </p>
        </div>

      </div>
    </section>
  )
}
