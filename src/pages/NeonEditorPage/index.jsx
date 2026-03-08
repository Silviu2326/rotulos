import React from "react";
import { ChevronUp, ChevronDown, Sparkles, ShoppingCart, Search, User, Play, Wand2, ImageOff, ZoomIn, Palette, Eye, Smartphone, Check } from "lucide-react";
import { useNeonEditor } from "./hooks/useNeonEditor";
import { Paso1Producto } from "./components/Paso1Producto";
import { Paso2Negocio } from "./components/Paso2Negocio";
import { Paso3Estilo } from "./components/Paso3Estilo";
import { Paso4Descripcion } from "./components/Paso4Descripcion";
import { FloatingThemeMenu } from "./components/FloatingThemeMenu";
import { GeneradorLonaHibrida } from "./components/GeneradorLonaHibrida";
import { TABS_PREVIEW } from "./data/constants";
import "../../styles/rotularte.css";
import "../../styles/neoneditor.css";
import "./styles/sidebar.css";

// Importar subcomponentes de Tabs
import { TabDesign } from "./components/TabsPreview/TabDesign";
import { TabMockup } from "./components/TabsPreview/TabMockup";
import { TabAR } from "./components/TabsPreview/TabAR";
import { TabReadability } from "./components/TabsPreview/TabReadability";

function NeonEditorPage() {
  const hook = useNeonEditor();
  const sidebarContentRef = React.useRef(null);

  const {
    pasoActual, setPasoActual,
    categoria, setCategoria,
    errores, setErrores,
    isGenerating, setIsGenerating,
    showPreview, setShowPreview,
    tabActivo, setTabActivo,
    nombreNegocio,
    coloresDiseño,
    tipoLetraCorporea,
    colorLuzLed,
    rotuloAislado,
    mockups,
    imagenActiva, setImagenActiva,
    progresoGeneracion, setProgresoGeneracion,
    errorGeneracion, setErrorGeneracion,
    setsGenerados, setSetActivo,
    canvasRef,
    navigate,
    theme, setTheme,
    neonColor, setNeonColor,
    modoVisualizacion, setModoVisualizacion,
  } = hook;

  // Función para cambiar paso con scroll al inicio
  const cambiarPaso = (nuevoPaso) => {
    setPasoActual(nuevoPaso);
    // Scroll al inicio del sidebar con animación suave
    if (sidebarContentRef.current) {
      sidebarContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Función de testeo - Rellena el formulario automáticamente
  const rellenarTest = () => {
    // Paso 1: Categoría
    setCategoria('letras-neon');
    
    // Paso 2: Datos del negocio
    hook.setNombreNegocio('Café Roma');
    hook.setTipografia({
      id: 'bebas',
      nombre: 'Bebas Neue',
      familia: '"Bebas Neue", sans-serif',
      sample: 'Aa'
    });
    // Usar setColoresDiseño directamente si está disponible, sino agregar uno por uno
    if (hook.setColoresDiseño) {
      hook.setColoresDiseño([
        { nombre: 'Dorado', hex: '#FFD700' },
        { nombre: 'Negro', hex: '#000000' }
      ]);
    } else {
      hook.agregarColor({ nombre: 'Dorado', hex: '#FFD700' });
      setTimeout(() => hook.agregarColor({ nombre: 'Negro', hex: '#000000' }), 50);
    }
    hook.setOrientacion('horizontal');
    hook.setTextoAdicional('Desde 1990 · Tel: 666 777 888');
    
    // Paso 3: Estilo
    hook.setEstiloVisual('clasico');
    hook.setTipoLetraCorporea('pvc');
    hook.setColorLuzLed('blanco-calido');
    hook.setFachada('ladrillo');
    
    // Paso 4: Descripción
    hook.setDescripcionDiseño('Letras elegantes con efecto vintage, estilo café clásico italiano');
    hook.setTamanoAncho(120);
    hook.setTamanoAlto(40);
    
    // Limpiar errores
    setErrores({});
    
    // Mostrar toast/alert simple
    console.log('✅ Formulario rellenado con datos de test');
  };

  const generarDiseno = async () => {
    if (!categoria || !nombreNegocio.trim() || coloresDiseño.length === 0) {
      const nuevosErrores = {};
      if (!categoria) nuevosErrores.categoria = "Selecciona una categoría";
      if (!nombreNegocio.trim()) nuevosErrores.nombreNegocio = "El nombre es obligatorio";
      if (coloresDiseño.length === 0) nuevosErrores.colores = "Selecciona al menos un color";
      if (categoria === "letras-corporeas" && !tipoLetraCorporea) {
        nuevosErrores.tipoLetraCorporea = "Selecciona un tipo";
      }
      setErrores(nuevosErrores);
      return;
    }
    
    // Si es lona y sistema híbrido está activo, abrir generador especial
    if (categoria === 'lonas-pancartas' && hook.usarSistemaHibridoLona) {
      hook.setMostrarGeneradorLona(true);
      return;
    }
    
    // Generar directamente sin modal de lead
    await iniciarGeneracion();
  };

  const iniciarGeneracion = async () => {
    setIsGenerating(true);
    setErrorGeneracion(null);
    setProgresoGeneracion(0);
    
    try {
      let tipoNegocioDetectado = 'comercio';
      const nombreLower = nombreNegocio.toLowerCase();
      
      if (nombreLower.includes('bar') || nombreLower.includes('pub')) tipoNegocioDetectado = 'bar';
      else if (nombreLower.includes('cafe') || nombreLower.includes('coffee')) tipoNegocioDetectado = 'cafe';
      else if (nombreLower.includes('restaurant')) tipoNegocioDetectado = 'restaurante';
      else if (nombreLower.includes('spa')) tipoNegocioDetectado = 'spa';
      else if (nombreLower.includes('hotel')) tipoNegocioDetectado = 'hotel';
      
      const datosGeneracion = {
        categoria,
        nombreNegocio,
        estiloVisual: hook.estiloVisual || 'moderno',
        colores: coloresDiseño.map(c => ({ 
          id: c.nombre?.toLowerCase().replace(/\s+/g, '-') || c.hex.replace('#', ''), 
          nombre: c.nombre || c.hex, 
          hex: c.hex 
        })),
        tipografia: hook.tipografia?.id,
        fachada: hook.fachada,
        tipoNegocio: tipoNegocioDetectado,
        
        // Campos específicos por categoría
        // Letras corpóreas
        corporeaTipo: hook.tipoLetraCorporea,
        corporeaRelieve: hook.espesor,
        ledColor: hook.colorLuzLed,
        sistemaIluminacion: hook.tipoLetraCorporea?.includes('sin-luz') ? 'ninguna' : 
                           hook.tipoLetraCorporea?.includes('retroiluminada') ? 'trasera' : 'frontal',
        
        // Corte láser
        laserMaterial: hook.materialLaser,
        
        // Lonas
        lonaBusinessType: hook.tipoNegocioLona,
        lonaStyle: hook.estiloLona,
        
        // Descripción y contexto
        descripcion: hook.descripcionDiseño?.trim() ? {
          original: hook.descripcionDiseño.trim(),
          mejorada: hook.descripcionMejorada
        } : undefined,
        
        // Dimensiones
        dimensiones: hook.tamanoAncho || hook.tamanoAlto ? {
          ancho: hook.tamanoAncho,
          alto: hook.tamanoAlto
        } : undefined,
        
        // Incluir texto adicional si existe
        textoAdicional: hook.textoAdicional?.trim() || undefined,
        
        // Incluir logo si existe
        logo: hook.logo || undefined,
        modoLogo: hook.logo ? (hook.modoIntegracionLogo || 'exacto') : undefined,
        
        // Incluir fachada personalizada si existe
        fachadaPersonalizada: hook.fachada === 'personalizada' ? hook.fachadaPersonalizada : undefined,
      };
      
      // Limpiar undefined values
      Object.keys(datosGeneracion).forEach(key => {
        if (datosGeneracion[key] === undefined) {
          delete datosGeneracion[key];
        }
      });
      
      console.log('Enviando datos:', datosGeneracion);
      
      const response = await fetch('https://upgraded-funicular-production.up.railway.app/api/v1/mockups/generar-completo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosGeneracion),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.sets?.length > 0) {
        // Tomar el primer set como principal
        const setPrincipal = data.sets[0];
        const setSecundario = data.sets[1];
        
        // Guardar rótulo principal
        if (setPrincipal.rotulo?.base64) {
          hook.setRotuloAislado(`data:image/png;base64,${setPrincipal.rotulo.base64}`);
        }
        
        // Combinar mockups de ambos sets
        const todosLosMockups = [];
        
        data.sets.forEach((set, index) => {
          if (set.mockup?.success && set.mockup.base64) {
            todosLosMockups.push({
              tipo: `exterior-${index + 1}`,
              setId: index + 1,
              imagen: `data:image/png;base64,${set.mockup.base64}`,
              tamanoKB: set.mockup.tamanoKB
            });
          }
        });
        
        hook.setMockups(todosLosMockups);
        setProgresoGeneracion(100);
        
        // Guardar sets completos para navegación entre variantes
        hook.setSetsGenerados(data.sets.map(s => ({
          rotulo: `data:image/png;base64,${s.rotulo.base64}`,
          mockup: s.mockup.success ? `data:image/png;base64,${s.mockup.base64}` : null
        })));
        hook.setSetActivo(0);
        
        setShowPreview(true);
        setImagenActiva('rotulo');
      }
    } catch (error) {
      setErrorGeneracion(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Props para cada paso
  const paso1Props = {
    categoria,
    setCategoria,
    errores,
  };

  const paso2Props = {
    nombreNegocio: hook.nombreNegocio,
    setNombreNegocio: hook.setNombreNegocio,
    tipografia: hook.tipografia,
    setTipografia: hook.setTipografia,
    coloresDiseño,
    agregarColor: hook.agregarColor,
    eliminarColor: hook.eliminarColor,
    orientacion: hook.orientacion,
    setOrientacion: hook.setOrientacion,
    textoAdicional: hook.textoAdicional,
    setTextoAdicional: hook.setTextoAdicional,
    logo: hook.logo,
    setLogo: hook.setLogo,
    modoIntegracionLogo: hook.modoIntegracionLogo,
    setModoIntegracionLogo: hook.setModoIntegracionLogo,
    errores,
    mostrarSelectorOrientacion: hook.mostrarSelectorOrientacion,
    colorPickerTab: hook.colorPickerTab,
    setColorPickerTab: hook.setColorPickerTab,
    hexInput: hook.hexInput,
    setHexInput: hook.setHexInput,
  };

  const paso3Props = {
    categoria,
    estiloVisual: hook.estiloVisual,
    setEstiloVisual: hook.setEstiloVisual,
    tipoLetraCorporea,
    setTipoLetraCorporea: hook.setTipoLetraCorporea,
    espesor: hook.espesor,
    setEspesor: hook.setEspesor,
    colorLuzLed,
    setColorLuzLed: hook.setColorLuzLed,
    materialLaser: hook.materialLaser,
    setMaterialLaser: hook.setMaterialLaser,
    acabadoSuperficial: hook.acabadoSuperficial,
    setAcabadoSuperficial: hook.setAcabadoSuperficial,
    tipoNegocioLona: hook.tipoNegocioLona,
    setTipoNegocioLona: hook.setTipoNegocioLona,
    estiloLona: hook.estiloLona,
    setEstiloLona: hook.setEstiloLona,
    fachada: hook.fachada,
    setFachada: hook.setFachada,
    fachadaPersonalizada: hook.fachadaPersonalizada,
    setFachadaPersonalizada: hook.setFachadaPersonalizada,
    iluminacionHDRI: hook.iluminacionHDRI,
    setIluminacionHDRI: hook.setIluminacionHDRI,
    postProcessing: hook.postProcessing,
    togglePostProcessing: hook.togglePostProcessing,
    variacionesColor: hook.variacionesColor,
    setVariacionesColor: hook.setVariacionesColor,
    isUpscaling: hook.isUpscaling,
    generarVariacionesColor: hook.generarVariacionesColor,
    mejorarResolucion: hook.mejorarResolucion,
    errores,
    mostrarSelectorCorporea: hook.mostrarSelectorCorporea,
    mostrarSelectorLuzLed: hook.mostrarSelectorLuzLed,
    mostrarSelectorMaterialLaser: hook.mostrarSelectorMaterialLaser,
    mostrarSelectorAcabado: hook.mostrarSelectorAcabado,
    mostrarConfiguracionLona: hook.mostrarConfiguracionLona,
    getEspesoresDisponibles: hook.getEspesoresDisponibles,
    // Sistema híbrido de lonas
    usarSistemaHibridoLona: hook.usarSistemaHibridoLona,
    setUsarSistemaHibridoLona: hook.setUsarSistemaHibridoLona,
    onAbrirGeneradorLona: () => hook.setMostrarGeneradorLona(true),
  };

  const paso4Props = {
    categoria,
    tipoLetraCorporea,
    colorLuzLed,
    descripcionDiseño: hook.descripcionDiseño,
    setDescripcionDiseño: hook.setDescripcionDiseño,
    descripcionMejorada: hook.descripcionMejorada,
    setDescripcionMejorada: hook.setDescripcionMejorada,
    tamanoAncho: hook.tamanoAncho,
    setTamanoAncho: hook.setTamanoAncho,
    tamanoAlto: hook.tamanoAlto,
    setTamanoAlto: hook.setTamanoAlto,
    nombreNegocio,
    tipografia: hook.tipografia,
    coloresDiseño,
  };

  const renderPasoActual = () => {
    switch (pasoActual) {
      case 1:
        return <Paso1Producto {...paso1Props} />;
      case 2:
        return <Paso2Negocio {...paso2Props} />;
      case 3:
        return <Paso3Estilo {...paso3Props} />;
      case 4:
        return <Paso4Descripcion {...paso4Props} />;
      default:
        return null;
    }
  };

  const renderFormularioCompleto = () => (
    <div className="formulario-completo" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="paso-seccion">
        <h3 style={{ fontSize: '0.85rem', color: 'var(--color-neon)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>1. Producto</h3>
        <Paso1Producto {...paso1Props} />
      </div>
      <div className="paso-seccion">
        <h3 style={{ fontSize: '0.85rem', color: 'var(--color-neon)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>2. Negocio</h3>
        <Paso2Negocio {...paso2Props} />
      </div>
      <div className="paso-seccion">
        <h3 style={{ fontSize: '0.85rem', color: 'var(--color-neon)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>3. Estilo</h3>
        <Paso3Estilo {...paso3Props} />
      </div>
      <div className="paso-seccion">
        <h3 style={{ fontSize: '0.85rem', color: 'var(--color-neon)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>4. Descripción</h3>
        <Paso4Descripcion {...paso4Props} />
      </div>
    </div>
  );

  const renderPreviewContent = () => {
    switch (tabActivo) {
      case "design":
        return (
          <TabDesign
            showPreview={showPreview}
            isGenerating={isGenerating}
            progresoGeneracion={progresoGeneracion}
            errorGeneracion={errorGeneracion}
            setErrorGeneracion={setErrorGeneracion}
            rotuloAislado={rotuloAislado}
            mockups={mockups}
            imagenActiva={imagenActiva}
            setImagenActiva={setImagenActiva}
            nombreNegocio={nombreNegocio}
            canvasRef={canvasRef}
            hook={hook}
            setsGenerados={setsGenerados}
            setSetActivo={setSetActivo}
          />
        );
      case "mockup":
        return <TabMockup 
          showPreview={showPreview}
          isGenerating={isGenerating}
          progresoGeneracion={progresoGeneracion}
          errorGeneracion={errorGeneracion}
          setErrorGeneracion={setErrorGeneracion}
          setsGenerados={setsGenerados}
          mockups={mockups}
          nombreNegocio={nombreNegocio}
          categoria={categoria}
          corporeaType={hook.tipoLetraCorporea}
          relief={hook.espesor}
          colorLuzLed={hook.colorLuzLed}
        />;
      case "ar":
        return <TabAR showPreview={showPreview} />;
      case "readability":
        return <TabReadability showPreview={showPreview} />;
      default:
        return null;
    }
  };

  return (
    <div className="neon-editor-page disenador-ia" data-theme={theme}>
      {/* Header del Editor - Estilo tema con dos niveles */}
      <header className="editor-header">
        {/* Barra superior - Info y acciones */}
        <div className="editor-header-top">
          <div className="editor-header-container">
            {/* Logo RotulemOS */}
            <a href="#" className="editor-logo" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
              <span className="editor-logo-text">Rótulos</span>
            </a>
            
            {/* Info de contacto */}
            <div className="editor-header-info">
              <span>Lunes a Viernes: <strong>8:30 - 20:00h</strong></span>
              <span>Tel: <strong>960 624 225</strong></span>
            </div>
            
            {/* Búsqueda */}
            <div className="editor-header-search">
              <Search size={16} />
              <input type="text" placeholder="Busca rótulos, vinilos, neón..." />
            </div>
            
            {/* Iconos de acción */}
            <div className="editor-header-actions">
              <button className="editor-icon-btn" onClick={() => navigate("/cuenta")} title="Mi cuenta">
                <User size={20} />
              </button>
              <button className="editor-icon-btn editor-cart-btn" onClick={() => navigate("/tienda")} title="Carrito">
                <ShoppingCart size={20} />
                <span className="editor-cart-badge">0</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Barra inferior - Branding y navegación */}
        <div className="editor-header-bottom">
          <div className="editor-header-container">
            {/* Branding del diseñador */}
            <div className="editor-brand">
              <h1>DISEÑADOR IA</h1>
              <span className="editor-ultra-badge">ULTRA</span>
            </div>
            
            {/* Botones de acción */}
            <div className="editor-header-buttons">
              <button className="editor-btn-tutorial" onClick={() => window.open('https://www.youtube.com', '_blank')}>
                <Play size={14} fill="currentColor" />
                TUTORIAL
              </button>
              <button className="editor-btn-tienda" onClick={() => navigate("/tienda")}>
                <ShoppingCart size={16} />
                Ir a la Tienda
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="disenador-contenido">
        <aside className="disenador-sidebar">
         

          {/* Pasos indicador - solo en modo wizard */}
          {modoVisualizacion === 'wizard' && (
            <div className="pasos-indicador">
              {[1, 2, 3, 4].map((paso, index) => (
                <React.Fragment key={paso}>
                  <button
                    className={`paso-indicador ${pasoActual === paso ? "activo" : ""} ${paso < pasoActual ? "completado" : ""}`}
                    onClick={() => cambiarPaso(paso)}
                  >
                    <span className="paso-numero">{paso}</span>
                    <span className="paso-nombre">
                      {paso === 1 ? "Prod." : paso === 2 ? "Neg." : paso === 3 ? "Est." : "Desc."}
                    </span>
                  </button>
                  {index < 3 && (
                    <div className={`paso-connector ${paso < pasoActual ? "completed" : ""}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="sidebar-contenido" ref={sidebarContentRef}>
            {modoVisualizacion === 'wizard' ? renderPasoActual() : renderFormularioCompleto()}
          </div>

          <div className="sidebar-footer">
            {/* Navegación de pasos - solo en modo wizard */}
            {modoVisualizacion === 'wizard' && (
              <div className="navegacion-pasos">
                {pasoActual > 1 && (
                  <button className="btn-nav btn-anterior" onClick={() => cambiarPaso(pasoActual - 1)}>
                    <ChevronUp size={20} /> Anterior
                  </button>
                )}
                {pasoActual < 4 && (
                  <button className="btn-nav btn-siguiente" onClick={() => cambiarPaso(pasoActual + 1)}>
                    Siguiente <ChevronDown size={20} />
                  </button>
                )}
              </div>
            )}

            <button className="btn-generar" onClick={generarDiseno} disabled={isGenerating}>
              {isGenerating ? (
                <><div className="spinner" /> Generando...</>
              ) : (
                <><Sparkles size={20} /> Generar Diseño</>
              )}
            </button>
            
            {/* Botón de testeo */}
            <button 
              className="btn-test" 
              onClick={rellenarTest}
              disabled={isGenerating}
              title="Rellenar formulario con datos de prueba"
            >
              <span>🧪</span> Test
            </button>
          </div>
        </aside>

        <section className="panel-preview">
          <div className="tabs">
            {TABS_PREVIEW.map((tab) => {
              const Icono = tab.icono;
              return (
                <button
                  key={tab.id}
                  className={`tab ${tabActivo === tab.id ? "active" : ""}`}
                  onClick={() => setTabActivo(tab.id)}
                >
                  <Icono size={18} />
                  {tab.nombre}
                  {tab.badge && <span className="badge">{tab.badge}</span>}
                </button>
              );
            })}
          </div>
          
          <div className="preview-content">
            {renderPreviewContent()}
          </div>
        </section>
        
        {/* Panel de Herramientas IA */}
        <aside className="tools-panel">
          <div className="tools-header">
            <Wand2 size={20} />
            <h3>Herramientas IA</h3>
          </div>
          
          <div className="tools-list">
            {/* Quitar Fondo */}
            <div className="tool-card">
              <div className="tool-header">
                <div className="tool-icon-wrapper">
                  <ImageOff size={18} />
                </div>
                <div className="tool-info">
                  <h4>Quitar Fondo</h4>
                  <p>Remove.bg - Alta precisión</p>
                </div>
                <span className="tool-badge ready">Listo</span>
              </div>
              <button className="tool-btn">Aplicar</button>
            </div>
            
            {/* Mejorar Calidad */}
            <div className="tool-card">
              <div className="tool-header">
                <div className="tool-icon-wrapper">
                  <ZoomIn size={18} />
                </div>
                <div className="tool-info">
                  <h4>Mejorar Calidad 4x</h4>
                  <p>Real-ESRGAN - HD profesional</p>
                </div>
                <span className="tool-badge ready">Listo</span>
              </div>
              <button className="tool-btn">Aplicar</button>
            </div>
            
            {/* Variaciones de Color */}
            <div className="tool-card">
              <div className="tool-header">
                <div className="tool-icon-wrapper">
                  <Palette size={18} />
                </div>
                <div className="tool-info">
                  <h4>Variaciones de Color</h4>
                  <p>Ver en diferentes colores</p>
                </div>
                <span className="tool-badge new">Nuevo</span>
              </div>
              <button className="tool-btn">Generar</button>
            </div>
            
            {/* Análisis Legibilidad */}
            <div className="tool-card">
              <div className="tool-header">
                <div className="tool-icon-wrapper">
                  <Eye size={18} />
                </div>
                <div className="tool-info">
                  <h4>Análisis Legibilidad</h4>
                  <p>¿Se lee bien a distancia?</p>
                </div>
                <span className="tool-badge ready">Listo</span>
              </div>
              <button className="tool-btn">Analizar</button>
            </div>
            
            {/* Realidad Aumentada */}
            <div className="tool-card">
              <div className="tool-header">
                <div className="tool-icon-wrapper">
                  <Smartphone size={18} />
                </div>
                <div className="tool-info">
                  <h4>Realidad Aumentada</h4>
                  <p>Ver en tu local real</p>
                </div>
                <span className="tool-badge new">Nuevo</span>
              </div>
              <button className="tool-btn">Iniciar AR</button>
            </div>
          </div>
        </aside>
      </div>

      {/* Botón flotante de temas */}
      <FloatingThemeMenu 
        theme={theme}
        setTheme={setTheme}
        neonColor={neonColor}
        setNeonColor={setNeonColor}
        modoVisualizacion={modoVisualizacion}
        setModoVisualizacion={setModoVisualizacion}
      />

      {/* Modal: Generador de Lonas Híbrido */}
      {hook.mostrarGeneradorLona && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.9)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <GeneradorLonaHibrida
            datosIniciales={{
              tipoNegocio: hook.tipoNegocioLona,
              estilo: hook.estiloLona,
              colores: hook.coloresDiseño,
              orientacion: hook.orientacion,
              nombreNegocio: hook.nombreNegocio,
              textoAdicional: hook.textoAdicional,
              tipografia: hook.tipografia
            }}
            onCompletar={(resultado) => {
              hook.setLonaHibridaResultado(resultado);
              hook.setRotuloAislado(resultado.imagenBase64);
              hook.setMostrarGeneradorLona(false);
              hook.setShowPreview(true);
            }}
            onCancelar={() => hook.setMostrarGeneradorLona(false)}
          />
        </div>
      )}
    </div>
  );
}

export default NeonEditorPage;
