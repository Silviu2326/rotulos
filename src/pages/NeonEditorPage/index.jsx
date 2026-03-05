import React from "react";
import { ChevronUp, ChevronDown, Sparkles, ShoppingCart } from "lucide-react";
import { useNeonEditor } from "./hooks/useNeonEditor";
import { Paso1Producto } from "./components/Paso1Producto";
import { Paso2Negocio } from "./components/Paso2Negocio";
import { Paso3Estilo } from "./components/Paso3Estilo";
import { Paso4Descripcion } from "./components/Paso4Descripcion";
import { FloatingThemeMenu } from "./components/FloatingThemeMenu";
import { TABS_PREVIEW } from "./data/constants";
import "../../styles/rotularte.css";
import "../../styles/neoneditor.css";
import "./styles/sidebar.css";

// Importar subcomponentes de Tabs
import { TabDesign } from "./components/TabsPreview/TabDesign";
import { TabMockup } from "./components/TabsPreview/TabMockup";
import { TabAR } from "./components/TabsPreview/TabAR";
import { TabReadability } from "./components/TabsPreview/TabReadability";

export default function NeonEditorPage() {
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
    canvasRef,
    navigate,
    theme, setTheme,
    neonColor, setNeonColor,
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
          id: c.nombre.toLowerCase().replace(/\s+/g, '-'), 
          nombre: c.nombre, 
          hex: c.hex 
        })),
        tipografia: hook.tipografia?.id,
        fachada: hook.fachada === 'personalizada' ? 'blanca' : hook.fachada,
        tipoNegocio: tipoNegocioDetectado,
        // Incluir texto adicional si existe
        ...(hook.textoAdicional?.trim() && {
          textoAdicional: hook.textoAdicional.trim()
        }),
        // Incluir logo si existe
        ...(hook.logo && {
          logo: hook.logo,
          modoLogo: hook.modoIntegracionLogo || 'ia' // 'ia' o 'exacto'
        }),
      };
      
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
      
      if (data.success) {
        if (data.rotulo?.base64) {
          hook.setRotuloAislado(`data:image/png;base64,${data.rotulo.base64}`);
          setProgresoGeneracion(33);
        }
        
        if (data.mockups?.length > 0) {
          const mockupsFormateados = data.mockups
            .filter(m => m.success)
            .map(m => ({
              tipo: m.tipo,
              imagen: `data:image/png;base64,${m.base64}`,
              tamanoKB: m.tamanoKB
            }));
          hook.setMockups(mockupsFormateados);
          setProgresoGeneracion(100);
        }
        
        setShowPreview(true);
        setImagenActiva('rotulo');
      }
    } catch (error) {
      setErrorGeneracion(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderPasoActual = () => {
    switch (pasoActual) {
      case 1:
        return (
          <Paso1Producto
            categoria={categoria}
            setCategoria={setCategoria}
            errores={errores}
          />
        );
      case 2:
        return (
          <Paso2Negocio
            nombreNegocio={hook.nombreNegocio}
            setNombreNegocio={hook.setNombreNegocio}
            tipografia={hook.tipografia}
            setTipografia={hook.setTipografia}
            coloresDiseño={coloresDiseño}
            agregarColor={hook.agregarColor}
            eliminarColor={hook.eliminarColor}
            orientacion={hook.orientacion}
            setOrientacion={hook.setOrientacion}
            textoAdicional={hook.textoAdicional}
            setTextoAdicional={hook.setTextoAdicional}
            logo={hook.logo}
            setLogo={hook.setLogo}
            modoIntegracionLogo={hook.modoIntegracionLogo}
            setModoIntegracionLogo={hook.setModoIntegracionLogo}
            errores={errores}
            mostrarSelectorOrientacion={hook.mostrarSelectorOrientacion}
            colorPickerTab={hook.colorPickerTab}
            setColorPickerTab={hook.setColorPickerTab}
            hexInput={hook.hexInput}
            setHexInput={hook.setHexInput}
          />
        );
      case 3:
        return (
          <Paso3Estilo
            categoria={categoria}
            estiloVisual={hook.estiloVisual}
            setEstiloVisual={hook.setEstiloVisual}
            tipoLetraCorporea={tipoLetraCorporea}
            setTipoLetraCorporea={hook.setTipoLetraCorporea}
            espesor={hook.espesor}
            setEspesor={hook.setEspesor}
            colorLuzLed={colorLuzLed}
            setColorLuzLed={hook.setColorLuzLed}
            materialLaser={hook.materialLaser}
            setMaterialLaser={hook.setMaterialLaser}
            acabadoSuperficial={hook.acabadoSuperficial}
            setAcabadoSuperficial={hook.setAcabadoSuperficial}
            tipoNegocioLona={hook.tipoNegocioLona}
            setTipoNegocioLona={hook.setTipoNegocioLona}
            estiloLona={hook.estiloLona}
            setEstiloLona={hook.setEstiloLona}
            fachada={hook.fachada}
            setFachada={hook.setFachada}
            fachadaPersonalizada={hook.fachadaPersonalizada}
            setFachadaPersonalizada={hook.setFachadaPersonalizada}
            errores={errores}
            mostrarSelectorCorporea={hook.mostrarSelectorCorporea}
            mostrarSelectorLuzLed={hook.mostrarSelectorLuzLed}
            mostrarSelectorMaterialLaser={hook.mostrarSelectorMaterialLaser}
            mostrarConfiguracionLona={hook.mostrarConfiguracionLona}
            getEspesoresDisponibles={hook.getEspesoresDisponibles}
          />
        );
      case 4:
        return (
          <Paso4Descripcion
            categoria={categoria}
            tipoLetraCorporea={tipoLetraCorporea}
            colorLuzLed={colorLuzLed}
            descripcionDiseño={hook.descripcionDiseño}
            setDescripcionDiseño={hook.setDescripcionDiseño}
            descripcionMejorada={hook.descripcionMejorada}
            setDescripcionMejorada={hook.setDescripcionMejorada}
            tamanoAncho={hook.tamanoAncho}
            setTamanoAncho={hook.setTamanoAncho}
            tamanoAlto={hook.tamanoAlto}
            setTamanoAlto={hook.setTamanoAlto}
            nombreNegocio={nombreNegocio}
            tipografia={hook.tipografia}
            coloresDiseño={coloresDiseño}
          />
        );
      default:
        return null;
    }
  };

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
          />
        );
      case "mockup":
        return <TabMockup />;
      case "ar":
        return <TabAR showPreview={showPreview} />;
      case "readability":
        return <TabReadability showPreview={showPreview} />;
      default:
        return null;
    }
  };

  return (
    <div className="neon-editor-page disenador-ia">
      <nav className="nav-editor">
        <a href="#" className="logo-rotularte" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
          ROTULARTE
        </a>
        <ul className="nav-links-rotularte">
          <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }}>Inicio</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/tienda"); }}>Tienda</a></li>
          <li><a href="#" className="active">Diseñador IA</a></li>
          <li>
            <div className="cart-icon" onClick={() => navigate("/tienda")}>
              <ShoppingCart size={24} />
              <span className="cart-count">0</span>
            </div>
          </li>
        </ul>
      </nav>

      <div className="disenador-contenido">
        <aside className="disenador-sidebar">
          <div className="sidebar-header">
            <h1>Diseñador IA</h1>
            <p>Crea tu rótulo profesional</p>
          </div>

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

          <div className="sidebar-contenido" ref={sidebarContentRef}>
            {renderPasoActual()}
          </div>

          <div className="sidebar-footer">
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
      </div>

      {/* Botón flotante de temas */}
      <FloatingThemeMenu 
        theme={theme}
        setTheme={setTheme}
        neonColor={neonColor}
        setNeonColor={setNeonColor}
      />
    </div>
  );
}
