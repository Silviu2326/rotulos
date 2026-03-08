/**
 * ============================================================================
 * HOOK: useThreeJS
 * ============================================================================
 * 
 * Inicialización de escena Three.js con iluminación profesional
 * Basado en el sistema del diseñador PHP de Rotulemos
 */

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

export const useThreeJS = (canvasRef, containerRef) => {
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const composerRef = useRef(null);
  const animationIdRef = useRef(null);

  /**
   * Inicializar escena Three.js
   */
  const initScene = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) {
      console.error('Canvas o container no encontrado');
      return null;
    }

    // Escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a12);
    sceneRef.current = scene;

    // Cámara
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 10);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    console.log('✅ Three.js inicializado');
    return { scene, camera, renderer };
  }, [canvasRef, containerRef]);

  /**
   * Iluminación Three-Point profesional
   */
  const initLighting = useCallback((scene) => {
    if (!scene) return;

    // 1. Key Light - Luz principal dramática
    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.5);
    keyLight.position.set(5, 8, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 4096;
    keyLight.shadow.mapSize.height = 4096;
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.camera.left = -15;
    keyLight.shadow.camera.right = 15;
    keyLight.shadow.camera.top = 15;
    keyLight.shadow.camera.bottom = -15;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    keyLight.shadow.radius = 3;
    keyLight.name = 'KeyLight';
    scene.add(keyLight);

    // 2. Fill Light - Luz de relleno suave
    const fillLight = new THREE.DirectionalLight(0xB0C4DE, 0.8);
    fillLight.position.set(-6, 5, 4);
    fillLight.name = 'FillLight';
    scene.add(fillLight);

    // 3. Rim Light - Luz de contorno
    const rimLight = new THREE.SpotLight(0xFFFFFF, 1.5);
    rimLight.position.set(0, 4, -8);
    rimLight.angle = Math.PI / 6;
    rimLight.penumbra = 0.3;
    rimLight.decay = 2;
    rimLight.distance = 30;
    rimLight.name = 'RimLight';
    scene.add(rimLight);

    // 4. Accent Lights
    const accentLight1 = new THREE.PointLight(0xFFD700, 0.5, 20);
    accentLight1.position.set(-4, 2, 3);
    accentLight1.name = 'AccentLight1';
    scene.add(accentLight1);

    const accentLight2 = new THREE.PointLight(0x4169E1, 0.3, 15);
    accentLight2.position.set(4, 1, 2);
    accentLight2.name = 'AccentLight2';
    scene.add(accentLight2);

    // 5. Ambient Light
    const ambient = new THREE.AmbientLight(0xFFFFF0, 0.3);
    ambient.name = 'AmbientLight';
    scene.add(ambient);

    // 6. Bounce Light - Luz rebotada del suelo
    const bounceLight = new THREE.PointLight(0xC4A77D, 0.8, 15);
    bounceLight.position.set(0, -3, 2);
    bounceLight.name = 'BounceLight';
    scene.add(bounceLight);

    console.log('💡 Iluminación three-point añadida');
  }, []);

  /**
   * Crear habitación (pared y suelo)
   */
  const createRoom = useCallback((scene, wallType = 'white-wall') => {
    if (!scene) return;

    // Colores de pared según tipo
    const wallColors = {
      'wood-panel': 0x8B4513,
      'white-wall': 0xF5F5F5,
      'dark-wall': 0x2C2C2C,
      'brick': 0xA0522D,
      'concrete': 0x808080
    };

    const wallColor = wallColors[wallType] || wallColors['white-wall'];

    // Pared trasera
    const wallGeometry = new THREE.PlaneGeometry(16, 10);
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: 0.8,
      metalness: 0.1
    });
    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh.position.set(0, 0, -2);
    wallMesh.receiveShadow = true;
    wallMesh.name = 'Wall';
    scene.add(wallMesh);

    // Suelo
    const floorGeometry = new THREE.PlaneGeometry(16, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x3D3D3D,
      roughness: 0.9,
      metalness: 0.1
    });
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, -5, 3);
    floorMesh.receiveShadow = true;
    floorMesh.name = 'Floor';
    scene.add(floorMesh);

    console.log('🏠 Habitación creada:', wallType);
    return { wallMesh, floorMesh };
  }, []);

  /**
   * Cleanup al desmontar
   */
  const cleanup = useCallback(() => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
    
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }

    // Limpiar geometrías y materiales
    if (sceneRef.current) {
      sceneRef.current.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => {
              if (m.map) m.map.dispose();
              m.dispose();
            });
          } else {
            if (child.material.map) child.material.map.dispose();
            child.material.dispose();
          }
        }
      });
    }
  }, []);

  // Cleanup al desmontar
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    sceneRef,
    cameraRef,
    rendererRef,
    composerRef,
    animationIdRef,
    initScene,
    initLighting,
    createRoom,
    cleanup
  };
};

export default useThreeJS;
