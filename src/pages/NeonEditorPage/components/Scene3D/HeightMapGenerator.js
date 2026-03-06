/**
 * ============================================================================
 * GENERADOR DE MAPA DE ALTURA DESDE IMAGEN
 * Analiza la imagen del rótulo para crear geometría 3D con relieve
 * ============================================================================
 */

export class HeightMapGenerator {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  /**
   * Analiza una imagen y genera datos de altura para geometría 3D
   * @param {string} imageUrl - URL o base64 de la imagen
   * @param {Object} options - Opciones de análisis
   * @returns {Promise<Object>} - Datos del mapa de altura y geometría
   */
  async analyzeImage(imageUrl, options = {}) {
    const {
      threshold = 128,       // Umbral para considerar un píxel como parte del rótulo
      smoothness = 0.5,      // Suavizado del relieve (0-1)
      extrusionDepth = 0.3,  // Profundidad máxima de extrusión en unidades 3D
      resolution = 64        // Resolución de la malla (mayor = más detalle pero más lento)
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          // Calcular dimensiones manteniendo proporción
          const aspectRatio = img.width / img.height;
          const width = Math.min(resolution, 128);
          const height = Math.floor(width / aspectRatio);
          
          this.canvas.width = width;
          this.canvas.height = height;
          
          // Dibujar imagen reducida
          this.ctx.drawImage(img, 0, 0, width, height);
          
          // Obtener datos de píxeles
          const imageData = this.ctx.getImageData(0, 0, width, height);
          const pixels = imageData.data;
          
          // Generar mapa de altura
          const heightMap = [];
          const geometryData = [];
          
          for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
              const index = (y * width + x) * 4;
              
              // Calcular brillo (luminancia ponderada)
              const r = pixels[index];
              const g = pixels[index + 1];
              const b = pixels[index + 2];
              const alpha = pixels[index + 3];
              
              // Si es transparente, altura 0
              if (alpha < 10) {
                row.push(0);
                continue;
              }
              
              // Calcular brillo percibido
              const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
              
              // Normalizar y aplicar umbral
              let heightValue = 0;
              if (brightness > threshold) {
                // Normalizar entre 0 y 1
                heightValue = (brightness - threshold) / (255 - threshold);
                // Aplicar curva de potencia para suavizar
                heightValue = Math.pow(heightValue, 1 - smoothness * 0.5);
                // Escalar a profundidad deseada
                heightValue *= extrusionDepth;
              }
              
              row.push(heightValue);
              
              // Si hay altura significativa, agregar a geometría
              if (heightValue > 0.01) {
                geometryData.push({
                  x: (x / width - 0.5) * 4, // Escala a unidades 3D
                  y: -(y / height - 0.5) * (4 / aspectRatio), // Invertir Y
                  z: heightValue,
                  u: x / width,
                  v: y / height
                });
              }
            }
            heightMap.push(row);
          }
          
          // Detectar bordes para crear geometría de contorno
          const contours = this.detectContours(heightMap, width, height);
          
          resolve({
            heightMap,
            geometryData,
            contours,
            dimensions: { width: 4, height: 4 / aspectRatio, depth: extrusionDepth },
            resolution: { width, height },
            aspectRatio
          });
          
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = reject;
      img.src = imageUrl;
    });
  }

  /**
   * Detecta contornos en el mapa de altura
   */
  detectContours(heightMap, width, height) {
    const contours = [];
    const visited = new Set();
    
    const getKey = (x, y) => `${x},${y}`;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const key = getKey(x, y);
        if (visited.has(key)) continue;
        
        const height = heightMap[y][x];
        if (height > 0.01) {
          // Encontrar contorno usando flood fill
          const contour = this.floodFill(heightMap, x, y, width, height, visited);
          if (contour.length > 5) { // Ignorar contornos muy pequeños
            contours.push(contour);
          }
        }
      }
    }
    
    return contours;
  }

  /**
   * Flood fill para encontrar contornos conectados
   */
  floodFill(heightMap, startX, startY, width, height, visited) {
    const contour = [];
    const stack = [[startX, startY]];
    const getKey = (x, y) => `${x},${y}`;
    
    while (stack.length > 0) {
      const [x, y] = stack.pop();
      const key = getKey(x, y);
      
      if (visited.has(key)) continue;
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      if (heightMap[y][x] <= 0.01) continue;
      
      visited.add(key);
      contour.push({ x, y, height: heightMap[y][x] });
      
      // Agregar vecinos
      stack.push([x + 1, y]);
      stack.push([x - 1, y]);
      stack.push([x, y + 1]);
      stack.push([x, y - 1]);
    }
    
    return contour;
  }

  /**
   * Genera geometría de extrusión para Three.js
   */
  generateExtrudedGeometry(heightMapData) {
    const { contours, dimensions, aspectRatio } = heightMapData;
    const geometry = {
      vertices: [],
      normals: [],
      uvs: [],
      indices: []
    };
    
    let vertexIndex = 0;
    
    // Para cada contorno, crear geometría extruida
    contours.forEach((contour, contourIndex) => {
      if (contour.length < 3) return;
      
      // Calcular centro del contorno
      const centerX = contour.reduce((sum, p) => sum + p.x, 0) / contour.length;
      const centerY = contour.reduce((sum, p) => sum + p.y, 0) / contour.length;
      
      // Crear vértices para la cara superior e inferior
      const baseVertices = [];
      
      contour.forEach(point => {
        // Normalizar coordenadas
        const nx = (point.x / heightMapData.resolution.width - 0.5) * dimensions.width;
        const ny = -(point.y / heightMapData.resolution.height - 0.5) * dimensions.height;
        const nz = point.height * dimensions.depth;
        
        // Vértice superior
        geometry.vertices.push(nx, ny, nz);
        geometry.normals.push(0, 0, 1);
        geometry.uvs.push(point.x / heightMapData.resolution.width, point.y / heightMapData.resolution.height);
        baseVertices.push(vertexIndex++);
        
        // Vértice inferior (base)
        geometry.vertices.push(nx, ny, 0);
        geometry.normals.push(0, 0, -1);
        geometry.uvs.push(point.x / heightMapData.resolution.width, point.y / heightMapData.resolution.height);
        vertexIndex++;
      });
      
      // Crear índices para triángulos
      for (let i = 0; i < baseVertices.length - 1; i++) {
        const top1 = baseVertices[i];
        const bottom1 = baseVertices[i] + 1;
        const top2 = baseVertices[i + 1];
        const bottom2 = baseVertices[i + 1] + 1;
        
        // Cara lateral
        geometry.indices.push(top1, bottom1, top2);
        geometry.indices.push(bottom1, bottom2, top2);
      }
    });
    
    return geometry;
  }
}

export default HeightMapGenerator;
