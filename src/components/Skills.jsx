/*
  Skills section.
  Bars animate from 0% to their target width when the section
  scrolls into view, using an IntersectionObserver.
*/
import React, { useEffect, useRef, useState } from 'react'

const GROUPS = [
  {
    title: 'Languages',
    skills: [
      { name: 'Python',                level: 'Advanced',      w: 88 },
      { name: 'JavaScript / Node.js',  level: 'Advanced',      w: 85 },
      { name: 'Java',                  level: 'Intermediate+', w: 78 },
      { name: 'C / C++',              level: 'Intermediate',  w: 70 },
      { name: 'HTML / CSS',            level: 'Proficient',    w: 82 },
    ],
  },
  {
    title: 'Frameworks & Tools',
    skills: [
      { name: 'FastAPI',                   level: 'Advanced',     w: 85 },
      { name: 'Express.js / REST APIs',    level: 'Advanced',     w: 88 },
      { name: 'React',                     level: 'Intermediate', w: 72 },
      { name: 'Docker / Docker Compose',   level: 'Intermediate', w: 74 },
      { name: 'Firebase Firestore / Auth', level: 'Advanced',     w: 86 },
    ],
  },
  {
    title: 'Dev Practices',
    skills: [
      { name: 'JWT Authentication',      level: 'Advanced',     w: 88 },
      { name: 'Git & GitHub / CI/CD',    level: 'Proficient',   w: 80 },
      { name: 'Agile / Sprint Planning', level: 'Proficient',   w: 76 },
      { name: 'Redis / Caching',         level: 'Intermediate', w: 72 },
      { name: 'PostgreSQL / SQL',        level: 'Intermediate', w: 70 },
    ],
  },
  {
    title: 'Data & Automation',
    skills: [
      { name: 'Data Warehousing / KDD', level: 'Intermediate', w: 72 },
      { name: 'ReportLab / PDF Gen',    level: 'Advanced',     w: 84 },
      { name: 'Pandas / NumPy',         level: 'Intermediate', w: 75 },
      { name: 'Data Mining (Apriori)',   level: 'Intermediate', w: 70 },
      { name: 'Formal Methods / Logic', level: 'Intermediate', w: 74 },
    ],
  },
]

/* Renders one skill row with an animated fill bar. */
function SkillBar({ name, level, w, animate }) {
  return (
    <div className="skill-item">
      <div className="skill-row">
        <span className="skill-name">{name}</span>
        <span className="skill-level">{level}</span>
      </div>
      <div className="skill-bar">
        <div
          className="skill-fill"
          style={{
            width:      animate ? `${w}%` : '0%',
            transition: animate ? 'width 1.1s cubic-bezier(0.4,0,0.2,1)' : 'none',
          }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  const sectionRef      = useRef(null)
  const [animate, setAnimate] = useState(false)

  /* Triggers bar animation once when the section enters the viewport. */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setTimeout(() => setAnimate(true), 150) // brief delay so bars are visible first
        obs.disconnect()
      },
      { threshold: 0.15 }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="skills" ref={sectionRef}>
      <div className="section-header fade-in">
        <span className="section-num">04</span>
        <h2>Skills &amp; <em>Technologies</em></h2>
        <div className="section-line" />
      </div>

      <div className="skills-layout">
        {GROUPS.map((group, gi) => (
          <div
            key={group.title}
            className="skill-group fade-in"
            style={{ transitionDelay: `${gi * 0.08}s` }}
          >
            <div className="skill-group-title">{group.title}</div>
            {group.skills.map((skill, si) => (
              <div key={skill.name} style={{ transitionDelay: `${gi * 0.08 + si * 0.06}s` }}>
                <SkillBar {...skill} animate={animate} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
