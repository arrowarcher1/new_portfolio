import {
  FEATURED_PROJECTS,
  ARCHIPELAGO_PROJECTS,
  EXPERIENCES,
  SKILL_CATEGORIES,
  LINKS,
} from '../data/content'
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload, FaExternalLinkAlt } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'

// Served when WebGL is unavailable: same content, plain scrolling document.

export default function StaticFallback() {
  return (
    <div className="h-full overflow-y-auto bg-void-950 text-mist-100">
      <main className="max-w-3xl mx-auto px-6 py-16 space-y-16">
        <header className="text-center">
          <h1 className="font-display font-extrabold text-4xl md:text-6xl aurora-text">
            ANDREW VAN OSTRAND
          </h1>
          <p className="mt-4 text-mist-200">
            Software engineer — AI agents, blockchain &amp; systems
          </p>
          <p className="mt-1 font-mono text-xs text-mist-400">
            CS &amp; Business @ Lehigh · Capstone SWE @ Oracle
          </p>
          <div className="flex justify-center gap-5 mt-6 text-mist-300">
            <a href={LINKS.github} aria-label="GitHub"><FaGithub size={20} /></a>
            <a href={LINKS.linkedin} aria-label="LinkedIn"><FaLinkedin size={20} /></a>
            <a href={LINKS.leetcode} aria-label="LeetCode"><SiLeetcode size={20} /></a>
            <a href={`mailto:${LINKS.email}`} aria-label="Email"><FaEnvelope size={20} /></a>
            <a href={LINKS.resume} download aria-label="Resume"><FaDownload size={20} /></a>
          </div>
        </header>

        <section>
          <h2 className="section-label mb-4">About</h2>
          <p className="leading-relaxed text-mist-200">
            I&apos;m a student at Lehigh University (GPA 3.71) pursuing a B.S. in Computer Science &amp;
            Business — currently building digital titling infrastructure at Vitu and enterprise
            blockchain through my Oracle capstone. Previously I researched LLVM compiler optimizations
            for next-gen memory architectures at Lehigh. From decentralized identity systems to
            real-time production platforms, my work spans blockchain, ML/AI, compiler design, and
            systems engineering.
          </p>
        </section>

        <section>
          <h2 className="section-label mb-4">Experience</h2>
          <div className="space-y-8">
            {EXPERIENCES.map((exp) => (
              <div key={exp.company} className="border-l-2 pl-4" style={{ borderColor: exp.color }}>
                <h3 className="font-semibold">
                  {exp.role} · <span style={{ color: exp.color }}>{exp.company}</span>
                </h3>
                <p className="font-mono text-xs text-mist-400">{exp.period}</p>
                <ul className="mt-2 space-y-1 text-sm text-mist-200 list-disc list-inside">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-label mb-4">Projects</h2>
          <div className="space-y-8">
            {FEATURED_PROJECTS.map((p) => (
              <div key={p.id} className="glass-panel p-6">
                <h3 className="font-display text-xl" style={{ color: p.color }}>{p.title}</h3>
                <p className="text-sm text-mist-300 italic mt-1">{p.tagline}</p>
                <p className="text-sm text-mist-200 mt-3">{p.description}</p>
                {p.link && (
                  <a href={p.link} className="ghost-button mt-4">
                    {p.linkLabel} <FaExternalLinkAlt size={11} />
                  </a>
                )}
              </div>
            ))}
            <ul className="text-sm text-mist-200 space-y-2">
              {ARCHIPELAGO_PROJECTS.map((p) => (
                <li key={p.id}>
                  <span style={{ color: p.color }}>{p.title}</span> — {p.tagline}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="section-label mb-4">Skills</h2>
          <div className="space-y-4">
            {SKILL_CATEGORIES.map((cat) => (
              <p key={cat.label} className="text-sm">
                <span className="font-mono text-aurora-cyan text-xs uppercase tracking-widest">
                  {cat.label}:
                </span>{' '}
                <span className="text-mist-200">{cat.items.join(' · ')}</span>
              </p>
            ))}
          </div>
        </section>

        <footer className="text-center font-mono text-[0.65rem] text-mist-400 tracking-widest">
          © {new Date().getFullYear()} ANDREW VAN OSTRAND
        </footer>
      </main>
    </div>
  )
}
