import React, { useState, useEffect } from 'react';
import { Globe, X, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_BASE_URL = 'https://web-production-2cf89.up.railway.app';

const GlobalPredictionsWindow = ({ isVisible, onClose }) => {
    const [predictions, setPredictions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
        <div className="bg-gradient-to-br from-slate-900/90 to-black/90 p-8 rounded-2xl border border-cyan-900/50 hover:border-cyan-500/50 transition-all duration-500 mb-6 backdrop-blur-xl shadow-lg shadow-cyan-500/20">
            <h3 className="text-xl font-semibold mb-6 text-cyan-400 tracking-wider">{title}</h3>
            {children}
        </div>
    );

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center p-12">
                    <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="bg-red-900/30 backdrop-blur-sm border border-red-500/50 p-6 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="h-6 w-6 text-red-400" />
                    <p className="text-red-200">{error}</p>
                </div>
            );
        }

        return (
            <>
                <MetricsSection title="Emisiones Globales">
                    <div className="h-[400px] w-full">
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
                                    label={{ value: 'Año', position: 'bottom', fill: '#94a3b8' }}
                                />
                                <YAxis 
                                    stroke="#94a3b8"
                                    label={{ value: 'Emisiones (MtCO2e)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        border: '1px solid rgba(6, 182, 212, 0.5)',
                                        borderRadius: '0.5rem',
                                        backdropFilter: 'blur(4px)'
                                    }}
                                />
                                <Legend />
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
                </MetricsSection>

                <div className="grid grid-cols-2 gap-6">
                    <MetricsSection title="Métricas del Modelo">
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-cyan-900/50 backdrop-blur-xl">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm text-gray-400">RMSE</h4>
                                    <div className="text-2xl font-bold text-cyan-400">
                                        {predictions?.metrics?.rmse.toFixed(2)}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm text-gray-400">R² Score</h4>
                                    <div className="text-2xl font-bold text-cyan-400">
                                        {predictions?.metrics?.r2_score.toFixed(2)}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm text-gray-400">Tiempo de Entrenamiento</h4>
                                    <div className="text-2xl font-bold text-cyan-400">
                                        {predictions?.metrics?.training_time.toFixed(2)}s
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MetricsSection>

                    <MetricsSection title="Proyecciones">
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-cyan-900/50 backdrop-blur-xl">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm text-gray-400">Emisiones Futuras Estimadas</h4>
                                    {predictions?.predictions?.forecast.map((forecast, index) => (
                                        <div key={index} className="mt-2">
                                            <span className="text-gray-300">{forecast.year}: </span>
                                            <span className="text-cyan-400 font-mono">
                                                {forecast.emissions.toFixed(2)} MtCO2e
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <h4 className="text-sm text-gray-400">Cambio Porcentual</h4>
                                    <div className="text-xl font-bold text-cyan-400">
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-8 animate-fadeIn">
            <div className="w-[900px] max-h-[80vh] overflow-y-auto bg-gradient-to-br from-slate-900/95 to-black/95 rounded-3xl p-8 text-white shadow-2xl border border-cyan-900/50 animate-slideUp backdrop-blur-xl">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <Globe className="h-8 w-8 text-cyan-500" />
                        <h2 className="text-3xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 to-teal-400 text-transparent bg-clip-text">
                            Predicciones Globales de CO2
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group"
                    >
                        <X className="text-gray-400 group-hover:text-red-400 transition-colors" />
                    </button>
                </div>

                {renderContent()}
            </div>
        </div>
    );
};

export default GlobalPredictionsWindow;