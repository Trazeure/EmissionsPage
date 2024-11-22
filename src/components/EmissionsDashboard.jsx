import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlertCircle, BarChart3, Globe2, Factory, TrendingUp } from 'lucide-react';

const API_BASE_URL = 'https://web-production-2cf89.up.railway.app';

const EmissionsDashboard = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countryStats, setCountryStats] = useState(null);
  const [sectorData, setSectorData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [productionData, setProductionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar lista de países
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/countries/list`);
        const data = await response.json();
        setCountries(data);
      } catch (err) {
        setError('Error al cargar la lista de países');
      }
    };
    fetchCountries();
  }, []);

  // Cargar datos del país seleccionado
  useEffect(() => {
    if (!selectedCountry) return;

    const fetchCountryData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, sectorRes, historicalRes, productionRes] = await Promise.all([
          fetch(`${API_BASE_URL}/stats/country/${selectedCountry}`),
          fetch(`${API_BASE_URL}/stats/emissions_by_sector/${selectedCountry}`),
          fetch(`${API_BASE_URL}/stats/historical/${selectedCountry}`),
          fetch(`${API_BASE_URL}/stats/production/${selectedCountry}`)
        ]);

        const [stats, sector, historical, production] = await Promise.all([
          statsRes.json(),
          sectorRes.json(),
          historicalRes.json(),
          productionRes.json()
        ]);

        setCountryStats(stats);
        setSectorData(sector);
        setHistoricalData(historical);
        setProductionData(production);
      } catch (err) {
        setError('Error al cargar los datos del país');
      } finally {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [selectedCountry]);

  // Componente para las estadísticas generales
  const StatsOverview = ({ stats }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Globe2 className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-sm text-gray-500">Emisiones Totales</p>
            <p className="text-2xl font-bold">{stats?.total_emissions?.toFixed(2)} MtCO2e</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Factory className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-sm text-gray-500">Empresas Registradas</p>
            <p className="text-2xl font-bold">{stats?.total_companies}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-sm text-gray-500">Tasa de Cambio Anual</p>
            <p className="text-2xl font-bold">{stats?.annual_change_rate?.toFixed(1)}%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Componente para el gráfico de sectores
  const SectorChart = ({ data }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Emisiones por Sector</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sector" angle={-45} textAnchor="end" height={70} />
              <YAxis label={{ value: 'Emisiones (MtCO2e)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="emissions" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  // Componente para el gráfico histórico
  const HistoricalChart = ({ data }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Tendencia Histórica de Emisiones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis label={{ value: 'Emisiones (MtCO2e)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line type="monotone" dataKey="emissions" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  // Componente para datos de producción
  const ProductionData = ({ data }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Principales Productos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="product" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="value" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard de Análisis de Emisiones CO2</h1>
      
      <Select onValueChange={setSelectedCountry} value={selectedCountry} className="mb-6">
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar País" />
        </SelectTrigger>
        <SelectContent>
          {countries.map(country => (
            <SelectItem key={country.code} value={country.code}>
              {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {loading && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="text-center">Cargando datos...</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {countryStats && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Vista General</TabsTrigger>
            <TabsTrigger value="sectors">Sectores</TabsTrigger>
            <TabsTrigger value="historical">Histórico</TabsTrigger>
            <TabsTrigger value="production">Producción</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <StatsOverview stats={countryStats} />
          </TabsContent>

          <TabsContent value="sectors">
            <SectorChart data={sectorData} />
          </TabsContent>

          <TabsContent value="historical">
            <HistoricalChart data={historicalData} />
          </TabsContent>

          <TabsContent value="production">
            <ProductionData data={productionData} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default EmissionsDashboard;