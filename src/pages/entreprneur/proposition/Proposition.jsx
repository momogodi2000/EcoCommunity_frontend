import React, {useEffect, useState} from 'react';
import { FileText, HelpCircle, X, DollarSign, Search, Wrench, MessageCircle, Check, Clock, HelpingHand } from 'lucide-react';
import {proposalService} from "../../../Services/entrepreneur/proposalService.js";
import {Card} from "../../../components/ui/card.jsx";
import toast from "react-hot-toast";
import ProposalProgress from "./progressBar.jsx";
import ProposalDetailModal from "./PropositionModal.jsx";
import EntrepreneurLayout from "../../Layout/EntrepreneurLayout.jsx";

const HelpPage = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [requestAmounts, setRequestAmounts] = useState({});
    const [selectedProposal, setSelectedProposal] = useState(null);

    // Fetch proposals data based on activeFilter
    useEffect(() => {
        fetchProposals();
    }, [activeFilter]);

    const transformProposal = (proposal, type) => {
        // Extract help request details more safely
        const helpRequest = proposal.help_request || {};
        const helpRequestDetails = proposal.help_request_details || {};
        const projectDetails = helpRequest.project || {};

        return {
            id: proposal.id,
            type: type,
            helpRequestId: helpRequest.id,
            projectName: helpRequestDetails.project_name || "Projet sans nom",
            description: helpRequestDetails.specific_need || proposal.proposed_approach || "Aucune description",
            investor: proposal.investor_name || "Investisseur anonyme",
            mentor: proposal.investor_name || "Mentor anonyme",
            status: proposal.status || 'pending',
            submissionDate: new Date(proposal.created_at).toLocaleDateString(),

            // Financial specific fields
            ...(type === 'financial' && {
                amount: parseFloat(proposal.investment_amount) || 0,
                investmentType: proposal.investment_type,
                requestedAmount: parseFloat(helpRequestDetails.amount_requested) || 0,
                paymentSchedule: proposal.payment_schedule,
                expectedReturn: proposal.expected_return,
                investment_amount: proposal.investment_amount,
            }),

            // Technical specific fields
            ...(type === 'technical' && {
                expertise: proposal.expertise,
                experience_level: proposal.experience_level,
                availability: proposal.availability,
                proposed_approach: proposal.proposed_approach,
                additional_resources: proposal.additional_resources,
                support_duration: proposal.support_duration,
                expected_outcomes: proposal.expected_outcomes,
            }),

            // Common additional fields
            additional_terms: proposal.additional_terms,
            created_at: proposal.created_at,
        };
    };

    const fetchProposals = async () => {
        try {
            setLoading(true);
            const type = activeFilter === 'all' ? null : activeFilter;
            const response = await proposalService.getProposals(type);

            let transformedProposals = [];
            if (type === null) {
                transformedProposals = [
                    ...response.financial_proposals.map(p => transformProposal(p, 'financial')),
                    ...response.technical_proposals.map(p => transformProposal(p, 'technical'))
                ];
            } else {
                transformedProposals = response.map(p => transformProposal(p, type));
            }

            // Get unique help request IDs for financial proposals only
            const uniqueHelpRequests = [...new Set(transformedProposals
                .filter(p => p.type === 'financial')
                .map(p => p.helpRequestId))];

            // Fetch amounts for each help request
            const amounts = {};
            for (const helpRequestId of uniqueHelpRequests) {
                if (helpRequestId) {  // Only fetch if helpRequestId exists
                    const amountData = await proposalService.getAcceptedAmount(helpRequestId);
                    amounts[helpRequestId] = amountData;
                }
            }

            setRequestAmounts(amounts);
            setProposals(transformedProposals);
            setError(null);
        } catch (err) {
            console.error('Error fetching proposals:', err);
            setError('Failed to fetch proposals');
        } finally {
            setLoading(false);
        }
    };

    const handleProposalAction = async (proposalId, type, action) => {
        try {
            const status = action === 'accept' ? 'accepted' : 'refused';
            await proposalService.updateProposalStatus(proposalId, type, status);
            await fetchProposals(); // Refresh proposals and amounts
            toast.success(`Proposition ${status === 'accepted' ? 'acceptée' : 'refusée'} avec succès`);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'refused':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'accepted':
                return <Check className="h-4 w-4 mr-1" />;
            case 'refused':
                return <X className="h-4 w-4 mr-1" />;
            default:
                return <Clock className="h-4 w-4 mr-1" />;
        }
    };

    const getFilteredProposals = () => {
        return proposals.filter(proposal => {
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                return (
                    proposal.description.toLowerCase().includes(searchLower) ||
                    proposal.projectName.toLowerCase().includes(searchLower) ||
                    (proposal.type === 'financial' ? proposal.investor : proposal.mentor).toLowerCase().includes(searchLower)
                );
            }
            return true;
        });
    };

    const renderProgressBar = (proposal) => {
        return <ProposalProgress proposal={proposal} requestAmounts={requestAmounts} />;
    };

    return (
        <EntrepreneurLayout>
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Propositions d'aide reçues</h1>
                        <p className="text-gray-600">Gérez les propositions d'aide pour vos projets</p>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    </div>
                ) : error ? (
                    <Card className="p-8 text-center">
                        <div className="max-w-md mx-auto">
                            <X className="h-16 w-16 text-red-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Erreur</h3>
                            <p className="text-gray-600">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                            >
                                Réessayer
                            </button>
                        </div>
                    </Card>
                ) : (
                    <>
                        {/* Filters and Search */}
                        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setActiveFilter('all')}
                                        className={`px-4 py-2 rounded-lg ${
                                            activeFilter === 'all'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        Toutes les propositions
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('financial')}
                                        className={`px-4 py-2 rounded-lg flex items-center ${
                                            activeFilter === 'financial'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        <DollarSign className="h-4 w-4 mr-2"/>
                                        Aide Financière
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('technical')}
                                        className={`px-4 py-2 rounded-lg flex items-center ${
                                            activeFilter === 'technical'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        <Wrench className="h-4 w-4 mr-2"/>
                                        Support Technique
                                    </button>
                                </div>
                                <div className="relative w-full md:w-64">
                                    <input
                                        type="text"
                                        placeholder="Rechercher une proposition..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                                </div>
                            </div>
                        </div>

                        {/* Proposals Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {getFilteredProposals().map((proposal) => (
                                <div key={proposal.id}
                                     className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        proposal.type === 'financial'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {proposal.type === 'financial' ? (
                                            <span className="flex items-center">
                                                <DollarSign className="h-4 w-4 mr-1"/>
                                                Financier
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                <Wrench className="h-4 w-4 mr-1"/>
                                                Technique
                                            </span>
                                        )}
                                    </span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusStyle(proposal.status)}`}>
                                        {getStatusIcon(proposal.status)}
                                                {proposal.status === 'accepted' ? 'Acceptée' :
                                                    proposal.status === 'refused' ? 'Refusée' : 'En attente'}
                                    </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {proposal.projectName}
                                        </h3>

                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {proposal.description}
                                        </p>

                                        {proposal.type === 'financial' && renderProgressBar(proposal)}

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-gray-600">
                                                <FileText className="h-4 w-4 mr-2 text-emerald-500"/>
                                                <span className="text-sm">
                                            {proposal.type === 'financial' ? proposal.investor : proposal.mentor}
                                        </span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <HelpCircle className="h-4 w-4 mr-2 text-emerald-500"/>
                                                <span className="text-sm">Reçue le {proposal.submissionDate}</span>
                                            </div>
                                        </div>

                                        {proposal.status === 'pending' && (
                                            <div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleProposalAction(proposal.id, proposal.type, 'accept')}
                                                        className="flex-1 flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                                                    >
                                                        <Check className="h-4 w-4 mr-2"/>
                                                        Accepter
                                                    </button>
                                                    <button
                                                        onClick={() => handleProposalAction(proposal.id, proposal.type, 'refuse')}
                                                        className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                                                    >
                                                        <X className="h-4 w-4 mr-2"/>
                                                        Refuser
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedProposal(proposal)}
                                                    className="w-full mt-3 flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                                                >
                                                    <MessageCircle className="h-4 w-4 mr-2"/>
                                                    Voir les détails
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty State */}
                        {getFilteredProposals().length === 0 && (
                            <div className="text-center py-12">
                                <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
                                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune proposition
                                        trouvée</h3>
                                    <p className="text-gray-600">
                                        {searchQuery
                                            ? "Aucune proposition ne correspond à votre recherche"
                                            : "Vous n'avez pas encore reçu de propositions d'aide"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}
                {selectedProposal && (
                    <ProposalDetailModal
                        proposal={selectedProposal}
                        onClose={() => setSelectedProposal(null)}
                    />
                )}
            </div>
        </EntrepreneurLayout>
    );
};

export default HelpPage;