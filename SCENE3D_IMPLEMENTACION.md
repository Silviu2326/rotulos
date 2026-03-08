# Scene3D - Sistema 3D con React Three Fiber

## 📁 Estructura Actualizada

```
src/pages/NeonEditorPage/components/Scene3D/
├── index.jsx                    # Componente principal con Canvas
├── index.js                     # Exportaciones
├── Scene3D.css                  # Estilos
├── components/
│   └── ExtrudedShape.jsx        # ExtrudedDesign, Room, Lighting (R3F)
├── hooks/
│   └── useThreeJS.js            # (Deprecado - ahora en R3F)
└── utils/
    ├── marchingSquares.js       # Detección de contornos
    ├── chaikin.js               # Suavizado de curvas
    └── materials.js             # Materiales PBR
```

## 🚀 Ventajas de React Three Fiber

| Característica | Three.js Vanilla | React Three Fiber |
|----------------|------------------|-------------------|
| **Código** | Imperativo | Declarativo (JSX) |
| **Estado** | Manual | Integrado con React |
| **Re-renders** | Manuales | Automáticos |
| **Hooks** | ❌ No | ✅ useFrame, useLoader... |
| **Performance** | Manual | Optimizada automáticamente |
| **Controles** | Código manual | `<OrbitControls />` |
| **Carga texturas** | Manual | `useLoader()` |
| **Tamaño bundle** | Completo | Tree-shakeable |

## 📦 Dependencias

Ya instaladas en el proyecto:
```json
{
  "three": "^0.183.2",
  "@react-three/fiber": "^9.5.0",
  "@react-three/drei": "^10.7.7",
  "@types/three": "^0.183.1"
}
```

## 🎯 Uso del Componente

```jsx
import { Scene3D } from './components/Scene3D';

// Solo para letras corpóreas
<Scene3D 
  imageUrl="/ruta/a/rotulo.png"
  corporeaType="aluminio-sin-luz"
  relief={8}
  luzColor="blanco-calido"
  wallType="white-wall"
/>
```

## 🧩 Componentes React Three Fiber

### 1. ExtrudedDesign
```jsx
<ExtrudedDesign 
  imageUrl={...}
  corporeaType="aluminio-sin-luz"
  relief={8}
  luzColor="blanco-calido"
/>
```

### 2. Room (Habitación)
```jsx
<Room wallType="white-wall" />
```

### 3. Lighting (Iluminación)
```jsx
<Lighting />
```

### 4. OrbitControls (de drei)
```jsx
<OrbitControls
  enablePan={true}
  enableZoom={true}
  enableRotate={true}
  minDistance={3}
  maxDistance={20}
  dampingFactor={0.05}
/>
```

## 🎨 Ejemplo Completo

```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { ExtrudedDesign, Room, Lighting } from './components/Scene3D';

function App() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
      {/* Iluminación */}
      <Lighting />
      
      {/* Ambiente HDRI */}
      <Environment preset="studio" />
      
      {/* Habitación */}
      <Room wallType="white-wall" />
      
      {/* Diseño 3D */}
      <ExtrudedDesign 
        imageUrl="/rotulo.png"
        corporeaType="aluminio-sin-luz"
        relief={8}
      />
      
      {/* Controles */}
      <OrbitControls />
    </Canvas>
  );
}
```

## ⚡ Hooks de React Three Fiber Usados

### useLoader
Carga texturas de forma declarativa:
```jsx
const texture = useLoader(THREE.TextureLoader, imageUrl);
```

### useMemo
Procesa geometrías solo cuando cambian las dependencias:
```jsx
const shapes = useMemo(() => {
  // Procesar marching squares...
  return shapes;
}, [texture, relief]);
```

### useFrame
Para animaciones (si se necesitan):
```jsx
useFrame((state, delta) => {
  // Animación por frame
});
```

## 🔄 Comparación: Vanilla vs R3F

### Three.js Vanilla (Código Imperativo)
```javascript
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
```

### React Three Fiber (Código Declarativo)
```jsx
<Canvas camera={{ fov: 75 }}>
  <mesh>
    <boxGeometry />
    <meshStandardMaterial color="red" />
  </mesh>
</Canvas>
```

## ✅ Checklist Implementación R3F

- [x] Instalar three + @react-three/fiber + @react-three/drei
- [x] Crear componente ExtrudedShape.jsx con R3F
- [x] Usar `useLoader` para texturas
- [x] Usar `useMemo` para geometrías
- [x] Componente `Room` para habitación
- [x] Componente `Lighting` para iluminación
- [x] Integrar `<OrbitControls />` de drei
- [x] Suspense con loader
- [x] Error Boundary
- [x] Estilos responsivos
- [x] Integración condicional en TabMockup

## 🎭 Características Implementadas

| Característica | Estado |
|----------------|--------|
| Marching Squares | ✅ |
| Detección de huecos | ✅ |
| Chaikin smoothing (6 iter) | ✅ |
| Media móvil | ✅ |
| ExtrudeGeometry | ✅ |
| Bevel en bordes | ✅ |
| Materiales PBR | ✅ |
| Iluminación Three-Point | ✅ |
| Sombras | ✅ |
| Controles cámara (Orbit) | ✅ |
| HDRI (preparado) | 🚧 |
| Post-processing (bloom) | 🚧 |

## 📝 Notas

- React Three Fiber maneja automáticamente el resize del canvas
- Las geometrías se cachean con `useMemo` para evitar re-procesamiento
- El componente `<Canvas>` de R3F incluye optimizaciones automáticas
- `OrbitControls` de drei proporciona controles de cámara profesionales
- El sistema es **condicional**: solo aparece para `letras-corporeas`
