import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { MousePointerClick, Clock, Zap, Wrench } from "lucide-react";

const data = [
  { day: "Lun", usos: 45 },
  { day: "Mar", usos: 52 },
  { day: "Mié", usos: 38 },
  { day: "Jue", usos: 65 },
  { day: "Vie", usos: 72 },
  { day: "Sáb", usos: 48 },
  { day: "Dom", usos: 25 },
];

const stats = [
  {
    label: "Usos Hoy",
    value: "24",
    icon: MousePointerClick,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    label: "Tiempo Prom.",
    value: "8m 30s",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Proyectos",
    value: "156",
    icon: Zap,
    color: "text-green-600",
    bg: "bg-green-50",
  },
];

export default function EditorUsage() {
  const maxUsos = Math.max(...data.map((d) => d.usos));

  return (
    <div className="chart-card">
      {/* Header */}
      <div className="chart-header">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <Wrench size={28} strokeWidth={1.5} />
          </div>
          <div className="chart-title-wrapper">
            <h3 className="chart-title">Uso del Editor</h3>
            <p className="chart-subtitle">Actividad semanal</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-5`}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={20} className={stat.color} />
              <span className="text-sm text-gray-500">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="chart-container" style={{ height: "16rem" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E5E5"
              vertical={false}
            />
            <XAxis
              dataKey="day"
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
              formatter={(value) => [`${value} usos`, "Usos"]}
            />
            <Bar dataKey="usos" radius={[8, 8, 0, 0]} maxBarSize={40}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.usos === maxUsos ? "#7C3AED" : "#DDD6FE"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
