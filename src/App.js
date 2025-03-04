import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SiLeetcode } from 'react-icons/si';
import { FaHome, FaUser, FaProjectDiagram, FaEnvelope, FaGithub, FaFileAlt, FaLinkedin, FaTimes, FaDownload, FaExpand, FaCompress, FaSun, FaMoon } from 'react-icons/fa';

const NavLink = ({ to, children, icon }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link to={to} className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white' : 'text-text hover:bg-button-hover'}`}>
            {icon}
            <span className="ml-2">{children}</span>
        </Link>
    );
};

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="bg-navbar-bg shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-600">Andrew Van Ostrand</h1>
                <div className="flex items-center">
                    <ThemeToggle />
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden ml-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
                <nav className={`absolute md:relative top-16 left-0 right-0 bg-navbar-bg md:top-0 md:flex ${isOpen ? 'block' : 'hidden'} md:block`}>
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

const ThemeToggle = () => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="flex items-center">
            <span className="mr-2 text-yellow-500">
                <FaSun />
            </span>
            <div 
                className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-gray-400"
                onClick={toggleTheme}
            >
                <div className={`absolute left-1 top-1 w-4 h-4 transition duration-200 ease-in-out transform ${theme === 'dark' ? 'translate-x-6 bg-blue-600' : 'bg-white'} rounded-full`}></div>
            </div>
            <span className="ml-2 text-blue-600">
                <FaMoon />
            </span>
        </div>
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
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-card-bg border-b border-border-color">
                <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center text-center mb-8"
                        >
                            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
                                <span className="block">Hello, I'm</span>
                                <span className="block text-5xl md:text-7xl mt-2 text-primary">Andrew Van Ostrand</span>
                            </h1>
                            
                            <div className="h-1 w-20 bg-primary my-6"></div>
                            
                            <p className="text-xl md:text-2xl text-text max-w-2xl">
                                Aspiring Computer Scientist & Business Professional
                            </p>
                        </motion.div>
                        
                        <motion.div
                            className="flex flex-wrap justify-center gap-4 mt-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <Link to="/projects" className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200 shadow-md flex items-center">
                                <FaProjectDiagram className="mr-2" />
                                View My Projects
                            </Link>
                            <Link to="/resume" className="px-8 py-3 bg-secondary-bg text-primary border border-border-color font-semibold rounded-lg hover:bg-button-hover transition-colors duration-200 flex items-center">
                                <FaFileAlt className="mr-2" />
                                My Resume
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
            
            {/* About Section Preview */}
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <motion.div 
                            className="md:w-1/2"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl font-bold mb-6 text-primary">Who I Am</h2>
                            <p className="text-text mb-6">
                                I'm a dedicated student at Lehigh University, passionate about leveraging technology to solve real-world problems. My academic journey combines computer science with business acumen, allowing me to approach challenges with a holistic perspective.
                            </p>
                            <div className="mb-6">
                                <h4 className="text-lg font-medium mb-3 text-primary">Academic Focus</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-blue-600 mr-3"></div>
                                        <span className="text-text font-medium">Bachelor of Science, Computer Science & Business</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-blue-600 mr-3"></div>
                                        <span className="text-text font-medium">Minor in Earth and Environmental Science</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-blue-600 mr-3"></div>
                                        <span className="text-text font-medium">Lehigh University, Expected May 2027</span>
                                    </div>
                                </div>
                            </div>
                            <Link to="/about" className="inline-block mt-2 text-primary font-semibold hover:underline flex items-center">
                                Learn more about me 
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </motion.div>
                        
                        <motion.div 
                            className="md:w-1/2"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <Link to="/projects" className="block bg-secondary-bg p-6 rounded-lg border border-border-color hover:shadow-md transition-all duration-200">
                                    <FaProjectDiagram className="text-primary text-2xl mb-3" />
                                    <h3 className="text-xl font-semibold mb-2 text-primary">Projects</h3>
                                    <p className="text-text">Explore my portfolio of innovative projects spanning various technologies.</p>
                                </Link>
                                <Link to="/resume" className="block bg-secondary-bg p-6 rounded-lg border border-border-color hover:shadow-md transition-all duration-200">
                                    <FaFileAlt className="text-primary text-2xl mb-3" />
                                    <h3 className="text-xl font-semibold mb-2 text-primary">Resume</h3>
                                    <p className="text-text">View my qualifications, skills, and academic history.</p>
                                </Link>
                                <a href="https://github.com/arrowarcher1" target="_blank" rel="noopener noreferrer" className="block bg-secondary-bg p-6 rounded-lg border border-border-color hover:shadow-md transition-all duration-200">
                                    <FaGithub className="text-primary text-2xl mb-3" />
                                    <h3 className="text-xl font-semibold mb-2 text-primary">GitHub</h3>
                                    <p className="text-text">Check out my code repositories and contributions.</p>
                                </a>
                                <Link to="/contact" className="block bg-secondary-bg p-6 rounded-lg border border-border-color hover:shadow-md transition-all duration-200">
                                    <FaEnvelope className="text-primary text-2xl mb-3" />
                                    <h3 className="text-xl font-semibold mb-2 text-primary">Contact</h3>
                                    <p className="text-text">Reach out to connect, collaborate, or discuss opportunities.</p>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            
            {/* Feature Project */}
            <div className="bg-secondary-bg py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl font-bold mb-2 text-primary">Featured Project</h2>
                            <p className="text-text">A highlight from my portfolio</p>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="bg-card-bg rounded-lg overflow-hidden border border-border-color shadow-lg"
                        >
                            <div className="md:flex">
                                <div className="md:w-1/2 h-64 md:h-auto">
                                    <img 
                                        src="/images/truth-trail.jpg" 
                                        alt="Truth Trail" 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/600x400?text=Truth+Trail';
                                        }}
                                    />
                                </div>
                                <div className="md:w-1/2 p-8">
                                    <h3 className="text-2xl font-bold mb-3 text-primary">Truth Trail</h3>
                                    <p className="text-text mb-4">
                                        A blockchain-based solution that ensures evidence integrity in the justice system with tamper-proof chain of custody verification.
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="px-2 py-1 bg-blue-600/10 text-primary rounded-lg text-sm">Blockchain</span>
                                        <span className="px-2 py-1 bg-blue-600/10 text-primary rounded-lg text-sm">Google Cloud</span>
                                        <span className="px-2 py-1 bg-blue-600/10 text-primary rounded-lg text-sm">Vertex AI</span>
                                    </div>
                                    <Link 
                                        to="/projects" 
                                        className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        View Project Details
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            
            {/* Connect Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.h2 
                        className="text-3xl font-bold mb-6 text-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        Let's Connect
                    </motion.h2>
                    <motion.p 
                        className="text-text mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        Feel free to reach out to me on any of these platforms
                    </motion.p>
                    
                    <motion.div 
                        className="flex justify-center gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <a 
                            href="https://github.com/arrowarcher1" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-4 bg-card-bg rounded-full text-text hover:text-primary hover:shadow-md transition-all duration-200 border border-border-color"
                        >
                            <FaGithub size={24} />
                        </a>
                        <a 
                            href="https://linkedin.com/in/andrew-v-o/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-4 bg-card-bg rounded-full text-text hover:text-primary hover:shadow-md transition-all duration-200 border border-border-color"
                        >
                            <FaLinkedin size={24} />
                        </a>
                        <a 
                            href="https://leetcode.com/u/avanostrand" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-4 bg-card-bg rounded-full text-text hover:text-primary hover:shadow-md transition-all duration-200 border border-border-color"
                        >
                            <SiLeetcode size={24} />
                        </a>
                        <Link 
                            to="/contact"
                            className="p-4 bg-card-bg rounded-full text-text hover:text-primary hover:shadow-md transition-all duration-200 border border-border-color"
                        >
                            <FaEnvelope size={24} />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    </PageTransition>
);

const About = () => (
    <PageTransition>
        <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold mb-8 text-primary">About Me</h2>
            
            <div className="bg-card-bg shadow-lg rounded-lg border border-border-color overflow-hidden">
                <div className="p-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="text-2xl font-bold mb-4 text-primary">Background</h3>
                        <p className="text-text mb-6">
                            I'm Andrew Van Ostrand, a student at Lehigh University pursuing a Bachelor of Science in Computer Science & Business with a minor in Environmental Science. Expected to graduate in May 2027, I'm focused on combining technical expertise with business knowledge to develop innovative solutions for real-world challenges.
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-8 mb-6">
                            <div>
                                <h4 className="text-xl font-semibold mb-3 text-primary">Education</h4>
                                <ul className="space-y-2 text-text">
                                    <li className="flex items-start">
                                        <span className="text-primary mr-2">•</span>
                                        <span>B.S. Computer Science & Business</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-primary mr-2">•</span>
                                        <span>Minor in Environmental Science</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-primary mr-2">•</span>
                                        <span>Lehigh University, Expected May 2027</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="text-xl font-semibold mb-3 text-primary">Technical Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-secondary-bg border border-border-color text-text rounded-lg text-sm">Java</span>
                                    <span className="px-3 py-1 bg-secondary-bg border border-border-color text-text rounded-lg text-sm">Python</span>
                                    <span className="px-3 py-1 bg-secondary-bg border border-border-color text-text rounded-lg text-sm">C</span>
                                    <span className="px-3 py-1 bg-secondary-bg border border-border-color text-text rounded-lg text-sm">C++</span>
                                    <span className="px-3 py-1 bg-secondary-bg border border-border-color text-text rounded-lg text-sm">Git</span>
                                    
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="text-xl font-semibold mb-3 text-primary">Professional Interests</h4>
                            <p className="text-text">
                                My professional focus lies at the intersection of technology, business, and environmental sustainability. I'm particularly interested in leveraging computational methods to address complex business challenges while promoting sustainable practices. Through project work and hackathons, I continue to build my skills in these areas while exploring innovative applications of computer science.
                            </p>
                        </div>
                        
                        <div className="flex gap-4 mt-6 justify-start">
                            <a href="https://github.com/arrowarcher1" target="_blank" rel="noopener noreferrer" 
                               className="text-text hover:text-primary transition-colors">
                                <FaGithub size={24} />
                            </a>
                            <a href="https://linkedin.com/in/andrew-v-o/" target="_blank" rel="noopener noreferrer"
                               className="text-text hover:text-primary transition-colors">
                                <FaLinkedin size={24} />
                            </a>
                            <a href="https://leetcode.com/u/avanostrand" target="_blank" rel="noopener noreferrer"
                               className="text-text hover:text-primary transition-colors">
                                <SiLeetcode size={24} />
                            </a>
                        </div>
                    </motion.div>
                </div>
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
                <h2 className="text-3xl font-bold mb-8 text-primary">Resume</h2>
                <div className={`bg-card-bg shadow-lg rounded-lg p-6 border border-border-color ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-lg">
                            Preview my resume below or download the full PDF.
                        </p>
                        <div className="flex space-x-2">
                            <a
                                href="/resume.pdf"
                                download
                                className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-80 transition-colors duration-200 flex items-center"
                            >
                                <FaDownload className="mr-2" />
                                Download PDF
                            </a>
                            <button
                                onClick={toggleFullScreen}
                                className="bg-secondary-bg text-text px-4 py-2 rounded-lg border border-border-color hover:opacity-80 transition-colors duration-200 flex items-center"
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
                            className="w-full h-full border-2 border-border-color rounded-lg"
                        />
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
};

const ProjectCard = ({ title, description, image, onClick }) => (
    <motion.div
        className="bg-card-bg rounded-lg shadow-lg cursor-pointer border border-border-color overflow-hidden h-full flex flex-col"
        whileHover={{ 
            scale: 1.03,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
        transition={{ duration: 0.3 }}
        onClick={onClick}
    >
        <div className="relative overflow-hidden h-48">
            <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"
                whileHover={{ opacity: 0.8 }}
            />
            <motion.img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
            />
            <motion.h3 
                className="text-2xl font-bold absolute bottom-4 left-4 z-20 text-white"
                initial={{ opacity: 0.9 }}
                whileHover={{ opacity: 1 }}
            >
                {title}
            </motion.h3>
        </div>
        <div className="p-6 flex-grow">
            <p className="text-text">{description}</p>
        </div>
    </motion.div>
);

const ProjectModal = ({ project, onClose }) => (
    <motion.div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <motion.div
            className="bg-card-bg rounded-lg max-w-3xl w-full relative border border-border-color overflow-hidden"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 p-2 rounded-full z-30 transition-colors"
            >
                <FaTimes size={20} />
            </button>
            
            <div className="relative h-56 md:h-72">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 p-8 z-20">
                    <h2 className="text-3xl font-bold text-white">{project.title}</h2>
                </div>
            </div>
            
            <div className="p-8">
                <p className="text-text mb-6">{project.fullDescription}</p>
                
                <h3 className="text-xl font-semibold mb-2 text-primary">Technologies Used</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, index) => (
                        <span key={index} className="px-3 py-1 bg-button-hover text-text rounded-full text-sm">
                            {tech}
                        </span>
                    ))}
                </div>
                
                <h3 className="text-xl font-semibold mb-2 text-primary">Key Achievements</h3>
                <ul className="list-disc list-inside text-text mb-6">
                    {project.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                    ))}
                </ul>

                <div className="flex flex-wrap gap-4">
                    {project.devpostLink && (
                        <a
                            href={project.devpostLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            View on DevPost
                        </a>
                    )}

                    {project.link && (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Visit Website
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    </motion.div>
);

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState(null);

    const projects = [
        {
            title: "Truth Trail",
            description: "A blockchain-based solution that ensures evidence integrity in the justice system with tamper-proof chain of custody verification.",
            fullDescription: "Truth Trail eliminates uncertainty and bias in evidence handling by creating a transparent, tamper-proof chain of custody using blockchain technology. It securely stores evidence in Google Cloud Buckets, uses Gemini Flash to analyze and categorize crime scene images, and assigns unique hashes stored on the SKALE blockchain for permanent preservation and verification.",
            technologies: ["Blockchain (SKALE)", "Google Cloud Platform", "Gemini Flash", "Vertex AI", "TypeScript", "Node.js", "Solidity", "Hardhat", "Prisma"],
            achievements: [
                "Implemented dual-layer verification system using both database and blockchain checks",
                "Created a public verification interface accessible to all stakeholders",
                "Integrated Google Vertex AI for intelligent image categorization",
                "Built a secure admin dashboard with search functionality by case ID",
                "Submitted to Lehigh Hack for Justice hackathon"
            ],
            devpostLink: "https://devpost.com/software/truth-trail",
            image: "/images/truth-trail.jpg"
        },
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
            link: "https://andrewvo.dev",
            image: "/images/portfolio.jpg"
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
            devpostLink: "https://devpost.com/software/profpair",
            image: "/images/profpair.jpg"
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
            ],
            image: "/images/lcrs.jpg"
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
            devpostLink: "https://devpost.com/software/asl-for-the-community",
            image: "/images/asl.jpg"
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
                            image={project.image}
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
            <h2 className="text-3xl font-bold mb-8 text-primary">Contact Me</h2>
            
            <motion.div 
                className="bg-card-bg shadow-lg rounded-lg border border-border-color overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="p-6 border-b border-border-color bg-secondary-bg">
                    <h3 className="text-xl font-semibold text-primary">Let's Connect</h3>
                    <p className="text-text mt-1">Feel free to reach out to me through any of these channels.</p>
                </div>
                
                <div className="p-6">
                    <div className="space-y-6">
                        <div className="flex items-center">
                            <div className="bg-blue-600/10 p-4 rounded-lg mr-4">
                                <FaEnvelope className="text-primary text-xl" />
                            </div>
                            <div>
                                <h4 className="font-medium text-primary mb-1">Email</h4>
                                <a href="mailto:andrew@andrewvo.dev" className="text-text hover:text-primary transition-colors">
                                    andrew@andrewvo.dev
                                </a>
                            </div>
                        </div>
                        
                        <div className="flex items-center">
                            <div className="bg-blue-600/10 p-4 rounded-lg mr-4">
                                <FaLinkedin className="text-primary text-xl" />
                            </div>
                            <div>
                                <h4 className="font-medium text-primary mb-1">LinkedIn</h4>
                                <a 
                                    href="https://linkedin.com/in/andrew-v-o/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-text hover:text-primary transition-colors"
                                >
                                    linkedin.com/in/andrew-v-o/
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="bg-blue-600/10 p-4 rounded-lg mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1H4v8a1 1 0 001 1h10a1 1 0 001-1V6zM4 4a1 1 0 100 2h12a1 1 0 100-2H4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium text-primary mb-1">Phone</h4>
                                <a href="tel:8186992337" className="text-text hover:text-primary transition-colors">
                                    (818) 699-2337
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-5 bg-secondary-bg border border-border-color rounded-lg">
                        <h4 className="font-medium text-primary mb-2">Currently Located</h4>
                        <p className="text-text">Bethlehem, Pennsylvania | Lehigh University</p>
                    </div>
                </div>
            </motion.div>
            
            <div className="mt-8 text-center">
                <p className="text-text">I'm always open to discussing new projects, opportunities, or collaborations.</p>
            </div>
        </div>
    </PageTransition>
);

const App = () => {
    return (
        <Router>
            <div className="App">
                <Header />
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