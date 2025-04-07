// src/components/ProjectModal.js
import React from 'react';
import { X, ArrowRight, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import agricultureImage from '../assets/agriculture.jpg';
import artisanImage from '../assets/artisant.png';
import educationImage from '../assets/education.jpeg';

const ProjectModal = ({ isOpen, onClose, type }) => {
  const featuredProjects = [
    {
      title: "Coopérative Agricole Durable",
      description: "Initiative communautaire pour développer l'agriculture durable dans la région de l'Ouest, avec des techniques innovantes et respectueuses de l'environnement.",
      image: agricultureImage,
      amount: "2.5M FCFA",
      category: "Agriculture",
      progress: 65,
      details: "Ce projet vise à former 200 agriculteurs aux techniques d'agriculture durable, avec un accent sur la rotation des cultures et l'utilisation d'engrais naturels. L'objectif est d'augmenter les rendements de 30% tout en préservant les sols."
    },
    {
      title: "Artisanat Local Digital",
      description: "Plateforme de vente en ligne pour les artisans traditionnels du Cameroun, mettant en valeur le savoir-faire local et créant des opportunités d'exportation.",
      image: artisanImage,
      amount: "1.8M FCFA",
      category: "Artisanat",
      progress: 45,
      details: "Notre plateforme connecte plus de 150 artisans avec des marchés internationaux, préservant les techniques traditionnelles tout en augmentant leurs revenus de 50% en moyenne."
    },
    {
      title: "Éducation Numérique Rurale",
      description: "Programme d'accès à l'éducation numérique dans les zones rurales, réduisant la fracture numérique et offrant des opportunités d'apprentissage aux jeunes défavorisés.",
      image: educationImage,
      amount: "3.2M FCFA",
      category: "Éducation",
      progress: 80,
      details: "Nous avons équipé 15 écoles rurales avec des tablettes et du contenu éducatif numérique, touchant plus de 1 200 élèves. Le programme inclut également la formation des enseignants."
    }
  ];

  const services = [
    {
      title: "Création de Projets",
      description: "Publiez vos projets communautaires, partagez votre vision et trouvez le soutien nécessaire pour réussir.",
      features: [
        "Création de page de projet personnalisée",
        "Outils de planification financière",
        "Support technique continu",
        "Visibilité auprès des investisseurs"
      ],
      details: "Notre plateforme vous guide étape par étape dans la création de votre projet, avec des modèles personnalisables et des conseils d'experts pour maximiser vos chances de succès."
    },
    {
      title: "Mise en Réseau",
      description: "Connectez-vous avec des investisseurs, experts et partenaires potentiels pour développer votre projet.",
      features: [
        "Événements de networking",
        "Mentorat personnalisé",
        "Connexion avec des investisseurs",
        "Partage de compétences"
      ],
      details: "Nous organisons régulièrement des événements en ligne et en présentiel pour faciliter les rencontres entre porteurs de projets et investisseurs, avec un taux de matching de 75%."
    },
    {
      title: "Suivi d'Impact",
      description: "Mesurez et visualisez l'impact de vos projets sur votre communauté grâce à nos outils analytiques.",
      features: [
        "Tableaux de bord personnalisés",
        "Rapports d'impact détaillés",
        "Métriques de performance",
        "Analyse des retombées sociales"
      ],
      details: "Nos outils vous permettent de suivre en temps réel l'impact de votre projet, avec des indicateurs clés adaptés à votre domaine d'activité et des rapports automatisés pour vos partenaires."
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={onClose}>
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <motion.div
              className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {type === 'projects' ? 'Tous Nos Projets' : 'Détails du Service'}
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div className="mt-4">
                  {type === 'projects' ? (
                    <div className="space-y-8">
                      {featuredProjects.map((project, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/3">
                              <img 
                                src={project.image} 
                                alt={project.title} 
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <div className="mt-4 flex justify-between items-center">
                                <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                  {project.category}
                                </span>
                                <span className="text-emerald-600 font-bold">{project.amount}</span>
                              </div>
                            </div>
                            <div className="md:w-2/3">
                              <h4 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h4>
                              <p className="text-gray-600 mb-4">{project.description}</p>
                              <p className="text-gray-700 mb-4">{project.details}</p>
                              
                              <div className="mb-4">
                                <div className="flex justify-between items-center mb-1">
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
                              
                              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700">
                                Soutenir ce projet <ArrowRight size={16} className="ml-2" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {services.map((service, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                          <h4 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h4>
                          <p className="text-gray-600 mb-4">{service.description}</p>
                          <p className="text-gray-700 mb-4">{service.details}</p>
                          
                          <h5 className="font-medium text-gray-900 mb-2">Fonctionnalités:</h5>
                          <ul className="space-y-2 mb-4">
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
                          
                          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700">
                            En savoir plus <ChevronRight size={16} className="ml-2" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;