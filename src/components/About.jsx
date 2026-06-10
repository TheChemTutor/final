/* About section with bio text, interest pills, and a portrait photo grid. */
import React from 'react'

const INTERESTS = [
  'System Design & Optimisation',
  'AI & ML Ethics',
  'Game Development',
  'Data Analytics',
  'Project Management',
  'Technical Writing',
  'Distributed Systems',
  'Creative Writing',
]

export default function About() {
  return (
    <section id="about">

      <div className="section-header fade-in">
        <span className="section-num">00</span>
        <h2>About <em>Me</em></h2>
        <div className="section-line" />
      </div>

      <div className="about-layout">

        {/* Bio paragraphs and interest tags */}
        <div className="about-text fade-in">
          <p>
            I'm <span className="highlight">Sean Takunda Kuwali</span>, a third-year Computer Science and
            Software Engineering student at{' '}
            <span className="highlight">
              BIUST (Botswana International University of Science and Technology)
            </span>.
            My work spans backend API development, distributed systems, containerised deployments,
            and data analytics.
          </p>
          <p>
            What drives me is a passion for{' '}
            <span className="highlight">building systems that scale</span>, 7 years in and counting, starting
            with C# and Assembly in high school. Whether that's a multi-branch internet café
            orchestrator with AI-driven traffic management or a full-stack event ecosystem for
            thousands of users, I believe good software is clean, purposeful, and efficient.
          </p>
          <p>
            I'm currently completing{' '}
            <span className="highlight">Work Integrated Learning at Spectrum Analytics</span>,
            applying backend development and data pipeline skills in a professional analytics
            environment. Beyond code, I serve as{' '}
            <span className="highlight">SRC International Affairs Secretary</span>, chair the{' '}
            <span className="highlight">Creatives Club Writing Committee</span>, and mentor
            first-year students.
          </p>
          <p>
            My academic foundation is strong: I came in with{' '}
            <span className="highlight">
              full A-Levels in Pure Mathematics, Statistics, Mechanics, and Computer Science
            </span>
            , and all-A IGCSEs in sciences and computing. I'm motivated by the intersection of{' '}
            <span className="highlight">system design, data, and real human impact</span>.
          </p>

          <div className="about-interests">
            <h4>Professional Interests</h4>
            <div className="interest-pills">
              {INTERESTS.map(item => (
                <span key={item} className="interest-pill">{item}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Portrait photo stack */}
        <div className="about-images fade-in" style={{ transitionDelay: '0.15s' }}>
          <div className="portrait-frame">
            <img src="/images/img_01.jpg" alt="Sean Kuwali" />
            <span className="portrait-corner-br" />
            <div className="portrait-label">leadership &amp; confidence</div>
          </div>
          <div className="about-img-pair" style={{ marginTop: '2px' }}>
            <div className="about-img-wrap">
              <img src="/images/img_02.jpg" alt="Sean Kuwali" />
            </div>
            <div className="about-img-wrap">
              <img src="/images/img_03.jpg" alt="Legae Academy" />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
