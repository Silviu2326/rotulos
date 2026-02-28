import React, { useState, useEffect } from "react";
import {
  Palette,
  Type,
  Image as ImageIcon,
  Settings,
  Bell,
  Mail,
  CreditCard,
  Globe,
  Shield,
  Database,
  Save,
  RefreshCw,
  Upload,
  Eye,
  ToggleLeft,
  ToggleRight,
  Check,
  AlertCircle,
  Layout,
  Sliders,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  User,
  Lock,
  FileText,
  Percent,
  Euro,
  DollarSign,
  Building2,
  Phone,
  MapPin,
  ChevronRight,
  FormInput,
  Plus,
  Trash2,
  GripVertical,
  Hash,
  List,
  CheckSquare,
  CircleDot,
  Calendar,
  Link,
  AlignLeft,
} from "lucide-react";
import { useEditorConfig } from "../hooks/useEditorConfig";
import { useBrandConfig } from "../hooks/useBrandConfig";

const EDITOR_MODES = [
  {
    id: "wizard",
    name: "Wizard (Paso a paso)",
    description:
      "Guía al usuario a través de 5 pasos para crear el rótulo perfecto",
    icon: Layout,
  },
  {
    id: "single",
    name: "Editor Único",
    description: "Todo en una sola pantalla con pestañas laterales",
    icon: Monitor,
  },
  {
    id: "simplified",
    name: "Simplificado",
    description: "Solo los campos esenciales para crear rótulos rápidamente",
    icon: Smartphone,
  },
];

const CURRENCIES = [
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { code: "USD", symbol: "$", name: "Dólar USD", flag: "🇺🇸" },
  { code: "GBP", symbol: "£", name: "Libra", flag: "🇬🇧" },
  { code: "MXN", symbol: "$", name: "Peso Mexicano", flag: "🇲🇽" },
  { code: "ARS", symbol: "$", name: "Peso Argentino", flag: "🇦🇷" },
  { code: "CLP", symbol: "$", name: "Peso Chileno", flag: "🇨🇱" },
  { code: "COP", symbol: "$", name: "Peso Colombiano", flag: "🇨🇴" },
];

const LANGUAGES = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("brand");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Hook de configuración del editor
  const {
    config: editorConfig,
    updateConfig: updateEditorConfig,
    addCustomField,
    updateCustomField,
    removeCustomField,
    resetConfig: resetEditorConfig,
    getCustomFields,
    FIELD_TYPES,
  } = useEditorConfig();

  // Estados para campos personalizados
  const [editingField, setEditingField] = useState(null);
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [newField, setNewField] = useState({
    name: "",
    label: "",
    type: "text",
    required: false,
    placeholder: "",
    options: [],
    helpText: "",
    showInSummary: true,
    showInPreview: false,
  });
  const [newOption, setNewOption] = useState("");

  // Hook de configuración de Marca
  const {
    config: brandConfig,
    updateConfig: updateBrandConfig,
    resetConfig: reupdateBrandConfig,
    COLOR_THEMES,
  } = useBrandConfig();

  // Configuración de Apariencia
  const [appearanceConfig, setAppearanceConfig] = useState({
    theme: "light",
    fontFamily: "Inter",
    borderRadius: "lg",
    density: "comfortable",
    sidebarStyle: "expanded",
    enableAnimations: true,
    customCSS: "",
    loginBackground: null,
    emailTemplate: "modern",
  });

  // Configuración General
  const [generalConfig, setGeneralConfig] = useState({
    language: "es",
    currency: "EUR",
    timezone: "Europe/Madrid",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    businessName: "Tu Empresa S.L.",
    businessAddress: "Calle Principal 123, 28001 Madrid",
    businessPhone: "+34 912 345 678",
    businessEmail: "contacto@tuempresa.com",
    businessWebsite: "www.tuempresa.com",
    taxId: "B12345678",
  });

  // Configuración de Precios
  const [pricingConfig, setPricingConfig] = useState({
    showPrices: true,
    showCosts: false,
    enableDiscounts: true,
    defaultMargin: 30,
    minOrderAmount: 50,
    freeShippingThreshold: 300,
    taxRate: 21,
    pricesIncludeTax: false,
    enableQuoteRequests: true,
    showPriceBreakdown: true,
  });

  // Configuración de Notificaciones
  const [notificationsConfig, setNotificationsConfig] = useState({
    email: {
      enabled: true,
      newOrder: true,
      orderStatusChange: true,
      lowStock: true,
      newQuote: true,
      dailySummary: false,
      weeklyReport: true,
    },
    push: {
      enabled: true,
      newOrder: true,
      urgentOrders: true,
      systemAlerts: true,
    },
    sms: {
      enabled: false,
      urgentOrders: false,
      newQuote: false,
    },
  });

  // Configuración de Integraciones
  const [integrationsConfig, setIntegrationsConfig] = useState({
    googleAnalytics: { enabled: false, trackingId: "" },
    facebookPixel: { enabled: false, pixelId: "" },
    stripe: { enabled: false, publicKey: "", secretKey: "" },
    paypal: { enabled: false, clientId: "", mode: "sandbox" },
    mailchimp: { enabled: false, apiKey: "", listId: "" },
    zapier: { enabled: false, webhookUrl: "" },
    slack: { enabled: false, webhookUrl: "" },
  });

  // Configuración de Seguridad
  const [securityConfig, setSecurityConfig] = useState({
    requireStrongPasswords: true,
    passwordMinLength: 8,
    passwordExpiry: 90,
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    ipWhitelist: "",
    enableAuditLog: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres restablecer todas las configuraciones a los valores por defecto?",
      )
    ) {
      resetEditorConfig();
      window.location.reload();
    }
  };

  const tabs = [
    { id: "brand", name: "Marca", icon: Palette },
    { id: "editor", name: "Editor", icon: Layout },
    { id: "custom-fields", name: "Campos", icon: FormInput },
    { id: "appearance", name: "Apariencia", icon: Type },
    { id: "general", name: "General", icon: Settings },
    { id: "pricing", name: "Precios", icon: Percent },
    { id: "notifications", name: "Notificaciones", icon: Bell },
    { id: "integrations", name: "Integraciones", icon: Database },
    { id: "security", name: "Seguridad", icon: Shield },
  ];

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <div>
          <h2 className="settings-title">Configuración</h2>
          <p className="settings-subtitle">
            Personaliza tu plataforma de rótulos según tu marca
          </p>
        </div>
        <div className="settings-actions">
          <button
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={isSaving}
          >
            <RefreshCw size={18} />
            Restablecer
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <RefreshCw size={18} className="spin" />
            ) : (
              <Save size={18} />
            )}
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className="settings-success">
          <Check size={20} />
          <span>Configuración guardada correctamente</span>
        </div>
      )}

      <div className="settings-layout">
        {/* Sidebar Tabs */}
        <div className="settings-sidebar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={20} />
                <span>{tab.name}</span>
                {activeTab === tab.id && (
                  <ChevronRight size={16} className="arrow" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="settings-content">
          {/* MARCA */}
          {activeTab === "brand" && (
            <div className="settings-section">
              <h3>Personalización de Marca</h3>

              <div className="settings-card">
                <h4>Información Básica</h4>

                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre de la Empresa</label>
                    <input
                      type="text"
                      value={brandConfig.companyName}
                      onChange={(e) =>
                        updateBrandConfig({ companyName: e.target.value })
                      }
                      placeholder="Rótulos Pro"
                    />
                    <small>
                      Este nombre aparecerá en el sidebar y el footer
                    </small>
                  </div>
                  <div className="form-group">
                    <label>Slogan / Tagline</label>
                    <input
                      type="text"
                      value={brandConfig.tagline}
                      onChange={(e) =>
                        updateBrandConfig({ tagline: e.target.value })
                      }
                      placeholder="Tu imagen, nuestra pasión"
                    />
                    <small>Aparece debajo del nombre en el sidebar</small>
                  </div>
                </div>
              </div>

              <div className="settings-card">
                <h4>Colores de Marca</h4>

                <div className="form-group">
                  <label>Tema de Color</label>
                  <div className="color-themes">
                    {Object.entries(COLOR_THEMES).map(([key, theme]) => (
                      <button
                        key={key}
                        className={`color-theme ${brandConfig.primaryColor === key ? "selected" : ""}`}
                        onClick={() =>
                          updateBrandConfig({
                            primaryColor: key,
                            useCustomColor: false,
                          })
                        }
                      >
                        <div
                          className="theme-preview"
                          style={{ background: theme.primary }}
                        >
                          {brandConfig.primaryColor === key &&
                            !brandConfig.useCustomColor && (
                              <Check size={16} color="white" />
                            )}
                        </div>
                        <span>{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Color Personalizado</label>
                    <div className="color-picker">
                      <input
                        type="color"
                        value={brandConfig.customPrimaryColor}
                        onChange={(e) =>
                          updateBrandConfig({
                            customPrimaryColor: e.target.value,
                            useCustomColor: true,
                          })
                        }
                      />
                      <input
                        type="text"
                        value={brandConfig.customPrimaryColor}
                        onChange={(e) =>
                          updateBrandConfig({
                            customPrimaryColor: e.target.value,
                            useCustomColor: true,
                          })
                        }
                        placeholder="#7C3AED"
                      />
                    </div>
                    <small>
                      Selecciona un color para personalizar la marca
                    </small>
                  </div>
                </div>

                <div className="color-preview">
                  <div
                    className="preview-box"
                    style={{
                      backgroundColor: brandConfig.useCustomColor
                        ? brandConfig.customPrimaryColor
                        : COLOR_THEMES[brandConfig.primaryColor]?.primary,
                    }}
                  >
                    <span style={{ color: "white" }}>
                      {brandConfig.companyName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EDITOR */}
          {activeTab === "editor" && (
            <div className="settings-section">
              <h3>Configuración del Editor</h3>

              <div className="settings-card">
                <h4>Modo del Editor</h4>
                <p className="card-description">
                  Elige cómo quieres que tus clientes creen sus rótulos
                </p>

                <div className="editor-modes">
                  {EDITOR_MODES.map((mode) => {
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        className={`editor-mode ${editorConfig.mode === mode.id ? "selected" : ""}`}
                        onClick={() => updateEditorConfig({ mode: mode.id })}
                      >
                        <Icon size={32} />
                        <h5>{mode.name}</h5>
                        <p>{mode.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {editorConfig.mode === "wizard" && (
                <div className="settings-card">
                  <h4>Pasos del Wizard</h4>
                  <p className="card-description">
                    Activa o desactiva los pasos del wizard y marca cuáles son
                    obligatorios
                  </p>

                  <div className="wizard-steps-config">
                    {Object.entries(editorConfig.steps).map(
                      ([stepKey, step]) => (
                        <div key={stepKey} className="wizard-step-item">
                          <div className="step-info">
                            <span className="step-number">
                              {Object.keys(editorConfig.steps).indexOf(
                                stepKey,
                              ) + 1}
                            </span>
                            <div className="step-details">
                              <span className="step-name">
                                {stepKey === "type" && "Tipo de Rótulo"}
                                {stepKey === "dimensions" && "Dimensiones"}
                                {stepKey === "material" && "Material"}
                                {stepKey === "design" && "Diseño"}
                                {stepKey === "colors" && "Colores"}
                                {stepKey === "extras" && "Extras"}
                              </span>
                            </div>
                          </div>
                          <div className="step-toggles">
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={step.enabled}
                                onChange={(e) =>
                                  updateEditorConfig({
                                    steps: {
                                      ...editorConfig.steps,
                                      [stepKey]: {
                                        ...step,
                                        enabled: e.target.checked,
                                      },
                                    },
                                  })
                                }
                              />
                              <span>Activar</span>
                            </label>
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={step.required}
                                disabled={!step.enabled}
                                onChange={(e) =>
                                  updateEditorConfig({
                                    steps: {
                                      ...editorConfig.steps,
                                      [stepKey]: {
                                        ...step,
                                        required: e.target.checked,
                                      },
                                    },
                                  })
                                }
                              />
                              <span>Obligatorio</span>
                            </label>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              <div className="settings-card">
                <h4>Funcionalidades del Editor</h4>

                <div className="toggle-group">
                  <label className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">Preview de Precio</span>
                      <span className="toggle-description">
                        Muestra el precio calculado en tiempo real
                      </span>
                    </div>
                    <button
                      className={`toggle-switch ${editorConfig.showPricePreview ? "active" : ""}`}
                      onClick={() =>
                        updateEditorConfig({
                          showPricePreview: !editorConfig.showPricePreview,
                        })
                      }
                    >
                      {editorConfig.showPricePreview ? (
                        <ToggleRight size={24} />
                      ) : (
                        <ToggleLeft size={24} />
                      )}
                    </button>
                  </label>

                  <label className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">Alertas de Stock</span>
                      <span className="toggle-description">
                        Muestra advertencias cuando el material tenga stock bajo
                      </span>
                    </div>
                    <button
                      className={`toggle-switch ${editorConfig.showStockWarnings ? "active" : ""}`}
                      onClick={() =>
                        updateEditorConfig({
                          showStockWarnings: !editorConfig.showStockWarnings,
                        })
                      }
                    >
                      {editorConfig.showStockWarnings ? (
                        <ToggleRight size={24} />
                      ) : (
                        <ToggleLeft size={24} />
                      )}
                    </button>
                  </label>

                  <label className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">Subida de Imágenes</span>
                      <span className="toggle-description">
                        Permite a los clientes subir sus propios diseños
                      </span>
                    </div>
                    <button
                      className={`toggle-switch ${editorConfig.enableImageUpload ? "active" : ""}`}
                      onClick={() =>
                        updateEditorConfig({
                          enableImageUpload: !editorConfig.enableImageUpload,
                        })
                      }
                    >
                      {editorConfig.enableImageUpload ? (
                        <ToggleRight size={24} />
                      ) : (
                        <ToggleLeft size={24} />
                      )}
                    </button>
                  </label>

                  <label className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">Guardar Borrador</span>
                      <span className="toggle-description">
                        Permite guardar diseños para continuar después
                      </span>
                    </div>
                    <button
                      className={`toggle-switch ${editorConfig.enableSaveDraft ? "active" : ""}`}
                      onClick={() =>
                        updateEditorConfig({
                          enableSaveDraft: !editorConfig.enableSaveDraft,
                        })
                      }
                    >
                      {editorConfig.enableSaveDraft ? (
                        <ToggleRight size={24} />
                      ) : (
                        <ToggleLeft size={24} />
                      )}
                    </button>
                  </label>

                  <label className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">Mostrar Plantillas</span>
                      <span className="toggle-description">
                        Ofrece plantillas predefinidas como punto de partida
                      </span>
                    </div>
                    <button
                      className={`toggle-switch ${editorConfig.showTemplates ? "active" : ""}`}
                      onClick={() =>
                        updateEditorConfig({
                          showTemplates: !editorConfig.showTemplates,
                        })
                      }
                    >
                      {editorConfig.showTemplates ? (
                        <ToggleRight size={24} />
                      ) : (
                        <ToggleLeft size={24} />
                      )}
                    </button>
                  </label>
                </div>
              </div>

              <div className="settings-card">
                <h4>Configuración de Archivos</h4>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tamaño Máximo (MB)</label>
                    <input
                      type="number"
                      value={editorConfig.maxUploadSize}
                      onChange={(e) =>
                        updateEditorConfig({
                          maxUploadSize: parseInt(e.target.value),
                        })
                      }
                      min="1"
                      max="50"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Formatos Permitidos</label>
                  <div className="checkbox-group">
                    {["jpg", "png", "svg", "pdf", "ai", "eps"].map((format) => (
                      <label key={format} className="checkbox-pill">
                        <input
                          type="checkbox"
                          checked={editorConfig.allowedFormats.includes(format)}
                          onChange={(e) => {
                            const newFormats = e.target.checked
                              ? [...editorConfig.allowedFormats, format]
                              : editorConfig.allowedFormats.filter(
                                  (f) => f !== format,
                                );
                            updateEditorConfig({
                              allowedFormats: newFormats,
                            });
                          }}
                        />
                        <span>.{format}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CAMPOS PERSONALIZADOS */}
          {activeTab === "custom-fields" && (
            <div className="settings-section">
              <div className="settings-section-header">
                <div>
                  <h3>Campos Personalizados</h3>
                  <p className="settings-subtitle">
                    Añade campos adicionales al formulario del editor
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEditingField(null);
                    setNewField({
                      name: "",
                      label: "",
                      type: "text",
                      required: false,
                      placeholder: "",
                      options: [],
                      helpText: "",
                      showInSummary: true,
                      showInPreview: false,
                    });
                    setShowFieldForm(true);
                  }}
                >
                  <Plus size={18} />
                  Añadir Campo
                </button>
              </div>

              {/* Lista de campos */}
              <div className="settings-card">
                <h4>Campos Configurados</h4>
                {editorConfig.customFields.length === 0 ? (
                  <div className="empty-state">
                    <FormInput size={48} className="empty-icon" />
                    <p>No hay campos personalizados configurados</p>
                    <small>
                      Añade campos para recopilar información adicional de tus
                      clientes
                    </small>
                  </div>
                ) : (
                  <div className="custom-fields-list">
                    {getCustomFields().map((field, index) => {
                      const FieldIcon =
                        FIELD_TYPES.find((t) => t.id === field.type)?.icon ||
                        "Type";
                      const IconComponent =
                        {
                          Type,
                          AlignLeft,
                          Hash,
                          List,
                          CheckSquare,
                          CircleDot,
                          Calendar,
                          Mail,
                          Phone,
                          Link,
                          Palette,
                        }[FieldIcon] || Type;

                      return (
                        <div key={field.id} className="custom-field-item">
                          <div className="field-drag-handle">
                            <GripVertical size={18} />
                          </div>
                          <div className="field-info">
                            <div className="field-header">
                              <IconComponent size={18} />
                              <span className="field-label">{field.label}</span>
                              {field.required && (
                                <span className="field-required">*</span>
                              )}
                            </div>
                            <div className="field-meta">
                              <span className="field-type">
                                {
                                  FIELD_TYPES.find((t) => t.id === field.type)
                                    ?.name
                                }
                              </span>
                              <span className="field-name">{field.name}</span>
                            </div>
                          </div>
                          <div className="field-actions">
                            <button
                              className="btn-icon"
                              onClick={() => {
                                setEditingField(field);
                                setNewField({ ...field });
                                setShowFieldForm(true);
                              }}
                              title="Editar"
                            >
                              <Sliders size={16} />
                            </button>
                            <button
                              className="btn-icon btn-icon-danger"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `¿Eliminar el campo "${field.label}"?`,
                                  )
                                ) {
                                  removeCustomField(field.id);
                                }
                              }}
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Formulario de campo */}
              {showFieldForm && (
                <div className="settings-card field-form-card">
                  <h4>{editingField ? "Editar Campo" : "Nuevo Campo"}</h4>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Nombre del Campo (ID) *</label>
                      <input
                        type="text"
                        value={newField.name}
                        onChange={(e) =>
                          setNewField({
                            ...newField,
                            name: e.target.value
                              .toLowerCase()
                              .replace(/\s+/g, "_")
                              .replace(/[^a-z0-9_]/g, ""),
                          })
                        }
                        placeholder="ej: nombre_cliente"
                      />
                      <small>
                        Identificador único, solo letras, números y guiones
                        bajos
                      </small>
                    </div>
                    <div className="form-group">
                      <label>Etiqueta *</label>
                      <input
                        type="text"
                        value={newField.label}
                        onChange={(e) =>
                          setNewField({ ...newField, label: e.target.value })
                        }
                        placeholder="ej: Nombre del Cliente"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Tipo de Campo *</label>
                      <select
                        value={newField.type}
                        onChange={(e) =>
                          setNewField({
                            ...newField,
                            type: e.target.value,
                            options:
                              e.target.value === "select" ||
                              e.target.value === "radio"
                                ? newField.options
                                : [],
                          })
                        }
                      >
                        {FIELD_TYPES.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Placeholder</label>
                      <input
                        type="text"
                        value={newField.placeholder}
                        onChange={(e) =>
                          setNewField({
                            ...newField,
                            placeholder: e.target.value,
                          })
                        }
                        placeholder="Texto de ayuda"
                      />
                    </div>
                  </div>

                  {(newField.type === "select" ||
                    newField.type === "radio") && (
                    <div className="form-group">
                      <label>Opciones</label>
                      <div className="options-input">
                        <input
                          type="text"
                          value={newOption}
                          onChange={(e) => setNewOption(e.target.value)}
                          placeholder="Añadir opción..."
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && newOption.trim()) {
                              setNewField({
                                ...newField,
                                options: [
                                  ...newField.options,
                                  newOption.trim(),
                                ],
                              });
                              setNewOption("");
                            }
                          }}
                        />
                        <button
                          className="btn btn-secondary"
                          onClick={() => {
                            if (newOption.trim()) {
                              setNewField({
                                ...newField,
                                options: [
                                  ...newField.options,
                                  newOption.trim(),
                                ],
                              });
                              setNewOption("");
                            }
                          }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="options-list">
                        {newField.options.map((option, idx) => (
                          <span key={idx} className="option-tag">
                            {option}
                            <button
                              onClick={() =>
                                setNewField({
                                  ...newField,
                                  options: newField.options.filter(
                                    (_, i) => i !== idx,
                                  ),
                                })
                              }
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label>Texto de Ayuda</label>
                    <input
                      type="text"
                      value={newField.helpText}
                      onChange={(e) =>
                        setNewField({ ...newField, helpText: e.target.value })
                      }
                      placeholder="Información adicional para el usuario"
                    />
                  </div>

                  <div className="toggle-group">
                    <label className="toggle-item">
                      <div className="toggle-info">
                        <span className="toggle-label">Campo Obligatorio</span>
                        <span className="toggle-description">
                          El usuario debe completar este campo
                        </span>
                      </div>
                      <button
                        className={`toggle-switch ${newField.required ? "active" : ""}`}
                        onClick={() =>
                          setNewField({
                            ...newField,
                            required: !newField.required,
                          })
                        }
                      >
                        {newField.required ? (
                          <ToggleRight size={24} />
                        ) : (
                          <ToggleLeft size={24} />
                        )}
                      </button>
                    </label>

                    <label className="toggle-item">
                      <div className="toggle-info">
                        <span className="toggle-label">Mostrar en Resumen</span>
                        <span className="toggle-description">
                          Incluir en la página de resumen del pedido
                        </span>
                      </div>
                      <button
                        className={`toggle-switch ${newField.showInSummary ? "active" : ""}`}
                        onClick={() =>
                          setNewField({
                            ...newField,
                            showInSummary: !newField.showInSummary,
                          })
                        }
                      >
                        {newField.showInSummary ? (
                          <ToggleRight size={24} />
                        ) : (
                          <ToggleLeft size={24} />
                        )}
                      </button>
                    </label>

                    <label className="toggle-item">
                      <div className="toggle-info">
                        <span className="toggle-label">Mostrar en Preview</span>
                        <span className="toggle-description">
                          Incluir en la vista previa del rótulo
                        </span>
                      </div>
                      <button
                        className={`toggle-switch ${newField.showInPreview ? "active" : ""}`}
                        onClick={() =>
                          setNewField({
                            ...newField,
                            showInPreview: !newField.showInPreview,
                          })
                        }
                      >
                        {newField.showInPreview ? (
                          <ToggleRight size={24} />
                        ) : (
                          <ToggleLeft size={24} />
                        )}
                      </button>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowFieldForm(false);
                        setEditingField(null);
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        if (!newField.name || !newField.label) {
                          alert("Por favor completa el nombre y la etiqueta");
                          return;
                        }
                        if (editingField) {
                          updateCustomField(editingField.id, newField);
                        } else {
                          addCustomField(newField);
                        }
                        setShowFieldForm(false);
                        setEditingField(null);
                      }}
                      disabled={!newField.name || !newField.label}
                    >
                      <Save size={18} />
                      {editingField ? "Guardar Cambios" : "Crear Campo"}
                    </button>
                  </div>
                </div>
              )}

              {/* Información */}
              <div className="settings-info-box">
                <AlertCircle size={20} />
                <div>
                  <h5>Tipos de Campos Disponibles</h5>
                  <ul>
                    <li>
                      <strong>Texto:</strong> Campo de texto simple
                    </li>
                    <li>
                      <strong>Texto Largo:</strong> Área de texto multilínea
                    </li>
                    <li>
                      <strong>Número:</strong> Valores numéricos
                    </li>
                    <li>
                      <strong>Selección:</strong> Dropdown con opciones
                    </li>
                    <li>
                      <strong>Checkbox:</strong> Casilla de verificación
                    </li>
                    <li>
                      <strong>Opciones:</strong> Botones de radio
                    </li>
                    <li>
                      <strong>Fecha:</strong> Selector de fecha
                    </li>
                    <li>
                      <strong>Email/Teléfono/URL:</strong> Validación incluida
                    </li>
                    <li>
                      <strong>Color:</strong> Selector de color
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* APARIENCIA */}
          {activeTab === "appearance" && (
            <div className="settings-section">
              <h3>Apariencia y Temas</h3>

              <div className="settings-card">
                <h4>Tema General</h4>

                <div className="theme-selector">
                  <button
                    className={`theme-option ${appearanceConfig.theme === "light" ? "selected" : ""}`}
                    onClick={() =>
                      setAppearanceConfig({
                        ...appearanceConfig,
                        theme: "light",
                      })
                    }
                  >
                    <Sun size={24} />
                    <span>Claro</span>
                  </button>
                  <button
                    className={`theme-option ${appearanceConfig.theme === "dark" ? "selected" : ""}`}
                    onClick={() =>
                      setAppearanceConfig({
                        ...appearanceConfig,
                        theme: "dark",
                      })
                    }
                  >
                    <Moon size={24} />
                    <span>Oscuro</span>
                  </button>
                  <button
                    className={`theme-option ${appearanceConfig.theme === "auto" ? "selected" : ""}`}
                    onClick={() =>
                      setAppearanceConfig({
                        ...appearanceConfig,
                        theme: "auto",
                      })
                    }
                  >
                    <Monitor size={24} />
                    <span>Automático</span>
                  </button>
                </div>
              </div>

              <div className="settings-card">
                <h4>Tipografía</h4>

                <div className="form-group">
                  <label>Fuente Principal</label>
                  <select
                    value={appearanceConfig.fontFamily}
                    onChange={(e) =>
                      setAppearanceConfig({
                        ...appearanceConfig,
                        fontFamily: e.target.value,
                      })
                    }
                  >
                    <option value="Inter">Inter (Moderna)</option>
                    <option value="Roboto">Roboto (Google)</option>
                    <option value="Open Sans">Open Sans (Legible)</option>
                    <option value="Poppins">Poppins (Amigable)</option>
                    <option value="Montserrat">Montserrat (Elegante)</option>
                    <option value="Lato">Lato (Profesional)</option>
                  </select>
                </div>

                <div
                  className="font-preview"
                  style={{ fontFamily: appearanceConfig.fontFamily }}
                >
                  <h5>Vista Previa</h5>
                  <p>
                    Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt
                    Uu Vv Ww Xx Yy Zz
                  </p>
                  <p>1234567890</p>
                  <p>¡Hola! Este es un texto de ejemplo.</p>
                </div>
              </div>

              <div className="settings-card">
                <h4>Estilo de Interfaz</h4>

                <div className="form-row">
                  <div className="form-group">
                    <label>Esquinas (Border Radius)</label>
                    <select
                      value={appearanceConfig.borderRadius}
                      onChange={(e) =>
                        setAppearanceConfig({
                          ...appearanceConfig,
                          borderRadius: e.target.value,
                        })
                      }
                    >
                      <option value="none">Cuadrado (0px)</option>
                      <option value="sm">Pequeño (4px)</option>
                      <option value="md">Medio (8px)</option>
                      <option value="lg">Grande (12px)</option>
                      <option value="xl">Extra Grande (16px)</option>
                      <option value="full">Completo (Pill)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Densidad</label>
                    <select
                      value={appearanceConfig.density}
                      onChange={(e) =>
                        setAppearanceConfig({
                          ...appearanceConfig,
                          density: e.target.value,
                        })
                      }
                    >
                      <option value="compact">Compacta</option>
                      <option value="comfortable">Cómoda</option>
                      <option value="spacious">Espaciada</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Estilo de Sidebar</label>
                  <div className="sidebar-options">
                    <button
                      className={`sidebar-option ${appearanceConfig.sidebarStyle === "expanded" ? "selected" : ""}`}
                      onClick={() =>
                        setAppearanceConfig({
                          ...appearanceConfig,
                          sidebarStyle: "expanded",
                        })
                      }
                    >
                      <Layout size={24} />
                      <span>Expandido</span>
                    </button>
                    <button
                      className={`sidebar-option ${appearanceConfig.sidebarStyle === "collapsed" ? "selected" : ""}`}
                      onClick={() =>
                        setAppearanceConfig({
                          ...appearanceConfig,
                          sidebarStyle: "collapsed",
                        })
                      }
                    >
                      <Sliders size={24} />
                      <span>Compacto</span>
                    </button>
                    <button
                      className={`sidebar-option ${appearanceConfig.sidebarStyle === "hidden" ? "selected" : ""}`}
                      onClick={() =>
                        setAppearanceConfig({
                          ...appearanceConfig,
                          sidebarStyle: "hidden",
                        })
                      }
                    >
                      <Eye size={24} />
                      <span>Oculto</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="settings-card">
                <h4>Animaciones</h4>

                <label className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-label">Habilitar Animaciones</span>
                    <span className="toggle-description">
                      Transiciones suaves entre páginas y elementos
                    </span>
                  </div>
                  <button
                    className={`toggle-switch ${appearanceConfig.enableAnimations ? "active" : ""}`}
                    onClick={() =>
                      setAppearanceConfig({
                        ...appearanceConfig,
                        enableAnimations: !appearanceConfig.enableAnimations,
                      })
                    }
                  >
                    {appearanceConfig.enableAnimations ? (
                      <ToggleRight size={24} />
                    ) : (
                      <ToggleLeft size={24} />
                    )}
                  </button>
                </label>
              </div>

              <div className="settings-card">
                <h4>CSS Personalizado</h4>

                <div className="form-group">
                  <label>Estilos CSS Avanzados</label>
                  <textarea
                    value={appearanceConfig.customCSS}
                    onChange={(e) =>
                      setAppearanceConfig({
                        ...appearanceConfig,
                        customCSS: e.target.value,
                      })
                    }
                    rows={6}
                    placeholder="/* Escribe tu CSS personalizado aquí */
.custom-class {
  color: red;
}"
                  />
                  <small>
                    Solo para usuarios avanzados. Usa con precaución.
                  </small>
                </div>
              </div>
            </div>
          )}

          {/* GENERAL */}
          {activeTab === "general" && (
            <div className="settings-section">
              <h3>Configuración General</h3>

              <div className="settings-card">
                <h4>Idioma y Región</h4>

                <div className="form-row">
                  <div className="form-group">
                    <label>Idioma</label>
                    <select
                      value={generalConfig.language}
                      onChange={(e) =>
                        setGeneralConfig({
                          ...generalConfig,
                          language: e.target.value,
                        })
                      }
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Moneda</label>
                    <select
                      value={generalConfig.currency}
                      onChange={(e) =>
                        setGeneralConfig({
                          ...generalConfig,
                          currency: e.target.value,
                        })
                      }
                    >
                      {CURRENCIES.map((curr) => (
                        <option key={curr.code} value={curr.code}>
                          {curr.flag} {curr.name} ({curr.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Zona Horaria</label>
                    <select
                      value={generalConfig.timezone}
                      onChange={(e) =>
                        setGeneralConfig({
                          ...generalConfig,
                          timezone: e.target.value,
                        })
                      }
                    >
                      <option value="Europe/Madrid">Madrid (GMT+1)</option>
                      <option value="Europe/London">Londres (GMT)</option>
                      <option value="America/New_York">Nueva York (EST)</option>
                      <option value="America/Mexico_City">
                        Ciudad de México (CST)
                      </option>
                      <option value="America/Buenos_Aires">
                        Buenos Aires (ART)
                      </option>
                      <option value="America/Santiago">Santiago (CLT)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Formato de Fecha</label>
                    <select
                      value={generalConfig.dateFormat}
                      onChange={(e) =>
                        setGeneralConfig({
                          ...generalConfig,
                          dateFormat: e.target.value,
                        })
                      }
                    >
                      <option value="DD/MM/YYYY">31/12/2024</option>
                      <option value="MM/DD/YYYY">12/31/2024</option>
                      <option value="YYYY-MM-DD">2024-12-31</option>
                      <option value="DD-MM-YYYY">31-12-2024</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Formato de Hora</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="timeFormat"
                        value="24h"
                        checked={generalConfig.timeFormat === "24h"}
                        onChange={(e) =>
                          setGeneralConfig({
                            ...generalConfig,
                            timeFormat: e.target.value,
                          })
                        }
                      />
                      <span>24 horas (14:30)</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="timeFormat"
                        value="12h"
                        checked={generalConfig.timeFormat === "12h"}
                        onChange={(e) =>
                          setGeneralConfig({
                            ...generalConfig,
                            timeFormat: e.target.value,
                          })
                        }
                      />
                      <span>12 horas (2:30 PM)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="settings-card">
                <h4>Información de la Empresa</h4>

                <div className="form-group">
                  <label>Nombre Fiscal</label>
                  <input
                    type="text"
                    value={generalConfig.businessName}
                    onChange={(e) =>
                      setGeneralConfig({
                        ...generalConfig,
                        businessName: e.target.value,
                      })
                    }
                    placeholder="Tu Empresa S.L."
                  />
                </div>

                <div className="form-group">
                  <label>Dirección</label>
                  <input
                    type="text"
                    value={generalConfig.businessAddress}
                    onChange={(e) =>
                      setGeneralConfig({
                        ...generalConfig,
                        businessAddress: e.target.value,
                      })
                    }
                    placeholder="Calle Principal 123, 28001 Madrid"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      value={generalConfig.businessPhone}
                      onChange={(e) =>
                        setGeneralConfig({
                          ...generalConfig,
                          businessPhone: e.target.value,
                        })
                      }
                      placeholder="+34 912 345 678"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={generalConfig.businessEmail}
                      onChange={(e) =>
                        setGeneralConfig({
                          ...generalConfig,
                          businessEmail: e.target.value,
                        })
                      }
                      placeholder="contacto@tuempresa.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Sitio Web</label>
                  <input
                    type="url"
                    value={generalConfig.businessWebsite}
                    onChange={(e) =>
                      setGeneralConfig({
                        ...generalConfig,
                        businessWebsite: e.target.value,
                      })
                    }
                    placeholder="www.tuempresa.com"
                  />
                </div>

                <div className="form-group">
                  <label>NIF/CIF</label>
                  <input
                    type="text"
                    value={generalConfig.taxId}
                    onChange={(e) =>
                      setGeneralConfig({
                        ...generalConfig,
                        taxId: e.target.value,
                      })
                    }
                    placeholder="B12345678"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PRECIO */}
          {activeTab === "pricing" && (
            <div className="settings-section">
              <h3>Configuración de Precios</h3>

              <div className="settings-card">
                <h4>Visualización de Precios</h4>

                <div className="toggle-group">
                  <label className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">
                        Mostrar Precios al Público
                      </span>
                      <span className="toggle-description">
                        Los clientes ven los precios sin iniciar sesión
                      </span>
                    </div>
                    <button
                      className={`toggle-switch ${pricingConfig.showPrices ? "active" : ""}`}
                      onClick={() =>
                        setPricingConfig({
                          ...pricingConfig,
                          showPrices: !pricingConfig.showPrices,
                        })
                      }
                    >
                      {pricingConfig.showPrices ? (
                        <ToggleRight size={24} />
                      ) : (
                        <ToggleLeft size={24} />
                      )}
                    </button>
                  </label>

                  <label className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">
                        Mostrar Costes (Admin)
                      </span>
                      <span className="toggle-description">
                        Visible solo para administradores
                      </span>
                    </div>
                    <button
                      className={`toggle-switch ${pricingConfig.showCosts ? "active" : ""}`}
                      onClick={() =>
                        setPricingConfig({
                          ...pricingConfig,
                          showCosts: !pricingConfig.showCosts,
                        })
                      }
                    >
                      {pricingConfig.showCosts ? (
                        <ToggleRight size={24} />
                      ) : (
                        <ToggleLeft size={24} />
                      )}
                    </button>
                  </label>

                  <label className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">Mostrar Desglose</span>
                      <span className="toggle-description">
                        Detalla base imponible, IVA y total
                      </span>
                    </div>
                    <button
                      className={`toggle-switch ${pricingConfig.showPriceBreakdown ? "active" : ""}`}
                      onClick={() =>
                        setPricingConfig({
                          ...pricingConfig,
                          showPriceBreakdown: !pricingConfig.showPriceBreakdown,
                        })
                      }
                    >
                      {pricingConfig.showPriceBreakdown ? (
                        <ToggleRight size={24} />
                      ) : (
                        <ToggleLeft size={24} />
                      )}
                    </button>
                  </label>
                </div>
              </div>

              <div className="settings-card">
                <h4>Márgenes y Descuentos</h4>

                <div className="form-row">
                  <div className="form-group">
                    <label>Margen por Defecto (%)</label>
                    <input
                      type="number"
                      value={pricingConfig.defaultMargin}
                      onChange={(e) =>
                        setPricingConfig({
                          ...pricingConfig,
                          defaultMargin: parseInt(e.target.value),
                        })
                      }
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="form-group">
                    <label>IVA (%)</label>
                    <input
                      type="number"
                      value={pricingConfig.taxRate}
                      onChange={(e) =>
                        setPricingConfig({
                          ...pricingConfig,
                          taxRate: parseInt(e.target.value),
                        })
                      }
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <label className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-label">
                      Precios con IVA Incluido
                    </span>
                    <span className="toggle-description">
                      Muestra precios finales en lugar de base imponible
                    </span>
                  </div>
                  <button
                    className={`toggle-switch ${pricingConfig.pricesIncludeTax ? "active" : ""}`}
                    onClick={() =>
                      setPricingConfig({
                        ...pricingConfig,
                        pricesIncludeTax: !pricingConfig.pricesIncludeTax,
                      })
                    }
                  >
                    {pricingConfig.pricesIncludeTax ? (
                      <ToggleRight size={24} />
                    ) : (
                      <ToggleLeft size={24} />
                    )}
                  </button>
                </label>

                <label className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-label">Habilitar Descuentos</span>
                    <span className="toggle-description">
                      Permite aplicar códigos de descuento
                    </span>
                  </div>
                  <button
                    className={`toggle-switch ${pricingConfig.enableDiscounts ? "active" : ""}`}
                    onClick={() =>
                      setPricingConfig({
                        ...pricingConfig,
                        enableDiscounts: !pricingConfig.enableDiscounts,
                      })
                    }
                  >
                    {pricingConfig.enableDiscounts ? (
                      <ToggleRight size={24} />
                    ) : (
                      <ToggleLeft size={24} />
                    )}
                  </button>
                </label>
              </div>

              <div className="settings-card">
                <h4>Pedidos y Envíos</h4>

                <div className="form-row">
                  <div className="form-group">
                    <label>Pedido Mínimo (€)</label>
                    <input
                      type="number"
                      value={pricingConfig.minOrderAmount}
                      onChange={(e) =>
                        setPricingConfig({
                          ...pricingConfig,
                          minOrderAmount: parseInt(e.target.value),
                        })
                      }
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Envío Gratis a partir de (€)</label>
                    <input
                      type="number"
                      value={pricingConfig.freeShippingThreshold}
                      onChange={(e) =>
                        setPricingConfig({
                          ...pricingConfig,
                          freeShippingThreshold: parseInt(e.target.value),
                        })
                      }
                      min="0"
                    />
                  </div>
                </div>

                <label className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-label">
                      Permitir Solicitar Presupuesto
                    </span>
                    <span className="toggle-description">
                      Los clientes pueden pedir presupuestos personalizados
                    </span>
                  </div>
                  <button
                    className={`toggle-switch ${pricingConfig.enableQuoteRequests ? "active" : ""}`}
                    onClick={() =>
                      setPricingConfig({
                        ...pricingConfig,
                        enableQuoteRequests: !pricingConfig.enableQuoteRequests,
                      })
                    }
                  >
                    {pricingConfig.enableQuoteRequests ? (
                      <ToggleRight size={24} />
                    ) : (
                      <ToggleLeft size={24} />
                    )}
                  </button>
                </label>
              </div>
            </div>
          )}

          {/* NOTIFICACIONES */}
          {activeTab === "notifications" && (
            <div className="settings-section">
              <h3>Configuración de Notificaciones</h3>

              <div className="settings-card">
                <h4>Email</h4>

                <label className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-label">
                      Notificaciones por Email
                    </span>
                    <span className="toggle-description">
                      Habilitar el envío de emails
                    </span>
                  </div>
                  <button
                    className={`toggle-switch ${notificationsConfig.email.enabled ? "active" : ""}`}
                    onClick={() =>
                      setNotificationsConfig({
                        ...notificationsConfig,
                        email: {
                          ...notificationsConfig.email,
                          enabled: !notificationsConfig.email.enabled,
                        },
                      })
                    }
                  >
                    {notificationsConfig.email.enabled ? (
                      <ToggleRight size={24} />
                    ) : (
                      <ToggleLeft size={24} />
                    )}
                  </button>
                </label>

                {notificationsConfig.email.enabled && (
                  <div className="notification-options">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={notificationsConfig.email.newOrder}
                        onChange={(e) =>
                          setNotificationsConfig({
                            ...notificationsConfig,
                            email: {
                              ...notificationsConfig.email,
                              newOrder: e.target.checked,
                            },
                          })
                        }
                      />
                      <span>Nuevo pedido</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={notificationsConfig.email.orderStatusChange}
                        onChange={(e) =>
                          setNotificationsConfig({
                            ...notificationsConfig,
                            email: {
                              ...notificationsConfig.email,
                              orderStatusChange: e.target.checked,
                            },
                          })
                        }
                      />
                      <span>Cambio de estado del pedido</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={notificationsConfig.email.lowStock}
                        onChange={(e) =>
                          setNotificationsConfig({
                            ...notificationsConfig,
                            email: {
                              ...notificationsConfig.email,
                              lowStock: e.target.checked,
                            },
                          })
                        }
                      />
                      <span>Stock bajo</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={notificationsConfig.email.newQuote}
                        onChange={(e) =>
                          setNotificationsConfig({
                            ...notificationsConfig,
                            email: {
                              ...notificationsConfig.email,
                              newQuote: e.target.checked,
                            },
                          })
                        }
                      />
                      <span>Nueva solicitud de presupuesto</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={notificationsConfig.email.weeklyReport}
                        onChange={(e) =>
                          setNotificationsConfig({
                            ...notificationsConfig,
                            email: {
                              ...notificationsConfig.email,
                              weeklyReport: e.target.checked,
                            },
                          })
                        }
                      />
                      <span>Informe semanal</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="settings-card">
                <h4>Notificaciones Push</h4>

                <label className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-label">Notificaciones Push</span>
                    <span className="toggle-description">
                      Recibe notificaciones en el navegador
                    </span>
                  </div>
                  <button
                    className={`toggle-switch ${notificationsConfig.push.enabled ? "active" : ""}`}
                    onClick={() =>
                      setNotificationsConfig({
                        ...notificationsConfig,
                        push: {
                          ...notificationsConfig.push,
                          enabled: !notificationsConfig.push.enabled,
                        },
                      })
                    }
                  >
                    {notificationsConfig.push.enabled ? (
                      <ToggleRight size={24} />
                    ) : (
                      <ToggleLeft size={24} />
                    )}
                  </button>
                </label>
              </div>

              <div className="settings-card">
                <h4>SMS</h4>

                <label className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-label">Notificaciones SMS</span>
                    <span className="toggle-description">
                      Requiere configuración de proveedor SMS
                    </span>
                  </div>
                  <button
                    className={`toggle-switch ${notificationsConfig.sms.enabled ? "active" : ""}`}
                    onClick={() =>
                      setNotificationsConfig({
                        ...notificationsConfig,
                        sms: {
                          ...notificationsConfig.sms,
                          enabled: !notificationsConfig.sms.enabled,
                        },
                      })
                    }
                  >
                    {notificationsConfig.sms.enabled ? (
                      <ToggleRight size={24} />
                    ) : (
                      <ToggleLeft size={24} />
                    )}
                  </button>
                </label>
              </div>
            </div>
          )}

          {/* INTEGRACIONES */}
          {activeTab === "integrations" && (
            <div className="settings-section">
              <h3>Integraciones</h3>

              <div className="settings-card">
                <h4>Analytics</h4>

                <div className="integration-item">
                  <div className="integration-header">
                    <div className="integration-icon">
                      <Globe size={24} />
                    </div>
                    <div className="integration-info">
                      <h5>Google Analytics</h5>
                      <p>Seguimiento de visitas y conversiones</p>
                    </div>
                    <button
                      className={`toggle-switch ${integrationsConfig.googleAnalytics.enabled ? "active" : ""}`}
                      onClick={() =>
                        setIntegrationsConfig({
                          ...integrationsConfig,
                          googleAnalytics: {
                            ...integrationsConfig.googleAnalytics,
                            enabled:
                              !integrationsConfig.googleAnalytics.enabled,
                          },
                        })
                      }
                    >
                      {integrationsConfig.googleAnalytics.enabled ? (
                        <ToggleRight size={24} />
                      ) : (
                        <ToggleLeft size={24} />
                      )}
                    </button>
                  </div>
                  {integrationsConfig.googleAnalytics.enabled && (
                    <div className="integration-config">
                      <input
                        type="text"
                        placeholder="Tracking ID (UA-XXXXXXXXX-X)"
                        value={integrationsConfig.googleAnalytics.trackingId}
                        onChange={(e) =>
                          setIntegrationsConfig({
                            ...integrationsConfig,
                            googleAnalytics: {
                              ...integrationsConfig.googleAnalytics,
                              trackingId: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="integration-item">
                  <div className="integration-header">
                    <div className="integration-icon facebook">
                      <Globe size={24} />
                    </div>
                    <div className="integration-info">
                      <h5>Facebook Pixel</h5>
                      <p>Seguimiento de conversiones de Facebook Ads</p>
                    </div>
                    <button
                      className={`toggle-switch ${integrationsConfig.facebookPixel.enabled ? "active" : ""}`}
                      onClick={() =>
                        setIntegrationsConfig({
                          ...integrationsConfig,
                          facebookPixel: {
                            ...integrationsConfig.facebookPixel,
                            enabled: !integrationsConfig.facebookPixel.enabled,
                          },
                        })
                      }
                    >
                      {integrationsConfig.facebookPixel.enabled ? (
                        <ToggleRight size={24} />
                      ) : (
                        <ToggleLeft size={24} />
                      )}
                    </button>
                  </div>
                  {integrationsConfig.facebookPixel.enabled && (
                    <div className="integration-config">
                      <input
                        type="text"
                        placeholder="Pixel ID"
                        value={integrationsConfig.facebookPixel.pixelId}
                        onChange={(e) =>
                          setIntegrationsConfig({
                            ...integrationsConfig,
                            facebookPixel: {
                              ...integrationsConfig.facebookPixel,
                              pixelId: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="settings-card">
                <h4>Pagos</h4>

                <div className="integration-item">
                  <div className="integration-header">
                    <div className="integration-icon stripe">
                      <CreditCard size={24} />
                    </div>
                    <div className="integration-info">
                      <h5>Stripe</h5>
                      <p>Acepta pagos con tarjeta de crédito</p>
                    </div>
                    <button
                      className={`toggle-switch ${integrationsConfig.stripe.enabled ? "active" : ""}`}
                      onClick={() =>
                        setIntegrationsConfig({
                          ...integrationsConfig,
                          stripe: {
                            ...integrationsConfig.stripe,
                            enabled: !integrationsConfig.stripe.enabled,
                          },
                        })
                      }
                    >
                      {integrationsConfig.stripe.enabled ? (
                        <ToggleRight size={24} />
                      ) : (
                        <ToggleLeft size={24} />
                      )}
                    </button>
                  </div>
                  {integrationsConfig.stripe.enabled && (
                    <div className="integration-config">
                      <input
                        type="text"
                        placeholder="Public Key (pk_...)"
                        value={integrationsConfig.stripe.publicKey}
                        onChange={(e) =>
                          setIntegrationsConfig({
                            ...integrationsConfig,
                            stripe: {
                              ...integrationsConfig.stripe,
                              publicKey: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="integration-item">
                  <div className="integration-header">
                    <div className="integration-icon paypal">
                      <CreditCard size={24} />
                    </div>
                    <div className="integration-info">
                      <h5>PayPal</h5>
                      <p>Pagos con PayPal</p>
                    </div>
                    <button
                      className={`toggle-switch ${integrationsConfig.paypal.enabled ? "active" : ""}`}
                      onClick={() =>
                        setIntegrationsConfig({
                          ...integrationsConfig,
                          paypal: {
                            ...integrationsConfig.paypal,
                            enabled: !integrationsConfig.paypal.enabled,
                          },
                        })
                      }
                    >
                      {integrationsConfig.paypal.enabled ? (
                        <ToggleRight size={24} />
                      ) : (
                        <ToggleLeft size={24} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="settings-card">
                <h4>Automatización</h4>

                <div className="integration-item">
                  <div className="integration-header">
                    <div className="integration-icon zapier">
                      <RefreshCw size={24} />
                    </div>
                    <div className="integration-info">
                      <h5>Zapier</h5>
                      <p>Conecta con 5000+ aplicaciones</p>
                    </div>
                    <button
                      className={`toggle-switch ${integrationsConfig.zapier.enabled ? "active" : ""}`}
                      onClick={() =>
                        setIntegrationsConfig({
                          ...integrationsConfig,
                          zapier: {
                            ...integrationsConfig.zapier,
                            enabled: !integrationsConfig.zapier.enabled,
                          },
                        })
                      }
                    >
                      {integrationsConfig.zapier.enabled ? (
                        <ToggleRight size={24} />
                      ) : (
                        <ToggleLeft size={24} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="integration-item">
                  <div className="integration-header">
                    <div className="integration-icon slack">
                      <Bell size={24} />
                    </div>
                    <div className="integration-info">
                      <h5>Slack</h5>
                      <p>Recibe notificaciones en Slack</p>
                    </div>
                    <button
                      className={`toggle-switch ${integrationsConfig.slack.enabled ? "active" : ""}`}
                      onClick={() =>
                        setIntegrationsConfig({
                          ...integrationsConfig,
                          slack: {
                            ...integrationsConfig.slack,
                            enabled: !integrationsConfig.slack.enabled,
                          },
                        })
                      }
                    >
                      {integrationsConfig.slack.enabled ? (
                        <ToggleRight size={24} />
                      ) : (
                        <ToggleLeft size={24} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEGURIDAD */}
          {activeTab === "security" && (
            <div className="settings-section">
              <h3>Seguridad</h3>

              <div className="settings-card">
                <h4>Contraseñas</h4>

                <label className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-label">
                      Contraseñas Fuertes Obligatorias
                    </span>
                    <span className="toggle-description">
                      Requiere mayúsculas, minúsculas, números y símbolos
                    </span>
                  </div>
                  <button
                    className={`toggle-switch ${securityConfig.requireStrongPasswords ? "active" : ""}`}
                    onClick={() =>
                      setSecurityConfig({
                        ...securityConfig,
                        requireStrongPasswords:
                          !securityConfig.requireStrongPasswords,
                      })
                    }
                  >
                    {securityConfig.requireStrongPasswords ? (
                      <ToggleRight size={24} />
                    ) : (
                      <ToggleLeft size={24} />
                    )}
                  </button>
                </label>

                <div className="form-row">
                  <div className="form-group">
                    <label>Longitud Mínima</label>
                    <input
                      type="number"
                      value={securityConfig.passwordMinLength}
                      onChange={(e) =>
                        setSecurityConfig({
                          ...securityConfig,
                          passwordMinLength: parseInt(e.target.value),
                        })
                      }
                      min="6"
                      max="32"
                    />
                  </div>

                  <div className="form-group">
                    <label>Expiración (días)</label>
                    <input
                      type="number"
                      value={securityConfig.passwordExpiry}
                      onChange={(e) =>
                        setSecurityConfig({
                          ...securityConfig,
                          passwordExpiry: parseInt(e.target.value),
                        })
                      }
                      min="0"
                      max="365"
                    />
                    <small>0 = nunca</small>
                  </div>
                </div>

                <label className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-label">
                      Autenticación de Dos Factores (2FA)
                    </span>
                    <span className="toggle-description">
                      Requiere código adicional al iniciar sesión
                    </span>
                  </div>
                  <button
                    className={`toggle-switch ${securityConfig.twoFactorAuth ? "active" : ""}`}
                    onClick={() =>
                      setSecurityConfig({
                        ...securityConfig,
                        twoFactorAuth: !securityConfig.twoFactorAuth,
                      })
                    }
                  >
                    {securityConfig.twoFactorAuth ? (
                      <ToggleRight size={24} />
                    ) : (
                      <ToggleLeft size={24} />
                    )}
                  </button>
                </label>
              </div>

              <div className="settings-card">
                <h4>Sesiones</h4>

                <div className="form-group">
                  <label>Timeout de Sesión (minutos)</label>
                  <input
                    type="number"
                    value={securityConfig.sessionTimeout}
                    onChange={(e) =>
                      setSecurityConfig({
                        ...securityConfig,
                        sessionTimeout: parseInt(e.target.value),
                      })
                    }
                    min="5"
                    max="1440"
                  />
                </div>

                <div className="form-group">
                  <label>Intentos de Login Máximos</label>
                  <input
                    type="number"
                    value={securityConfig.maxLoginAttempts}
                    onChange={(e) =>
                      setSecurityConfig({
                        ...securityConfig,
                        maxLoginAttempts: parseInt(e.target.value),
                      })
                    }
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              <div className="settings-card">
                <h4>Registro de Auditoría</h4>

                <label className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-label">
                      Habilitar Logs de Auditoría
                    </span>
                    <span className="toggle-description">
                      Registra todas las acciones importantes
                    </span>
                  </div>
                  <button
                    className={`toggle-switch ${securityConfig.enableAuditLog ? "active" : ""}`}
                    onClick={() =>
                      setSecurityConfig({
                        ...securityConfig,
                        enableAuditLog: !securityConfig.enableAuditLog,
                      })
                    }
                  >
                    {securityConfig.enableAuditLog ? (
                      <ToggleRight size={24} />
                    ) : (
                      <ToggleLeft size={24} />
                    )}
                  </button>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
