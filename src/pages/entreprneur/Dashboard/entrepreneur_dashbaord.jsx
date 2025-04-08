import React, { useState, useEffect } from 'react';
import { 
  ChartPie, ChartLine, Users, PlusCircle, Calendar, BookOpen, 
  CreditCard, TrendingUp, MessageCircle, Award, Briefcase, 
  Globe, MapPin, Activity, Zap, CheckCircle, AlertCircle, Layers,
  Plus, FileText, BarChart2
} from 'lucide-react';
import EntrepreneurLayout from '../../Layout/EntrepreneurLayout';
import { LineChart, Line, PieChart, Pie, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis, CartesianGrid } from 'recharts';
import { 
  getEntrepreneurDashboard, 
  getEntrepreneurProjects,
  getEntrepreneurHelpRequests,
  getEntrepreneurContracts,
  getEntrepreneurCollaborations,
  createProject,
  createHelpRequest,
  signContract
} from '../../../Services/entrepreneur/statistic';

const DashboardEntrepreneur = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      activeProjects: 0,
      funding: 0,
      partners: 0,
      socialImpact: 0
    },
    financingData: [],
    projectStatusData: [],
    recentProjects: [],
    upcomingEvents: [],
    notifications: [],
    helpRequests: [],
    contracts: [],
    collaborations: []
  });
  
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [newHelpRequestModalOpen, setNewHelpRequestModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    sector: '',
    fundingGoal: ''
  });
  const [helpRequestForm, setHelpRequestForm] = useState({
    title: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [
          dashboard, 
          projects, 
          helpRequests, 
          contracts, 
          collaborations
        ] = await Promise.all([
          getEntrepreneurDashboard(),
          getEntrepreneurProjects(),
          getEntrepreneurHelpRequests(),
          getEntrepreneurContracts(),
          getEntrepreneurCollaborations()
        ]);

        // Process and merge all data
        const processedData = {
          stats: {
            activeProjects: dashboard?.stats?.activeProjects || 0,
            funding: dashboard?.stats?.funding || 0,
            partners: dashboard?.stats?.partners || 0,
            socialImpact: dashboard?.stats?.socialImpact || 0
          },
          financingData: dashboard?.financingData || Array(6).fill().map((_, i) => ({ 
            name: `Mois ${i+1}`, 
            amount: Math.floor(Math.random() * 500000) 
          })),
          projectStatusData: dashboard?.projectStatusData || [
            { name: 'En cours', value: 5 },
            { name: 'Financé', value: 2 },
            { name: 'En attente', value: 3 }
          ],
          recentProjects: projects || Array(3).fill().map((_, i) => ({
            id: i,
            name: `Projet ${i+1}`,
            sector: 'Agriculture',
            status: i % 3 === 0 ? 'En cours' : i % 3 === 1 ? 'Financé' : 'En attente',
            funding: `${(i + 3) * 10}%`
          })),
          upcomingEvents: dashboard?.upcomingEvents || Array(2).fill().map((_, i) => ({
            id: i,
            title: `Formation Entrepreneuriale ${i+1}`,
            date: `${new Date().getDate() + i + 1}/04/2025`,
            location: 'Yaoundé, Cameroun'
          })),
          notifications: dashboard?.notifications || Array(3).fill().map((_, i) => ({
            id: i,
            message: `Notification ${i+1}: Mise à jour de votre dossier de financement.`,
            time: 'il y a 2 heures',
            isNew: i === 0
          })),
          helpRequests: helpRequests || [],
          contracts: contracts || [],
          collaborations: collaborations || []
        };
        
        setDashboardData(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Impossible de charger les données. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleCreateProject = async () => {
    try {
      setLoading(true);
      const newProject = await createProject(projectForm);
      setDashboardData(prev => ({
        ...prev,
        recentProjects: [newProject, ...prev.recentProjects],
        stats: {
          ...prev.stats,
          activeProjects: prev.stats.activeProjects + 1
        }
      }));
      setNewProjectModalOpen(false);
      setProjectForm({
        name: '',
        description: '',
        sector: '',
        fundingGoal: ''
      });
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Erreur lors de la création du projet');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHelpRequest = async () => {
    try {
      setLoading(true);
      const newRequest = await createHelpRequest(helpRequestForm);
      setDashboardData(prev => ({
        ...prev,
        helpRequests: [newRequest, ...prev.helpRequests]
      }));
      setNewHelpRequestModalOpen(false);
      setHelpRequestForm({
        title: '',
        description: '',
        category: ''
      });
    } catch (error) {
      console.error('Error creating help request:', error);
      setError('Erreur lors de la création de la demande d\'aide');
    } finally {
      setLoading(false);
    }
  };

  const handleSignContract = async (contractId) => {
    try {
      setLoading(true);
      const updatedContract = await signContract(contractId);
      setDashboardData(prev => ({
        ...prev,
        contracts: prev.contracts.map(contract => 
          contract.id === contractId ? updatedContract : contract
        )
      }));
    } catch (error) {
      console.error('Error signing contract:', error);
      setError('Erreur lors de la signature du contrat');
    } finally {
      setLoading(false);
    }
  };

  // Animation for statistical cards
  const fadeIn = (delay) => {
    return {
      opacity: loading ? 0 : 1,
      transform: loading ? 'translateY(20px)' : 'translateY(0)',
      transition: `opacity 0.5s ease-in-out ${delay}s, transform 0.5s ease-in-out ${delay}s`
    };
  };

  // Format number as currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Custom Pie Chart colors
  const COLORS = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'];

  return (
    <EntrepreneurLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Tableau de Bord
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Bienvenue, Madeleine Ekambi. Voici l'aperçu de vos activités entrepreneuriales.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button 
              type="button" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <Calendar className="h-4 w-4 mr-2" /> 
              Calendrier
            </button>
            <button 
              type="button" 
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              onClick={() => setNewProjectModalOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" /> 
              Nouveau Projet
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
            {['overview', 'projects', 'financing', 'network', 'resources', 'contracts', 'collaborations', 'help'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab 
                    ? 'border-emerald-500 text-emerald-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab === 'overview' && 'Vue d\'ensemble'}
                {tab === 'projects' && 'Mes Projets'}
                {tab === 'financing' && 'Financement'}
                {tab === 'network' && 'Réseau'}
                {tab === 'resources' && 'Ressources'}
                {tab === 'contracts' && 'Contrats'}
                {tab === 'collaborations' && 'Collaborations'}
                {tab === 'help' && 'Demandes d\'aide'}
              </button>
            ))}
          </nav>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Overview Content */}
        {activeTab === 'overview' && (
          <div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
              </div>
            ) : (
              <>
                {/* Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {/* Stat Card 1 */}
                  <div className="bg-white overflow-hidden shadow-md rounded-lg" style={fadeIn(0.1)}>
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-emerald-500 rounded-md p-3">
                          <Briefcase className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Projets Actifs</dt>
                            <dd className="text-3xl font-semibold text-gray-900">{dashboardData.stats.activeProjects}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">Voir les détails</a>
                      </div>
                    </div>
                  </div>

                  {/* Stat Card 2 */}
                  <div className="bg-white overflow-hidden shadow-md rounded-lg" style={fadeIn(0.2)}>
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-emerald-600 rounded-md p-3">
                          <CreditCard className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Financement Obtenu</dt>
                            <dd className="text-3xl font-semibold text-gray-900">{formatCurrency(dashboardData.stats.funding)}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">Voir les détails</a>
                      </div>
                    </div>
                  </div>

                  {/* Stat Card 3 */}
                  <div className="bg-white overflow-hidden shadow-md rounded-lg" style={fadeIn(0.3)}>
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-emerald-700 rounded-md p-3">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Partenaires</dt>
                            <dd className="text-3xl font-semibold text-gray-900">{dashboardData.stats.partners}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">Voir les détails</a>
                      </div>
                    </div>
                  </div>

                  {/* Stat Card 4 */}
                  <div className="bg-white overflow-hidden shadow-md rounded-lg" style={fadeIn(0.4)}>
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-emerald-500 rounded-md p-3">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Impact Social</dt>
                            <dd className="text-3xl font-semibold text-gray-900">{dashboardData.stats.socialImpact}%</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">Voir les détails</a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Financing Chart */}
                  <div className="bg-white shadow-md rounded-lg p-6" style={fadeIn(0.5)}>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution du Financement</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={dashboardData.financingData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatCurrency(value)} />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="amount" 
                            stroke="#10B981" 
                            strokeWidth={2} 
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Project Status Chart */}
                  <div className="bg-white shadow-md rounded-lg p-6" style={fadeIn(0.6)}>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Statut des Projets</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dashboardData.projectStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#10B981"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {dashboardData.projectStatusData.map((entry, index) => (
                              <React.Fragment key={`cell-${index}`}>
                                {entry.value > 0 && (
                                  <cell fill={COLORS[index % COLORS.length]} />
                                )}
                              </React.Fragment>
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => value} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Recent Projects Table */}
                <div className="bg-white shadow-md rounded-lg mb-8" style={fadeIn(0.7)}>
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Projets Récents</h3>
                    <button 
                      onClick={() => setActiveTab('projects')}
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
                    >
                      Voir tous les projets
                    </button>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <div className="overflow-x-auto">
                      {dashboardData.recentProjects.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nom du Projet
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Secteur
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Financement
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {dashboardData.recentProjects.slice(0, 3).map((project) => (
                              <tr key={project.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {project.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {project.sector}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    project.status === 'En cours' ? 'bg-emerald-100 text-emerald-800' :
                                    project.status === 'Financé' ? 'bg-green-100 text-green-800' :
                                    project.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {project.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                      className={`${
                                        project.status === 'Financé' ? 'bg-green-600' : 'bg-emerald-600'
                                      } h-2.5 rounded-full`} 
                                      style={{ width: project.funding }}
                                    ></div>
                                  </div>
                                  <span className="text-xs mt-1 block">{project.funding}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button className="text-emerald-600 hover:text-emerald-900 mr-3">Éditer</button>
                                  <button className="text-emerald-600 hover:text-emerald-900">Détails</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-center py-4 text-gray-500">Aucun projet récent.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Side by Side Events and Notifications */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={fadeIn(0.8)}>
                  {/* Upcoming Events */}
                  <div className="bg-white shadow-md rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Événements à venir</h3>
                      <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                        Voir tous les événements
                      </a>
                    </div>
                    <div className="border-t border-gray-200">
                      {dashboardData.upcomingEvents.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {dashboardData.upcomingEvents.map((event) => (
                            <li key={event.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                              <div className="flex items-center">
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-emerald-600 truncate">{event.title}</p>
                                  <div className="mt-2 flex flex-wrap">
                                    <div className="flex items-center text-sm text-gray-500 mr-4 mb-1">
                                      <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                      <p>{event.date}</p>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 mb-1">
                                      <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                      <p>{event.location}</p>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <button 
                                    type="button" 
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                  >
                                    S'inscrire
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-center py-4 text-gray-500">Aucun événement à venir.</p>
                      )}
                    </div>
                  </div>

                  {/* Latest Notifications */}
                  <div className="bg-white shadow-md rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Notifications Récentes</h3>
                      <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                        Voir toutes les notifications
                      </a>
                    </div>
                    <div className="border-t border-gray-200">
                      {dashboardData.notifications.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {dashboardData.notifications.map((notification) => (
                            <li key={notification.id} className={`px-4 py-4 sm:px-6 hover:bg-gray-50 ${notification.isNew ? 'bg-emerald-50' : ''}`}>
                              <div className="flex items-center">
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm text-gray-800">{notification.message}</p>
                                  <div className="mt-1 flex items-center text-sm text-gray-500">
                                    <p>{notification.time}</p>
                                    {notification.isNew && (
                                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                                        Nouveau
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-center py-4 text-gray-500">Aucune notification récente.</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Projects Tab Content */}
        {activeTab === 'projects' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Mes Projets</h3>
              <button
                onClick={() => setNewProjectModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Nouveau Projet
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom du Projet
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Secteur
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Financement
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.recentProjects.length > 0 ? (
                      dashboardData.recentProjects.map((project) => (
                        <tr key={project.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {project.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {project.sector}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              project.status === 'En cours' ? 'bg-emerald-100 text-emerald-800' :
                              project.status === 'Financé' ? 'bg-green-100 text-green-800' :
                              project.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`${
                                  project.status === 'Financé' ? 'bg-green-600' : 'bg-emerald-600'
                                } h-2.5 rounded-full`} 
                                style={{ width: project.funding }}
                              ></div>
                            </div>
                            <span className="text-xs mt-1 block">{project.funding}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-emerald-600 hover:text-emerald-900 mr-3">Éditer</button>
                            <button className="text-emerald-600 hover:text-emerald-900">Détails</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          Aucun projet trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Financing Tab Content */}
        {activeTab === 'financing' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Options de Financement</h3>
            <p className="text-gray-600 mb-6">Explorez les opportunités de financement disponibles pour vos projets.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Financing Chart */}
              <div className="col-span-1 md:col-span-2 bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution du Financement</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dashboardData.financingData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#10B981" 
                        strokeWidth={2} 
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Financing Options */}
              <div className="border rounded-lg p-5 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <CreditCard className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">Subventions</h4>
                    <p className="text-sm text-gray-500">Financement non-remboursable pour projets à impact social</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>Montants disponibles: 5M-15M XAF</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>Pas de remboursement requis</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>Processus de sélection compétitif</span>
                  </li>
                </ul>
                <button className="w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700">
                  Découvrir les subventions
                </button>
              </div>
              
              <div className="border rounded-lg p-5 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">Prêts</h4>
                    <p className="text-sm text-gray-500">Financement remboursable à des taux préférentiels</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>Montants disponibles: 10M-50M XAF</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>Taux d'intérêt réduits (3-5%)</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>Période de grâce de 6-12 mois</span>
                  </li>
                </ul>
                <button className="w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700">
                  Explorer les prêts
                </button>
              </div>
            </div>
            
            <h4 className="text-md font-medium text-gray-900 mb-2">Prochaines échéances</h4>
            <div className="border rounded-lg overflow-hidden shadow-sm mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Opportunité
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date limite
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Fonds Impact Afrique
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Subvention
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      15/04/2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-emerald-600 hover:text-emerald-900">Postuler</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Crédit Agricole Cameroun
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        Prêt
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      30/04/2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-emerald-600 hover:text-emerald-900">Postuler</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Network Tab Content */}
        {activeTab === 'network' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Mon Réseau</h3>
            <p className="text-gray-600 mb-6">Connectez-vous avec d'autres entrepreneurs, mentors et investisseurs.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="border rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-center bg-emerald-100 rounded-full w-16 h-16 mx-auto mb-4">
                  <Users className="h-8 w-8 text-emerald-600" />
                </div>
                <h4 className="text-center font-medium text-gray-900 mb-1">Entrepreneurs</h4>
                <p className="text-center text-gray-500 mb-3">Connectez-vous avec d'autres entrepreneurs locaux</p>
                <button className="w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700">
                  Explorer
                </button>
              </div>
              
              <div className="border rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-center bg-emerald-100 rounded-full w-16 h-16 mx-auto mb-4">
                  <Award className="h-8 w-8 text-emerald-600" />
                </div>
                <h4 className="text-center font-medium text-gray-900 mb-1">Mentors</h4>
                <p className="text-center text-gray-500 mb-3">Trouvez des mentors expérimentés dans votre secteur</p>
                <button className="w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700">
                  Trouver un mentor
                </button>
              </div>
              
              <div className="border rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-center bg-emerald-100 rounded-full w-16 h-16 mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-emerald-600" />
                </div>
                <h4 className="text-center font-medium text-gray-900 mb-1">Investisseurs</h4>
                <p className="text-center text-gray-500 mb-3">Connectez-vous avec des investisseurs potentiels</p>
                <button className="w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700">
                  Contacter
                </button>
              </div>
            </div>
            
            <h4 className="text-md font-medium text-gray-900 mb-4">Événements de Networking</h4>
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <ul className="divide-y divide-gray-200">
                {dashboardData.upcomingEvents.map((event, index) => (
                  <li key={index} className="px-6 py-4 flex items-center">
                    <div className="mr-4 flex-shrink-0 bg-emerald-100 rounded-md h-12 w-12 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                      <div className="mt-1 flex items-center">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-500 mr-4">{event.date}</p>
                        <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-500">{event.location}</p>
                      </div>
                    </div>
                    <div>
                      <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                        S'inscrire
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Resources Tab Content */}
        {activeTab === 'resources' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ressources</h3>
            <p className="text-gray-600 mb-6">Accédez à des formations, guides et outils pour développer votre entreprise.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-emerald-500" />
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-1">Guide du Business Plan</h4>
                  <p className="text-sm text-gray-500 mb-4">Apprenez à rédiger un business plan convaincant pour attirer des investisseurs.</p>
                  <button className="w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700">
                    Télécharger
                  </button>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  <MessageCircle className="h-12 w-12 text-emerald-500" />
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-1">Pitch Perfect</h4>
                  <p className="text-sm text-gray-500 mb-4">Formation vidéo sur l'art de présenter efficacement votre projet.</p>
                  <button className="w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700">
                    Regarder
                  </button>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-emerald-500" />
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-1">Modèles de Documents</h4>
                  <p className="text-sm text-gray-500 mb-4">Téléchargez des modèles de documents juridiques et administratifs.</p>
                  <button className="w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700">
                    Accéder
                  </button>
                </div>
              </div>
            </div>
            
            <h4 className="text-md font-medium text-gray-900 mb-4">Formations Recommandées</h4>
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <ul className="divide-y divide-gray-200">
                <li className="p-4 flex">
                  <div className="mr-4 flex-shrink-0 bg-emerald-100 rounded-md h-12 w-12 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-900">Gestion Financière pour Entrepreneurs</h5>
                    <p className="mt-1 text-sm text-gray-500">Formation en ligne de 5 heures sur les principes de base de la gestion financière.</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                        Gratuit
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 ml-2">
                        5 heures
                      </span>
                    </div>
                  </div>
                </li>
                <li className="p-4 flex">
                  <div className="mr-4 flex-shrink-0 bg-emerald-100 rounded-md h-12 w-12 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-900">Marketing Digital pour Petites Entreprises</h5>
                    <p className="mt-1 text-sm text-gray-500">Comment développer votre présence en ligne et attirer des clients.</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Premium
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 ml-2">
                        8 heures
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Contracts Tab Content */}
        {activeTab === 'contracts' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Mes Contrats</h3>
            <p className="text-gray-600 mb-6">Gérez vos contrats avec des partenaires et investisseurs.</p>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contrat
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Partenaire
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date de création
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.contracts.length > 0 ? (
                      dashboardData.contracts.map((contract) => (
                        <tr key={contract.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {contract.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {contract.partner}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {contract.createdDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              contract.status === 'Signé' ? 'bg-green-100 text-green-800' :
                              contract.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {contract.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {contract.status === 'En attente' && (
                              <button 
                                onClick={() => handleSignContract(contract.id)}
                                className="text-emerald-600 hover:text-emerald-900 mr-3"
                              >
                                Signer
                              </button>
                            )}
                            <button className="text-emerald-600 hover:text-emerald-900">Voir</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          Aucun contrat trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Collaborations Tab Content */}
        {activeTab === 'collaborations' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Mes Collaborations</h3>
            <p className="text-gray-600 mb-6">Vos collaborations actuelles avec d'autres entrepreneurs.</p>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.collaborations.length > 0 ? (
                  dashboardData.collaborations.map((collab) => (
                    <div key={collab.id} className="border rounded-lg overflow-hidden shadow-sm">
                      <div className="p-4 bg-gray-50 border-b">
                        <h4 className="font-medium text-emerald-700">{collab.project}</h4>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <Users className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600">{collab.partner}</span>
                        </div>
                        <div className="flex items-center mb-3">
                          <Briefcase className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600">{collab.role}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            collab.status === 'Active' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {collab.status}
                          </span>
                          <button className="text-sm text-emerald-600 hover:text-emerald-800">Détails</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-4 text-gray-500">
                    Aucune collaboration active.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Help Requests Tab Content */}
        {activeTab === 'help' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Mes Demandes d'Aide</h3>
              <button
                onClick={() => setNewHelpRequestModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Nouvelle Demande
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Titre
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.helpRequests.length > 0 ? (
                      dashboardData.helpRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {request.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              request.status === 'Résolu' ? 'bg-green-100 text-green-800' :
                              request.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-emerald-600 hover:text-emerald-900 mr-3">Éditer</button>
                            <button className="text-emerald-600 hover:text-emerald-900">Détails</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          Aucune demande d'aide trouvée.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* New Project Modal */}
        {newProjectModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100">
                    <PlusCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Nouveau Projet</h3>
                    <div className="mt-2">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 text-left">
                            Nom du projet
                          </label>
                          <input
                            type="text"
                            id="project-name"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            value={projectForm.name}
                            onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 text-left">
                            Description
                          </label>
                          <textarea
                            id="project-description"
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            value={projectForm.description}
                            onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                          />
                        </div>
                        <div>
                          <label htmlFor="project-sector" className="block text-sm font-medium text-gray-700 text-left">
                            Secteur d'activité
                          </label>
                          <select
                            id="project-sector"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            value={projectForm.sector}
                            onChange={(e) => setProjectForm({...projectForm, sector: e.target.value})}
                          >
                            <option value="">Sélectionnez un secteur</option>
                            <option value="Agriculture">Agriculture</option>
                            <option value="Technologie">Technologie</option>
                            <option value="Commerce">Commerce</option>
                            <option value="Services">Services</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="project-funding" className="block text-sm font-medium text-gray-700 text-left">
                            Objectif de financement (XAF)
                          </label>
                          <input
                            type="number"
                            id="project-funding"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            value={projectForm.fundingGoal}
                            onChange={(e) => setProjectForm({...projectForm, fundingGoal: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:col-start-2 sm:text-sm"
                    onClick={handleCreateProject}
                    disabled={loading}
                  >
                    {loading ? 'Création...' : 'Créer le projet'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setNewProjectModalOpen(false)}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Help Request Modal */}
        {newHelpRequestModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100">
                    <MessageCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Nouvelle Demande d'Aide</h3>
                    <div className="mt-2">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="help-title" className="block text-sm font-medium text-gray-700 text-left">
                            Titre
                          </label>
                          <input
                            type="text"
                            id="help-title"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            value={helpRequestForm.title}
                            onChange={(e) => setHelpRequestForm({...helpRequestForm, title: e.target.value})}
                          />
                        </div>
                        <div>
                          <label htmlFor="help-description" className="block text-sm font-medium text-gray-700 text-left">
                            Description
                          </label>
                          <textarea
                            id="help-description"
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            value={helpRequestForm.description}
                            onChange={(e) => setHelpRequestForm({...helpRequestForm, description: e.target.value})}
                          />
                        </div>
                        <div>
                          <label htmlFor="help-category" className="block text-sm font-medium text-gray-700 text-left">
                            Catégorie
                          </label>
                          <select
                            id="help-category"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            value={helpRequestForm.category}
                            onChange={(e) => setHelpRequestForm({...helpRequestForm, category: e.target.value})}
                          >
                            <option value="">Sélectionnez une catégorie</option>
                            <option value="Financement">Financement</option>
                            <option value="Mentorat">Mentorat</option>
                            <option value="Juridique">Juridique</option>
                            <option value="Technique">Technique</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:col-start-2 sm:text-sm"
                    onClick={handleCreateHelpRequest}
                    disabled={loading}
                  >
                    {loading ? 'Envoi...' : 'Envoyer la demande'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setNewHelpRequestModalOpen(false)}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </EntrepreneurLayout>
  );
};

export default DashboardEntrepreneur;