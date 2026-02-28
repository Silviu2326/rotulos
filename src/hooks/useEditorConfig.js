import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "rotulos_editor_config";

export const FIELD_TYPES = [
  { id: "text", name: "Texto", icon: "Type" },
  { id: "textarea", name: "Texto Largo", icon: "AlignLeft" },
  { id: "number", name: "Número", icon: "Hash" },
  { id: "select", name: "Selección", icon: "List" },
  { id: "checkbox", name: "Checkbox", icon: "CheckSquare" },
  { id: "radio", name: "Opciones", icon: "CircleDot" },
  { id: "date", name: "Fecha", icon: "Calendar" },
  { id: "email", name: "Email", icon: "Mail" },
  { id: "tel", name: "Teléfono", icon: "Phone" },
  { id: "url", name: "URL", icon: "Link" },
  { id: "color", name: "Color", icon: "Palette" },
];

const defaultConfig = {
  // Modo del editor
  mode: "wizard", // 'wizard', 'single', 'simplified'

  // Pasos del wizard (para modo wizard)
  steps: {
    type: { enabled: true, required: true, order: 1 },
    dimensions: { enabled: true, required: true, order: 2 },
    design: { enabled: true, required: true, order: 3 },
    colors: { enabled: true, required: true, order: 4 },
    extras: { enabled: true, required: false, order: 5 },
  },

  // Campos personalizados
  customFields: [],

  // Funcionalidades
  showPricePreview: true,
  showStockWarnings: true,
  enableImageUpload: true,
  maxUploadSize: 10,
  allowedFormats: ["jpg", "png", "svg", "pdf"],
  showTemplates: true,
  enableSaveDraft: true,

  // Apariencia
  theme: "light",
  fontFamily: "Inter",
  borderRadius: "lg",
  density: "comfortable",

  // Configuración de marca
  primaryColor: "#7C3AED",
  companyName: "Rótulos Pro",
};

export function useEditorConfig() {
  const [config, setConfig] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return { ...defaultConfig, ...JSON.parse(stored) };
        } catch (e) {
          console.error("Error parsing editor config:", e);
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

  const updateConfig = useCallback((newConfig) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const updateStep = useCallback((stepKey, stepConfig) => {
    setConfig((prev) => ({
      ...prev,
      steps: {
        ...prev.steps,
        [stepKey]: { ...prev.steps[stepKey], ...stepConfig },
      },
    }));
  }, []);

  // Gestión de campos personalizados
  const addCustomField = useCallback(
    (field) => {
      const newField = {
        id: `field_${Date.now()}`,
        ...field,
        order: field.order ?? config.customFields.length,
      };
      setConfig((prev) => ({
        ...prev,
        customFields: [...prev.customFields, newField],
      }));
      return newField.id;
    },
    [config.customFields.length],
  );

  const updateCustomField = useCallback((fieldId, updates) => {
    setConfig((prev) => ({
      ...prev,
      customFields: prev.customFields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field,
      ),
    }));
  }, []);

  const removeCustomField = useCallback((fieldId) => {
    setConfig((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((field) => field.id !== fieldId),
    }));
  }, []);

  const reorderCustomFields = useCallback((newOrder) => {
    setConfig((prev) => ({
      ...prev,
      customFields: newOrder.map((field, index) => ({
        ...field,
        order: index,
      })),
    }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
  }, []);

  // Obtener pasos activos ordenados
  const getActiveSteps = useCallback(() => {
    return Object.entries(config.steps)
      .filter(([_, step]) => step.enabled)
      .sort((a, b) => a[1].order - b[1].order)
      .map(([key, step]) => ({ key, ...step }));
  }, [config.steps]);

  // Obtener campos personalizados ordenados
  const getCustomFields = useCallback(() => {
    return [...config.customFields].sort((a, b) => a.order - b.order);
  }, [config.customFields]);

  // Verificar si un paso está habilitado
  const isStepEnabled = useCallback(
    (stepKey) => {
      return config.steps[stepKey]?.enabled ?? true;
    },
    [config.steps],
  );

  // Verificar si un paso es obligatorio
  const isStepRequired = useCallback(
    (stepKey) => {
      return config.steps[stepKey]?.required ?? true;
    },
    [config.steps],
  );

  return {
    config,
    updateConfig,
    updateStep,
    addCustomField,
    updateCustomField,
    removeCustomField,
    reorderCustomFields,
    resetConfig,
    getActiveSteps,
    getCustomFields,
    isStepEnabled,
    isStepRequired,
    defaultConfig,
    FIELD_TYPES,
  };
}

export default useEditorConfig;
