'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  MeshDistortMaterial, 
  Stars,
  Environment,
  Sparkles,
  MeshTransmissionMaterial
} from '@react-three/drei';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// Chrome sphere with advanced materials
const ChromeSphere = ({ 
  position, 
  color 
}: { 
  position: [number, number, number]; 
  color: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    // Pulsing animation
    const scale = 1 + Math.sin(clock.elapsedTime * 0.5) * 0.15;
    meshRef.current.scale.set(scale, scale, scale);
    
    // Rotation
    meshRef.current.rotation.x = clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = clock.elapsedTime * 0.3;
    
    // Animate distortion
    if (materialRef.current) {
      materialRef.current.distort = 0.4 + Math.sin(clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.6}
      floatIntensity={2}
      position={position}
    >
      <mesh ref={meshRef} castShadow>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          ref={materialRef}
          color={color}
          metalness={0.9}
          roughness={0.1}
          distort={0.4}
          speed={2}
          envMapIntensity={2}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
};

// Metallic ring with glow
const MetallicRing = ({ position }: { position: [number, number, number] }) => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.x = clock.elapsedTime * 0.3;
    ringRef.current.rotation.z = clock.elapsedTime * 0.2;
  });

  return (
    <mesh ref={ringRef} position={position}>
      <torusGeometry args={[2, 0.1, 16, 100]} />
      <meshStandardMaterial
        color="#00ffff"
        metalness={1}
        roughness={0.2}
        emissive="#00ffff"
        emissiveIntensity={0.5}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
};

// Particle field
const ParticleField = ({ count = 500 }: { count?: number }) => {
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return positions;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.elapsedTime * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
          count={particles.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Transmission glass sphere
const GlassSphere = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.elapsedTime * 0.5;
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={1.5} position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          thickness={0.5}
          chromaticAberration={0.5}
          anisotropy={1}
          distortion={0.3}
          distortionScale={0.5}
          temporalDistortion={0.1}
          color="#00ffff"
        />
      </mesh>
    </Float>
  );
};

const ExperienceCanvas = () => {
  const [isLiteMode, setIsLiteMode] = useState(false);
  const [showAllSpheres, setShowAllSpheres] = useState(true);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Check for small screens and update both states
    const checkScreenSize = () => {
      if (typeof window === 'undefined') return;
      const isSmallScreen = window.innerWidth < 768;
      const liteMode = prefersReducedMotion || isSmallScreen;
      setIsLiteMode(liteMode);
      setShowAllSpheres(!liteMode || window.innerWidth >= 640);
    };

    // Initial check
    checkScreenSize();

    // Listen for resize events
    window.addEventListener('resize', checkScreenSize);

    // Listen for prefers-reduced-motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (typeof window === 'undefined') return;
      const liteMode = e.matches || window.innerWidth < 768;
      setIsLiteMode(liteMode);
      setShowAllSpheres(!liteMode || window.innerWidth >= 640);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  // Lite mode settings
  const particleCount = isLiteMode ? 120 : 500;
  const starsCount = isLiteMode ? 1000 : 3000;
  const sparklesCount = isLiteMode ? 40 : 100;
  const bloomIntensity = isLiteMode ? 0.6 : 1.2;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ willChange: 'auto' }}>
      <Canvas 
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        frameloop="always"
      >
        {/* Lighting setup */}
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 10, 50]} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#ff00ff" />
        <spotLight
          position={[0, 15, 0]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          color="#ffffff"
          castShadow
        />
        
        {/* Environment for reflections */}
        <Environment preset="city" />
        
        {/* 3D Objects - positioned to sides and shifted down */}
        {showAllSpheres ? (
          <>
            <ChromeSphere color="#00ffff" position={[-5, 0, -4]} />
            <ChromeSphere color="#ff00ff" position={[5, -4, -3]} />
            <ChromeSphere color="#ffffff" position={[-4, -5, -5]} />
          </>
        ) : (
          <ChromeSphere color="#00ffff" position={[-5, 0, -4]} />
        )}
        
        <GlassSphere position={[6, -2, -2]} />
        {showAllSpheres && <GlassSphere position={[-6, -3, -3]} />}
        {showAllSpheres && <MetallicRing position={[4, -3, -6]} />}
        
        {/* Particle systems */}
        <ParticleField count={particleCount} />
        <Sparkles
          count={sparklesCount}
          scale={15}
          size={2}
          speed={0.3}
          color="#00ffff"
        />
        
        {/* Stars background */}
        <Stars 
          radius={100} 
          depth={50} 
          count={starsCount} 
          factor={4} 
          saturation={0}
          fade
          speed={0.5}
        />
        
        {/* Post-processing effects - optimized */}
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={bloomIntensity}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.8}
            mipmapBlur={false}
          />
        </EffectComposer>
        
        {/* Auto rotation only - no user controls */}
      </Canvas>
    </div>
  );
};

export default ExperienceCanvas;
