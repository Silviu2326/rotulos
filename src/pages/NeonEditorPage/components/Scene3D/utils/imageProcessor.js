/**
 * ============================================================================
 * IMAGE PROCESSOR - Procesamiento de imágenes para Scene3D
 * ============================================================================
 * 
 * Detecta y elimina fondos de color sólido de imágenes generadas por IA
 * Permite usar imágenes de Gemini/Ideogram sin fondo transparente
 */

/**
 * Detecta el color de fondo dominante de una imagen
 * Analiza los bordes y esquinas para determinar el color de fondo
 */
export function detectBackgroundColor(pixels, width, height) {
  const borderPixels = [];
  const sampleStep = 5; // Muestrear cada 5 píxeles para performance
  
  // Muestrear bordes superior e inferior
  for (let x = 0; x < width; x += sampleStep) {
    // Borde superior
    let i = (0 * width + x) * 4;
    borderPixels.push({ r: pixels[i], g: pixels[i + 1], b: pixels[i + 2], a: pixels[i + 3] });
    
    // Borde inferior
    i = ((height - 1) * width + x) * 4;
    borderPixels.push({ r: pixels[i], g: pixels[i + 1], b: pixels[i + 2], a: pixels[i + 3] });
  }
  
  // Muestrear bordes izquierdo y derecho
  for (let y = 0; y < height; y += sampleStep) {
    // Borde izquierdo
    let i = (y * width + 0) * 4;
    borderPixels.push({ r: pixels[i], g: pixels[i + 1], b: pixels[i + 2], a: pixels[i + 3] });
    
    // Borde derecho
    i = (y * width + (width - 1)) * 4;
    borderPixels.push({ r: pixels[i], g: pixels[i + 1], b: pixels[i + 2], a: pixels[i + 3] });
  }
  
  // Encontrar el color más común en los bordes
  const colorCounts = new Map();
  
  borderPixels.forEach(p => {
    // Redondear colores para agrupar similares
    const key = `${Math.round(p.r / 10) * 10},${Math.round(p.g / 10) * 10},${Math.round(p.b / 10) * 10}`;
    colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
  });
  
  // Encontrar el color más frecuente
  let maxCount = 0;
  let bgColor = { r: 255, g: 255, b: 255 }; // Default blanco
  
  colorCounts.forEach((count, key) => {
    if (count > maxCount) {
      maxCount = count;
      const [r, g, b] = key.split(',').map(Number);
      bgColor = { r, g, b };
    }
  });
  
  // Calcular tolerancia basada en la variación del color de fondo
  let variance = 0;
  borderPixels.forEach(p => {
    variance += Math.abs(p.r - bgColor.r) + Math.abs(p.g - bgColor.g) + Math.abs(p.b - bgColor.b);
  });
  variance /= borderPixels.length;
  
  // Tolerancia: máximo entre 30 y la varianza calculada
  const tolerance = Math.max(30, Math.min(variance * 1.5, 80));
  
  return { color: bgColor, tolerance };
}

/**
 * Crea una máscara binaria a partir de una imagen, tratando el fondo como transparente
 */
export function createBinaryMask(pixels, width, height, bgColor, tolerance) {
  const binary = [];
  const toleranceSq = tolerance * tolerance;
  
  for (let y = 0; y < height; y++) {
    binary[y] = [];
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];
      
      // Si el alpha es muy bajo, considerar transparente
      if (a < 50) {
        binary[y][x] = 0;
        continue;
      }
      
      // Calcular distancia al color de fondo
      const distSq = (r - bgColor.r) ** 2 + (g - bgColor.g) ** 2 + (b - bgColor.b) ** 2;
      
      // Si está dentro de la tolerancia, es fondo (0)
      // Si está fuera, es objeto (1)
      binary[y][x] = distSq > toleranceSq ? 1 : 0;
    }
  }
  
  return binary;
}

/**
 * Procesa una imagen para eliminar el fondo automáticamente
 * Devuelve los datos procesados listos para marching squares
 */
export function processImageWithAutoBackgroundRemoval(img) {
  const canvas = document.createElement('canvas');
  const maxSize = 1600;
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const w = Math.floor(img.width * scale);
  const h = Math.floor(img.height * scale);
  
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  
  const imgData = ctx.getImageData(0, 0, w, h);
  const pixels = imgData.data;
  
  // Detectar color de fondo
  const { color: bgColor, tolerance } = detectBackgroundColor(pixels, w, h);
  console.log('🎨 Color de fondo detectado:', `rgb(${bgColor.r},${bgColor.g},${bgColor.b})`, '| Tolerancia:', tolerance.toFixed(1));
  
  // Crear máscara binaria
  const binary = createBinaryMask(pixels, w, h, bgColor, tolerance);
  
  return {
    pixels,
    binary,
    width: w,
    height: h,
    scale,
    bgColor,
    tolerance
  };
}

/**
 * Preprocesa la imagen para mejorar la detección de contornos
 * Aplica operaciones morfológicas básicas para limpiar ruido
 */
export function preprocessBinaryImage(binary, width, height) {
  // Crear copia para no modificar la original
  const processed = binary.map(row => [...row]);
  
  // Operación de apertura (erosión seguida de dilatación) para eliminar ruido
  const eroded = applyErosion(processed, width, height);
  const opened = applyDilation(eroded, width, height);
  
  return opened;
}

/**
 * Aplica erosión morfológica
 */
function applyErosion(binary, width, height) {
  const result = binary.map(row => [...row]);
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      // Si algún vecino es 0, erosionar a 0
      let minVal = 1;
      for (let dy = -1; dy <= 1 && minVal === 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (binary[y + dy][x + dx] === 0) {
            minVal = 0;
            break;
          }
        }
      }
      result[y][x] = minVal;
    }
  }
  
  return result;
}

/**
 * Aplica dilatación morfológica
 */
function applyDilation(binary, width, height) {
  const result = binary.map(row => [...row]);
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      // Si algún vecino es 1, dilatar a 1
      let maxVal = 0;
      for (let dy = -1; dy <= 1 && maxVal === 0; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (binary[y + dy][x + dx] === 1) {
            maxVal = 1;
            break;
          }
        }
      }
      result[y][x] = maxVal;
    }
  }
  
  return result;
}

/**
 * Verifica si una imagen ya tiene canal alpha (transparencia real)
 */
export function hasRealTransparency(pixels, width, height) {
  let transparentPixels = 0;
  let totalPixels = width * height;
  
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] < 255) {
      transparentPixels++;
    }
  }
  
  // Si más del 5% de los píxeles son transparentes, considerar que ya tiene alpha
  return (transparentPixels / totalPixels) > 0.05;
}

/**
 * Detecta si una imagen es probablemente de neón (fondo oscuro, colores brillantes)
 */
function isLikelyNeonImage(bgColor, pixels, width, height) {
  // Fondo oscuro indica posible neón
  if (bgColor.r > 80 || bgColor.g > 80 || bgColor.b > 80) {
    return false;
  }
  
  // Muestrear colores no-fondo para ver si son brillantes (neón)
  let brightPixels = 0;
  let totalSampled = 0;
  const sampleStep = 10;
  
  for (let y = 0; y < height; y += sampleStep) {
    for (let x = 0; x < width; x += sampleStep) {
      const i = (y * width + x) * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      // Si no es fondo (color diferente al fondo oscuro)
      const distToBg = Math.sqrt((r - bgColor.r)**2 + (g - bgColor.g)**2 + (b - bgColor.b)**2);
      if (distToBg > 60) {
        totalSampled++;
        // Colores brillantes = alta saturación o luminosidad
        const brightness = (r + g + b) / 3;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max === 0 ? 0 : (max - min) / max;
        
        if (brightness > 100 || saturation > 0.5) {
          brightPixels++;
        }
      }
    }
  }
  
  const ratio = totalSampled > 0 ? brightPixels / totalSampled : 0;
  console.log(`🔆 Análisis neón: ${(ratio * 100).toFixed(1)}% píxeles brillantes`);
  return ratio > 0.6; // Si más del 60% son brillantes, probablemente es neón
}

/**
 * Procesa la imagen completa con todas las optimizaciones
 * @param {HTMLImageElement} img - Imagen a procesar
 * @param {Object} options - Opciones de procesamiento
 * @param {boolean} options.skipMorphology - Saltar operaciones morfológicas (para neón)
 * @param {number} options.maxSize - Tamaño máximo (default 1600)
 */
export function processImageForScene3D(img, options = {}) {
  const { skipMorphology = false, maxSize = 1600 } = options;
  
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const w = Math.floor(img.width * scale);
  const h = Math.floor(img.height * scale);
  
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  
  const imgData = ctx.getImageData(0, 0, w, h);
  const pixels = imgData.data;
  
  // Verificar si ya tiene transparencia
  if (hasRealTransparency(pixels, w, h)) {
    console.log('✅ Imagen ya tiene canal alpha, usando transparencia nativa');
    
    // Crear matriz binaria basada en alpha
    const binary = [];
    for (let y = 0; y < h; y++) {
      binary[y] = [];
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        binary[y][x] = pixels[i + 3] > 100 ? 1 : 0;
      }
    }
    
    return { pixels, binary, width: w, height: h, scale, hasTransparency: true };
  }
  
  // Si no tiene transparencia, detectar y eliminar fondo
  console.log('🔄 Imagen sin transparencia, detectando fondo automáticamente...');
  const { color: bgColor, tolerance } = detectBackgroundColor(pixels, w, h);
  let binary = createBinaryMask(pixels, w, h, bgColor, tolerance);
  
  // Detectar si es imagen de neón
  const likelyNeon = isLikelyNeonImage(bgColor, pixels, w, h);
  const shouldSkipMorphology = skipMorphology || likelyNeon;
  
  if (shouldSkipMorphology) {
    console.log('✨ Modo NEÓN detectado: saltando operaciones morfológicas');
  } else {
    // Aplicar preprocesamiento para limpiar ruido (solo para no-neón)
    console.log('🧹 Aplicando limpieza morfológica');
    binary = preprocessBinaryImage(binary, w, h);
  }
  
  return {
    pixels,
    binary,
    width: w,
    height: h,
    scale,
    bgColor,
    tolerance,
    hasTransparency: false,
    isLikelyNeon: likelyNeon
  };
}

export default {
  detectBackgroundColor,
  createBinaryMask,
  processImageWithAutoBackgroundRemoval,
  preprocessBinaryImage,
  hasRealTransparency,
  processImageForScene3D
};
