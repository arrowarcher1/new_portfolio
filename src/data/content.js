// All site content. The 3D scene and HTML overlay both read from here.

export const LINKS = {
  github: 'https://github.com/arrowarcher1',
  linkedin: 'https://linkedin.com/in/andrew-v-o/',
  leetcode: 'https://leetcode.com/u/avanostrand',
  email: 'andrew@andrewvo.dev',
  resume: '/resume.pdf',
  site: 'https://andrewvo.dev',
}

export const FEATURED_PROJECTS = [
  {
    id: 'converge',
    title: 'Converge',
    tagline: 'Live AI negotiation — two agents, hidden reservations, on-chain settlement',
    description:
      'Real-time negotiation prototype where two Anthropic-powered agents exchange offers with private reservation prices. Streams both agent reasoning and public transcripts via SSE, detects deal/walk-away/deadlock terminal states, and computes the Zone of Possible Agreement with surplus analysis.',
    tech: ['TypeScript', 'Node.js', 'Hono', 'Anthropic Agent SDK', 'Viem', 'SSE', 'Zod'],
    achievements: [
      'Real-time SSE streaming of private agent thoughts and public transcripts',
      'Deterministic orchestrator with stagnation detection and 16-turn hard limit',
      'ZOPA / surplus visualization computed at conclusion',
      'Optional on-chain settlement on Base Sepolia with demo fallback',
    ],
    link: 'https://github.com/arrowarcher1/Converge',
    linkLabel: 'View on GitHub',
    image: '/images/converge-convo.png',
    color: '#ec4899',
  },
  {
    id: 'truth-trail',
    title: 'Truth Trail',
    tagline: 'Blockchain-based forensic evidence management',
    description:
      'Blockchain evidence management system providing immutable audit trails for forensic investigations — solving chain-of-custody vulnerabilities in traditional evidence tracking with a dual-layer SKALE + GCP AI architecture.',
    tech: ['Solidity', 'SKALE', 'GCP', 'Gemini AI', 'Vertex AI', 'React'],
    achievements: [
      'Dual-layer architecture: SKALE blockchain + GCP-hosted AI classification',
      'Reduced evidence verification time by 60% via smart contract automation',
      'Automated evidence categorization using Gemini / Vertex AI',
      'Cryptographic proof of authenticity for legal compliance',
    ],
    link: 'https://devpost.com/software/truth-trail',
    linkLabel: 'View on Devpost',
    image: '/images/truth-trail.jpg',
    color: '#34d399',
  },
  {
    id: 'profpair',
    title: 'ProfPair',
    tagline: 'AI professor–student matching — Best Use of AI Award',
    description:
      'Won Best Use of AI Award at a university hackathon for an intelligent professor–student matching platform analyzing 10,000+ course reviews to connect students with compatible professors across two universities.',
    tech: ['AWS Comprehend', 'SageMaker', 'S3', 'Flask', 'Python'],
    achievements: [
      'Best Use of AI Award winner',
      'End-to-end ML pipeline on SageMaker with Comprehend sentiment analysis',
      'Scalable Flask API with S3-backed storage for 8,500+ students',
      'Multi-dimensional review processing for personalized recommendations',
    ],
    link: 'https://devpost.com/software/profpair',
    linkLabel: 'View on Devpost',
    image: '/images/profpair.jpg',
    color: '#22d3ee',
  },
]

export const ARCHIPELAGO_PROJECTS = [
  {
    id: 'lcrs',
    title: 'LCRS',
    tagline: 'ML lung cancer risk assessment — Best First-Year Solution',
    tech: ['Vertex AI', 'AutoML', 'Python'],
    link: null,
    color: '#fbbf24',
  },
  {
    id: 'asl',
    title: 'ASL for the Community',
    tagline: 'Real-time sign language translation — Best AWS Integration',
    tech: ['SageMaker', 'Polly', 'Python'],
    link: 'https://devpost.com/software/asl-for-the-community',
    color: '#8b5cf6',
  },
  {
    id: 'portfolio',
    title: 'This Portfolio',
    tagline: 'The world you are floating through right now',
    tech: ['Three.js', 'React Three Fiber', 'Vite'],
    link: 'https://andrewvo.dev',
    color: '#fb7185',
  },
]

export const EXPERIENCES = [
  {
    role: 'Capstone Software Engineer',
    company: 'Oracle',
    period: 'Jan 2026 — Present',
    tech: ['Go', 'Solidity', 'TypeScript', 'Docker', 'Kubernetes'],
    bullets: [
      'Implementing authorization capabilities chaincode in Go for Oracle Blockchain Platform — spec research, system design, and core operations for credential delegation and verification',
      'Building and deploying chaincode features: query functions, standardized response handling, input validation',
      'Developing a reusable cryptographic encoding package and porting chaincode to Solidity for EVM-compatible deployment',
    ],
    color: '#fbbf24',
  },
  {
    role: 'Compiler Research Intern',
    company: 'Lehigh University',
    period: 'May 2025 — Present',
    tech: ['LLVM', 'C++', 'RDMA', 'NVM'],
    bullets: [
      'Developed Serenity compiler using LLVM-based optimizations for NVM and RDMA — 7× throughput over SSD, 60% storage cost reduction',
      'Designed developer-friendly API abstractions reducing RDMA implementation complexity from weeks to hours',
    ],
    color: '#8b5cf6',
  },
  {
    role: 'Software Engineer Intern',
    company: 'Vomar Products',
    period: 'Dec 2025 — Jan 2026',
    tech: ['Node.js', 'React', 'SQL Server', 'Socket.io'],
    bullets: [
      'Architected a full-stack production tracking platform for 50+ employees — 75% faster job lookups with real-time WebSocket updates across 166+ concurrent jobs',
      'Engineered automated ERP integration syncing JobBOSS data every 5 minutes via RESTful API',
      'Deployed role-based JWT auth, eliminating 15+ hrs/week of version-conflict rework',
    ],
    color: '#22d3ee',
  },
]

export const SKILL_CATEGORIES = [
  { label: 'Languages', items: ['JavaScript/TypeScript', 'Python', 'Java', 'C/C++', 'SQL', 'Solidity', 'Go'] },
  { label: 'Frontend', items: ['React', 'Three.js', 'HTML/CSS', 'Socket.io', 'Framer Motion'] },
  { label: 'Backend', items: ['Node.js', 'Express', 'Flask', 'JWT Auth', 'WebSocket'] },
  { label: 'Cloud & Data', items: ['AWS (S3, EC2, Lambda, SageMaker)', 'GCP (Vertex AI, Compute)', 'Docker', 'Kubernetes', 'Oracle DB'] },
  { label: 'Dev Tools', items: ['Git', 'Linux/Unix', 'Postman', 'LLVM', 'Maven', 'JUnit'] },
  { label: 'Specializations', items: ['Full-Stack Dev', 'ML / AI', 'System Design', 'Compiler Optimization', 'Blockchain', 'Real-Time Systems'] },
]

// The journey: one entry per scroll "page", in order.
export const STOPS = [
  { id: 'hero', label: 'Arrival' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'converge', label: 'Converge' },
  { id: 'truth-trail', label: 'Truth Trail' },
  { id: 'profpair', label: 'ProfPair' },
  { id: 'archipelago', label: 'More Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

export const PAGES = STOPS.length
