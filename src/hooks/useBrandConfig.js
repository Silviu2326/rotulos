import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "rotulos_brand_config";

export const COLOR_THEMES = {
  purple: {
    name: "Púrpura",
    primary: "#7C3AED",
    secondary: "#A78BFA",
    accent: "#5B21B6",
  },
  blue: {
    name: "Azul",
    primary: "#3B82F6",
    secondary: "#60A5FA",
    accent: "#1D4ED8",
  },
  green: {
    name: "Verde",
    primary: "#10B981",
    secondary: "#34D399",
    accent: "#059669",
  },
  orange: {
    name: "Naranja",
    primary: "#F97316",
    secondary: "#FB923C",
    accent: "#EA580C",
  },
  red: {
    name: "Rojo",
    primary: "#EF4444",
    secondary: "#F87171",
    accent: "#DC2626",
  },
  pink: {
    name: "Rosa",
    primary: "#EC4899",
    secondary: "#F472B6",
    accent: "#DB2777",
  },
  teal: {
    name: "Turquesa",
    primary: "#14B8A6",
    secondary: "#2DD4BF",
    accent: "#0D9488",
  },
  indigo: {
    name: "Índigo",
    primary: "#6366F1",
    secondary: "#818CF8",
    accent: "#4F46E5",
  },
};

const defaultConfig = {
  companyName: "Rótulos Pro",
  tagline: "Tu imagen, nuestra pasión",
  primaryColor: "purple",
  customPrimaryColor: "#7C3AED",
  useCustomColor: false,
};

export function useBrandConfig() {
  const [config, setConfig] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return { ...defaultConfig, ...JSON.parse(stored) };
        } catch (e) {
          console.error("Error parsing brand config:", e);
          return defaultConfig;
        }
      }
    }
    return defaultConfig;
  });

  // Persistir cambios en localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
  }, [config]);

  // Aplicar color al CSS cuando cambia la configuración
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      const color = config.useCustomColor
        ? config.customPrimaryColor
        : COLOR_THEMES[config.primaryColor]?.primary ||
          COLOR_THEMES.purple.primary;

      root.style.setProperty("--color-primary", color);

      // Generar variantes del color para hover, etc.
      root.style.setProperty(
        "--color-primary-hover",
        adjustBrightness(color, -10),
      );
      root.style.setProperty(
        "--color-primary-light",
        adjustBrightness(color, 40),
      );
    }
  }, [config.primaryColor, config.customPrimaryColor, config.useCustomColor]);

  const updateConfig = useCallback((newConfig) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
  }, []);

  const getPrimaryColor = useCallback(() => {
    if (config.useCustomColor) {
      return config.customPrimaryColor;
    }
    return (
      COLOR_THEMES[config.primaryColor]?.primary || COLOR_THEMES.purple.primary
    );
  }, [config]);

  return {
    config,
    updateConfig,
    resetConfig,
    getPrimaryColor,
    COLOR_THEMES,
    defaultConfig,
  };
}

// Función auxiliar para ajustar el brillo de un color hex
function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x00ff) + amt));
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

export default useBrandConfig;
