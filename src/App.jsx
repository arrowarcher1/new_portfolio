import { lazy, Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaArrowUpRightFromSquare,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from 'react-icons/fa6'
import {
  ARCHIPELAGO_PROJECTS,
  EXPERIENCES,
  FEATURED_PROJECTS,
  LINKS,
  SKILL_CATEGORIES,
} from './data/content'
import { useReducedMotion } from './hooks/useReducedMotion'

const HeroField = lazy(() => import('./scene/HeroField'))

const ease = [0.22, 1, 0.36, 1]

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease },
}

function Header() {
  return (
    <header className="header">
      <a href="#top" className="logo">Andrew Van Ostrand</a>
      <nav>
        <a href="#work">Work</a>
        <a href="#experience">Experience</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
      <a className="header-link" href={LINKS.resume} download>Resume</a>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-text">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          Software Engineer
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease }}
        >
          I build systems
          <br />
          that have to work.
        </motion.h1>
        <motion.p
          className="lede"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease }}
        >
          Verifiable infrastructure, AI agents, compilers, and real-time platforms.
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
        >
          <a href="#work" className="btn-primary">Selected work</a>
          <a href={`mailto:${LINKS.email}`} className="text-link muted">Email</a>
        </motion.div>
      </div>
    </section>
  )
}

function Work() {
  return (
    <section className="section" id="work">
      <motion.div {...reveal} className="section-label">Work</motion.div>
      <div className="project-stack">
        {FEATURED_PROJECTS.map((project, i) => (
          <motion.article key={project.id} {...reveal} className="project">
            <a className="project-image" href={project.link} target="_blank" rel="noreferrer">
              <img src={project.image} alt={project.imageAlt || project.title} loading="lazy" />
            </a>
            <div className="project-copy">
              <div className="project-meta">
                <span>{String(i + 1).padStart(2, '0')}</span>
                <h2>{project.title}</h2>
              </div>
              <p className="project-tagline">{project.tagline}</p>
              <p className="project-desc">{project.description}</p>
              <p className="tech">{project.tech.join('  ·  ')}</p>
              <a href={project.link} target="_blank" rel="noreferrer" className="text-link">
                {project.linkLabel} <FaArrowUpRightFromSquare size={11} aria-hidden="true" />
              </a>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div {...reveal} className="more">
        <h3>More</h3>
        <ul>
          {ARCHIPELAGO_PROJECTS.map((p) => (
            <li key={p.id}>
              {p.link ? (
                <a href={p.link} target="_blank" rel="noreferrer">
                  <strong>{p.title}</strong>
                  <span>{p.tagline}</span>
                </a>
              ) : (
                <div>
                  <strong>{p.title}</strong>
                  <span>{p.tagline}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  )
}

function Experience() {
  const [open, setOpen] = useState(0)

  return (
    <section className="section" id="experience">
      <motion.div {...reveal} className="section-label">Experience</motion.div>
      <div className="exp-list">
        {EXPERIENCES.map((exp, i) => {
          const isOpen = open === i
          return (
            <motion.div key={exp.company + exp.role} {...reveal} className={`exp-item ${isOpen ? 'open' : ''}`}>
              <button type="button" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                <span className="exp-role">{exp.role}</span>
                <span className="exp-company">
                  {exp.logo ? (
                    <img
                      className={`exp-logo${exp.logoPhoto ? ' exp-logo-photo' : ''}`}
                      src={exp.logo}
                      alt={exp.company}
                      title={exp.company}
                      width={exp.logoPhoto ? 72 : 88}
                      height={exp.logoPhoto ? 22 : 22}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span>{exp.company}</span>
                  )}
                </span>
                <span className="exp-period">{exp.period}</span>
                <span className="exp-toggle" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
              <div className="exp-body" hidden={!isOpen}>
                {exp.summary ? <p>{exp.summary}</p> : null}
                <ul>
                  {exp.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
                <p className="tech">{exp.tech.join('  ·  ')}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="section about" id="about">
      <motion.div {...reveal} className="section-label">About</motion.div>
      <div className="about-grid">
        <motion.div {...reveal} className="about-copy">
          <p>
            I build systems at the intersection of correctness, performance, and real-world impact.
          </p>
          <p>
            I&apos;m pursuing a B.S. in Computer Science &amp; Business at Lehigh University (GPA 3.71),
            now working on digital titling infrastructure at Vitu while building enterprise blockchain
            systems through my Oracle capstone. Previously I researched LLVM compiler optimizations
            for next-generation memory architectures at Lehigh.
          </p>
          <p>
            From decentralized identity to real-time production platforms, my work spans blockchain,
            ML/AI, compiler design, and systems engineering.
          </p>
        </motion.div>
        <motion.dl {...reveal} className="about-facts surface">
          <div><dt>Education</dt><dd>B.S. CS &amp; Business</dd></div>
          <div><dt>Graduation</dt><dd>December 2026</dd></div>
          <div><dt>Current</dt><dd>Software Engineer Intern · Vitu</dd></div>
          <div><dt>Focus</dt><dd>LLVM · NVM · RDMA · Verifiable systems</dd></div>
        </motion.dl>
      </div>

      <motion.div {...reveal} className="skills" id="skills">
        {SKILL_CATEGORIES.map((cat) => (
          <div key={cat.label} className="skill-card">
            <h3>{cat.label}</h3>
            <p>{cat.items.join(', ')}</p>
          </div>
        ))}
      </motion.div>
    </section>
  )
}

function Contact() {
  return (
    <footer className="section contact" id="contact">
      <motion.div {...reveal} className="contact-panel">
        <div className="section-label">Contact</div>
        <h2>Let&apos;s build something.</h2>
        <p className="lede">Open to hard problems, sharp teams, and work that has to be correct.</p>
        <a className="email-link" href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
        <div className="socials">
          <a href={LINKS.github} target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
          <a href={LINKS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href={`mailto:${LINKS.email}`} aria-label="Email"><FaEnvelope /></a>
          <a href={LINKS.resume} download className="text-link">Resume</a>
        </div>
        <p className="copyright">© {new Date().getFullYear()} Andrew Van Ostrand</p>
      </motion.div>
    </footer>
  )
}

export default function App() {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    document.documentElement.style.scrollBehavior = reducedMotion ? 'auto' : 'smooth'
  }, [reducedMotion])

  return (
    <div className="page">
      {/* Full-page signal-field atmosphere — sits under content */}
      <Suspense fallback={null}>
        <HeroField reducedMotion={reducedMotion} />
      </Suspense>
      <div className="page-content">
        <Header />
        <main>
          <Hero />
          <Work />
          <Experience />
          <About />
        </main>
        <Contact />
      </div>
    </div>
  )
}
