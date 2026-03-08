# Sistema 3D Avanzado - Guía de Implementación para React

## 📋 Resumen Ejecutivo

El sistema 3D del diseñador PHP **NO se aplica a todas las categorías**. Solo las **letras corpóreas** y **neón** usan Three.js con extrusión real. El resto (lonas, vinilos, rótulos) usan imágenes 2D planas.

---

## 🎯 Categorías y sus Sistemas de Renderizado

| Categoría | Sistema | Three.js | Complejidad |
|-----------|---------|----------|-------------|
| **Letras Corpóreas** | Extrusión 3D real + Materiales PBR | ✅ Completo | Alta |
| **Letras Neón** | Efectos emisivos + Bloom | ✅ Básico | Media |
| **Lonas/Pancartas** | Sistema Híbrido (Ideogram + Canvas) | ❌ No | Baja |
| **Vinilos** | Imagen 2D sobre fachada | ❌ No | Baja |
| **Rótulos Luminosos** | Imagen 2D sobre fachada | ❌ No | Baja |
| **Banderolas** | Imagen 2D sobre fachada | ❌ No | Baja |

---

## 🔧 Cómo funciona el 3D en PHP (Para Corpóreas)

### 1. Flujo de Generación

```
Imagen PNG (transparente)
    ↓
[Canvas de Análisis] ← Resolución 1600px máx
    ↓
[Binarización] ← Alpha > 100 = 1, resto = 0
    ↓
[Marching Squares] ← Detecta contornos externos + huecos
    ↓
[Suavizado Chaikin] ← 6 iteraciones + Media móvil
    ↓
[Three.js Shape] ← THREE.Shape con splineThru
    ↓
[ExtrudeGeometry] ← Profundidad configurable (5-14cm)
    ↓
[Materiales PBR] ← Aluminio/PVC/Metacrilato
    ↓
[Iluminación HDRI] ← Three-point + Environment
    ↓
[Post-Processing] ← Bloom, FXAA, Tone Mapping
    ↓
Render 3D Interactivo
```

### 2. Algoritmo de Detección de Contornos (Marching Squares)

```javascript
// PASO 1: Crear matriz binaria desde imagen
const binary = [];
for (let y = 0; y < h; y++) {
    binary[y] = [];
    for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        binary[y][x] = pixels[i + 3] > 100 ? 1 : 0; // Alpha channel
    }
}

// PASO 2: Encontrar contornos externos
const { outerContours, holes } = findContoursWithHoles(binary, w, h);

// PASO 3: Para cada contorno, crear THREE.Shape
const shape = new THREE.Shape();
shape.moveTo(shapePoints[0].x, shapePoints[0].y);
shape.splineThru(splinePoints); // Curvas suaves
shape.closePath();

// PASO 4: Añadir huecos (para letras como O, R, e, a)
holes.forEach(hole => {
    const holePath = new THREE.Path();
    holePath.moveTo(holePoints[0].x, holePoints[0].y);
    holePath.splineThru(holeSplinePoints);
    shape.holes.push(holePath);
});

// PASO 5: Extruir
const extrudeSettings = {
    depth: visibleDepth,       // 0.06 - 0.17 (5-14cm)
    bevelEnabled: true,
    bevelThickness: 0.15,
    bevelSize: 0.08,
    bevelSegments: 8,          // Bordes redondeados
    curveSegments: 64          // Curvas perfectas
};
const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
```

### 3. Materiales PBR por Tipo

```javascript
const materialConfigs = {
    'aluminio-sin-luz': {
        metalness: 0.92,
        roughness: 0.18,
        normalMap: createBrushedNormalMap(), // Cepillado
        envMapIntensity: 1.2
    },
    'aluminio-retroiluminada': {
        metalness: 0.95,
        roughness: 0.12,
        envMapIntensity: 1.4
    },
    'pvc': {
        metalness: 0.0,
        roughness: 0.65,
        normalMap: createMicroTextureNormal(), // Microtextura
        envMapIntensity: 0.0 // Sin reflejos
    },
    'metacrilato': {
        metalness: 0.1,
        roughness: 0.01,
        transparent: true,
        opacity: 0.7,
        transmission: 0.9, // Refracción
        ior: 1.49 // Índice PMMA
    }
};
```

### 4. Iluminación Profesional

```javascript
// Sistema Three-Point
const keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.5);
keyLight.position.set(5, 8, 7);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 4096; // Sombras 4K

const fillLight = new THREE.DirectionalLight(0xB0C4DE, 0.8);
fillLight.position.set(-6, 5, 4);

const rimLight = new THREE.SpotLight(0xFFFFFF, 1.5);
rimLight.position.set(0, 4, -8);

// HDRI Environment
const pmremGenerator = new THREE.PMREMGenerator(renderer);
const envMap = pmremGenerator.fromEquirectangular(hdriTexture).texture;
scene.environment = envMap;
```

---

## ⚛️ Implementación en React

### Arquitectura Recomendada

```
src/
├── components/
│   └── Scene3D/
│       ├── index.jsx              # Componente principal
│       ├── hooks/
│       │   ├── useThreeJS.js      # Inicialización Three.js
│       │   ├── useContours.js     # Marching Squares
│       │   └── useMaterials.js    # Materiales PBR
│       ├── utils/
│       │   ├── marchingSquares.js # Algoritmo de detección
│       │   ├── chaikin.js         # Suavizado de curvas
│       │   └── materials.js       # Configuraciones PBR
│       └── materials/
│           ├── AluminioMaterial.js
│           ├── PVCMaterial.js
│           └── MetacrilatoMaterial.js
```

### 1. Hook useThreeJS (Inicialización)

```javascript
// hooks/useThreeJS.js
import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

export const useThreeJS = (canvasRef, containerRef) => {
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const composerRef = useRef(null);

    const initScene = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        
        // Escena
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a12);
        sceneRef.current = scene;

        // Cámara
        const camera = new THREE.PerspectiveCamera(
            50,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 10);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            preserveDrawingBuffer: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        rendererRef.current = renderer;

        return { scene, camera, renderer };
    }, [canvasRef, containerRef]);

    const initLighting = useCallback(async (scene) => {
        // Three-Point Lighting
        const keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.5);
        keyLight.position.set(5, 8, 7);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 4096;
        keyLight.shadow.mapSize.height = 4096;
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0xB0C4DE, 0.8);
        fillLight.position.set(-6, 5, 4);
        scene.add(fillLight);

        const ambient = new THREE.AmbientLight(0xFFFFF0, 0.3);
        scene.add(ambient);

        // HDRI (opcional)
        try {
            const pmremGenerator = new THREE.PMREMGenerator(rendererRef.current);
            const loader = new RGBELoader();
            const texture = await loader.loadAsync('/hdri/studio.hdr');
            const envMap = pmremGenerator.fromEquirectangular(texture).texture;
            scene.environment = envMap;
            texture.dispose();
        } catch (e) {
            console.warn('HDRI no disponible, usando iluminación básica');
        }
    }, []);

    return {
        sceneRef,
        cameraRef,
        rendererRef,
        composerRef,
        initScene,
        initLighting
    };
};
```

### 2. Marching Squares (Detección de Contornos)

```javascript
// utils/marchingSquares.js

/**
 * Detecta contornos externos y huecos en una imagen binaria
 * Implementación del algoritmo Marching Squares
 */
export function findContoursWithHoles(binary, width, height) {
    const outerContours = [];
    const holes = [];
    const visited = Array(height).fill(null).map(() => Array(width).fill(false));

    // PASO 1: Encontrar contornos externos
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            if (binary[y][x] === 1 && binary[y][x - 1] === 0 && !visited[y][x]) {
                const contour = traceOuterContour(binary, visited, x, y, width, height);
                if (contour.length >= 8) {
                    const area = calculateContourArea(contour);
                    if (Math.abs(area) > 8) {
                        outerContours.push(contour);
                    }
                }
            }
        }
    }

    // PASO 2: Detectar huecos con flood fill desde bordes
    const exterior = Array(height).fill(null).map(() => Array(width).fill(false));
    const queue = [];

    // Marcar bordes exteriores
    for (let x = 0; x < width; x++) {
        if (binary[0][x] === 0) { queue.push({x, y: 0}); exterior[0][x] = true; }
        if (binary[height-1][x] === 0) { queue.push({x, y: height-1}); exterior[height-1][x] = true; }
    }
    for (let y = 0; y < height; y++) {
        if (binary[y][0] === 0) { queue.push({x: 0, y}); exterior[y][0] = true; }
        if (binary[y][width-1] === 0) { queue.push({x: width-1, y}); exterior[y][width-1] = true; }
    }

    // Flood fill
    while (queue.length > 0) {
        const {x, y} = queue.shift();
        const neighbors = [[0,1], [0,-1], [1,0], [-1,0]];
        
        for (const [dx, dy] of neighbors) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height &&
                binary[ny][nx] === 0 && !exterior[ny][nx]) {
                exterior[ny][nx] = true;
                queue.push({x: nx, y: ny});
            }
        }
    }

    // Encontrar huecos (transparentes que no son exteriores)
    const holeVisited = Array(height).fill(null).map(() => Array(width).fill(false));
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            if (binary[y][x] === 0 && !exterior[y][x] && !holeVisited[y][x]) {
                const holeContour = traceHoleContour(binary, holeVisited, x, y, width, height);
                if (holeContour.length >= 6) {
                    holes.push(holeContour);
                }
            }
        }
    }

    return { outerContours, holes };
}

/**
 * Trazar contorno externo usando Moore Neighborhood
 */
function traceOuterContour(binary, visited, startX, startY, w, h) {
    const contour = [];
    const dx8 = [1, 1, 0, -1, -1, -1, 0, 1];
    const dy8 = [0, 1, 1, 1, 0, -1, -1, -1];

    let x = startX, y = startY;
    let prevDir = 0;
    let steps = 0;
    const maxSteps = Math.max(w, h) * 4;

    do {
        contour.push({x, y});
        visited[y][x] = true;

        // Buscar siguiente píxel en sentido antihorario
        let found = false;
        for (let i = 0; i < 8; i++) {
            const dir = (prevDir + i) % 8;
            const nx = x + dx8[dir];
            const ny = y + dy8[dir];

            if (nx >= 0 && nx < w && ny >= 0 && ny < h && binary[ny][nx] === 1) {
                x = nx;
                y = ny;
                prevDir = (dir + 5) % 8;
                found = true;
                break;
            }
        }

        if (!found) break;
        steps++;
    } while (steps < maxSteps && !(x === startX && y === startY && steps > 3));

    return contour;
}

/**
 * Calcular área con signo (para orientación)
 */
export function calculateContourArea(contour) {
    let area = 0;
    for (let i = 0; i < contour.length; i++) {
        const j = (i + 1) % contour.length;
        area += contour[i].x * contour[j].y;
        area -= contour[j].x * contour[i].y;
    }
    return area / 2;
}
```

### 3. Suavizado de Curvas (Chaikin)

```javascript
// utils/chaikin.js

/**
 * Algoritmo de Chaikin para suavizar curvas
 * 6 iteraciones para curvas ultra-lisas
 */
export function chaikinSmooth(points, iterations = 6) {
    let result = points;
    
    for (let iter = 0; iter < iterations; iter++) {
        const smoothed = [];
        
        for (let i = 0; i < result.length; i++) {
            const p0 = result[i];
            const p1 = result[(i + 1) % result.length];
            
            // Chaikin: crear dos puntos nuevos en 1/4 y 3/4
            const q = {
                x: 0.75 * p0.x + 0.25 * p1.x,
                y: 0.75 * p0.y + 0.25 * p1.y
            };
            const r = {
                x: 0.25 * p0.x + 0.75 * p1.x,
                y: 0.25 * p0.y + 0.75 * p1.y
            };
            
            smoothed.push(q, r);
        }
        
        result = smoothed;
        
        // Limitar puntos para evitar explosión de memoria
        if (result.length > 800) {
            const step = Math.ceil(result.length / 600);
            result = result.filter((_, idx) => idx % step === 0);
        }
    }
    
    return result;
}

/**
 * Filtro de media móvil para eliminar micro-variaciones
 */
export function movingAverageSmooth(points, windowSize = 5) {
    if (points.length < windowSize) return points;
    
    const result = [];
    const half = Math.floor(windowSize / 2);
    
    for (let i = 0; i < points.length; i++) {
        let sumX = 0, sumY = 0, count = 0;
        
        for (let j = -half; j <= half; j++) {
            const idx = (i + j + points.length) % points.length;
            sumX += points[idx].x;
            sumY += points[idx].y;
            count++;
        }
        
        result.push({
            x: sumX / count,
            y: sumY / count
        });
    }
    
    return result;
}
```

### 4. Componente Scene3D Principal

```javascript
// components/Scene3D/index.jsx
import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { useThreeJS } from './hooks/useThreeJS';
import { findContoursWithHoles, calculateContourArea } from './utils/marchingSquares';
import { chaikinSmooth, movingAverageSmooth } from './utils/chaikin';
import { createMaterial } from './utils/materials';

export const Scene3D = ({ 
    imageUrl,           // URL de la imagen PNG transparente
    corporeaType,       // 'aluminio-sin-luz', 'pvc', 'metacrilato', etc.
    relief,             // Espesor en cm (5, 8, 10, 12, 14)
    luzColor,           // Color de LED (para retroiluminadas)
    className 
}) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const designMeshRef = useRef(null);
    
    const { sceneRef, cameraRef, rendererRef, initScene, initLighting } = 
        useThreeJS(canvasRef, containerRef);

    // Cargar diseño y crear extrusión 3D
    const loadDesign = useCallback(async (url) => {
        if (!sceneRef.current) return;

        // Eliminar mesh anterior
        if (designMeshRef.current) {
            sceneRef.current.remove(designMeshRef.current);
            designMeshRef.current.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (child.material.map) child.material.map.dispose();
                    child.material.dispose();
                }
            });
        }

        // Cargar imagen
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
        });

        // Crear canvas de análisis (resolución máxima 1600px)
        const maxSize = 1600;
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.floor(img.width * scale);
        const h = Math.floor(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        // Obtener datos de píxeles
        const imgData = ctx.getImageData(0, 0, w, h);
        const pixels = imgData.data;

        // Crear textura para cara frontal
        const texture = new THREE.Texture(img);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        texture.anisotropy = 16;
        texture.needsUpdate = true;

        // Matriz binaria
        const binary = [];
        for (let y = 0; y < h; y++) {
            binary[y] = [];
            for (let x = 0; x < w; x++) {
                const i = (y * w + x) * 4;
                binary[y][x] = pixels[i + 3] > 100 ? 1 : 0;
            }
        }

        // Detectar contornos
        const { outerContours, holes } = findContoursWithHoles(binary, w, h);

        // Calcular escala 3D
        const aspect = img.width / img.height;
        const baseSize = 6;
        let width3D, height3D;
        
        if (aspect > 1) {
            width3D = baseSize;
            height3D = baseSize / aspect;
        } else {
            height3D = baseSize;
            width3D = baseSize * aspect;
        }

        // Profundidad
        const depthFactor = relief >= 5 ? 83 : 17;
        const depth = relief / depthFactor;

        // Crear grupo
        const designGroup = new THREE.Group();
        const scaleX = width3D / w;
        const scaleY = height3D / h;

        // Materiales
        const { sideMaterial, frontMaterial, backMaterial } = 
            createMaterial(corporeaType, texture, luzColor);

        // Crear shapes extruidos (máximo 80 shapes)
        const maxShapes = 80;
        const sortedContours = outerContours
            .map(c => ({ contour: c, area: Math.abs(calculateContourArea(c)) }))
            .filter(c => c.area > 4)
            .sort((a, b) => b.area - a.area)
            .slice(0, maxShapes);

        sortedContours.forEach(({ contour }, idx) => {
            if (contour.length < 4) return;

            // Suavizado
            let preSmoothed = movingAverageSmooth(contour, 5);
            let smoothed = preSmoothed;
            for (let i = 0; i < 6; i++) {
                smoothed = chaikinSmooth(smoothed, 1);
                if (smoothed.length > 800) {
                    const step = Math.ceil(smoothed.length / 600);
                    smoothed = smoothed.filter((_, i) => i % step === 0);
                }
            }

            // Crear shape
            const shapePoints = smoothed.map(p => ({
                x: (p.x - w / 2) * scaleX,
                y: -(p.y - h / 2) * scaleY
            }));

            // Orientación CCW
            const shape = new THREE.Shape();
            shape.moveTo(shapePoints[0].x, shapePoints[0].y);
            const splinePoints = shapePoints.slice(1).map(p => new THREE.Vector2(p.x, p.y));
            shape.splineThru(splinePoints);
            shape.closePath();

            // Añadir huecos
            const bbox = getContourBBox(smoothed);
            holes.forEach(hole => {
                const holeBBox = getContourBBox(hole);
                if (isInsideBBox(holeBBox, bbox)) {
                    const holePoints = hole.map(p => ({
                        x: (p.x - w / 2) * scaleX,
                        y: -(p.y - h / 2) * scaleY
                    }));
                    
                    const holePath = new THREE.Path();
                    holePath.moveTo(holePoints[0].x, holePoints[0].y);
                    const holeSpline = holePoints.slice(1).map(p => new THREE.Vector2(p.x, p.y));
                    holePath.splineThru(holeSpline);
                    holePath.closePath();
                    shape.holes.push(holePath);
                }
            });

            // Extruir
            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: depth,
                bevelEnabled: true,
                bevelThickness: 0.15,
                bevelSize: 0.08,
                bevelSegments: 8,
                curveSegments: 64
            });

            // Aplicar materiales
            const mesh = new THREE.Mesh(geometry, [
                frontMaterial, // Cara frontal
                backMaterial,  // Cara trasera
                sideMaterial   // Laterales
            ]);

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            designGroup.add(mesh);
        });

        // Posicionar
        designGroup.position.set(0, 0, -2 + 0.02);
        sceneRef.current.add(designGroup);
        designMeshRef.current = designGroup;

    }, [sceneRef, corporeaType, relief, luzColor]);

    // Inicializar y cargar
    useEffect(() => {
        const init = async () => {
            await initScene();
            await initLighting(sceneRef.current);
            if (imageUrl) {
                await loadDesign(imageUrl);
            }
            animate();
        };

        init();

        // Resize handler
        const handleResize = () => {
            if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            cameraRef.current.aspect = w / h;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(w, h);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Actualizar cuando cambia la imagen o configuración
    useEffect(() => {
        if (imageUrl) {
            loadDesign(imageUrl);
        }
    }, [imageUrl, corporeaType, relief, luzColor, loadDesign]);

    // Loop de animación
    const animate = useCallback(() => {
        requestAnimationFrame(animate);
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
    }, []);

    return (
        <div ref={containerRef} className={`scene-3d-container ${className}`}>
            <canvas ref={canvasRef} />
        </div>
    );
};
```

---

## 🎨 Uso Condicional por Categoría

```jsx
// En tu componente principal
import { Scene3D } from './components/Scene3D';

const Visualizador = ({ categoria, imagenGenerada, config }) => {
    // Solo usar Three.js para categorías que lo necesitan
    const usa3D = ['letras-corporeas', 'letras-neon'].includes(categoria);
    
    if (!usa3D) {
        // Renderizar mockup 2D estándar
        return <Mockup2D imagen={imagenGenerada} fachada={config.fachada} />;
    }

    // Para corpóreas: usar Three.js con extrusión
    if (categoria === 'letras-corporeas') {
        return (
            <Scene3D
                imageUrl={imagenGenerada}
                corporeaType={config.tipoLetraCorporea} // 'aluminio-sin-luz', etc.
                relief={config.espesor} // 5, 8, 10, 12, 14
                luzColor={config.colorLuzLed} // 'blanco-calido', etc.
            />
        );
    }

    // Para neón: versión simplificada sin extrusión
    if (categoria === 'letras-neon') {
        return (
            <Scene3DNeon
                imageUrl={imagenGenerada}
                neonColor={config.colorLuzLed}
            />
        );
    }
};
```

---

## 📦 Dependencias Necesarias

```bash
npm install three @react-three/fiber
npm install -D @types/three
```

---

## 🚀 Optimizaciones Recomendadas

1. **Lazy Loading**: Cargar Three.js solo cuando se necesite
2. **Web Workers**: Procesar Marching Squares en worker para no bloquear UI
3. **Memoización**: Cachear geometrías generadas
4. **LOD**: Reducir detalle en móviles
5. **Suspense**: Mostrar loader mientras se inicializa Three.js

---

## ✅ Checklist de Implementación

- [ ] Instalar dependencias Three.js
- [ ] Crear hook `useThreeJS` para inicialización
- [ ] Implementar `marchingSquares.js` para detección de contornos
- [ ] Implementar `chaikin.js` para suavizado
- [ ] Crear materiales PBR por tipo de corpórea
- [ ] Componente `Scene3D` con extrusión real
- [ ] Lógica condicional: solo usar 3D para `letras-corporeas`
- [ ] Fallback 2D para otras categorías
- [ ] Controles de cámara (drag, zoom)
- [ ] Post-procesado opcional (bloom para neón)

---

**Nota**: El sistema 3D es complejo y solo necesario para letras corpóreas. Para el resto de categorías, las imágenes 2D generadas por IA son suficientes y mucho más rápidas de renderizar.
