/**
 * ============================================================================
 * SCENE3D - Exportaciones
 * Sistema 3D para Letras Corpóreas con React Three Fiber
 * ============================================================================
 */

// Componente principal
export { default as Scene3D } from './index.jsx';

// Componentes R3F individuales
export { ExtrudedDesign, Room, Lighting } from './components/ExtrudedShape';
export { PostProcessing, NeonPostProcessing } from './components/PostProcessing';

// Utilidades
export { findContoursWithHoles, calculateContourArea } from './utils/marchingSquares';
export { chaikinSmooth, movingAverageSmooth } from './utils/chaikin';
export { createPBRMaterial, createMaterial, MATERIAL_CONFIGS, PBRMaterialsSystem, PBRTextureGenerators } from './utils/materials';
export { 
  detectBackgroundColor, 
  createBinaryMask, 
  processImageForScene3D,
  hasRealTransparency 
} from './utils/imageProcessor';

// Tipos de materiales exportados para referencia
export const MATERIAL_TYPES = {
  ALUMINIO_SIN_LUZ: 'aluminio-sin-luz',
  PVC: 'pvc',
  METACRILATO: 'metacrilato',
  ALUMINIO_CON_LUZ: 'aluminio-con-luz',
  METAL_DORADO: 'metal-dorado',
  METAL_COBRE: 'metal-cobre',
  METAL_BRONCE: 'metal-bronce'
};

// Colores de luz disponibles
export const LUZ_COLORS = {
  BLANCO_FRIO: 'blanco-frio',
  BLANCO_CALIDO: 'blanco-calido',
  AZUL: 'azul',
  ROJO: 'rojo',
  VERDE: 'verde',
  SIN_LUZ: 'sin-luz'
};

// Tipos de pared
export const WALL_TYPES = {
  WHITE_WALL: 'white-wall',
  BRICK_WALL: 'brick-wall',
  WOOD_WALL: 'wood-wall',
  CONCRETE_WALL: 'concrete-wall',
  DARK_WALL: 'dark-wall'
};

// Exportar constantes de configuración
export const CONFIG = {
  MIN_CONTOUR_AREA: 50,        // Área mínima en píxeles
  MIN_CONTOUR_LENGTH: 8,       // Puntos mínimos
  CHAIKIN_ITERATIONS: 6,       // Iteraciones de suavizado
  MOVING_AVERAGE_WINDOW: 5,    // Ventana de media móvil
  DEPTH_FACTOR: 83,            // Factor de conversión cm → unidades 3D
  BEVEL_THICKNESS_FACTOR: 0.1, // Factor de bevel
  BEVEL_SIZE_FACTOR: 0.05,     // Factor de tamaño bevel
  CURVE_SEGMENTS: 16           // Segmentos de curva
};
