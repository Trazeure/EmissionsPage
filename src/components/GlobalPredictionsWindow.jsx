import React, { useState, useEffect } from 'react';
import { Globe, X, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMediaQuery } from 'react-responsive';

const API_BASE_URL = 'https://web-production-2cf89.up.railway.app';

const GlobalPredictionsWindow = ({ isVisible, onClose }) => {
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
                p-4 sm:p-6 md:p-8 text-white shadow-2xl border border-cyan-900/50 animate-slideUp relative z-[10000]`,
        header: `flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8`,
        title: `text-2xl sm:text-3xl font-bold tracking-wider`,
        gridContainer: `grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6`
    };

    useEffect(() => {
        if (isVisible) {
            fetchPredictions();
        }
    }, [isVisible]);

    const fetchPredictions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/model/predictions`);
            if (!response.ok) throw new Error('Error fetching predictions');
            const data = await response.json();
            setPredictions(data);
        } catch (error) {
            setError('Error loading predictions');
        } finally {
            setLoading(false);
        }
    };
    const MetricsSection = ({ title, children }) => (
        <div className="bg-gradient-to-br from-slate-900/90 to-black/90 p-4 sm:p-8 rounded-2xl 
                        border border-cyan-900/50 hover:border-cyan-500/50 transition-all duration-500 
                        mb-4 sm:mb-6 backdrop-blur-xl shadow-lg shadow-cyan-500/20">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-cyan-400 tracking-wider">{title}</h3>
            {children}
        </div>
    );
    
    const EmissionsChart = ({ predictions }) => (
        <div className="h-[300px] sm:h-[400px] w-full">
            <ResponsiveContainer>
                <AreaChart data={predictions?.predictions?.historical.concat(predictions?.predictions?.forecast)}>
                    <defs>
                        <linearGradient id="colorGlobalEmissions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
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
                    <Area
                        type="monotone"
                        dataKey="emissions"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorGlobalEmissions)"
                        name="Emisiones Históricas"
                    />
                    <Area
                        type="monotone"
                        dataKey="emissions"
                        stroke="#14b8a6"
                        strokeWidth={2}
                        fillOpacity={0.3}
                        fill="url(#colorGlobalEmissions)"
                        name="Predicciones"
                        strokeDasharray="5 5"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
    
    const MetricsPanel = ({ metrics }) => (
        <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-cyan-900/50 backdrop-blur-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <h4 className="text-xs sm:text-sm text-gray-400">RMSE</h4>
                    <div className="text-xl sm:text-2xl font-bold text-cyan-400">
                        {metrics?.rmse.toFixed(2)}
                    </div>
                </div>
                <div>
                    <h4 className="text-xs sm:text-sm text-gray-400">R² Score</h4>
                    <div className="text-xl sm:text-2xl font-bold text-cyan-400">
                        {metrics?.r2_score.toFixed(2)}
                    </div>
                </div>
                <div className="sm:col-span-2">
                    <h4 className="text-xs sm:text-sm text-gray-400">Tiempo de Entrenamiento</h4>
                    <div className="text-xl sm:text-2xl font-bold text-cyan-400">
                        {metrics?.training_time.toFixed(2)}s
                    </div>
                </div>
            </div>
        </div>
    );
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
    
        return (
            <>
                <MetricsSection title="Emisiones Globales">
                    <EmissionsChart predictions={predictions} />
                </MetricsSection>
    
                <div className={styles.gridContainer}>
                    <MetricsSection title="Métricas del Modelo">
                        <MetricsPanel metrics={predictions?.metrics} />
                    </MetricsSection>
    
                    <MetricsSection title="Proyecciones">
                        <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-cyan-900/50 backdrop-blur-xl">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs sm:text-sm text-gray-400">Emisiones Futuras Estimadas</h4>
                                    <div className="max-h-[200px] overflow-y-auto pr-2">
                                        {predictions?.predictions?.forecast.map((forecast, index) => (
                                            <div key={index} className="mt-2">
                                                <span className="text-sm sm:text-base text-gray-300">{forecast.year}: </span>
                                                <span className="text-sm sm:text-base text-cyan-400 font-mono">
                                                    {forecast.emissions.toFixed(2)} MtCO2e
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h4 className="text-xs sm:text-sm text-gray-400">Cambio Porcentual</h4>
                                    <div className="text-lg sm:text-xl font-bold text-cyan-400">
                                        {((predictions?.predictions?.forecast[predictions?.predictions?.forecast.length - 1]?.emissions / 
                                           predictions?.predictions?.historical[predictions?.predictions?.historical.length - 1]?.emissions - 1) * 100).toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MetricsSection>
                </div>
            </>
        );
    };
    
    if (!isVisible) return null;
    
    return (
        <div className={styles.container}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-500" />
                        <h2 className={`${styles.title} bg-gradient-to-r from-cyan-400 to-teal-400 text-transparent bg-clip-text`}>
                            Predicciones Globales de CO2
                        </h2>
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
    
    export default GlobalPredictionsWindow;