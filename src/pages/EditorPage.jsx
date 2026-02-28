import React, { useState } from "react";
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
} from "lucide-react";

const STEPS = [
  {
    id: 1,
    title: "Tipo",
    icon: Palette,
    description: "Selecciona el tipo de rótulo",
  },
  {
    id: 2,
    title: "Dimensiones",
    icon: Ruler,
    description: "Define tamaño y materiales",
  },
  {
    id: 3,
    title: "Diseño",
    icon: Type,
    description: "Añade texto y elementos",
  },
  {
    id: 4,
    title: "Estilo",
    icon: Paintbrush,
    description: "Personaliza colores y acabados",
  },
  {
    id: 5,
    title: "Resumen",
    icon: CheckCircle,
    description: "Revisa y confirma",
  },
];

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

export default function EditorPage() {
  const [currentStep, setCurrentStep] = useState(1);
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
  });

  const [showPreview, setShowPreview] = useState(false);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
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

  const renderStepIndicator = () => (
    <div className="wizard-steps">
      {STEPS.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

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
  );

  const renderStep1 = () => (
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
              <span className="wizard-card-price">{tipo.price}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => (
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

  const renderStep3 = () => (
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

  const renderStep4 = () => (
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
              <span>+€150</span>
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
              <span>+€80</span>
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="wizard-content">
      <h3 className="wizard-title">Resumen de tu pedido</h3>
      <p className="wizard-subtitle">
        Revisa todos los detalles antes de confirmar
      </p>

      <div className="wizard-summary">
        <div className="wizard-summary-item">
          <span className="wizard-summary-label">Tipo</span>
          <span className="wizard-summary-value">
            {ROTULO_TYPES.find((t) => t.id === formData.tipo)?.name ||
              "No seleccionado"}
          </span>
        </div>

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

        <div className="wizard-summary-item">
          <span className="wizard-summary-label">Colores</span>
          <span className="wizard-summary-value">
            Fondo: {COLORS.find((c) => c.id === formData.colorFondo)?.name} /
            Texto: {COLORS.find((c) => c.id === formData.colorTexto)?.name}
          </span>
        </div>

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

        <div className="wizard-summary-total">
          <span>Total estimado</span>
          <span className="wizard-summary-price">€{calculatePrice()}</span>
        </div>
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

  return (
    <div className="editor-page">
      <div className="editor-container">
        {renderStepIndicator()}

        <div className="wizard-body">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </div>

        <div className="wizard-footer">
          <button
            className="btn"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft size={20} />
            Anterior
          </button>

          <div className="wizard-progress">
            Paso {currentStep} de {STEPS.length}
          </div>

          {currentStep === STEPS.length ? (
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
        </div>
      </div>
    </div>
  );
}
