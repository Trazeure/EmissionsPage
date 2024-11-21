import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, X, Info, TrendingUp, Building2, Factory, Globe, PieChart as PieChartIcon } from 'lucide-react';

const GlobalDashboard = ({ isVisible, onClose }) => {
  const [globalStats, setGlobalStats] = useState(null);
  const [companiesData, setCompaniesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

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
          throw new Error('Error fetching global data');
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

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#FF0000', '#8884D8', '#82ca9d', '#ffc658'];

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <div className="bg-gray-900/90 p-6 rounded-xl border border-gray-700 hover:bg-gray-800/90 transition-all duration-300 transform hover:scale-105">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-3xl font-bold mt-2 text-white">{value}</p>
          {description && (
            <p className="text-sm text-gray-400 mt-2">{description}</p>
          )}
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </div>
  );

  const sectorData = companiesData?.companies.reduce((acc, company) => {
    const sector = company.sector;
    if (!acc[sector]) {
      acc[sector] = {
        name: sector,
        value: 0,
        companies: []
      };
    }
    acc[sector].value += company.total_emissions;
    acc[sector].companies.push(company);
    return acc;
  }, {});

  const sectorChartData = sectorData ? Object.values(sectorData) : [];

  const formatLargeNumber = (num) => {
    if (num >= 1000000) return `${(num/1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num/1000).toFixed(1)}K`;
    return num.toFixed(1);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'sectors', label: 'Sectors', icon: PieChartIcon }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-8 w-[600px] max-h-[calc(100vh-200px)] overflow-y-auto backdrop-blur-xl bg-black/80 rounded-xl p-6 text-white shadow-2xl border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Globe className="h-6 w-6" />
            Global Emissions
          </h2>
          <p className="text-sm text-gray-300 mt-1">CO₂ Emissions Dashboard</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-700 transition-all duration-300 hover:text-red-400"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 text-sm ${
              activeTab === tab.id 
                ? 'bg-gray-700 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"/>
          <p className="text-sm">Loading global data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900/50 border border-red-700 p-3 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <p className="text-red-200">{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  title="Total Global Emissions"
                  value={`${formatLargeNumber(globalStats.total_emissions)} MtCO₂e`}
                  icon={TrendingUp}
                  color="text-green-400"
                />
                <StatCard
                  title="Global Companies"
                  value={globalStats.number_of_companies}
                  icon={Building2}
                  color="text-blue-400"
                />
              </div>

              <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Top 10 Global Emitters</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={companiesData.companies}
                    margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
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
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                      formatter={(value) => [`${formatLargeNumber(value)} MtCO₂e`, 'Emissions']}
                    />
                    <Bar dataKey="total_emissions" fill="#82ca9d">
                      {companiesData.companies.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {activeTab === 'sectors' && (
            <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Emissions by Sector</h3>
              <div className="grid grid-cols-2 gap-4">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={sectorChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      fill="#8884d8"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                    >
                      {sectorChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                      formatter={(value) => [`${formatLargeNumber(value)} MtCO₂e`, 'Emissions']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 overflow-y-auto max-h-[250px]">
                  {sectorChartData.map((sector, index) => (
                    <div
                      key={sector.name}
                      className="bg-gray-800/60 p-3 rounded-lg hover:bg-gray-700/60 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-sm">{sector.name}</span>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {sector.companies.length} companies
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-gray-700/50 rounded">
                          {formatLargeNumber(sector.value)} MtCO₂e
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'companies' && (
            <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-3">Top Global Emitters</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {companiesData.companies.map((company, index) => (
                  <div
                    key={company.name}
                    className="flex justify-between items-center p-3 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg transition-all duration-300 cursor-pointer group"
                  >
                    <div>
                      <p className="font-medium text-sm group-hover:text-green-400 transition-colors">
                        {company.name}
                      </p>
                      <span className="inline-block px-2 py-0.5 text-xs bg-gray-700/50 rounded mt-1">
                        {company.sector}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{formatLargeNumber(company.total_emissions)} MtCO₂e</p>
                      <p className="text-xs text-gray-400">
                        {((company.total_emissions / globalStats.total_emissions) * 100).toFixed(1)}% of global
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