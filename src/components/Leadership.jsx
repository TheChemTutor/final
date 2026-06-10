/* Leadership and community roles displayed as a card grid. */
import React from 'react'

const CARDS = [
  {
    icon:  '🌐',
    title: 'International Affairs Secretary',
    org:   'SRC, BIUST · May 2026 – May 2027',
    desc:  'Secretary for the International Affairs Committee. Facilitates communication between international student bodies and university administration.',
  },
  {
    icon:  '🤝',
    title: 'Student Welfare Coordinator',
    org:   'SRC, BIUST · Jun 2025 – Apr 2026',
    desc:  'Represented welfare interests of international students. Organised inclusion initiatives. Completed full tenure.',
  },
  {
    icon:  '✍️',
    title: 'Writing Committee Chairperson',
    org:   'Creatives Club, BIUST · Oct 2025 – Present',
    desc:  'Chairs the Writing Committee and coordinates workshops, literary events, and member development. Previously Vice/Acting Chairperson and Writing Mentor.',
  },
  {
    icon:  '🎓',
    title: 'Student Mentor',
    org:   'BIUST Mentorship Programme · Aug 2025 – Present',
    desc:  'Graduated 10 mentees in the August 2025 cohort. Supports first-year students with academic adjustment, life skills, and retention.',
  },
  {
    icon:  '📊',
    title: 'Data Analytics Club Member',
    org:   'Outliers, BIUST · May 2026',
    desc:  'Member of the Data Analytics and Statistics Club, engaging with real data projects and analytics methodologies.',
  },
  {
    icon:  '🎵',
    title: 'Softball Team Captain',
    org:   'Legae Academy · 2017 – 2019',
    desc:  'Led the school softball team and developed leadership and team coordination skills. Also served as Debate Club member 2018-2019.',
  },
]

export default function Leadership() {
  return (
    <section id="leadership">

      <div className="section-header fade-in">
        <span className="section-num">06</span>
        <h2>Leadership &amp; <em>Community</em></h2>
        <div className="section-line" />
      </div>

      <div className="leadership-grid">
        {CARDS.map((card, i) => (
          <div key={i} className="leadership-card fade-in">
            <div className="lc-icon">{card.icon}</div>
            <div className="lc-title">{card.title}</div>
            <div className="lc-org">{card.org}</div>
            <p className="lc-desc">{card.desc}</p>
          </div>
        ))}
      </div>

    </section>
  )
}
