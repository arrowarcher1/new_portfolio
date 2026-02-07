import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload, FaTimes, FaExternalLinkAlt, FaPhone, FaMapMarkerAlt, FaArrowDown } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';

// ═══════════════════════════════════════
// DATA
// ═══════════════════════════════════════

const PROJECTS = [
  {
    title: "Truth Trail",
    shortDesc: "Blockchain-based forensic evidence management",
    fullDesc: "Engineered blockchain-based evidence management system providing immutable audit trails for forensic investigations, solving chain-of-custody vulnerabilities in traditional evidence tracking.",
    tech: ["Solidity", "SKALE", "GCP", "Gemini AI", "Vertex AI", "React"],
    achievements: [
      "Dual-layer architecture integrating SKALE blockchain with GCP-hosted AI classification",
      "Reduced evidence verification time by 60% through smart contract automation",
      "Automated evidence categorization using Gemini/Vertex AI",
      "Maintained cryptographic proof of authenticity for legal compliance",
    ],
    link: "https://devpost.com/software/truth-trail",
    image: "/images/truth-trail.jpg",
    color: "#10b981",
  },
  {
    title: "ProfPair",
    shortDesc: "AI professor-student matching — Best Use of AI Award",
    fullDesc: "Won Best Use of AI Award at university hackathon for building intelligent professor-student matching platform analyzing 10,000+ course reviews to connect students with compatible professors across two universities.",
    tech: ["AWS Comprehend", "SageMaker", "S3", "Flask", "Python"],
    achievements: [
      "Won Best Use of AI Award at university hackathon",
      "End-to-end ML pipeline on AWS SageMaker with Comprehend NLP for sentiment analysis",
      "Scalable Flask API with S3-backed storage for 8,500+ students",
      "Multi-dimensional review data processing for personalized recommendations",
    ],
    link: "https://devpost.com/software/profpair",
    image: "/images/profpair.jpg",
    color: "#06b6d4",
  },
  {
    title: "LCRS",
    shortDesc: "Lung cancer risk assessment via machine learning",
    fullDesc: "Innovative lung cancer risk assessment tool for the Lehigh Hacks for Health hackathon. Provides accessible pre-screening for lower-income communities to improve early detection rates.",
    tech: ["Google Cloud Vertex AI", "AutoML", "Python", "Cloud Compute"],
    achievements: [
      "Awarded 'Best First-Year Solution'",
      "Cost-effective pre-screening process",
      "Advanced ML for accurate risk assessments",
    ],
    image: "/images/lcrs.jpg",
    color: "#f59e0b",
  },
  {
    title: "ASL for the Community",
    shortDesc: "Real-time ASL sign language translation",
    fullDesc: "Bridges communication gaps between deaf and hearing communities. Image recognition model translating American Sign Language signs to text and speech in real-time.",
    tech: ["Amazon SageMaker", "Python", "Amazon Polly", "Turtle Graphics"],
    achievements: [
      "Received 'Best AWS Integration' award",
      "Real-time ASL translation to text and speech",
      "User-friendly interface design",
    ],
    link: "https://devpost.com/software/asl-for-the-community",
    image: "/images/asl.jpg",
    color: "#8b5cf6",
  },
  {
    title: "Portfolio Website",
    shortDesc: "This site — built with React, Tailwind & Framer Motion",
    fullDesc: "A sleek, responsive portfolio to showcase projects and skills. Dynamic representation of work and abilities in modern web development.",
    tech: ["React.js", "Tailwind CSS", "Framer Motion", "Vercel", "JavaScript"],
    achievements: [
      "Responsive design for all devices",
      "Interactive 3D card effects & scroll animations",
      "Dark/light mode transformation",
      "Deployed on Vercel with CI/CD",
    ],
    link: "https://andrewvo.dev",
    image: "/images/portfolio.jpg",
    color: "#10b981",
  },
];

const SKILL_CATEGORIES = [
  {
    label: 'Languages',
    prefix: 'lang',
    items: ['JavaScript/TypeScript', 'Python', 'Java', 'C/C++', 'SQL', 'Solidity', 'Go'],
  },
  {
    label: 'Frontend',
    prefix: 'fe',
    items: ['React', 'HTML/CSS', 'Socket.io', 'REST APIs', 'Framer Motion'],
  },
  {
    label: 'Backend',
    prefix: 'be',
    items: ['Node.js', 'Express', 'Flask', 'JWT Auth', 'WebSocket'],
  },
  {
    label: 'Cloud & Data',
    prefix: 'cloud',
    items: ['AWS (S3, EC2, Lambda, SageMaker)', 'GCP (Vertex AI, Compute)', 'SQL Server', 'Oracle DB', 'Docker', 'Kubernetes'],
  },
  {
    label: 'Dev Tools',
    prefix: 'tools',
    items: ['Git', 'Docker', 'Linux/Unix', 'Postman', 'LLVM', 'Maven', 'JUnit'],
  },
  {
    label: 'Specializations',
    prefix: 'spec',
    items: ['Full-Stack Dev', 'ML / AI', 'System Design', 'Compiler Optimization', 'Blockchain', 'Real-Time Systems'],
  },
];

const EXPERIENCES = [
  {
    role: 'Capstone Software Engineer',
    company: 'Oracle',
    location: 'Bethlehem, PA',
    period: 'Jan 2026 — Present',
    tech: ['Go', 'Solidity', 'TypeScript', 'Node.js', 'React', 'Docker', 'Kubernetes'],
    bullets: [
      'Building enterprise decentralized identity solution for Oracle Blockchain Platform with policy-based access control on permissioned Ethereum networks',
      'Integrating Solidity smart contracts with TypeScript/Node.js APIs and React frontend for secure credential issuance & verification',
      'Engineering modular registry architecture (DID, credentials, revocation, trust) using cryptographic primitives',
    ],
    color: '#f59e0b',
  },
  {
    role: 'Compiler Research Intern',
    company: 'Lehigh University',
    location: 'Bethlehem, PA',
    period: 'May 2025 — Present',
    tech: ['LLVM', 'C++', 'RDMA', 'Non-Volatile Memory'],
    bullets: [
      'Developed Serenity compiler using LLVM-based optimizations for NVM and RDMA — achieving 7\u00d7 throughput improvement over SSD and 60% reduction in storage costs',
      'Designed developer-friendly API abstractions reducing RDMA implementation complexity from weeks to hours',
    ],
    color: '#8b5cf6',
  },
  {
    role: 'Software Engineer Intern',
    company: 'Vomar Products',
    location: 'Los Angeles, CA',
    period: 'Dec 2025 — Jan 2026',
    tech: ['Node.js', 'React', 'SQL Server', 'Socket.io', 'REST APIs'],
    bullets: [
      'Architected full-stack production tracking platform serving 50+ employees — reduced job lookup time by 75% with real-time WebSocket updates across 166+ concurrent jobs',
      'Engineered automated ERP integration syncing JobBOSS data every 5 min via RESTful API, eliminating manual data entry',
      'Deployed role-based JWT auth system, eliminating 15+ hrs/week of rework caused by document version conflicts',
    ],
    color: '#06b6d4',
  },
];

const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
];

// ═══════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════

function useTypewriter(texts, speed = 60, pause = 2000) {
  const [display, setDisplay] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplay(current.slice(0, charIndex + 1));
        setCharIndex(c => c + 1);
        if (charIndex + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        setDisplay(current.slice(0, charIndex - 1));
        setCharIndex(c => c - 1);
        if (charIndex <= 1) {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
          setCharIndex(0);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, speed, pause]);

  return display;
}

function useActiveSection() {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map(item => document.getElementById(item.id));
      const scrollPos = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActive(NAV_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return active;
}

function useTilt(ref) {
  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * 10;
    const tiltY = (x - 0.5) * -10;
    ref.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    ref.current.style.setProperty('--mouse-x', `${x * 100}%`);
    ref.current.style.setProperty('--mouse-y', `${y * 100}%`);
  }, [ref]);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }, [ref]);

  return { handleMouseMove, handleMouseLeave };
}

// ═══════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════

// --- Floating Particles Background ---
const FloatingParticles = ({ isDark }) => {
  const particles = useRef(
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
    }))
  ).current;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// --- Navigation ---
const Navigation = ({ isDark, toggleTheme }) => {
  const active = useActiveSection();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{ '--bg-opacity': bgOpacity }}
      >
        <motion.div
          className="absolute inset-0 backdrop-blur-xl border-b transition-colors duration-500"
          style={{
            opacity: bgOpacity,
            backgroundColor: isDark ? 'rgba(10, 10, 15, 0.85)' : 'rgba(250, 248, 244, 0.85)',
            borderColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.15)',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => scrollTo('hero')}
            className="font-mono text-sm tracking-wider transition-colors duration-300"
            style={{ color: '#10b981' }}
          >
            {'<AVO />'}
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-3 py-1.5 text-sm font-display rounded-md transition-all duration-300 ${
                  active === item.id
                    ? 'text-glow bg-glow/10'
                    : isDark
                      ? 'text-cream-400 hover:text-glow'
                      : 'text-void-500 hover:text-glow'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="w-px h-5 mx-2" style={{ background: isDark ? 'rgba(226,221,210,0.1)' : 'rgba(30,31,46,0.1)' }} />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 flex flex-col gap-1.5"
              aria-label="Toggle menu"
            >
              <motion.span
                className="block w-5 h-0.5 rounded-full"
                style={{ background: '#10b981' }}
                animate={mobileOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
              />
              <motion.span
                className="block w-5 h-0.5 rounded-full"
                style={{ background: '#10b981' }}
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              />
              <motion.span
                className="block w-3 h-0.5 rounded-full"
                style={{ background: '#10b981' }}
                animate={mobileOpen ? { rotate: -45, y: -4, width: 20 } : { rotate: 0, y: 0, width: 12 }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 pt-20 px-6"
            style={{ background: isDark ? 'rgba(10, 10, 15, 0.98)' : 'rgba(250, 248, 244, 0.98)' }}
          >
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(item.id)}
                  className={`text-left px-4 py-3 text-lg font-display rounded-lg transition-colors ${
                    active === item.id
                      ? 'text-glow bg-glow/10'
                      : isDark ? 'text-cream-300' : 'text-void-600'
                  }`}
                >
                  <span className="font-mono text-xs text-glow/50 mr-3">0{i + 1}</span>
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Section Wrapper with scroll animation ---
const Section = ({ id, children, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id={id} ref={ref} className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </section>
  );
};

// --- Section Label ---
const SectionLabel = ({ number, label, isDark }) => (
  <div className="flex items-center gap-4 mb-12">
    <span className="font-mono text-sm" style={{ color: '#10b981' }}>
      {number}
    </span>
    <h2 className={`text-3xl md:text-4xl font-display font-bold ${isDark ? 'text-cream-100' : 'text-void-800'}`}>
      {label}
    </h2>
    <div className="flex-1 section-line" />
  </div>
);

// --- Hero Section ---
const Hero = ({ isDark }) => {
  const typed = useTypewriter([
    'Full-Stack Engineer',
    'Blockchain @ Oracle',
    'Compiler Researcher',
    'Systems Builder',
    'CS & Business @ Lehigh',
  ], 70, 2500);

  return (
    <section id="hero" className="hero-height relative flex items-center justify-center overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full animate-float"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full animate-float"
          style={{
            animationDelay: '-3s',
            background: isDark
              ? 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Terminal prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-block mb-8"
        >
          <div
            className={`rounded-lg px-5 py-3 font-mono text-sm border ${
              isDark
                ? 'bg-void-800/80 border-glow/10 text-cream-400'
                : 'bg-cream-100 border-glow/20 text-void-600'
            }`}
          >
            <span className="text-glow">~</span>
            <span className="mx-2 opacity-40">/</span>
            <span>andrew-van-ostrand</span>
            <span className="mx-2 opacity-40">$</span>
            <span className="text-glow">whoami</span>
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={`text-5xl sm:text-6xl md:text-8xl font-display font-black tracking-tight mb-6 glow-text ${
            isDark ? 'text-cream-50' : 'text-void-800'
          }`}
        >
          Andrew
          <br />
          <span className="text-glow">Van Ostrand</span>
        </motion.h1>

        {/* Typing subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={`font-mono text-base md:text-lg mb-10 h-7 ${isDark ? 'text-cream-400' : 'text-void-500'}`}
        >
          {'> '}{typed}<span className="terminal-cursor" />
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          <button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="group px-7 py-3 bg-glow text-void-950 font-display font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105"
          >
            View Projects
            <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className={`px-7 py-3 rounded-lg font-display font-semibold border transition-all duration-300 hover:scale-105 ${
              isDark
                ? 'border-glow/30 text-glow hover:bg-glow/10'
                : 'border-glow/40 text-glow-dim hover:bg-glow/10'
            }`}
          >
            Get in Touch
          </button>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center gap-5"
        >
          {[
            { href: 'https://github.com/arrowarcher1', icon: <FaGithub size={20} />, label: 'GitHub' },
            { href: 'https://linkedin.com/in/andrew-v-o/', icon: <FaLinkedin size={20} />, label: 'LinkedIn' },
            { href: 'https://leetcode.com/u/avanostrand', icon: <SiLeetcode size={20} />, label: 'LeetCode' },
            { href: 'mailto:andrew@andrewvo.dev', icon: <FaEnvelope size={20} />, label: 'Email' },
          ].map(({ href, icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={label}
              className={`p-3 rounded-full border transition-all duration-300 hover:scale-110 hover:border-glow/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] ${
                isDark
                  ? 'border-cream-400/10 text-cream-400 hover:text-glow'
                  : 'border-void-500/20 text-void-500 hover:text-glow'
              }`}
            >
              {icon}
            </a>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-glow/40"
          >
            <FaArrowDown size={16} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// --- About Section ---
const About = ({ isDark }) => (
  <Section id="about" className="py-24 md:py-32 px-6">
    <div className="max-w-6xl mx-auto">
      <SectionLabel number="01" label="About" isDark={isDark} />

      <div className="grid md:grid-cols-5 gap-12 md:gap-16">
        {/* Bio */}
        <div className="md:col-span-3 space-y-5">
          <p className={`text-lg leading-relaxed ${isDark ? 'text-cream-300' : 'text-void-600'}`}>
            I'm a student at <span className="text-glow font-medium">Lehigh University</span> (GPA: 3.71)
            pursuing a B.S. in Computer Science & Business. Currently building enterprise
            blockchain solutions at <span className="text-glow font-medium">Oracle</span> and researching
            compiler optimizations for next-gen memory architectures.
          </p>
          <p className={`text-lg leading-relaxed ${isDark ? 'text-cream-400' : 'text-void-500'}`}>
            From decentralized identity systems to real-time production platforms, I build
            full-stack solutions that ship. My work spans blockchain, ML/AI, compiler design,
            and systems engineering.
          </p>
        </div>

        {/* Info cards */}
        <div className="md:col-span-2 space-y-4">
          {[
            { label: 'Education', value: 'B.S. Computer Science & Business', sub: 'Lehigh University — GPA: 3.71' },
            { label: 'Graduation', value: 'December 2026' },
            { label: 'Current', value: 'Capstone SWE @ Oracle', sub: 'Blockchain Platform' },
            { label: 'Research', value: 'Compiler Optimization', sub: 'LLVM / NVM / RDMA' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-lg border transition-colors duration-500 ${
                isDark
                  ? 'bg-void-800/50 border-glow/5'
                  : 'bg-cream-100/80 border-glow/10'
              }`}
            >
              <span className="font-mono text-xs text-glow uppercase tracking-wider">{item.label}</span>
              <p className={`font-display font-semibold mt-1 ${isDark ? 'text-cream-100' : 'text-void-700'}`}>
                {item.value}
              </p>
              {item.sub && (
                <p className={`text-sm mt-0.5 ${isDark ? 'text-cream-400' : 'text-void-500'}`}>{item.sub}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </Section>
);

// --- Experience Section (git-log timeline) ---
const Experience = ({ isDark }) => (
  <Section id="experience" className="py-24 md:py-32 px-6">
    <div className="max-w-6xl mx-auto">
      <SectionLabel number="02" label="Experience" isDark={isDark} />

      <div className="relative">
        {/* Vertical timeline line */}
        <div
          className="absolute left-[19px] md:left-[19px] top-0 bottom-0 w-px"
          style={{
            background: isDark
              ? 'linear-gradient(180deg, rgba(16,185,129,0.4), rgba(16,185,129,0.05))'
              : 'linear-gradient(180deg, rgba(16,185,129,0.5), rgba(16,185,129,0.08))',
          }}
        />

        <div className="space-y-12">
          {EXPERIENCES.map((exp, i) => (
            <motion.div
              key={exp.company + exp.role}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative pl-12 md:pl-14"
            >
              {/* Timeline dot */}
              <div
                className="absolute left-[14px] top-1.5 w-[11px] h-[11px] rounded-full border-2 z-10"
                style={{
                  borderColor: exp.color,
                  background: isDark ? '#0a0a0f' : '#faf8f4',
                  boxShadow: `0 0 10px ${exp.color}40, 0 0 20px ${exp.color}20`,
                }}
              />

              {/* Card */}
              <div
                className={`rounded-xl border p-6 transition-all duration-300 hover:border-glow/20 ${
                  isDark
                    ? 'bg-void-800/40 border-glow/5'
                    : 'bg-cream-100/70 border-glow/10'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className={`text-lg font-display font-bold ${isDark ? 'text-cream-50' : 'text-void-800'}`}>
                      {exp.role}
                    </h3>
                    <p className={`font-display ${isDark ? 'text-cream-300' : 'text-void-600'}`}>
                      <span style={{ color: exp.color }} className="font-semibold">{exp.company}</span>
                      <span className="mx-2 opacity-30">·</span>
                      {exp.location}
                    </p>
                  </div>
                  <span className={`font-mono text-xs whitespace-nowrap px-3 py-1 rounded-md self-start ${
                    isDark ? 'bg-void-600/50 text-cream-400' : 'bg-cream-300/50 text-void-500'
                  }`}>
                    {exp.period}
                  </span>
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {exp.tech.map(t => (
                    <span
                      key={t}
                      className={`font-mono text-xs px-2 py-0.5 rounded-md ${
                        isDark ? 'bg-glow/5 text-glow/70' : 'bg-glow/10 text-glow-dim'
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Bullets */}
                <ul className="space-y-2">
                  {exp.bullets.map((b, j) => (
                    <li
                      key={j}
                      className={`flex items-start gap-3 text-sm leading-relaxed ${
                        isDark ? 'text-cream-300' : 'text-void-600'
                      }`}
                    >
                      <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full" style={{ background: exp.color }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </Section>
);

// --- Skills Section (terminal / package-manifest style) ---
const Skills = ({ isDark }) => (
  <Section id="skills" className="py-24 md:py-32 px-6">
    <div className="max-w-6xl mx-auto">
      <SectionLabel number="03" label="Skills" isDark={isDark} />

      {/* Terminal-style container */}
      <div
        className={`rounded-xl border overflow-hidden ${
          isDark ? 'bg-void-800/60 border-glow/10' : 'bg-cream-100/80 border-glow/15'
        }`}
      >
        {/* Terminal title bar */}
        <div className={`flex items-center gap-2 px-4 py-3 border-b ${
          isDark ? 'bg-void-700/50 border-glow/5' : 'bg-cream-200/50 border-glow/10'
        }`}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className={`font-mono text-xs ml-2 ${isDark ? 'text-cream-500' : 'text-void-500'}`}>
            ~/skills.config
          </span>
        </div>

        {/* Skills grid */}
        <div className="p-5 md:p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SKILL_CATEGORIES.map((cat, ci) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.08 }}
            >
              {/* Category label */}
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-xs text-glow/50">{'// '}</span>
                <span className="font-mono text-xs text-glow uppercase tracking-widest">{cat.label}</span>
              </div>
              {/* Skill items */}
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((skill, si) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: ci * 0.06 + si * 0.03 }}
                    whileHover={{ scale: 1.05, y: -1 }}
                    className={`font-mono text-xs px-2.5 py-1.5 rounded-md cursor-default border transition-all duration-200 ${
                      isDark
                        ? 'bg-void-600/40 border-glow/5 text-cream-300 hover:border-glow/30 hover:text-glow hover:bg-glow/5'
                        : 'bg-cream-200/60 border-glow/10 text-void-600 hover:border-glow/30 hover:text-glow-dim hover:bg-glow/10'
                    }`}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </Section>
);

// --- Project Card with 3D Tilt ---
const ProjectCard = ({ project, index, isDark, onSelect }) => {
  const cardRef = useRef(null);
  const { handleMouseMove, handleMouseLeave } = useTilt(cardRef);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelect(project)}
        className={`tilt-card relative rounded-xl overflow-hidden cursor-pointer border transition-all duration-500 group ${
          isDark
            ? 'bg-void-800/60 border-glow/5 hover:border-glow/20'
            : 'bg-cream-100/80 border-glow/10 hover:border-glow/30'
        }`}
        style={{ transition: 'transform 0.15s ease-out, border-color 0.5s, background 0.5s' }}
      >
        <div className="tilt-shine" />

        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="project-gradient absolute inset-0" />
          {/* Project number */}
          <span className="absolute top-4 right-4 font-mono text-xs px-2 py-1 rounded-md bg-black/30 text-white/60 backdrop-blur-sm">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3
              className={`text-xl font-display font-bold ${isDark ? 'text-cream-50' : 'text-void-800'}`}
            >
              {project.title}
            </h3>
            <div
              className="w-2 h-2 rounded-full mt-2 glow-dot flex-shrink-0"
              style={{ background: project.color }}
            />
          </div>
          <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-cream-400' : 'text-void-500'}`}>
            {project.shortDesc}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tech.slice(0, 4).map(t => (
              <span
                key={t}
                className={`font-mono text-xs px-2 py-0.5 rounded-md ${
                  isDark
                    ? 'bg-glow/5 text-glow/70'
                    : 'bg-glow/10 text-glow-dim'
                }`}
              >
                {t}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className={`font-mono text-xs px-2 py-0.5 rounded-md ${
                isDark ? 'bg-void-600 text-cream-500' : 'bg-cream-300 text-void-500'
              }`}>
                +{project.tech.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Project Modal ---
const ProjectModal = ({ project, isDark, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

    {/* Modal */}
    <motion.div
      initial={{ scale: 0.95, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.95, y: 20, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onClick={e => e.stopPropagation()}
      className={`relative max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-2xl border ${
        isDark
          ? 'bg-void-800 border-glow/10'
          : 'bg-cream-50 border-glow/20'
      }`}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
      >
        <FaTimes size={16} />
      </button>

      {/* Image header */}
      <div className="relative h-56 md:h-64 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full glow-dot" style={{ background: project.color }} />
            <span className="font-mono text-xs text-white/60 uppercase tracking-wider">Featured Project</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-white">{project.title}</h2>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-8 space-y-6">
        <p className={`leading-relaxed ${isDark ? 'text-cream-300' : 'text-void-600'}`}>
          {project.fullDesc}
        </p>

        {/* Tech */}
        <div>
          <h3 className="font-mono text-xs text-glow uppercase tracking-wider mb-3">Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {project.tech.map(t => (
              <span
                key={t}
                className={`font-mono text-xs px-3 py-1 rounded-md ${
                  isDark ? 'bg-glow/10 text-glow' : 'bg-glow/10 text-glow-dim'
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="font-mono text-xs text-glow uppercase tracking-wider mb-3">Achievements</h3>
          <ul className="space-y-2">
            {project.achievements.map((a, i) => (
              <li key={i} className={`flex items-start gap-3 text-sm ${isDark ? 'text-cream-300' : 'text-void-600'}`}>
                <span className="text-glow mt-1 flex-shrink-0">▸</span>
                {a}
              </li>
            ))}
          </ul>
        </div>

        {/* Link */}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-glow text-void-950 font-display font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            View Project <FaExternalLinkAlt size={12} />
          </a>
        )}
      </div>
    </motion.div>
  </motion.div>
);

// --- Projects Section ---
const Projects = ({ isDark }) => {
  const [selected, setSelected] = useState(null);

  return (
    <Section id="projects" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionLabel number="04" label="Projects" isDark={isDark} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              isDark={isDark}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <ProjectModal
            project={selected}
            isDark={isDark}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </Section>
  );
};

// --- Resume Section ---
const ResumeSection = ({ isDark }) => (
  <Section id="resume" className="py-24 md:py-32 px-6">
    <div className="max-w-4xl mx-auto">
      <SectionLabel number="05" label="Resume" isDark={isDark} />

      <div
        className={`rounded-xl border overflow-hidden ${
          isDark ? 'bg-void-800/50 border-glow/5' : 'bg-cream-100/60 border-glow/10'
        }`}
      >
        <div className={`p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b ${
          isDark ? 'border-glow/5' : 'border-glow/10'
        }`}>
          <div>
            <p className={`font-display ${isDark ? 'text-cream-200' : 'text-void-700'}`}>
              Preview my resume below or grab the PDF.
            </p>
          </div>
          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-glow text-void-950 font-display font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 whitespace-nowrap"
          >
            <FaDownload size={14} />
            Download PDF
          </a>
        </div>

        <div className="p-4">
          <iframe
            src="/resume.pdf"
            title="Resume"
            className="w-full resume-frame"
            style={{ height: '70vh' }}
          />
        </div>
      </div>
    </div>
  </Section>
);

// --- Contact Section ---
const Contact = ({ isDark }) => (
  <Section id="contact" className="py-24 md:py-32 px-6">
    <div className="max-w-4xl mx-auto">
      <SectionLabel number="06" label="Contact" isDark={isDark} />

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left — Message */}
        <div className="space-y-6">
          <p className={`text-lg leading-relaxed ${isDark ? 'text-cream-300' : 'text-void-600'}`}>
            I'm always open to discussing new projects, opportunities, or collaborations.
            Drop me a line — I'd love to hear from you.
          </p>

          <div className="space-y-4">
            {[
              { icon: <FaEnvelope />, label: 'Email', value: 'andrew@andrewvo.dev', href: 'mailto:andrew@andrewvo.dev' },
              { icon: <FaLinkedin />, label: 'LinkedIn', value: 'andrew-v-o', href: 'https://linkedin.com/in/andrew-v-o/' },
              { icon: <FaPhone />, label: 'Phone', value: '(818) 699-2337', href: 'tel:8186992337' },
              { icon: <FaMapMarkerAlt />, label: 'Location', value: 'Bethlehem, PA — Lehigh University' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className={`p-3 rounded-lg ${isDark ? 'bg-glow/10' : 'bg-glow/10'}`}>
                  <span className="text-glow">{item.icon}</span>
                </div>
                <div>
                  <span className="font-mono text-xs text-glow uppercase tracking-wider">{item.label}</span>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('mailto') || item.href.startsWith('tel') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className={`block font-display transition-colors hover:text-glow ${
                        isDark ? 'text-cream-200' : 'text-void-700'
                      }`}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className={`font-display ${isDark ? 'text-cream-200' : 'text-void-700'}`}>{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — Quick Links */}
        <div className="space-y-4">
          {[
            { icon: <FaGithub size={24} />, label: 'GitHub', desc: 'Explore my repositories', href: 'https://github.com/arrowarcher1' },
            { icon: <SiLeetcode size={24} />, label: 'LeetCode', desc: 'Problem solving profile', href: 'https://leetcode.com/u/avanostrand' },
            { icon: <FaLinkedin size={24} />, label: 'LinkedIn', desc: 'Professional network', href: 'https://linkedin.com/in/andrew-v-o/' },
          ].map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-4 p-5 rounded-xl border transition-all duration-300 hover:border-glow/30 hover:scale-[1.02] group ${
                isDark
                  ? 'bg-void-800/30 border-glow/5'
                  : 'bg-cream-100/60 border-glow/10'
              }`}
            >
              <div className={`transition-colors duration-300 group-hover:text-glow ${
                isDark ? 'text-cream-400' : 'text-void-500'
              }`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <span className={`font-display font-semibold block ${isDark ? 'text-cream-100' : 'text-void-700'}`}>
                  {item.label}
                </span>
                <span className={`text-sm ${isDark ? 'text-cream-400' : 'text-void-500'}`}>
                  {item.desc}
                </span>
              </div>
              <FaExternalLinkAlt className="text-glow/30 group-hover:text-glow transition-colors" size={12} />
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  </Section>
);

// --- Footer ---
const Footer = ({ isDark }) => (
  <footer className={`py-10 px-6 border-t transition-colors duration-500 ${
    isDark ? 'border-glow/5' : 'border-glow/10'
  }`}>
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="font-mono text-sm text-glow/60">
        {'<AVO /> '}
        <span className={isDark ? 'text-cream-500' : 'text-void-500'}>
          — Built with React, Tailwind & caffeine
        </span>
      </div>
      <div className="flex gap-4">
        {[
          { href: 'https://github.com/arrowarcher1', icon: <FaGithub size={16} /> },
          { href: 'https://linkedin.com/in/andrew-v-o/', icon: <FaLinkedin size={16} /> },
          { href: 'https://leetcode.com/u/avanostrand', icon: <SiLeetcode size={16} /> },
        ].map(({ href, icon }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors hover:text-glow ${isDark ? 'text-cream-500' : 'text-void-500'}`}
          >
            {icon}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

// ═══════════════════════════════════════
// APP
// ═══════════════════════════════════════

const App = () => {
  const isDark = true; // Always dark mode

  useEffect(() => {
    document.body.classList.remove('light');
    localStorage.setItem('theme', 'dark');
  }, []);

  return (
    <div className="noise scanline grid-bg">
      <FloatingParticles isDark={isDark} />
      <Navigation isDark={isDark} toggleTheme={() => {}} />

      <main>
        <Hero isDark={isDark} />
        <About isDark={isDark} />
        <Experience isDark={isDark} />
        <Skills isDark={isDark} />
        <Projects isDark={isDark} />
        <ResumeSection isDark={isDark} />
        <Contact isDark={isDark} />
      </main>

      <Footer isDark={isDark} />
    </div>
  );
};

export default App;
