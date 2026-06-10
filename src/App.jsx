/*
  App.jsx — Root component and page shell.

  Owns three page-level concerns that no individual section should control:
    1. CircuitOverlay  — the animated SVG vein network reacting to mouse, click, touch, scroll
    2. Progress bar    — thin top bar that fills proportionally as the user scrolls
    3. Fade-in observer — uses IntersectionObserver to reveal .fade-in elements on scroll

  Section render order (top to bottom):
    Hero, About, Projects, Experience, Skills, Gallery, Leadership, Code, Creative, Contact, MoreAboutMe
*/
import React, { useEffect, useRef, useState } from 'react'
import Nav        from './components/Nav'
import Hero       from './components/Hero'
import About      from './components/About'
import Projects   from './components/Projects'
import Code       from './components/Code'
import Experience from './components/Experience'
import Skills     from './components/Skills'
import Gallery    from './components/Gallery'
import Leadership from './components/Leadership'
import Creative   from './components/Creative'
import Contact     from './components/Contact'
import MoreAboutMe from './components/MoreAboutMe'
import Footer      from './components/Footer'


// Pool of surge dots: each entry defines a unique color + radius so simultaneous
// surges are visually distinct rather than identical clones.
const SURGE_DEFS = [
  { color: '#ff8800', r: 4   },
  { color: '#ff8800', r: 3.5 },
  { color: '#cc77ff', r: 3.5 },
  { color: '#aa00ff', r: 3   },
  { color: '#00ffe0', r: 3   },
  { color: '#ffcc00', r: 2.5 },
]

/*
  CircuitOverlay — fixed SVG vein network behind all page content.

  All animation runs inside a single requestAnimationFrame loop so there are
  zero React re-renders after mount — keeping the rest of the UI frame-budget-safe.

  Interaction model:
    mousemove  → fires one surge dot toward the nearest vein
    click      → fires all 6 surge slots, flashes vein glow, expands two burst rings
    touchmove  → mirrors mousemove behaviour for mobile users
    scroll     → briefly spikes ambient dot speed for a reactive feel
*/
function CircuitOverlay() {
  const svgRef = useRef(null)
  const dotA   = useRef(null) // amber ambient dot
  const dotV   = useRef(null) // violet ambient dot
  const dotC   = useRef(null) // cyan ambient dot

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const paths = Array.from(svg.querySelectorAll('.vein-path'))
    if (!paths.length) return

    /** Converts screen (client) coordinates to SVG viewBox coordinates. */
    function toSVG(cx, cy) {
      const r = svg.getBoundingClientRect()
      return {
        x: (cx - r.left) / r.width  * 1440,
        y: (cy - r.top)  / r.height * 900,
      }
    }

    /**
     * nearestT — Samples a path at even intervals to find the point closest to (sx, sy).
     * 40 samples balances accuracy against the per-frame cost of getTotalLength calls.
     */
    function nearestT(path, sx, sy, samples = 40) {
      const len = path.getTotalLength()
      let bestT = 0, bestD = Infinity
      for (let i = 0; i <= samples; i++) {
        const tt = (i / samples) * len
        const pt = path.getPointAtLength(tt)
        const d  = Math.hypot(pt.x - sx, pt.y - sy)
        if (d < bestD) { bestD = d; bestT = tt }
      }
      return { t: bestT, dist: bestD, len }
    }

    /** Returns the single nearest path and its closest T value to the given SVG point. */
    function nearest(sx, sy) {
      let best = null, bestD = Infinity, bestT = 0, bestLen = 0
      paths.forEach(p => {
        const { t, dist, len } = nearestT(p, sx, sy)
        if (dist < bestD) { bestD = dist; best = p; bestT = t; bestLen = len }
      })
      return { path: best, t: bestT, len: bestLen }
    }

    /** Returns the N nearest paths sorted by distance; used to spread surges on click. */
    function nearestN(sx, sy, n = 3) {
      return paths
        .map(p => { const { t, dist, len } = nearestT(p, sx, sy); return { path: p, t, dist, len } })
        .sort((a, b) => a.dist - b.dist)
        .slice(0, n)
    }

    // Build the surge dot pool as real SVG elements so they benefit from GPU compositing
    const surgeLayer = svg.querySelector('#surge-layer')
    const surges = SURGE_DEFS.map(({ color, r }) => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      el.setAttribute('r',       r)
      el.setAttribute('fill',    color)
      el.setAttribute('opacity', '0')
      el.setAttribute('filter',  'url(#surge-glow)')
      el.setAttribute('cx',      '-200')
      el.setAttribute('cy',      '-200')
      if (surgeLayer) surgeLayer.appendChild(el)
      return { el, active: false, path: null, t: 0, len: 0, step: 0, opacity: 0 }
    })

    const burstEl  = svg.querySelector('#click-burst')
    const burstEl2 = svg.querySelector('#click-burst-2')
    const overlay  = svg.closest('#circuit-overlay')
    let burstRaf = null, burstRaf2 = null

    // veinFlash counts down from 1→0 each frame; -1 signals the idle/no-op state
    let overlayFlash = 0
    let veinFlash    = -1

    // Pre-cache vein element lists to avoid repeated querySelectorAll inside the RAF loop
    const veinAmber  = Array.from(svg.querySelectorAll('.vein-amber'))
    const veinViolet = Array.from(svg.querySelectorAll('.vein-violet'))
    const veinCyan   = Array.from(svg.querySelectorAll('.vein-cyan'))

    /** Fires a single surge dot from the point on the nearest vein closest to the cursor. */
    function fireSurge(clientX, clientY) {
      const { x: sx, y: sy } = toSVG(clientX, clientY)
      const { path, t: startT, len } = nearest(sx, sy)
      if (!path) return

      // Reuse an idle slot; steal the last one if all are busy
      const s    = surges.find(s => !s.active) || surges[surges.length - 1]
      s.active   = true
      s.path     = path
      s.t        = startT
      s.len      = len
      s.step     = len * 0.0022
      s.opacity  = 1.0
    }

    /*
      fireClick — Saturates all 6 surge slots simultaneously, peaks vein glow, and
      expands two concentric burst rings from the click point.
      The inner ring (amber) decays faster than the outer (violet) to create depth.
    */
    function fireClick(clientX, clientY) {
      const { x: sx, y: sy } = toSVG(clientX, clientY)
      const clickColors = ['#ff8800', '#ffcc00', '#cc77ff', '#aa00ff', '#00ffe0', '#ff4400']

      nearestN(sx, sy, 6).forEach(({ path, t, len }, i) => {
        const s    = surges[i]
        s.active   = true
        s.path     = path
        s.t        = t
        s.len      = len
        s.step     = len * 0.0034
        s.opacity  = 1.0
        s.el.setAttribute('fill', clickColors[i])
        s.el.setAttribute('r',    i < 2 ? '6' : i < 4 ? '5' : '4')
      })

      overlayFlash = 1.0
      veinFlash    = 1.0

      if (burstEl) {
        if (burstRaf) cancelAnimationFrame(burstRaf)
        burstEl.setAttribute('cx', sx)
        burstEl.setAttribute('cy', sy)
        burstEl.setAttribute('r',  '3')
        burstEl.setAttribute('opacity', '1')
        burstEl.setAttribute('stroke', '#ff8800')
        burstEl.setAttribute('stroke-width', '2.5')
        let br = 3, bo = 1.0
        function animBurst() {
          br += 7; bo -= 0.05
          if (bo <= 0) { burstEl.setAttribute('opacity', '0'); return }
          burstEl.setAttribute('r',       br)
          burstEl.setAttribute('opacity', bo)
          burstRaf = requestAnimationFrame(animBurst)
        }
        burstRaf = requestAnimationFrame(animBurst)
      }

      if (burstEl2) {
        if (burstRaf2) cancelAnimationFrame(burstRaf2)
        burstEl2.setAttribute('cx', sx)
        burstEl2.setAttribute('cy', sy)
        burstEl2.setAttribute('r',  '5')
        burstEl2.setAttribute('opacity', '0.7')
        let br2 = 5, bo2 = 0.7
        function animBurst2() {
          br2 += 4; bo2 -= 0.025
          if (bo2 <= 0) { burstEl2.setAttribute('opacity', '0'); return }
          burstEl2.setAttribute('r',       br2)
          burstEl2.setAttribute('opacity', bo2)
          burstRaf2 = requestAnimationFrame(animBurst2)
        }
        burstRaf2 = requestAnimationFrame(animBurst2)
      }

      // Spike ambient speed for 800 ms then ease back — makes the circuit feel reactive
      targetSpeed = 0.015
      clearTimeout(speedTimer)
      speedTimer = setTimeout(() => { targetSpeed = 0.003 }, 800)
    }

    let raf, t = 0
    let speed = 0.003, targetSpeed = 0.003
    let speedTimer = null

    /* Main animation loop — moves ambient dots, advances surges, and applies flash decay. */
    function tick() {
      // Lerp toward target speed so direction changes feel smooth, not jarring
      speed += (targetSpeed - speed) * 0.1
      t     += speed

      if (veinFlash > 0) {
        veinFlash    = Math.max(0, veinFlash    - 0.022)
        overlayFlash = Math.max(0, overlayFlash - 0.022)
        const f = veinFlash

        const amberW  = (1.2 + f * 2.8).toFixed(2)
        const violetW = (1.0 + f * 2.5).toFixed(2)
        const cyanW   = (0.8 + f * 2.2).toFixed(2)
        const aBlur   = (3   + f * 18).toFixed(1)
        const vBlur   = (3   + f * 16).toFixed(1)
        const cBlur   = (2   + f * 14).toFixed(1)

        veinAmber.forEach(p => {
          p.setAttribute('stroke-width', amberW)
          p.style.filter = `drop-shadow(0 0 ${aBlur}px #ff8800) drop-shadow(0 0 ${(f * 30).toFixed(0)}px rgba(255,136,0,0.5))`
        })
        veinViolet.forEach(p => {
          p.setAttribute('stroke-width', violetW)
          p.style.filter = `drop-shadow(0 0 ${vBlur}px #aa00ff) drop-shadow(0 0 ${(f * 24).toFixed(0)}px rgba(170,0,255,0.5))`
        })
        veinCyan.forEach(p => {
          p.setAttribute('stroke-width', cyanW)
          p.style.filter = `drop-shadow(0 0 ${cBlur}px #00ffe0) drop-shadow(0 0 ${(f * 18).toFixed(0)}px rgba(0,255,224,0.4))`
        })
        if (overlay) overlay.style.opacity = (0.08 + f * 0.47).toString()

      } else if (veinFlash === 0) {
        // Restore base styles exactly once when flash fully decays; -1 skips this branch every idle frame
        veinAmber.forEach(p  => { p.setAttribute('stroke-width', '1.2'); p.style.filter = 'drop-shadow(0 0 3px #ff8800)' })
        veinViolet.forEach(p => { p.setAttribute('stroke-width', '1.0'); p.style.filter = 'drop-shadow(0 0 3px #aa00ff)' })
        veinCyan.forEach(p   => { p.setAttribute('stroke-width', '0.8'); p.style.filter = 'drop-shadow(0 0 2px #00ffe0)' })
        if (overlay) overlay.style.opacity = '0.08'
        veinFlash = -1
      }

      /** Moves a single ambient dot along its assigned path at a given multiplier. */
      function ambientDot(ref, path, mult) {
        if (!ref.current || !path) return
        const len = path.getTotalLength()
        const pt  = path.getPointAtLength((t * mult * len) % len)
        ref.current.setAttribute('cx', pt.x)
        ref.current.setAttribute('cy', pt.y)
        ref.current.setAttribute('opacity', 0.9)
      }
      // Different path indices and multipliers keep the three dots from moving in sync
      ambientDot(dotA, paths[0], 1.0)
      ambientDot(dotV, paths[3], 0.7)
      ambientDot(dotC, paths[7], 1.2)

      // Advance each active surge and fade it out over ~60 frames
      surges.forEach((s, idx) => {
        if (!s.active) return
        s.t       += s.step
        s.opacity -= 0.016
        if (s.opacity <= 0 || s.t >= s.len) {
          s.active = false
          s.el.setAttribute('opacity', '0')
          s.el.setAttribute('r', String(SURGE_DEFS[idx]?.r ?? 3)) // restore default radius
          return
        }
        const pt = s.path.getPointAtLength(s.t)
        s.el.setAttribute('cx',      pt.x)
        s.el.setAttribute('cy',      pt.y)
        s.el.setAttribute('opacity', s.opacity)
      })

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Throttled to ~14fps so surges fire noticeably without saturating the pool at 60fps
    let lastMove = 0
    const onMouseMove = e => {
      const now = Date.now()
      if (now - lastMove < 70) return
      lastMove = now
      fireSurge(e.clientX, e.clientY)
    }

    const onClick = e => fireClick(e.clientX, e.clientY)

    // Mirror mousemove for touch so the overlay stays reactive on mobile
    const onTouch = e => {
      const touch = e.touches[0]
      if (!touch) return
      const now = Date.now()
      if (now - lastMove < 70) return
      lastMove = now
      fireSurge(touch.clientX, touch.clientY)
    }

    const onScroll = () => {
      targetSpeed = 0.01
      clearTimeout(speedTimer)
      speedTimer = setTimeout(() => { targetSpeed = 0.003 }, 450)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('click',     onClick,     { passive: true })
    window.addEventListener('touchmove', onTouch,     { passive: true })
    window.addEventListener('scroll',    onScroll,    { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      if (burstRaf)   cancelAnimationFrame(burstRaf)
      if (burstRaf2)  cancelAnimationFrame(burstRaf2)
      if (speedTimer) clearTimeout(speedTimer)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('click',     onClick)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('scroll',    onScroll)
    }
  }, [])

  return (
    <div id="circuit-overlay" aria-hidden="true">
      <svg
        ref={svgRef}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glow filter applied to ambient and surge dots */}
          <filter id="surge-glow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Tight bloom for the inner click ring */}
          <filter id="burst-glow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="10" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Wide bloom for the outer click ring */}
          <filter id="burst-glow-2" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="16" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Vein paths — amber, violet, and cyan circuit lines */}
        <path className="vein-path vein-amber"  d="M-10,180 L80,180 L80,240 L200,240 L200,300 L340,300"/>
        <path className="vein-path vein-violet" d="M200,240 L200,180 L320,180 L320,120 L460,120 L460,200 L560,200"/>
        <path className="vein-path vein-amber"  d="M0,80 L160,80 L160,40 L400,40 L400,80 L700,80"/>
        <path className="vein-path vein-violet" d="M1450,300 L1360,300 L1360,200 L1240,200 L1240,260 L1100,260"/>
        <path className="vein-path vein-cyan"   d="M1360,200 L1360,100 L1200,100 L1200,160 L1060,160"/>
        <path className="vein-path vein-amber"  d="M0,820 L120,820 L120,760 L280,760 L280,820 L500,820"/>
        <path className="vein-path vein-violet" d="M900,820 L1100,820 L1100,760 L1260,760 L1260,820 L1450,820"/>
        <path className="vein-path vein-cyan"   d="M-10,500 L100,500 L100,440 L220,440 L220,500 L380,500 L380,560 L500,560"/>
        <path className="vein-path vein-violet" d="M1450,500 L1340,500 L1340,440 L1200,440 L1200,500 L1060,500"/>
        <path className="vein-path vein-amber"  d="M700,80 C800,80 820,160 900,180 C980,200 1020,140 1100,120 L1200,120" strokeDasharray="6 4"/>
        <path className="vein-path vein-cyan"   d="M500,560 C600,560 640,480 720,460 C800,440 860,500 940,500 L1060,500" strokeDasharray="4 6"/>

        {/* Static junction nodes at key path intersections */}
        <circle cx="200"  cy="240" r="3"   fill="#ff8800" opacity="0.4"/>
        <circle cx="1360" cy="200" r="3"   fill="#aa00ff" opacity="0.4"/>
        <circle cx="120"  cy="820" r="3"   fill="#ff8800" opacity="0.4"/>
        <circle cx="1100" cy="820" r="3"   fill="#aa00ff" opacity="0.4"/>
        <circle cx="220"  cy="440" r="2.5" fill="#00ffe0" opacity="0.4"/>

        {/* Three ambient dots that cruise the veins continuously */}
        <circle ref={dotA} className="pulse-dot amber"  cx="-200" cy="-200" r="3"   filter="url(#surge-glow)"/>
        <circle ref={dotV} className="pulse-dot violet" cx="-200" cy="-200" r="2.5" filter="url(#surge-glow)"/>
        <circle ref={dotC} className="pulse-dot cyan"   cx="-200" cy="-200" r="2"   filter="url(#surge-glow)"/>

        {/* Surge dot pool — circles are appended here imperatively in useEffect */}
        <g id="surge-layer"/>

        {/* Inner click burst ring (amber) */}
        <circle id="click-burst"   cx="-200" cy="-200" r="0" fill="none" stroke="#ff8800" strokeWidth="2"   opacity="0" filter="url(#burst-glow)"/>
        {/* Outer click burst ring (violet) */}
        <circle id="click-burst-2" cx="-200" cy="-200" r="0" fill="none" stroke="#aa00ff" strokeWidth="1.2" opacity="0" filter="url(#burst-glow-2)"/>
      </svg>
    </div>
  )
}


/* Renders the amber/violet wave divider between sections. flip mirrors it horizontally. */
function WaveDivider({ flip }) {
  return (
    <div className="wave-divider" style={flip ? { transform: 'scaleX(-1)' } : {}}>
      {flip ? (
        <svg viewBox="0 0 1440 35" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,15 C200,35 400,0 600,18 C800,35 1000,5 1200,20 C1350,30 1400,10 1440,15 L1440,35 L0,35Z" fill="rgba(255,136,0,0.08)"/>
          <path d="M0,25 C300,5 600,35 900,20 C1100,10 1300,30 1440,22 L1440,35 L0,35Z"                       fill="rgba(170,0,255,0.06)"/>
        </svg>
      ) : (
        <svg viewBox="0 0 1440 40" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wg1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#ff8800" stopOpacity="0.4"/>
              <stop offset="50%"  stopColor="#aa00ff" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#00ffe0" stopOpacity="0.2"/>
            </linearGradient>
          </defs>
          <path d="M0,20 C180,0 360,40 540,20 C720,0 900,40 1080,20 C1260,0 1380,30 1440,20 L1440,40 L0,40Z" fill="url(#wg1)" opacity="0.3"/>
          <path d="M0,30 C240,10 480,40 720,25 C960,10 1200,40 1440,30 L1440,40 L0,40Z"                      fill="rgba(170,0,255,0.08)"/>
        </svg>
      )}
    </div>
  )
}


/* Appears once the user scrolls past 500px; smooth-scrolls back to top on click. */
function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed', bottom: '2rem', right: '2rem',
        width: '42px', height: '42px',
        background:   'linear-gradient(135deg,var(--amber),var(--violet))',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem', color: 'var(--bg)', fontWeight: 900, zIndex: 200,
        boxShadow: '0 0 16px rgba(255,136,0,0.35),0 0 32px rgba(170,0,255,0.2)',
        opacity:      visible ? 1 : 0,
        transform:    visible ? 'translateY(0)' : 'translateY(12px)',
        transition:   'opacity 0.3s ease,transform 0.3s ease',
        pointerEvents: visible ? 'auto' : 'none',
        clipPath:     'polygon(0 20%,20% 0,80% 0,100% 20%,100% 80%,80% 100%,20% 100%,0 80%)',
      }}
    >
      ↑
    </button>
  )
}


export default function App() {
  useEffect(() => {
    // Fills the progress bar width proportionally to scroll depth
    const pb = document.getElementById('progress')
    const onScroll = () => {
      const d = document.documentElement
      if (pb) pb.style.width = (d.scrollTop / (d.scrollHeight - d.clientHeight) * 100) + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Reveals .fade-in elements as they cross the 7% viewport threshold
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.07, rootMargin: '0px 0px -40px 0px' }
    )
    const observe = () =>
      document.querySelectorAll('.fade-in:not(.visible)').forEach(el => obs.observe(el))
    observe()
    // Second pass at 300 ms catches elements that mount asynchronously after the first sweep
    const t = setTimeout(observe, 300)

    return () => {
      window.removeEventListener('scroll', onScroll)
      obs.disconnect()
      clearTimeout(t)
    }
  }, [])

  return (
    <>
      <CircuitOverlay />
      <div id="progress" />
      <Nav />
      <main>
        <Hero />
        <WaveDivider />
        <About />
        <WaveDivider flip />
        <Projects />
        <Experience />
        <Skills />
        <Gallery />
        <Leadership />
        <Code />
        <Creative />
      </main>
      <Contact />
      <MoreAboutMe />
      <Footer />
      <BackToTop />
    </>
  )
}
