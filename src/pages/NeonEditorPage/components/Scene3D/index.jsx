import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { RotuloMesh3D } from './RotuloMesh3D';
import { Editor3DControls } from './Editor3DControls';

/**
 * ============================================================================
 * ESCENA 3D COMPLETA CON EDITOR AVANZADO
 * ============================================================================
 */

// Fachada como plano texturizado
function FachadaPlane({ imageUrl }) {
  const texture = useTexture(imageUrl);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  
  const aspect = texture.image ? texture.image.width / texture.image.height : 16/9;
  const width = 12;
  const height = width / aspect;

  return (
    <mesh position={[0, 0, -0.5]} receiveShadow>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

// Suelo
function Suelo() {
  return (
    <mesh position={[0, -4, 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#333" roughness={0.8} />
    </mesh>
  );
}

// Iluminación dinámica
function IluminacionDinamica({ modo, intensity, angle }) {
  const lightRef = useRef();
  
  useEffect(() => {
    if (lightRef.current) {
      const radians = (angle * Math.PI) / 180;
      lightRef.current.position.x = Math.cos(radians) * 10;
      lightRef.current.position.z = Math.sin(radians) * 10;
    }
  }, [angle]);

  const config = {
    dia: { ambient: 0.5, directional: 1.5, color: '#ffffff' },
    tarde: { ambient: 0.3, directional: 1, color: '#ffaa55' },
    noche: { ambient: 0.1, directional: 0.8, color: '#5577ff' }
  }[modo] || config.dia;

  return (
    <>
      <ambientLight intensity={config.ambient * intensity} />
      <directionalLight
        ref={lightRef}
        position={[5, 10, 5]}
        intensity={config.directional * intensity}
        color={config.color}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#ffaa00" />
      <spotLight
        position={[0, 10, 0]}
        angle={Math.PI / 6}
        penumbra={0.3}
        intensity={0.5}
        castShadow
      />
    </>
  );
}

// Cámara con posición inicial
function CameraSetup() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  return null;
}

// Escena principal
function EscenaEditor({ 
  fachadaUrl, 
  rotuloUrl, 
  nombreNegocio,
  config 
}) {
  const controlsRef = useRef();

  return (
    <>
      <CameraSetup />
      
      <IluminacionDinamica 
        modo={config.lightingMode}
        intensity={config.lightIntensity}
        angle={config.lightAngle}
      />
      
      {/* Fachada */}
      <Suspense fallback={null}>
        <FachadaPlane imageUrl={fachadaUrl} />
      </Suspense>
      
      {/* Rótulo 3D con relieve */}
      <Suspense fallback={null}>
        <RotuloMesh3D
          imageUrl={rotuloUrl}
          position={[config.positionX, config.positionY, config.positionZ]}
          rotation={[
            (config.rotationX * Math.PI) / 180,
            (config.rotationY * Math.PI) / 180,
            0
          ]}
          scale={config.scale}
          reliefDepth={config.reliefDepth}
          reliefSmoothness={config.reliefSmoothness}
          bevelEnabled={config.bevelSize > 0}
          metalness={config.metalness}
          roughness={config.roughness}
          color={config.materialColor}
          emissive={config.lightingMode === 'noche' ? config.materialColor : '#000000'}
          emissiveIntensity={config.emissiveIntensity * (config.lightingMode === 'noche' ? 0.5 : 0)}
        />
      </Suspense>
      
      {/* Suelo para sombras */}
      <Suelo />
      
      {/* Sombras de contacto */}
      <ContactShadows
        position={[0, -4, 0]}
        opacity={0.4}
        scale={20}
        blur={2}
        far={8}
      />
      
      {/* Controles de órbita */}
      <OrbitControls
        ref={controlsRef}
        enablePan
        enableZoom
        enableRotate
        minDistance={3}
        maxDistance={20}
        maxPolarAngle={Math.PI / 1.8}
        target={[0, 0, 0]}
      />
    </>
  );
}

/**
 * Componente principal Scene3D con Editor
 */
export default function Scene3D({ fachadaUrl, rotuloUrl, nombreNegocio }) {
  // Configuración inicial del editor 3D
  const defaultConfig = {
    // Relieve
    reliefDepth: 0.3,
    reliefSmoothness: 0.5,
    bevelSize: 0.02,
    
    // Posición
    positionX: 0,
    positionY: 0,
    positionZ: 0.3,
    rotationX: 0,
    rotationY: 0,
    scale: 1,
    
    // Material
    materialColor: '#FFD700',
    metalness: 0.3,
    roughness: 0.4,
    emissiveIntensity: 0.2,
    
    // Iluminación
    lightingMode: 'dia',
    lightIntensity: 1,
    lightAngle: 45
  };

  const [config, setConfig] = useState(defaultConfig);

  const handleReset = () => {
    setConfig(defaultConfig);
  };

  // Colores de fondo según iluminación
  const backgroundColors = {
    dia: '#87CEEB',
    tarde: '#2d1f3d',
    noche: '#0a0a15'
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: '500px',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      {/* Panel de controles del editor */}
      <Editor3DControls 
        config={config}
        onChange={setConfig}
        onReset={handleReset}
      />

      {/* Canvas 3D */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 10], fov: 45 }}
        style={{
          background: backgroundColors[config.lightingMode],
          width: '100%',
          height: '100%'
        }}
        gl={{ 
          antialias: true,
          alpha: false,
          shadowMap: true
        }}
      >
        <EscenaEditor
          fachadaUrl={fachadaUrl}
          rotuloUrl={rotuloUrl}
          nombreNegocio={nombreNegocio}
          config={config}
        />
      </Canvas>

      {/* Indicador de modo 3D */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.7)',
        padding: '8px 12px',
        borderRadius: '6px',
        color: 'white',
        fontSize: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span style={{ 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          background: '#22c55e',
          animation: 'pulse 2s infinite'
        }} />
        Editor 3D Activo
      </div>
    </div>
  );
}
