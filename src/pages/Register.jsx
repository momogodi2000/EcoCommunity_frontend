import React, { useState, useEffect } from "react";
import { registerUser } from '../Services/register.js';
import {
  Eye, EyeOff, Users, Building2, Rocket, Shield, AlertCircle, Check,
  Mail, Phone, Lock, User, Link, Calendar, ArrowRight, CheckCircle,
  X, ChevronDown, ArrowLeft, MapPin, Heart, Globe, PenTool
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Alert from "../components/ui/alert.jsx";

const Register = () => {
    const [formData, setFormData] = useState({
        // Common fields
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "entrepreneur",
        terms: false,

        // Individual fields
        firstName: "",
        lastName: "",

        // Organization fields
        organizationName: "",
        registrationNumber: "",
        foundedYear: "",
        missionStatement: "",
        websiteUrl: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [step, setStep] = useState(1);
    const [animate, setAnimate] = useState(false);

    // Trigger animation on mount
    useEffect(() => {
        setAnimate(true);
    }, []);

    const features = [
        {
            icon: <Users className="w-6 h-6 text-emerald-700" />,
            title: "Réseau Professionnel",
            description: "Connectez-vous avec des entrepreneurs et mentors passionnés qui partagent vos ambitions"
        },
        {
            icon: <Building2 className="w-6 h-6 text-emerald-700" />,
            title: "Ressources Exclusives",
            description: "Accédez à des formations personnalisées et des opportunités de financement adaptées"
        },
        {
            icon: <Rocket className="w-6 h-6 text-emerald-700" />,
            title: "Innovation Locale",
            description: "Contribuez activement au développement économique durable du Cameroun"
        },
        {
            icon: <Shield className="w-6 h-6 text-emerald-700" />,
            title: "Support Personnalisé",
            description: "Bénéficiez d'un accompagnement sur mesure pour développer votre projet"
        },
        {
            icon: <MapPin className="w-6 h-6 text-emerald-700" />,
            title: "Communauté Locale",
            description: "Intégrez un réseau de proximité pour collaborer avec d'autres acteurs locaux"
        },
        {
            icon: <Heart className="w-6 h-6 text-emerald-700" />,
            title: "Impact Social",
            description: "Participez à des initiatives qui transforment positivement la communauté"
        }
    ];

    const testimonials = [
        {
            name: "Marie Ngono",
            role: "Entrepreneure",
            content: "EcoCommunity m'a permis de transformer mon idée en entreprise viable en seulement 6 mois grâce aux mentors et aux formations."
        },
        {
            name: "Jean-Paul Mbarga",
            role: "Investisseur",
            content: "La plateforme offre une visibilité inégalée sur les projets innovants et facilite les connexions avec des entrepreneurs prometteurs."
        },
        {
            name: "Association Cameroun Vert",
            role: "ONG",
            content: "Nous avons pu étendre notre impact et trouver des partenaires engagés grâce à l'écosystème d'EcoCommunity."
        }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateStep = (currentStep) => {
        const newErrors = {};
        const isMentor = formData.role === "ONG-Association";

        if (currentStep === 1) {
            if (!formData.email.trim()) {
                newErrors.email = "L'email est requis";
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = "Email invalide";
            }

            if (!formData.phone.trim()) {
                newErrors.phone = "Le numéro de téléphone est requis";
            } else if (!/^[0-9]{9}$/.test(formData.phone.replace(/\s/g, ""))) {
                newErrors.phone = "Numéro de téléphone invalide (9 chiffres requis)";
            }
        }

        if (currentStep === 2) {
            if (!formData.password) {
                newErrors.password = "Le mot de passe est requis";
            } else if (formData.password.length < 8) {
                newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
            }
        }

        if (currentStep === 3) {
            if (isMentor) {
                if (!formData.organizationName.trim()) {
                    newErrors.organizationName = "Le nom de l'organisation est requis";
                }
                if (!formData.registrationNumber.trim()) {
                    newErrors.registrationNumber = "Le numéro d'enregistrement est requis";
                }
                if (!formData.foundedYear) {
                    newErrors.foundedYear = "L'année de création est requise";
                } else if (formData.foundedYear < 1900 || formData.foundedYear > new Date().getFullYear()) {
                    newErrors.foundedYear = "Année invalide";
                }
            } else {
                if (!formData.firstName.trim()) {
                    newErrors.firstName = "Le prénom est requis";
                }
                if (!formData.lastName.trim()) {
                    newErrors.lastName = "Le nom est requis";
                }
            }
        }

        if (currentStep === 4) {
            if (!formData.terms) {
                newErrors.terms = "Vous devez accepter les conditions d'utilisation";
            }
        }

        return newErrors;
    };

    const nextStep = () => {
        const newErrors = validateStep(step);
        if (Object.keys(newErrors).length === 0) {
            setStep(prev => prev + 1);
        } else {
            setErrors(newErrors);
        }
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
    };

    const validateForm = () => {
        // Combine all step validations
        let allErrors = {};
        for (let i = 1; i <= 4; i++) {
            const stepErrors = validateStep(i);
            allErrors = { ...allErrors, ...stepErrors };
        }
        return allErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            setSubmitStatus(null);

            try {
                const response = await registerUser(formData);
                setSubmitStatus("success");
                // Show success for a moment before redirecting
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);

            } catch (error) {
                setSubmitStatus("error");
                setErrors({
                    submit: error.message || "Une erreur est survenue. Veuillez réessayer plus tard."
                });
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setErrors(newErrors);
            // Find the first step with errors and go to it
            for (let i = 1; i <= 4; i++) {
                const stepErrors = validateStep(i);
                if (Object.keys(stepErrors).length > 0) {
                    setStep(i);
                    break;
                }
            }
        }
    };

    const isMentor = formData.role === "ONG-Association";

    // Progress calculation
    const progress = (step / 4) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
            {/* Navigation */}
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <a href="/" className="flex items-center">
                                <span className="text-emerald-600 text-2xl font-bold">Eco</span>
                                <span className="text-emerald-800 text-2xl font-bold">Community</span>
                                <Globe className="ml-2 w-5 h-5 text-emerald-600" />
                            </a>
                        </div>
                        <div className="hidden md:flex space-x-8">
                            <a href="/about" className="text-gray-600 hover:text-emerald-600 transition-colors duration-200">À propos</a>
                            <a href="/services" className="text-gray-600 hover:text-emerald-600 transition-colors duration-200">Services</a>
                            <a href="/contact" className="text-gray-600 hover:text-emerald-600 transition-colors duration-200">Contact</a>
                            <a href="/blog" className="text-gray-600 hover:text-emerald-600 transition-colors duration-200">Blog</a>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <a href="/login" className="text-emerald-600 hover:text-emerald-800 font-medium transition-colors duration-200">Connexion</a>
                            <a href="/register" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200">Inscription</a>
                        </div>
                        <div className="md:hidden">
                            <button className="text-gray-500 hover:text-emerald-600 focus:outline-none">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8"
            >
                <div className="flex flex-col md:flex-row gap-8 justify-center items-center mb-8">
                    <motion.div 
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="max-w-2xl"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Commencez votre voyage entrepreneurial</h1>
                        <p className="text-lg text-gray-600 mb-4">
                            Rejoignez la communauté croissante d'entrepreneurs et d'innovateurs au Cameroun. 
                            Ensemble, construisons un avenir durable et prospère.
                        </p>
                        <div className="flex items-center space-x-2 text-emerald-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Plus de 5000 membres actifs</span>
                        </div>
                    </motion.div>
                    <motion.div 
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="w-full md:w-1/3"
                    >
                        <img 
                            src="/api/placeholder/500/350" 
                            alt="Entrepreneurs collaborant" 
                            className="rounded-lg shadow-xl"
                        />
                    </motion.div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Left Section - Registration Form */}
                        <div className="p-8 lg:p-12">
                            <div className="max-w-md mx-auto">
                                <div className="flex items-center mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900">Créer un compte</h2>
                                    <div className="ml-auto flex space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div 
                                                key={i} 
                                                className={`w-3 h-3 rounded-full ${step >= i ? 'bg-emerald-600' : 'bg-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="relative mb-6">
                                    <div className="overflow-hidden h-2 text-xs flex rounded bg-emerald-100">
                                        <motion.div 
                                            initial={{ width: "0%" }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.3 }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-600"
                                        />
                                    </div>
                                </div>

                                {submitStatus === "success" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Alert
                                            type="success"
                                            message="Votre compte a été créé avec succès!"
                                            description="Vous allez être redirigé vers la page de connexion."
                                            onClose={() => setSubmitStatus(null)}
                                        />
                                    </motion.div>
                                )}

                                {submitStatus === "error" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Alert
                                            type="error"
                                            message="Erreur lors de la création du compte"
                                            description={errors.submit}
                                            onClose={() => setSubmitStatus(null)}
                                        />
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <AnimatePresence mode="wait">
                                        {step === 1 && (
                                            <motion.div
                                                key="step1"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3 }}
                                                className="space-y-6"
                                            >
                                                <div className="mb-6">
                                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Informations de base</h3>
                                                    <p className="text-gray-500">Commençons par vos informations principales</p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Je suis un(e)
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            name="role"
                                                            value={formData.role}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 appearance-none pr-10"
                                                        >
                                                            <option value="entrepreneur">Entrepreneur</option>
                                                            <option value="investor">Investisseur</option>
                                                            <option value="ONG-Association">Association / ONG</option>
                                                        </select>
                                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Email
                                                    </label>
                                                    <div className="relative">
                                                        <Mail
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                                            placeholder="votreemail@exemple.com"
                                                        />
                                                        {errors.email && (
                                                            <motion.p 
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="mt-1 text-sm text-red-600 flex items-center"
                                                            >
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                {errors.email}
                                                            </motion.p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Téléphone
                                                    </label>
                                                    <div className="relative">
                                                        <Phone
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                                            placeholder="6XXXXXXXX"
                                                        />
                                                        {errors.phone && (
                                                            <motion.p 
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="mt-1 text-sm text-red-600 flex items-center"
                                                            >
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                {errors.phone}
                                                            </motion.p>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {step === 2 && (
                                            <motion.div
                                                key="step2"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3 }}
                                                className="space-y-6"
                                            >
                                                <div className="mb-6">
                                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Sécurité</h3>
                                                    <p className="text-gray-500">Définissez un mot de passe sécurisé</p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Mot de passe
                                                    </label>
                                                    <div className="relative">
                                                        <Lock
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            name="password"
                                                            value={formData.password}
                                                            onChange={handleChange}
                                                            className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                                            placeholder="8 caractères minimum"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                        >
                                                            {showPassword ? <EyeOff className="w-5 h-5"/> :
                                                                <Eye className="w-5 h-5"/>}
                                                        </button>
                                                    </div>
                                                    {errors.password && (
                                                        <motion.p 
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="mt-1 text-sm text-red-600 flex items-center"
                                                        >
                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                            {errors.password}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Confirmer le mot de passe
                                                    </label>
                                                    <div className="relative">
                                                        <Lock  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                                        <input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            name="confirmPassword"
                                                            value={formData.confirmPassword}
                                                            onChange={handleChange}
                                                            className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                        >
                                                            {showConfirmPassword ? <EyeOff className="w-5 h-5"/> :
                                                                <Eye className="w-5 h-5"/>}
                                                        </button>
                                                    </div>
                                                    {errors.confirmPassword && (
                                                        <motion.p 
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="mt-1 text-sm text-red-600 flex items-center"
                                                        >
                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                            {errors.confirmPassword}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                    <h4 className="text-sm font-semibold text-blue-800 mb-2">Conseils pour un mot de passe fort :</h4>
                                                    <ul className="text-sm text-blue-700 space-y-1">
                                                        <li className="flex items-center">
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Au moins 8 caractères
                                                        </li>
                                                        <li className="flex items-center">
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Mélangez lettres, chiffres et symboles
                                                        </li>
                                                        <li className="flex items-center">
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Évitez les informations personnelles évidentes
                                                        </li>
                                                    </ul>
                                                </div>
                                            </motion.div>
                                        )}

                                        {step === 3 && (
                                            <motion.div
                                                key="step3"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3 }}
                                                className="space-y-6"
                                            >
                                                <div className="mb-6">
                                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                                        {isMentor ? "Profil de l'organisation" : "Votre profil"}
                                                    </h3>
                                                    <p className="text-gray-500">
                                                        {isMentor 
                                                            ? "Parlez-nous de votre organisation" 
                                                            : "Informations sur votre identité"
                                                        }
                                                    </p>
                                                </div>

                                                {isMentor ? (
                                                    // Organization fields
                                                    <div className="space-y-6">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Nom de l'organisation
                                                            </label>
                                                            <div className="relative">
                                                                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                                <input
                                                                    type="text"
                                                                    name="organizationName"
                                                                    value={formData.organizationName}
                                                                    onChange={handleChange}
                                                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                                                />
                                                                {errors.organizationName && (
                                                                    <motion.p 
                                                                        initial={{ opacity:.0 }}
                                                                        animate={{ opacity: 1 }}
                                                                        className="mt-1 text-sm text-red-600 flex items-center"
                                                                    >
                                                                        <AlertCircle className="w-4 h-4 mr-1" />
                                                                        {errors.organizationName}
                                                                    </motion.p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Numéro d'enregistrement
                                                            </label>
                                                            <div className="relative">
                                                                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                                <input
                                                                    type="text"
                                                                    name="registrationNumber"
                                                                    value={formData.registrationNumber}
                                                                    onChange={handleChange}
                                                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                                                />
                                                                {errors.registrationNumber && (
                                                                    <motion.p 
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: 1 }}
                                                                        className="mt-1 text-sm text-red-600 flex items-center"
                                                                    >
                                                                        <AlertCircle className="w-4 h-4 mr-1" />
                                                                        {errors.registrationNumber}
                                                                    </motion.p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">                                                                Année de création
                                                            </label>
                                                            <div className="relative">
                                                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                                <input
                                                                    type="number"
                                                                    name="foundedYear"
                                                                    value={formData.foundedYear}
                                                                    onChange={handleChange}
                                                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                                                    placeholder="YYYY"
                                                                    min="1900"
                                                                    max={new Date().getFullYear()}
                                                                />
                                                                {errors.foundedYear && (
                                                                    <motion.p 
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: 1 }}
                                                                        className="mt-1 text-sm text-red-600 flex items-center"
                                                                    >
                                                                        <AlertCircle className="w-4 h-4 mr-1" />
                                                                        {errors.foundedYear}
                                                                    </motion.p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Site web (optionnel)
                                                            </label>
                                                            <div className="relative">
                                                                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                                <input
                                                                    type="url"
                                                                    name="websiteUrl"
                                                                    value={formData.websiteUrl}
                                                                    onChange={handleChange}
                                                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                                                    placeholder="https://votresite.com"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Mission ou objectif principal
                                                            </label>
                                                            <div className="relative">
                                                                <PenTool className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                                <textarea
                                                                    name="missionStatement"
                                                                    value={formData.missionStatement}
                                                                    onChange={handleChange}
                                                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 min-h-[100px]"
                                                                    placeholder="Décrivez brièvement la mission de votre organisation..."
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // Individual fields
                                                    <div className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    Prénom
                                                                </label>
                                                                <div className="relative">
                                                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                                    <input
                                                                        type="text"
                                                                        name="firstName"
                                                                        value={formData.firstName}
                                                                        onChange={handleChange}
                                                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                                                    />
                                                                    {errors.firstName && (
                                                                        <motion.p 
                                                                            initial={{ opacity: 0 }}
                                                                            animate={{ opacity: 1 }}
                                                                            className="mt-1 text-sm text-red-600 flex items-center"
                                                                        >
                                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                                            {errors.firstName}
                                                                        </motion.p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                    Nom
                                                                </label>
                                                                <div className="relative">
                                                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                                    <input
                                                                        type="text"
                                                                        name="lastName"
                                                                        value={formData.lastName}
                                                                        onChange={handleChange}
                                                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                                                                    />
                                                                    {errors.lastName && (
                                                                        <motion.p 
                                                                            initial={{ opacity: 0 }}
                                                                            animate={{ opacity: 1 }}
                                                                            className="mt-1 text-sm text-red-600 flex items-center"
                                                                        >
                                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                                            {errors.lastName}
                                                                        </motion.p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}

                                        {step === 4 && (
                                            <motion.div
                                                key="step4"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3 }}
                                                className="space-y-6"
                                            >
                                                <div className="mb-6">
                                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Conditions d'utilisation</h3>
                                                    <p className="text-gray-500">Dernière étape avant de rejoindre notre communauté</p>
                                                </div>

                                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                                                    <h4 className="text-lg font-medium text-gray-800 mb-4">Conditions générales d'utilisation</h4>
                                                    <div className="text-sm text-gray-600 space-y-4">
                                                        <p>
                                                            En vous inscrivant sur EcoCommunity, vous acceptez nos conditions générales d'utilisation et notre politique de confidentialité.
                                                        </p>
                                                        <p>
                                                            1. Vous vous engagez à fournir des informations exactes et à jour lors de votre inscription.
                                                        </p>
                                                        <p>
                                                            2. Vous acceptez de respecter les autres membres de la communauté et de maintenir un environnement professionnel.
                                                        </p>
                                                        <p>
                                                            3. Vous reconnaissez que EcoCommunity se réserve le droit de suspendre ou de supprimer votre compte en cas de violation de nos conditions.
                                                        </p>
                                                        <p>
                                                            4. Vous acceptez de recevoir occasionnellement des communications de notre part concernant les nouvelles fonctionnalités et les opportunités.
                                                        </p>
                                                        <p>
                                                            5. Vos données personnelles seront traitées conformément à notre politique de confidentialité.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start">
                                                    <div className="flex items-center h-5">
                                                        <input
                                                            id="terms"
                                                            name="terms"
                                                            type="checkbox"
                                                            checked={formData.terms}
                                                            onChange={handleChange}
                                                            className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded"
                                                        />
                                                    </div>
                                                    <div className="ml-3 text-sm">
                                                        <label htmlFor="terms" className="font-medium text-gray-700">
                                                            J'accepte les conditions générales d'utilisation
                                                        </label>
                                                        {errors.terms && (
                                                            <motion.p 
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="mt-1 text-red-600 flex items-center"
                                                            >
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                {errors.terms}
                                                            </motion.p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                                                    <h4 className="text-sm font-semibold text-emerald-800 mb-2">Pourquoi nous rejoindre ?</h4>
                                                    <ul className="text-sm text-emerald-700 space-y-1">
                                                        <li className="flex items-center">
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Accès à un réseau de professionnels et d'opportunités
                                                        </li>
                                                        <li className="flex items-center">
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Ressources et outils pour développer votre projet
                                                        </li>
                                                        <li className="flex items-center">
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Support et accompagnement personnalisé
                                                        </li>
                                                    </ul>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex justify-between pt-4">
                                        {step > 1 ? (
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                            >
                                                <ArrowLeft className="w-5 h-5 mr-2" />
                                                Précédent
                                            </button>
                                        ) : (
                                            <div></div>
                                        )}

                                        {step < 4 ? (
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                            >
                                                Suivant
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Création en cours...
                                                    </>
                                                ) : (
                                                    <>
                                                        Créer mon compte
                                                        <Check className="w-5 h-5 ml-2" />
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </form>

                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-500">
                                        Vous avez déjà un compte?{' '}
                                        <a href="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                                            Connectez-vous
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Features & Testimonials */}
                        <div className="bg-emerald-600 p-8 lg:p-12 text-white hidden lg:block">
                            <div className="max-w-md mx-auto">
                                <h2 className="text-2xl font-bold mb-6">Pourquoi rejoindre EcoCommunity ?</h2>
                                
                                <div className="space-y-6 mb-10">
                                    {features.map((feature, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start"
                                        >
                                            <div className="flex-shrink-0 bg-emerald-700 rounded-full p-2">
                                                {feature.icon}
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-semibold">{feature.title}</h3>
                                                <p className="text-emerald-100">{feature.description}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <h3 className="text-xl font-bold mb-6 mt-12">Ce que disent nos membres</h3>
                                
                                <div className="space-y-6">
                                    {testimonials.map((testimonial, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            className="bg-emerald-700 bg-opacity-50 p-5 rounded-lg"
                                        >
                                            <p className="italic mb-3">"{testimonial.content}"</p>
                                            <div className="flex items-center">
                                                <div className="bg-emerald-800 rounded-full w-10 h-10 flex items-center justify-center">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="font-medium">{testimonial.name}</p>
                                                    <p className="text-sm text-emerald-200">{testimonial.role}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">EcoCommunity</h3>
                            <p className="text-gray-600 text-sm">
                                Plateforme de mise en relation pour entrepreneurs, investisseurs et organisations au Cameroun.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Navigation</h4>
                            <ul className="space-y-2">
                                <li><a href="/" className="text-gray-600 hover:text-emerald-600 text-sm">Accueil</a></li>
                                <li><a href="/about" className="text-gray-600 hover:text-emerald-600 text-sm">À propos</a></li>
                                <li><a href="/services" className="text-gray-600 hover:text-emerald-600 text-sm">Services</a></li>
                                <li><a href="/contact" className="text-gray-600 hover:text-emerald-600 text-sm">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Légal</h4>
                            <ul className="space-y-2">
                                <li><a href="/privacy" className="text-gray-600 hover:text-emerald-600 text-sm">Confidentialité</a></li>
                                <li><a href="/terms" className="text-gray-600 hover:text-emerald-600 text-sm">Conditions d'utilisation</a></li>
                                <li><a href="/cookies" className="text-gray-600 hover:text-emerald-600 text-sm">Cookies</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact</h4>
                            <ul className="space-y-2">
                                <li className="flex items-center text-gray-600 text-sm">
                                    <Mail className="w-4 h-4 mr-2" />
                                    contact@ecocommunity.cm
                                </li>
                                <li className="flex items-center text-gray-600 text-sm">
                                    <Phone className="w-4 h-4 mr-2" />
                                    +237 6 XX XX XX XX
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} EcoCommunity. Tous droits réservés.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-emerald-600">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-emerald-600">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-emerald-600">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Register;