/**
 * ============================================================================
 * MARCHING SQUARES - Detección de contornos y huecos
 * ============================================================================
 * 
 * Algoritmo profesional para extraer formas de imágenes binarias
 * Detecta contornos externos y huecos internos (para letras como O, R, a, e)
 */

/**
 * Encuentra contornos externos y huecos en una imagen binaria
 * @param {number[][]} binary - Matriz binaria (1 = opaco, 0 = transparente)
 * @param {number} width - Ancho de la imagen
 * @param {number} height - Alto de la imagen
 * @returns {Object} { outerContours: [], holes: [] }
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
    if (binary[0][x] === 0) { 
      queue.push({x, y: 0}); 
      exterior[0][x] = true; 
    }
    if (binary[height-1][x] === 0) { 
      queue.push({x, y: height-1}); 
      exterior[height-1][x] = true; 
    }
  }
  for (let y = 0; y < height; y++) {
    if (binary[y][0] === 0) { 
      queue.push({x: 0, y}); 
      exterior[y][0] = true; 
    }
    if (binary[y][width-1] === 0) { 
      queue.push({x: width-1, y}); 
      exterior[y][width-1] = true; 
    }
  }

  // Flood fill para marcar todo el exterior
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

  // Encontrar huecos (transparentes que NO son exteriores)
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
 * @param {number[][]} binary - Matriz binaria
 * @param {boolean[][]} visited - Matriz de visitados
 * @param {number} startX - X inicial
 * @param {number} startY - Y inicial
 * @param {number} w - Ancho
 * @param {number} h - Alto
 * @returns {Array<{x:number, y:number}>} Contorno
 */
function traceOuterContour(binary, visited, startX, startY, w, h) {
  const contour = [];
  // 8 direcciones: E, NE, N, NW, W, SW, S, SE
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
        prevDir = (dir + 5) % 8; // Ajustar dirección de búsqueda
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
 * Trazar contorno de hueco interno
 * @param {number[][]} binary - Matriz binaria
 * @param {boolean[][]} visited - Matriz de visitados
 * @param {number} startX - X inicial
 * @param {number} startY - Y inicial
 * @param {number} w - Ancho
 * @param {number} h - Alto
 * @returns {Array<{x:number, y:number}>} Contorno del hueco
 */
function traceHoleContour(binary, visited, startX, startY, w, h) {
  const contour = [];
  // 8 direcciones en sentido HORARIO para huecos
  const dx8 = [1, 1, 0, -1, -1, -1, 0, 1];
  const dy8 = [0, 1, 1, 1, 0, -1, -1, -1];

  let x = startX, y = startY;
  let prevDir = 0;
  let steps = 0;
  const maxSteps = Math.max(w, h) * 4;

  do {
    contour.push({x, y});
    visited[y][x] = true;

    let found = false;
    for (let i = 0; i < 8; i++) {
      const dir = (prevDir + i) % 8;
      const nx = x + dx8[dir];
      const ny = y + dy8[dir];

      if (nx >= 0 && nx < w && ny >= 0 && ny < h && binary[ny][nx] === 0) {
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
 * Calcular área con signo de un contorno
 * Área positiva = sentido antihorario (CCW)
 * Área negativa = sentido horario (CW)
 * @param {Array<{x:number, y:number}>} contour 
 * @returns {number} Área con signo
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

/**
 * Verificar si un punto está dentro de un contorno
 * @param {number} x 
 * @param {number} y 
 * @param {Array<{x:number, y:number}>} contour 
 * @returns {boolean}
 */
export function isPointInContour(x, y, contour) {
  let inside = false;
  for (let i = 0, j = contour.length - 1; i < contour.length; j = i++) {
    const xi = contour[i].x, yi = contour[i].y;
    const xj = contour[j].x, yj = contour[j].y;
    
    const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Obtener bounding box de un contorno
 * @param {Array<{x:number, y:number}>} contour 
 * @returns {{minX:number, maxX:number, minY:number, maxY:number}}
 */
export function getContourBBox(contour) {
  const xs = contour.map(p => p.x);
  const ys = contour.map(p => p.y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys)
  };
}

/**
 * Verificar si un bbox está dentro de otro
 * @param {Object} inner - BBox interior
 * @param {Object} outer - BBox exterior
 * @returns {boolean}
 */
export function isInsideBBox(inner, outer) {
  return inner.minX >= outer.minX && 
         inner.maxX <= outer.maxX && 
         inner.minY >= outer.minY && 
         inner.maxY <= outer.maxY;
}

export default {
  findContoursWithHoles,
  calculateContourArea,
  isPointInContour,
  getContourBBox,
  isInsideBBox
};
