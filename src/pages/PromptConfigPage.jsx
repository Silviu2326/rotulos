import React, { useState, useEffect, useCallback } from "react";
import { 
  Save, Plus, Trash2, Copy, Check, Search, RefreshCw, 
  Code, Sparkles, Image, Type, Palette, Building2, Eye,
  Download, Upload, Undo, Redo, ChevronRight, Filter,
  LayoutGrid, List, Settings2, Wand2, Terminal
} from "lucide-react";
import { PROMPTS_CATEGORIA, PROMPTS_NEGOCIO, generarDescripcionMejorada } from "../data/prompts";
import "../styles/promptConfig.css";

const STEPS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid, desc: "Vista general" },
  { id: "categorias", label: "Categorías", icon: Image, desc: "Tipos de producto" },
  { id: "estilos", label: "Estilos Visuales", icon: Palette, desc: "Apariencias" },
  { id: "negocios", label: "Negocios", icon: Building2, desc: "Contextos comerciales" },
  { id: "prompts-ia", label: "Prompts IA", icon: Terminal, desc: "Templates de generación" },
  { id: "preview", label: "Test & Preview", icon: Eye, desc: "Probar prompts" },
];

const DEFAULT_PROMPT_TEMPLATES = {
  rotuloBase: `Professional {categoria} sign for "{nombreNegocio}", 
{estiloDesc}, 
featuring {coloresDesc},
{elementos},
8k resolution, photorealistic, commercial photography, isolated on {fondo}`,
  
  mockupExterior: `Photorealistic exterior mockup of {categoria} sign "{nombreNegocio}" 
mounted on {fachadaDesc} facade,
{estiloDesc},
{contextoNegocio},
evening lighting, street photography aesthetic,
8k, professional architectural photography`,
  
  mejora: `Enhance this signage description with professional details: {descripcionOriginal}.
Add: {categoriaContexto}, {estiloElementos}, technical specifications.`
};

export default function PromptConfigPage() {
  const [activeStep, setActiveStep] = useState("dashboard");
  const [categorias, setCategorias] = useState(() => {
    const saved = localStorage.getItem("prompt-config-categorias");
    return saved ? JSON.parse(saved) : PROMPTS_CATEGORIA;
  });
  const [negocios, setNegocios] = useState(() => {
    const saved = localStorage.getItem("prompt-config-negocios");
    return saved ? JSON.parse(saved) : PROMPTS_NEGOCIO;
  });
  const [templates, setTemplates] = useState(() => {
    const saved = localStorage.getItem("prompt-config-templates");
    return saved ? JSON.parse(saved) : DEFAULT_PROMPT_TEMPLATES;
  });
  
  const [selectedCategoria, setSelectedCategoria] = useState(Object.keys(PROMPTS_CATEGORIA)[0]);
  const [selectedNegocio, setSelectedNegocio] = useState(Object.keys(PROMPTS_NEGOCIO)[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  // Preview state
  const [previewData, setPreviewData] = useState({
    nombreNegocio: "Café Roma",
    categoria: "letras-neon",
    estilo: "moderno",
    colores: ["Dorado", "Negro"],
    fachada: "ladrillo",
    tipoNegocio: "cafe"
  });
  const [previewResult, setPreviewResult] = useState("");

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem("prompt-config-categorias", JSON.stringify(categorias));
    localStorage.setItem("prompt-config-negocios", JSON.stringify(negocios));
    localStorage.setItem("prompt-config-templates", JSON.stringify(templates));
    setHasChanges(true);
  }, [categorias, negocios, templates]);

  const handleSave = useCallback(() => {
    console.log("Guardando configuración...", { categorias, negocios, templates });
    setLastSaved(new Date());
    setHasChanges(false);
    // Aquí iría la llamada al backend
  }, [categorias, negocios, templates]);

  const handleExport = () => {
    const data = { categorias, negocios, templates, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompt-config-${Date.now()}.json`;
    a.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (data.categorias) setCategorias(data.categorias);
          if (data.negocios) setNegocios(data.negocios);
          if (data.templates) setTemplates(data.templates);
          alert("Configuración importada correctamente");
        } catch (err) {
          alert("Error al importar: archivo inválido");
        }
      };
      reader.readAsText(file);
    }
  };

  const generatePreview = useCallback(() => {
    const cat = categorias[previewData.categoria];
    const neg = negocios[previewData.tipoNegocio];
    const template = templates.rotuloBase;
    
    const result = template
      .replace(/{categoria}/g, cat?.contexto || previewData.categoria)
      .replace(/{nombreNegocio}/g, previewData.nombreNegocio)
      .replace(/{estiloDesc}/g, cat?.estilos[previewData.estilo] || "")
      .replace(/{coloresDesc}/g, previewData.colores.join(" and "))
      .replace(/{elementos}/g, cat?.elementos?.slice(0, 2).join(", ") || "")
      .replace(/{fondo}/g, "neutral background");
    
    setPreviewResult(result);
  }, [categorias, templates, previewData]);

  useEffect(() => {
    generatePreview();
  }, [generatePreview]);

  // Update functions
  const updateCategoria = (key, field, value) => {
    setCategorias(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const updateEstilo = (catKey, estiloKey, value) => {
    setCategorias(prev => ({
      ...prev,
      [catKey]: { ...prev[catKey], estilos: { ...prev[catKey].estilos, [estiloKey]: value } }
    }));
  };

  const addEstilo = (catKey) => {
    const nombre = prompt("Nombre del nuevo estilo:");
    if (nombre) {
      const key = nombre.toLowerCase().replace(/\s+/g, "-");
      updateEstilo(catKey, key, `Estilo ${nombre} - descripción...`);
    }
  };

  const removeEstilo = (catKey, estiloKey) => {
    if (confirm(`¿Eliminar estilo "${estiloKey}"?`)) {
      setCategorias(prev => {
        const estilos = { ...prev[catKey].estilos };
        delete estilos[estiloKey];
        return { ...prev, [catKey]: { ...prev[catKey], estilos } };
      });
    }
  };

  const filteredCategorias = Object.keys(categorias).filter(k => 
    k.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categorias[k].contexto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render steps
  const renderDashboard = () => (
    <div className="config-section dashboard">
      <h2>Dashboard de Prompts</h2>
      <p className="section-desc">Resumen y estadísticas del diccionario de prompts</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Image size={24} /></div>
          <div className="stat-value">{Object.keys(categorias).length}</div>
          <div className="stat-label">Categorías</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Palette size={24} /></div>
          <div className="stat-value">
            {Object.values(categorias).reduce((acc, c) => acc + Object.keys(c.estilos).length, 0)}
          </div>
          <div className="stat-label">Estilos totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Building2 size={24} /></div>
          <div className="stat-value">{Object.keys(negocios).length}</div>
          <div className="stat-label">Tipos de negocio</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Sparkles size={24} /></div>
          <div className="stat-value">
            {Object.values(categorias).reduce((acc, c) => acc + (c.mejoras?.length || 0), 0)}
          </div>
          <div className="stat-label">Mejoras</div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Acciones rápidas</h3>
        <div className="action-buttons">
          <button className="action-card" onClick={() => setActiveStep("categorias")}>
            <Plus size={20} />
            <span>Nueva categoría</span>
          </button>
          <button className="action-card" onClick={() => setActiveStep("estilos")}>
            <Palette size={20} />
            <span>Editar estilos</span>
          </button>
          <button className="action-card" onClick={() => setActiveStep("preview")}>
            <Eye size={20} />
            <span>Testear prompts</span>
          </button>
          <label className="action-card">
            <Upload size={20} />
            <span>Importar JSON</span>
            <input type="file" accept=".json" onChange={handleImport} hidden />
          </label>
          <button className="action-card" onClick={handleExport}>
            <Download size={20} />
            <span>Exportar config</span>
          </button>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Últimos cambios</h3>
        <div className="activity-list">
          {hasChanges ? (
            <div className="activity-item pending">
              <div className="activity-dot" />
              <span>Cambios pendientes de guardar</span>
            </div>
          ) : (
            <div className="activity-item saved">
              <div className="activity-dot green" />
              <span>Todo guardado correctamente</span>
              {lastSaved && <small>{lastSaved.toLocaleTimeString()}</small>}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCategorias = () => (
    <div className="config-section">
      <div className="section-header">
        <div>
          <h2>Categorías de Producto</h2>
          <p className="section-desc">Configura contextos, elementos y mejoras para cada tipo de rótulo</p>
        </div>
        <div className="view-toggle">
          <button className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")}>
            <LayoutGrid size={18} />
          </button>
          <button className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")}>
            <List size={18} />
          </button>
        </div>
      </div>

      <div className="search-bar">
        <Search size={18} />
        <input 
          type="text" 
          placeholder="Buscar categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className={`categorias-${viewMode}`}>
        {filteredCategorias.map(key => (
          <div key={key} className={`cat-card ${selectedCategoria === key ? "active" : ""}`}>
            <div className="cat-header" onClick={() => setSelectedCategoria(key)}>
              <h3>{key}</h3>
              <span className="cat-badge">{Object.keys(categorias[key].estilos).length} estilos</span>
            </div>
            
            {selectedCategoria === key && (
              <div className="cat-editor">
                <div className="form-row">
                  <div className="form-group">
                    <label>Contexto del producto</label>
                    <textarea
                      value={categorias[key].contexto}
                      onChange={(e) => updateCategoria(key, "contexto", e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Elementos (array)</label>
                    <div className="tag-input">
                      {categorias[key].elementos.map((elem, idx) => (
                        <span key={idx} className="tag">
                          {elem}
                          <button onClick={() => {
                            const newElems = categorias[key].elementos.filter((_, i) => i !== idx);
                            updateCategoria(key, "elementos", newElems);
                          }}>×</button>
                        </span>
                      ))}
                      <input 
                        type="text" 
                        placeholder="Añadir..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.target.value.trim()) {
                            updateCategoria(key, "elementos", [...categorias[key].elementos, e.target.value.trim()]);
                            e.target.value = "";
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Mejoras automáticas</label>
                  {categorias[key].mejoras?.map((mejora, idx) => (
                    <div key={idx} className="mejora-item">
                      <Sparkles size={14} />
                      <input
                        type="text"
                        value={mejora}
                        onChange={(e) => {
                          const newMejoras = [...categorias[key].mejoras];
                          newMejoras[idx] = e.target.value;
                          updateCategoria(key, "mejoras", newMejoras);
                        }}
                      />
                      <button className="icon-btn danger" onClick={() => {
                        const newMejoras = categorias[key].mejoras.filter((_, i) => i !== idx);
                        updateCategoria(key, "mejoras", newMejoras);
                      }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button className="add-btn small" onClick={() => updateCategoria(key, "mejoras", [...(categorias[key].mejoras || []), "Nueva mejora..."])}>
                    <Plus size={14} /> Añadir mejora
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderEstilos = () => (
    <div className="config-section">
      <h2>Estilos Visuales</h2>
      <p className="section-desc">Define las descripciones visuales para cada estilo aplicable a las categorías</p>
      
      <div className="categoria-tabs">
        {Object.keys(categorias).map(key => (
          <button
            key={key}
            className={`tab-btn ${selectedCategoria === key ? "active" : ""}`}
            onClick={() => setSelectedCategoria(key)}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="estilos-toolbar">
        <button className="btn-primary" onClick={() => addEstilo(selectedCategoria)}>
          <Plus size={16} /> Nuevo estilo
        </button>
      </div>

      <div className="estilos-list">
        {Object.entries(categorias[selectedCategoria]?.estilos || {}).map(([key, value]) => (
          <div key={key} className="estilo-row">
            <div className="estilo-info">
              <span className="estilo-key">{key}</span>
              <button className="icon-btn danger" onClick={() => removeEstilo(selectedCategoria, key)}>
                <Trash2 size={14} />
              </button>
            </div>
            <textarea
              value={value}
              onChange={(e) => updateEstilo(selectedCategoria, key, e.target.value)}
              rows={3}
              placeholder="Descripción visual del estilo..."
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderNegocios = () => (
    <div className="config-section">
      <h2>Tipos de Negocio</h2>
      <p className="section-desc">Configura keywords y elementos visuales específicos para cada sector comercial</p>
      
      <div className="negocios-grid">
        {Object.entries(negocios).map(([key, data]) => (
          <div key={key} className={`negocio-card ${selectedNegocio === key ? "expanded" : ""}`}>
            <div className="negocio-header" onClick={() => setSelectedNegocio(key)}>
              <h3>{key}</h3>
              <ChevronRight size={18} className="expand-icon" />
            </div>
            
            {selectedNegocio === key && (
              <div className="negocio-editor">
                <div className="form-group">
                  <label>Keywords (para contexto IA)</label>
                  <div className="tag-input">
                    {data.keywords?.map((kw, idx) => (
                      <span key={idx} className="tag keyword">
                        {kw}
                        <button onClick={() => {
                          const newKws = data.keywords.filter((_, i) => i !== idx);
                          setNegocios(prev => ({ ...prev, [key]: { ...prev[key], keywords: newKws } }));
                        }}>×</button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      placeholder="Añadir keyword..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                          setNegocios(prev => ({
                            ...prev, 
                            [key]: { ...prev[key], keywords: [...(prev[key].keywords || []), e.target.value.trim()] }
                          }));
                          e.target.value = "";
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Elementos visuales característicos</label>
                  {data.elementos?.map((elem, idx) => (
                    <div key={idx} className="elemento-row">
                      <input
                        type="text"
                        value={elem}
                        onChange={(e) => {
                          const newElems = [...data.elementos];
                          newElems[idx] = e.target.value;
                          setNegocios(prev => ({ ...prev, [key]: { ...prev[key], elementos: newElems } }));
                        }}
                      />
                      <button className="icon-btn danger" onClick={() => {
                        const newElems = data.elementos.filter((_, i) => i !== idx);
                        setNegocios(prev => ({ ...prev, [key]: { ...prev[key], elementos: newElems } }));
                      }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button className="add-btn small" onClick={() => setNegocios(prev => ({
                    ...prev, 
                    [key]: { ...prev[key], elementos: [...(prev[key].elementos || []), "Nuevo elemento"] }
                  }))}>
                    <Plus size={14} /> Añadir elemento
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPromptsIA = () => (
    <div className="config-section">
      <h2>Templates de Prompts IA</h2>
      <p className="section-desc">Edita los templates usados para generar prompts dinámicos</p>
      
      <div className="templates-list">
        {Object.entries(templates).map(([key, value]) => (
          <div key={key} className="template-card">
            <div className="template-header">
              <Code size={18} />
              <h3>{key}</h3>
            </div>
            <textarea
              value={value}
              onChange={(e) => setTemplates(prev => ({ ...prev, [key]: e.target.value }))}
              rows={6}
              className="code-editor"
            />
            <div className="template-vars">
              <span>Variables disponibles:</span>
              <code>{value.match(/{\w+}/g)?.join(", ") || "Ninguna"}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="config-section preview-section">
      <h2>Test & Preview</h2>
      <p className="section-desc">Prueba cómo se generan los prompts con datos de ejemplo</p>
      
      <div className="preview-layout">
        <div className="preview-config">
          <h3>Datos de prueba</h3>
          <div className="form-group">
            <label>Nombre del negocio</label>
            <input 
              type="text" 
              value={previewData.nombreNegocio}
              onChange={(e) => setPreviewData({...previewData, nombreNegocio: e.target.value})}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Categoría</label>
              <select 
                value={previewData.categoria}
                onChange={(e) => setPreviewData({...previewData, categoria: e.target.value})}
              >
                {Object.keys(categorias).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Estilo</label>
              <select 
                value={previewData.estilo}
                onChange={(e) => setPreviewData({...previewData, estilo: e.target.value})}
              >
                {Object.keys(categorias[previewData.categoria]?.estilos || {}).map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="btn-primary" onClick={generatePreview}>
            <RefreshCw size={16} /> Regenerar
          </button>
        </div>

        <div className="preview-result">
          <h3>Prompt generado</h3>
          <div className="prompt-box">
            <pre>{previewResult}</pre>
            <button 
              className="copy-btn"
              onClick={() => {
                navigator.clipboard.writeText(previewResult);
                alert("Copiado!");
              }}
            >
              <Copy size={16} /> Copiar
            </button>
          </div>
          
          <div className="prompt-test">
            <h4>Probar mejora con IA</h4>
            <button 
              className="btn-secondary"
              onClick={() => {
                const mejorada = generarDescripcionMejorada(
                  previewData.nombreNegocio,
                  previewData.categoria,
                  previewData.estilo,
                  previewData.tipoNegocio
                );
                alert(`Descripción mejorada: ${mejorada}`);
              }}
            >
              <Wand2 size={16} /> Generar descripción mejorada
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeStep) {
      case "dashboard": return renderDashboard();
      case "categorias": return renderCategorias();
      case "estilos": return renderEstilos();
      case "negocios": return renderNegocios();
      case "prompts-ia": return renderPromptsIA();
      case "preview": return renderPreview();
      default: return renderDashboard();
    }
  };

  return (
    <div className="prompt-config-page">
      <nav className="nav-editor">
        <a href="/" className="logo-rotularte">ROTULARTE</a>
        <ul className="nav-links-rotularte">
          <li><a href="/">Inicio</a></li>
          <li><a href="/tienda">Tienda</a></li>
          <li><a href="/editor">Diseñador IA</a></li>
          <li><a href="/prompt-config" className="active">Config Prompts</a></li>
        </ul>
      </nav>

      <div className="config-contenido">
        <aside className="config-sidebar">
          <div className="sidebar-header">
            <h1>Diccionario de Prompts</h1>
            <p>Configuración avanzada de IA</p>
          </div>

          <div className="pasos-indicador">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={step.id}>
                  <button
                    className={`paso-indicador ${activeStep === step.id ? "activo" : ""}`}
                    onClick={() => setActiveStep(step.id)}
                  >
                    <span className="paso-numero"><Icon size={18} /></span>
                    <div className="paso-info">
                      <span className="paso-nombre">{step.label}</span>
                      <span className="paso-desc">{step.desc}</span>
                    </div>
                  </button>
                  {index < STEPS.length - 1 && <div className="paso-connector" />}
                </React.Fragment>
              );
            })}
          </div>

          <div className="sidebar-footer">
            <div className={`save-status ${hasChanges ? "pending" : "saved"}`}>
              {hasChanges ? "Cambios sin guardar" : "Todo guardado"}
            </div>
            <button 
              className={`btn-generar ${!hasChanges ? "disabled" : ""}`}
              onClick={handleSave}
              disabled={!hasChanges}
            >
              <Save size={18} /> Guardar cambios
            </button>
          </div>
        </aside>

        <main className="config-main">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
