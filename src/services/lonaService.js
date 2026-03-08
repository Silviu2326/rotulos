/**
 * ============================================================================
 * LONA SERVICE - Cliente API para sistema híbrido de lonas
 * ============================================================================
 * 
 * Servicio para comunicarse con el backend de lonas (Ideogram + Canvas)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Generar fondos de lona con Ideogram
 */
export async function generarFondosLona({
  tipoNegocio = 'general',
  estilo = 'moderno',
  colores = ['#9333ea', '#fbbf24'],
  orientacion = 'horizontal',
  cantidad = 4
}) {
  const response = await fetch(`${API_BASE_URL}/lonas/generar-fondo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tipoNegocio,
      estilo,
      colores,
      orientacion,
      cantidad
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error generando fondos');
  }

  return response.json();
}

/**
 * Generar lona completa (fondo + configuración Canvas)
 */
export async function generarLonaCompleta({
  // Datos para el fondo
  tipoNegocio = 'general',
  estilo = 'moderno',
  colores = ['#9333ea', '#fbbf24'],
  orientacion = 'horizontal',
  
  // Datos para el texto
  nombreNegocio,
  textoAdicional = '',
  textoSecundario = '',
  tipografia = 'Arial',
  colorTexto = '#FFFFFF',
  colorTextoSecundario = '#FFFFFF',
  
  // Opciones
  logo = null
}) {
  const response = await fetch(`${API_BASE_URL}/lonas/generar-completa`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tipoNegocio,
      estilo,
      colores,
      orientacion,
      nombreNegocio,
      textoAdicional,
      textoSecundario,
      tipografia,
      colorTexto,
      colorTextoSecundario,
      logo
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error generando lona');
  }

  return response.json();
}

/**
 * Obtener tipos de negocio disponibles
 */
export async function getTiposNegocio() {
  const response = await fetch(`${API_BASE_URL}/lonas/tipos-negocio`);
  
  if (!response.ok) {
    throw new Error('Error obteniendo tipos de negocio');
  }
  
  return response.json();
}

/**
 * Obtener estilos visuales disponibles
 */
export async function getEstilosVisuales() {
  const response = await fetch(`${API_BASE_URL}/lonas/estilos`);
  
  if (!response.ok) {
    throw new Error('Error obteniendo estilos');
  }
  
  return response.json();
}

/**
 * Previsualizar prompt (debug)
 */
export async function previewPrompt(config) {
  const response = await fetch(`${API_BASE_URL}/lonas/preview-prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    throw new Error('Error en preview');
  }

  return response.json();
}

// Exportar todas las funciones
export default {
  generarFondosLona,
  generarLonaCompleta,
  getTiposNegocio,
  getEstilosVisuales,
  previewPrompt
};
