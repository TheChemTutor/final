/* Full-viewport landing section with profile photo, stats, and stack tags. */
import React from 'react'

const PROFILE_IMG = '/images/img_00.jpg'

const STATS = [
  { num: '7+',  label: 'Years Coding'       },
  { num: '6+',  label: 'Projects Built'     },
  { num: '10+', label: 'Students Mentored'  },
  { num: '7+',  label: 'Languages Used'     },
]

const STACK = ['Python','JavaScript','FastAPI','React','Node.js','Firebase','Docker','Redis','Java','C++']

/* Scrolls smoothly to a given section ID. */
const goTo = id => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

export default function Hero() {
  return (
    <div id="hero">
      <div className="hero-grid-bg" />

      {/* Decorative curved lines behind the content */}
      <div className="hero-curves">
        <svg viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="hg1" x1="0" y1="0" x2="800" y2="600" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#ff8800" />
              <stop offset="100%" stopColor="#aa00ff" />
            </linearGradient>
            <linearGradient id="hg2" x1="0" y1="0" x2="900" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#aa00ff" />
              <stop offset="100%" stopColor="#00ffe0" />
            </linearGradient>
          </defs>
          <path d="M800,600 C650,500 500,450 350,380 C200,310 100,200 -50,100"
            stroke="url(#hg1)" strokeWidth="1.5" fill="none" strokeDasharray="8 4" opacity="0.5" />
          <path d="M900,400 C750,380 600,320 450,260 C300,200 150,180 0,200"
            stroke="url(#hg2)" strokeWidth="1"   fill="none" strokeDasharray="5 8" opacity="0.35" />
        </svg>
      </div>

      <div className="hero-glow"  />
      <div className="hero-glow2" />

      <div className="hero-inner">

        {/* Left column: name, description, CTA buttons */}
        <div className="hero-left fade-in">
          <div className="hero-tag">
            Based in Gaborone, Botswana · Open to opportunities
          </div>

          <h1>
            <span className="name-highlight">Sean</span>
            Kuwali
          </h1>

          <p className="hero-desc">
            Computer Science &amp; Software Engineering student at BIUST.
            Backend systems, distributed architectures, Firebase, REST APIs.
            Currently interning at{' '}
            <strong style={{ color: 'var(--text)' }}>Spectrum Analytics</strong>.
          </p>

          <div className="hero-actions">
            <a href="#projects" className="btn-primary"
               onClick={e => { e.preventDefault(); goTo('#projects') }}>
              View My Work
            </a>
            <a href="#contact" className="btn-secondary"
               onClick={e => { e.preventDefault(); goTo('#contact') }}>
              Get In Touch
            </a>
          </div>
        </div>

        {/* Right column: profile photo, stats grid, tech stack */}
        <div className="hero-right fade-in" style={{ transitionDelay: '0.2s' }}>

          <div className="hero-identity">
            <div className="profile-frame">
              {/* Corner spark accents on the profile frame */}
              <span className="spark" />
              <span className="spark" />
              <span className="spark" />
              <span className="spark" />
              <img src={PROFILE_IMG} alt="Sean T. Kuwali" />
            </div>
            <div className="hero-name-label">I am Sean T. Kuwali</div>
            <div className="hero-role-label">CS &amp; SWE · BIUST · Spectrum Analytics</div>
          </div>

          <div className="stat-grid">
            {STATS.map(s => (
              <div className="stat-item" key={s.label}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="hero-stack">
            <div className="stack-label">Current Stack</div>
            <div className="stack-tags">
              {STACK.map((tech, i) => (
                <span
                  key={tech}
                  className={`tag${i < 2 ? ' accent' : i < 5 ? ' blue' : ''}`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
