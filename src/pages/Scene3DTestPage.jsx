/**
 * SCENE3D TEST PAGE - Usa el backend para procesar la imagen
 * El servidor devuelve los contornos listos; el frontend solo construye la geometría 3D.
 */

import { useState, useRef, Suspense, useMemo, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Box, Upload, Image as ImageIcon, Loader2, RotateCcw, Bug, ServerCrash } from 'lucide-react';
import * as THREE from 'three';

const API_URL = 'http://localhost:5000/api/v1/scene3d/process';

// ─── Debug overlay: dibuja los contornos devueltos por el backend ─────────────
const DebugOverlay = ({ apiData, show }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !apiData) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { contours, width3D, height3D } = apiData;

    const W = 360, H = Math.round(360 * (height3D / width3D));
    canvas.width = W;
    canvas.height = H;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    const scaleX = W / width3D;
    const scaleY = H / height3D;

    contours.forEach((c, idx) => {
      if (c.points.length < 3) return;
      const hue = (idx * 55) % 360;
      ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
      ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.15)`;
      ctx.lineWidth = 1.5;

      // Los puntos ya están centrados en 0,0 con coordenadas 3D
      // Transformar a espacio canvas
      const toCanvas = p => ({
        cx: (p.x + width3D / 2) * scaleX,
        cy: (-p.y + height3D / 2) * scaleY
      });

      ctx.beginPath();
      const first = toCanvas(c.points[0]);
      ctx.moveTo(first.cx, first.cy);
      for (let i = 1; i < c.points.length; i++) {
        const { cx, cy } = toCanvas(c.points[i]);
        ctx.lineTo(cx, cy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  }, [apiData]);

  if (!show || !apiData) return null;

  return (
    <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 20, background: 'rgba(0,0,0,0.9)', padding: '12px', borderRadius: '8px', maxWidth: '390px' }}>
      <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#00ff00' }}>
        🔍 Contornos del backend
      </p>
      <canvas ref={canvasRef} style={{ width: '100%', border: '1px solid #333', borderRadius: '4px', display: 'block' }} />
      <p style={{ margin: '8px 0 0 0', fontSize: '0.7rem', color: '#888' }}>
        {apiData.totalShapes} formas | {apiData.isNeon ? 'NEÓN' : 'CORPÓREA'} | depth {apiData.depth.toFixed(3)}
      </p>
    </div>
  );
};

// Claridad mínima de color para que sea visible en escena oscura
function ensureVisibleColor(hexColor) {
  const c = new THREE.Color(hexColor);
  const L = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b; // luminancia 0-1
  if (L < 0.25) {
    // Color demasiado oscuro → aclarar a gris metálico medio
    return new THREE.Color(0.55, 0.56, 0.57);
  }
  return c;
}

// ─── Modelo 3D construido a partir de los contornos del backend ───────────────
const Model3D = ({ apiData, isNeon }) => {
  const geometries = useMemo(() => {
    if (!apiData?.contours?.length) return [];

    const { contours, depth } = apiData;
    console.log(`🏗️ Construyendo ${contours.length} geometrías | depth=${depth}`);

    const built = contours.map((contourData, index) => {
      try {
        const { points, holes, color: hexColor, area } = contourData;
        if (points.length < 3) {
          console.warn(`  shape[${index}]: saltado (puntos < 3)`);
          return null;
        }

        // Para formas pequeñas/delgadas usar lineTo en vez de splineThru
        // (splineThru en shapes muy delgados puede crear self-intersections)
        const useSpline = points.length > 20;

        const shape = new THREE.Shape();
        shape.moveTo(points[0].x, points[0].y);
        if (useSpline) {
          shape.splineThru(points.slice(1).map(p => new THREE.Vector2(p.x, p.y)));
        } else {
          points.slice(1).forEach(p => shape.lineTo(p.x, p.y));
        }
        shape.closePath();

        holes.forEach(holePts => {
          if (holePts.length < 3) return;
          const path = new THREE.Path();
          path.moveTo(holePts[0].x, holePts[0].y);
          if (holePts.length > 20) {
            path.splineThru(holePts.slice(1).map(p => new THREE.Vector2(p.x, p.y)));
          } else {
            holePts.slice(1).forEach(p => path.lineTo(p.x, p.y));
          }
          path.closePath();
          shape.holes.push(path);
        });

        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth,
          bevelEnabled: !isNeon,
          bevelThickness: isNeon ? 0 : depth * 0.04,
          bevelSize: isNeon ? 0 : depth * 0.02,
          bevelSegments: 4,
          curveSegments: 32
        });

        const color = ensureVisibleColor(hexColor);
        console.log(`  shape[${index}]: ✅ ${points.length}pts | área=${area} | color=${hexColor}→${color.getHexString()}`);

        return { geometry, color, key: `shape-${index}` };
      } catch (err) {
        console.warn(`  shape[${index}]: ❌ Error:`, err.message);
        return null;
      }
    }).filter(Boolean);

    console.log(`🏗️ Geometrías construidas: ${built.length}/${contours.length}`);
    return built;
  }, [apiData, isNeon]);

  if (!geometries.length) return null;

  return (
    <group position={[0, 0, -2 + 0.02]}>
      {geometries.map(({ geometry, color, key }) => (
        <mesh key={key} geometry={geometry} castShadow receiveShadow>
          <meshStandardMaterial
            color={color}
            roughness={isNeon ? 0.15 : 0.4}
            metalness={isNeon ? 0.1 : 0.6}
            emissive={isNeon ? color.clone().multiplyScalar(0.4) : new THREE.Color(0, 0, 0)}
          />
        </mesh>
      ))}
    </group>
  );
};

const Lighting = ({ isNeon }) => (
  <>
    <ambientLight intensity={isNeon ? 0.2 : 0.5} />
    <directionalLight position={[4, 6, 6]} intensity={isNeon ? 0.6 : 1.2} castShadow />
    <directionalLight position={[-4, 4, 4]} intensity={isNeon ? 0.25 : 0.45} />
  </>
);

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Scene3DTestPage() {
  const [imageUrl, setImageUrl] = useState(null);       // para mostrar preview
  const [imageFile, setImageFile] = useState(null);     // file o blob para enviar
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [relief, setRelief] = useState(5);
  const [selectedType, setSelectedType] = useState('corporea');
  const [showDebug, setShowDebug] = useState(true);
  const fileInputRef = useRef(null);

  const isNeon = selectedType === 'neon';

  const sampleImages = [
    { name: 'Letras Neón', url: '/test-mockups/neon.png', type: 'neon' },
    { name: 'Corpóreas Aluminio', url: '/test-mockups/corporea.png', type: 'corporea' },
    { name: 'PVC Retroiluminada', url: '/test-mockups/pvc.png', type: 'corporea' }
  ];

  // Llama al backend con el archivo/blob actual
  const processWithBackend = useCallback(async (file, type, currentRelief) => {
    if (!file) return;
    setIsProcessing(true);
    setApiError(null);
    setApiData(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('relief', String(currentRelief));
      formData.append('isNeon', String(type === 'neon'));

      const res = await fetch(API_URL, { method: 'POST', body: formData });
      const json = await res.json();

      if (!res.ok || !json.success) throw new Error(json.error || `HTTP ${res.status}`);

      setApiData(json.data);
      console.log(`✅ Backend: ${json.data.totalShapes} formas, depth=${json.data.depth}`);
    } catch (err) {
      console.error('❌ Backend error:', err);
      setApiError(err.message);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Cuando cambia el relief volvemos a procesar
  useEffect(() => {
    if (imageFile && selectedType) {
      processWithBackend(imageFile, selectedType, relief);
    }
  }, [relief]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileUpload = (file) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setImageFile(file);
    setSelectedType('corporea');
    processWithBackend(file, 'corporea', relief);
  };

  const handleSampleSelect = async (sampleUrl, type) => {
    setSelectedType(type);
    setImageUrl(sampleUrl);
    setApiData(null);
    setApiError(null);

    // Fetch de la imagen local como blob para enviar al backend
    try {
      const res = await fetch(sampleUrl);
      const blob = await res.blob();
      const file = new File([blob], 'sample.png', { type: blob.type });
      setImageFile(file);
      processWithBackend(file, type, relief);
    } catch (err) {
      setApiError('No se pudo cargar la imagen de muestra');
    }
  };

  const handleClear = () => {
    setImageUrl(null);
    setImageFile(null);
    setApiData(null);
    setApiError(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a12', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Box size={32} color="#00d4ff" />
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Scene3D Test</h1>
          <span style={{ fontSize: '0.75rem', color: '#00d4ff', border: '1px solid #00d4ff', borderRadius: '4px', padding: '2px 8px' }}>
            backend
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowDebug(!showDebug)}
            style={{ color: showDebug ? '#00ff00' : '#888', background: 'transparent', border: `1px solid ${showDebug ? '#00ff00' : '#444'}`, borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Bug size={16} /> Debug
          </button>
          <a href="/" style={{ color: '#00d4ff', textDecoration: 'none', padding: '8px 16px', border: '1px solid #00d4ff', borderRadius: '6px' }}>Volver</a>
        </div>
      </header>

      <div style={{ display: 'flex', height: 'calc(100vh - 80px)' }}>
        {/* Sidebar */}
        <aside style={{ width: '350px', padding: '24px', borderRight: '1px solid rgba(255,255,255,0.1)', overflowY: 'auto' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>🎨 Configuración</h2>

          {/* Imagen */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '12px', color: '#888' }}>1. Imagen</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => { if (e.target.files[0]) handleFileUpload(e.target.files[0]); }}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.05)', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '12px', color: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '16px' }}
            >
              <Upload size={24} /> Subir imagen
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sampleImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSampleSelect(img.url, img.type)}
                  style={{ padding: '12px', background: imageUrl === img.url ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.05)', border: imageUrl === img.url ? '1px solid #00d4ff' : '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <ImageIcon size={16} />
                  <span style={{ fontSize: '0.85rem' }}>{img.name}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.7rem', padding: '2px 6px', background: img.type === 'neon' ? 'rgba(255,200,100,0.3)' : 'rgba(200,200,200,0.3)', borderRadius: '4px' }}>
                    {img.type === 'neon' ? 'NEÓN' : 'CORP.'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Relieve */}
          {imageUrl && (
            <>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '0.9rem', marginBottom: '12px', color: '#888' }}>2. Relieve</h3>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>{relief} cm</label>
                  <input
                    type="range"
                    min={isNeon ? 1 : 3}
                    max={isNeon ? 8 : 15}
                    value={relief}
                    onChange={(e) => setRelief(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <button
                onClick={handleClear}
                style={{ width: '100%', padding: '12px', background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.3)', borderRadius: '8px', color: '#ff6464', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <RotateCcw size={16} /> Limpiar
              </button>
            </>
          )}

          {/* Info backend */}
          {apiData && (
            <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(0,212,255,0.05)', borderRadius: '8px', fontSize: '0.78rem', color: '#888' }}>
              <strong style={{ color: '#00d4ff' }}>✅ Procesado por backend</strong>
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>Formas: <strong style={{ color: '#fff' }}>{apiData.totalShapes}</strong></span>
                <span>Profundidad: <strong style={{ color: '#fff' }}>{apiData.depth.toFixed(3)}</strong></span>
                <span>Tipo: <strong style={{ color: '#fff' }}>{apiData.isNeon ? 'Neón' : 'Corpórea'}</strong></span>
                <span>Tamaño: <strong style={{ color: '#fff' }}>{apiData.width3D.toFixed(1)} × {apiData.height3D.toFixed(1)}</strong></span>
              </div>
            </div>
          )}
        </aside>

        {/* Canvas 3D */}
        <main style={{ flex: 1, position: 'relative' }}>
          {!imageUrl ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
              <Box size={64} opacity={0.3} />
              <h2 style={{ marginTop: '20px', fontWeight: 'normal' }}>Selecciona una imagen</h2>
            </div>
          ) : (
            <>
              {/* Preview original */}
              <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, background: 'rgba(0,0,0,0.8)', padding: '12px', borderRadius: '8px', maxWidth: '200px' }}>
                <img src={imageUrl} alt="Original" style={{ width: '100%', borderRadius: '4px', display: 'block' }} />
                <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: '#888' }}>Original</p>
              </div>

              {/* Debug overlay */}
              <DebugOverlay apiData={apiData} show={showDebug} />

              {/* Loading / Error overlay */}
              {isProcessing && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', gap: '16px' }}>
                  <Loader2 size={48} color="#00d4ff" style={{ animation: 'spin 1s linear infinite' }} />
                  <p style={{ color: '#00d4ff', fontSize: '1rem' }}>Procesando en backend...</p>
                  <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
                </div>
              )}

              {apiError && !isProcessing && (
                <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 20, background: 'rgba(255,50,50,0.15)', border: '1px solid rgba(255,50,50,0.4)', padding: '12px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ServerCrash size={18} color="#ff6464" />
                  <span style={{ fontSize: '0.85rem', color: '#ff6464' }}>{apiError}</span>
                </div>
              )}

              <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }} gl={{ antialias: true }} style={{ background: '#0a0a12' }}>
                <Suspense fallback={null}>
                  <Lighting isNeon={isNeon} />
                  <Environment preset="studio" background={false} />

                  <mesh position={[0, 0, -2]} receiveShadow>
                    <planeGeometry args={[16, 10]} />
                    <meshStandardMaterial color={isNeon ? 0x111111 : 0x333333} roughness={0.9} />
                  </mesh>

                  <mesh position={[0, -5, 3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <planeGeometry args={[16, 10]} />
                    <meshStandardMaterial color={0x222222} roughness={0.9} />
                  </mesh>

                  <ContactShadows position={[0, -4.9, 0]} opacity={0.4} scale={20} blur={2.5} far={10} />

                  {apiData && !isProcessing && (
                    <Model3D apiData={apiData} isNeon={isNeon} />
                  )}

                  <OrbitControls enablePan enableZoom enableRotate minDistance={3} maxDistance={20} target={[0, 0, -2]} dampingFactor={0.05} enableDamping />
                </Suspense>
              </Canvas>

              {/* Status bar */}
              <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.8)', padding: '12px 24px', borderRadius: '24px', display: 'flex', gap: '20px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                <span>🖱️ Rotar</span>
                <span>📐 {relief} cm</span>
                <span style={{ color: isNeon ? '#ffaa00' : '#aaa' }}>
                  {isNeon ? '✨ NEÓN' : `⬛ CORPÓREA`}
                </span>
                {apiData && (
                  <span style={{ color: '#00d4ff' }}>
                    {apiData.totalShapes} formas
                  </span>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
