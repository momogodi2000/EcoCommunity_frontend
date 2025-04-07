import React, { useEffect, useState, useRef } from 'react';
import { logoutUser } from "../../../Services/auth.js";
import { 
  FileText, Settings, Users, LogOut, Menu, X, Lock, 
  User, Shield, HelpCircle, Info, HandHelping, 
  Camera, Upload, Trash2, Bell, Globe, Moon, Sun,
  CheckCircle, AlertCircle, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from "../../../Services/api.js";
import { Transition } from '@headlessui/react';
import EntrepreneurLayout from "../../Layout/EntrepreneurLayout.jsx";

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [userId, setUserId] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [formData, setFormData] = useState({});
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [theme, setTheme] = useState('light');
    const [notificationSettings, setNotificationSettings] = useState({
        email: true,
        push: true,
        marketing: false
    });
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

    // Scroll animation
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Alert timeout effect
    useEffect(() => {
        let timer;
        if (error || successMessage) {
            timer = setTimeout(() => {
                if (error) setError(null);
                if (successMessage) setSuccessMessage('');
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [error, successMessage]);

    useEffect(() => {
        setUserId(localStorage.getItem('userId'));
    }, []);

    useEffect(() => {
        if (userId) {
            fetchUserProfile();
        }
    }, [userId]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('userId');
            
            const response = await api.get(`/users/${userId}/profile/`);
            
            setUserProfile(response.data);
            initializeFormData(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.response?.data?.error || 'Impossible de charger le profil utilisateur');
            setLoading(false);
        }
    };

    const initializeFormData = (profile) => {
        if (!profile) return;

        const baseData = {
            email: profile.user?.email || '',
            phone: profile.user?.phone || '',
        };
        
        setFormData({
            ...baseData,
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            bio: profile.bio || ''
        });
        
        // Set image preview if available
        if (profile.user?.profile_image) {
            setImagePreview(getImageUrl(profile.user.profile_image));
        }
    };

    const validateForm = () => {
        if (!formData.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Veuillez entrer une adresse e-mail valide');
            return false;
        }

        if (!formData.phone?.match(/^\+?[\d\s-]{8,}$/)) {
            setError('Veuillez entrer un numéro de téléphone valide');
            return false;
        }

        if (!formData.first_name || !formData.last_name) {
            setError('Le prénom et le nom sont obligatoires');
            return false;
        }

        return true;
    };

    const validatePassword = (password) => {
        let strength = 0;
        
        if (password.length >= 8) strength += 1;
        if (password.match(/[A-Z]/)) strength += 1;
        if (password.match(/[a-z]/)) strength += 1;
        if (password.match(/[0-9]/)) strength += 1;
        if (password.match(/[^A-Za-z0-9]/)) strength += 1;
        
        return strength;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'new_password') {
            setPasswordStrength(validatePassword(value));
        }
        
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getImageUrl = (relativePath) => {
        if (!relativePath) return null;
        const BACKEND_URL = 'http://127.0.0.1:8000';
        if (relativePath.startsWith('http')) {
            return relativePath;
        }
        const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
        return `${BACKEND_URL}/${cleanPath}`;
    };

    const handleProfileUpdate = async () => {
        if (!validateForm()) return;

        try {
            setIsUpdating(true);
            const formattedData = {
                user: {
                    email: formData.email,
                    phone: formData.phone
                }
            };
            
            Object.assign(formattedData, {
                first_name: formData.first_name,
                last_name: formData.last_name,
                bio: formData.bio
            });

            await api.patch(`/users/${userId}/profile/`, formattedData);
            setSuccessMessage('Profil mis à jour avec succès');
            await fetchUserProfile();
        } catch (err) {
            setError(err.response?.data?.error || 'Échec de la mise à jour du profil');
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (passwordData.new_password !== passwordData.confirm_password) {
            setError('Les nouveaux mots de passe ne correspondent pas');
            return;
        }
        
        if (passwordStrength < 3) {
            setError('Le mot de passe doit être plus fort');
            return;
        }

        try {
            setIsUpdating(true);
            await api.patch(`/users/${userId}/profile/`, {
                current_password: passwordData.current_password,
                new_password: passwordData.new_password
            });
            setSuccessMessage('Mot de passe mis à jour avec succès');
            setPasswordData({
                current_password: '',
                new_password: '',
                confirm_password: ''
            });
            setPasswordStrength(0);
        } catch (err) {
            setError(err.response?.data?.error || 'Échec de la mise à jour du mot de passe');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('profile_image', file);

        try {
            setIsUpdating(true);
            await api.post(`/users/${userId}/profile/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccessMessage('Image de profil mise à jour avec succès');
            await fetchUserProfile();
        } catch (err) {
            setError(err.response?.data?.error || 'Échec du téléchargement de l\'image');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre compte? Cette action ne peut pas être annulée.')) {
            return;
        }

        try {
            setIsUpdating(true);
            await api.delete(`/users/${userId}/profile/`);
            localStorage.clear();
            window.location.href = '/login';
        } catch (err) {
            setError(err.response?.data?.error || 'Échec de la suppression du compte');
            setIsUpdating(false);
        }
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleNotificationChange = (setting) => {
        setNotificationSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const renderPasswordStrength = () => {
        const getColor = () => {
            if (passwordStrength <= 1) return 'bg-red-500';
            if (passwordStrength <= 3) return 'bg-yellow-500';
            return 'bg-green-500';
        };

        const getLabel = () => {
            if (passwordStrength <= 1) return 'Faible';
            if (passwordStrength <= 3) return 'Moyen';
            return 'Fort';
        };

        return (
            <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                        className={`h-2.5 rounded-full ${getColor()}`} 
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                </div>
                <p className="text-xs mt-1 text-gray-600">{getLabel()}</p>
            </div>
        );
    };

    const renderTabContent = () => {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'profile' && (
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-emerald-400 to-teal-500 shadow-lg">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-emerald-50">
                                                <User className="w-1/2 h-1/2 text-emerald-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div 
                                        onClick={() => fileInputRef.current.click()}
                                        className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white cursor-pointer shadow-md hover:bg-emerald-600 transition-all duration-300 transform group-hover:scale-110"
                                    >
                                        <Camera size={20} />
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                                <div className="text-center md:text-left">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                        {formData.first_name ? `${formData.first_name} ${formData.last_name}` : 'Votre Profil'}
                                    </h3>
                                    <p className="text-gray-600 max-w-md">
                                        {formData.bio || 'Complétez votre profil pour que les autres utilisateurs puissent mieux vous connaître.'}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                                            Entrepreneur
                                        </span>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                            Membre Actif
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <motion.div 
                                    className="space-y-4"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Informations personnelles</h4>
                                    
                                    <div className="space-y-6">
                                        <div className="group">
                                            <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-emerald-600 transition-colors duration-200">
                                                Prénom
                                            </label>
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-emerald-300"
                                                placeholder="Votre prénom"
                                            />
                                        </div>
                                        
                                        <div className="group">
                                            <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-emerald-600 transition-colors duration-200">
                                                Nom
                                            </label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-emerald-300"
                                                placeholder="Votre nom"
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div 
                                    className="space-y-4"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Coordonnées</h4>
                                    
                                    <div className="space-y-6">
                                        <div className="group">
                                            <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-emerald-600 transition-colors duration-200">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-emerald-300"
                                                placeholder="votre@email.com"
                                            />
                                        </div>
                                        
                                        <div className="group">
                                            <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-emerald-600 transition-colors duration-200">
                                                Téléphone
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-emerald-300"
                                                placeholder="+33 6 12 34 56 78"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div 
                                className="space-y-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">À propos de vous</h4>
                                
                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-emerald-600 transition-colors duration-200">
                                        Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-emerald-300"
                                        rows="4"
                                        placeholder="Parlez-nous de vous, de votre parcours, de vos compétences..."
                                    ></textarea>
                                </div>
                            </motion.div>

                            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                                <button
                                    onClick={() => fetchUserProfile()}
                                    className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
                                    disabled={isUpdating}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Annuler
                                </button>
                                <button
                                    onClick={handleProfileUpdate}
                                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sauvegarde...
                                        </span>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Enregistrer les modifications
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-8">
                            <motion.div 
                                className="space-y-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Sécurité du compte</h3>
                                
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Modifier le mot de passe</h4>
                                    
                                    <div className="space-y-4">
                                        <div className="group">
                                            <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-emerald-600 transition-colors duration-200">
                                                Mot de passe actuel
                                            </label>
                                            <input
                                                type="password"
                                                name="current_password"
                                                value={passwordData.current_password}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white hover:border-emerald-300"
                                            />
                                        </div>
                                        
                                        <div className="group">
                                            <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-emerald-600 transition-colors duration-200">
                                                Nouveau mot de passe
                                            </label>
                                            <input
                                                type="password"
                                                name="new_password"
                                                value={passwordData.new_password}
                                                onChange={handlePasswordChange}
                                                onFocus={() => setShowPasswordRequirements(true)}
                                                onBlur={() => setShowPasswordRequirements(false)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white hover:border-emerald-300"
                                            />
                                            {passwordData.new_password && renderPasswordStrength()}
                                            
                                            <Transition
                                                show={showPasswordRequirements}
                                                enter="transition-opacity duration-300"
                                                enterFrom="opacity-0"
                                                enterTo="opacity-100"
                                                leave="transition-opacity duration-300"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                                                    <p className="font-medium mb-1">Le mot de passe doit contenir :</p>
                                                    <ul className="space-y-1 pl-5 list-disc">
                                                        <li className={passwordData.new_password?.length >= 8 ? "text-green-600" : ""}>Au moins 8 caractères</li>
                                                        <li className={passwordData.new_password?.match(/[A-Z]/) ? "text-green-600" : ""}>Une lettre majuscule</li>
                                                        <li className={passwordData.new_password?.match(/[a-z]/) ? "text-green-600" : ""}>Une lettre minuscule</li>
                                                        <li className={passwordData.new_password?.match(/[0-9]/) ? "text-green-600" : ""}>Un chiffre</li>
                                                        <li className={passwordData.new_password?.match(/[^A-Za-z0-9]/) ? "text-green-600" : ""}>Un caractère spécial</li>
                                                    </ul>
                                                </div>
                                            </Transition>
                                        </div>
                                        
                                        <div className="group">
                                            <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-emerald-600 transition-colors duration-200">
                                                Confirmer le nouveau mot de passe
                                            </label>
                                            <input
                                                type="password"
                                                name="confirm_password"
                                                value={passwordData.confirm_password}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white hover:border-emerald-300"
                                            />
                                            {passwordData.new_password && passwordData.confirm_password && (
                                                <p className={`text-sm mt-1 ${passwordData.new_password === passwordData.confirm_password ? 'text-green-600' : 'text-red-600'}`}>
                                                    {passwordData.new_password === passwordData.confirm_password ? 
                                                        'Les mots de passe correspondent' : 
                                                        'Les mots de passe ne correspondent pas'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6">
                                        <button
                                            onClick={handlePasswordUpdate}
                                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center"
                                            disabled={isUpdating}
                                        >
                                            {isUpdating ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Mise à jour...
                                                </span>
                                            ) : (
                                                <>
                                                    <Lock className="h-4 w-4 mr-2" />
                                                    Mettre à jour le mot de passe
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                className="space-y-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Authentification à deux facteurs</h4>
                                    
                                    <p className="text-gray-600 mb-4">
                                        Ajoutez une couche de sécurité supplémentaire à votre compte en activant l'authentification à deux facteurs.
                                    </p>
                                    
                                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                                        <div className="flex items-center">
                                            <Shield className="h-6 w-6 text-emerald-500 mr-3" />
                                            <div>
                                                <h5 className="font-medium text-gray-800">Statut de l'A2F</h5>
                                                <p className="text-sm text-gray-600">Non activée</p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center">
                                        <Lock className="h-4 w-4 mr-2" />
                                        Activer
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            className="space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-red-100">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Zone dangereuse</h4>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                                        <div className="flex items-center">
                                            <Trash2 className="h-6 w-6 text-red-500 mr-3" />
                                            <div>
                                                <h5 className="font-medium text-gray-800">Supprimer le compte</h5>
                                                <p className="text-sm text-gray-600">Cette action est irréversible</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={handleDeleteAccount}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
                                            disabled={isUpdating}
                                        >
                                            {isUpdating ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Suppression...
                                                </span>
                                            ) : (
                                                "Supprimer le compte"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="space-y-8">
                        <motion.div 
                            className="space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Préférences de notification</h3>
                            
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Types de notifications</h4>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Bell className="h-5 w-5 text-emerald-500 mr-3" />
                                            <div>
                                                <h5 className="font-medium text-gray-800">Notifications par email</h5>
                                                <p className="text-sm text-gray-600">Recevoir des notifications importantes par email</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={notificationSettings.email}
                                                onChange={() => handleNotificationChange('email')}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                        </label>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Bell className="h-5 w-5 text-blue-500 mr-3" />
                                            <div>
                                                <h5 className="font-medium text-gray-800">Notifications push</h5>
                                                <p className="text-sm text-gray-600">Recevoir des notifications sur votre appareil</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={notificationSettings.push}
                                                onChange={() => handleNotificationChange('push')}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Bell className="h-5 w-5 text-purple-500 mr-3" />
                                            <div>
                                                <h5 className="font-medium text-gray-800">Newsletter et offres</h5>
                                                <p className="text-sm text-gray-600">Recevoir des newsletters et offres promotionnelles</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={notificationSettings.marketing}
                                                onChange={() => handleNotificationChange('marketing')}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            className="space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Fréquence des notifications</h4>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200">
                                        <div className="flex items-center">
                                            <div className="mr-4 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <Bell className="h-5 w-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-gray-800">Immédiatement</h5>
                                                <p className="text-sm text-gray-600">Recevoir les notifications dès qu'elles arrivent</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200">
                                        <div className="flex items-center">
                                            <div className="mr-4 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <Calendar className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-gray-800">Quotidiennement</h5>
                                                <p className="text-sm text-gray-600">Recevoir un résumé quotidien</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200">
                                        <div className="flex items-center">
                                            <div className="mr-4 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                <Globe className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-gray-800">Hebdomadairement</h5>
                                                <p className="text-sm text-gray-600">Recevoir un résumé hebdomadaire</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {activeTab === 'appearance' && (
                    <div className="space-y-8">
                        <motion.div 
                            className="space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Apparence</h3>
                            
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Thème</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div 
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${theme === 'light' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        onClick={() => setTheme('light')}
                                    >
                                        <div className="flex items-center mb-3">
                                            <Sun className="h-5 w-5 mr-2 text-yellow-500" />
                                            <span className="font-medium">Clair</span>
                                        </div>
                                        <div className="w-full h-20 rounded bg-white border border-gray-200 flex items-center justify-center">
                                            <div className="w-1/3 h-full bg-gray-100 border-r border-gray-200"></div>
                                            <div className="w-2/3 h-full"></div>
                                        </div>
                                    </div>
                                    
                                    <div 
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${theme === 'dark' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        onClick={() => setTheme('dark')}
                                    >
                                        <div className="flex items-center mb-3">
                                            <Moon className="h-5 w-5 mr-2 text-indigo-500" />
                                            <span className="font-medium">Sombre</span>
                                        </div>
                                        <div className="w-full h-20 rounded bg-gray-900 border border-gray-700 flex items-center justify-center">
                                            <div className="w-1/3 h-full bg-gray-800 border-r border-gray-700"></div>
                                            <div className="w-2/3 h-full"></div>
                                        </div>
                                    </div>
                                    
                                    <div 
                                        className="p-4 rounded-lg border-2 border-gray-200 cursor-not-allowed opacity-50"
                                    >
                                        <div className="flex items-center mb-3">
                                            <Globe className="h-5 w-5 mr-2 text-blue-500" />
                                            <span className="font-medium">Système</span>
                                        </div>
                                        <div className="w-full h-20 rounded bg-gradient-to-r from-white to-gray-900 border border-gray-200 flex items-center justify-center">
                                            <div className="w-1/3 h-full bg-gray-100 border-r border-gray-200"></div>
                                            <div className="w-1/3 h-full bg-gray-500 border-r border-gray-600"></div>
                                            <div className="w-1/3 h-full bg-gray-800"></div>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">Bientôt disponible</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            className="space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Densité d'affichage</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-lg border-2 border-gray-200 cursor-not-allowed opacity-50">
                                        <div className="flex items-center mb-3">
                                            <span className="font-medium">Compact</span>
                                        </div>
                                        <div className="w-full h-20 rounded bg-gray-50 border border-gray-200 flex flex-col justify-center p-1">
                                            <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
                                            <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
                                            <div className="h-4 w-full bg-gray-200 rounded"></div>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">Bientôt disponible</div>
                                    </div>
                                    
                                    <div className="p-4 rounded-lg border-2 border-emerald-500 bg-emerald-50">
                                        <div className="flex items-center mb-3">
                                            <span className="font-medium">Standard</span>
                                        </div>
                                        <div className="w-full h-20 rounded bg-gray-50 border border-gray-200 flex flex-col justify-center p-2">
                                            <div className="h-5 w-full bg-gray-200 rounded mb-2"></div>
                                            <div className="h-5 w-full bg-gray-200 rounded mb-2"></div>
                                            <div className="h-5 w-full bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 rounded-lg border-2 border-gray-200 cursor-not-allowed opacity-50">
                                        <div className="flex items-center mb-3">
                                            <span className="font-medium">Confortable</span>
                                        </div>
                                        <div className="w-full h-20 rounded bg-gray-50 border border-gray-200 flex flex-col justify-center p-3">
                                            <div className="h-6 w-full bg-gray-200 rounded mb-3"></div>
                                            <div className="h-6 w-full bg-gray-200 rounded"></div>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">Bientôt disponible</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

return (
    <EntrepreneurLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Alerts */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start"
                    >
                        <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-medium">Erreur</p>
                            <p className="text-sm">{error}</p>
                        </div>
                        <button 
                            onClick={() => setError(null)}
                            className="ml-auto text-red-500 hover:text-red-700"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </motion.div>
                )}
                
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start"
                    >
                        <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-medium">Succès</p>
                            <p className="text-sm">{successMessage}</p>
                        </div>
                        <button 
                            onClick={() => setSuccessMessage('')}
                            className="ml-auto text-green-500 hover:text-green-700"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
                    <p className="text-gray-600">Gérez vos préférences et les paramètres de votre compte</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="font-semibold text-gray-800">Menu des paramètres</h2>
                        </div>
                        <nav className="divide-y divide-gray-200">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full px-4 py-3 text-left flex items-center ${activeTab === 'profile' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                <User className="h-5 w-5 mr-3" />
                                <span>Profil</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`w-full px-4 py-3 text-left flex items-center ${activeTab === 'security' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                <Lock className="h-5 w-5 mr-3" />
                                <span>Sécurité</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('notifications')}
                                className={`w-full px-4 py-3 text-left flex items-center ${activeTab === 'notifications' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                <Bell className="h-5 w-5 mr-3" />
                                <span>Notifications</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('appearance')}
                                className={`w-full px-4 py-3 text-left flex items-center ${activeTab === 'appearance' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                <Sun className="h-5 w-5 mr-3" />
                                <span>Apparence</span>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                        </div>
                    ) : (
                        renderTabContent()
                    )}
                </div>
            </div>
        </div>
    </EntrepreneurLayout>
);
};

export default SettingsPage;