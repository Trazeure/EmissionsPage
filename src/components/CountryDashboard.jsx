import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
    AlertCircle, X, RotateCcw, Info, Building2, Layout, Factory,
    ChevronRight, Globe, Activity, BarChart3, 
    PieChart, Map, Wind, Gauge, Tablet, Menu
} from 'lucide-react';

const CountryDashboard = ({ country, onClose, controlsRef }) => {
    // Estados
    const [generalStats, setGeneralStats] = useState(null);
    const [historicalData, setHistoricalData] = useState(null);
    const [companiesData, setCompaniesData] = useState(null);
    const [productionData, setProductionData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRotating, setIsRotating] = useState(false);
    const [activeTab, setActiveTab] = useState('resumen');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const API_BASE_URL = 'https://web-production-2cf89.up.railway.app';

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const tabs = [
        { id: 'resumen', label: 'Resumen', icon: Layout },
        { id: 'empresas', label: 'Empresas', icon: Building2 },
        { id: 'produccion', label: 'Producción', icon: Factory },
    ];

    // Manejadores
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

    // Efectos
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
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Efecto para cargar datos
    useEffect(() => {
        const fetchData = async () => {
            if (!country?.name) return;

            setLoading(true);
            setError(null);

            try {
                const [statsRes, historicalRes, companiesRes, productionRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/stats/country/${encodeURIComponent(country.name)}`),
                    fetch(`${API_BASE_URL}/stats/historical/${encodeURIComponent(country.name)}`),
                    fetch(`${API_BASE_URL}/stats/companies/${encodeURIComponent(country.name)}`),
                    fetch(`${API_BASE_URL}/stats/production/${encodeURIComponent(country.name)}`)
                ]);

                if (!statsRes.ok || !historicalRes.ok || !companiesRes.ok || !productionRes.ok) {
                    throw new Error('Error al cargar los datos');
                }

                const [stats, historical, companies, production] = await Promise.all([
                    statsRes.json(),
                    historicalRes.json(),
                    companiesRes.json(),
                    productionRes.json()
                ]);

                setGeneralStats(stats);
                setHistoricalData(historical);
                setCompaniesData(companies);
                setProductionData(production);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [country]);

    if (!country) return null;
    const DashboardLayout = ({ children }) => (
        <AnimatePresence>
            <motion.div
                key="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={handleClose}
            />
    
            <motion.div
                key="modal-content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 flex items-center justify-center z-50"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-[95vw] md:w-[90vw] max-w-[800px] h-[95vh] md:h-[90vh] overflow-hidden backdrop-blur-xl bg-black/80 rounded-xl shadow-2xl border border-white/10">
                    <div className="relative h-full flex flex-col">
                        {children}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );

    const TabsNavigation = ({ activeTab, setActiveTab, tabs, isMobileMenuOpen, setIsMobileMenuOpen }) => (
        <motion.div
            className={`${
                isMobileMenuOpen 
                    ? 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center'
                    : 'flex gap-2 mt-4 bg-gray-900/50 p-1 rounded-lg overflow-x-auto md:overflow-visible'
            }`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
            <div className={`flex ${isMobileMenuOpen ? 'flex-col w-full p-6' : 'flex-row gap-2'}`}>
                {tabs.map((tab, index) => (
                    <motion.button
                        key={tab.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setIsMobileMenuOpen(false);
                        }}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
                            ${isMobileMenuOpen ? 'w-full justify-center mb-4' : ''}
                            ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white border border-green-500/30'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}
                        `}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );

    const StatCard = ({ title, value, icon: Icon, trend, description }) => (
        <motion.div
            className="relative overflow-hidden bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-4 md:p-6 rounded-xl border border-gray-700 hover:border-green-500/30 transition-all duration-500"
            whileHover={{ scale: 1.02, y: -5 }}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
        >
            <div className="relative z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs md:text-sm text-gray-400 flex items-center gap-2">
                            {title}
                            <Info size={14} className="text-gray-500 hover:text-gray-300 cursor-help" />
                        </p>
                        <p className="text-xl md:text-3xl font-bold mt-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {value}
                            </motion.span>
                        </p>
                        {description && (
                            <p className="text-xs md:text-sm text-gray-400 mt-1">{description}</p>
                        )}
                        {trend && (
                            <motion.span
                                className={`inline-flex items-center gap-1 px-2 py-1 mt-2 text-xs md:text-sm rounded ${
                                    trend > 0 
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                                }`}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
                                <Activity size={14} />
                            </motion.span>
                        )}
                    </div>
                    <div className={`p-2 md:p-3 rounded-xl bg-gradient-to-br ${
                        trend > 0 
                            ? 'from-red-500/20 to-orange-500/20 border border-red-500/30' 
                            : 'from-green-500/20 to-blue-500/20 border border-green-500/30'
                    }`}>
                        <Icon className="h-4 w-4 md:h-6 md:w-6 text-white" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
    const DashboardHeader = () => (
        <div className="flex-none sticky top-0 z-50 bg-black/80 backdrop-blur-xl p-4 md:p-6 pb-4 border-b border-white/10">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 md:space-x-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="relative group"
                    >
                        <img
                            src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                            alt={`Bandera de ${country.name}`}
                            className="h-6 md:h-8 rounded shadow-lg transition-transform duration-300 group-hover:scale-110"
                        />
                    </motion.div>
                    <div>
                        <motion.h2
                            className="text-xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-2"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                        >
                            {country.name}
                            <Globe className="h-4 w-4 md:h-6 md:w-6 text-green-400" />
                        </motion.h2>
                        <motion.p
                            className="text-xs md:text-sm text-gray-400 mt-1 flex items-center gap-2"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Tablet size={14} />
                            Panel de Control de Emisiones CO₂
                        </motion.p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <motion.button
                        className="md:hidden p-2 rounded-lg bg-gray-800/50 text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu size={20} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleRotation}
                        className={`hidden md:block p-3 rounded-lg backdrop-blur-md transition-all duration-300 ${
                            isRotating
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-gray-800/50 text-white hover:bg-gray-700/50'
                        }`}
                    >
                        <RotateCcw size={20} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleClose}
                        className="p-2 md:p-3 rounded-lg bg-gray-800/50 backdrop-blur-md hover:bg-red-500/20 hover:text-red-400 transition-all duration-300"
                    >
                        <X size={20} />
                    </motion.button>
                </div>
            </div>

            <div className="hidden md:block">
                <TabsNavigation 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    tabs={tabs}
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
            </div>
        </div>
    );

    const HistoricalChart = ({ data }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-4 md:p-6 rounded-xl border border-gray-700"
        >
            <div className="flex items-center justify-between mb-4 md:mb-6">
                <div>
                    <h3 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                        Emisiones Históricas
                    </h3>
                    <p className="text-xs md:text-sm text-gray-400 mt-1">Evolución temporal de emisiones de CO₂</p>
                </div>
                <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                </div>
            </div>

            <div className="h-[250px] md:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                            dataKey="year" 
                            stroke="#fff"
                            tick={{ fill: '#9CA3AF', fontSize: '12px' }}
                        />
                        <YAxis 
                            stroke="#fff"
                            tick={{ fill: '#9CA3AF', fontSize: '12px' }}
                            width={40}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                fontSize: '12px'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="total_emissions"
                            stroke="#10B981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorEmissions)"
                            name="Emisiones (MtCO₂e)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
    const TabContent = () => {
        if (loading) {
            return (
                <motion.div
                    className="flex-1 overflow-y-auto space-y-4 p-4 md:p-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                >
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            key={`loading-${i}`}
                            className="h-20 md:h-24 w-full bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl overflow-hidden"
                            variants={fadeIn}
                        >
                            <div className="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                        </motion.div>
                    ))}
                </motion.div>
            );
        }

        if (error) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 overflow-y-auto m-4 md:m-6 bg-red-900/50 border border-red-500/30 p-4 rounded-xl flex items-center gap-3"
                >
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <p className="text-red-200 text-sm md:text-base">{error}</p>
                </motion.div>
            );
        }

        const renderContent = () => {
            switch (activeTab) {
                case 'resumen':
                    return generalStats && (
                        <motion.div className="space-y-4 md:space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <StatCard
                                    title="Emisiones Totales"
                                    value={`${generalStats.total_emissions?.toFixed(2)} MtCO₂e`}
                                    icon={Activity}
                                    trend={-2.5}
                                    description="Emisiones totales de CO₂ equivalente"
                                />
                                <StatCard
                                    title="Empresas Registradas"
                                    value={generalStats.number_of_companies}
                                    icon={Building2}
                                    description="Total de empresas monitoreadas"
                                />
                                <StatCard
                                    title="Sectores Activos"
                                    value={generalStats.number_of_sectors}
                                    icon={PieChart}
                                    description="Sectores industriales principales"
                                />
                            </div>
                            {historicalData?.timeline && (
                                <HistoricalChart data={historicalData.timeline} />
                            )}
                        </motion.div>
                    );

                case 'empresas':
                    return companiesData?.companies && (
                        <motion.div className="space-y-3">
                            {companiesData.companies
                                .sort((a, b) => b.total_emissions - a.total_emissions)
                                .slice(0, 5)
                                .map((company, index) => (
                                    <div key={company.name} className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-4 rounded-xl border border-gray-700">
                                        <h3 className="text-lg font-semibold">{company.name}</h3>
                                        <p className="text-sm text-gray-400">{company.emissions_percentage.toFixed(1)}% del total</p>
                                    </div>
                                ))}
                        </motion.div>
                    );

                case 'produccion':
                    return productionData?.products && (
                        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {productionData.products.map((product, index) => (
                                <div key={product.name} className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-4 rounded-xl border border-gray-700">
                                    <h3 className="text-lg font-semibold">{product.name}</h3>
                                    <p className="text-sm text-gray-400">{product.volume} {product.unit}</p>
                                </div>
                            ))}
                        </motion.div>
                    );
                default:
                    return null;
            }
        };

        return (
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col h-full">
                <DashboardHeader />
                {isMobileMenuOpen && (
                    <TabsNavigation 
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        tabs={tabs}
                        isMobileMenuOpen={isMobileMenuOpen}
                        setIsMobileMenuOpen={setIsMobileMenuOpen}
                    />
                )}
                <TabContent />
            </div>
        </DashboardLayout>
    );
};

export default CountryDashboard;