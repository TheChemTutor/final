/* Navigation bar with active section tracking and mobile hamburger menu. */
import React, { useState, useEffect } from 'react'

const LINKS = [
  { href: '#about',      label: 'About'      },
  { href: '#projects',   label: 'Projects'   },
  { href: '#experience', label: 'Experience' },
  { href: '#skills',     label: 'Skills'     },
  { href: '#gallery',    label: 'Gallery'    },
  { href: '#code',       label: 'Code'       },
  { href: '#creative',   label: 'Creative'   },
  { href: '#contact',    label: 'Contact'    },
  { href: '#more-about', label: 'More'       },
]

export default function Nav() {
  const [open, setOpen]         = useState(false)
  const [active, setActive]     = useState('')
  const [scrolled, setScrolled] = useState(false)

  /* Highlights the nav link for whichever section is currently visible. */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)

      const sections = LINKS.map(l => l.href.replace('#', ''))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.getBoundingClientRect().top <= 100) {
          setActive('#' + sections[i])
          return
        }
      }
      setActive('')
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Closes the mobile menu when the viewport widens to desktop size. */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* Smooth-scrolls to the target section and closes the mobile menu. */
  const scrollTo = (e, href) => {
    e.preventDefault()
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      style={{
        boxShadow: scrolled
          ? '0 2px 30px rgba(170,0,255,0.18)'
          : '0 1px 0 rgba(255,136,0,0.15)',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <div className="nav-logo">sk.portfolio</div>

      {/* Hamburger toggle for mobile viewports */}
      <button
        className="nav-toggle"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span style={{ transform: open ? 'rotate(45deg) translate(5px,6px)' : 'none',  transition: 'transform 0.2s' }} />
        <span style={{ opacity: open ? 0 : 1,                                           transition: 'opacity 0.15s' }} />
        <span style={{ transform: open ? 'rotate(-45deg) translate(5px,-6px)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      <ul className={`nav-links${open ? ' open' : ''}`}>
        {LINKS.map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              onClick={e => scrollTo(e, href)}
              style={{
                color:      active === href ? 'var(--amber)' : undefined,
                textShadow: active === href ? '0 0 8px rgba(255,136,0,0.5)' : undefined,
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <a href="mailto:kuwalisean5@gmail.com" className="nav-cta">
        Hire Me
      </a>
    </nav>
  )
}
