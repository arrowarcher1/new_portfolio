import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SiLeetcode } from 'react-icons/si';
import { FaHome, FaUser, FaProjectDiagram, FaEnvelope, FaGithub, FaFileAlt, FaLinkedin, FaTimes, FaDownload, FaExpand, FaCompress } from 'react-icons/fa';

const NavLink = ({ to, children, icon }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link to={to} className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-100'}`}>
            {icon}
            <span className="ml-2">{children}</span>
        </Link>
    );
};

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-600">Andrew Van Ostrand</h1>
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <nav className={`absolute md:relative top-16 left-0 right-0 bg-white md:top-0 md:flex ${isOpen ? 'block' : 'hidden'} md:block`}>
                    <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 p-4 md:p-0">
                        <li><NavLink to="/" icon={<FaHome className="inline" />}>Home</NavLink></li>
                        <li><NavLink to="/about" icon={<FaUser className="inline" />}>About</NavLink></li>
                        <li><NavLink to="/projects" icon={<FaProjectDiagram className="inline" />}>Projects</NavLink></li>
                        <li><NavLink to="/resume" icon={<FaFileAlt className="inline" />}>Resume</NavLink></li>
                        <li><NavLink to="/contact" icon={<FaEnvelope className="inline" />}>Contact</NavLink></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

const PageTransition = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
    >
        {children}
    </motion.div>
);

const Home = () => (
    <PageTransition>
        <div className="container mx-auto px-4 py-16 text-center">
            <motion.h1
                className="text-5xl font-bold mb-4 text-blue-600"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                Andrew Van Ostrand
            </motion.h1>
            <motion.p
                className="text-xl text-gray-600 mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                Aspiring Computer Scientist & Business Professional
            </motion.p>
            <motion.div
                className="max-w-2xl mx-auto mb-12"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                <p className="text-lg text-gray-700 mb-4">
                    Welcome to my portfolio! I'm a dedicated student at Lehigh University, passionate about leveraging technology to solve real-world problems. Explore my projects and journey in the world of computer science and business.
                </p>
                <Link to="/projects" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    View My Projects
                </Link>
            </motion.div>
            <motion.div
                className="flex justify-center space-x-4"
                initial={{y: 20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{delay: 0.6, duration: 0.5}}
            >
                <a href="https://github.com/arrowarcher1"
                   className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    <FaGithub size={24}/>
                </a>
                <a href="https://linkedin.com/in/andrew-v-o/"
                   className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    <FaLinkedin size={24}/>
                </a>
                <a href="https://leetcode.com/u/avanostrand" target="_blank" rel="noopener noreferrer"
                   className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    <SiLeetcode size={24}/>
                </a>
            </motion.div>
        </div>
    </PageTransition>
);

const About = () => (
    <PageTransition>
        <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold mb-8 text-blue-600">About Me</h2>
            <div className="bg-white shadow-lg rounded-lg p-6">
                <p className="text-lg text-gray-700 mb-4">I'm Andrew Van Ostrand, a passionate and driven student at Lehigh University, pursuing a Bachelor of Science in Computer Science & Business with a minor in Environmental Science. Expected to graduate in May 2027, I'm on a mission to blend my technical skills with business acumen to create innovative solutions for a sustainable future.</p>

                <h3 className="text-xl font-semibold mb-2 text-blue-600">Education</h3>
                <ul className="list-disc list-inside mb-4 text-gray-700">
                    <li>Bachelor of Science: Computer Science & Business</li>
                    <li>Minor: Environmental Science</li>
                    <li>Expected Graduation: May 2027</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 text-blue-600">Skills</h3>
                <ul className="list-disc list-inside mb-4 text-gray-700">
                    <li>Programming Languages: Java, JavaScript, HTML, CSS, Python</li>
                    <li>Languages: Fluent in English and Spanish</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 text-blue-600">Interests</h3>
                <p className="text-gray-700">
                    Beyond academics, I'm passionate about leveraging technology for environmental sustainability, participating in hackathons, and exploring the intersection of business and technology. In my free time, I enjoy contributing to open-source projects and mentoring aspiring programmers.
                </p>
            </div>
        </div>
    </PageTransition>
);

const Resume = () => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    return (
        <PageTransition>
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold mb-8 text-blue-600">Resume</h2>
                <div className={`bg-white shadow-lg rounded-lg p-6 ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-lg text-gray-700">
                            Preview my resume below or download the full PDF.
                        </p>
                        <div className="flex space-x-2">
                            <a
                                href="/resume.pdf"
                                download
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                            >
                                <FaDownload className="mr-2" />
                                Download PDF
                            </a>
                            <button
                                onClick={toggleFullScreen}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center"
                            >
                                {isFullScreen ? <FaCompress className="mr-2" /> : <FaExpand className="mr-2" />}
                                {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
                            </button>
                        </div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`relative ${isFullScreen ? 'h-full' : 'h-[calc(100vh-300px)]'}`}
                    >
                        <iframe
                            src="/resume.pdf"
                            title="Andrew Van Ostrand Resume"
                            className="w-full h-full border-2 border-gray-300 rounded-lg"
                        />
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
};

const ProjectCard = ({ title, description, onClick }) => (
    <motion.div
        className="bg-white p-6 rounded-lg shadow-lg cursor-pointer"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
    >
        <h3 className="text-2xl font-bold mb-2 text-blue-600">{title}</h3>
        <p className="text-gray-700">{description}</p>
    </motion.div>
);

const ProjectModal = ({ project, onClose }) => (
    <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <motion.div
            className="bg-white rounded-lg p-8 max-w-2xl w-full relative"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
                <FaTimes size={24} />
            </button>
            <h2 className="text-3xl font-bold mb-4 text-blue-600">{project.title}</h2>
            <p className="text-gray-700 mb-4">{project.fullDescription}</p>
            <h3 className="text-xl font-semibold mb-2 text-blue-600">Technologies Used</h3>
            <ul className="list-disc list-inside mb-4 text-gray-700">
                {project.technologies.map((tech, index) => (
                    <li key={index}>{tech}</li>
                ))}
            </ul>
            <h3 className="text-xl font-semibold mb-2 text-blue-600">Key Achievements</h3>
            <ul className="list-disc list-inside text-gray-700">
                {project.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                ))}
            </ul>

            {project.devpostLink && (
                <a
                    href={project.devpostLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                    View on DevPost
                </a>
            )}

            {project.link && (
                <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 ml-4"
                >
                    Visit Website
                </a>
            )}
        </motion.div>
    </motion.div>
);

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState(null);

    const projects = [
        {
            title: "Personal Portfolio Website",
            description: "Developed a responsive and modern portfolio website using React.js and Tailwind CSS.",
            fullDescription: "Created a sleek, responsive portfolio website to showcase my projects and skills. This website serves as a dynamic representation of my work and abilities in web development.",
            technologies: ["React.js", "Tailwind CSS", "Node.js", "Vercel", "JavaScript", "Git"],
            achievements: [
                "Implemented responsive design for optimal viewing across all devices",
                "Utilized Tailwind CSS for efficient and consistent styling",
                "Deployed on Vercel for continuous integration and seamless updates",
                "Integrated dynamic content management for easy project updates"
            ],
            link: "https://andrewvo.dev"
        },
        {
            title: "ProfPair",
            description: "Built an AI-powered professor-student matching system using AWS services to help students find compatible professors.",
            fullDescription: "Developed an innovative web platform that uses AI to predict student-professor compatibility. The system analyzes professor ratings and student preferences using AWS Comprehend for sentiment analysis and SageMaker for compatibility predictions, helping students make informed decisions about course selection.",
            technologies: ["AWS Comprehend", "Amazon SageMaker", "Python", "HTML", "AWS S3"],
            achievements: [
                "Successfully integrated multiple AWS services into a cohesive web platform",
                "Developed custom AI model for professor-student compatibility matching",
                "Created comprehensive scoring algorithm incorporating multiple rating factors",
                "Implemented sentiment analysis for professor review evaluation"
            ],
            devpostLink: "https://devpost.com/software/profpair"
        },
        {
            title: "Lehigh Hacks for Health - LCRS",
            description: "Developed a predictive model for lung cancer risk assessment using Google Cloud's Vertex AI and AutoML.",
            fullDescription: "Led a team in developing an innovative lung cancer risk assessment tool during the Lehigh Hacks for Health hackathon. Our solution aimed to provide accessible pre-screening for individuals in lower-income communities, potentially improving early detection rates.",
            technologies: ["Google Cloud Vertex AI", "AutoML", "Python", "Google Cloud Compute"],
            achievements: [
                "Awarded 'Best First-Year Solution'",
                "Created a cost-effective pre-screening process",
                "Utilized advanced machine learning techniques for accurate risk assessments"
            ]
        },
        {
            title: "ASL for the Community",
            description: "Created an image recognition model using Amazon SageMaker to translate ASL signs into text and speech.",
            fullDescription: "Developed an innovative solution to bridge communication gaps between the deaf and hearing communities. Our team created an image recognition model capable of translating American Sign Language (ASL) signs into text and speech in real-time.",
            technologies: ["Amazon SageMaker", "Python", "Amazon Polly", "Turtle Graphics"],
            achievements: [
                "Received the 'Best AWS Integration' award",
                "Implemented real-time ASL translation to text and speech",
                "Designed a user-friendly interface for easy interaction"
            ],
            devpostLink: "https://devpost.com/software/asl-for-the-community"
        }
    ];

    return (
        <PageTransition>
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold mb-8 text-blue-600">Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={index}
                            title={project.title}
                            description={project.description}
                            onClick={() => setSelectedProject(project)}
                        />
                    ))}
                </div>
            </div>
            <AnimatePresence>
                {selectedProject && (
                    <ProjectModal
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

const Contact = () => (
    <PageTransition>
        <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold mb-8 text-blue-600">Contact Me</h2>
            <div className="bg-white shadow-lg rounded-lg p-6">
                <p className="text-lg text-gray-700 mb-4">Email: andrew@andrewvo.dev</p>
                <p className="text-lg text-gray-700 mb-4">Phone: (818) 699-2337</p>
                <p className="text-lg text-gray-700">
                    LinkedIn: <a href="https://linkedin.com/in/andrew-v-o/" className="text-blue-500 hover:underline">linkedin.com/in/andrew-v-o/</a>
                </p>
            </div>
        </div>
    </PageTransition>
);

const App = () => {
    const [theme, setTheme] = useState(() => {
        // Check localStorage first, then system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        // Update data-theme attribute and localStorage when theme changes
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Header />
                <button 
                    onClick={toggleTheme}
                    className="theme-toggle"
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/resume" element={<Resume />} />
                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </AnimatePresence>
            </div>
        </Router>
    );
};

export default App;