import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HeightMapGenerator } from './HeightMapGenerator';

/**
 * ============================================================================
 * MALLA 3D DEL RÓTULO CON RELIEVE
 * Genera geometría extruida basada en análisis de imagen
 * ============================================================================
 */

export function RotuloMesh3D({ 
  imageUrl, 
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  reliefDepth = 0.3,
  reliefSmoothness = 0.5,
  bevelEnabled = true,
  metalness = 0.3,
  roughness = 0.4,
  color = '#FFD700',
  emissive = '#221100',
  emissiveIntensity = 0.2,
  onLoad
}) {
  const meshRef = useRef();
  const [geometryData, setGeometryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const generator = useMemo(() => new HeightMapGenerator(), []);

  // Analizar imagen y generar geometría
  useEffect(() => {
    if (!imageUrl) return;
    
    setLoading(true);
    
    generator.analyzeImage(imageUrl, {
      extrusionDepth: reliefDepth,
      smoothness: reliefSmoothness,
      resolution: 64
    }).then(data => {
      setGeometryData(data);
      setLoading(false);
      if (onLoad) onLoad(data);
    }).catch(err => {
      console.error('Error analizando imagen:', err);
      setLoading(false);
    });
  }, [imageUrl, reliefDepth, reliefSmoothness, generator]);

  // Crear geometría Three.js
  const geometry = useMemo(() => {
    if (!geometryData || geometryData.geometryData.length === 0) {
      return null;
    }

    const geo = new THREE.BufferGeometry();
    const vertices = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    const { geometryData: points, contours } = geometryData;
    const { width, height } = geometryData.dimensions;

    // Crear geometría por contornos
    contours.forEach((contour, contourIdx) => {
      if (contour.length < 3) return;

      const contourBaseIndex = vertices.length / 3;

      // Vértices del contorno - cara superior
      contour.forEach(point => {
        const x = (point.x / geometryData.resolution.width - 0.5) * width;
        const y = -(point.y / geometryData.resolution.height - 0.5) * height;
        const z = point.height * reliefDepth;

        vertices.push(x, y, z);
        normals.push(0, 0, 1);
        uvs.push(point.x / geometryData.resolution.width, point.y / geometryData.resolution.height);
      });

      // Vértices del contorno - cara inferior (base)
      contour.forEach(point => {
        const x = (point.x / geometryData.resolution.width - 0.5) * width;
        const y = -(point.y / geometryData.resolution.height - 0.5) * height;
        const z = 0;

        vertices.push(x, y, z);
        normals.push(0, 0, -1);
        uvs.push(point.x / geometryData.resolution.width, point.y / geometryData.resolution.height);
      });

      const contourVertexCount = contour.length;

      // Crear triángulos para caras laterales
      for (let i = 0; i < contourVertexCount; i++) {
        const nextIdx = (i + 1) % contourVertexCount;
        
        const topCurrent = contourBaseIndex + i;
        const bottomCurrent = contourBaseIndex + contourVertexCount + i;
        const topNext = contourBaseIndex + nextIdx;
        const bottomNext = contourBaseIndex + contourVertexCount + nextIdx;

        // Primer triángulo de la cara lateral
        indices.push(topCurrent, bottomCurrent, topNext);
        // Segundo triángulo
        indices.push(bottomCurrent, bottomNext, topNext);

        // Calcular normales para la cara lateral
        const v1 = new THREE.Vector3(
          vertices[topCurrent * 3],
          vertices[topCurrent * 3 + 1],
          vertices[topCurrent * 3 + 2]
        );
        const v2 = new THREE.Vector3(
          vertices[topNext * 3],
          vertices[topNext * 3 + 1],
          vertices[topNext * 3 + 2]
        );
        const v3 = new THREE.Vector3(
          vertices[bottomCurrent * 3],
          vertices[bottomCurrent * 3 + 1],
          vertices[bottomCurrent * 3 + 2]
        );

        const normal = new THREE.Vector3()
          .crossVectors(
            new THREE.Vector3().subVectors(v2, v1),
            new THREE.Vector3().subVectors(v3, v1)
          )
          .normalize();

        // Actualizar normales (promedio simple)
        const idx = normals.length - 6;
        normals[idx] = normal.x;
        normals[idx + 1] = normal.y;
        normals[idx + 2] = normal.z;
      }
    });

    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    return geo;
  }, [geometryData, reliefDepth]);

  // Cargar textura del rótulo
  const texture = useMemo(() => {
    if (!imageUrl) return null;
    const tex = new THREE.TextureLoader().load(imageUrl);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, [imageUrl]);

  // Animación suave de entrada
  useFrame((state) => {
    if (meshRef.current && loading === false) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  if (loading) {
    return (
      <mesh position={position}>
        <boxGeometry args={[2, 0.5, 0.1]} />
        <meshStandardMaterial color="#444" wireframe />
      </mesh>
    );
  }

  if (!geometry) {
    return null;
  }

  return (
    <group 
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      {/* Malla principal del rótulo con relieve */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          map={texture}
          color={color}
          metalness={metalness}
          roughness={roughness}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          transparent
          alphaTest={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Marco/borde del rótulo */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[
          geometryData.dimensions.width + 0.1,
          geometryData.dimensions.height + 0.1,
          0.1
        ]} />
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Brackets de montaje */}
      <MountingBrackets 
        width={geometryData.dimensions.width}
        height={geometryData.dimensions.height}
      />
    </group>
  );
}

/**
 * Brackets de montaje para el rótulo
 */
function MountingBrackets({ width, height }) {
  const bracketPositions = [
    [-width * 0.3, -height * 0.4, -0.15],
    [width * 0.3, -height * 0.4, -0.15],
    [-width * 0.3, height * 0.4, -0.15],
    [width * 0.3, height * 0.4, -0.15],
  ];

  return (
    <>
      {bracketPositions.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <cylinderGeometry args={[0.02, 0.02, 0.2]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </>
  );
}

export default RotuloMesh3D;
