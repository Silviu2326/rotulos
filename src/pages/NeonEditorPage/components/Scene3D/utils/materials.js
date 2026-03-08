/**
 * ============================================================================
 * MATERIALS - Sistema de Materiales PBR Avanzado
 * ============================================================================
 * 
 * V28-V31: Materiales profesionales según fichas técnicas reales
 * Basado en especificaciones de fabricación de rótulos corpóreos
 */

import * as THREE from 'three';

/**
 * Configuraciones de materiales según tipo de corpórea
 * V28: Basado en especificaciones reales de fabricación
 */
export const MATERIAL_CONFIGS = {
  'aluminio-sin-luz': { 
    color: 0xD4D4D4,       // Aluminio lacado claro
    metalness: 0.92,       // Alto brillo metálico
    roughness: 0.18,       // Acabado satinado
    frontalMetal: 0.35,    // Ligero brillo en frente
    frontalRough: 0.35,
    envMapIntensity: 1.2,  // Reflejos visibles
    description: 'Aluminio lacado sin iluminación'
  },
  'aluminio-con-luz': { 
    color: 0xE8E8E8,       // Caja metálica clara
    metalness: 0.88,       // Metálico pronunciado
    roughness: 0.15,       // Muy pulido
    frontalMetal: 0.1,     // Frente metacrilato opal
    frontalRough: 0.25,    // Semi-mate por difusión
    frontalOpacity: 0.92,  // Transmitancia metacrilato
    envMapIntensity: 1.0,
    description: 'Caja aluminio con LEDs frontales'
  },
  'aluminio-retroiluminada': { 
    color: 0xC0C0C0,       // Aluminio más oscuro para contraste
    metalness: 0.95,       // Muy metálico (opaco)
    roughness: 0.12,       // Muy pulido
    frontalMetal: 0.4,     // Frente metálico visible
    frontalRough: 0.28,
    envMapIntensity: 1.4,  // Máximos reflejos
    description: 'Aluminio opaco retroiluminado'
  },
  'pvc': { 
    color: 0xFAFAFA,       // PVC espumado blanco
    metalness: 0.0,        // Sin brillo metálico
    roughness: 0.65,       // Mate característico
    frontalMetal: 0.0,
    frontalRough: 0.55,
    envMapIntensity: 0.0,
    sideColor: 0x2A2A2A,   // Cantos oscuros (núcleo PE)
    description: 'PVC fresado espumado'
  },
  'pvc-retroiluminadas': { 
    color: 0xFFFFFF,       // Blanco puro
    metalness: 0.0,
    roughness: 0.55,       // Semi-mate
    frontalMetal: 0.0,
    frontalRough: 0.45,
    envMapIntensity: 0.0,
    sideColor: 0x1A1A1A,   // Cantos muy oscuros
    wallSeparation: 0.4,   // 4cm de separación
    description: 'PVC retroiluminado halo trasero'
  },
  'metacrilato': { 
    color: 0xE8F8FF,       // Tinte azulado característico del acrílico
    metalness: 0.1,        // Ligero brillo
    roughness: 0.01,       // Muy brillante (cristalino)
    transparent: true,
    opacity: 0.7,          // V29: Más transparente para efecto cristal
    frontalMetal: 0.08,
    frontalRough: 0.05,
    envMapIntensity: 0.8,
    refractionRatio: 0.98, // IOR metacrilato
    description: 'PMMA colado alta calidad óptica'
  },
  'pvc-impresas-uv': { 
    color: 0xF8F8F8,
    metalness: 0.02,
    roughness: 0.38,       // Semi-mate por impresión
    frontalMetal: 0.0,
    frontalRough: 0.42,
    envMapIntensity: 0.0,
    description: 'PVC con impresión UV directa'
  },
  'dibond': { 
    color: 0xE5E5E5,       // Composite aluminio
    metalness: 0.75,       // Cepillado metálico
    roughness: 0.32,       // Acabado cepillado
    frontalMetal: 0.5,
    frontalRough: 0.30,
    envMapIntensity: 0.9,
    description: 'Composite aluminio 3mm plano'
  },
  'dibond-sin-relieve': { 
    color: 0xE0E0E0,       // Composite aluminio plano
    metalness: 0.7,
    roughness: 0.35,
    frontalMetal: 0.45,
    frontalRough: 0.32,
    envMapIntensity: 0.8,
    description: 'Dibond plano 3mm recortado'
  },
  // Tipos de neón
  'neon-led': {
    color: 0xFFFFFF,
    metalness: 0.0,
    roughness: 0.2,
    emissive: 0xFFFFFF,
    emissiveIntensity: 0.5,
    envMapIntensity: 0.5,
    description: 'Neón LED flexible'
  },
  'neon-tradicional': {
    color: 0xFFFFFF,
    metalness: 0.0,
    roughness: 0.1,
    transparent: true,
    opacity: 0.9,
    envMapIntensity: 1.0,
    description: 'Neón tradicional de vidrio'
  }
};

/**
 * Crea un material PBR avanzado para un tipo específico
 * V31: Sistema PBR con texturas procedurales
 */
export function createPBRMaterial(type, color, options = {}) {
  const config = MATERIAL_CONFIGS[type] || MATERIAL_CONFIGS['aluminio-sin-luz'];
  
  // Material base según tipo
  const material = new THREE.MeshStandardMaterial({
    color: color || config.color,
    metalness: config.metalness,
    roughness: config.roughness,
    envMapIntensity: config.envMapIntensity,
    side: THREE.DoubleSide
  });

  // Propiedades específicas por tipo
  switch(type) {
    case 'metacrilato':
      material.transparent = true;
      material.opacity = options.opacity || config.opacity || 0.7;
      material.transmission = options.transmission || 0.9;
      material.thickness = options.thickness || 0.5;
      material.ior = 1.49; // Índice de refracción del metacrilato
      break;
      
    case 'neon-led':
      material.emissive = new THREE.Color(color || config.color);
      material.emissiveIntensity = options.emissiveIntensity || config.emissiveIntensity || 0.5;
      break;
      
    case 'neon-tradicional':
      material.transparent = true;
      material.opacity = 0.9;
      break;
  }

  return material;
}

/**
 * Crea los tres materiales necesarios para una extrusión
 * - frontMaterial: cara frontal con textura
 * - backMaterial: cara trasera
 * - sideMaterial: laterales
 */
export function createMaterial(corporeaType, frontTexture, luzColor) {
  const config = MATERIAL_CONFIGS[corporeaType] || MATERIAL_CONFIGS['aluminio-sin-luz'];
  
  // Material para laterales (material principal del tipo)
  const sideMaterial = new THREE.MeshStandardMaterial({
    color: config.color,
    metalness: config.metalness,
    roughness: config.roughness,
    transparent: config.transparent || false,
    opacity: config.opacity || 1,
    envMapIntensity: config.envMapIntensity,
    side: THREE.DoubleSide
  });
  
  // Configurar transmisión para metacrilato
  if (corporeaType === 'metacrilato') {
    sideMaterial.transparent = true;
    sideMaterial.opacity = 0.7;
    sideMaterial.transmission = 0.9;
    sideMaterial.thickness = 0.5;
    sideMaterial.ior = 1.49;
  }
  
  // Material frontal con textura
  const frontMaterial = new THREE.MeshStandardMaterial({
    map: frontTexture,
    transparent: true,
    alphaTest: 0.1,
    roughness: config.frontalRough !== undefined ? config.frontalRough : 0.5,
    metalness: config.frontalMetal !== undefined ? config.frontalMetal : 0.0,
    side: THREE.FrontSide
  });
  
  // Para metacrilato frontal también es transparente
  if (corporeaType === 'metacrilato') {
    frontMaterial.transparent = true;
    frontMaterial.opacity = 0.85;
    frontMaterial.roughness = 0.05;
  }
  
  // Material trasero (versión oscurecida del lateral)
  const backMaterial = new THREE.MeshStandardMaterial({
    color: config.color,
    metalness: config.metalness * 0.8,
    roughness: Math.min(1.0, config.roughness + 0.1),
    side: THREE.BackSide
  });
  
  // Aplicar color oscurecido
  const backColor = new THREE.Color(config.color);
  backColor.multiplyScalar(0.8);
  backMaterial.color = backColor;

  return {
    sideMaterial,
    frontMaterial,
    backMaterial,
    config
  };
}

/**
 * Genera texturas PBR procedurales
 * V31: Generadores de texturas para diferentes materiales
 */
export const PBRTextureGenerators = {
  /**
   * Genera un normal map para aluminio cepillado
   */
  createBrushedNormalMap(width = 512, height = 512, intensity = 0.3) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Crear líneas horizontales (cepillado)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    for (let i = 0; i < 100; i++) {
      const pos = Math.random();
      const alpha = 0.5 + Math.random() * 0.5;
      gradient.addColorStop(pos, `rgba(128, 128, ${255 * alpha}, 1)`);
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  },

  /**
   * Genera un mapa de rugosidad variable
   */
  createRoughnessMap(width = 512, height = 512, minRough = 0.2, maxRough = 0.4) {
    const size = width * height;
    const data = new Uint8Array(size);

    for (let i = 0; i < size; i++) {
      const noise = Math.random();
      const value = minRough + (maxRough - minRough) * noise;
      data[i] = Math.floor(value * 255);
    }

    const texture = new THREE.DataTexture(data, width, height, THREE.RedFormat);
    texture.needsUpdate = true;
    return texture;
  },

  /**
   * Genera una textura de madera procedural
   */
  createWoodTexture(width = 1024, height = 1024) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Base de madera
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, width, height);

    // Vetas
    for (let i = 0; i < 20; i++) {
      const y = (i / 20) * height;
      const offset = Math.sin(i * 0.5) * 30;

      ctx.strokeStyle = `rgba(101, 67, 33, ${0.3 + Math.random() * 0.3})`;
      ctx.lineWidth = 2 + Math.random() * 3;
      ctx.beginPath();
      ctx.moveTo(0, y + offset);
      for (let x = 0; x < width; x += 10) {
        const yOffset = Math.sin(x * 0.02 + i) * 5;
        ctx.lineTo(x, y + offset + yOffset);
      }
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  },

  /**
   * Genera un normal map de microtextura
   */
  createMicroTextureNormal(width = 512, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Fondo neutro
    ctx.fillStyle = 'rgb(128, 128, 255)';
    ctx.fillRect(0, 0, width, height);

    // Micro-rugosidad
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = 128 + (Math.random() - 0.5) * 20;
      const g = 128 + (Math.random() - 0.5) * 20;
      
      ctx.fillStyle = `rgb(${r}, ${g}, 255)`;
      ctx.fillRect(x, y, 2, 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }
};

/**
 * Sistema completo de materiales PBR
 * V31: Sistema avanzado con texturas procedurales
 */
export class PBRMaterialsSystem {
  static materials = new Map();
  static textures = new Map();

  /**
   * Crea un material PBR avanzado con texturas
   */
  static createPBRMaterial(type, baseColor, options = {}) {
    const cacheKey = `${type}-${baseColor}-${JSON.stringify(options)}`;
    
    if (this.materials.has(cacheKey)) {
      return this.materials.get(cacheKey);
    }

    const config = MATERIAL_CONFIGS[type] || MATERIAL_CONFIGS['aluminio-sin-luz'];
    
    // Crear material base
    const material = new THREE.MeshStandardMaterial({
      color: baseColor || config.color,
      metalness: config.metalness,
      roughness: config.roughness,
      envMapIntensity: config.envMapIntensity
    });

    // Añadir texturas según tipo
    switch(type) {
      case 'aluminio-sin-luz':
      case 'aluminio-con-luz':
      case 'aluminio-retroiluminada':
        // Normal map cepillado
        if (!this.textures.has('brushed-normal')) {
          this.textures.set('brushed-normal', 
            PBRTextureGenerators.createBrushedNormalMap(512, 512, 0.3)
          );
        }
        material.normalMap = this.textures.get('brushed-normal');
        material.normalScale.set(0.3, 0.3);
        break;

      case 'pvc':
      case 'pvc-retroiluminadas':
        // Microtextura para PVC
        if (!this.textures.has('pvc-normal')) {
          this.textures.set('pvc-normal',
            PBRTextureGenerators.createMicroTextureNormal(512, 512)
          );
        }
        material.normalMap = this.textures.get('pvc-normal');
        material.normalScale.set(0.3, 0.3);
        break;

      case 'metacrilato':
        // Propiedades de transmisión
        material.transparent = true;
        material.opacity = options.opacity || 0.7;
        material.transmission = options.transmission || 0.9;
        material.thickness = options.thickness || 0.5;
        material.ior = 1.49;
        material.clearcoat = 1.0;
        material.clearcoatRoughness = 0.1;
        break;
    }

    this.materials.set(cacheKey, material);
    return material;
  }

  /**
   * Limpia la caché de materiales
   */
  static dispose() {
    this.materials.forEach(material => material.dispose());
    this.textures.forEach(texture => texture.dispose());
    this.materials.clear();
    this.textures.clear();
  }
}

export default {
  MATERIAL_CONFIGS,
  createPBRMaterial,
  createMaterial,
  PBRTextureGenerators,
  PBRMaterialsSystem
};
