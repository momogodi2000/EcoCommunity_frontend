import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutUser } from "../../Services/auth";
import { Search, Plus, BarChart2,FileText, Settings, LogOut, Menu, X, Calendar, MapPin, Users, DollarSign, HelpCircle, Info, HandHelping, Trash2,Bell,Home,LifeBuoy
} from 'lucide-react';

const EntrepreneurLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Example notification count
  const navigate = useNavigate();
  const location = useLocation();

  // Handle logout
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Check if route is active
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Navigation items
  const navigationItems = [
    { 
      path: '/entrepreneur/dashboard', 
      name: 'Tableau de bord', 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      path: '/entrepreneur/project', 
      name: 'Mes Projets', 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      path: '/entrepreneur/demandes', 
      name: 'Demande d\'aide', 
      icon: <HelpCircle className="h-5 w-5" /> 
    },
    { 
      path: '/entrepreneur/help', 
      name: 'Proposition d\'aide', 
      icon: <HandHelping className="h-5 w-5" /> 
    },
    { 
      path: '/entrepreneur/opportunity', 
      name: 'Annonces', 
      icon: <Info className="h-5 w-5" /> 
    },
    { 
      path: '/entrepreneur/collaborators', 
      name: 'Collaborateurs', 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      path: '/entrepreneur/analytics', 
      name: 'Analytique', 
      icon: <BarChart2 className="h-5 w-5" /> 
    },
    { 
      path: '/entrepreneur/settings', 
      name: 'Paramètres', 
      icon: <Settings className="h-5 w-5" /> 
    },
  ];

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Overlay for mobile menu
  const MobileMenuOverlay = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.button>
      </div>

      <MobileMenuOverlay />

      {/* Top Bar - Only visible on desktop */}
      <div className="hidden lg:flex bg-white fixed top-0 left-64 right-0 h-16 border-b border-gray-100 items-center px-8 z-20">
        <div className="ml-auto flex items-center space-x-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative cursor-pointer"
          >
            <Bell className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </motion.div>
          <div className="flex items-center">
            <img 
              src="/api/placeholder/32/32" 
              alt="User" 
              className="h-8 w-8 rounded-full object-cover border-2 border-emerald-500"
            />
            <span className="ml-2 text-gray-700 font-semibold">Utilisateur</span>
          </div>
        </div>
      </div>

      {/* Side Navigation */}
      <motion.aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-700 to-emerald-800 transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-all duration-300 ease-in-out z-40 shadow-xl overflow-hidden`}
        initial={false}
      >
        <motion.div 
          className="p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="flex items-center space-x-3 mb-8"
            whileHover={{ scale: 1.03 }}
          >
            <div className="bg-white/10 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white"/>
            </div>
            <h2 className="text-white text-2xl font-bold">EcoCommunity</h2>
          </motion.div>

          <div className="mt-8 space-y-1.5">
            {navigationItems.map((item, index) => (
              <motion.a
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActiveRoute(item.path) 
                    ? 'bg-emerald-600/50 text-white font-medium' 
                    : 'text-emerald-100 hover:bg-emerald-600/30'
                }`}
                whileHover={{ x: 4 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                {item.icon}
                <span>{item.name}</span>
                {isActiveRoute(item.path) && (
                  <motion.div 
                    className="ml-auto h-2 w-2 rounded-full bg-white"
                    layoutId="activeIndicator"
                  />
                )}
              </motion.a>
            ))}
          </div>
        </motion.div>
        
        {/* Help & Support */}
        <motion.div 
          className="absolute bottom-20 left-0 right-0 mx-6 p-4 bg-emerald-600/30 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start space-x-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg">
              <LifeBuoy className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="text-white text-sm font-medium">Besoin d'aide?</h4>
              <p className="text-emerald-100 text-xs mt-1">Contactez notre support technique</p>
              <button className="mt-2 text-xs bg-white/10 hover:bg-white/20 text-white py-1.5 px-3 rounded-lg transition-colors">
                Support
              </button>
            </div>
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center space-x-3 text-emerald-100 hover:bg-red-500/20 w-full px-4 py-3 rounded-lg transition-all duration-200"
            whileHover={{ x: 4 }}
          >
            <LogOut className="h-5 w-5"/>
            <span>{isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}</span>
          </motion.button>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        <main className="pt-8 lg:pt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default EntrepreneurLayout;