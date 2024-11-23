import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, X, TrendingUp, Building2, Globe, PieChart as PieChartIcon, Sparkles } from 'lucide-react';

const GlobalDashboard = ({ isVisible, onClose }) => {
  const [globalStats, setGlobalStats] = useState(null);
  const [companiesData, setCompaniesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('resumen');

  const API_BASE_URL = 'https://web-production-2cf89.up.railway.app';

  useEffect(() => {
    const fetchData = async () => {
      if (!isVisible) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const [statsRes, companiesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/stats/global`),
          fetch(`${API_BASE_URL}/stats/companies/global`)
        ]);

        if (!statsRes.ok || !companiesRes.ok) {
          throw new Error('Error al cargar los datos globales');
        }

        const [stats, companies] = await Promise.all([
          statsRes.json(),
          companiesRes.json()
        ]);

        setGlobalStats(stats);
        setCompaniesData(companies);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isVisible]);

  const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6', '#06B6D4', '#34D399', '#FBBF24'];

  // Definición de la información de entidades
  const entityInfo = {
    'Investor-owned Company': {
      icon: '💼',
      name: 'Empresas Privadas',
      color: '#FF6B6B',
      hoverIcon: '💰',
      percentage: 61.5,
      companies: 75,
      emissions: '440.2K'
    },
    'State-owned Entity': {
      icon: '🏛️',
      name: 'Empresas Estatales',
      color: '#4ECDC4',
      hoverIcon: '🏢',
      percentage: 36,
      companies: 29.5,
      emissions: '464.6K'
    },
    'Nation State': {
      icon: '🏴',
      name: 'Estados Nacionales',
      color: '#45B7D1',
      hoverIcon: '🌐',
      percentage: 9.02,
      companies: 11,
      emissions: '516.2K'
    }
  };

  const sectorData = Object.entries(entityInfo).map(([key, value]) => ({
    name: value.name,
    value: value.percentage,
    icon: value.icon,
    hoverIcon: value.hoverIcon,
    color: value.color,
    companies: value.companies,
    emissions: value.emissions
  }));

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <p className="text-4xl font-bold mt-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            {value}
          </p>
          {description && (
            <p className="text-sm text-gray-400 mt-2">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const formatLargeNumber = (num) => {
    if (num >= 1000000) return `${(num/1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num/1000).toFixed(1)}K`;
    return num.toFixed(1);
  };

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: Sparkles },
    { id: 'empresas', label: 'Empresas', icon: Building2 },
    { id: 'sectores', label: 'Sectores', icon: PieChartIcon }
  ];

  if (!isVisible) return null;
  return (
    <div className="fixed bottom-24 left-8 w-[650px] max-h-[calc(100vh-200px)] overflow-y-auto backdrop-blur-2xl bg-black/40 rounded-3xl p-8 text-white shadow-2xl border border-white/10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            <Globe className="h-8 w-8 text-green-400" />
            Emisiones Globales
          </h2>
          <p className="text-sm text-gray-400 mt-1">Panel de Control de Emisiones CO₂</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-all duration-300"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
              activeTab === tab.id 
                ? 'bg-gradient-to-r from-green-400/20 to-blue-500/20 text-white shadow-lg border border-white/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-400 mx-auto mb-3"/>
          <p className="text-sm text-gray-400">Cargando datos globales...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="text-red-200">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'resumen' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  title="Emisiones Globales Totales"
                  value={`${formatLargeNumber(globalStats.total_emissions)} MtCO₂e`}
                  icon={TrendingUp}
                  color="text-green-400"
                />
                <StatCard
                  title="Empresas Globales"
                  value={globalStats.number_of_companies}
                  icon={Building2}
                  color="text-blue-400"
                />
              </div>

              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  Top 10 Emisores Globales
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={companiesData.companies}
                    margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#fff"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis stroke="#fff" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      formatter={(value) => [`${formatLargeNumber(value)} MtCO₂e`, 'Emisiones']}
                    />
                    <Bar dataKey="total_emissions" radius={[4, 4, 0, 0]}>
                      {companiesData.companies.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {activeTab === 'sectores' && (
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                🌍 Distribución Global por Tipo de Entidad 📊
              </h3>
              <p className="text-center text-gray-400 text-sm mb-8">
                ✨ Análisis de la Estructura Empresarial Global 🔍
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="relative">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={sectorData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="80%"
                        paddingAngle={2}
                      >
                        {sectorData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-black/90 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-xl">
                                <p className="text-lg font-bold mb-2">
                                  {data.icon} {data.name} {data.hoverIcon}
                                </p>
                                <p className="text-sm text-gray-300">
                                  📊 Porcentaje: {data.value}%
                                </p>
                                <p className="text-sm text-gray-300">
                                  🏢 Empresas: {data.companies}
                                </p>
                                <p className="text-sm text-gray-300">
                                  📈 Emisiones: {data.emissions} MtCO₂e
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Total</p>
                      <p className="text-2xl font-bold text-white">10</p>
                      <p className="text-sm text-gray-400">Empresas</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2">
                  {sectorData.map((sector) => (
                    <div
                      key={sector.name}
                      className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
                      style={{ borderLeft: `4px solid ${sector.color}` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold flex items-center gap-2">
                          {sector.icon} {sector.name}
                        </span>
                        <span className="text-sm px-3 py-1.5 bg-white/5 rounded-lg font-medium">
                          {sector.value}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="bg-white/5 p-2 rounded-lg">
                          <p className="text-sm text-gray-400">Empresas</p>
                          <p className="text-lg font-bold">{sector.companies} 🏢</p>
                        </div>
                        <div className="bg-white/5 p-2 rounded-lg">
                          <p className="text-sm text-gray-400">Emisiones</p>
                          <p className="text-lg font-bold">{sector.emissions} 📈</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <p className="text-center text-gray-400 text-sm mt-6">
                📌 Distribución por sectores principales
              </p>
            </div>
          )}

          {activeTab === 'empresas' && (
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Principales Emisores Globales
              </h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {companiesData.companies.map((company, index) => (
                  <div
                    key={company.name}
                    className="flex justify-between items-center p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                  >
                    <div>
                      <p className="font-medium group-hover:text-green-400 transition-colors">
                        {company.name}
                      </p>
                      <span className="inline-block px-3 py-1 text-xs bg-white/5 rounded-lg mt-2">
                        {company.sector}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatLargeNumber(company.total_emissions)} MtCO₂e</p>
                      <p className="text-sm text-gray-400">
                        {((company.total_emissions / globalStats.total_emissions) * 100).toFixed(1)}% del total
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalDashboard;