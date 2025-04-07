import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Users, TrendingUp, Camera, Mail, Lock, Leaf, ArrowRight, ChevronRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../Services/auth";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [activeFeature, setActiveFeature] = useState(0);

    // Auto-cycle through features
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email invalide";
        }

        if (!formData.password) {
            newErrors.password = "Le mot de passe est requis";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            try {
                const response = await loginUser({
                    email: formData.email,
                    password: formData.password,
                });

                setSubmitStatus("success");
                
                // Delay navigation to show success message
                setTimeout(() => {
                    // Redirect based on user role
                    switch (response.user.role) {
                        case "admin":
                            navigate("/admin/dashboard");
                            break;
                        case "entrepreneur":
                            navigate("/entrepreneur/project");
                            break;
                        case "investor":
                            navigate("/investors/project");
                            break;
                        case "ONG-Association":
                            navigate("/association/announce");
                            break;
                        default:
                            navigate("/dashboard");
                    }
                }, 1500);
            } catch (error) {
                console.error("Login error:", error);
                setErrors({
                    submit: "Email ou mot de passe incorrect",
                });
                setSubmitStatus("error");
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setErrors(newErrors);
        }
    };

    const features = [
        {
            icon: <Users className="w-8 h-8 text-emerald-700" />,
            title: "Réseau Communautaire",
            description: "Rejoignez une communauté dynamique d'entrepreneurs et d'investisseurs partageant les mêmes valeurs pour un développement local durable."
        },
        {
            icon: <Camera className="w-8 h-8 text-emerald-700" />,
            title: "Projets Innovants",
            description: "Découvrez et soutenez des projets locaux à impact social et environnemental positif qui transforment les communautés camerounaises."
        },
        {
            icon: <TrendingUp className="w-8 h-8 text-emerald-700" />,
            title: "Suivi de Performance",
            description: "Analysez en temps réel l'impact de vos projets grâce à nos tableaux de bord intuitifs et nos outils d'analyse avancés."
        },
        {
            icon: <Leaf className="w-8 h-8 text-emerald-700" />,
            title: "Impact Environnemental",
            description: "Mesurez et améliorez l'empreinte écologique de vos initiatives avec nos outils dédiés au développement durable."
        }
    ];

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const Alert = ({ type, message, description, onClose }) => {
        const colors = {
            success: "bg-green-100 border-green-500 text-green-800",
            error: "bg-red-100 border-red-500 text-red-800",
            warning: "bg-yellow-100 border-yellow-500 text-yellow-800",
            info: "bg-blue-100 border-blue-500 text-blue-800",
        };
        
        return (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`${colors[type]} border-l-4 p-4 mb-4 rounded-md shadow-sm`}
            >
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {type === "success" && <CheckCircle className="w-5 h-5" />}
                        {type === "error" && <div className="w-5 h-5 text-red-600">⚠️</div>}
                    </div>
                    <div className="ml-3">
                        <h3 className="font-medium">{message}</h3>
                        <div className="mt-1 text-sm">{description}</div>
                    </div>
                    <button className="ml-auto" onClick={onClose}>
                        <span className="text-sm">×</span>
                    </button>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
            {/* Navigation */}
            <nav className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex-shrink-0 flex items-center space-x-2">
                            <Leaf className="w-8 h-8 text-emerald-300" />
                            <a href="/" className="text-2xl font-bold tracking-tight">
                                Eco<span className="text-emerald-300">Community</span>
                            </a>
                        </div>
                        <div className="hidden md:flex space-x-6">
                            <a href="/" className="text-white hover:text-emerald-200 transition-colors px-3 py-2 rounded-md font-medium">
                                Accueil
                            </a>
                            <a href="/about" className="text-white hover:text-emerald-200 transition-colors px-3 py-2 rounded-md font-medium">
                                À propos
                            </a>
                            <a href="/projects" className="text-white hover:text-emerald-200 transition-colors px-3 py-2 rounded-md font-medium">
                                Projets
                            </a>
                            <a href="/contact" className="text-white hover:text-emerald-200 transition-colors px-3 py-2 rounded-md font-medium">
                                Contact
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:shadow-3xl"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Left Section - Login Form */}
                        <div className="p-8 lg:p-12">
                            <div className="max-w-md mx-auto">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h2 className="text-4xl font-bold text-gray-900 mb-2 relative">
                                        Connexion
                                        <div className="h-1 w-12 bg-emerald-600 mt-2 rounded-full"></div>
                                    </h2>
                                    <p className="text-gray-600 mb-8">Accédez à votre espace et développez votre projet communautaire</p>
                                </motion.div>

                                <AnimatePresence>
                                    {submitStatus === "success" && (
                                        <Alert
                                            type="success"
                                            message="Connexion réussie!"
                                            description="Bienvenue sur EcoCommunity. Vous allez être redirigé..."
                                            onClose={() => setSubmitStatus(null)}
                                        />
                                    )}

                                    {submitStatus === "error" && (
                                        <Alert
                                            type="error"
                                            message="Connexion échouée!"
                                            description={errors.submit}
                                            onClose={() => setSubmitStatus(null)}
                                        />
                                    )}
                                </AnimatePresence>

                                <motion.form 
                                    onSubmit={handleSubmit} 
                                    className="space-y-6"
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <motion.div variants={fadeIn}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Adresse Email
                                        </label>
                                        <div className="relative group">
                                            <Mail
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-emerald-600 transition-colors duration-200 w-5 h-5"/>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all duration-200 hover:border-emerald-500"
                                                placeholder="votreemail@exemple.com"
                                            />
                                            <AnimatePresence>
                                                {errors.email && (
                                                    <motion.p 
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="mt-2 text-sm text-red-600 flex items-center"
                                                    >
                                                        <span className="mr-1">⚠️</span>
                                                        {errors.email}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={fadeIn}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mot de passe
                                        </label>
                                        <div className="relative group">
                                            <Lock
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-emerald-600 transition-colors duration-200 w-5 h-5"/>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-10 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all duration-200 hover:border-emerald-500"
                                                placeholder="Votre mot de passe"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors duration-200"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                            </button>
                                            <AnimatePresence>
                                                {errors.password && (
                                                    <motion.p 
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="mt-2 text-sm text-red-600 flex items-center"
                                                    >
                                                        <span className="mr-1">⚠️</span>
                                                        {errors.password}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={fadeIn} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="rememberMe"
                                                id="rememberMe"
                                                checked={formData.rememberMe}
                                                onChange={handleChange}
                                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600 cursor-pointer hover:text-gray-800 transition-colors">
                                                Se souvenir de moi
                                            </label>
                                        </div>
                                        <a href="/password" className="text-sm text-emerald-600 hover:text-emerald-800 transition-colors font-medium">
                                            Mot de passe oublié?
                                        </a>
                                    </motion.div>

                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        variants={fadeIn}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-3.5 px-4 rounded-xl hover:shadow-lg hover:from-emerald-800 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 font-medium"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Connexion en cours...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Se connecter</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </motion.button>
                                </motion.form>

                                <motion.div 
                                    variants={fadeIn}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: 0.5 }}
                                    className="mt-8 text-center"
                                >
                                    <p className="text-gray-600">
                                        Pas encore de compte?{" "}
                                    </p>
                                    <a 
                                        href="/register" 
                                        className="inline-flex items-center mt-2 text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
                                    >
                                        Créer un compte
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </a>
                                </motion.div>
                            </div>
                        </div>

                        {/* Right Section - Features */}
                        <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 lg:p-12 text-white relative overflow-hidden">
                            {/* Background patterns */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white"></div>
                                <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-emerald-400"></div>
                                <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-emerald-300"></div>
                            </div>
                            
                            <div className="max-w-md mx-auto relative z-10">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h3 className="text-4xl font-bold mb-4">Bienvenue sur <span className="text-emerald-300">EcoCommunity</span></h3>
                                    <p className="text-emerald-100 mb-12 leading-relaxed">
                                        Votre plateforme dédiée à l'entrepreneuriat communautaire au Cameroun.
                                        Développez des projets durables, trouvez des investisseurs et créez un impact positif dans votre communauté.
                                    </p>
                                </motion.div>

                                <div className="space-y-8">
                                    {features.map((feature, index) => (
                                        <motion.div 
                                            key={index} 
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ 
                                                opacity: activeFeature === index ? 1 : 0.7,
                                                x: 0,
                                                scale: activeFeature === index ? 1 : 0.98
                                            }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className={`flex items-start space-x-4 transition-all duration-300 rounded-xl p-4 
                                                ${activeFeature === index ? 'bg-white bg-opacity-10' : 'hover:bg-white hover:bg-opacity-5'}`}
                                            onClick={() => setActiveFeature(index)}
                                        >
                                            <div className="flex-shrink-0 bg-white rounded-lg p-3 shadow-md">
                                                {feature.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold mb-1">{feature.title}</h4>
                                                <p className="text-emerald-100 text-sm leading-relaxed">{feature.description}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="mt-12 bg-white bg-opacity-10 p-4 rounded-xl"
                                >
                                    <p className="text-emerald-100 text-sm italic">
                                        "EcoCommunity a complètement transformé notre façon de trouver des financements pour notre projet agricole. Nous avons pu connecter avec des investisseurs partageant nos valeurs."
                                    </p>
                                    <div className="mt-3 flex items-center">
                                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">M</div>
                                        <div className="ml-3">
                                            <p className="font-medium">Marie Talom</p>
                                            <p className="text-xs text-emerald-200">Entrepreneuse, Bafoussam</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                
                {/* Footer */}
                <div className="mt-12 text-center text-gray-600 text-sm">
                    <p>© 2025 EcoCommunity. Tous droits réservés.</p>
                    <div className="mt-2 flex justify-center space-x-4">
                        <a href="/privacy" className="hover:text-emerald-700 transition-colors">Confidentialité</a>
                        <a href="/terms" className="hover:text-emerald-700 transition-colors">Conditions d'utilisation</a>
                        <a href="/help" className="hover:text-emerald-700 transition-colors">Centre d'aide</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;