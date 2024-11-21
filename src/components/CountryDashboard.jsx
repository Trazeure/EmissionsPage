import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AlertCircle, X, RotateCcw, Info, TrendingUp, Building2, Layout, Factory, ChevronRight, ArrowUpRight } from 'lucide-react';

const CountryDashboard = ({ country, onClose, controlsRef }) => {
    const [generalStats, setGeneralStats] = useState(null);
    const [sectorData, setSectorData] = useState(null);
    const [historicalData, setHistoricalData] = useState(null);
    const [companiesData, setCompaniesData] = useState(null);
    const [productionData, setProductionData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRotating, setIsRotating] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const API_BASE_URL = 'https://web-production-2cf89.up.railway.app';
    

    // Configuraciones de animación
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Layout },
        { id: 'companies', label: 'Companies', icon: Building2 },
        { id: 'production', label: 'Production', icon: Factory }
    ];

    useEffect(() => {
        if (controlsRef?.current) {
            controlsRef.current.autoRotate = false;
        }
        return () => {
            if (controlsRef?.current) {
                controlsRef.current.autoRotate = true;
            }
        };
    }, [controlsRef]);

    useEffect(() => {
        const fetchAllData = async () => {
            if (!country?.name) return;

            setLoading(true);
            setError(null);

            try {
                const [statsRes, sectorRes, historicalRes, companiesRes, productionRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/stats/country/${encodeURIComponent(country.name)}`),
                    fetch(`${API_BASE_URL}/stats/emissions_by_sector/${encodeURIComponent(country.name)}`),
                    fetch(`${API_BASE_URL}/stats/historical/${encodeURIComponent(country.name)}`),
                    fetch(`${API_BASE_URL}/stats/companies/${encodeURIComponent(country.name)}`),
                    fetch(`${API_BASE_URL}/stats/production/${encodeURIComponent(country.name)}`)
                ]);

                if (!statsRes.ok || !sectorRes.ok || !historicalRes.ok || !companiesRes.ok || !productionRes.ok) {
                    throw new Error('Error fetching data');
                }

                const [stats, sector, historical, companies, production] = await Promise.all([
                    statsRes.json(),
                    sectorRes.json(),
                    historicalRes.json(),
                    companiesRes.json(),
                    productionRes.json()
                ]);

                setGeneralStats(stats);
                setSectorData(sector);
                setHistoricalData(historical);
                setCompaniesData(companies);
                setProductionData(production);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [country]);

    const handleClose = () => {
        if (controlsRef?.current) {
            controlsRef.current.autoRotate = true;
        }
        onClose();
    };

    const toggleRotation = () => {
        if (controlsRef?.current) {
            controlsRef.current.autoRotate = !controlsRef.current.autoRotate;
            setIsRotating(controlsRef.current.autoRotate);
        }
    };

    const StatCard = ({ title, value, icon: Icon, trend }) => (
        <motion.div
            className="relative overflow-hidden bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 rounded-xl border border-gray-700 hover:border-gray-500 transition-all duration-500"
            whileHover={{ scale: 1.02, y: -5 }}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
        >
            <div className="relative z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-gray-400">{title}</p>
                        <p className="text-3xl font-bold mt-2 text-white">
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {value}
                            </motion.span>
                        </p>
                        {trend && (
                            <motion.span
                                className={`inline-flex items-center gap-1 px-2 py-1 mt-2 text-sm rounded ${trend > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                    }`}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
                                <ArrowUpRight size={14} />
                            </motion.span>
                        )}
                    </div>
                    <Icon className="h-8 w-8 text-gray-400" />
                </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    );

    const CompanyCard = ({ company, index }) => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden"
        >
            <div className="flex justify-between items-center p-4 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg transition-all duration-500">
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 p-3 rounded-lg">
                        <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <p className="font-medium text-lg group-hover:text-green-400 transition-colors">
                            {company.name}
                        </p>
                        <span className="inline-block px-2 py-1 text-sm bg-gray-700/50 rounded mt-1">
                            {company.sector}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-xl">{company.total_emissions.toFixed(2)} MtCO₂e</p>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                        {company.emissions_percentage.toFixed(1)}% of total
                        <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                    </p>
                </div>
            </div>
            <div className="absolute inset-0 border border-green-500/0 group-hover:border-green-500/50 rounded-lg transition-all duration-500" />
        </motion.div>
    );
    // ... Continuación de la Parte 1

    const HistoricalChart = ({ data }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/90 p-6 rounded-xl border border-gray-700"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Historical Emissions</h3>
                <Info size={18} className="text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <defs>
                        <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="year" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(26, 26, 26, 0.95)',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="total_emissions"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorEmissions)"
                        name="Emissions (MtCO₂e)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );

    if (!country) return null;

    return (
        <AnimatePresence>
            {/* Overlay para el fondo */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={handleClose}
            />

            {/* Dashboard Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 flex items-center justify-center z-50"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="w-[90vw] max-w-[800px] h-[90vh] overflow-hidden backdrop-blur-xl bg-black/80 rounded-xl shadow-2xl border border-gray-700"
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >

                    {/* Container para el contenido con scroll independiente */}
                    <div className="relative z-50 h-full flex flex-col">
                        {/* Header Fijo */}
                        <motion.div
                            className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl p-6 pb-4 border-b border-gray-700/50"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                        className="relative group"
                                    >
                                        <img
                                            src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                                            alt={`${country.name} flag`}
                                            className="h-8 rounded shadow-lg transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </motion.div>
                                    <div>
                                        <motion.h2
                                            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                        >
                                            {country.name}
                                        </motion.h2>
                                        <motion.p
                                            className="text-gray-300 mt-1"
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            CO₂ Emissions Dashboard
                                        </motion.p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 180 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={toggleRotation}
                                        className={`p-3 rounded-lg backdrop-blur-md transition-colors duration-300 ${isRotating
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : 'bg-gray-800/50 text-white hover:bg-gray-700/50'
                                            }`}
                                    >
                                        <RotateCcw size={22} />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleClose}
                                        className="p-3 rounded-lg bg-gray-800/50 backdrop-blur-md hover:bg-red-500/20 hover:text-red-400 transition-colors duration-300"
                                    >
                                        <X size={22} />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <motion.div
                                className="flex gap-4 mt-4"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {tabs.map((tab, index) => (
                                    <motion.button
                                        key={tab.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${activeTab === tab.id
                                                ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white shadow-lg border border-green-500/20'
                                                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                            }`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <tab.icon size={18} />
                                        {tab.label}
                                    </motion.button>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Contenido Scrolleable */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {loading ? (
                                <motion.div
                                    className="space-y-4"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.1
                                            }
                                        }
                                    }}
                                >
                                    {[1, 2, 3].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="h-24 w-full bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl"
                                            variants={fadeIn}
                                        >
                                            <div className="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : error ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-900/50 border border-red-700 p-4 rounded-xl flex items-center gap-3"
                                >
                                    <AlertCircle className="h-5 w-5 text-red-400" />
                                    <p className="text-red-200">{error}</p>
                                </motion.div>
                            ) : (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-6"
                                    >
                                        {activeTab === 'overview' && generalStats && (
                                            <>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <StatCard
                                                        title="Total Emissions"
                                                        value={`${generalStats.total_emissions?.toFixed(2)} MtCO₂e`}
                                                        icon={TrendingUp}
                                                        trend={-2.5}
                                                    />
                                                    <StatCard
                                                        title="Companies"
                                                        value={generalStats.number_of_companies}
                                                        icon={Building2}
                                                    />
                                                    <StatCard
                                                        title="Sectors"
                                                        value={generalStats.number_of_sectors}
                                                        icon={Layout}
                                                    />
                                                </div>
                                                {historicalData?.timeline && (
                                                    <HistoricalChart data={historicalData.timeline} />
                                                )}
                                            </>
                                        )}

                                        {activeTab === 'companies' && companiesData?.companies && (
                                            <motion.div
                                                className="bg-gray-900/90 p-6 rounded-xl border border-gray-700"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <h3 className="text-xl font-semibold mb-4">Top Companies by Emissions</h3>
                                                <div className="space-y-4">
                                                    {companiesData.companies
                                                        .sort((a, b) => b.total_emissions - a.total_emissions)
                                                        .slice(0, 5)
                                                        .map((company, index) => (
                                                            <CompanyCard key={company.name} company={company} index={index} />
                                                        ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {activeTab === 'production' && productionData?.products && (
                                            <motion.div
                                                className="bg-gray-900/90 p-6 rounded-xl border border-gray-700"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <h3 className="text-xl font-semibold mb-4">Production Overview</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {productionData.products.map((product, index) => (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                            className="group bg-gray-800/60 p-4 rounded-lg hover:bg-gray-700/60 transition-all duration-500"
                                                        >
                                                            <p className="text-lg font-bold flex items-center justify-between">
                                                                {product.name}
                                                                <motion.span
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ delay: index * 0.1 + 0.2 }}
                                                                    className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-2 rounded-lg"
                                                                >
                                                                    <Factory className="h-5 w-5 text-gray-400" />
                                                                </motion.span>
                                                            </p>
                                                            <div className="mt-2">
                                                                <motion.span
                                                                    className="inline-block px-2 py-1 bg-gray-700/50 rounded text-sm"
                                                                    whileHover={{ scale: 1.05 }}
                                                                >
                                                                    {product.volume} {product.unit}
                                                                </motion.span>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CountryDashboard;
