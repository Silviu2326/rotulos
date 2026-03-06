import { useState, lazy, Suspense } from 'react';
import { Box, Eye, Layers, Loader2 } from 'lucide-react';

// Lazy load del componente 3D
const Scene3D = lazy(() => import('../Scene3D'));

export const TabMockup = ({
  showPreview,
  isGenerating,
  progresoGeneracion,
  errorGeneracion,
  setErrorGeneracion,
  setsGenerados,
  mockups,
  nombreNegocio
}) => {
  const [vistaActiva, setVistaActiva] = useState('2d'); // '2d' o '3d'
  
  // Obtener la imagen exterior de la variación 2 (índice 1)
  const getVariacion2Exterior = () => {
    if (setsGenerados && setsGenerados.length >= 2) {
      return setsGenerados[1]?.mockup;
    }
    // Fallback: buscar en mockups
    if (mockups && mockups.length > 0) {
      const mockupV2 = mockups.find(m => m.setId === 2 || m.tipo === 'exterior-2');
      return mockupV2?.imagen;
    }
    return null;
  };

  // Obtener el rótulo aislado de la variación 2
  const getRotuloAislado = () => {
    if (setsGenerados && setsGenerados.length >= 2) {
      return setsGenerados[1]?.rotulo;
    }
    return null;
  };

  const imagenMockup = getVariacion2Exterior();
  const imagenRotulo = getRotuloAislado();

  if (!showPreview) {
    return (
      <div className="tab-content" id="tab-mockup">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '500px',
          color: '#666',
          gap: '16px'
        }}>
          <Box size={64} opacity={0.3} />
          <p>Genera un diseño para ver el mockup en 3D</p>
          <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>
            El editor 3D permite visualizar el relieve y profundidad real del rótulo
          </p>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="tab-content" id="tab-mockup">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '500px',
          gap: '20px'
        }}>
          <Loader2 size={48} className="spin" style={{ 
            animation: 'spin 1s linear infinite',
            color: 'var(--color-neon, #ff6b00)'
          }} />
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '8px' }}>Generando mockup...</h3>
            <p style={{ fontSize: '0.85rem', color: '#888' }}>{progresoGeneracion}% completado</p>
          </div>
          <div style={{
            width: '300px',
            height: '6px',
            background: '#333',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progresoGeneracion}%`,
              height: '100%',
              background: 'var(--color-neon, #ff6b00)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>
    );
  }

  if (errorGeneracion) {
    return (
      <div className="tab-content" id="tab-mockup">
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '500px',
          gap: '16px',
          textAlign: 'center',
          padding: '40px'
        }}>
          <p style={{ color: '#ef4444' }}>❌ {errorGeneracion}</p>
          <button 
            onClick={() => setErrorGeneracion(null)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--color-neon, #ff6b00)',
              color: '#000',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content" id="tab-mockup" style={{ height: '100%' }}>
      {/* Barra de controles */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: 'var(--color-bg-alt, #1a1a1a)',
        borderRadius: '12px',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Selector de vista */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#888', marginRight: '8px' }}>
            Modo de vista:
          </span>
          
          <button
            onClick={() => setVistaActiva('2d')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: vistaActiva === '2d' ? 'var(--color-neon, #ff6b00)' : 'rgba(255,255,255,0.1)',
              color: vistaActiva === '2d' ? '#000' : '#fff',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
          >
            <Eye size={18} />
            Vista 2D
          </button>
          
          <button
            onClick={() => setVistaActiva('3d')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: vistaActiva === '3d' ? 'var(--color-neon, #ff6b00)' : 'rgba(255,255,255,0.1)',
              color: vistaActiva === '3d' ? '#000' : '#fff',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
          >
            <Box size={18} />
            Editor 3D
            <span style={{
              fontSize: '0.65rem',
              background: vistaActiva === '3d' ? 'rgba(0,0,0,0.2)' : 'var(--color-neon)',
              color: vistaActiva === '3d' ? '#000' : '#000',
              padding: '2px 6px',
              borderRadius: '4px',
              marginLeft: '4px'
            }}>
              NUEVO
            </span>
          </button>
        </div>

        {/* Info del modo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.8rem',
          color: '#888'
        }}>
          {vistaActiva === '3d' && (
            <>
              <Layers size={16} />
              <span>Relieve automático desde imagen</span>
            </>
          )}
        </div>
      </div>

      {/* Contenido según vista */}
      <div style={{
        height: 'calc(100% - 100px)',
        minHeight: '500px',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'var(--color-bg-alt)'
      }}>
        {vistaActiva === '2d' ? (
          // Vista 2D - Imagen estática
          <div style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative'
          }}>
            {imagenMockup ? (
              <div style={{ 
                position: 'relative', 
                width: '100%', 
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={imagenMockup}
                  alt={`${nombreNegocio} - Mockup`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: '8px'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  background: 'rgba(0,0,0,0.8)',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  Fachada Exterior - Var. 2
                </div>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                color: '#666'
              }}>
                <Layers size={48} opacity={0.3} />
                <p>La imagen mockup no está disponible</p>
              </div>
            )}
          </div>
        ) : (
          // Vista 3D - Editor completo
          <div style={{
            height: '100%',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            {imagenMockup && imagenRotulo ? (
              <Suspense fallback={
                <div style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '20px',
                  color: '#666'
                }}>
                  <Loader2 size={48} style={{ 
                    animation: 'spin 1s linear infinite',
                    color: 'var(--color-neon)'
                  }} />
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ marginBottom: '8px' }}>Cargando editor 3D...</p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                      Analizando relieve de la imagen
                    </p>
                  </div>
                </div>
              }>
                <Scene3D 
                  fachadaUrl={imagenMockup}
                  rotuloUrl={imagenRotulo}
                  nombreNegocio={nombreNegocio}
                />
              </Suspense>
            ) : (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                color: '#666',
                textAlign: 'center',
                padding: '40px'
              }}>
                <Box size={64} opacity={0.3} />
                <p>Se necesita el mockup y el rótulo para el editor 3D</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                  Genera ambas variaciones primero
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
