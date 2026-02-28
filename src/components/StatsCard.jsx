import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatsCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  delay = 0,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const getIconClass = () => {
    switch (color) {
      case "purple":
        return "stat-icon-purple";
      case "amber":
        return "stat-icon-amber";
      case "green":
        return "stat-icon-green";
      case "blue":
        return "stat-icon-blue";
      default:
        return "stat-icon-purple";
    }
  };

  const getAccentClass = () => {
    switch (color) {
      case "purple":
        return "stat-accent-purple";
      case "amber":
        return "stat-accent-amber";
      case "green":
        return "stat-accent-green";
      case "blue":
        return "stat-accent-blue";
      default:
        return "stat-accent-purple";
    }
  };

  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-info">
          <p className="stat-label">{title}</p>
          <h3 className="stat-value">{value}</h3>

          <div className="stat-change-wrapper">
            <div
              className={`stat-change ${changeType === "up" ? "stat-change-positive" : "stat-change-negative"}`}
            >
              {changeType === "up" ? (
                <TrendingUp size={16} strokeWidth={2.5} />
              ) : (
                <TrendingDown size={16} strokeWidth={2.5} />
              )}
              <span>{change}</span>
            </div>
            <span className="stat-change-label">vs mes pasado</span>
          </div>
        </div>

        <div className={`stat-icon-wrapper ${getIconClass()}`}>
          <Icon size={28} strokeWidth={1.5} />
        </div>
      </div>

      <div className={`stat-accent-line ${getAccentClass()}`} />
    </div>
  );
}
