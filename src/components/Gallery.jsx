import React, { useState, useCallback } from 'react'

const TABS = [
  {
    id: 'load-link', label: 'LOAD LINK',
    desc: 'Distributed AI Internet Café Management System: real-time multi-branch traffic monitoring, session control, and AI-driven orchestration via a FastAPI/Redis/Docker backend and React frontend.',
    tech: 'Python · FastAPI · Redis · Docker · React · Kafka',
    images: [
      { src: '/images/img_11.png', alt: 'Screenshot 2026-05-29 142139', wide: true },
      { src: '/images/img_12.png', alt: 'Screenshot 2026-05-29 142404' },
      { src: '/images/img_13.png', alt: 'Screenshot 2026-05-29 142454' },
      { src: '/images/img_14.png', alt: 'Screenshot 2026-05-29 142605' },
    ],
  },
  {
    id: 'event-horizon', label: 'EVENT HORIZON',
    desc: 'Full-stack event ecosystem with QR-code ticketing, event discovery, and real-time attendee management. Mobile-first design supporting live events across Botswana.',
    tech: 'React · Node.js · PostgreSQL · QR Integration',
    images: [
      { src: '/images/img_15.jpg', alt: 'WhatsApp Image 2026-05-29 at 12.41.22', wide: true },
      { src: '/images/img_16.jpg', alt: 'WhatsApp Image 2026-05-29 at 12.41.23 (1)' },
      { src: '/images/img_17.jpg', alt: 'WhatsApp Image 2026-05-29 at 12.41.23 (2)' },
      { src: '/images/img_18.jpg', alt: 'WhatsApp Image 2026-05-29 at 12.41.23 (3)' },
      { src: '/images/img_19.jpg', alt: 'WhatsApp Image 2026-05-29 at 12.41.23' },
      { src: '/images/img_20.jpg', alt: 'WhatsApp Image 2026-05-29 at 12.41.24 (1)' },
      { src: '/images/img_21.jpg', alt: 'WhatsApp Image 2026-05-29 at 12.41.24 (2)' },
      { src: '/images/img_22.jpg', alt: 'WhatsApp Image 2026-05-29 at 12.41.24 (3)' },
      { src: '/images/img_23.jpg', alt: 'WhatsApp Image 2026-05-29 at 12.41.24' },
      { src: '/images/img_24.jpg', alt: 'WhatsApp Image 2026-05-29 at 12.41.25 (2)' },
      { src: '/images/img_25.jpg', alt: 'WhatsApp Image 2026-05-29 at 12.41.25' },
      { src: '/images/img_26.jpg', alt: 'WhatsApp Image 2026-05-29 at 12.41.26 (1)' },
      { src: '/images/img_27.jpg', alt: 'WhatsApp Image 2026-05-29 at 12.41.26' },
      { src: '/images/img_28.jpg', alt: 'discovery page home page' },
      { src: '/images/img_29.jpg', alt: 'event creation' },
      { src: '/images/img_30.png', alt: 'functional qr code' },
    ],
  },
  {
    id: 'buy-n-sell', label: 'BUY N SELL',
    desc: 'Peer-to-peer online marketplace with product listings, seller profiles, and a Figma-designed UI built to connect buyers and sellers in local communities.',
    tech: 'React · Django REST · Figma · PostgreSQL',
    images: [
      { src: '/images/img_31.png', alt: 'Screenshot 2025-04-10 115948', wide: true },
      { src: '/images/img_32.png', alt: 'Screenshot 2026-05-29 123224' },
      { src: '/images/img_33.png', alt: 'Screenshot 2026-05-29 123525' },
      { src: '/images/img_34.png', alt: 'home page by sean in figma' },
      { src: '/images/img_35.png', alt: 'wireframe template' },
    ],
  },
  {
    id: 'car-reg', label: 'CAR REG SYS',
    desc: 'Java-based vehicle registration system with CRUD operations, persistent storage, and a desktop GUI demonstrating OOP principles, data validation, and file I/O.',
    tech: 'Java · Swing · File I/O · OOP',
    images: [
      { src: '/images/img_36.png', alt: 'Screenshot 2026-05-30 175743', wide: true },
      { src: '/images/img_37.png', alt: 'Screenshot 2026-05-30 175845' },
      { src: '/images/img_38.png', alt: 'Screenshot 2026-05-30 180908' },
      { src: '/images/img_39.png', alt: 'Screenshot 2026-05-30 181059' },
      { src: '/images/img_40.png', alt: 'last' },
    ],
  },
  {
    id: 'ai-assistant', label: 'AI ASSISTANT',
    desc: 'Context-aware personal AI assistant with tool-calling, streaming responses, and a clean chat interface powered by large language models with a custom FastAPI backend.',
    tech: 'FastAPI · Python · LLM APIs · React',
    images: [
      { src: '/images/img_41.png', alt: 'Screenshot 2026-05-29 122749', wide: true },
      { src: '/images/img_42.png', alt: 'Screenshot 2026-05-29 125111' },
      { src: '/images/img_43.png', alt: 'Screenshot 2026-05-29 125244' },
    ],
  },
  {
    id: 'data-structures', label: 'DATA STRUCTURES',
    desc: 'Comprehensive DSA lab work including BSTs, AVL trees, sorting algorithms, graph traversals, and hashing. All implemented from scratch with Big-O analysis and test cases.',
    tech: 'Java · NetBeans · Algorithms · Big-O',
    images: [
      { src: '/images/img_44.png', alt: 'data structures and algorithms lab work over 900 lines', wide: true },
    ],
  },
  {
    id: 'sean-kuwali', label: 'SEAN KUWALI',
    desc: 'Personal moments, from Legae Academy to BIUST, Lion Tutoring to Spectrum Analytics. The journey behind the developer.',
    tech: '',
    images: [
      { src: '/images/img_45.jpg', alt: 'final day legae academy', wide: true },
      { src: '/images/img_46.jpg', alt: 'first day of work lion tutoring' },
      { src: '/images/img_47.jpg', alt: 'leadership and confidence' },
      { src: '/images/img_48.jpg', alt: 'people person ever smiling' },
      { src: '/images/img_49.jpg', alt: 'the poet aspect' },
      { src: '/images/img_50.jpg', alt: 'web profile picture' },
    ],
  },
]

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('load-link')
  const [lb, setLb] = useState({ open: false, imgs: [], idx: 0 })

  const openLb = useCallback((imgs, idx) => setLb({ open: true, imgs, idx }), [])
  const closeLb = useCallback(() => setLb(l => ({ ...l, open: false })), [])
  const navLb = useCallback((dir) => {
    setLb(l => ({ ...l, idx: (l.idx + dir + l.imgs.length) % l.imgs.length }))
  }, [])

  // keyboard
  React.useEffect(() => {
    const handler = e => {
      if (!lb.open) return
      if (e.key === 'Escape') closeLb()
      if (e.key === 'ArrowLeft') navLb(-1)
      if (e.key === 'ArrowRight') navLb(1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lb.open, closeLb, navLb])

  const panel = TABS.find(t => t.id === activeTab)

  return (
    <div className="gallery-section" id="gallery">
      <div className="section-header fade-in">
        <span className="section-num">05</span>
        <h2>Project <em>Gallery</em></h2>
        <div className="section-line" />
      </div>

      {/* TABS */}
      <div className="gal-tabbar" role="tablist">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`gal-tab${activeTab === t.id ? ' gal-active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* PANEL */}
      {panel && (
        <div className="gal-panel gal-panel-active">
          <p className="gal-desc">{panel.desc}</p>
          {panel.tech && <p className="gal-tech">{panel.tech}</p>}
          <div className="gallery-grid">
            {panel.images.map((img, i) => (
              <div key={i} className={`gallery-item${img.wide ? ' wide' : ''}`}>
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  onClick={() => openLb(panel.images, i)}
                />
                <div className="gallery-caption">{img.alt}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lb.open && (
        <div
          className="gal-lightbox open"
          onClick={e => { if (e.target === e.currentTarget) closeLb() }}
        >
          <button className="gal-lb-close" onClick={closeLb}>✕</button>
          <button className="gal-lb-nav" id="gal-lb-prev" onClick={() => navLb(-1)}>‹</button>
          <img src={lb.imgs[lb.idx]?.src} alt={lb.imgs[lb.idx]?.alt} />
          <button className="gal-lb-nav" id="gal-lb-next" onClick={() => navLb(1)}>›</button>
        </div>
      )}
    </div>
  )
}
