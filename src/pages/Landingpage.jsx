import React, { useEffect, useState, useRef } from 'react';
import { Camera, Users, TrendingUp, PlusCircle, ArrowRight, ChevronDown, Menu, X, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import agricultureImage from '../assets/agriculture.jpg';
import artisanImage from '../assets/artisant.png';
import educationImage from '../assets/education.jpeg';
import aboutImage from '../assets/aboutus.jpg';


const EcoCommunity = () => {
    const [isVisible, setIsVisible] = useState({
        impact: false,
        services: false,
        projects: false,
        about: false,
    });
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const impactRef = useRef(null);
    const servicesRef = useRef(null);
    const projectsRef = useRef(null);
    const aboutRef = useRef(null);
    const testimonialsRef = useRef(null);
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('projects');

    // Handle scroll events
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
            
            const sections = [
                { id: 'impact', ref: impactRef },
                { id: 'services', ref: servicesRef },
                { id: 'projects', ref: projectsRef },
                { id: 'about', ref: aboutRef }
            ];
            
            sections.forEach(section => {
                if (section.ref.current) {
                    const rect = section.ref.current.getBoundingClientRect();
                    if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0) {
                        setIsVisible(prev => ({ ...prev, [section.id]: true }));
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial(prev => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const socialLinks = [
        { icon: <Facebook size={20} />, url: '#', name: 'Facebook' },
        { icon: <Twitter size={20} />, url: '#', name: 'Twitter' },
        { icon: <Linkedin size={20} />, url: '#', name: 'LinkedIn' },
        { icon: <Instagram size={20} />, url: '#', name: 'Instagram' }
    ];

    const quickLinks = [
        { name: 'Accueil', href: '#accueil' },
        { name: 'Services', href: '#services' },
        { name: 'Projets', href: '#projects' },
        { name: 'À Propos', href: '#about' },
        { name: 'Impact', href: '#impact' },
        { name: 'Contact', href: '#contact' }
    ];

    const testimonials = [
        {
            name: "Marie Nguemo",
            role: "Entrepreneure Sociale",
            quote: "Grâce à EcoCommunity, j'ai pu développer mon projet d'agriculture communautaire et créer un impact réel dans ma région. La plateforme m'a mis en relation avec des investisseurs qui croient en ma vision.",
            image: "/api/placeholder/80/80"
        },
        {
            name: "Jean Tamba",
            role: "Investisseur Impact",
            quote: "La plateforme m'a permis de découvrir des projets innovants et d'investir dans l'avenir du Cameroun. J'ai pu facilement identifier des entrepreneurs passionnés avec des idées prometteuses.",
            image: "/api/placeholder/80/80"
        },
        {
            name: "Sarah Ekotto",
            role: "Mentor",
            quote: "Accompagner les entrepreneurs sur EcoCommunity est une expérience enrichissante qui montre le potentiel de notre jeunesse. Les outils de suivi d'impact me permettent de mesurer les progrès réalisés.",
            image: "/api/placeholder/80/80"
        }
    ];

    const impactStats = [
        { id: 'projectCount', title: 'Projets Lancés', target: 150, icon: <PlusCircle className="text-emerald-600" size={24} /> },
        { id: 'communityCount', title: 'Communautés Impactées', target: 75, icon: <Users className="text-emerald-600" size={24} /> },
        { id: 'fundingCount', title: 'Millions FCFA Mobilisés', target: 500, icon: <TrendingUp className="text-emerald-600" size={24} /> },
        { id: 'jobCount', title: 'Emplois Créés', target: 1200, icon: <Camera className="text-emerald-600" size={24} /> }
    ];

    const featuredProjects = [
        {
            title: "Coopérative Agricole Durable",
            description: "Initiative communautaire pour développer l'agriculture durable dans la région de l'Ouest, avec des techniques innovantes et respectueuses de l'environnement.",
            image: agricultureImage,
            amount: "2.5M FCFA",
            category: "Agriculture",
            progress: 65
        },
        {
            title: "Artisanat Local Digital",
            description: "Plateforme de vente en ligne pour les artisans traditionnels du Cameroun, mettant en valeur le savoir-faire local et créant des opportunités d'exportation.",
            image: artisanImage,
            amount: "1.8M FCFA",
            category: "Artisanat",
            progress: 45
        },
        {
            title: "Éducation Numérique Rurale",
            description: "Programme d'accès à l'éducation numérique dans les zones rurales, réduisant la fracture numérique et offrant des opportunités d'apprentissage aux jeunes défavorisés.",
            image: educationImage,
            amount: "3.2M FCFA",
            category: "Éducation",
            progress: 80
        }
    ];

    const services = [
        {
            title: "Création de Projets",
            description: "Publiez vos projets communautaires, partagez votre vision et trouvez le soutien nécessaire pour réussir.",
            icon: <Camera className="text-emerald-700" size={24} />,
            features: [
                "Création de page de projet personnalisée",
                "Outils de planification financière",
                "Support technique continu",
                "Visibilité auprès des investisseurs"
            ]
        },
        {
            title: "Mise en Réseau",
            description: "Connectez-vous avec des investisseurs, experts et partenaires potentiels pour développer votre projet.",
            icon: <Users className="text-emerald-700" size={24} />,
            features: [
                "Événements de networking",
                "Mentorat personnalisé",
                "Connexion avec des investisseurs",
                "Partage de compétences"
            ]
        },
        {
            title: "Suivi d'Impact",
            description: "Mesurez et visualisez l'impact de vos projets sur votre communauté grâce à nos outils analytiques.",
            icon: <TrendingUp className="text-emerald-700" size={24} />,
            features: [
                "Tableaux de bord personnalisés",
                "Rapports d'impact détaillés",
                "Métriques de performance",
                "Analyse des retombées sociales"
            ]
        }
    ];

    const startCounters = () => {
        if (isVisible.impact) {
            impactStats.forEach(({ id, target }) => animateCounter(id, target));
        }
    };

    useEffect(() => {
        if (isVisible.impact) {
            startCounters();
        }
    }, [isVisible.impact]);

    const animateCounter = (elementId, target, duration = 2000) => {
        const element = document.getElementById(elementId);
        if (!element) return;

        let current = 0;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleProjectsClick = () => {
        setModalType('projects');
        setModalOpen(true);
      };
      
      const handleServiceClick = () => {
        setModalType('services');
        setModalOpen(true);
      };

    return (
        
        <div className="relative overflow-x-hidden font-sans">
            {/* Navigation */}
            <header className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-emerald-800 shadow-lg py-2' : 'bg-transparent py-4'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <a href="/" className="flex items-center">
                                <span className={`text-2xl font-bold ${scrollY > 50 ? 'text-white' : 'text-white'}`}>
                                    Eco<span className="text-yellow-400">Community</span>
                                </span>
                            </a>
                        </div>
                        
                        {/* Mobile menu button */}
                        <div className="flex md:hidden">
                            <button 
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-white p-2"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <div className="flex items-center space-x-6">
                                {quickLinks.slice(0, 5).map((item, index) => (
                                    <a 
                                        key={index} 
                                        href={item.href} 
                                        className={`text-sm font-medium hover:text-yellow-400 transition-colors 
                                        ${scrollY > 50 ? 'text-white' : 'text-white'}`}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleLogin}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-white hover:bg-emerald-50 transition-colors duration-300"
                                >
                                    Connexion
                                </button>
                                <button
                                    onClick={handleRegister}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 transition-colors duration-300"
                                >
                                    S'inscrire
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        className="fixed inset-0 z-40 bg-emerald-900 flex flex-col pt-20 px-4"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex flex-col space-y-4 mt-4">
                            {quickLinks.map((item, index) => (
                                <a 
                                    key={index} 
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-white text-lg font-medium py-2 border-b border-emerald-800"
                                >
                                    {item.name}
                                </a>
                            ))}
                            
                            <div className="flex flex-col space-y-3 mt-6">
                                <button
                                    onClick={handleLogin}
                                    className="w-full py-3 text-center text-emerald-700 bg-white rounded-md font-medium"
                                >
                                    Connexion
                                </button>
                                <button
                                    onClick={handleRegister}
                                    className="w-full py-3 text-center text-white bg-yellow-500 rounded-md font-medium"
                                >
                                    S'inscrire
                                </button>
                            </div>
                            
                            <div className="flex justify-center space-x-4 mt-8">
                                {socialLinks.map((social, index) => (
                                    <a 
                                        key={index} 
                                        href={social.url} 
                                        className="text-white hover:text-yellow-400 transition-colors"
                                        aria-label={social.name}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main>
                {/* Hero Section */}
                <section id="accueil" className="relative bg-gradient-to-br from-emerald-900 to-emerald-700 pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-[url('pattern.svg')] bg-repeat opacity-20"></div>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
                            <motion.div 
                                className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:px-0 lg:text-left lg:flex lg:items-center"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="lg:py-24">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.5 }}
                                        className="inline-flex items-center px-4 py-1 rounded-full bg-emerald-800 bg-opacity-40 text-white text-sm mb-4"
                                    >
                                        <span className="h-2 w-2 rounded-full bg-yellow-400 mr-2"></span>
                                        Première plateforme d'entrepreneuriat communautaire
                                    </motion.div>
                                    <motion.h1 
                                        className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                    >
                                        <span className="block">Développez Votre</span>
                                        <span className="block text-yellow-400">Impact Communautaire</span>
                                    </motion.h1>
                                    <motion.p 
                                        className="mt-3 text-base text-gray-100 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6, duration: 0.5 }}
                                    >
                                        Connectez-vous avec des investisseurs, experts et partenaires pour développer vos projets d'entrepreneuriat communautaire au Cameroun.
                                    </motion.p>
                                    <motion.div 
                                        className="mt-10 sm:mt-12"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8, duration: 0.5 }}
                                    >
                                        <div className="sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                                            <button 
                                                className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                                onClick={handleRegister}
                                            >
                                                Démarrer un Projet
                                                <ArrowRight size={16} className="ml-2" />
                                            </button>
                                            <a 
                                            href="#" 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleServiceClick();
                                            }}
                                            className="inline-flex items-center text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                                            >
                                            En savoir plus <ChevronRight size={16} className="ml-1" />
                                            </a>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                            <motion.div 
                                className="mt-12 -mb-16 sm:-mb-48 lg:m-0 relative"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                                    <div className="w-full lg:h-full relative">
                                        <img 
                                            src={aboutImage} 
                                            alt="Community Impact" 
                                            className="rounded-2xl shadow-2xl object-cover h-full w-full max-h-96 lg:max-h-none"
                                        />
                                        <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 max-w-xs hidden md:block">
                                            <div className="flex items-center mb-2">
                                                <div className="h-3 w-3 rounded-full bg-emerald-500 mr-2"></div>
                                                <span className="text-sm font-medium text-gray-600">Projets en Croissance</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-bold text-emerald-700">+120%</span>
                                                <span className="text-sm text-gray-500">depuis 2023</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                    
                    {/* Hero section bottom wave */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
                            <path fill="white" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                        </svg>
                    </div>
                </section>

                {/* Featured Projects Section */}
                <section id="projects" ref={projectsRef} className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div 
                            className="lg:text-center mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isVisible.projects ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-2">PROJETS</span>
                            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                Découvrez Nos Projets Vedettes
                            </h2>
                            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                                Des initiatives locales qui transforment les communautés camerounaises.
                            </p>
                        </motion.div>
                        
                        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {featuredProjects.map((project, index) => (
                                <motion.div
                                    key={index}
                                    className="group relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={isVisible.projects ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                                >
                                    <div className="relative w-full h-64 bg-white rounded-t-xl overflow-hidden">
                                        <div className="absolute top-4 left-4 z-10 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                                            {project.category}
                                        </div>
                                        <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                                        <p className="text-gray-600">{project.description}</p>
                                        
                                        <div className="mt-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-500">Progrès</span>
                                                <span className="text-sm font-medium text-emerald-600">{project.progress}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-emerald-500 rounded-full"
                                                    style={{ width: `${project.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6 flex justify-between items-center">
                                            <span className="text-emerald-600 font-bold">{project.amount} collectés</span>
                                            <a href="#" className="flex items-center text-yellow-500 font-medium hover:text-yellow-600 transition-colors">
                                                En savoir plus <ArrowRight size={16} className="ml-1" />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        
                        <div className="mt-12 text-center">
                        <a 
                            href="#" 
                            onClick={(e) => {
                                e.preventDefault();
                                handleProjectsClick();
                            }}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-300"
                            >
                            Voir Tous les Projets <ArrowRight size={18} className="ml-2" />
                            </a>

                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" ref={servicesRef} className="py-20 bg-gray-50 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 bg-[url('pattern.svg')] bg-repeat"></div>
                    </div>
                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div 
                            className="lg:text-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isVisible.services ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-2">SERVICES</span>
                            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                Comment Nous Pouvons Vous Aider
                            </h2>
                            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                                Des outils et services conçus pour faire réussir votre projet communautaire.
                            </p>
                        </motion.div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {services.map((service, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative z-10"
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={isVisible.services ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                                >
                                    <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{service.title}</h3>
                                    <p className="text-gray-600 mb-6">{service.description}</p>
                                    <ul className="space-y-3 mb-8">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <span className="text-emerald-500 mr-2 mt-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                                <span className="text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <a href="/savoir" className="inline-flex items-center text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
                                        En savoir plus <ChevronRight size={16} className="ml-1" />
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Impact Section */}
                <section id="impact" ref={impactRef} className="py-20 bg-emerald-800 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[url('pattern.svg')] bg-repeat"></div>
                    </div>
                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div 
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isVisible.impact ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-block px-3 py-1 rounded-full bg-white bg-opacity-20 text-white text-sm font-medium mb-2">IMPACT</span>
                            <h2 className="text-3xl font-bold text-white sm:text-4xl">
                                Notre Impact au Cameroun
                            </h2>
                            <p className="mt-4 max-w-2xl mx-auto text-xl text-emerald-100">
                                Des chiffres qui témoignent de notre engagement pour le développement communautaire.
                            </p>
                        </motion.div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {impactStats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-2xl text-center hover:bg-opacity-20 transition-all duration-300"
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={isVisible.impact ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                                >
                                    <div className="flex justify-center mb-4">
                                        {stat.icon}
                                    </div>
                                    <h3 className="text-5xl font-bold mb-2">
                                        <span id={stat.id}>0</span>+
                                    </h3>
                                    <p className="text-emerald-100">{stat.title}</p>
                                </motion.div>
                            ))}
                        </div>
                        
                        <div className="mt-16 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={isVisible.impact ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.6 }}
                                >
                                    <h3 className="text-2xl font-bold mb-4">Notre Approche Unique</h3>
                                    <p className="text-emerald-100 mb-6">
                                        EcoCommunity combine financement participatif, mentorat expert et outils de suivi d'impact pour maximiser les retombées sociales et économiques des projets.
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <span className="text-yellow-400 mr-3 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                            <span className="text-emerald-50">Accompagnement personnalisé à chaque étape du projet</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-yellow-400 mr-3 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                            <span className="text-emerald-50">Transparence totale dans la gestion des fonds</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-yellow-400 mr-3 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                            <span className="text-emerald-50">Réseau de professionnels engagés pour le développement local</span>
                                        </li>
                                    </ul>
                                </motion.div>
                                <motion.div
                                    className="relative"
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={isVisible.impact ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.6 }}
                                >
                                    <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                                        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                                            <div className="w-full h-64 bg-emerald-900 bg-opacity-50 flex items-center justify-center">
                                                <span className="text-white text-lg">Vidéo de présentation de notre impact</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-6 -right-6 bg-yellow-400 text-emerald-900 px-4 py-2 rounded-lg shadow-lg font-bold">
                                        +75% de réussite
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-2">TÉMOIGNAGES</span>
                            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                Ce Que Disent Nos Utilisateurs
                            </h2>
                        </div>
                        
                        <div className="max-w-5xl mx-auto relative">
                            <div className="relative h-96 overflow-hidden rounded-2xl shadow-xl">
                                <AnimatePresence mode="wait">
                                    {testimonials.map((testimonial, index) => (
                                        activeTestimonial === index && (
                                            <motion.div
                                                key={index}
                                                className="absolute inset-0 bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 md:p-12 flex flex-col justify-center"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <div className="flex flex-col md:flex-row items-center">
                                                    <div className="md:w-1/3 mb-8 md:mb-0 flex justify-center">
                                                        <div className="w-32 h-32 rounded-full bg-white bg-opacity-20 border-2 border-white border-opacity-30 overflow-hidden">
                                                            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white">
                                                                <Users size={48} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="md:w-2/3 md:pl-12">
                                                        <blockquote className="text-white text-lg md:text-xl italic mb-6">
                                                            "{testimonial.quote}"
                                                        </blockquote>
                                                        <div className="text-white font-medium">
                                                            <p className="text-xl">{testimonial.name}</p>
                                                            <p className="text-emerald-200">{testimonial.role}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    ))}
                                </AnimatePresence>
                            </div>
                            
                            <div className="flex justify-center mt-8 space-x-2">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveTestimonial(index)}
                                        className={`w-3 h-3 rounded-full ${activeTestimonial === index ? 'bg-emerald-600' : 'bg-gray-300'}`}
                                        aria-label={`Afficher le témoignage ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" ref={aboutRef} className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, x: -30 }}
                                animate={isVisible.about ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="rounded-2xl overflow-hidden shadow-xl">
                                    <img src={aboutImage} alt="À propos d'EcoCommunity" className="w-full h-auto" />
                                </div>
                                <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-lg w-3/4">
                                    <div className="flex items-center mb-2">
                                        <div className="h-3 w-3 rounded-full bg-yellow-400 mr-2"></div>
                                        <span className="text-sm font-medium text-gray-600">Notre Équipe</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900">Experts en Développement Communautaire</h4>
                                    <p className="text-sm text-gray-500 mt-2">15 professionnels engagés pour votre réussite</p>
                                </div>
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={isVisible.about ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6 }}
                            >
                                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">À PROPOS</span>
                                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
                                    Notre Mission
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    EcoCommunity est née de la volonté de créer un écosystème dynamique pour l'entrepreneuriat communautaire au Cameroun. Nous croyons que chaque initiative locale a le potentiel de transformer des vies et des communautés entières.
                                </p>
                                <p className="text-gray-600 mb-8">
                                    Notre plateforme connecte les porteurs de projets avec les ressources, les compétences et le financement nécessaires pour concrétiser leurs idées et maximiser leur impact social.
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                    <div className="flex items-start">
                                        <div className="bg-emerald-100 p-3 rounded-lg mr-4">
                                            <Users className="text-emerald-700" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">Communauté</h4>
                                            <p className="text-gray-600 text-sm">Plus de 5000 membres actifs</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="bg-emerald-100 p-3 rounded-lg mr-4">
                                            <TrendingUp className="text-emerald-700" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">Croissance</h4>
                                            <p className="text-gray-600 text-sm">120% de croissance annuelle</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={handleRegister}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-300"
                                >
                                    Rejoignez Notre Communauté <ArrowRight size={18} className="ml-2" />
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="max-w-3xl mx-auto"
                        >
                            <h2 className="text-3xl font-bold sm:text-4xl mb-6">
                                Prêt à Lancer Votre Projet Communautaire ?
                            </h2>
                            <p className="text-xl text-emerald-100 mb-8">
                                Rejoignez des centaines d'entrepreneurs sociaux et transformez votre communauté dès aujourd'hui.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button
                                    onClick={handleRegister}
                                    className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-emerald-900 font-bold rounded-lg transition-colors duration-300"
                                >
                                    Commencer Maintenant
                                </button>
                                <button className="px-8 py-4 bg-transparent hover:bg-white hover:bg-opacity-10 border-2 border-white font-bold rounded-lg transition-colors duration-300">
                                    Contactez Notre Équipe
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-2">CONTACT</span>
                            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                Restons en Contact
                            </h2>
                            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                                Nous sommes là pour répondre à vos questions et vous accompagner.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un Message</h3>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                                            <input
                                                type="text"
                                                id="first-name"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                                placeholder="Votre prénom"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                            <input
                                                type="text"
                                                id="last-name"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                                placeholder="Votre nom"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                            placeholder="votre@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                                        <select
                                            id="subject"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                        >
                                            <option value="">Sélectionnez un sujet</option>
                                            <option value="support">Support technique</option>
                                            <option value="project">Projet communautaire</option>
                                            <option value="partnership">Partenariat</option>
                                            <option value="other">Autre</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                        <textarea
                                            id="message"
                                            rows="4"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                            placeholder="Votre message..."
                                        ></textarea>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors duration-300"
                                        >
                                            Envoyer le Message
                                        </button>
                                    </div>
                                </form>
                            </div>
                            
                            <div>
                                <div className="bg-emerald-600 text-white rounded-2xl p-8 md:p-12 h-full">
                                    <h3 className="text-2xl font-bold mb-6">Nos Coordonnées</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-start">
                                            <div className="bg-emerald-700 p-3 rounded-lg mr-4">
                                                <Mail className="text-white" size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold mb-1">Email</h4>
                                                <p className="text-emerald-100">contact@ecocommunity.cm</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="bg-emerald-700 p-3 rounded-lg mr-4">
                                                <Phone className="text-white" size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold mb-1">Téléphone</h4>
                                                <p className="text-emerald-100">+237 6XX XXX XXX</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="bg-emerald-700 p-3 rounded-lg mr-4">
                                                <MapPin className="text-white" size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold mb-1">Adresse</h4>
                                                <p className="text-emerald-100">Rue 1.234, Quartier Bastos</p>
                                                <p className="text-emerald-100">Yaoundé, Cameroun</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-12">
                                        <h4 className="font-bold mb-4">Suivez-nous</h4>
                                        <div className="flex space-x-4">
                                            {socialLinks.map((social, index) => (
                                                <a
                                                    key={index}
                                                    href={social.url}
                                                    className="bg-emerald-700 hover:bg-emerald-800 p-3 rounded-lg transition-colors duration-300"
                                                    aria-label={social.name}
                                                >
                                                    {social.icon}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            

            {/* Footer */}
            <footer className="bg-gray-900 text-white pt-16 pb-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">
                                Eco<span className="text-yellow-400">Community</span>
                            </h3>
                            <p className="text-gray-400 mb-6">
                                La plateforme de référence pour l'entrepreneuriat communautaire au Cameroun.
                            </p>
                            <div className="flex space-x-4">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        className="text-gray-400 hover:text-white transition-colors duration-300"
                                        aria-label={social.name}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Liens Rapides</h4>
                            <ul className="space-y-3">
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link.href}
                                            className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"
                                        >
                                            <ChevronRight size={14} className="mr-1 text-yellow-400" />
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Services</h4>
                            <ul className="space-y-3">
                                {services.map((service, index) => (
                                    <li key={index}>
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"
                                        >
                                            <ChevronRight size={14} className="mr-1 text-yellow-400" />
                                            {service.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
                            <p className="text-gray-400 mb-4">
                                Abonnez-vous pour recevoir nos dernières actualités et opportunités.
                            </p>
                            <form className="flex">
                                <input
                                    type="email"
                                    placeholder="Votre email"
                                    className="px-4 py-2 rounded-l-lg w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                                <button
                                    type="submit"
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-r-lg transition-colors duration-300"
                                >
                                    OK
                                </button>
                            </form>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-800 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-400 text-sm mb-4 md:mb-0">
                                © {new Date().getFullYear()} EcoCommunity. Tous droits réservés.
                            </p>
                            <div className="flex space-x-6">
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                                    Politique de confidentialité
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                                    Conditions d'utilisation
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                                    FAQ
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            
            
        </div>
        
    );
};

export default EcoCommunity;