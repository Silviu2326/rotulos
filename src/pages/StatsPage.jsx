import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  Eye,
  MousePointer,
  Clock,
  Calendar,
  Download,
  Filter,
} from "lucide-react";

// Datos fake para los gráficos
const trafficData = [
  { date: "01/12", visitas: 4200, unicas: 3800, paginas: 12500 },
  { date: "02/12", visitas: 5100, unicas: 4600, paginas: 14200 },
  { date: "03/12", visitas: 4800, unicas: 4300, paginas: 13800 },
  { date: "04/12", visitas: 5900, unicas: 5200, paginas: 16800 },
  { date: "05/12", visitas: 6200, unicas: 5500, paginas: 18500 },
  { date: "06/12", visitas: 7100, unicas: 6400, paginas: 21200 },
  { date: "07/12", visitas: 6800, unicas: 6100, paginas: 19500 },
  { date: "08/12", visitas: 7500, unicas: 6800, paginas: 22800 },
  { date: "09/12", visitas: 8200, unicas: 7400, paginas: 25600 },
  { date: "10/12", visitas: 7900, unicas: 7100, paginas: 24200 },
  { date: "11/12", visitas: 8600, unicas: 7800, paginas: 26800 },
  { date: "12/12", visitas: 9100, unicas: 8200, paginas: 28500 },
];

const salesData = [
  { mes: "Ene", ventas: 12500, objetivo: 15000 },
  { mes: "Feb", ventas: 15200, objetivo: 15000 },
  { mes: "Mar", ventas: 18900, objetivo: 18000 },
  { mes: "Abr", ventas: 22400, objetivo: 20000 },
  { mes: "May", ventas: 26800, objetivo: 25000 },
  { mes: "Jun", ventas: 31200, objetivo: 30000 },
  { mes: "Jul", ventas: 28900, objetivo: 28000 },
  { mes: "Ago", ventas: 35600, objetivo: 32000 },
  { mes: "Sep", ventas: 41200, objetivo: 38000 },
  { mes: "Oct", ventas: 38900, objetivo: 40000 },
  { mes: "Nov", ventas: 46800, objetivo: 45000 },
  { mes: "Dic", ventas: 52400, objetivo: 50000 },
];

const productsData = [
  { name: "Rótulos Luminosos", value: 35, ventas: 18400 },
  { name: "Vinilos", value: 25, ventas: 13100 },
  { name: "Letras Corpóreas", value: 20, ventas: 10500 },
  { name: "Paneles", value: 12, ventas: 6300 },
  { name: "Otros", value: 8, ventas: 4200 },
];

const devicesData = [
  { name: "Móvil", value: 58, color: "#7C3AED" },
  { name: "Desktop", value: 35, color: "#3B82F6" },
  { name: "Tablet", value: 7, color: "#10B981" },
];

const hoursData = [
  { hora: "00:00", usuarios: 120 },
  { hora: "02:00", usuarios: 80 },
  { hora: "04:00", usuarios: 45 },
  { hora: "06:00", usuarios: 95 },
  { hora: "08:00", usuarios: 280 },
  { hora: "10:00", usuarios: 520 },
  { hora: "12:00", usuarios: 680 },
  { hora: "14:00", usuarios: 740 },
  { hora: "16:00", usuarios: 820 },
  { hora: "18:00", usuarios: 760 },
  { hora: "20:00", usuarios: 640 },
  { hora: "22:00", usuarios: 380 },
];

const sourcesData = [
  { fuente: "Google", visitas: 12500, porcentaje: 45 },
  { fuente: "Directo", visitas: 6200, porcentaje: 22 },
  { fuente: "Redes Sociales", visitas: 4800, porcentaje: 17 },
  { fuente: "Referidos", visitas: 2800, porcentaje: 10 },
  { fuente: "Email", visitas: 1700, porcentaje: 6 },
];

const COLORS = ["#7C3AED", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

const KPIs = [
  {
    title: "Total Visitas",
    value: "89.2K",
    change: "+12.5%",
    trend: "up",
    icon: Eye,
    color: "purple",
  },
  {
    title: "Usuarios Únicos",
    value: "67.8K",
    change: "+8.3%",
    trend: "up",
    icon: Users,
    color: "blue",
  },
  {
    title: "Tasa de Rebote",
    value: "42.3%",
    change: "-2.1%",
    trend: "down",
    icon: MousePointer,
    color: "green",
  },
  {
    title: "Tiempo Promedio",
    value: "4m 32s",
    change: "+18s",
    trend: "up",
    icon: Clock,
    color: "amber",
  },
  {
    title: "Conversiones",
    value: "1,284",
    change: "+23.7%",
    trend: "up",
    icon: ShoppingCart,
    color: "pink",
  },
  {
    title: "Ingresos",
    value: "€42.5K",
    change: "+15.2%",
    trend: "up",
    icon: TrendingUp,
    color: "indigo",
  },
];

export default function StatsPage() {
  const [dateRange, setDateRange] = useState("last30days");
  const [activeTab, setActiveTab] = useState("general");

  const getKPIIconClass = (color) => {
    const classes = {
      purple: "bg-purple-50 text-purple-600",
      blue: "bg-blue-50 text-blue-600",
      green: "bg-green-50 text-green-600",
      amber: "bg-amber-50 text-amber-600",
      pink: "bg-pink-50 text-pink-600",
      indigo: "bg-indigo-50 text-indigo-600",
    };
    return classes[color] || classes.purple;
  };

  return (
    <div className="stats-page">
      {/* Header */}
      <div className="stats-header">
        <div>
          <h2 className="stats-title">Estadísticas</h2>
          <p className="stats-subtitle">Análisis detallado del rendimiento</p>
        </div>

        <div className="stats-filters">
          <select
            className="stats-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="today">Hoy</option>
            <option value="yesterday">Ayer</option>
            <option value="last7days">Últimos 7 días</option>
            <option value="last30days">Últimos 30 días</option>
            <option value="thisMonth">Este mes</option>
            <option value="lastMonth">Mes anterior</option>
            <option value="thisYear">Este año</option>
          </select>

          <button className="btn btn-secondary">
            <Filter size={18} />
            Filtros
          </button>

          <button className="btn btn-secondary">
            <Download size={18} />
            Exportar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="stats-tabs">
        {["general", "trafico", "ventas", "productos", "comportamiento"].map(
          (tab) => (
            <button
              key={tab}
              className={`stats-tab ${activeTab === tab ? "stats-tab-active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ),
        )}
      </div>

      {/* KPIs Grid */}
      <div className="stats-kpis">
        {KPIs.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="stat-kpi-card">
              <div className="stat-kpi-header">
                <div className={`stat-kpi-icon ${getKPIIconClass(kpi.color)}`}>
                  <Icon size={24} />
                </div>
                <div
                  className={`stat-kpi-trend ${
                    kpi.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {kpi.trend === "up" ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  <span>{kpi.change}</span>
                </div>
              </div>
              <div className="stat-kpi-value">{kpi.value}</div>
              <div className="stat-kpi-label">{kpi.title}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="stats-charts-grid">
        {/* Tráfico Web */}
        <div className="stats-chart-card stats-chart-large">
          <div className="stats-chart-header">
            <div>
              <h3 className="stats-chart-title">Tráfico Web</h3>
              <p className="stats-chart-subtitle">Visitas vs Usuarios Únicos</p>
            </div>
            <div className="stats-chart-legend">
              <span className="legend-item">
                <span className="legend-dot bg-purple-600"></span>
                Total Visitas
              </span>
              <span className="legend-item">
                <span className="legend-dot bg-blue-500"></span>
                Usuarios Únicos
              </span>
            </div>
          </div>
          <div className="stats-chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorUnicas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="visitas"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVisitas)"
                />
                <Area
                  type="monotone"
                  dataKey="unicas"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUnicas)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ventas Mensuales */}
        <div className="stats-chart-card stats-chart-large">
          <div className="stats-chart-header">
            <div>
              <h3 className="stats-chart-title">Ventas Mensuales</h3>
              <p className="stats-chart-subtitle">Real vs Objetivo</p>
            </div>
          </div>
          <div className="stats-chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="mes" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="ventas"
                  name="Ventas"
                  fill="#7C3AED"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="objetivo"
                  name="Objetivo"
                  fill="#E5E7EB"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución por Producto */}
        <div className="stats-chart-card">
          <div className="stats-chart-header">
            <h3 className="stats-chart-title">Ventas por Producto</h3>
          </div>
          <div className="stats-chart-body">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={productsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {productsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="stats-pie-legend">
              {productsData.map((item, index) => (
                <div key={index} className="pie-legend-item">
                  <span
                    className="pie-legend-dot"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  <span className="pie-legend-name">{item.name}</span>
                  <span className="pie-legend-value">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dispositivos */}
        <div className="stats-chart-card">
          <div className="stats-chart-header">
            <h3 className="stats-chart-title">Por Dispositivo</h3>
          </div>
          <div className="stats-chart-body">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={devicesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {devicesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actividad por Hora */}
        <div className="stats-chart-card">
          <div className="stats-chart-header">
            <h3 className="stats-chart-title">Actividad por Hora</h3>
          </div>
          <div className="stats-chart-body">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="hora" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="usuarios" fill="#7C3AED" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fuentes de Tráfico */}
        <div className="stats-chart-card stats-chart-full">
          <div className="stats-chart-header">
            <h3 className="stats-chart-title">Fuentes de Tráfico</h3>
          </div>
          <div className="stats-sources">
            {sourcesData.map((source, index) => (
              <div key={index} className="stats-source-item">
                <div className="stats-source-info">
                  <span className="stats-source-name">{source.fuente}</span>
                  <span className="stats-source-value">
                    {source.visitas.toLocaleString()} visitas
                  </span>
                </div>
                <div className="stats-source-bar">
                  <div
                    className="stats-source-progress"
                    style={{
                      width: `${source.porcentaje}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  ></div>
                </div>
                <span className="stats-source-percentage">
                  {source.porcentaje}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-summary">
        <div className="stats-summary-card">
          <h4>Páginas más vistas</h4>
          <ul>
            <li>
              <span>/productos/rotulos-luminosos</span>
              <span>12,450</span>
            </li>
            <li>
              <span>/editor</span>
              <span>8,320</span>
            </li>
            <li>
              <span>/productos/letras-corporeas</span>
              <span>6,890</span>
            </li>
            <li>
              <span>/precios</span>
              <span>5,240</span>
            </li>
            <li>
              <span>/contacto</span>
              <span>3,680</span>
            </li>
          </ul>
        </div>

        <div className="stats-summary-card">
          <h4>Búsquedas populares</h4>
          <ul>
            <li>
              <span>rotulos luminosos</span>
              <span>2,840</span>
            </li>
            <li>
              <span>vinilos escaparate</span>
              <span>1,960</span>
            </li>
            <li>
              <span>letras corporeas</span>
              <span>1,520</span>
            </li>
            <li>
              <span>rotulos para negocio</span>
              <span>1,240</span>
            </li>
            <li>
              <span>precio rotulo led</span>
              <span>980</span>
            </li>
          </ul>
        </div>

        <div className="stats-summary-card">
          <h4>Ubicaciones principales</h4>
          <ul>
            <li>
              <span>Madrid</span>
              <span>28.5%</span>
            </li>
            <li>
              <span>Barcelona</span>
              <span>22.3%</span>
            </li>
            <li>
              <span>Valencia</span>
              <span>12.8%</span>
            </li>
            <li>
              <span>Sevilla</span>
              <span>8.4%</span>
            </li>
            <li>
              <span>Otras</span>
              <span>28.0%</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
