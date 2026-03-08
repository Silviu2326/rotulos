/**
 * ============================================================================
 * POST-PROCESSING - Efectos Cinematográficos
 * ============================================================================
 * 
 * V31: Post-processing con Bloom, SSAO, SMAA
 * Basado en las mejoras del disenador-ia.php
 */

import { useEffect, useState } from 'react';
import { EffectComposer, Bloom, SSAO, SMAA } from '@react-three/postprocessing';
import { useThree } from '@react-three/fiber';

/**
 * Componente de Post-processing avanzado
 */
export const PostProcessing = ({ 
  enableBloom = true, 
  enableSSAO = true, 
  enableSMAA = true,
  bloomIntensity = 1.5,
  bloomThreshold = 0.85,
  bloomRadius = 0.4
}) => {
  const { gl, scene, camera } = useThree();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Verificar que el renderer esté listo
    if (gl && scene && camera) {
      setIsReady(true);
    }
  }, [gl, scene, camera]);

  if (!isReady) return null;

  return (
    <EffectComposer 
      multisampling={0}
      args={[gl]}
    >
      {/* SSAO - Screen Space Ambient Occlusion */}
      {enableSSAO && (
        <SSAO
          samples={16}
          radius={8}
          intensity={20}
          bias={0.001}
          fade={0.01}
          rings={4}
          blurRadius={4}
          worldDistanceThreshold={10}
          worldDistanceFalloff={5}
          worldProximityThreshold={2}
          worldProximityFalloff={1}
        />
      )}
      
      {/* Bloom - Efecto de brillo para LEDs */}
      {enableBloom && (
        <Bloom
          intensity={bloomIntensity}
          threshold={bloomThreshold}
          radius={bloomRadius}
          luminanceThreshold={bloomThreshold}
          luminanceSmoothing={0.025}
          mipmapBlur
        />
      )}
      
      {/* SMAA - Anti-aliasing de alta calidad */}
      {enableSMAA && (
        <SMAA
          edgeDetectionMode={1} // Color edge detection
          preset={3} // Ultra quality
        />
      )}
    </EffectComposer>
  );
};

/**
 * Componente de Post-processing para neón (con bloom más intenso)
 */
export const NeonPostProcessing = ({
  bloomIntensity = 2.5,
  bloomThreshold = 0.3,
  bloomRadius = 0.6
}) => {
  return (
    <PostProcessing
      enableBloom={true}
      enableSSAO={true}
      enableSMAA={true}
      bloomIntensity={bloomIntensity}
      bloomThreshold={bloomThreshold}
      bloomRadius={bloomRadius}
    />
  );
};

export default PostProcessing;
