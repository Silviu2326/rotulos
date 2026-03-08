/**
 * ============================================================================
 * EXTRUDED SHAPE - Componente React Three Fiber Avanzado
 * ============================================================================
 * 
 * Basado en disenador-ia.php V29.8 - V31
 * Incluye: Marching squares, Chaikin smoothing, detección de huecos,
 * materiales PBR avanzados, sistema LED de 5 capas, sombra proyectada
 */

import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { findContoursWithHoles, calculateContourArea, getContourBBox, isInsideBBox } from '../utils/marchingSquares';
import { chaikinSmooth, movingAverageSmooth } from '../utils/chaikin';
import { createMaterial, MATERIAL_CONFIGS } from '../utils/materials';
import { processImageForScene3D } from '../utils/imageProcessor';

/**
 * Simplifica un contorno usando el algoritmo de Ramer-Douglas-Peucker
 * V29.5 - Tolerancia muy baja para mantener suavidad máxima
 */
function simplifyContour(points, tolerance = 0.3) {
  if (points.length <= 2) return points;
  
  const sqTolerance = tolerance * tolerance;
  
  function getSqDist(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return dx * dx + dy * dy;
  }
  
  function getSqSegDist(p, p1, p2) {
    let x = p1.x;
    let y = p1.y;
    let dx = p2.x - x;
    let dy = p2.y - y;
    
    if (dx !== 0 || dy !== 0) {
      const t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) {
        x = p2.x;
        y = p2.y;
      } else if (t > 0) {
        x += dx * t;
        y += dy * t;
      }
    }
    
    dx = p.x - x;
    dy = p.y - y;
    return dx * dx + dy * dy;
  }
  
  function simplifyDPStep(points, first, last, sqTolerance, simplified) {
    let maxSqDist = sqTolerance;
    let index = 0;
    
    for (let i = first + 1; i < last; i++) {
      const sqDist = getSqSegDist(points[i], points[first], points[last]);
      if (sqDist > maxSqDist) {
        index = i;
        maxSqDist = sqDist;
      }
    }
    
    if (maxSqDist > sqTolerance) {
      if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
      simplified.push(points[index]);
      if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
    }
  }
  
  const simplified = [points[0]];
  simplifyDPStep(points, 0, points.length - 1, sqTolerance, simplified);
  simplified.push(points[points.length - 1]);
  
  return simplified;
}

/**
 * Calcula el área con signo de un polígono
 * Positivo = CCW (antihorario), Negativo = CW (horario)
 */
function calculateSignedArea(points) {
  let signedArea = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    signedArea += points[i].x * points[j].y;
    signedArea -= points[j].x * points[i].y;
  }
  return signedArea / 2;
}

/**
 * Verifica si un polígono está en sentido horario
 */
function isClockWise(points) {
  return calculateSignedArea(points) < 0;
}

/**
 * Extrae el color promedio de un contorno (V29.8)
 */
function getContourAverageColor(contour, pixels, width, height) {
  let r = 0, g = 0, b = 0, count = 0;
  
  let minX = width, maxX = 0, minY = height, maxY = 0;
  contour.forEach(p => {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  });
  
  const padding = 2;
  for (let y = Math.max(0, minY - padding); y < Math.min(height, maxY + padding); y++) {
    for (let x = Math.max(0, minX - padding); x < Math.min(width, maxX + padding); x++) {
      const i = (y * width + x) * 4;
      if (pixels[i + 3] > 100) {
        r += pixels[i];
        g += pixels[i + 1];
        b += pixels[i + 2];
        count++;
      }
    }
  }
  
  if (count === 0) return new THREE.Color(0xD4D4D4);
  
  return new THREE.Color(
    Math.round(r / count) / 255,
    Math.round(g / count) / 255,
    Math.round(b / count) / 255
  );
}

/**
 * Componente HaloLayer - Una capa del sistema de halo LED
 */
const HaloLayer = ({ geometry, color, opacity, alphaTest, zPosition, scale, renderOrder }) => {
  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      alphaTest: alphaTest,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }, [color, opacity, alphaTest]);

  return (
    <mesh geometry={geometry} material={material} renderOrder={renderOrder}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        alphaTest={alphaTest}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

/**
 * Componente SombraProyectada - Sombra en la pared
 */
const SombraProyectada = ({ width, height, texture, depth }) => {
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(width * 1.02, height * 1.02);
  }, [width, height]);

  return (
    <mesh 
      geometry={geometry}
      position={[depth * 0.15, -depth * 0.15, -0.03]}
    >
      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.1}
        color={0x000000}
        opacity={0.2}
      />
    </mesh>
  );
};

/**
 * Componente que renderiza el diseño extruido con todas las características avanzadas
 */
export const ExtrudedDesign = ({ 
  imageUrl, 
  corporeaType = 'aluminio-sin-luz', 
  relief = 8,
  luzColor = 'blanco-calido'
}) => {
  const groupRef = useRef();
  
  // Cargar textura
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  
  // Configurar textura
  useEffect(() => {
    if (texture) {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      texture.anisotropy = 16;
    }
  }, [texture]);
  
  // Procesar geometrías con todas las mejoras V29-V31 (OPTIMIZADO)
  const processedShapes = useMemo(() => {
    if (!texture || !texture.image) return { shapes: [], width3D: 0, height3D: 0, depth: 0 };
    
    try {
      const img = texture.image;
      
      console.log('🖼️ Procesando imagen para Scene3D...');
      
      // Usar el nuevo procesador de imágenes con detección automática de fondo
      const processed = processImageForScene3D(img);
      const { pixels, binary, width: w, height: h, hasTransparency } = processed;
      
      console.log('📐 V29.7 Resolución de análisis MÁXIMA:', w, 'x', h);
      console.log(hasTransparency ? '✅ Usando transparencia nativa' : '🎨 Fondo eliminado automáticamente');

      // Detectar contornos y huecos
      const { outerContours, holes } = findContoursWithHoles(binary, w, h);
      console.log('🔍 Contornos:', outerContours.length, '| Huecos:', holes.length);
      
      // Si hay demasiados contornos, mostrar warning
      if (outerContours.length > 100) {
        console.warn('⚠️ Imagen muy compleja (' + outerContours.length + ' contornos), limitando a 15 principales');
      }

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
    
    const scale = processed.scale;

    // V29: Profundidad proporcional
    const depthFactor = relief >= 5 ? 83 : 17;
    const depth = relief / depthFactor;

    const scaleX = width3D / w;
    const scaleY = height3D / h;

    // Procesar contornos (máximo 5 shapes para performance)
    // Filtrar por área mínima mayor para eliminar ruido
    const maxShapes = 5; // Reducido de 15 a 5
    const minArea = Math.max(200, (w * h) * 0.005); // 0.5% del área total o 200px mínimo
    
    const sortedContours = outerContours
      .map(c => ({ contour: c, area: Math.abs(calculateContourArea(c)) }))
      .filter(c => c.area > minArea) // Filtro más estricto
      .sort((a, b) => b.area - a.area)
      .slice(0, maxShapes);

    console.log('📊 Contornos a procesar:', sortedContours.length, 'de', outerContours.length, 'detectados');

    const shapes = sortedContours.map(({ contour, area }, index) => {
      if (contour.length < 4) return null;

      try {
        // V29.8: Extraer color del contorno
        const shapeColor = getContourAverageColor(contour, pixels, w, h);
        
        // V29.7: Media móvil ANTES de Chaikin
        let preSmoothed = movingAverageSmooth(contour, 5);
        
        // V29.5: Suavizado Chaikin (6 iteraciones)
        let smoothed = preSmoothed;
        for (let i = 0; i < 6; i++) {
          smoothed = chaikinSmooth(smoothed);
          if (smoothed.length > 800) {
            const step = Math.ceil(smoothed.length / 600);
            smoothed = smoothed.filter((_, idx) => idx % step === 0);
          }
        }
        
        // V29.7: Media móvil DESPUÉS también
        smoothed = movingAverageSmooth(smoothed, 3);
        
        // V29.5: Simplificar con tolerancia muy baja
        const simplified = simplifyContour(smoothed, 0.3);
        if (simplified.length < 4) return null;

        // Transformar a coordenadas Three.js
        const shapePoints = simplified.map(p => ({
          x: (p.x - w / 2) * scaleX,
          y: -(p.y - h / 2) * scaleY
        }));

        // Verificar orientación - exterior debe ser CCW
        if (isClockWise(shapePoints)) {
          shapePoints.reverse();
        }

        // Crear Shape con splineThru para curvas reales
        const shape = new THREE.Shape();
        shape.moveTo(shapePoints[0].x, shapePoints[0].y);
        
        const splinePoints = shapePoints.slice(1).map(p => new THREE.Vector2(p.x, p.y));
        if (splinePoints.length > 2) {
          shape.splineThru(splinePoints);
        } else {
          for (let i = 1; i < shapePoints.length; i++) {
            shape.lineTo(shapePoints[i].x, shapePoints[i].y);
          }
        }
        shape.closePath();

        // OPTIMIZACIÓN: Limitar huecos drásticamente por performance
        const bbox = getContourBBox(simplified);
        const shapeHoles = [];
        let holesAdded = 0;
        const maxHolesPerShape = 2; // Reducido de 5 a 2
        
        // Solo procesar si hay pocos huecos totales (evitar imágenes con mucho ruido)
        if (holes.length > 100) {
          console.log('⚠️ Demasiados huecos (' + holes.length + '), omitiendo detección de huecos para este shape');
        } else {
          // Ordenar huecos por área y tomar solo los más grandes
          const sortedHoles = holes
            .map(h => ({ hole: h, area: Math.abs(calculateContourArea(h)) }))
            .filter(h => h.area > 100) // Filtro más estricto (>100px)
            .sort((a, b) => b.area - a.area)
            .slice(0, maxHolesPerShape * 2);
          
          sortedHoles.forEach(({ hole }, holeIdx) => {
            if (hole.length < 4 || holesAdded >= maxHolesPerShape) return;
          
          const holeBBox = getContourBBox(hole);
          if (isInsideBBox(holeBBox, bbox)) {
            // V29.5: 3 iteraciones de suavizado para huecos
            let processedHole = hole;
            for (let s = 0; s < 3; s++) {
              processedHole = chaikinSmooth(processedHole);
            }
            if (processedHole.length > 150) {
              const step = Math.ceil(processedHole.length / 120);
              processedHole = processedHole.filter((_, idx) => idx % step === 0);
            }
            
            if (processedHole.length >= 3) {
              const holePoints = processedHole.map(p => ({
                x: (p.x - w / 2) * scaleX,
                y: -(p.y - h / 2) * scaleY
              }));
              
              // Huecos deben ser CW (opuesto al exterior)
              if (!isClockWise(holePoints)) {
                holePoints.reverse();
              }
              
              const holePath = new THREE.Path();
              holePath.moveTo(holePoints[0].x, holePoints[0].y);
              
              const holeSplinePoints = holePoints.slice(1).map(p => new THREE.Vector2(p.x, p.y));
              if (holeSplinePoints.length > 2) {
                holePath.splineThru(holeSplinePoints);
              } else {
                for (let j = 1; j < holePoints.length; j++) {
                  holePath.lineTo(holePoints[j].x, holePoints[j].y);
                }
              }
              holePath.closePath();
              shape.holes.push(holePath);
              holesAdded++;
            }
          }
        });
        } // Cierre del else (solo procesar huecos si holes.length <= 100)

        // V29.7: Configuración de extrusión mejorada
        const extrudeSettings = {
          depth: depth,
          bevelEnabled: true,
          bevelThickness: depth * 0.04,
          bevelSize: depth * 0.02,
          bevelSegments: 8,
          curveSegments: 64
        };
        
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        return {
          shape,
          geometry,
          depth,
          color: shapeColor,
          key: `shape-${index}`,
          holesAdded
        };
      } catch (err) {
        console.warn('Error procesando shape:', err);
        return null;
      }
    }).filter(Boolean);

    return { shapes, width3D, height3D, depth };
    } catch (error) {
      console.error('❌ Error procesando imagen para 3D:', error);
      return { shapes: [], width3D: 0, height3D: 0, depth: 0 };
    }
  }, [texture, relief]);

  const { shapes, width3D, height3D, depth } = processedShapes;

  // Determinar configuración LED
  const ledConfig = useMemo(() => {
    const tiposConLuz = ['aluminio-con-luz', 'pvc-retroiluminadas', 'aluminio-retroiluminada'];
    const usaLuz = tiposConLuz.includes(corporeaType);
    
    const ledColorsHex = {
      'blanco-calido': 0xFFF5E6,
      'blanco-frio': 0xE6F5FF,
      'rojo': 0xFF6464,
      'verde': 0x64FF64,
      'azul': 0x6464FF,
      'celeste': 0x64C8FF,
      'naranja': 0xFFB464,
      'amarillo': 0xFFFF64,
      'rosa': 0xFF96C8,
      'morado': 0xB464FF
    };
    
    const ledColor = ledColorsHex[luzColor] || ledColorsHex['blanco-calido'];
    const wallSeparation = MATERIAL_CONFIGS[corporeaType]?.wallSeparation || 0.4;
    
    return {
      usaLuz,
      ledColor,
      wallSeparation,
      tipo: corporeaType
    };
  }, [corporeaType, luzColor]);

  if (shapes.length === 0) return null;

  return (
    <group ref={groupRef} position={[0, 0, -2 + 0.02]}>
      {shapes.map(({ geometry, depth: shapeDepth, color, key }) => (
        <ExtrudedMesh 
          key={key}
          geometry={geometry}
          depth={shapeDepth}
          shapeColor={color}
          texture={texture}
          corporeaType={corporeaType}
          ledConfig={ledConfig}
        />
      ))}
      
      {/* Sombra proyectada (solo si no tiene retroiluminación) */}
      {!ledConfig.usaLuz && (
        <SombraProyectada 
          width={width3D}
          height={height3D}
          texture={texture}
          depth={depth}
        />
      )}
    </group>
  );
};

/**
 * Mesh individual extruido con materiales avanzados y sistema LED
 */
const ExtrudedMesh = ({ geometry, depth, shapeColor, texture, corporeaType, ledConfig }) => {
  const matConfig = MATERIAL_CONFIGS[corporeaType] || MATERIAL_CONFIGS['aluminio-sin-luz'];
  
  // Determinar si es material metálico puro (sin textura frontal)
  const isPureMetallic = ['aluminio-sin-luz', 'aluminio-retroiluminada'].includes(corporeaType) && 
                         !ledConfig.usaLuz;
  
  // Material lateral específico por shape
  const sideMaterial = useMemo(() => {
    const isMetallicType = ['aluminio-sin-luz', 'aluminio-con-luz', 'aluminio-retroiluminada'].includes(corporeaType);
    
    if (isMetallicType) {
      return new THREE.MeshStandardMaterial({
        color: shapeColor,
        metalness: 0.7,
        roughness: 0.2,
        envMapIntensity: 1.2,
        side: THREE.DoubleSide
      });
    } else if (corporeaType === 'metacrilato') {
      return new THREE.MeshStandardMaterial({
        color: shapeColor,
        metalness: 0.1,
        roughness: 0.05,
        transparent: true,
        opacity: 0.7,
        transmission: 0.9,
        thickness: 0.5,
        envMapIntensity: 0.8,
        side: THREE.DoubleSide
      });
    } else if (corporeaType === 'pvc' || corporeaType === 'pvc-retroiluminadas') {
      return new THREE.MeshStandardMaterial({
        color: shapeColor,
        metalness: 0.0,
        roughness: 0.65,
        envMapIntensity: 0.0,
        side: THREE.DoubleSide
      });
    }
    
    return new THREE.MeshStandardMaterial({
      color: shapeColor,
      metalness: 0.5,
      roughness: 0.4,
      side: THREE.DoubleSide
    });
  }, [shapeColor, corporeaType]);

  // Geometría para halo (solo la cara frontal)
  const haloGeometry = useMemo(() => {
    // Crear geometría plana basada en la forma del shape
    const shape = geometry.parameters?.shapes;
    if (!shape) return null;
    
    const shapePoints = shape.getPoints();
    const haloShape = new THREE.Shape(shapePoints);
    
    // Añadir huecos si existen
    shape.holes.forEach(hole => {
      haloShape.holes.push(hole);
    });
    
    return new THREE.ShapeGeometry(haloShape);
  }, [geometry]);

  return (
    <group>
      {/* Mesh principal extruido */}
      <mesh geometry={geometry} castShadow receiveShadow>
        {/* Cara frontal - con o sin textura según tipo */}
        {isPureMetallic ? (
          <meshStandardMaterial 
            attach="material-0"
            color={shapeColor}
            metalness={0.7}
            roughness={0.2}
            side={THREE.FrontSide}
          />
        ) : (
          <meshStandardMaterial 
            attach="material-0"
            map={texture}
            transparent={true}
            alphaTest={0.1}
            roughness={matConfig.frontalRough ?? 0.5}
            metalness={matConfig.frontalMetal ?? 0.0}
            side={THREE.FrontSide}
          />
        )}
        
        {/* Cara trasera */}
        <meshStandardMaterial 
          attach="material-1"
          color={matConfig.color}
          metalness={matConfig.metalness * 0.8}
          roughness={Math.min(1.0, matConfig.roughness + 0.1)}
          side={THREE.BackSide}
        />
        
        {/* Laterales */}
        <primitive object={sideMaterial} attach="material-2" />
      </mesh>

      {/* V28: Sistema de Halo LED de 5 capas */}
      {ledConfig.usaLuz && haloGeometry && (
        <>
          {ledConfig.tipo === 'pvc-retroiluminadas' && (
            <>
              {/* Capa 1: Halo interno */}
              <mesh geometry={haloGeometry} renderOrder={1} position={[0, 0, -ledConfig.wallSeparation * 0.3]} scale={[1.05, 1.05, 1]}>
                <meshBasicMaterial color={ledConfig.ledColor} transparent opacity={0.75} alphaTest={0.01} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
              </mesh>
              {/* Capa 2: Halo medio-interno */}
              <mesh geometry={haloGeometry} renderOrder={2} position={[0, 0, -ledConfig.wallSeparation * 0.5]} scale={[1.12, 1.12, 1]}>
                <meshBasicMaterial color={ledConfig.ledColor} transparent opacity={0.55} alphaTest={0.005} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
              </mesh>
              {/* Capa 3: Halo medio */}
              <mesh geometry={haloGeometry} renderOrder={3} position={[0, 0, -ledConfig.wallSeparation * 0.7]} scale={[1.22, 1.22, 1]}>
                <meshBasicMaterial color={ledConfig.ledColor} transparent opacity={0.40} alphaTest={0.002} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
              </mesh>
              {/* Capa 4: Halo externo */}
              <mesh geometry={haloGeometry} renderOrder={4} position={[0, 0, -ledConfig.wallSeparation * 0.85]} scale={[1.35, 1.35, 1]}>
                <meshBasicMaterial color={ledConfig.ledColor} transparent opacity={0.25} alphaTest={0.001} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
              </mesh>
              {/* Capa 5: Halo ambiente */}
              <mesh geometry={haloGeometry} renderOrder={5} position={[0, 0, -ledConfig.wallSeparation]} scale={[1.50, 1.50, 1]}>
                <meshBasicMaterial color={ledConfig.ledColor} transparent opacity={0.12} alphaTest={0.0005} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
              </mesh>
              {/* Luz trasera */}
              <pointLight color={ledConfig.ledColor} intensity={2.5} distance={8} decay={2} position={[0, 0, -ledConfig.wallSeparation * 1.5]} />
            </>
          )}

          {ledConfig.tipo === 'aluminio-retroiluminada' && (
            <>
              {/* Capa 1: Halo brillante interno */}
              <mesh geometry={haloGeometry} renderOrder={1} position={[0, 0, -ledConfig.wallSeparation * 0.25]} scale={[1.06, 1.06, 1]}>
                <meshBasicMaterial color={ledConfig.ledColor} transparent opacity={0.85} alphaTest={0.01} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
              </mesh>
              {/* Capa 2: Halo medio-interno */}
              <mesh geometry={haloGeometry} renderOrder={2} position={[0, 0, -ledConfig.wallSeparation * 0.45]} scale={[1.14, 1.14, 1]}>
                <meshBasicMaterial color={ledConfig.ledColor} transparent opacity={0.60} alphaTest={0.005} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
              </mesh>
              {/* Capa 3: Halo medio */}
              <mesh geometry={haloGeometry} renderOrder={3} position={[0, 0, -ledConfig.wallSeparation * 0.65]} scale={[1.25, 1.25, 1]}>
                <meshBasicMaterial color={ledConfig.ledColor} transparent opacity={0.42} alphaTest={0.002} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
              </mesh>
              {/* Capa 4: Halo externo */}
              <mesh geometry={haloGeometry} renderOrder={4} position={[0, 0, -ledConfig.wallSeparation * 0.82]} scale={[1.40, 1.40, 1]}>
                <meshBasicMaterial color={ledConfig.ledColor} transparent opacity={0.26} alphaTest={0.001} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
              </mesh>
              {/* Capa 5: Halo ambiente */}
              <mesh geometry={haloGeometry} renderOrder={5} position={[0, 0, -ledConfig.wallSeparation]} scale={[1.60, 1.60, 1]}>
                <meshBasicMaterial color={ledConfig.ledColor} transparent opacity={0.14} alphaTest={0.0003} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
              </mesh>
              {/* Luz trasera intensa */}
              <pointLight color={ledConfig.ledColor} intensity={3.0} distance={10} decay={2} position={[0, 0, -ledConfig.wallSeparation * 1.2]} />
            </>
          )}

          {ledConfig.tipo === 'aluminio-con-luz' && (
            <>
              {/* Glow frontal para aluminio con luz */}
              <mesh geometry={haloGeometry} renderOrder={8} position={[0, 0, depth + 0.03]} scale={[1.03, 1.03, 1]}>
                <meshBasicMaterial color={ledConfig.ledColor} transparent opacity={0.6} alphaTest={0.01} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
              </mesh>
            </>
          )}
        </>
      )}
    </group>
  );
};

/**
 * Habitación con pared y suelo
 */
export const Room = ({ wallType = 'white-wall' }) => {
  // Texturas SVG procedurales (como en PHP)
  const wallTextures = useMemo(() => ({
    'wood-panel': {
      color: '#8B7355',
      pattern: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
        <rect fill="#C4A77D" width="100" height="100"/>
        <g fill="#B8956F" opacity="0.5">
          <rect x="0" y="0" width="100" height="3"/>
          <rect x="0" y="20" width="100" height="2"/>
          <rect x="0" y="45" width="100" height="3"/>
          <rect x="0" y="70" width="100" height="2"/>
          <rect x="0" y="90" width="100" height="3"/>
        </g>
        <g fill="#A08060" opacity="0.3">
          <ellipse cx="25" cy="30" rx="8" ry="3"/>
          <ellipse cx="75" cy="65" rx="6" ry="2"/>
          <ellipse cx="50" cy="85" rx="7" ry="2"/>
        </g>
      </svg>`
    },
    'white-wall': {
      color: '#F5F5F5',
      pattern: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
        <rect fill="#FAFAFA" width="100" height="100"/>
        <g fill="#E8E8E8" opacity="0.4">
          <rect x="0" y="0" width="100" height="1"/>
          <rect x="0" y="25" width="100" height="1"/>
          <rect x="0" y="50" width="100" height="1"/>
          <rect x="0" y="75" width="100" height="1"/>
        </g>
      </svg>`
    },
    'dark-wall': {
      color: '#1a1a2e',
      pattern: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
        <rect fill="#1E1E28" width="100" height="100"/>
        <g fill="#2A2A3A" opacity="0.5">
          <rect x="0" y="0" width="100" height="2"/>
          <rect x="0" y="33" width="100" height="2"/>
          <rect x="0" y="66" width="100" height="2"/>
        </g>
      </svg>`
    },
    'brick': {
      color: '#8B4513',
      pattern: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="32">
        <rect fill="#B5653A" width="64" height="32"/>
        <rect fill="#A0522D" x="1" y="1" width="30" height="14"/>
        <rect fill="#A0522D" x="33" y="1" width="30" height="14"/>
        <rect fill="#A0522D" x="-15" y="17" width="30" height="14"/>
        <rect fill="#A0522D" x="17" y="17" width="30" height="14"/>
        <rect fill="#A0522D" x="49" y="17" width="30" height="14"/>
        <g fill="#8B4513" opacity="0.3">
          <rect x="1" y="1" width="30" height="2"/>
          <rect x="33" y="1" width="30" height="2"/>
          <rect x="17" y="17" width="30" height="2"/>
        </g>
      </svg>`
    },
    'concrete': {
      color: '#808080',
      pattern: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
        <rect fill="#909090" width="100" height="100"/>
        <g fill="#7A7A7A" opacity="0.4">
          <circle cx="20" cy="30" r="2"/>
          <circle cx="60" cy="15" r="1.5"/>
          <circle cx="80" cy="70" r="2.5"/>
          <circle cx="35" cy="80" r="1.5"/>
          <circle cx="90" cy="40" r="1"/>
          <circle cx="10" cy="60" r="2"/>
          <circle cx="50" cy="50" r="1.5"/>
        </g>
        <g fill="#A0A0A0" opacity="0.3">
          <rect x="0" y="45" width="100" height="1"/>
          <rect x="0" y="90" width="100" height="1"/>
        </g>
      </svg>`
    },
    'marble': {
      color: '#E8E8E8',
      pattern: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
        <rect fill="#F0F0F0" width="100" height="100"/>
        <g fill="none" stroke="#D0D0D0" stroke-width="0.5" opacity="0.6">
          <path d="M0,20 Q30,25 50,15 T100,30"/>
          <path d="M0,50 Q40,45 60,55 T100,45"/>
          <path d="M0,80 Q25,75 45,85 T100,70"/>
        </g>
        <g fill="none" stroke="#C8C8C8" stroke-width="0.3" opacity="0.4">
          <path d="M20,0 Q25,30 15,50 T30,100"/>
          <path d="M60,0 Q55,40 70,60 T55,100"/>
        </g>
      </svg>`
    }
  }), []);

  const floorColors = {
    'wood-panel': 0x5A4A3A,
    'white-wall': 0xD0D0D0,
    'dark-wall': 0x0f0f1a,
    'brick': 0x4A3728,
    'concrete': 0x505050,
    'marble': 0xB0B0B0
  };

  const textureData = wallTextures[wallType] || wallTextures['white-wall'];
  const floorColor = floorColors[wallType] || floorColors['white-wall'];

  // Crear textura desde SVG
  const wallTexture = useMemo(() => {
    const svgBlob = new Blob([textureData.pattern], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    
    const loader = new THREE.TextureLoader();
    const tex = loader.load(url);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 5);
    
    // Limpiar URL cuando se desmonte
    return tex;
  }, [textureData]);

  return (
    <>
      {/* Pared con textura SVG */}
      <mesh position={[0, 0, -2]} receiveShadow>
        <planeGeometry args={[16, 10]} />
        <meshStandardMaterial 
          map={wallTexture}
          color={0xffffff}
          roughness={0.8} 
          metalness={0.1}
        />
      </mesh>

      {/* Suelo */}
      <mesh 
        position={[0, -5, 3]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[16, 10]} />
        <meshStandardMaterial 
          color={floorColor} 
          roughness={0.9} 
          metalness={0.1}
        />
      </mesh>
    </>
  );
};

/**
 * Sistema de iluminación Three-Point profesional
 */
export const Lighting = () => {
  return (
    <>
      {/* Ambient */}
      <ambientLight intensity={0.5} color={0xFFF5E6} name="AmbientLight" />
      
      {/* Key Light - luz principal */}
      <directionalLight
        position={[4, 6, 6]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
        shadow-radius={2}
        name="KeyLight"
      />

      {/* Fill Light - luz de relleno */}
      <directionalLight
        position={[-4, 4, 4]}
        intensity={0.45}
        color={0xE8F0FF}
        name="FillLight"
      />

      {/* Rim Light - luz de contorno */}
      <directionalLight
        position={[0, 2, -3]}
        intensity={0.35}
        name="RimLight"
      />

      {/* Bounce Light - luz rebotada */}
      <pointLight 
        position={[0, -3, 2]} 
        intensity={0.3} 
        color={0xC4A77D} 
        distance={15}
        name="BounceLight"
      />

      {/* Back Light */}
      <directionalLight
        position={[0, 2, -5]}
        intensity={0.2}
        name="BackLight"
      />
    </>
  );
};

export default ExtrudedDesign;
