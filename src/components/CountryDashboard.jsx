import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, X, RotateCcw, Info } from 'lucide-react';
import "tailwindcss/tailwind.css";

const CountryDashboard = ({ country, onClose, controlsRef }) => {
  const [generalStats, setGeneralStats] = useState(null);
  const [sectorData, setSectorData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [companiesData, setCompaniesData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(false);

  const API_BASE_URL = 'https://web-production-2cf89.up.railway.app';

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
        const [statsRes, sectorRes, historicalRes, companiesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/stats/country/${encodeURIComponent(country.name)}`),
          fetch(`${API_BASE_URL}/stats/emissions_by_sector/${encodeURIComponent(country.name)}`),
          fetch(`${API_BASE_URL}/stats/historical/${encodeURIComponent(country.name)}`),
          fetch(`${API_BASE_URL}/stats/companies/${encodeURIComponent(country.name)}`)
        ]);

        if (!statsRes.ok || !sectorRes.ok || !historicalRes.ok || !companiesRes.ok) {
          throw new Error('Error fetching data');
        }

        const [stats, sector, historical, companies] = await Promise.all([
          statsRes.json(),
          sectorRes.json(),
          historicalRes.json(),
          companiesRes.json()
        ]);

        setGeneralStats(stats);
        setSectorData(sector);
        setHistoricalData(historical);
        setCompaniesData(companies);

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

  if (!country) return null;

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 w-[800px] max-h-[calc(100vh-120px)] overflow-y-auto backdrop-blur-md bg-black bg-opacity-60 rounded-xl p-6 text-white shadow-xl border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-3xl font-bold flex items-center">
              <img 
                src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                alt={`${country.name} flag`}
                className="mr-2 h-8 rounded"
              />
              {country.name}
            </h2>
            <p className="text-gray-300">CO₂ Emissions Analysis</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleRotation}
            className={`p-3 rounded-lg hover:bg-gray-700 transition-transform ${isRotating ? 'text-green-400' : 'text-white'}`}
          >
            <RotateCcw size={22} />
          </button>
          <button
            onClick={handleClose}
            className="p-3 rounded-lg hover:bg-gray-700 transition-transform"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gray-300"/>
        </div>
      )}

      {error && (
        <div className="bg-red-800 bg-opacity-60 p-5 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-6 w-6 mt-0.5 text-red-400" />
          <div>
            <h4 className="font-semibold">Error</h4>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-8">
          <div className="grid grid-cols-3 gap-6">
            {generalStats && (
              <>
                <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
                  <p className="text-sm opacity-70">Total Emissions</p>
                  <p className="text-3xl font-bold">
                    {generalStats.total_emissions?.toFixed(2)} MtCO₂e
                  </p>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
                  <p className="text-sm opacity-70">Companies</p>
                  <p className="text-3xl font-bold">{generalStats.number_of_companies}</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
                  <p className="text-sm opacity-70">Sectors</p>
                  <p className="text-3xl font-bold">{generalStats.number_of_sectors}</p>
                </div>
              </>
            )}
          </div>

          {historicalData && (
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
              <div className="mb-4">
                <h3 className="text-xl font-semibold flex items-center justify-between">
                  Historical Emissions
                  <Info size={18} className="text-gray-400" />
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={historicalData.timeline}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="year" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total_emissions"
                    stroke="#82ca9d"
                    name="Emissions (MtCO₂e)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {sectorData && (
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Emissions by Sector</h3>
              <div className="space-y-4">
                {sectorData.sectors.map((sector, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-lg font-bold">{sector.name}</p>
                    <p className="text-sm text-gray-400">Total Emissions: {sector.total_emissions.toFixed(2)} MtCO₂e</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {companiesData && (
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Top Companies</h3>
              <div className="space-y-4">
                {companiesData.companies
                  .sort((a, b) => b.total_emissions - a.total_emissions)
                  .slice(0, 5)
                  .map((company, index) => (
                    <div key={company.name} className="flex justify-between items-center p-4 hover:bg-gray-800 rounded-lg transition-colors">
                      <div>
                        <p className="font-medium text-lg">{company.name}</p>
                        <p className="text-sm text-gray-400">{company.sector}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl">{company.total_emissions.toFixed(2)} MtCO₂e</p>
                        <p className="text-sm text-gray-400">
                          {company.emissions_percentage.toFixed(1)}% of total
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

export default CountryDashboard;
