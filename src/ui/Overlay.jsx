import { motion } from 'framer-motion'
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaDownload,
  FaExternalLinkAlt,
  FaArrowDown,
} from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import {
  FEATURED_PROJECTS,
  ARCHIPELAGO_PROJECTS,
  EXPERIENCES,
  SKILL_CATEGORIES,
  LINKS,
  STOPS,
} from '../data/content'

// One full-viewport section per journey stop. The 3D set piece occupies one
// side of the screen, so each panel claims the other.

const fadeUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { amount: 0.35 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
}

function Section({ index, side = 'left', children, center = false }) {
  return (
    <section
      className={`relative h-screen w-full flex items-center px-5 md:px-16 pointer-events-none ${
        center
          ? 'justify-center'
          : side === 'left'
            ? 'justify-start'
            : 'justify-end'
      }`}
      style={{ top: 0 }}
    >
      <div className="pointer-events-auto w-full md:w-auto flex justify-center">{children}</div>
      <span className="absolute bottom-6 left-6 font-mono text-[0.6rem] tracking-[0.3em] text-mist-400/60 select-none">
        {String(index + 1).padStart(2, '0')} / {String(STOPS.length).padStart(2, '0')}
      </span>
    </section>
  )
}

function Hero() {
  return (
    <Section index={0} center>
      <div className="text-center max-w-4xl">
        <p className="section-label mb-6 rise rise-1">software engineer</p>
        <h1 className="font-display font-extrabold text-4xl md:text-7xl leading-tight aurora-text rise rise-2">
          ANDREW
          <br />
          VAN OSTRAND
        </h1>
        <p className="mt-6 font-body text-mist-200 text-base md:text-lg rise rise-3">
          I build AI agents, blockchain systems, and the infrastructure behind them
        </p>
        <p className="mt-2 font-mono text-xs text-mist-400 tracking-widest rise rise-4">
          CS &amp; Business @ Lehigh · Capstone SWE @ Oracle
        </p>
        <div className="mt-14 flex flex-col items-center gap-2 text-mist-300 rise rise-5">
          <span className="font-mono text-[0.65rem] tracking-[0.35em] uppercase">
            scroll to explore
          </span>
          <FaArrowDown className="scroll-hint" />
        </div>
      </div>
    </Section>
  )
}

function About() {
  return (
    <Section index={1} side="left">
      <motion.div {...fadeUp} className="glass-panel p-7 md:p-9 max-w-md">
        <p className="section-label mb-4">01 — About</p>
        <h2 className="font-display font-semibold text-2xl text-mist-50 mb-5">
          Systems that ship
        </h2>
        <p className="text-mist-200 leading-relaxed text-sm md:text-base">
          I'm a student at <span className="text-aurora-cyan">Lehigh University</span> (GPA 3.71)
          pursuing a B.S. in Computer Science &amp; Business — currently building enterprise
          blockchain at <span className="text-aurora-amber">Oracle</span> and researching compiler
          optimizations for next-gen memory architectures.
        </p>
        <p className="text-mist-300 leading-relaxed text-sm md:text-base mt-4">
          From decentralized identity systems to real-time production platforms, my work spans
          blockchain, ML/AI, compiler design, and systems engineering.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-6">
          {[
            ['Education', 'B.S. CS & Business'],
            ['Graduation', 'December 2026'],
            ['Current', 'Capstone SWE @ Oracle'],
            ['Research', 'LLVM / NVM / RDMA'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-mist-500/20 bg-void-900/40 p-3">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-aurora-fuchsia/80">
                {label}
              </p>
              <p className="text-mist-100 text-xs md:text-sm mt-1">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  )
}

function Experience() {
  return (
    <Section index={2} side="right">
      <motion.div {...fadeUp} className="glass-panel p-7 md:p-9 max-w-lg max-h-[80vh] overflow-y-auto">
        <p className="section-label mb-4">02 — Experience</p>
        <h2 className="font-display font-semibold text-2xl text-mist-50 mb-6">
          Where I've worked
        </h2>
        <div className="space-y-6">
          {EXPERIENCES.map((exp) => (
            <div key={exp.company} className="border-l-2 pl-4" style={{ borderColor: exp.color }}>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-mist-50 font-semibold">{exp.role}</h3>
                <span className="font-mono text-xs" style={{ color: exp.color }}>
                  {exp.company}
                </span>
              </div>
              <p className="font-mono text-[0.65rem] text-mist-400 mt-0.5">{exp.period}</p>
              <ul className="mt-2 space-y-1.5">
                {exp.bullets.map((b, i) => (
                  <li key={i} className="text-mist-200 text-xs md:text-sm leading-relaxed flex gap-2">
                    <span style={{ color: exp.color }}>✦</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {exp.tech.map((t) => (
                  <span key={t} className="glass-chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  )
}

function ProjectPanel({ project, index, side, number }) {
  return (
    <Section index={index} side={side}>
      <motion.div {...fadeUp} className="glass-panel p-7 md:p-9 max-w-md max-h-[82vh] overflow-y-auto">
        <p className="section-label mb-3">{number} — Featured Project</p>
        <h2 className="font-display font-semibold text-3xl mb-1" style={{ color: project.color }}>
          {project.title}
        </h2>
        <p className="text-mist-300 text-sm italic mb-4">{project.tagline}</p>
        <img
          src={project.image}
          alt={`${project.title} screenshot`}
          loading="lazy"
          className="w-full rounded-lg border border-mist-500/25 mb-4"
        />
        <p className="text-mist-200 text-xs md:text-sm leading-relaxed">{project.description}</p>
        <ul className="mt-4 space-y-1.5">
          {project.achievements.map((a, i) => (
            <li key={i} className="text-mist-200 text-xs md:text-sm leading-relaxed flex gap-2">
              <span style={{ color: project.color }}>✦</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tech.map((t) => (
            <span key={t} className="glass-chip">
              {t}
            </span>
          ))}
        </div>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="ghost-button mt-5"
          >
            {project.linkLabel} <FaExternalLinkAlt size={11} />
          </a>
        )}
      </motion.div>
    </Section>
  )
}

function ArchipelagoSection() {
  return (
    <Section index={6} side="right">
      <motion.div {...fadeUp} className="max-w-md w-full">
        <p className="section-label mb-4">06 — More Work</p>
        <h2 className="font-display font-semibold text-2xl text-mist-50 mb-5">
          More projects
        </h2>
        <div className="space-y-3">
          {ARCHIPELAGO_PROJECTS.map((p) => (
            <a
              key={p.id}
              href={p.link ?? undefined}
              target={p.link ? '_blank' : undefined}
              rel="noreferrer"
              className={`glass-panel block p-4 transition-transform duration-300 ${
                p.link ? 'hover:-translate-y-0.5 cursor-pointer' : 'cursor-default'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: p.color }}>
                    {p.title}
                  </h3>
                  <p className="text-mist-300 text-xs mt-1">{p.tagline}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.tech.map((t) => (
                      <span key={t} className="glass-chip">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                {p.link && <FaExternalLinkAlt className="text-mist-400 shrink-0" size={12} />}
              </div>
            </a>
          ))}
        </div>
      </motion.div>
    </Section>
  )
}

function Skills() {
  return (
    <Section index={7} side="left">
      <motion.div {...fadeUp} className="glass-panel p-7 md:p-9 max-w-lg max-h-[80vh] overflow-y-auto">
        <p className="section-label mb-4">07 — Skills</p>
        <h2 className="font-display font-semibold text-2xl text-mist-50 mb-6">
          Technical toolkit
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          {SKILL_CATEGORIES.map((cat) => (
            <div key={cat.label}>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-aurora-cyan mb-2">
                {cat.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((item) => (
                  <span key={item} className="glass-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  )
}

function Contact() {
  return (
    <Section index={8} center>
      <motion.div {...fadeUp} className="text-center max-w-xl">
        <p className="section-label mb-5">08 — Contact</p>
        <h2 className="font-display font-bold text-3xl md:text-5xl aurora-text mb-5">
          Let's work together
        </h2>
        <p className="text-mist-200 text-sm md:text-base mb-8">
          Open to new projects, opportunities, and collaborations.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={`mailto:${LINKS.email}`} className="ghost-button">
            <FaEnvelope size={13} /> {LINKS.email}
          </a>
          <a href={LINKS.resume} download className="ghost-button">
            <FaDownload size={12} /> Resume
          </a>
        </div>
        <div className="flex justify-center gap-6 mt-8 text-mist-300">
          {[
            [LINKS.github, <FaGithub key="g" size={22} />, 'GitHub'],
            [LINKS.linkedin, <FaLinkedin key="l" size={22} />, 'LinkedIn'],
            [LINKS.leetcode, <SiLeetcode key="c" size={22} />, 'LeetCode'],
          ].map(([href, icon, label]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="hover:text-aurora-fuchsia transition-colors duration-300"
            >
              {icon}
            </a>
          ))}
        </div>
        <p className="font-mono text-[0.6rem] text-mist-400/70 tracking-widest mt-12">
          © {new Date().getFullYear()} ANDREW VAN OSTRAND — BUILT WITH REACT THREE FIBER
        </p>
      </motion.div>
    </Section>
  )
}

export default function Overlay() {
  return (
    <div className="w-full">
      <Hero />
      <About />
      <Experience />
      <ProjectPanel project={FEATURED_PROJECTS[0]} index={3} side="left" number="03" />
      <ProjectPanel project={FEATURED_PROJECTS[1]} index={4} side="right" number="04" />
      <ProjectPanel project={FEATURED_PROJECTS[2]} index={5} side="left" number="05" />
      <ArchipelagoSection />
      <Skills />
      <Contact />
    </div>
  )
}
