import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import EntrepreneurLayout from '../../Layout/EntrepreneurLayout.jsx';
import { Search, Plus, Calendar, DollarSign, Users, HelpCircle, FileText, ChevronRight, Clock, Filter, MapPin, Award, Trash2, Edit, Eye, Heart, ArrowUp, ChevronDown, Sparkles, X } from 'lucide-react';
import api from "../../../Services/api.js";

// Project details modal component
const ProjectDetailsModal = ({ project, onClose }) => {
  if (!project) return null;
  
  const statusColors = {
    'En cours': 'bg-green-100 text-green-800 border-green-200',
    'En attente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Terminé': 'bg-blue-100 text-blue-800 border-blue-200',
    'default': 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const getStatusColor = (status) => {
    return statusColors[status] || statusColors.default;
  };

  const getProjectProgress = () => {
    if (project.status === 'Terminé') return 100;
    if (project.status === 'En attente') return 10;
    return Math.floor(Math.random() * 60) + 20; // Random progress between 20-80% for demo
  };

  const progress = getProjectProgress();

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative h-56 overflow-hidden">
            <img 
              src={project.project_image || "/api/placeholder/800/400"} 
              alt={project.project_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {project.status_display || project.status}
                </span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  {project.sector}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">{project.project_name}</h2>
            </div>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-14rem)]">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description du projet</h3>
              <p className="text-gray-600">{project.description || "Aucune description disponible."}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-emerald-500" />
                  Budget estimé
                </h3>
                <p className="text-2xl font-bold text-gray-900">{(project.estimated_budget || 0).toLocaleString()} FCFA</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-emerald-500" />
                  Date de création
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {new Date(project.created_at).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Progression du projet</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-emerald-500 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">0%</span>
                <span className="text-xs font-medium text-emerald-800">{progress}% complété</span>
                <span className="text-xs text-gray-500">100%</span>
              </div>
            </div>

            {project.team_members && project.team_members.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Équipe du projet</h3>
                <div className="space-y-3">
                  {project.team_members.map((member, index) => (
                    <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                      <img 
                        src={member.avatar || "/api/placeholder/40/40"} 
                        alt={member.name} 
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier le projet
                </button>
                <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Demander de l'aide
                </button>
                <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Project card component
const ProjectCard = ({ project, onDelete, onViewDetails }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const statusColors = {
    'En cours': 'bg-green-100 text-green-800',
    'En attente': 'bg-yellow-100 text-yellow-800',
    'Terminé': 'bg-blue-100 text-blue-800',
    'default': 'bg-gray-100 text-gray-800'
  };

  const getStatusColor = (status) => {
    return statusColors[status] || statusColors.default;
  };

  const getImageUrl = (project) => {
    if (project.project_image) {
      return project.project_image.startsWith('http')
        ? project.project_image
        : `${import.meta.env.VITE_API_URL || ''}${project.project_image}`;
    }
    
    const projectImage = project.documents?.find(doc => doc.document_type === 'project_photos');
    if (projectImage?.file) {
      if (projectImage.file.startsWith('http')) {
        return projectImage.file;
      }
      return `${import.meta.env.VITE_API_URL || ''}${projectImage.file}`;
    }
    
    return "/api/placeholder/400/250";
  };

  // Add likes functionality for demonstration
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 5);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative overflow-hidden group">
        <img
          src={getImageUrl(project)}
          alt={project.project_name}
          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "/api/placeholder/400/250";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        
        <div className="absolute top-4 right-4 flex space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status_display || project.status}
          </span>
        </div>
        
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <div className="flex justify-between items-center">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
              {project.sector}
            </span>
            <motion.button
              whileTap={{ scale: 1.2 }}
              onClick={handleLike}
              className="flex items-center space-x-1 text-white"
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="text-xs">{likes}</span>
            </motion.button>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 hover:text-emerald-600 transition-colors cursor-pointer" onClick={() => onViewDetails(project)}>
          {project.project_name}
        </h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{project.description}</p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-4 w-4 mr-2 text-emerald-500"/>
            <span className="text-sm">{(project.estimated_budget || 0).toLocaleString()} FCFA</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-emerald-500"/>
            <span className="text-sm">
              {new Date(project.created_at).toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}
            </span>
          </div>
          
          {/* Project progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full" 
              style={{ width: `${project.progress || Math.floor(Math.random() * 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project?.id);
            }}
            className="flex-1 flex items-center justify-center py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-all duration-200"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Supprimer
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onViewDetails(project)}
            className="flex-1 flex items-center justify-center py-2 border-2 border-emerald-600 text-emerald-600 text-sm rounded-lg hover:bg-emerald-50 transition-all duration-200"
          >
            <Eye className="h-4 w-4 mr-1.5" />
            Voir détails
          </motion.button>
        </div>
        
        {project.status === 'approved' && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-3 w-full flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-all duration-200"
          >
            <HelpCircle className="h-4 w-4 mr-1.5"/>
            Demander de l'aide
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// Empty state component
const EmptyState = ({ onCreateProject }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="text-center py-12"
  >
    <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto backdrop-blur-lg bg-opacity-90">
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.5
        }}
      >
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
      </motion.div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun projet pour le moment</h3>
      <p className="text-gray-600 mb-6">Commencez par créer votre premier projet communautaire</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCreateProject}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200"
      >
        <Plus className="h-5 w-5 mr-2"/>
        Créer un Projet
      </motion.button>
    </div>
  </motion.div>
);

// Filter sidebar component
const FilterSidebar = ({ 
  showFilters, 
  setShowFilters, 
  sortBy, 
  setSortBy, 
  filterStatus, 
  setFilterStatus, 
  filterSector, 
  setFilterSector,
  sectors
}) => (
  <motion.div
    initial={{ x: '100%' }}
    animate={{ x: showFilters ? 0 : '100%' }}
    transition={{ type: 'spring', damping: 25 }}
    className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-30 p-6 overflow-y-auto"
  >
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-bold text-gray-900">Filtres</h3>
      <button 
        onClick={() => setShowFilters(false)}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
    
    <div className="space-y-6">
      {/* Sorting options */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3">Trier par</h4>
        <div className="space-y-2">
          {[
            { value: 'newest', label: 'Plus récent' },
            { value: 'oldest', label: 'Plus ancien' },
            { value: 'budget-high', label: 'Budget (élevé à faible)' },
            { value: 'budget-low', label: 'Budget (faible à élevé)' },
            { value: 'alphabetical', label: 'Ordre alphabétique' }
          ].map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                id={option.value}
                name="sortBy"
                checked={sortBy === option.value}
                onChange={() => setSortBy(option.value)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor={option.value} className="ml-2 text-gray-700">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Status filter */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3">Statut</h4>
        <div className="space-y-2">
          {[
            { value: 'all', label: 'Tous les statuts' },
            { value: 'En cours', label: 'En cours' },
            { value: 'En attente', label: 'En attente' },
            { value: 'Terminé', label: 'Terminé' }
          ].map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                id={`status-${option.value}`}
                name="filterStatus"
                checked={filterStatus === option.value}
                onChange={() => setFilterStatus(option.value)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor={`status-${option.value}`} className="ml-2 text-gray-700">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Sector filter */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3">Secteur</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="sector-all"
              name="filterSector"
              checked={filterSector === 'all'}
              onChange={() => setFilterSector('all')}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="sector-all" className="ml-2 text-gray-700">
              Tous les secteurs
            </label>
          </div>
          
          {sectors.map((sector) => (
            <div key={sector} className="flex items-center">
              <input
                type="radio"
                id={`sector-${sector}`}
                name="filterSector"
                checked={filterSector === sector}
                onChange={() => setFilterSector(sector)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor={`sector-${sector}`} className="ml-2 text-gray-700">
                {sector}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Reset filters button */}
      <button
        onClick={() => {
          setSortBy('newest');
          setFilterStatus('all');
          setFilterSector('all');
        }}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Réinitialiser les filtres
      </button>
    </div>
  </motion.div>
);

// Main ProjectsPage component
const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSector, setFilterSector] = useState('all');
  
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // Fetch projects
  useEffect(() => {
    fetchProjects();
    
    // Focus search input on page load with a slight delay
    const timer = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/projects/');
      console.log('API Response:', response.data);
      setProjects(response.data || []);
    } catch (error) {
      console.error('Error response:', error.response);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet?')) {
      try {
        await api.delete(`/projects/${projectId}/`);
        // Refresh projects list after deletion
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleCreateProject = () => {
    navigate("/entrepreneur/create-project");
  };

  // Apply filters and sorting
  const filteredAndSortedProjects = React.useMemo(() => {
    if (!Array.isArray(projects)) return [];
    
    let result = [...projects];
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(project => project.status === filterStatus);
    }
    
    // Apply sector filter
    if (filterSector !== 'all') {
      result = result.filter(project => project.sector === filterSector);
    }
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(project => 
        project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.sector && project.sector.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'oldest':
        return result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'budget-high':
        return result.sort((a, b) => (b.estimated_budget || 0) - (a.estimated_budget || 0));
      case 'budget-low':
        return result.sort((a, b) => (a.estimated_budget || 0) - (b.estimated_budget || 0));
      case 'alphabetical':
        return result.sort((a, b) => a.project_name.localeCompare(b.project_name));
      default:
        return result;
    }
  }, [projects, searchTerm, sortBy, filterStatus, filterSector]);
  
  // Get unique sectors for filter
  const sectors = React.useMemo(() => {
    if (!Array.isArray(projects)) return [];
    return [...new Set(projects.map(project => project.sector).filter(Boolean))];
  }, [projects]);

  return (
    <EntrepreneurLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header with stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Projets</h1>
              <p className="text-gray-600">Gérez et suivez vos projets communautaires</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateProject}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2"/>
              Nouveau Projet
            </motion.button>
          </div>
          
          {/* Stats cards */}
          {Array.isArray(projects) && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-xl shadow-md p-4 border-l-4 border-emerald-500"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Projets totaux</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{projects.length}</p>
                  </div>
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <FileText className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">En cours</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {projects.filter(p => p.status === 'En cours').length}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">En attente</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {projects.filter(p => p.status === 'En attente').length}
                </p>
              </div>
              <div className="bg-red-100 p-2 rounded-lg">
                <HelpCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>

    {/* Search and filter bar */}
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Rechercher des projets..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filtres
          </button>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
            >
              <option value="newest">Plus récent</option>
              <option value="oldest">Plus ancien</option>
              <option value="budget-high">Budget (élevé)</option>
              <option value="budget-low">Budget (faible)</option>
              <option value="alphabetical">Ordre alphabétique</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Projects grid */}
    {isLoading ? (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    ) : filteredAndSortedProjects.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={handleDeleteProject}
            onViewDetails={setSelectedProject}
          />
        ))}
      </div>
    ) : (
      <EmptyState onCreateProject={handleCreateProject} />
    )}

    {/* Project details modal */}
    {selectedProject && (
      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    )}

    {/* Filter sidebar */}
    <FilterSidebar
      showFilters={showFilters}
      setShowFilters={setShowFilters}
      sortBy={sortBy}
      setSortBy={setSortBy}
      filterStatus={filterStatus}
      setFilterStatus={setFilterStatus}
      filterSector={filterSector}
      setFilterSector={setFilterSector}
      sectors={sectors}
    />
  </div>
</EntrepreneurLayout>
  
);
};

export default ProjectsPage;