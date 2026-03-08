# Scene3D - Sistema 3D para Letras Corpóreas

## Descripción General

Sistema 3D completo para previsualización de rótulos con **letras corpóreas** y **letras neón**, implementado con **React Three Fiber**.

**Versión**: V31.0 (PBR + Post-processing + Auto Background Removal)
**Fecha**: 2026-03-08
**Dependencias**: 
- three.js ^0.183.2
- @react-three/fiber ^9.5.0
- @react-three/drei ^10.7.7
- @react-three/postprocessing

---

## 🆕 Característica Clave: Eliminación Automática de Fondo

El Scene3D ahora puede trabajar con **imágenes de Gemini/Ideogram que NO tienen fondo transparente**. Detecta automáticamente el color de fondo y lo elimina.

### Cómo funciona:

1. **Detección de fondo**: Analiza los bordes de la imagen para encontrar el color dominante
2. **Máscara binaria**: Crea una máscara separando el objeto del fondo
3. **Preprocesamiento**: Aplica operaciones morfológicas (erosión/dilatación) para limpiar ruido
4. **Marching Squares**: Procesa la máscara para detectar contornos

### Tipos de imágenes soportadas:

| Tipo | Fondo | Ejemplo |
|------|-------|---------|
| PNG con alpha | Transparente | ✅ Funciona nativamente |
| Neón (Gemini) | Negro (#000000) | ✅ Detecta y elimina auto |
| Corpóreas (Gemini) | Blanco/gris | ✅ Detecta y elimina auto |
| Cualquier color | Color sólido | ✅ Detecta y elimina auto |

---

## Características Implementadas (V29-V31)

### ✅ Marching Squares V29.7
- **Algoritmo**: Moore Neighborhood
- **Resolución**: 1600px máximo para detección sin dientes
- **Contornos**: Externos + huecos (interior de letras O, e, a)
- **Área mínima**: 4 píxeles (reducido de 8)
- **Shapes máximos**: 80 por diseño

### ✅ Suavizado de Curvas V29.5
- **Algoritmo**: Chaikin Smoothing
- **Iteraciones**: 6 (aumentado de 4)
- **Media móvil**: Ventana 5 antes + ventana 3 después
- **Simplificación**: Ramer-Douglas-Peucker con tolerancia 0.3
- **Limitador**: 800 puntos máximo, reducción a 600

### ✅ Orientación Automática
- **Cálculo**: Área con signo para detectar CW/CCW
- **Exterior**: Debe ser CCW (antihorario)
- **Huecos**: Deben ser CW (horario)
- **Auto-corrección**: Inversión automática si es necesario

### ✅ Extrusión 3D V29.7
- **Geometría**: `THREE.ExtrudeGeometry`
- **Curvas**: `splineThru` para curvas reales (no líneas)
- **Segmentos**: 64 para curvas perfectas
- **Bevel**:
  - Thickness: 4% del depth
  - Size: 2% del depth
  - Segments: 8

### ✅ Color por Shape V29.8
- **Extracción**: Color promedio de cada contorno
- **Aplicación**: Cada letra/shape con su color real
- **Ejemplo**: Logo con "O" morada y resto gris

### ✅ Materiales PBR V28-V31

#### Tipos Soportados
| Tipo | Metalness | Roughness | Especial |
|------|-----------|-----------|----------|
| `aluminio-sin-luz` | 0.92 | 0.18 | Normal map cepillado |
| `aluminio-con-luz` | 0.88 | 0.15 | Frente metacrilato |
| `aluminio-retroiluminada` | 0.95 | 0.12 | Máximos reflejos |
| `pvc` | 0.0 | 0.65 | Microtextura |
| `pvc-retroiluminadas` | 0.0 | 0.55 | Halo trasero |
| `metacrilato` | 0.1 | 0.01 | Transmisión 0.9 |
| `dibond` | 0.75 | 0.32 | Cepillado |
| `neon-led` | 0.0 | 0.2 | Emissive 0.5 |
| `neon-tradicional` | 0.0 | 0.1 | Transparencia 0.9 |

### ✅ Sistema LED/Retroiluminación V28

#### PVC Retroiluminado - 5 Capas de Halo
```
Capa 1: Opacidad 0.75, Escala 1.05x, Z -0.12
Capa 2: Opacidad 0.55, Escala 1.12x, Z -0.20
Capa 3: Opacidad 0.40, Escala 1.22x, Z -0.28
Capa 4: Opacidad 0.25, Escala 1.35x, Z -0.34
Capa 5: Opacidad 0.12, Escala 1.50x, Z -0.40
+ PointLight trasero (intensidad 2.5)
```

#### Aluminio Retroiluminado - 5 Capas Premium
```
Capa 1: Opacidad 0.85, Escala 1.06x, Z -0.10
Capa 2: Opacidad 0.60, Escala 1.14x, Z -0.18
Capa 3: Opacidad 0.42, Escala 1.25x, Z -0.26
Capa 4: Opacidad 0.26, Escala 1.40x, Z -0.33
Capa 5: Opacidad 0.14, Escala 1.60x, Z -0.40
+ PointLight trasero (intensidad 3.0)
```

#### Aluminio con Luz Frontal
- Glow mesh con AdditiveBlending
- Posicionado frente a la letra

### ✅ Iluminación Three-Point
- **Ambient**: 0.5 intensity, cálida (0xFFF5E6)
- **Key Light**: 1.2 intensity, sombras 2048x2048
- **Fill Light**: 0.45 intensity, azulado (0xE8F0FF)
- **Rim Light**: 0.35 intensity, contorno
- **Bounce Light**: 0.3 intensity, desde suelo
- **Back Light**: 0.2 intensity, trasera

### ✅ HDRI Environment
- **Preset**: "studio" de @react-three/fiber
- **Blur**: 0.5 para suavizar reflejos
- **Background**: false (mantener fondo oscuro)

### ✅ Post-processing V31

#### Bloom (Neón y LEDs)
- **Intensity**: 1.5 (corpóreas) / 2.5 (neón)
- **Threshold**: 0.85 (corpóreas) / 0.3 (neón)
- **Radius**: 0.4 (corpóreas) / 0.6 (neón)
- **Mipmap blur**: Activado

#### SSAO
- **Samples**: 16
- **Radius**: 8
- **Intensity**: 20
- **Bias**: 0.001

#### SMAA
- **Edge detection**: Color
- **Preset**: Ultra quality (3)

### ✅ Texturas SVG Procedurales para Paredes

| Tipo | Descripción |
|------|-------------|
| `wood-panel` | Vetas de madera con nudos |
| `white-wall` | Paneles blancos limpios |
| `dark-wall` | Pared oscura moderna |
| `brick` | Patrón de ladrillos |
| `concrete` | Hormigón rugoso |
| `marble` | Mármol con vetas naturales |

### ✅ Sombra Proyectada
Para materiales sin retroiluminación:
- Geometría PlaneGeometry escalada 1.02x
- Material negro con opacidad 0.2
- Posición desplazada según profundidad

---

## API del Componente

### Scene3D

```jsx
<Scene3D 
  imageUrl={string}              // URL de la imagen (PNG/JPG con o sin fondo)
  corporeaType={string}          // Tipo de material (ver MATERIAL_CONFIGS)
  relief={number}                // Espesor en cm (5-14cm típico)
  luzColor={string}              // Color de retroiluminación
  wallType={string}              // Tipo de pared
  enableHDRI={boolean}           // Activar HDRI (default: true)
  enablePostProcessing={boolean} // Activar post-processing (default: true)
  isNeon={boolean}               // Si es neón (bloom más intenso)
/>
```

### Props de CorporeaType

```javascript
'aluminio-sin-luz'
'aluminio-con-luz'
'aluminio-retroiluminada'
'pvc'
'pvc-retroiluminadas'
'metacrilato'
'pvc-impresas-uv'
'dibond'
'dibond-sin-relieve'
'neon-led'
'neon-tradicional'
```

### Props de WallType

```javascript
'wood-panel'
'white-wall'
'dark-wall'
'brick'
'concrete'
'marble'
```

---

## Utilidades Exportadas

### imageProcessor.js

```javascript
import { 
  detectBackgroundColor,      // Detecta color de fondo de imagen
  createBinaryMask,           // Crea máscara binaria
  processImageForScene3D,     // Procesa imagen completa
  hasRealTransparency         // Verifica si tiene canal alpha
} from './components/Scene3D';
```

### Ejemplo de uso del procesador:

```javascript
const img = new Image();
img.src = '/ruta/imagen.jpg';
img.onload = () => {
  const processed = processImageForScene3D(img);
  console.log('Fondo detectado:', processed.bgColor);
  console.log('Tiene transparencia:', processed.hasTransparency);
  console.log('Matriz binaria:', processed.binary);
};
```

---

## Integración con Gemini

### Flujo de datos:

```
1. Usuario ingresa texto en NeonEditorPage
2. Gemini genera imagen (con fondo negro para neón, blanco para corpóreas)
3. TabMockup recibe la imagen
4. Scene3D procesa la imagen:
   - Detecta color de fondo (negro/blanco)
   - Crea máscara binaria
   - Aplica marching squares
   - Genera geometría 3D
5. Usuario ve el modelo 3D con relieve real
```

### Ejemplo de integración:

```jsx
// TabMockup.jsx
const imagenRotulo = setsGenerados[1]?.rotulo; // Imagen de Gemini

<Scene3D 
  imageUrl={imagenRotulo}
  corporeaType="aluminio-sin-luz"
  relief={8}
  luzColor="blanco-calido"
/>
```

---

## Comparación con Sistema PHP

| Característica | PHP | React | Estado |
|----------------|-----|-------|--------|
| Marching Squares V29.7 | ✅ | ✅ | **Idéntico** |
| Chaikin 6 iteraciones | ✅ | ✅ | **Idéntico** |
| Simplify contour 0.3 | ✅ | ✅ | **Idéntico** |
| Orientación CW/CCW | ✅ | ✅ | **Idéntico** |
| SplineThru curvas | ✅ | ✅ | **Idéntico** |
| Color por shape V29.8 | ✅ | ✅ | **Idéntico** |
| Bevel proporcional | ✅ | ✅ | **Idéntico** |
| **Halo LED 5 capas V28** | ✅ | ✅ | **Idéntico** |
| **Texturas SVG pared** | ✅ | ✅ | **Idéntico** |
| **Sombra proyectada** | ✅ | ✅ | **Idéntico** |
| **Materiales metálicos puros** | ✅ | ✅ | **Idéntico** |
| **Auto background removal** | ❌ | ✅ | **Mejorado en React** |
| Post-processing SSAO/Bloom | ❌ | ✅ | **Mejorado en React** |

---

## Troubleshooting

### El modelo 3D no aparece
1. Verificar que la imagen se cargue correctamente
2. Revisar consola para mensajes de "Color de fondo detectado"
3. Si el fondo no se detecta correctamente, ajustar tolerancia en `imageProcessor.js`

### Contornos irregulares
- Aumentar `sampleStep` en `detectBackgroundColor` para mejor precisión
- Ajustar parámetros de erosión/dilatación en `preprocessBinaryImage`

### Rendimiento lento
- Reducir `maxSize` en `processImageForScene3D` (default: 1600)
- Reducir `curveSegments` en extrusión (default: 64)
- Desactivar post-processing en dispositivos móviles

---

## Extensiones Futuras

- [ ] Exportar a .gltf/.obj
- [ ] Animaciones GSAP de entrada
- [ ] Presets de cámara
- [ ] Física con Cannon.js
- [ ] Más entornos HDRI
