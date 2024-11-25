import React, { useState, useEffect } from 'react';
import { Activity, ChevronRight, X, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMediaQuery } from 'react-responsive';

const API_BASE_URL = 'https://web-production-2cf89.up.railway.app';

const SimulationDashboard = ({ isVisible, onClose }) => {
    const [countries, setCountries] = useState([]);
    const [commodities, setCommodities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedCommodity, setSelectedCommodity] = useState(null);
    const [simulationResults, setSimulationResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [step, setStep] = useState('country');

    // Responsive breakpoints
    const isMobile = useMediaQuery({ maxWidth: 640 });
    const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1024 });
    const isLaptop = useMediaQuery({ minWidth: 1025, maxWidth: 1440 });

    // Responsive styles
    const styles = {
        container: `fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fadeIn z-[9999]`,
        modal: `w-full max-w-[95vw] sm:max-w-[85vw] md:max-w-[900px] max-h-[90vh] overflow-y-auto 
        bg-gradient-to-br from-gray-900/95 to-black/95 rounded-2xl sm:rounded-3xl 
        p-4 sm:p-6 md:p-8 text-white shadow-2xl border border-gray-700/50 animate-slideUp relative z-[10000]`,
        title: `text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3 
                text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600`,
        gridContainer: `grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4`,
    };

    // Data fetching functions remain the same
    useEffect(() => {
        if (isVisible) {
            fetchCountries();
        }
    }, [isVisible]);

    useEffect(() => {
        if (selectedCountry) {
            fetchCommodities(selectedCountry);
        }
    }, [selectedCountry]);

    const fetchCountries = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/countries/list`);
            if (!response.ok) throw new Error(`Error fetching countries: ${response.statusText}`);
            const data = await response.json();
            setCountries(Array.isArray(data.countries) ? data.countries : []);
        } catch (error) {
            console.error('Error:', error);
            setError('Error loading countries');
        } finally {
            setLoading(false);
        }
    };

    const fetchCommodities = async (country) => {
        if (!country?.name) {
            setError('Invalid country data');
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${API_BASE_URL}/stats/production/${encodeURIComponent(country.name)}`);
            if (!response.ok) throw new Error(`Error fetching commodities for ${country.name}`);
            const data = await response.json();
            setCommodities(Array.isArray(data.products) ? data.products : []);
        } catch (error) {
            console.error('Error:', error);
            setError(`Error loading commodities for ${country.name}`);
        } finally {
            setLoading(false);
        }
    };
    const fetchSimulation = async (country, commodity) => {
        if (!country || !commodity) {
            setError('Country or commodity not selected');
            return;
        }
    
        setLoading(true);
        setError(null);
    
        try {
            const response = await fetch(
                `${API_BASE_URL}/model/simulation/${encodeURIComponent(country.name)}/${encodeURIComponent(commodity.name)}`
            );
            if (!response.ok) throw new Error('Error fetching simulation data');
            const data = await response.json();
            setSimulationResults(data);
            setStep('results');
        } catch (error) {
            setError(`Error fetching simulation: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }).format(num);
    };
    
    const MetricsCard = ({ metrics }) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
                { label: 'RMSE', value: metrics.rmse, desc: 'Error Cuadrático Medio' },
                { label: 'MAE', value: metrics.mae, desc: 'Error Absoluto Medio' },
                { label: 'R² Score', value: `${(metrics.r2_score * 100).toFixed(2)}%`, desc: 'Coeficiente de Determinación' }
            ].map((metric) => (
                <div key={metric.label} 
                     className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-4 sm:p-6 rounded-xl 
                              border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 
                              transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20">
                    <div className="text-sm text-blue-400 font-medium">{metric.label}</div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-2 mb-1">{formatNumber(metric.value)}</div>
                    <div className="text-xs text-gray-400">{metric.desc}</div>
                </div>
            ))}
        </div>
    );
    
    const LoadingSpinner = () => (
        <div className="flex items-center justify-center p-8 sm:p-12">
            <div className="relative">
                <div className="w-12 sm:w-16 h-12 sm:h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 sm:w-8 h-6 sm:h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                </div>
            </div>
        </div>
    );
    
    const ErrorMessage = ({ message }) => (
        <div className="bg-red-900/30 backdrop-blur-sm border border-red-500/50 p-4 sm:p-6 rounded-xl 
                        flex items-center gap-3 animate-fadeIn">
            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
            <p className="text-sm sm:text-base text-red-200">{message}</p>
        </div>
    );
    
    const ChartContainer = ({ simulationResults }) => (
        <div className="h-[300px] sm:h-[400px] w-full">
            <ResponsiveContainer>
                <LineChart data={simulationResults.simulation_results}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="reduction_percentage"
                        stroke="#9CA3AF"
                        label={isMobile ? null : { value: 'Reducción (%)', position: 'bottom', fill: '#9CA3AF' }}
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <YAxis
                        stroke="#9CA3AF"
                        yAxisId="left"
                        label={isMobile ? null : { value: 'Emisiones (MtCO2e)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                        width={isMobile ? 40 : 60}
                    />
                    <YAxis
                        stroke="#9CA3AF"
                        yAxisId="right"
                        orientation="right"
                        label={isMobile ? null : { value: 'Eficiencia', angle: 90, position: 'insideRight', fill: '#9CA3AF' }}
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                        width={isMobile ? 40 : 60}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                            border: '1px solid rgba(59, 130, 246, 0.5)',
                            borderRadius: '0.5rem',
                            backdropFilter: 'blur(4px)',
                            fontSize: isMobile ? '12px' : '14px'
                        }}
                    />
                    <Legend wrapperStyle={{ fontSize: isMobile ? '12px' : '14px' }} />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="predicted_emissions"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ fill: '#3B82F6', r: isMobile ? 3 : 4 }}
                        activeDot={{ r: isMobile ? 5 : 6, fill: '#60A5FA' }}
                        name="Emisiones Proyectadas"
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="reduction_efficiency"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ fill: '#10B981', r: isMobile ? 3 : 4 }}
                        activeDot={{ r: isMobile ? 5 : 6, fill: '#34D399' }}
                        name="Eficiencia de Reducción"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
    const renderContent = () => {
        if (loading) return <LoadingSpinner />;
        if (error) return <ErrorMessage message={error} />;
    
        switch (step) {
            case 'country':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 animate-fadeIn">
                        {countries.map((country, idx) => (
                            <button
                                key={country.name}
                                onClick={() => {
                                    setSelectedCountry(country);
                                    setStep('commodity');
                                }}
                                className="group p-4 sm:p-6 bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-xl
                                         border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300
                                         transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20"
                                style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.1}s backwards` }}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-base sm:text-lg font-medium">{country.name}</span>
                                    <ChevronRight className="text-blue-400 transform group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </button>
                        ))}
                    </div>
                );
    
            case 'commodity':
                return (
                    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
                        <button
                            onClick={() => {
                                setStep('country');
                                setSelectedCountry(null);
                            }}
                            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <ChevronRight size={16} className="rotate-180" />
                            Volver a países
                        </button>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {commodities.map((commodity, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setSelectedCommodity(commodity);
                                        fetchSimulation(selectedCountry, commodity);
                                    }}
                                    className="group p-4 sm:p-6 bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-xl
                                             border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300
                                             transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20"
                                    style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.1}s backwards` }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-base sm:text-lg font-medium">{commodity.name}</span>
                                        <ChevronRight className="text-blue-400 transform group-hover:translate-x-1 transition-transform duration-300" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );
    
            case 'results':
                return (
                    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
                        <button
                            onClick={() => {
                                setStep('commodity');
                                setSimulationResults(null);
                            }}
                            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <ChevronRight size={16} className="rotate-180" />
                            Volver a commodities
                        </button>
    
                        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-4 sm:p-8 rounded-2xl border border-gray-700/50">
                            <h3 className="text-xl font-semibold mb-6 text-blue-400">Métricas del Modelo</h3>
                            <MetricsCard metrics={simulationResults.model_metrics} />
                        </div>
    
                        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-4 sm:p-8 rounded-2xl border border-gray-700/50">
                            <h3 className="text-xl font-semibold mb-6 text-blue-400">Resultados de la Simulación</h3>
                            <ChartContainer simulationResults={simulationResults} />
                        </div>
    
                        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-4 sm:p-8 rounded-2xl border border-gray-700/50">
                            <h3 className="text-xl font-semibold mb-6 text-blue-400">Recomendaciones</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { label: 'Reducción Óptima', value: `${simulationResults.recommendations.optimal_reduction}%` },
                                    { label: 'Reducción de Emisiones', value: `${formatNumber(simulationResults.recommendations.emissions_reduction)} MtCO2e` },
                                    { label: 'Eficiencia', value: formatNumber(simulationResults.recommendations.reduction_efficiency) },
                                    { label: 'Mejora Porcentual', value: `${formatNumber(simulationResults.recommendations.improvement_percentage)}%` }
                                ].map((item, idx) => (
                                    <div
                                        key={item.label}
                                        className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                                    >
                                        <p className="text-sm text-gray-400 mb-2">{item.label}</p>
                                        <p className="text-xl sm:text-2xl font-bold text-white">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
        }
    };
    
    if (!isVisible) return null;
    
    return (
        <div className={styles.container}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>
                            <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                            Simulador de Emisiones
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">
                            {step === 'country' && 'Selecciona un país para comenzar'}
                            {step === 'commodity' && `Commodities disponibles para ${selectedCountry?.name}`}
                            {step === 'results' && `${selectedCountry?.name} - ${selectedCommodity?.name}`}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-gray-800/50 transition-all duration-300 group"
                        aria-label="Cerrar"
                    >
                        <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-red-400 transition-colors" />
                    </button>
                </div>
    
                {renderContent()}
            </div>
        </div>
    );
    };
    
    const style = document.createElement('style');
    style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { 
            opacity: 0;
            transform: translateY(20px);
        }
        to { 
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-fadeIn {
        animation: fadeIn 0.5s ease-out;
    }
    
    .animate-slideUp {
        animation: slideUp 0.5s ease-out;
    }
    `;
    document.head.appendChild(style);
    
    export default SimulationDashboard;