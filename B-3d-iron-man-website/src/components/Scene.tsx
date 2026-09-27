import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  Grid,
  Lightformer,
  OrbitControls,
  Sparkles,
} from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { IronManModel } from './IronManModel'

/* ------------------------------------------------------------------ */
/*  Spinning holographic ground rings                                  */
/* ------------------------------------------------------------------ */
function GroundRings() {
  const spin = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.z += delta * 0.25
  })
  return (
    <group position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <group ref={spin}>
        <mesh>
          <ringGeometry args={[0.72, 0.75, 64]} />
          <meshBasicMaterial
            color="#39c2ec"
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i / 8) * Math.PI * 2]}>
            <ringGeometry args={[1.04, 1.07, 64, 1, 0, 0.35]} />
            <meshBasicMaterial
              color="#2a8fb0"
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
      {/* static outer ring */}
      <mesh>
        <ringGeometry args={[1.22, 1.226, 64]} />
        <meshBasicMaterial
          color="#1b5a70"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* under-glow disc */}
      <mesh position={[0, 0.002, 0]}>
        <circleGeometry args={[0.74, 48]} />
        <meshBasicMaterial
          color="#0d3d52"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Holographic rings orbiting the suit at chest height                */
/* ------------------------------------------------------------------ */
function HoloRings() {
  const r1 = useRef<THREE.Mesh>(null)
  const r2 = useRef<THREE.Mesh>(null)
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (r1.current) {
      r1.current.rotation.z += delta * 0.35
      r1.current.position.y = 1.05 + Math.sin(t * 1.4) * 0.08
    }
    if (r2.current) {
      r2.current.rotation.z -= delta * 0.22
      r2.current.position.y = 1.05 + Math.sin(t * 1.4 + 2) * 0.08
    }
  })
  return (
    <>
      <mesh ref={r1} position={[0, 1.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.82, 0.0035, 8, 80]} />
        <meshBasicMaterial color="#5fd7ff" transparent opacity={0.35} toneMapped={false} />
      </mesh>
      <mesh
        ref={r2}
        position={[0, 1.05, 0]}
        rotation={[-Math.PI / 2 + 0.28, 0.2, 0]}
      >
        <torusGeometry args={[0.95, 0.0025, 8, 80]} />
        <meshBasicMaterial color="#5fd7ff" transparent opacity={0.22} toneMapped={false} />
      </mesh>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Scene                                                              */
/* ------------------------------------------------------------------ */
export function Scene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0.3, 1.5, 4.2], fov: 38, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#050810']} />
      <fog attach="fog" args={['#050810', 10, 20]} />

      {/* ---- lighting ---- */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 4]} intensity={1.5} />
      <directionalLight position={[-6, 3, -3]} intensity={2.4} color="#ff3b30" />
      <directionalLight position={[3, 1.5, -5]} intensity={1.8} color="#4fd8ff" />
      <pointLight
        position={[0, 0.35, 1.6]}
        intensity={0.6}
        color="#7fd4ff"
        distance={3.5}
      />

      <Suspense fallback={null}>
        <IronManModel />
        <GroundRings />
        <HoloRings />
        <Sparkles
          count={70}
          scale={[3.8, 3, 3.8]}
          position={[0, 1.5, 0]}
          size={2.4}
          speed={0.35}
          color="#8fdcff"
          opacity={0.55}
        />
        <ContactShadows
          position={[0, 0.001, 0]}
          opacity={0.6}
          scale={6}
          blur={2.6}
          far={2.4}
          color="#000000"
        />

        {/* procedural studio environment — no network needed */}
        <Environment resolution={128} frames={1}>
          <Lightformer
            intensity={2.2}
            position={[0, 5, 0]}
            rotation-x={Math.PI / 2}
            scale={[9, 9, 1]}
            color="#cfe9ff"
          />
          <Lightformer
            intensity={1.6}
            position={[-5, 1.5, -1]}
            rotation-y={Math.PI / 2}
            scale={[7, 2, 1]}
            color="#ff5544"
          />
          <Lightformer
            intensity={1.6}
            position={[5, 1.5, 0]}
            rotation-y={-Math.PI / 2}
            scale={[7, 2, 1]}
            color="#5fb8ff"
          />
          <Lightformer
            intensity={1}
            position={[0, 2, 6]}
            scale={[6, 3, 1]}
            color="#ffffff"
          />
        </Environment>
      </Suspense>

      {/* ---- floor grid ---- */}
      <Grid
        position={[0, 0, 0]}
        args={[12, 12]}
        cellSize={0.6}
        cellThickness={0.6}
        cellColor="#0e2438"
        sectionSize={2.4}
        sectionThickness={1.1}
        sectionColor="#1a4a63"
        fadeDistance={15}
        fadeStrength={2.5}
        infiniteGrid
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.85}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 1.75}
        target={[0, 1.02, 0]}
      />

      {/* ---- post-processing ---- */}
      <EffectComposer multisampling={4}>
        <Bloom
          mipmapBlur
          intensity={1.15}
          luminanceThreshold={0.22}
          luminanceSmoothing={0.85}
        />
        <Vignette offset={0.22} darkness={0.72} />
      </EffectComposer>
    </Canvas>
  )
}
