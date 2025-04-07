import React, {useEffect, useState} from 'react';
import {FileText, HelpCircle, Info, Users, Calendar, BarChart2, Settings, LogOut, Menu, X, DollarSign, Search, Wrench, Mail, Phone, Building, Filter, HelpingHand, Download, ChevronDown, ChevronUp, Eye, MessageCircle } from 'lucide-react';
import {Card} from "../../../components/ui/card.jsx";
import api from "../../../Services/api.js";
import InvestorStats from "./stats.jsx";
import EntrepreneurGroupedCollaborations from "./GroupCollaboration.jsx";
import EntrepreneurLayout from "../../Layout/EntrepreneurLayout.jsx";

const CollaboratorPage = () => {
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiStats, setApiStats] = useState(null);
    const [groupedCollabs, setGroupedCollabs] = useState({});

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/collaborations/');

            // Set the API stats
            setApiStats(response.data.stats);

            // Group the collaborations
            const grouped = response.data.collaborations.reduce((acc, collab) => {
                const entrepreneurId = collab.entrepreneur_details.id;

                if (!acc[entrepreneurId]) {
                    acc[entrepreneurId] = {
                        entrepreneur: collab.entrepreneur_details,
                        collaborations: [],
                        totalInvestment: 0
                    };
                }

                acc[entrepreneurId].collaborations.push(collab);
                if (collab.collaboration_type === 'financial' && collab.contract_details?.investment_amount) {
                    acc[entrepreneurId].totalInvestment += parseFloat(collab.contract_details.investment_amount);
                }

                return acc;
            }, {});

            setGroupedCollabs(grouped);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <EntrepreneurLayout>
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Collaborateurs</h1>
                        <p className="text-gray-600">Gérez vos partenaires financiers et techniques</p>
                    </div>
                </div>

                {/* Content Rendering Logic */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    </div>
                ) : error ? (
                    <Card className="p-8 text-center">
                        <div className="max-w-md mx-auto">
                            <X className="h-16 w-16 text-red-400 mx-auto mb-4"/>
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
                        {/* Stats Component */}
                        <InvestorStats
                            collaborationsData={groupedCollabs}
                            apiStats={apiStats}
                        />

                        {/* Grouped Collaborations Component */}
                        <EntrepreneurGroupedCollaborations
                            groupedCollabs={groupedCollabs}
                            onRefresh={fetchData}
                        />
                    </>
                )}
            </div>
        </EntrepreneurLayout>
    );
};

export default CollaboratorPage;