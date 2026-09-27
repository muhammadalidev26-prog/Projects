import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const RED = '#9b111e'
const GOLD = '#c9971f'
const DARK = '#23232e'
const GLOW = '#8fe3ff'

/* ------------------------------------------------------------------ */
/*  Shared suit materials                                              */
/* ------------------------------------------------------------------ */
function useSuitMaterials() {
  const M = useMemo(
    () => ({
      red: new THREE.MeshStandardMaterial({
        color: RED,
        metalness: 0.85,
        roughness: 0.32,
        envMapIntensity: 1.35,
      }),
      gold: new THREE.MeshStandardMaterial({
        color: GOLD,
        metalness: 1,
        roughness: 0.24,
        envMapIntensity: 1.5,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: DARK,
        metalness: 0.9,
        roughness: 0.42,
        envMapIntensity: 1.1,
      }),
      reactor: new THREE.MeshStandardMaterial({
        color: '#eafcff',
        emissive: new THREE.Color(GLOW),
        emissiveIntensity: 2.6,
        toneMapped: false,
      }),
      eye: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: new THREE.Color('#d9f6ff'),
        emissiveIntensity: 3.2,
        toneMapped: false,
      }),
      palm: new THREE.MeshStandardMaterial({
        color: '#eafcff',
        emissive: new THREE.Color(GLOW),
        emissiveIntensity: 2.1,
        toneMapped: false,
      }),
      thruster: new THREE.MeshStandardMaterial({
        color: '#eafcff',
        emissive: new THREE.Color(GLOW),
        emissiveIntensity: 1.8,
        toneMapped: false,
      }),
    }),
    []
  )
  useEffect(
    () => () => {
      Object.values(M).forEach((m) => m.dispose())
    },
    [M]
  )
  return M
}

type SuitMaterials = ReturnType<typeof useSuitMaterials>

/* ------------------------------------------------------------------ */
/*  Arm                                                                */
/* ------------------------------------------------------------------ */
function Arm({ side, m }: { side: 1 | -1; m: SuitMaterials }) {
  return (
    <group
      position={[0.29 * side, 1.42, 0]}
      rotation={[0.07, 0, -0.16 * side]}
    >
      {/* upper arm */}
      <mesh material={m.red} position={[0, -0.14, 0]}>
        <capsuleGeometry args={[0.052, 0.16, 8, 16]} />
      </mesh>
      {/* elbow */}
      <mesh material={m.dark} position={[0, -0.28, 0]}>
        <sphereGeometry args={[0.052, 16, 16]} />
      </mesh>
      {/* forearm */}
      <mesh material={m.red} position={[0, -0.42, 0]}>
        <capsuleGeometry args={[0.058, 0.16, 8, 16]} />
      </mesh>
      {/* gold forearm trim */}
      <mesh
        material={m.gold}
        position={[0, -0.32, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.06, 0.012, 8, 24]} />
      </mesh>
      {/* hand */}
      <mesh material={m.gold} position={[0, -0.585, 0.005]}>
        <boxGeometry args={[0.07, 0.08, 0.055]} />
      </mesh>
      {/* palm repulsor */}
      <mesh
        material={m.palm}
        position={[0, -0.585, 0.035]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.026, 0.026, 0.014, 20]} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Leg                                                                */
/* ------------------------------------------------------------------ */
function Leg({ side, m }: { side: 1 | -1; m: SuitMaterials }) {
  return (
    <group position={[0.105 * side, 0.92, 0]} rotation={[0, 0, -0.035 * side]}>
      {/* hip joint */}
      <mesh material={m.dark} position={[0, -0.01, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </mesh>
      {/* thigh */}
      <mesh material={m.red} position={[0, -0.2, 0]}>
        <capsuleGeometry args={[0.075, 0.2, 8, 16]} />
      </mesh>
      {/* knee */}
      <mesh material={m.dark} position={[0, -0.375, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
      </mesh>
      {/* shin */}
      <mesh material={m.red} position={[0, -0.55, 0]}>
        <capsuleGeometry args={[0.062, 0.2, 8, 16]} />
      </mesh>
      {/* shin plate */}
      <mesh material={m.gold} position={[0, -0.5, 0.066]}>
        <boxGeometry args={[0.09, 0.13, 0.016]} />
      </mesh>
      {/* ankle */}
      <mesh material={m.dark} position={[0, -0.71, 0.01]}>
        <sphereGeometry args={[0.055, 16, 16]} />
      </mesh>
      {/* boot */}
      <group position={[0, -0.78, 0.02]}>
        <mesh material={m.red} position={[0, 0, 0.04]}>
          <boxGeometry args={[0.11, 0.1, 0.24]} />
        </mesh>
        <mesh material={m.gold} position={[0, -0.02, 0.165]}>
          <boxGeometry args={[0.11, 0.05, 0.08]} />
        </mesh>
        <mesh material={m.gold} position={[0, 0.043, 0.04]}>
          <boxGeometry args={[0.114, 0.018, 0.2]} />
        </mesh>
        {/* thruster */}
        <mesh material={m.thruster} position={[0, -0.052, -0.02]}>
          <cylinderGeometry args={[0.03, 0.036, 0.012, 16]} />
        </mesh>
        <pointLight
          position={[0, -0.18, -0.02]}
          color="#7fd4ff"
          intensity={0.45}
          distance={0.7}
        />
      </group>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Full Iron Man suit                                                 */
/* ------------------------------------------------------------------ */
export function IronManModel() {
  const M = useSuitMaterials()
  const root = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const reactorLight = useRef<THREE.PointLight>(null)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    /* hover + gentle sway */
    if (root.current) {
      root.current.position.y = Math.sin(t * 1.15) * 0.055
      root.current.rotation.z = Math.sin(t * 0.6) * 0.01
    }

    /* head tracks the cursor */
    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.damp(
        head.current.rotation.y,
        state.pointer.x * 0.55,
        3.5,
        delta
      )
      head.current.rotation.x = THREE.MathUtils.damp(
        head.current.rotation.x,
        -state.pointer.y * 0.3,
        3.5,
        delta
      )
    }

    /* arc reactor heartbeat */
    const pulse =
      2.4 + Math.sin(t * 2.3) * 1.1 + Math.sin(t * 8.7) * 0.3
    M.reactor.emissiveIntensity = pulse
    if (reactorLight.current)
      reactorLight.current.intensity = 2.8 + Math.sin(t * 2.3) * 1.3

    /* eye flicker + repulsor / thruster idle glow */
    M.eye.emissiveIntensity = 3.2 + Math.sin(t * 9.3) * 0.4
    M.palm.emissiveIntensity = 2.1 + Math.sin(t * 3.2 + 1.2) * 0.9
    M.thruster.emissiveIntensity = 1.7 + Math.sin(t * 4.6 + 2.4) * 0.9
  })

  return (
    <group ref={root}>
      {/* ================= HEAD ================= */}
      <group ref={head} position={[0, 1.63, 0]}>
        {/* neck */}
        <mesh material={M.dark} position={[0, -0.12, -0.015]}>
          <cylinderGeometry args={[0.048, 0.056, 0.1, 12]} />
        </mesh>
        {/* helmet shell */}
        <mesh material={M.red} scale={[1, 1.12, 1.02]}>
          <sphereGeometry args={[0.165, 32, 32]} />
        </mesh>
        {/* gold faceplate */}
        <mesh
          material={M.gold}
          position={[0, -0.005, 0.05]}
          scale={[0.94, 1, 0.88]}
        >
          <sphereGeometry args={[0.15, 32, 32]} />
        </mesh>
        {/* jaw */}
        <mesh
          material={M.gold}
          position={[0, -0.115, 0.075]}
          scale={[0.82, 0.52, 0.75]}
        >
          <sphereGeometry args={[0.12, 24, 24]} />
        </mesh>
        {/* eye sockets + glowing slits */}
        <mesh
          material={M.dark}
          position={[0.052, 0.02, 0.168]}
          rotation={[0, -0.16, 0]}
        >
          <boxGeometry args={[0.062, 0.026, 0.03]} />
        </mesh>
        <mesh
          material={M.dark}
          position={[-0.052, 0.02, 0.168]}
          rotation={[0, 0.16, 0]}
        >
          <boxGeometry args={[0.062, 0.026, 0.03]} />
        </mesh>
        <mesh
          material={M.eye}
          position={[0.052, 0.02, 0.185]}
          rotation={[0, -0.16, 0]}
        >
          <boxGeometry args={[0.05, 0.014, 0.01]} />
        </mesh>
        <mesh
          material={M.eye}
          position={[-0.052, 0.02, 0.185]}
          rotation={[0, 0.16, 0]}
        >
          <boxGeometry args={[0.05, 0.014, 0.01]} />
        </mesh>
        {/* mouth slit */}
        <mesh material={M.dark} position={[0, -0.075, 0.176]}>
          <boxGeometry args={[0.05, 0.009, 0.008]} />
        </mesh>
        {/* ears */}
        <mesh
          material={M.gold}
          position={[0.164, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.037, 0.037, 0.02, 16]} />
        </mesh>
        <mesh
          material={M.gold}
          position={[-0.164, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.037, 0.037, 0.02, 16]} />
        </mesh>
      </group>

      {/* ================= TORSO ================= */}
      <group position={[0, 1.28, 0]}>
        {/* chest */}
        <mesh material={M.red} position={[0, 0.02, 0]} scale={[1, 1, 0.78]}>
          <cylinderGeometry args={[0.235, 0.185, 0.34, 28]} />
        </mesh>
        {/* upper chest gold plate */}
        <mesh
          material={M.gold}
          position={[0, 0.15, 0.075]}
          scale={[1, 0.55, 0.62]}
        >
          <cylinderGeometry args={[0.205, 0.215, 0.16, 28]} />
        </mesh>
        {/* abs */}
        <mesh
          material={M.gold}
          position={[0, -0.2, 0]}
          scale={[1, 1, 0.72]}
        >
          <cylinderGeometry args={[0.15, 0.105, 0.22, 24]} />
        </mesh>
        {/* ab seam */}
        <mesh material={M.dark} position={[0, -0.2, 0.107]}>
          <boxGeometry args={[0.012, 0.2, 0.012]} />
        </mesh>

        {/* ---- ARC REACTOR ---- */}
        <group position={[0, 0.075, 0.168]}>
          <mesh material={M.gold} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.052, 0.014, 12, 28]} />
          </mesh>
          <mesh material={M.dark} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.038, 0.006, 8, 24]} />
          </mesh>
          <mesh material={M.reactor} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.034, 0.034, 0.02, 24]} />
          </mesh>
          <pointLight
            ref={reactorLight}
            color="#7fd4ff"
            intensity={3}
            distance={2.4}
            decay={2}
          />
        </group>

        {/* shoulder sockets */}
        <mesh material={M.dark} position={[0.24, 0.12, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
        </mesh>
        <mesh material={M.dark} position={[-0.24, 0.12, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
        </mesh>

        {/* back thrusters — angled backward, glowing exhaust tips */}
        <mesh
          material={M.dark}
          position={[0.085, 0.02, -0.17]}
          rotation={[-1.35, 0, 0]}
        >
          <cylinderGeometry args={[0.033, 0.033, 0.1, 12]} />
        </mesh>
        <mesh
          material={M.dark}
          position={[-0.085, 0.02, -0.17]}
          rotation={[-1.35, 0, 0]}
        >
          <cylinderGeometry args={[0.033, 0.033, 0.1, 12]} />
        </mesh>
        <mesh
          material={M.thruster}
          position={[0.085, 0.04, -0.213]}
          rotation={[-1.35, 0, 0]}
        >
          <cylinderGeometry args={[0.024, 0.024, 0.012, 12]} />
        </mesh>
        <mesh
          material={M.thruster}
          position={[-0.085, 0.04, -0.213]}
          rotation={[-1.35, 0, 0]}
        >
          <cylinderGeometry args={[0.024, 0.024, 0.012, 12]} />
        </mesh>
      </group>

      {/* ================= PELVIS ================= */}
      <group position={[0, 0.94, 0]}>
        <mesh material={M.dark} scale={[1, 1, 0.78]}>
          <cylinderGeometry args={[0.132, 0.148, 0.17, 20]} />
        </mesh>
        {/* belt */}
        <mesh
          material={M.gold}
          position={[0, 0.06, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.14, 0.013, 8, 28]} />
        </mesh>
        {/* pelvic plate */}
        <mesh
          material={M.gold}
          position={[0, -0.005, 0.068]}
          scale={[0.85, 0.72, 0.5]}
        >
          <sphereGeometry args={[0.088, 20, 20]} />
        </mesh>
      </group>

      {/* ================= SHOULDERS ================= */}
      <mesh material={M.red} position={[0.295, 1.45, 0]} scale={[1.18, 0.82, 1]}>
        <sphereGeometry args={[0.105, 24, 24]} />
      </mesh>
      <mesh material={M.red} position={[-0.295, 1.45, 0]} scale={[1.18, 0.82, 1]}>
        <sphereGeometry args={[0.105, 24, 24]} />
      </mesh>

      {/* ================= ARMS + LEGS ================= */}
      <Arm side={1} m={M} />
      <Arm side={-1} m={M} />
      <Leg side={1} m={M} />
      <Leg side={-1} m={M} />
    </group>
  )
}
