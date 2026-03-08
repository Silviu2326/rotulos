# Sistema Híbrido de Lonas - Implementación

## 📋 Resumen

Se ha implementado el sistema híbrido de generación de lonas basado en el sistema PHP de Rotulemos, adaptado para React + Node.js/Express.

## 🏗️ Arquitectura

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React App     │────▶│  Node.js/Express │────▶│   Ideogram API  │
│                 │     │    Backend       │     │                 │
│ - Generador     │◄────│ - ideogramService│◄────│ - Fondos sin    │
│   Lona Híbrida  │     │ - lonaRoutes     │     │   texto         │
│ - LonaCanvas    │     │                  │     │                 │
│   Editor        │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Canvas API    │
│ - Texto perfecto│
│ - Superposición │
│ - Exportación   │
└─────────────────┘
```

## 📁 Archivos Creados/Modificados

### Backend (Node.js/Express)

| Archivo | Descripción |
|---------|-------------|
| `src/services/ideogramService.js` | Servicio completo con diccionarios (18 tipos negocio, 10 estilos) |
| `src/routes/lonaRoutes.js` | Endpoints: `/generar-fondo`, `/generar-completa`, `/tipos-negocio`, `/estilos` |
| `src/server.js` | Actualizado para incluir rutas de lonas |
| `package.json` | Añadida dependencia `axios` |

### Frontend (React)

| Archivo | Descripción |
|---------|-------------|
| `src/services/lonaService.js` | Cliente API para comunicarse con backend |
| `src/pages/NeonEditorPage/components/LonaCanvasEditor.jsx` | Editor Canvas para superponer texto |
| `src/pages/NeonEditorPage/components/GeneradorLonaHibrida.jsx` | Flujo completo 3 pasos |
| `src/pages/NeonEditorPage/hooks/useNeonEditor.js` | Añadidos estados para sistema híbrido |
| `src/pages/NeonEditorPage/components/Paso3Estilo.jsx` | Toggle para activar sistema híbrido |
| `src/pages/NeonEditorPage/index.jsx` | Integración del modal y lógica de generación |

## 🔧 Configuración

### Variables de Entorno (Backend)

```bash
# .env
IDEOGRAM_API_KEY=tu_api_key_de_ideogram
```

Obtén tu API key en: https://ideogram.ai/manage-api

### Instalación de Dependencias

```bash
# Backend
cd backend
npm install  # Instalará axios automáticamente

# Frontend (si es necesario)
cd ..
npm install
```

## 🚀 Endpoints API

### POST `/api/v1/lonas/generar-fondo`
Genera fondos decorativos sin texto usando Ideogram.

**Request:**
```json
{
  "tipoNegocio": "restaurante",
  "estilo": "moderno",
  "colores": ["#9333ea", "#fbbf24"],
  "orientacion": "horizontal",
  "cantidad": 4
}
```

**Response:**
```json
{
  "success": true,
  "imagenes": [
    { "url": "https://ideogram.ai/...", "tipo": "fondo-lona" },
    ...
  ],
  "promptUsado": "Professional advertising banner background...",
  "config": { "tipoNegocio": "restaurante", ... }
}
```

### POST `/api/v1/lonas/generar-completa`
Genera fondos + config para Canvas.

### GET `/api/v1/lonas/tipos-negocio`
Lista los 20 tipos de negocio disponibles.

### GET `/api/v1/lonas/estilos`
Lista los 10 estilos visuales disponibles.

## 🎨 Tipos de Negocio Soportados

1. Restaurante 🍽️
2. Bar 🍻
3. Cafetería ☕
4. Panadería 🥐
5. Peluquería 💇
6. Gimnasio 💪
7. Tienda de Ropa 👕
8. Inmobiliaria 🏠
9. Construcción 🏗️
10. Taller Mecánico 🔧
11. Clínica Dental 🦷
12. Veterinaria 🐾
13. Florería 🌸
14. Tecnología 💻
15. Educación 📚
16. Fiesta/Eventos 🎉
17. Música 🎵
18. Deportes ⚽
19. Viajes ✈️
20. General 🏪

## 🎭 Estilos Visuales

1. Moderno
2. Festivo
3. Elegante
4. Dinámico
5. Natural
6. Retro
7. Minimalista
8. Corporativo
9. Infantil
10. Tech

## 💡 Flujo de Uso

1. **Usuario selecciona** categoría "Lonas/Pancartas"
2. **En Paso 3** aparece toggle "Sistema Híbrido de Lonas"
3. **Si activa** el sistema híbrido y hace clic en "Generar Diseño"
4. **Se abre** el `GeneradorLonaHibrida` con 3 pasos:
   - Paso 1: Configurar (tipo negocio, estilo, colores, orientación)
   - Paso 2: Seleccionar fondo de 4 generados por Ideogram
   - Paso 3: Editar texto con `LonaCanvasEditor`
5. **Resultado**: Imagen PNG lista para imprimir

## ⚠️ Consideraciones

- **API Key**: Necesaria para que funcione Ideogram
- **Rate Limiting**: Ideogram tiene límites de generación
- **Imágenes**: Las URLs de Ideogram expiran después de un tiempo
- **CORS**: El backend maneja las llamadas a Ideogram para evitar CORS

## 🔍 Comparación con Sistema PHP

| Característica | PHP Original | Node.js/React |
|----------------|--------------|---------------|
| APIs de IA | Stability, Replicate, Ideogram | Ideogram (lonas) |
| Sistema híbrido | ✅ Ideogram + Canvas | ✅ Implementado |
| Tipos de negocio | 18 | 20 (añadidos bar y general) |
| Estilos visuales | 10 | 10 |
| Variaciones | 4 | 4 (configurable) |
| Editor Canvas | PHP + JS | React Component |

## 📞 Soporte

Para problemas con la API de Ideogram, verifica:
1. Que `IDEOGRAM_API_KEY` esté configurada
2. Que la API key sea válida y no haya expirado
3. Los logs del backend para errores específicos
