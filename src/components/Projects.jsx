import React from 'react'

const PROJECTS = [
  {
    glow: 'amber', featured: true,
    img: '/images/img_04.jpg', imgClass: 'project-img tall',
    type: 'Distributed Systems · Backend', year: '2025 – 2026',
    title: 'Distributed AI Traffic Management Orchestrator',
    desc: 'Multi-branch internet café backend with AI-driven auto-scaling. Built with FastAPI, Redis, and Docker Compose into a 12-file modular production architecture. Includes JWT authentication, a REST API layer, and a real-time React monitoring dashboard. Integrated Orchestrator backend with Loadlink frontend codebase.',
    tags: [
      { label: 'FastAPI', cls: 'accent' }, { label: 'Python', cls: 'accent' },
      { label: 'React', cls: 'blue' },    { label: 'Redis', cls: 'blue' },
      { label: 'Docker' }, { label: 'JWT' }, { label: 'REST API' },
    ],
  },
  {
    glow: 'violet',
    img: '/images/img_05.jpg', imgClass: 'project-img',
    type: 'Full-Stack · Team Project', year: '2025 – 2026',
    title: 'Unified Event & Workshop Ecosystem',
    desc: 'Full-stack event management platform (COMP-302). Responsible for backend: RESTful API, JWT middleware, Firebase Firestore integration, graceful shutdown, EJS views, and error handling. Frontend by team members.',
    tags: [
      { label: 'Node.js', cls: 'accent' }, { label: 'Express', cls: 'accent' },
      { label: 'Firebase', cls: 'blue' },  { label: 'JWT', cls: 'blue' },
      { label: 'EJS' },
    ],
  },
  {
    glow: 'violet',
    img: '/images/img_06.jpg', imgClass: 'project-img',
    type: 'Mobile · E-Commerce', year: '2025',
    title: 'Buy N Sell Marketplace',
    desc: 'Peer-to-peer marketplace with product listings, seller profiles, and a Figma-designed UI. Mobile-first, real-time DB updates, auth, and an image-upload pipeline for product photos.',
    tags: [
      { label: 'React', cls: 'accent' }, { label: 'Django REST', cls: 'blue' },
      { label: 'PostgreSQL' }, { label: 'Figma' },
    ],
  },
  {
    glow: 'amber',
    img: '/images/img_07.jpg', imgClass: 'project-img',
    type: 'AI · Personal Tool', year: '2025 – 2026',
    title: 'Personal AI Assistant',
    desc: 'Context-aware AI assistant with tool-calling, streaming responses, and a clean chat interface powered by LLMs with a custom FastAPI backend. Handles multi-turn conversation with persistent context.',
    tags: [
      { label: 'FastAPI', cls: 'accent' }, { label: 'Python', cls: 'accent' },
      { label: 'LLM APIs', cls: 'blue' }, { label: 'React', cls: 'blue' },
      { label: 'Streaming' },
    ],
  },
  {
    glow: 'violet',
    img: '/images/img_08.jpg', imgClass: 'project-img',
    type: 'Java · Desktop · OOP', year: '2025 – 2026',
    title: 'Car Registration System',
    desc: 'Java Swing desktop application for vehicle registration with full CRUD, persistent file-based storage, and modular OOP architecture. Built for COMP 202; every data structure implemented from scratch.',
    tags: [
      { label: 'Java', cls: 'accent' }, { label: 'Swing', cls: 'blue' },
      { label: 'File I/O' }, { label: 'OOP' }, { label: 'DSA' },
    ],
  },
  {
    glow: 'amber',
    img: '/images/img_09.jpg', imgClass: 'project-img',
    type: 'Java · Algorithms', year: '2024 – 2025',
    title: 'DSA Lab Suite',
    desc: 'Comprehensive collection of data structures and algorithm implementations including BSTs, AVL trees, sorting (Quick, Merge, Heap), graph traversals (Dijkstra, Prim\'s, BFS/DFS), and hashing. All documented with Big-O analysis.',
    tags: [
      { label: 'Java', cls: 'accent' }, { label: 'NetBeans', cls: 'blue' },
      { label: 'Algorithms' }, { label: 'Big-O' },
    ],
  },
]

export default function Projects() {
  return (
    <section id="projects">
      <div className="section-header fade-in">
        <span className="section-num">01</span>
        <h2>Selected <em>Projects</em></h2>
        <div className="section-line" />
      </div>

      <div className="projects-grid">
        {PROJECTS.map((p, i) => (
          <div key={i} className={`project-card fade-in${p.featured ? ' featured' : ''}`} data-glow={p.glow}>
            <img className={p.imgClass} src={p.img} alt={p.title} />
            <div className="project-meta">
              <span className="project-type">{p.type}</span>
              <span className="project-year">{p.year}</span>
            </div>
            <h3>{p.title}</h3>
            <p className="project-desc">{p.desc}</p>
            <div className="project-tags">
              {p.tags.map(t => (
                <span key={t.label} className={`tag${t.cls ? ' ' + t.cls : ''}`}>{t.label}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
