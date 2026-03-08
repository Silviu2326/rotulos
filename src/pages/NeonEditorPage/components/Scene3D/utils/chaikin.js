/**
 * ============================================================================
 * CHAIKIN SMOOTHING - Suavizado de curvas
 * ============================================================================
 * 
 * Algoritmo de Chaikin para crear curvas ultra-suaves a partir de contornos
 * 6 iteraciones para eliminar completamente los dientes de sierra
 */

/**
 * Aplica el algoritmo de Chaikin para suavizar un contorno
 * Crea nuevos puntos en 1/4 y 3/4 entre cada par de puntos
 * 
 * @param {Array<{x:number, y:number}>} points - Puntos del contorno
 * @param {number} iterations - Número de iteraciones (default: 6)
 * @returns {Array<{x:number, y:number}>} Contorno suavizado
 */
export function chaikinSmooth(points, iterations = 6) {
  if (!points || points.length < 3) return points;
  
  let result = [...points];
  
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
 * Útil como pre-procesado antes de Chaikin
 * 
 * @param {Array<{x:number, y:number}>} points - Puntos del contorno
 * @param {number} windowSize - Tamaño de la ventana (default: 5)
 * @returns {Array<{x:number, y:number}>} Contorno suavizado
 */
export function movingAverageSmooth(points, windowSize = 5) {
  if (!points || points.length < windowSize) return points;
  
  const result = [];
  const half = Math.floor(windowSize / 2);
  
  for (let i = 0; i < points.length; i++) {
    let sumX = 0, sumY = 0, count = 0;
    
    // Promediar con vecinos (circular)
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

/**
 * Simplificación de contorno usando distancia mínima entre puntos
 * Reduce el número de puntos manteniendo la forma
 * 
 * @param {Array<{x:number, y:number}>} points - Puntos del contorno
 * @param {number} minDistance - Distancia mínima entre puntos
 * @returns {Array<{x:number, y:number}>} Contorno simplificado
 */
export function simplifyContour(points, minDistance = 2) {
  if (!points || points.length <= 2) return points;
  
  const result = [points[0]];
  let lastAdded = 0;
  
  for (let i = 1; i < points.length - 1; i++) {
    const dist = Math.sqrt(
      Math.pow(points[i].x - points[lastAdded].x, 2) +
      Math.pow(points[i].y - points[lastAdded].y, 2)
    );
    
    if (dist >= minDistance) {
      result.push(points[i]);
      lastAdded = i;
    }
  }
  
  // Añadir último punto si es diferente al primero
  const lastPoint = points[points.length - 1];
  const distToFirst = Math.sqrt(
    Math.pow(lastPoint.x - result[0].x, 2) +
    Math.pow(lastPoint.y - result[0].y, 2)
  );
  
  if (distToFirst > minDistance) {
    result.push(lastPoint);
  }
  
  return result;
}

/**
 * Suavizado completo: Media móvil + Chaikin + Simplificación
 * Pipeline completo para preparar contornos para Three.js
 * 
 * @param {Array<{x:number, y:number}>} points - Puntos originales
 * @returns {Array<{x:number, y:number}>} Contorno listo para extrusión
 */
export function fullSmoothPipeline(points) {
  if (!points || points.length < 4) return points;
  
  // Paso 1: Pre-suavizado con media móvil
  let smoothed = movingAverageSmooth(points, 5);
  
  // Paso 2: Suavizado Chaikin (6 iteraciones)
  smoothed = chaikinSmooth(smoothed, 6);
  
  // Paso 3: Simplificación final
  smoothed = simplifyContour(smoothed, 1);
  
  return smoothed;
}

export default {
  chaikinSmooth,
  movingAverageSmooth,
  simplifyContour,
  fullSmoothPipeline
};
