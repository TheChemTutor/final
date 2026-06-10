/* Work experience and education shown as a vertical timeline. */
import React from 'react'

const TIMELINE = [
  {
    date:   'MAY 2026 – JUL 2026 · CURRENT',
    role:   'Software Engineering Intern (WIL)',
    org:    'Spectrum Analytics · Gaborone',
    points: [
      'Real-world data analytics and software development as part of BIUST Work Integrated Learning',
      'Applied backend development and data pipeline skills in a professional analytics environment',
      'Collaborating with industry professionals on live client-facing systems',
    ],
  },
  {
    date:   '2017 – 2021 · HIGH SCHOOL',
    role:   'Computer Science Student',
    org:    'Legae Academy · Gaborone',
    points: [
      '4 years formal CS: C# and Assembly as primary languages across IGCSE and A-Level',
      'Built foundational systems thinking, logic design, and low-level programming skills',
      'Built and maintained small desktop applications and algorithmic solutions in C#',
    ],
  },
  {
    date:   '2025 – 2026 · ACADEMIC',
    role:   'Backend Developer, Distributed AI Traffic',
    org:    'BIUST Multi-Branch Internet Cafe Project',
    points: [
      'Built FastAPI/Redis/Docker orchestration backend with AI auto-scaling logic',
      'Designed mock AI service and REST API with JWT auth and containerised deployment',
      'Built React dashboard for real-time traffic monitoring in a 12-file modular production build',
      'Integrated Orchestrator backend with Loadlink frontend and authored progress documentation',
    ],
  },
  {
    date:   '2025 – 2026 · ACADEMIC',
    role:   'Backend Developer, Group Delta Event Ecosystem',
    org:    'BIUST COMP-302 Group Project',
    points: [
      'Built Node.js/Express backend with JWT auth, Firebase Firestore, and EJS templating',
      'Implemented error-handling middleware, graceful shutdown, and RESTful architecture',
      'Coordinated API contract design so all requests route through secured endpoints',
    ],
  },
  {
    date:   '2023 – PRESENT',
    role:   'Private Tutor (Self-Employed)',
    org:    'Self-Employed · Botswana',
    points: [
      'Founded independent tuition covering Maths, Physics, Chemistry, and CS',
      'Delivered one-on-one and group sessions with customised lesson plans',
    ],
  },
  {
    date:   'JAN 2023 – JUL 2023',
    role:   'Tutor',
    org:    'Lion Tutoring · Maruapula',
    points: [
      'IGCSE/A-Level tutoring in Chemistry, Mathematics, CS, English, Physics, and Literature',
      'Supported exam preparation with regular feedback to learners and guardians',
    ],
  },
]

export default function Experience() {
  return (
    <section id="experience">

      <div className="section-header fade-in">
        <span className="section-num">03</span>
        <h2>Work <em>Experience</em></h2>
        <div className="section-line" />
      </div>

      <div className="experience-layout">

        {/* Timeline list on the left */}
        <div className="timeline">
          {TIMELINE.map((item, i) => (
            <div key={i} className="timeline-item fade-in">
              <div className="timeline-date">{item.date}</div>
              <div className="timeline-role">{item.role}</div>
              <div className="timeline-org">{item.org}</div>
              <ul className="timeline-points">
                {item.points.map((point, j) => (
                  <li key={j}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Sticky photo frame on the right */}
        <div className="experience-photo fade-in" style={{ transitionDelay: '0.2s' }}>
          <div className="experience-photo-frame">
            <img src="/images/img_10.jpg" alt="First day at Lion Tutoring" />
          </div>
          <div className="experience-photo-label">First day · Lion Tutoring</div>
        </div>

      </div>
    </section>
  )
}
