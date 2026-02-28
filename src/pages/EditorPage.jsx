import React, { useState, useMemo, useEffect } from "react";
import {
  Palette,
  Ruler,
  Type,
  Paintbrush,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Square,
  Circle,
  Triangle,
  Save,
  RotateCcw,
  Eye,
  Layout,
  Monitor,
  Smartphone,
  Upload,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  X,
} from "lucide-react";
import { useEditorConfig } from "../hooks/useEditorConfig";

// Definición completa de todos los pasos posibles
const ALL_STEPS = {
  type: {
    id: "type",
    title: "Tipo",
    icon: Palette,
    description: "Selecciona el tipo de rótulo",
  },
  dimensions: {
    id: "dimensions",
    title: "Dimensiones",
    icon: Ruler,
    description: "Define tamaño y materiales",
  },
  design: {
    id: "design",
    title: "Diseño",
    icon: Type,
    description: "Añade texto y elementos",
  },
  colors: {
    id: "colors",
    title: "Estilo",
    icon: Paintbrush,
    description: "Personaliza colores y acabados",
  },
  extras: {
    id: "extras",
    title: "Extras",
    icon: CheckCircle,
    description: "Opciones adicionales",
  },
};

const ROTULO_TYPES = [
  {
    id: "luminoso",
    name: "Rótulo Luminoso",
    icon: Lightbulb,
    description: "Ideal para negocios que operan de noche",
    price: "Desde €450",
    popular: true,
  },
  {
    id: "vinilo",
    name: "Vinilo Escaparate",
    icon: Square,
    description: "Perfecto para escaparates y cristales",
    price: "Desde €120",
    popular: false,
  },
  {
    id: "corporeas",
    name: "Letras Corpóreas",
    icon: Type,
    description: "Letras en 3D con gran impacto visual",
    price: "Desde €890",
    popular: true,
  },
  {
    id: "panel",
    name: "Panel Publicitario",
    icon: Square,
    description: "Gran formato para exteriores",
    price: "Desde €320",
    popular: false,
  },
  {
    id: "metalico",
    name: "Rótulo Metálico",
    icon: Circle,
    description: "Elegante y duradero en metal",
    price: "Desde €280",
    popular: false,
  },
  {
    id: "bandera",
    name: "Banderola",
    icon: Triangle,
    description: "Visible desde ambos lados",
    price: "Desde €180",
    popular: false,
  },
];

const MATERIALS = [
  {
    id: "pvc",
    name: "PVC Espumado",
    price: "Económico",
    features: ["Ligero", "Fácil instalación", "Interior/Exterior"],
  },
  {
    id: "aluminio",
    name: "Aluminio Composite",
    price: "Premium",
    features: ["Muy duradero", "Resistente", "Alta calidad"],
  },
  {
    id: "metacrilato",
    name: "Metacrilato",
    price: "Premium",
    features: ["Efecto cristal", "Luminoso", "Elegante"],
  },
  {
    id: "acero",
    name: "Acero Inoxidable",
    price: "Luxury",
    features: ["Máxima durabilidad", "Acabado profesional", "Intemporal"],
  },
];

const COLORS = [
  { id: "white", name: "Blanco", hex: "#FFFFFF" },
  { id: "black", name: "Negro", hex: "#111827" },
  { id: "red", name: "Rojo", hex: "#DC2626" },
  { id: "blue", name: "Azul", hex: "#2563EB" },
  { id: "green", name: "Verde", hex: "#16A34A" },
  { id: "yellow", name: "Amarillo", hex: "#FACC15" },
  { id: "purple", name: "Morado", hex: "#7C3AED" },
  { id: "orange", name: "Naranja", hex: "#F97316" },
];

const FONTS = [
  { id: "modern", name: "Moderna", sample: "Moderno" },
  { id: "classic", name: "Clásica", sample: "Clásico" },
  { id: "bold", name: "Bold", sample: "BOLD" },
  { id: "elegant", name: "Elegante", sample: "Elegante" },
  { id: "retro", name: "Retro", sample: "Retro" },
  { id: "minimal", name: "Minimalista", sample: "Clean" },
];

export default function EditorPage({ standalone = false }) {
  const { config, getActiveSteps, isStepEnabled, getCustomFields } =
    useEditorConfig();
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState("type");
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    tipo: "",
    material: "",
    ancho: 100,
    alto: 50,
    texto: "",
    fuente: "modern",
    colorFondo: "white",
    colorTexto: "black",
    iluminacion: false,
    instalacion: false,
    // Campos personalizados se inicializan dinámicamente
    customFields: {},
  });

  // Inicializar campos personalizados vacíos
  useEffect(() => {
    const customFields = getCustomFields();
    if (customFields.length > 0) {
      setFormData((prev) => {
        const newCustomFields = { ...prev.customFields };
        customFields.forEach((field) => {
          if (!(field.name in newCustomFields)) {
            newCustomFields[field.name] =
              field.type === "checkbox" ? false : "";
          }
        });
        return { ...prev, customFields: newCustomFields };
      });
    }
  }, [config.customFields]);

  // Obtener pasos activos ordenados según configuración
  const activeSteps = useMemo(() => getActiveSteps(), [getActiveSteps]);

  // Obtener campos personalizados
  const customFields = useMemo(() => getCustomFields(), [getCustomFields]);

  // Crear array de STEPS basado en la configuración
  const STEPS = useMemo(() => {
    return activeSteps.map((step, index) => ({
      id: index + 1,
      key: step.key,
      title: ALL_STEPS[step.key]?.title || step.key,
      icon: ALL_STEPS[step.key]?.icon || Square,
      description: ALL_STEPS[step.key]?.description || "",
    }));
  }, [activeSteps]);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const calculatePrice = () => {
    let base = 0;
    switch (formData.tipo) {
      case "luminoso":
        base = 450;
        break;
      case "vinilo":
        base = 120;
        break;
      case "corporeas":
        base = 890;
        break;
      case "panel":
        base = 320;
        break;
      case "metalico":
        base = 280;
        break;
      case "bandera":
        base = 180;
        break;
      default:
        base = 0;
    }

    const area = (formData.ancho * formData.alto) / 10000;
    let materialMultiplier = 1;
    switch (formData.material) {
      case "aluminio":
        materialMultiplier = 1.5;
        break;
      case "metacrilato":
        materialMultiplier = 2;
        break;
      case "acero":
        materialMultiplier = 3;
        break;
      default:
        materialMultiplier = 1;
    }

    let extras = 0;
    if (formData.iluminacion) extras += 150;
    if (formData.instalacion) extras += 80;

    return Math.round(base + area * 50 * materialMultiplier + extras);
  };

  // Actualizar valor de campo personalizado
  const updateCustomField = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [fieldName]: value,
      },
    }));
  };

  // Renderizar campo personalizado
  const renderCustomField = (field) => {
    const value = formData.customFields[field.name] ?? "";

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "url":
        return (
          <div className="single-sidebar-field" key={field.id}>
            <label>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type={field.type}
              value={value}
              onChange={(e) => updateCustomField(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
            {field.helpText && <small>{field.helpText}</small>}
          </div>
        );

      case "textarea":
        return (
          <div className="single-sidebar-field" key={field.id}>
            <label>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => updateCustomField(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              rows={3}
            />
            {field.helpText && <small>{field.helpText}</small>}
          </div>
        );

      case "number":
        return (
          <div className="single-sidebar-field" key={field.id}>
            <label>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => updateCustomField(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
            {field.helpText && <small>{field.helpText}</small>}
          </div>
        );

      case "select":
        return (
          <div className="single-sidebar-field" key={field.id}>
            <label>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => updateCustomField(field.name, e.target.value)}
              required={field.required}
            >
              <option value="">{field.placeholder || "Seleccionar..."}</option>
              {field.options?.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {field.helpText && <small>{field.helpText}</small>}
          </div>
        );

      case "checkbox":
        return (
          <label className="single-sidebar-checkbox" key={field.id}>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => updateCustomField(field.name, e.target.checked)}
            />
            <span>{field.label}</span>
          </label>
        );

      case "radio":
        return (
          <div className="single-sidebar-field" key={field.id}>
            <label>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <div className="single-sidebar-radio-group">
              {field.options?.map((option, idx) => (
                <label key={idx} className="radio-option">
                  <input
                    type="radio"
                    name={field.name}
                    value={option}
                    checked={value === option}
                    onChange={(e) =>
                      updateCustomField(field.name, e.target.value)
                    }
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {field.helpText && <small>{field.helpText}</small>}
          </div>
        );

      case "date":
        return (
          <div className="single-sidebar-field" key={field.id}>
            <label>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type="date"
              value={value}
              onChange={(e) => updateCustomField(field.name, e.target.value)}
              required={field.required}
            />
            {field.helpText && <small>{field.helpText}</small>}
          </div>
        );

      case "color":
        return (
          <div className="single-sidebar-field" key={field.id}>
            <label>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <div className="color-field-input">
              <input
                type="color"
                value={value || "#000000"}
                onChange={(e) => updateCustomField(field.name, e.target.value)}
              />
              <input
                type="text"
                value={value}
                onChange={(e) => updateCustomField(field.name, e.target.value)}
                placeholder="#000000"
              />
            </div>
            {field.helpText && <small>{field.helpText}</small>}
          </div>
        );

      default:
        return null;
    }
  };

  // ==================== RENDERIZADO DE SECCIONES ====================

  const renderTypeSection = () => (
    <div className="wizard-content">
      <h3 className="wizard-title">Selecciona el tipo de rótulo</h3>
      <p className="wizard-subtitle">
        Elige el tipo que mejor se adapte a tu negocio
      </p>

      <div className="wizard-grid">
        {ROTULO_TYPES.map((tipo) => {
          const TypeIcon = tipo.icon;
          const isSelected = formData.tipo === tipo.id;

          return (
            <button
              key={tipo.id}
              className={`wizard-card ${isSelected ? "wizard-card-selected" : ""}`}
              onClick={() => updateFormData("tipo", tipo.id)}
            >
              {tipo.popular && (
                <span className="wizard-card-badge">Popular</span>
              )}
              <div className="wizard-card-icon">
                <TypeIcon size={32} />
              </div>
              <h4 className="wizard-card-title">{tipo.name}</h4>
              <p className="wizard-card-description">{tipo.description}</p>
              {config.showPricePreview && (
                <span className="wizard-card-price">{tipo.price}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderDimensionsSection = () => (
    <div className="wizard-content">
      <h3 className="wizard-title">Dimensiones y materiales</h3>
      <p className="wizard-subtitle">Define el tamaño y elige el material</p>

      <div className="wizard-section">
        <h4 className="wizard-section-title">Dimensiones (cm)</h4>
        <div className="wizard-dimensions">
          <div className="wizard-dimension-input">
            <label>Ancho</label>
            <input
              type="number"
              value={formData.ancho}
              onChange={(e) =>
                updateFormData("ancho", parseInt(e.target.value) || 0)
              }
              min="10"
              max="500"
            />
            <span>cm</span>
          </div>

          <div className="wizard-dimension-x">×</div>

          <div className="wizard-dimension-input">
            <label>Alto</label>
            <input
              type="number"
              value={formData.alto}
              onChange={(e) =>
                updateFormData("alto", parseInt(e.target.value) || 0)
              }
              min="10"
              max="500"
            />
            <span>cm</span>
          </div>
        </div>
        <div className="wizard-dimension-preview">
          <div
            className="wizard-preview-box"
            style={{
              width: `${Math.min(formData.ancho, 300)}px`,
              height: `${Math.min(formData.alto, 150)}px`,
            }}
          >
            <span>
              {formData.ancho} × {formData.alto} cm
            </span>
          </div>
        </div>
      </div>

      <div className="wizard-section">
        <h4 className="wizard-section-title">Material</h4>
        <div className="wizard-materials">
          {MATERIALS.map((material) => {
            const isSelected = formData.material === material.id;
            return (
              <button
                key={material.id}
                className={`wizard-material ${isSelected ? "wizard-material-selected" : ""}`}
                onClick={() => updateFormData("material", material.id)}
              >
                <div className="wizard-material-header">
                  <h5>{material.name}</h5>
                  <span className="wizard-material-price">
                    {material.price}
                  </span>
                </div>
                <ul className="wizard-material-features">
                  {material.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderDesignSection = () => (
    <div className="wizard-content">
      <h3 className="wizard-title">Diseño y texto</h3>
      <p className="wizard-subtitle">Añade el texto y elige la tipografía</p>

      <div className="wizard-section">
        <label className="wizard-label">Texto del rótulo</label>
        <input
          type="text"
          className="wizard-text-input"
          placeholder="Escribe el texto de tu rótulo..."
          value={formData.texto}
          onChange={(e) => updateFormData("texto", e.target.value)}
          maxLength={50}
        />
        <span className="wizard-char-count">
          {formData.texto.length}/50 caracteres
        </span>
      </div>

      {config.enableImageUpload && (
        <div className="wizard-section">
          <h4 className="wizard-section-title">Subir diseño propio</h4>
          <div className="image-upload-large">
            <div className="upload-placeholder">
              <Upload size={32} />
              <span>Arrastra tu diseño aquí o haz clic para subir</span>
              <small>
                Formatos: {config.allowedFormats.join(", ")}. Máx:{" "}
                {config.maxUploadSize}MB
              </small>
            </div>
            <input
              type="file"
              accept={config.allowedFormats.map((f) => `.${f}`).join(",")}
            />
          </div>
        </div>
      )}

      <div className="wizard-section">
        <h4 className="wizard-section-title">Tipografía</h4>
        <div className="wizard-fonts">
          {FONTS.map((font) => {
            const isSelected = formData.fuente === font.id;
            return (
              <button
                key={font.id}
                className={`wizard-font ${isSelected ? "wizard-font-selected" : ""}`}
                onClick={() => updateFormData("fuente", font.id)}
                style={{ fontFamily: font.id }}
              >
                <span className="wizard-font-sample">{font.sample}</span>
                <span className="wizard-font-name">{font.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderColorsSection = () => (
    <div className="wizard-content">
      <h3 className="wizard-title">Colores y acabados</h3>
      <p className="wizard-subtitle">Personaliza los colores y añade extras</p>

      <div className="wizard-section">
        <h4 className="wizard-section-title">Color de fondo</h4>
        <div className="wizard-colors">
          {COLORS.map((color) => (
            <button
              key={color.id}
              className={`wizard-color ${formData.colorFondo === color.id ? "wizard-color-selected" : ""}`}
              onClick={() => updateFormData("colorFondo", color.id)}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {formData.colorFondo === color.id && (
                <CheckCircle
                  size={20}
                  color={color.id === "white" ? "#000" : "#fff"}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="wizard-section">
        <h4 className="wizard-section-title">Color del texto</h4>
        <div className="wizard-colors">
          {COLORS.map((color) => (
            <button
              key={color.id}
              className={`wizard-color ${formData.colorTexto === color.id ? "wizard-color-selected" : ""}`}
              onClick={() => updateFormData("colorTexto", color.id)}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {formData.colorTexto === color.id && (
                <CheckCircle
                  size={20}
                  color={color.id === "white" ? "#000" : "#fff"}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="wizard-section">
        <h4 className="wizard-section-title">Extras</h4>
        <div className="wizard-extras">
          <label className="wizard-checkbox">
            <input
              type="checkbox"
              checked={formData.iluminacion}
              onChange={(e) => updateFormData("iluminacion", e.target.checked)}
            />
            <span className="wizard-checkbox-label">
              <strong>Iluminación LED</strong>
              {config.showPricePreview && <span>+€150</span>}
            </span>
          </label>

          <label className="wizard-checkbox">
            <input
              type="checkbox"
              checked={formData.instalacion}
              onChange={(e) => updateFormData("instalacion", e.target.checked)}
            />
            <span className="wizard-checkbox-label">
              <strong>Instalación profesional</strong>
              {config.showPricePreview && <span>+€80</span>}
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderExtrasSection = () => (
    <div className="wizard-content">
      <h3 className="wizard-title">Opciones adicionales</h3>
      <p className="wizard-subtitle">Añade extras a tu pedido</p>

      {config.showStockWarnings && (
        <div className="wizard-alert wizard-alert-info">
          <AlertCircle size={20} />
          <span>Todos los materiales están disponibles en stock</span>
        </div>
      )}

      <div className="wizard-section">
        <h4 className="wizard-section-title">Servicios adicionales</h4>
        <div className="wizard-extras">
          <label className="wizard-checkbox">
            <input
              type="checkbox"
              checked={formData.iluminacion}
              onChange={(e) => updateFormData("iluminacion", e.target.checked)}
            />
            <span className="wizard-checkbox-label">
              <strong>Iluminación LED integrada</strong>
              {config.showPricePreview && <span>+€150</span>}
            </span>
          </label>

          <label className="wizard-checkbox">
            <input
              type="checkbox"
              checked={formData.instalacion}
              onChange={(e) => updateFormData("instalacion", e.target.checked)}
            />
            <span className="wizard-checkbox-label">
              <strong>Instalación profesional incluida</strong>
              {config.showPricePreview && <span>+€80</span>}
            </span>
          </label>

          <label className="wizard-checkbox">
            <input type="checkbox" />
            <span className="wizard-checkbox-label">
              <strong>Garantía extendida (5 años)</strong>
              {config.showPricePreview && <span>+€50</span>}
            </span>
          </label>

          <label className="wizard-checkbox">
            <input type="checkbox" />
            <span className="wizard-checkbox-label">
              <strong>Mantenimiento anual</strong>
              {config.showPricePreview && <span>+€30/año</span>}
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSummarySection = () => (
    <div className="wizard-content">
      <h3 className="wizard-title">Resumen de tu pedido</h3>
      <p className="wizard-subtitle">
        Revisa todos los detalles antes de confirmar
      </p>

      <div className="wizard-summary">
        {isStepEnabled("type") && (
          <div className="wizard-summary-item">
            <span className="wizard-summary-label">Tipo</span>
            <span className="wizard-summary-value">
              {ROTULO_TYPES.find((t) => t.id === formData.tipo)?.name ||
                "No seleccionado"}
            </span>
          </div>
        )}

        {isStepEnabled("dimensions") && (
          <>
            <div className="wizard-summary-item">
              <span className="wizard-summary-label">Dimensiones</span>
              <span className="wizard-summary-value">
                {formData.ancho} × {formData.alto} cm
              </span>
            </div>
            <div className="wizard-summary-item">
              <span className="wizard-summary-label">Material</span>
              <span className="wizard-summary-value">
                {MATERIALS.find((m) => m.id === formData.material)?.name ||
                  "No seleccionado"}
              </span>
            </div>
          </>
        )}

        {isStepEnabled("design") && (
          <>
            <div className="wizard-summary-item">
              <span className="wizard-summary-label">Texto</span>
              <span className="wizard-summary-value">
                {formData.texto || "Sin texto"}
              </span>
            </div>
            <div className="wizard-summary-item">
              <span className="wizard-summary-label">Fuente</span>
              <span className="wizard-summary-value">
                {FONTS.find((f) => f.id === formData.fuente)?.name}
              </span>
            </div>
          </>
        )}

        {isStepEnabled("colors") && (
          <div className="wizard-summary-item">
            <span className="wizard-summary-label">Colores</span>
            <span className="wizard-summary-value">
              Fondo: {COLORS.find((c) => c.id === formData.colorFondo)?.name} /
              Texto: {COLORS.find((c) => c.id === formData.colorTexto)?.name}
            </span>
          </div>
        )}

        {formData.iluminacion && (
          <div className="wizard-summary-item">
            <span className="wizard-summary-label">Extras</span>
            <span className="wizard-summary-value">
              Iluminación LED (+€150)
            </span>
          </div>
        )}

        {formData.instalacion && (
          <div className="wizard-summary-item">
            <span className="wizard-summary-label"></span>
            <span className="wizard-summary-value">Instalación (+€80)</span>
          </div>
        )}

        {config.showPricePreview && (
          <div className="wizard-summary-total">
            <span>Total estimado</span>
            <span className="wizard-summary-price">€{calculatePrice()}</span>
          </div>
        )}
      </div>

      <div className="wizard-preview-section">
        <button
          className="btn btn-secondary"
          onClick={() => setShowPreview(!showPreview)}
        >
          <Eye size={20} />
          {showPreview ? "Ocultar" : "Ver"} vista previa
        </button>

        {showPreview && (
          <div
            className="wizard-preview"
            style={{
              backgroundColor: COLORS.find((c) => c.id === formData.colorFondo)
                ?.hex,
              width: `${Math.min(formData.ancho * 2, 400)}px`,
              height: `${Math.min(formData.alto * 2, 200)}px`,
            }}
          >
            <span
              style={{
                color: COLORS.find((c) => c.id === formData.colorTexto)?.hex,
                fontFamily: formData.fuente,
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            >
              {formData.texto || "Vista previa"}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // Renderizar paso según su key
  const renderStepContent = (stepKey) => {
    switch (stepKey) {
      case "type":
        return renderTypeSection();
      case "dimensions":
        return renderDimensionsSection();
      case "design":
        return renderDesignSection();
      case "colors":
        return renderColorsSection();
      case "extras":
        return renderExtrasSection();
      default:
        return null;
    }
  };

  // ==================== MODOS DE EDITOR ====================

  // MODO WIZARD: Paso a paso con indicador
  const renderWizardMode = () => (
    <>
      {/* Step Indicator */}
      <div className="wizard-steps">
        {STEPS.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={step.id}
              className={`wizard-step ${isActive ? "wizard-step-active" : ""} ${isCompleted ? "wizard-step-completed" : ""}`}
            >
              <div className="wizard-step-indicator">
                <div
                  className={`wizard-step-number ${isActive ? "wizard-step-number-active" : ""} ${isCompleted ? "wizard-step-number-completed" : ""}`}
                >
                  {isCompleted ? (
                    <CheckCircle size={20} />
                  ) : (
                    <StepIcon size={20} />
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`wizard-step-line ${isCompleted ? "wizard-step-line-completed" : ""}`}
                  />
                )}
              </div>
              <div className="wizard-step-content">
                <span className="wizard-step-title">{step.title}</span>
                <span className="wizard-step-description">
                  {step.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Body */}
      <div className="wizard-body">
        {STEPS[currentStep] && renderStepContent(STEPS[currentStep].key)}
      </div>

      {/* Footer */}
      <div className="wizard-footer">
        <button className="btn" onClick={prevStep} disabled={currentStep === 0}>
          <ChevronLeft size={20} />
          Anterior
        </button>

        <div className="wizard-progress">
          Paso {currentStep + 1} de {STEPS.length}
        </div>

        {currentStep === STEPS.length - 1 ? (
          <button className="btn btn-primary">
            <Save size={20} />
            Guardar Pedido
          </button>
        ) : (
          <button className="btn btn-primary" onClick={nextStep}>
            Siguiente
            <ChevronRight size={20} />
          </button>
        )}

        {config.enableSaveDraft && (
          <button className="btn btn-secondary" style={{ marginLeft: "8px" }}>
            <RotateCcw size={18} />
            Guardar borrador
          </button>
        )}
      </div>
    </>
  );

  // MODO SINGLE: Sidebar izquierda + Preview derecha
  const renderSingleMode = () => (
    <div className="single-editor">
      <div className="single-layout">
        {/* Sidebar izquierda con configuración */}
        <div className="single-sidebar">
          <div className="single-sidebar-header">
            <h3>Configuración</h3>
          </div>

          <div className="single-sidebar-content">
            {/* Sección Tipo */}
            {isStepEnabled("type") && (
              <div className="single-sidebar-section">
                <h4>Tipo de Rótulo</h4>
                <div className="single-sidebar-options">
                  {ROTULO_TYPES.map((tipo) => {
                    const TypeIcon = tipo.icon;
                    const isSelected = formData.tipo === tipo.id;
                    return (
                      <button
                        key={tipo.id}
                        className={`single-sidebar-option ${isSelected ? "selected" : ""}`}
                        onClick={() => updateFormData("tipo", tipo.id)}
                      >
                        <TypeIcon size={20} />
                        <span>{tipo.name}</span>
                        {config.showPricePreview && <small>{tipo.price}</small>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sección Dimensiones y Material */}
            {isStepEnabled("dimensions") && (
              <div className="single-sidebar-section">
                <h4>Dimensiones (cm)</h4>
                <div className="single-sidebar-dimensions">
                  <div className="dimension-field">
                    <label>Ancho</label>
                    <input
                      type="number"
                      value={formData.ancho}
                      onChange={(e) =>
                        updateFormData("ancho", parseInt(e.target.value) || 0)
                      }
                      min="10"
                      max="500"
                    />
                  </div>
                  <span className="dimension-x">×</span>
                  <div className="dimension-field">
                    <label>Alto</label>
                    <input
                      type="number"
                      value={formData.alto}
                      onChange={(e) =>
                        updateFormData("alto", parseInt(e.target.value) || 0)
                      }
                      min="10"
                      max="500"
                    />
                  </div>
                </div>

                <h4 style={{ marginTop: "1rem" }}>Material</h4>
                <select
                  className="single-sidebar-select"
                  value={formData.material}
                  onChange={(e) => updateFormData("material", e.target.value)}
                >
                  <option value="">Seleccionar material...</option>
                  {MATERIALS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} - {m.price}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sección Diseño */}
            {isStepEnabled("design") && (
              <div className="single-sidebar-section">
                <h4>Texto</h4>
                <input
                  type="text"
                  className="single-sidebar-input"
                  placeholder="Escribe el texto del rótulo..."
                  value={formData.texto}
                  onChange={(e) => updateFormData("texto", e.target.value)}
                  maxLength={50}
                />
                <small className="char-count">{formData.texto.length}/50</small>

                <h4 style={{ marginTop: "1rem" }}>Tipografía</h4>
                <div className="single-sidebar-fonts">
                  {FONTS.map((font) => {
                    const isSelected = formData.fuente === font.id;
                    return (
                      <button
                        key={font.id}
                        className={`single-sidebar-font ${isSelected ? "selected" : ""}`}
                        onClick={() => updateFormData("fuente", font.id)}
                        style={{ fontFamily: font.id }}
                      >
                        {font.sample}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sección Colores */}
            {isStepEnabled("colors") && (
              <div className="single-sidebar-section">
                <h4>Color de Fondo</h4>
                <div className="single-sidebar-colors">
                  {COLORS.map((color) => (
                    <button
                      key={color.id}
                      className={`single-sidebar-color ${formData.colorFondo === color.id ? "selected" : ""}`}
                      onClick={() => updateFormData("colorFondo", color.id)}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {formData.colorFondo === color.id && (
                        <CheckCircle
                          size={16}
                          color={color.id === "white" ? "#000" : "#fff"}
                        />
                      )}
                    </button>
                  ))}
                </div>

                <h4 style={{ marginTop: "1rem" }}>Color del Texto</h4>
                <div className="single-sidebar-colors">
                  {COLORS.map((color) => (
                    <button
                      key={color.id}
                      className={`single-sidebar-color ${formData.colorTexto === color.id ? "selected" : ""}`}
                      onClick={() => updateFormData("colorTexto", color.id)}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {formData.colorTexto === color.id && (
                        <CheckCircle
                          size={16}
                          color={color.id === "white" ? "#000" : "#fff"}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sección Extras */}
            {isStepEnabled("extras") && (
              <div className="single-sidebar-section">
                <h4>Extras</h4>
                <label className="single-sidebar-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.iluminacion}
                    onChange={(e) =>
                      updateFormData("iluminacion", e.target.checked)
                    }
                  />
                  <span>
                    Iluminación LED {config.showPricePreview && "(+€150)"}
                  </span>
                </label>
                <label className="single-sidebar-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.instalacion}
                    onChange={(e) =>
                      updateFormData("instalacion", e.target.checked)
                    }
                  />
                  <span>Instalación {config.showPricePreview && "(+€80)"}</span>
                </label>
              </div>
            )}

            {/* Campos Personalizados */}
            {customFields.length > 0 && (
              <div className="single-sidebar-section custom-fields-section">
                <h4>Información Adicional</h4>
                {customFields.map((field) => renderCustomField(field))}
              </div>
            )}
          </div>

          {/* Footer del sidebar */}
          <div className="single-sidebar-footer">
            {config.showPricePreview && (
              <div className="single-sidebar-total">
                <span>Total estimado:</span>
                <span className="price">€{calculatePrice()}</span>
              </div>
            )}
            <div className="single-sidebar-actions">
              {config.enableSaveDraft && (
                <button className="btn btn-secondary btn-small">
                  <RotateCcw size={16} />
                  Borrador
                </button>
              )}
              <button className="btn btn-primary btn-small">
                <Save size={16} />
                Guardar
              </button>
            </div>
          </div>
        </div>

        {/* Preview derecha */}
        <div className="single-preview-area">
          <div className="single-preview-header">
            <h3>Vista Previa</h3>
            <span className="preview-dimensions">
              {formData.ancho} × {formData.alto} cm
            </span>
          </div>

          <div className="single-preview-container">
            <div
              className="single-preview-sign"
              style={{
                backgroundColor: COLORS.find(
                  (c) => c.id === formData.colorFondo,
                )?.hex,
                width: `${Math.min(formData.ancho * 3, 500)}px`,
                height: `${Math.min(formData.alto * 3, 300)}px`,
                boxShadow: formData.iluminacion
                  ? `0 0 60px ${COLORS.find((c) => c.id === formData.colorFondo)?.hex}40, 0 20px 40px rgba(0,0,0,0.3)`
                  : "0 20px 40px rgba(0,0,0,0.2)",
              }}
            >
              <span
                style={{
                  color: COLORS.find((c) => c.id === formData.colorTexto)?.hex,
                  fontFamily: formData.fuente,
                  fontSize: `${Math.min(formData.alto * 0.5, 48)}px`,
                  fontWeight: "bold",
                  textShadow: formData.iluminacion
                    ? "0 0 20px currentColor"
                    : "none",
                }}
              >
                {formData.texto || "Tu texto aquí"}
              </span>
            </div>
          </div>

          {/* Info del rótulo */}
          <div className="single-preview-info">
            <div className="preview-info-item">
              <span className="label">Tipo:</span>
              <span className="value">
                {ROTULO_TYPES.find((t) => t.id === formData.tipo)?.name ||
                  "No seleccionado"}
              </span>
            </div>
            <div className="preview-info-item">
              <span className="label">Material:</span>
              <span className="value">
                {MATERIALS.find((m) => m.id === formData.material)?.name ||
                  "No seleccionado"}
              </span>
            </div>
            <div className="preview-info-item">
              <span className="label">Extras:</span>
              <span className="value">
                {[
                  formData.iluminacion && "Iluminación LED",
                  formData.instalacion && "Instalación",
                ]
                  .filter(Boolean)
                  .join(", ") || "Ninguno"}
              </span>
            </div>
            {/* Campos personalizados en preview */}
            {customFields
              .filter(
                (field) =>
                  field.showInPreview && formData.customFields[field.name],
              )
              .map((field) => (
                <div className="preview-info-item" key={field.id}>
                  <span className="label">{field.label}:</span>
                  <span className="value">
                    {field.type === "checkbox"
                      ? formData.customFields[field.name]
                        ? "Sí"
                        : "No"
                      : formData.customFields[field.name]}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  // MODO SIMPLIFIED: Solo campos esenciales
  const renderSimplifiedMode = () => (
    <div className="simplified-editor">
      <div className="simplified-header">
        <h2>Crear Rótulo Rápido</h2>
        <p>Solo los campos esenciales para pedir tu rótulo</p>
      </div>

      <div className="simplified-form">
        {/* Tipo simplificado - solo los populares */}
        <div className="simplified-section">
          <label>Tipo de rótulo</label>
          <div className="simplified-options">
            {ROTULO_TYPES.filter((t) => t.popular).map((tipo) => {
              const TypeIcon = tipo.icon;
              return (
                <button
                  key={tipo.id}
                  className={`simplified-option ${formData.tipo === tipo.id ? "simplified-option-selected" : ""}`}
                  onClick={() => updateFormData("tipo", tipo.id)}
                >
                  <TypeIcon size={24} />
                  <span>{tipo.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dimensiones simplificadas */}
        <div className="simplified-section">
          <label>Dimensiones (cm)</label>
          <div className="simplified-dimensions">
            <input
              type="number"
              placeholder="Ancho"
              value={formData.ancho}
              onChange={(e) =>
                updateFormData("ancho", parseInt(e.target.value) || 0)
              }
            />
            <span>×</span>
            <input
              type="number"
              placeholder="Alto"
              value={formData.alto}
              onChange={(e) =>
                updateFormData("alto", parseInt(e.target.value) || 0)
              }
            />
          </div>
        </div>

        {/* Texto */}
        <div className="simplified-section">
          <label>Texto del rótulo</label>
          <input
            type="text"
            placeholder="Escribe el texto..."
            value={formData.texto}
            onChange={(e) => updateFormData("texto", e.target.value)}
          />
        </div>

        {/* Material simplificado */}
        <div className="simplified-section">
          <label>Material</label>
          <select
            value={formData.material}
            onChange={(e) => updateFormData("material", e.target.value)}
          >
            <option value="">Seleccionar...</option>
            {MATERIALS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Extras */}
        <div className="simplified-section">
          <label className="simplified-checkbox">
            <input
              type="checkbox"
              checked={formData.iluminacion}
              onChange={(e) => updateFormData("iluminacion", e.target.checked)}
            />
            <span>Iluminación LED {config.showPricePreview && "(+€150)"}</span>
          </label>
          <label className="simplified-checkbox">
            <input
              type="checkbox"
              checked={formData.instalacion}
              onChange={(e) => updateFormData("instalacion", e.target.checked)}
            />
            <span>Instalación {config.showPricePreview && "(+€80)"}</span>
          </label>
        </div>
      </div>

      {/* Footer */}
      <div className="simplified-footer">
        {config.showPricePreview && (
          <div className="simplified-total">
            <span>Total:</span>
            <span>€{calculatePrice()}</span>
          </div>
        )}
        <button className="btn btn-primary btn-large">
          <Save size={20} />
          Crear Pedido
        </button>
      </div>
    </div>
  );

  // ==================== RENDER PRINCIPAL ====================

  const renderEditorMode = () => {
    switch (config.mode) {
      case "single":
        return renderSingleMode();
      case "simplified":
        return renderSimplifiedMode();
      case "wizard":
      default:
        return renderWizardMode();
    }
  };

  const handleOpenNewTab = () => {
    window.open(
      `${window.location.origin}${window.location.pathname}?standalone=true`,
      "_blank",
    );
  };

  const handleCloseStandalone = () => {
    window.close();
  };

  return (
    <div className="editor-page">
      {/* Header para modo standalone */}
      {standalone && (
        <div className="standalone-header">
          <div className="standalone-header-content">
            <button
              className="standalone-close-btn"
              onClick={handleCloseStandalone}
              title="Cerrar"
            >
              <X size={20} />
            </button>
            <h1 className="standalone-title">Editor de Rótulos</h1>
            <span className="standalone-badge">Modo Pantalla Completa</span>
          </div>
        </div>
      )}

      {/* Botón para abrir en nueva pestaña (solo en modo normal) */}
      {!standalone && (
        <div className="editor-new-tab-btn-container">
          <button
            className="btn btn-secondary btn-new-tab"
            onClick={handleOpenNewTab}
            title="Abrir editor en nueva pestaña"
          >
            <ExternalLink size={18} />
            <span>Abrir en nueva pestaña</span>
          </button>
        </div>
      )}

      <div
        className={`editor-container editor-mode-${config.mode} ${standalone ? "standalone" : ""}`}
      >
        {renderEditorMode()}
      </div>
    </div>
  );
}
