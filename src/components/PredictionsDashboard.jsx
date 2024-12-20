import React, { useState, useEffect } from 'react';
import { Activity, ChevronRight, X, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMediaQuery } from 'react-responsive';

const API_BASE_URL = 'https://web-production-2cf89.up.railway.app';

const PredictionsDashboard = ({ isVisible, onClose }) => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [predictions, setPredictions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Responsive breakpoints
    const isMobile = useMediaQuery({ maxWidth: 640 });
    const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1024 });

    // Responsive styles
    const styles = {
        container: `fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fadeIn`,
        modal: `w-full max-w-[95vw] sm:max-w-[85vw] md:max-w-[900px] max-h-[90vh] overflow-y-auto 
                bg-gradient-to-br from-slate-900/95 to-black/95 rounded-2xl sm:rounded-3xl 
                p-4 sm:p-6 md:p-8 text-white shadow-2xl border border-cyan-900/50 animate-slideUp 
                backdrop-blur-xl relative z-[10000]`,
        header: `flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8`,
        title: `text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3 tracking-wider`,
        gridContainer: `grid grid-cols-1 sm:grid-cols-2 ${isTablet ? 'lg:grid-cols-3' : ''} gap-3 sm:gap-4`
    };

    useEffect(() => {
        if (isVisible) {
            fetchCountries();
        }
    }, [isVisible]);

    const fetchCountries = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/countries/list`);
            if (!response.ok) throw new Error('Error fetching countries');
            const data = await response.json();
            setCountries(data.countries);
        } catch (error) {
            setError('Error loading countries');
        } finally {
            setLoading(false);
        }
    };

    const fetchPredictions = async (country) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/model/country_predictions/${encodeURIComponent(country.name)}`);
            if (!response.ok) throw new Error('Error fetching predictions');
            const data = await response.json();
            setPredictions(data);
        } catch (error) {
            setError(`Error loading predictions for ${country.name}`);
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
    const MetricsSection = ({ title, children }) => (
        <div className="bg-gradient-to-br from-slate-900/90 to-black/90 p-4 sm:p-8 rounded-2xl 
                        border border-cyan-900/50 hover:border-cyan-500/50 transition-all duration-500 
                        mb-4 sm:mb-6 backdrop-blur-xl shadow-lg shadow-cyan-500/20">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-cyan-400 tracking-wider">{title}</h3>
            {children}
        </div>
    );
    
    const MetricsCard = ({ metrics }) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
                { label: 'RMSE', value: metrics.rmse, desc: 'Error Cuadrático Medio' },
                { label: 'R² Score', value: metrics.r2_score, desc: 'Coeficiente de Determinación' },
                { label: 'Tiempo', value: `${metrics.training_time.toFixed(2)}s`, desc: 'Duración del Entrenamiento' }
            ].map((metric, idx) => (
                <div key={metric.label}
                    className="bg-gradient-to-br from-slate-900/90 to-black/90 p-4 sm:p-6 rounded-xl 
                             border border-cyan-900/50 hover:border-cyan-500/50 transition-all duration-300 
                             backdrop-blur-xl"
                    style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.1}s backwards` }}
                >
                    <div className="text-sm text-cyan-400 font-medium tracking-wider">{metric.label}</div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-2 mb-1 font-mono">
                        {formatNumber(metric.value)}
                    </div>
                    <div className="text-xs text-gray-400">{metric.desc}</div>
                </div>
            ))}
        </div>
    );
    
    const ChartSection = ({ predictions }) => (
        <div className="h-[300px] sm:h-[400px] w-full">
            <ResponsiveContainer>
                <LineChart data={predictions.predictions.historical.concat(predictions.predictions.forecast)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis 
                        dataKey="year" 
                        stroke="#94a3b8"
                        label={isMobile ? null : { value: 'Año', position: 'bottom', fill: '#94a3b8' }}
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <YAxis 
                        stroke="#94a3b8"
                        label={isMobile ? null : { value: 'Emisiones (MtCO2e)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                        width={isMobile ? 40 : 60}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(6, 182, 212, 0.5)',
                            borderRadius: '0.5rem',
                            backdropFilter: 'blur(4px)',
                            fontSize: isMobile ? '12px' : '14px'
                        }}
                    />
                    <Legend wrapperStyle={{ fontSize: isMobile ? '12px' : '14px' }}/>
                    <Line
                        type="monotone"
                        dataKey="emissions"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        dot={{ fill: '#06b6d4', r: isMobile ? 3 : 4 }}
                        activeDot={{ r: isMobile ? 5 : 6, fill: '#22d3ee' }}
                        name="Emisiones Históricas"
                    />
                    <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke="#14b8a6"
                        strokeWidth={2}
                        dot={{ fill: '#14b8a6', r: isMobile ? 3 : 4 }}
                        activeDot={{ r: isMobile ? 5 : 6, fill: '#2dd4bf' }}
                        name="Predicciones"
                        strokeDasharray="5 5"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'POSITIVO': return '#10b981';
            case 'ALERTA': return '#ef4444';
            default: return '#f59e0b';
        }
    };
    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center p-8 sm:p-12">
                    <div className="w-12 sm:w-16 h-12 sm:h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                </div>
            );
        }
    
        if (error) {
            return (
                <div className="bg-red-900/30 backdrop-blur-sm border border-red-500/50 p-4 sm:p-6 rounded-xl flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
                    <p className="text-sm sm:text-base text-red-200">{error}</p>
                </div>
            );
        }
    
        if (!selectedCountry) {
            return (
                <div className={styles.gridContainer}>
                    {countries.map((country, idx) => (
                        <button
                            key={country.name}
                            onClick={() => {
                                setSelectedCountry(country);
                                fetchPredictions(country);
                            }}
                            className="group p-4 sm:p-6 bg-gradient-to-br from-slate-900/90 to-black/90 rounded-xl 
                                     border border-cyan-900/50 hover:border-cyan-500/50 transition-all duration-300 
                                     transform hover:-translate-y-1 backdrop-blur-xl"
                            style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.1}s backwards` }}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-base sm:text-lg font-medium tracking-wider">{country.name}</span>
                                <ChevronRight className="text-cyan-400 transform group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                        </button>
                    ))}
                </div>
            );
        }
    
        return (
            <div className="space-y-4 sm:space-y-6">
                <button
                    onClick={() => {
                        setSelectedCountry(null);
                        setPredictions(null);
                    }}
                    className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors tracking-wider"
                >
                    <ChevronRight className="rotate-180" />
                    Volver a países
                </button>
    
                {predictions && (
                    <>
                        <MetricsSection title="Métricas del Modelo">
                            <MetricsCard metrics={predictions.metrics} />
                        </MetricsSection>
    
                        <MetricsSection title="Predicción de Emisiones">
                            <ChartSection predictions={predictions} />
                        </MetricsSection>
    
                        <MetricsSection title="Estado y Recomendaciones">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                                <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-cyan-900/50 backdrop-blur-xl">
                                    <h3 className="text-base sm:text-lg font-semibold mb-4 tracking-wider"
                                        style={{color: getStatusColor(predictions.status.current_state)}}>
                                        Estado: {predictions.status.current_state}
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-300">{predictions.status.message}</p>
                                    <div className="mt-4 space-y-2">
                                        <p className="text-xs sm:text-sm text-gray-400">
                                            Tendencia Anual: <span className="text-cyan-400 font-mono">{predictions.status.annual_trend.toFixed(1)}%</span>
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-400">
                                            Cambio Reciente: <span className="text-cyan-400 font-mono">{predictions.status.recent_change.toFixed(1)}%</span>
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-400">
                                            Cambio Proyectado: <span className="text-cyan-400 font-mono">{predictions.status.forecast_change.toFixed(1)}%</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-cyan-900/50 backdrop-blur-xl">
                                <h3 className="text-base sm:text-lg font-semibold mb-4 text-cyan-400 tracking-wider">Recomendaciones</h3>
                                <ul className="space-y-2">
                                    {predictions.recommendations.map((rec, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm sm:text-base text-gray-300 hover:text-cyan-300 transition-colors">
                                            <div className="mt-1 text-cyan-400">•</div>
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </MetricsSection>
                    </>
                )}
            </div>
        );
    };
    
    if (!isVisible) return null;
    
    return (
        <div className={styles.container}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>
                            <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-500" />
                            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 text-transparent bg-clip-text">
                                Predicción de Emisiones
                            </span>
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">
                            {selectedCountry ? selectedCountry.name : 'Selecciona un país para comenzar'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group"
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
    
    export default PredictionsDashboard;