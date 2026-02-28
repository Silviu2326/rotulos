import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Euro, TrendingUp } from "lucide-react";

const data = [
  { month: "Ene", ventas: 4500, pedidos: 28 },
  { month: "Feb", ventas: 5200, pedidos: 32 },
  { month: "Mar", ventas: 4800, pedidos: 30 },
  { month: "Abr", ventas: 6100, pedidos: 38 },
  { month: "May", ventas: 7200, pedidos: 45 },
  { month: "Jun", ventas: 6800, pedidos: 42 },
  { month: "Jul", ventas: 8100, pedidos: 52 },
  { month: "Ago", ventas: 7500, pedidos: 48 },
  { month: "Sep", ventas: 8900, pedidos: 58 },
  { month: "Oct", ventas: 9200, pedidos: 62 },
  { month: "Nov", ventas: 8800, pedidos: 56 },
  { month: "Dic", ventas: 10500, pedidos: 70 },
];

export default function SalesChart() {
  const totalVentas = data.reduce((acc, curr) => acc + curr.ventas, 0);
  const totalPedidos = data.reduce((acc, curr) => acc + curr.pedidos, 0);

  return (
    <div className="chart-card">
      {/* Header */}
      <div className="chart-header">
        <div className="chart-title-wrapper">
          <h3 className="chart-title">Ventas Anuales</h3>
          <p className="chart-subtitle">Ingresos y pedidos por mes</p>
        </div>

        <div className="chart-stats">
          <div className="chart-stat-box">
            <div className="chart-stat-label">
              <Euro size={20} className="text-purple-600" />
              <span className="chart-stat-label-text">Total</span>
            </div>
            <p className="chart-stat-value">€{totalVentas.toLocaleString()}</p>
          </div>

          <div className="chart-stat-box chart-stat-box-alt">
            <div className="chart-stat-label">
              <TrendingUp size={20} className="text-gray-600" />
              <span className="chart-stat-label-text">Pedidos</span>
            </div>
            <p className="chart-stat-value">{totalPedidos}</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-dot legend-dot-purple"></div>
          <span className="legend-text">Ventas</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot legend-dot-gray"></div>
          <span className="legend-text">Pedidos</span>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E5E5"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              stroke="#D4D4D4"
              fontSize={13}
              tickLine={false}
              axisLine={false}
              dy={15}
            />

            <YAxis
              stroke="#D4D4D4"
              fontSize={13}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E5E5",
                borderRadius: "16px",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                padding: "16px",
              }}
              itemStyle={{
                fontSize: "14px",
                color: "#171717",
              }}
              formatter={(value) => [`€${value.toLocaleString()}`, "Ventas"]}
            />

            <Area
              type="monotone"
              dataKey="ventas"
              stroke="#7C3AED"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorVentas)"
            />

            <Line
              type="monotone"
              dataKey="pedidos"
              stroke="#9CA3AF"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
