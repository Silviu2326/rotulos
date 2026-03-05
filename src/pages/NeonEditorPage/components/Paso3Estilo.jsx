import { Upload } from "lucide-react";
import {
  ESTILOS_VISUALES,
  TIPOS_LETRAS_CORPOREAS,
  ESPESORES_POR_TIPO,
  COLORES_LUZ_LED,
  TIPOS_NEGOCIO_LONAS,
  ESTILOS_LONA,
  FACHADAS,
} from "../data/constants";

export const Paso3Estilo = ({
  categoria,
  estiloVisual,
  setEstiloVisual,
  tipoLetraCorporea,
  setTipoLetraCorporea,
  espesor,
  setEspesor,
  colorLuzLed,
  setColorLuzLed,
  tipoNegocioLona,
  setTipoNegocioLona,
  estiloLona,
  setEstiloLona,
  fachada,
  setFachada,
  fachadaPersonalizada,
  setFachadaPersonalizada,
  errores,
  mostrarSelectorCorporea,
  mostrarSelectorLuzLed,
  mostrarConfiguracionLona,
  getEspesoresDisponibles,
}) => {
  const handleSubirFachada = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setFachadaPersonalizada(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="paso-contenido">
      <h2 className="paso-titulo">Paso 3: Estilo y Acabado</h2>
      <p className="paso-descripcion">Define el estilo visual y los materiales</p>

      {/* Estilo Visual */}
      <div className="form-group">
        <label className="form-label">Estilo Visual</label>
        <div className="estilo-grid">
          {ESTILOS_VISUALES.map((estilo) => (
            <div
              key={estilo.id}
              className={`estilo-card ${estiloVisual === estilo.id ? "selected" : ""}`}
              onClick={() => setEstiloVisual(estilo.id)}
            >
              <div className="estilo-icon">{estilo.icono}</div>
              <div className="estilo-nombre">{estilo.nombre}</div>
              <div className="estilo-desc">{estilo.descripcion}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tipo de Letra Corpórea */}
      {mostrarSelectorCorporea() && (
        <div className="form-group">
          <label className="form-label">
            Tipo de Letra *
          </label>
          <div className="grid-categorias">
            {TIPOS_LETRAS_CORPOREAS.map((tipo) => (
              <div
                key={tipo.id}
                className={`categoria-card ${tipoLetraCorporea === tipo.id ? "activa" : ""}`}
                onClick={() => {
                  setTipoLetraCorporea(tipo.id);
                  const espesores = ESPESORES_POR_TIPO[tipo.id];
                  if (espesores?.length > 0) setEspesor(espesores[0].valor);
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>{tipo.icono}</div>
                <h3 className="categoria-nombre">{tipo.nombre}</h3>
                <p className="categoria-desc">{tipo.desc}</p>
              </div>
            ))}
          </div>
          {errores.tipoLetraCorporea && <span className="error-mensaje">{errores.tipoLetraCorporea}</span>}
        </div>
      )}

      {/* Espesor */}
      {mostrarSelectorCorporea() && tipoLetraCorporea && (
        <div className="form-group">
          <label className="form-label">Espesor</label>
          <div className="material-grid">
            {getEspesoresDisponibles().map((esp) => (
              <div
                key={esp.valor}
                className={`material-option ${espesor === esp.valor ? "selected" : ""}`}
                onClick={() => setEspesor(esp.valor)}
              >
                <div className="material-nombre">{esp.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Color de luz LED */}
      {mostrarSelectorLuzLed() && (
        <div className="form-group">
          <label className="form-label">Color de Luz</label>
          <div className="material-grid">
            {COLORES_LUZ_LED.map((color) => (
              <div
                key={color.id}
                className={`material-option ${colorLuzLed === color.id ? "selected" : ""}`}
                onClick={() => setColorLuzLed(color.id)}
                style={{
                  backgroundColor: colorLuzLed === color.id ? 'rgba(255,107,0,0.15)' : undefined
                }}
              >
                <div 
                  className="material-color" 
                  style={{ 
                    backgroundColor: color.hex,
                    boxShadow: colorLuzLed === color.id ? `0 0 15px ${color.hex}` : 'none'
                  }} 
                />
                <div className="material-nombre">{color.nombre}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Configuración de Lona */}
      {mostrarConfiguracionLona() && (
        <>
          <div className="form-group">
            <label className="form-label">Tipo de Negocio</label>
            <div className="estilo-grid">
              {TIPOS_NEGOCIO_LONAS.map((tipo) => {
                const Icono = tipo.icono;
                return (
                  <div
                    key={tipo.id}
                    className={`estilo-card ${tipoNegocioLona === tipo.id ? "selected" : ""}`}
                    onClick={() => setTipoNegocioLona(tipo.id)}
                  >
                    <div className="estilo-icon"><Icono size={24} /></div>
                    <div className="estilo-nombre">{tipo.nombre}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Estilo del Fondo</label>
            <div className="fachada-grid">
              {ESTILOS_LONA.map((estilo) => (
                <div
                  key={estilo.id}
                  className={`fachada-card ${estiloLona === estilo.id ? "selected" : ""}`}
                  onClick={() => setEstiloLona(estilo.id)}
                >
                  <div 
                    className="fachada-preview"
                    style={{ 
                      background: `linear-gradient(135deg, ${estilo.colors[0]}, ${estilo.colors[1]})` 
                    }} 
                  />
                  <div className="fachada-nombre">{estilo.nombre}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Fachada */}
      <div className="form-group">
        <label className="form-label">Fachada para visualización</label>
        <div className="fachada-grid">
          {FACHADAS.map((fach) => {
            const Icono = fach.icono;
            return (
              <div
                key={fach.id}
                className={`fachada-card ${fachada === fach.id ? "selected" : ""}`}
                onClick={() => setFachada(fach.id)}
              >
                <div style={{ 
                  height: 50, 
                  borderRadius: 8, 
                  marginBottom: 8,
                  background: fach.id === 'ladrillo' ? '#8B4513' : 
                             fach.id === 'hormigon' ? '#808080' :
                             fach.id === 'madera' ? '#D2691E' :
                             fach.id === 'metal' ? '#708090' :
                             fach.id === 'vidrio' ? '#87CEEB' :
                             fach.id === 'piedra' ? '#696969' : '#333'
                }} />
                <div className="fachada-nombre">{fach.nombre}</div>
              </div>
            );
          })}
          <label 
            className={`fachada-card ${fachada === "personalizada" ? "selected" : ""}`}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ 
              height: 50, 
              borderRadius: 8, 
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed rgba(255,255,255,0.2)'
            }}>
              <Upload size={20} style={{ color: '#ff6b00' }} />
            </div>
            <div className="fachada-nombre">Subir fachada</div>
            <input type="file" accept="image/*" onChange={handleSubirFachada} hidden />
          </label>
        </div>
        {fachadaPersonalizada && (
          <div style={{ marginTop: 12 }}>
            <img 
              src={fachadaPersonalizada} 
              alt="Fachada" 
              style={{ maxHeight: 100, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} 
            />
          </div>
        )}
      </div>
    </div>
  );
};
