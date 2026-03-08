/**
 * ============================================================================
 * SCENE3D - Visualizador 3D para Letras Corpóreas (React Three Fiber)
 * ============================================================================
 * 
 * Componente React que renderiza letras corpóreas con extrusión real 3D
 * V30-V31: Sistema completo con HDRI, Post-processing, PBR
 * 
 * Solo para categorías: 'letras-corporeas', 'letras-neon'
 */

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useProgress, Html, ContactShadows } from '@react-three/drei';
import { ExtrudedDesign, Room, Lighting } from './components/ExtrudedShape';
import { PostProcessing, NeonPostProcessing } from './components/PostProcessing';
import './Scene3D.css';

// Componente de carga
const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="scene-3d-loading">
        <div className="scene-3d-spinner"></div>
        <p>Cargando 3D... {Math.round(progress)}%</p>
      </div>
    </Html>
  );
};

// Error Boundary para errores de Three.js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error en Scene3D:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="scene-3d-error">
          <p>⚠️ Error al cargar el visor 3D</p>
          <p className="scene-3d-error-detail">
            {this.state.error?.message || 'Error desconocido'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Props:
 * - imageUrl: URL de la imagen PNG transparente
 * - corporeaType: 'aluminio-sin-luz', 'pvc', 'metacrilato', etc.
 * - relief: Espesor en cm (5, 8, 10, 12, 14)
 * - luzColor: Color de LED para retroiluminadas
 * - wallType: Tipo de pared ('wood-panel', 'white-wall', etc.)
 * - enableHDRI: Activar HDRI environment
 * - enablePostProcessing: Activar post-processing
 * - isNeon: Si es neón (usa bloom más intenso)
 */
export const Scene3D = ({ 
  imageUrl,
  corporeaType = 'aluminio-sin-luz',
  relief = 8,
  luzColor = 'blanco-calido',
  wallType = 'white-wall',
  enableHDRI = true,
  enablePostProcessing = true,
  isNeon = false,
  onLoadingChange
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleCreated = () => {
    setIsLoading(false);
    onLoadingChange?.(false);
  };

  if (!imageUrl) {
    return (
      <div className="scene-3d-container">
        <div className="scene-3d-error">
          <p>No hay imagen para visualizar</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="scene-3d-container">
        {isLoading && (
          <div className="scene-3d-loading-overlay">
            <div className="scene-3d-spinner"></div>
            <p>Analizando contornos V29.8...</p>
          </div>
        )}
        
        <Canvas
          shadows
          camera={{ 
            position: [0, 0, 10], 
            fov: 50,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: false, // Desactivar AA nativo (usamos SMAA en post)
            alpha: true,
            preserveDrawingBuffer: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true
          }}
          onCreated={handleCreated}
          style={{ background: '#0a0a12' }}
        >
          <Suspense fallback={<Loader />}>
            {/* Iluminación profesional Three-Point */}
            <Lighting />
            
            {/* Ambiente HDRI */}
            {enableHDRI && (
              <Environment 
                preset="studio" 
                background={false}
                blur={0.5}
              />
            )}
            
            {/* Habitación con pared y suelo */}
            <Room wallType={wallType} />
            
            {/* Sombras de contacto suaves */}
            <ContactShadows
              position={[0, -4.9, 0]}
              opacity={0.4}
              scale={20}
              blur={2.5}
              far={10}
              resolution={512}
              color="#000000"
            />
            
            {/* Diseño extruido principal */}
            <ExtrudedDesign 
              imageUrl={imageUrl}
              corporeaType={corporeaType}
              relief={relief}
              luzColor={luzColor}
            />
            
            {/* Post-processing */}
            {enablePostProcessing && (
              isNeon ? (
                <NeonPostProcessing />
              ) : (
                <PostProcessing 
                  enableBloom={true}
                  enableSSAO={true}
                  enableSMAA={true}
                  bloomIntensity={1.2}
                  bloomThreshold={0.9}
                />
              )
            )}
            
            {/* Controles de cámara */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={3}
              maxDistance={20}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 1.5}
              target={[0, 0, -2]}
              dampingFactor={0.05}
              enableDamping={true}
            />
          </Suspense>
        </Canvas>
        
        {/* Overlay de información */}
        <div className="scene-3d-info">
          <span className="scene-3d-badge">{relief}cm</span>
          <span className="scene-3d-material">{corporeaType.replace(/-/g, ' ')}</span>
          {enableHDRI && <span className="scene-3d-hdri">HDRI</span>}
          {enablePostProcessing && <span className="scene-3d-pp">PBR</span>}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Scene3D;
