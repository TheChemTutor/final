/*
  MoreAboutMe.jsx — Personal depth section drawing from the PDP.

  Covers three things About.jsx does not: where the work is heading (goals),
  how I approach it (principles), and the bigger picture behind the technical career.
  Content is paraphrased from the Personal Development Plan submitted for WIL.
*/
import React from 'react'

const GOALS = [
  {
    icon: '☁',
    area: 'Cloud Infrastructure',
    color: 'amber',
    text: 'I want to make infrastructure design decisions, not just deployment ones. The gap between knowing how to run a container and knowing why an architecture is built the way it is. That is what I am closing.',
  },
  {
    icon: '⚙',
    area: 'Machine Learning',
    color: 'violet',
    text: 'I can call a model. What I am working toward is training and evaluating one. Understanding the data pipeline, the loss function, and the failure mode, not just the output.',
  },
  {
    icon: '📊',
    area: 'Data Storytelling',
    color: 'cyan',
    text: 'Good data work produces something a non-technical person can act on. I am learning to build dashboards and reports that answer real business questions, not just demonstrate technical ability.',
  },
  {
    icon: '🎯',
    area: 'Product Strategy',
    color: 'amber',
    text: 'I want to contribute to product decisions, not just implement them. That means understanding the business context behind a technical choice and being able to argue for or against it.',
  },
  {
    icon: '⚖',
    area: 'AI Ethics and Policy',
    color: 'violet',
    text: 'Technology governance in Africa is being written right now. I want to contribute something written to that conversation. The formal methods background gives me a way in.',
  },
  {
    icon: '✍',
    area: 'Technical Writing',
    color: 'cyan',
    text: 'Writing is already part of how I work. The goal is to take it seriously as a craft: four published pieces for a real external audience, not just documentation for a codebase.',
  },
  {
    icon: '🎮',
    area: 'Game Development',
    color: 'amber',
    text: 'I have wanted to finish a game for years. Not a prototype. A finished, playable thing that someone other than me can sit down and complete. Godot is the current plan.',
  },
  {
    icon: '📖',
    area: 'Creative Writing',
    color: 'violet',
    text: 'I write poetry under the handle @Scared_Of_Therapy. The goal is a collection or archive that is publicly accessible. The writing exists. It needs a home.',
  },
  {
    icon: '🌍',
    area: 'Regional Product',
    color: 'cyan',
    text: 'A product built specifically for Botswana or the SADC region, solving a problem I understand because I live it. Real users. Real usefulness. Not a hackathon pitch.',
  },
  {
    icon: '🤝',
    area: 'Mentorship at Scale',
    color: 'amber',
    text: 'I mentor first-year students one on one. That works but it does not scale. The next step is a structured programme or resource that reaches more people without losing the quality.',
  },
]

const PRINCIPLES = [
  {
    label: 'Document everything',
    detail: 'Every project gets a clean README and a short reflection. It builds a record that compounds.',
  },
  {
    label: 'Finish before expanding',
    detail: 'Scope small and ship. A finished thing teaches what the work actually needed. A long plan does not.',
  },
  {
    label: 'Write while learning',
    detail: 'Publishing a short article on something I just built forces a clarity that private notes never do.',
  },
  {
    label: 'Stay in the community work',
    detail: 'Mentorship, the writing committee, and SRC work are where leadership is practised with real people. They do not go on hold.',
  },
  {
    label: 'Seek the intersections',
    detail: 'The most satisfying work I have done has always sat between two fields at once.',
  },
]

export default function MoreAboutMe() {
  return (
    <section id="more-about">

      <div className="section-header fade-in">
        <span className="section-num">07</span>
        <h2>More About <em>Me</em></h2>
        <div className="section-line" />
      </div>

      {/* Personal statement */}
      <div className="mam-statement fade-in">
        <div className="mam-statement-bar" />
        <div className="mam-statement-body">
          <p className="mam-lead">
            Seven years of coding. A-Levels in Pure Mathematics, Statistics, Mechanics, and Computer
            Science. But also poetry, teaching, and leading. I am not trying to leave technology. I
            am trying to inhabit more of it.
          </p>
          <p className="mam-body-text">
            The most satisfying work I have done has always sat at an intersection: systems
            engineering that required communication, data work that required design, code that
            required storytelling. I am equally analytical and artistic, and I want both sides to
            keep growing. This section is about where I am heading and how I intend to get there.
          </p>
        </div>
      </div>

      {/* Goals grid */}
      <div className="mam-goals-header fade-in">
        <span className="mam-label">DIRECTIONS</span>
        <h3 className="mam-subtitle">Where the Work Is Heading</h3>
      </div>

      <div className="mam-goals-grid">
        {GOALS.map((g, i) => (
          <div
            key={g.area}
            className={`mam-goal-card mam-goal-${g.color} fade-in`}
            style={{ transitionDelay: `${(i % 5) * 0.07}s` }}
          >
            <div className="mam-goal-top">
              <span className="mam-goal-icon">{g.icon}</span>
              <span className="mam-goal-area">{g.area}</span>
            </div>
            <p className="mam-goal-text">{g.text}</p>
          </div>
        ))}
      </div>

      {/* Principles */}
      <div className="mam-principles fade-in">
        <div className="mam-principles-header">
          <span className="mam-label">APPROACH</span>
          <h3 className="mam-subtitle">How I Work</h3>
        </div>
        <div className="mam-principles-grid">
          {PRINCIPLES.map((p, i) => (
            <div key={p.label} className="mam-principle fade-in" style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="mam-principle-num">0{i + 1}</div>
              <div className="mam-principle-body">
                <div className="mam-principle-label">{p.label}</div>
                <div className="mam-principle-detail">{p.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Closing line */}
      <div className="mam-closing fade-in">
        <p>
          I enjoy coding and I am good at it, but I do not want it to define the ceiling of what I
          do. The systems engineering, the poetry, the teaching, the governance work and the data
          work all come from the same place. I want to understand how things work and explain them
          clearly to other people. This plan is about developing that fully, on both sides.
        </p>
        <span className="mam-closing-tag">Sean T. Kuwali · Personal Development Plan, 2026</span>
      </div>

    </section>
  )
}
