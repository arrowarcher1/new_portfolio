import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  FaArrowRight,
  FaDownload,
  FaEnvelope,
  FaExternalLinkAlt,
  FaGithub,
  FaLinkedin,
  FaPlus,
} from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import {
  ARCHIPELAGO_PROJECTS,
  EXPERIENCES,
  FEATURED_PROJECTS,
  LINKS,
  SKILL_CATEGORIES,
} from './data/content'

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { amount: 0.15, once: true },
  transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
}

const ScrollTraceCanvas = lazy(() => import('./scene/ScrollTraceCanvas'))

const NAV_ITEMS = [
  ['01', 'Home', 'top'],
  ['02', 'About', 'about'],
  ['03', 'Experience', 'experience'],
  ['04', 'Work', 'work'],
  ['06', 'Capabilities', 'capabilities'],
  ['07', 'Contact', 'contact'],
]

function useActiveSection() {
  const [activeSection, setActiveSection] = useState('top')

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const readingLine = window.innerHeight * 0.46
      let nextSection = 'top'

      NAV_ITEMS.forEach(([, , id]) => {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top <= readingLine) nextSection = id
      })

      setActiveSection((current) => current === nextSection ? current : nextSection)
    }
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return activeSection
}

function ArrowIcon() {
  return <FaArrowRight aria-hidden="true" size={11} />
}

function ScrollProgress() {
  const progress = useRef()
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const available = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      progress.current?.style.setProperty('--page-progress', String(window.scrollY / available))
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.cancelAnimationFrame(frame)
    }
  }, [])
  return <div ref={progress} className="scroll-progress" aria-hidden="true"><span /></div>
}

function Header() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Andrew Van Ostrand, back to top">
        AVO<span>.</span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#work">Work</a>
        <a href="#experience">Experience</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
      <a className="header-resume" href={LINKS.resume} download>
        Résumé <FaDownload aria-hidden="true" size={10} />
      </a>
    </header>
  )
}

function SideIndex() {
  const activeSection = useActiveSection()
  return (
    <aside className="side-index" aria-label="Page index">
      <div className="index-links">
        {NAV_ITEMS.map(([number, label, id]) => (
          <a
            key={id}
            href={`#${id}`}
            className={activeSection === id ? 'is-active' : undefined}
            aria-current={activeSection === id ? 'location' : undefined}
          >
            <span>{number}</span>
            {label}
          </a>
        ))}
      </div>
      <div className="index-socials">
        <a href={LINKS.github} target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
        <a href={LINKS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
        <a href={`mailto:${LINKS.email}`} aria-label="Email"><FaEnvelope /></a>
      </div>
    </aside>
  )
}

function Hero() {
  return (
    <section className="hero section-grid" id="top">
      <motion.div className="hero-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h1>Andrew<br />Van Ostrand</h1>
        <p className="hero-statement">I build software for complex systems that have to work.</p>
        <p className="hero-summary">
          Working across digital infrastructure, AI agents, compilers, and real-time systems.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#work">View selected work <ArrowIcon /></a>
          <a className="button button-text" href={LINKS.resume} download>Résumé <ArrowIcon /></a>
        </div>
      </motion.div>
      <i className="trace-anchor trace-hero-one" data-trace-anchor data-trace-depth="0.15" />
      <i className="trace-anchor trace-hero-two" data-trace-anchor data-trace-depth="-0.1" />
      <i className="trace-anchor trace-hero-three" data-trace-anchor data-trace-depth="0.2" />
      <a className="hero-scroll" href="#about">Scroll to explore <span>↓</span></a>
    </section>
  )
}

function About() {
  return (
    <motion.section {...reveal} className="about section-grid section-space" id="about">
      <div className="section-number">02</div>
      <div className="section-heading">
        <h2>About</h2>
      </div>
      <div className="about-copy">
        <p className="lead">
          I build systems at the intersection of correctness, performance, and real-world impact.
        </p>
        <p>
          I&apos;m pursuing a B.S. in Computer Science &amp; Business at Lehigh University (GPA 3.71),
          now working on digital titling infrastructure at Vitu while building enterprise blockchain
          systems through my Oracle capstone and researching compiler optimizations for next-generation
          memory architectures.
        </p>
        <p>
          From decentralized identity to real-time production platforms, my work spans blockchain,
          ML/AI, compiler design, and systems engineering.
        </p>
      </div>
      <div className="about-facts">
        <div><span>Education</span><strong>B.S. CS &amp; Business</strong></div>
        <div><span>Graduation</span><strong>December 2026</strong></div>
        <div><span>Current</span><strong>Software Engineer Intern · Vitu</strong></div>
        <div><span>Research</span><strong>LLVM · NVM · RDMA</strong></div>
      </div>
      <i className="trace-anchor trace-about" data-trace-anchor data-trace-depth="-0.18" />
    </motion.section>
  )
}

function Experience() {
  const [active, setActive] = useState(0)
  return (
    <section className="experience section-grid section-space" id="experience">
      <div className="section-number">03</div>
      <div className="section-heading">
        <h2>Experience</h2>
      </div>
      <div className="experience-list">
        {EXPERIENCES.map((experience, index) => {
          const isActive = active === index
          return (
            <motion.article {...reveal} className={`experience-row ${isActive ? 'is-active' : ''}`} key={experience.company}>
              <i
                className="trace-anchor trace-experience"
                data-trace-anchor
                data-trace-depth={index % 2 ? -0.12 : 0.16}
                style={{ right: `${8 + (index % 2) * 13}%` }}
              />
              <button
                type="button"
                className="experience-trigger"
                onClick={() => setActive(isActive ? -1 : index)}
                aria-expanded={isActive}
              >
                <span className="row-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="company-mark">
                  {experience.logo ? <img src={experience.logo} alt={`${experience.company} logo`} /> : experience.company}
                </span>
                <span className="role-block">
                  <small>{experience.role}</small>
                  <strong>{experience.company}</strong>
                  <span>{experience.period}</span>
                  <span>{experience.location}</span>
                </span>
                <FaPlus className="plus" aria-hidden="true" />
              </button>
              <div className="experience-detail" aria-hidden={!isActive}>
                {experience.summary ? <p className="experience-summary">{experience.summary}</p> : null}
                <ul>
                  {experience.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
                <div className="tech-line">{experience.tech.join(' · ')}</div>
              </div>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}

function ProjectMedia({ project, number }) {
  const media = useRef()
  const { scrollYProgress } = useScroll({
    target: media,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], [-18, 18])
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.035, 1, 1.035])
  const mediaClip = useTransform(scrollYProgress, [0.02, 0.32], ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'])
  const mediaOpacity = useTransform(scrollYProgress, [0.02, 0.24], [0.6, 1])
  const imageFilter = useTransform(
    scrollYProgress,
    [0, 0.28, 0.44, 0.56, 0.72, 1],
    [
      'saturate(.16) contrast(.96) brightness(.58)',
      'saturate(.22) contrast(.98) brightness(.66)',
      'saturate(1) contrast(1.03) brightness(1)',
      'saturate(1) contrast(1.03) brightness(1)',
      'saturate(.22) contrast(.98) brightness(.66)',
      'saturate(.16) contrast(.96) brightness(.58)',
    ],
  )
  const imageOpacity = useTransform(scrollYProgress, [0, 0.32, 0.44, 0.56, 0.68, 1], [0.58, 0.68, 1, 1, 0.68, 0.58])

  return (
    <motion.a
      ref={media}
      className="project-media"
      href={project.link}
      target="_blank"
      rel="noreferrer"
      aria-label={`${project.title}: ${project.linkLabel}`}
      style={{ clipPath: mediaClip, opacity: mediaOpacity }}
    >
      <motion.img
        src={project.image}
        alt={`${project.title} interface`}
        loading="lazy"
        decoding="async"
        style={{ y: imageY, scale: imageScale, filter: imageFilter, opacity: imageOpacity }}
      />
      <span>{number}</span>
    </motion.a>
  )
}

function ProjectRow({ project, index }) {
  const number = String(index + 1).padStart(2, '0')
  const row = useRef()
  const { scrollYProgress } = useScroll({ target: row, offset: ['start end', 'end start'] })
  const bracketScale = useTransform(scrollYProgress, [0.25, 0.42, 0.58, 0.75], [0, 1, 1, 0])
  const bracketOpacity = useTransform(scrollYProgress, [0.25, 0.42, 0.58, 0.75], [0, 1, 1, 0])
  return (
    <motion.article ref={row} {...reveal} className={`project-row project-row-${index % 2 === 0 ? 'forward' : 'reverse'}`}>
      <i className="trace-anchor trace-project trace-project-entry" data-trace-anchor data-trace-depth="0.12" />
      <i className="trace-anchor trace-project trace-project-exit" data-trace-anchor data-trace-depth="0.12" />
      <motion.i className="project-trace-bracket" aria-hidden="true" style={{ scaleX: bracketScale, opacity: bracketOpacity }} />
      <div className="project-copy">
        <span className="project-index">{number}</span>
        <div>
          <h3>{project.title}</h3>
          <p className="project-tagline">{project.tagline}</p>
          <p className="project-description">{project.description}</p>
          <p className="project-tech">{project.tech.join(' · ')}</p>
          <a href={project.link} target="_blank" rel="noreferrer">
            {project.linkLabel} <FaExternalLinkAlt aria-hidden="true" size={10} />
          </a>
        </div>
      </div>
      <ProjectMedia project={project} number={number} />
    </motion.article>
  )
}

function Work() {
  const [expanded, setExpanded] = useState(null)
  return (
    <section className="work section-space" id="work">
      <div className="work-heading section-grid">
        <div className="section-number">04</div>
        <div className="section-heading"><h2>Selected work</h2></div>
        <i className="trace-anchor trace-work-heading" data-trace-anchor data-trace-depth="0.08" />
      </div>
      <div className="project-list">
        {FEATURED_PROJECTS.map((project, index) => <ProjectRow key={project.id} project={project} index={index} />)}
      </div>
      <div className="additional-work">
        <div className="additional-title"><span>05</span><h3>Additional<br />work</h3></div>
        <div className="additional-list">
          {ARCHIPELAGO_PROJECTS.map((project, index) => {
            const isOpen = expanded === index
            const Wrapper = project.link ? 'a' : 'button'
            const linkProps = project.link
              ? { href: project.link, target: '_blank', rel: 'noreferrer' }
              : { type: 'button', onClick: () => setExpanded(isOpen ? null : index) }
            return (
              <Wrapper className="additional-row" key={project.id} {...linkProps}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{project.title}</strong>
                <p>{isOpen ? project.tech.join(' · ') : project.tagline}</p>
                <FaPlus aria-hidden="true" />
              </Wrapper>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CapabilityRow({ category, index }) {
  const row = useRef()
  const { scrollYProgress } = useScroll({ target: row, offset: ['start end', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0.2, 0.47, 0.525, 0.545, 0.6, 0.84], [0.68, 0.76, 1, 1, 0.76, 0.68])
  const titleColor = useTransform(scrollYProgress, [0.47, 0.525, 0.545, 0.6], ['#898c86', '#f2f1ea', '#f2f1ea', '#898c86'])
  const numberColor = useTransform(scrollYProgress, [0.47, 0.525, 0.545, 0.6], ['#898c86', '#c7ff22', '#c7ff22', '#898c86'])
  const bracketScale = useTransform(scrollYProgress, [0.47, 0.525, 0.545, 0.6], [0, 1, 1, 0])

  return (
    <motion.article ref={row} className="capability-row" style={{ opacity }}>
      <motion.span style={{ color: numberColor }}>{String(index + 1).padStart(2, '0')}</motion.span>
      <motion.h3 style={{ color: titleColor }}>{category.label}</motion.h3>
      <p>{category.items.join(', ')}</p>
      <i className="trace-anchor trace-capability-row" data-trace-anchor data-trace-depth={index % 2 ? -0.08 : 0.1} />
      <motion.i className="capability-trace-bracket" aria-hidden="true" style={{ scaleX: bracketScale }} />
    </motion.article>
  )
}

function Capabilities() {
  return (
    <motion.section {...reveal} className="capabilities section-space" id="capabilities">
      <div className="section-number">06</div>
      <div className="section-heading"><h2>Technical capabilities</h2></div>
      <div className="capability-index">
        {SKILL_CATEGORIES.map((category, index) => (
          <CapabilityRow key={category.label} category={category} index={index} />
        ))}
      </div>
    </motion.section>
  )
}

function Contact() {
  const links = [
    [FaEnvelope, LINKS.email, `mailto:${LINKS.email}`],
    [FaGithub, 'github.com/arrowarcher1', LINKS.github],
    [FaLinkedin, 'linkedin.com/in/andrew-v-o', LINKS.linkedin],
    [SiLeetcode, 'leetcode.com/u/avanostrand', LINKS.leetcode],
    [FaDownload, 'View Résumé (PDF)', LINKS.resume],
  ]
  return (
    <footer className="contact section-space" id="contact">
      <motion.div {...reveal} className="contact-message">
        <span>07</span>
        <h2>Let&apos;s build<br />something rigorous.</h2>
        <p>I&apos;m always open to a hard problem, a sharp team, and work that has to be correct.</p>
      </motion.div>
      <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.12 }} className="contact-links">
        {links.map(([Icon, label, href]) => (
          <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
            <Icon aria-hidden="true" />
            <span>{label}</span>
            <ArrowIcon />
          </a>
        ))}
      </motion.div>
      <div className="contact-node" aria-hidden="true"><span /></div>
      <i className="trace-anchor trace-contact" data-trace-anchor data-trace-depth="0" />
      <div className="footer-meta">
        <span>© {new Date().getFullYear()} Andrew Van Ostrand</span>
        <span>Engineered systems. Measured impact.</span>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="site-shell">
      <Suspense fallback={null}><ScrollTraceCanvas /></Suspense>
      <ScrollProgress />
      <Header />
      <SideIndex />
      <main>
        <Hero />
        <About />
        <Experience />
        <Work />
        <Capabilities />
      </main>
      <Contact />
    </div>
  )
}
