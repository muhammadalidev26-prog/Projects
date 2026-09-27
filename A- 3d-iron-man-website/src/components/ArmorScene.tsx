import { Component, useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { useArmor } from "../context/ArmorContext";
import { IronMan } from "./IronMan";
import { CssReactor } from "./CssReactor";

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return <Fallback />;
    return this.props.children;
  }
}

function Fallback() {
  const { suit } = useArmor();
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] flex items-start justify-center pt-[12vh] md:items-center md:justify-end md:pr-[10vw]">
      <div className="w-56 md:w-80">
        <CssReactor color={suit.reactor} />
      </div>
    </div>
  );
}

function StudioEnv() {
  const { gl, scene } = useThree();
  useLayoutEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = new THREE.Scene();
    const add = (color: string, pos: [number, number, number], size: [number, number]) => {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(size[0], size[1]),
        new THREE.MeshBasicMaterial({ color }),
      );
      mesh.position.set(...pos);
      mesh.lookAt(0, 1.2, 0);
      env.add(mesh);
    };
    add("#ffe0b0", [0, 5.2, -3], [9, 4]);
    add("#ff2c2c", [-5.5, 1.4, 1], [3, 6]);
    add("#8adfff", [5.2, 1.2, 2], [2.4, 4]);
    add("#ffffff", [1.4, 3.2, 6], [4, 2.2]);
    add("#14080e", [0, -2, 1], [14, 6]);
    const target = pmrem.fromScene(env, 0.04);
    scene.environment = target.texture;
    scene.environmentIntensity = 1.15;
    return () => {
      target.texture.dispose();
      pmrem.dispose();
      scene.environment = null;
    };
  }, [gl, scene]);
  return null;
}

function HeadLamp() {
  const light = useRef<THREE.DirectionalLight>(null);
  useFrame(({ camera }) => {
    const lamp = light.current;
    if (!lamp) return;
    lamp.position.copy(camera.position);
    lamp.target.position.set(1.15, 1.25, 0);
    lamp.target.updateMatrixWorld();
  });
  return <directionalLight ref={light} intensity={2.4} color="#fffaf4" />;
}

function Skyline() {
  const buildings = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        x: -4 + i * 0.62,
        h: 0.5 + ((i * 37) % 10) * 0.28,
        w: 0.38 + (i % 3) * 0.08,
        z: -7.2 - (i % 4) * 0.35,
        glow: 0.03 + (i % 5) * 0.015,
      })),
    [],
  );
  return (
    <group position={[1.1, 0, 0]}>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2 - 0.15, b.z]}>
          <boxGeometry args={[b.w, b.h, 0.42]} />
          <meshStandardMaterial color="#120c12" metalness={0.55} roughness={0.55} emissive="#ff6a32" emissiveIntensity={b.glow} />
        </mesh>
      ))}
    </group>
  );
}

function Stars() {
  const geo = useMemo(() => {
    const count = 160;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = 2 + Math.random() * 8;
      positions[i * 3 + 2] = -6 - Math.random() * 8;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <points geometry={geo}>
      <pointsMaterial color="#f6efe2" size={0.03} transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Platform({ color }: { color: string }) {
  const a = useRef<THREE.Group>(null);
  const b = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (a.current) a.current.rotation.z += dt * 0.35;
    if (b.current) b.current.rotation.z -= dt * 0.22;
  });
  return (
    <group position={[0, 0.01, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.28, 64]} />
        <meshStandardMaterial color="#100c12" metalness={0.82} roughness={0.38} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <ringGeometry args={[0.86, 0.9, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.85} toneMapped={false} />
      </mesh>
      <group ref={a} position={[0, 0.02, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.12, 1.15, 80]} />
          <meshBasicMaterial color="#e6b34d" transparent opacity={0.75} toneMapped={false} />
        </mesh>
        {Array.from({ length: 20 }).map((_, i) => {
          const ang = (i / 20) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(ang) * 1.26, 0.01, Math.sin(ang) * 1.26]} rotation={[-Math.PI / 2, 0, -ang]}>
              <boxGeometry args={[0.07, 0.012, 0.012]} />
              <meshBasicMaterial color="#e6b34d" transparent opacity={0.55} />
            </mesh>
          );
        })}
      </group>
      <group ref={b} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <mesh>
          <ringGeometry args={[0.48, 0.5, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} toneMapped={false} />
        </mesh>
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <circleGeometry args={[0.55, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

function Shockwave({ trigger, color }: { trigger: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    const mesh = ref.current;
    const material = mat.current;
    if (!mesh || !material) return;
    const elapsed = trigger ? (performance.now() - trigger) / 1000 : 99;
    const active = elapsed >= 0 && elapsed < 1.15;
    mesh.visible = active;
    if (!active) return;
    const p = elapsed / 1.15;
    const s = 0.35 + p * 2.5;
    mesh.scale.set(s, s, s);
    material.opacity = (1 - p) * 0.75;
    material.color.set(color);
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} visible={false}>
      <ringGeometry args={[0.8, 0.9, 64]} />
      <meshBasicMaterial ref={mat} color={color} transparent opacity={0} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}

function Stage({ pointer }: { pointer: { current: { x: number; y: number } } }) {
  const { suit, focus, blast, assembleAt } = useArmor();
  const mount = useRef<THREE.Group>(null);
  const x = useRef(1.32);
  useFrame((state, dt) => {
    const mobile = state.size.width < 768;
    const target = mobile ? 0 : focus === "reactor" ? 1.05 : 1.36;
    x.current = THREE.MathUtils.damp(x.current, target, 2.6, dt);
    if (mount.current) mount.current.position.x = x.current;
  });
  return (
    <group ref={mount} position={[1.36, 0, 0]}>
      <mesh position={[0, 1.35, -1.15]}>
        <circleGeometry args={[1.7, 40]} />
        <meshBasicMaterial color="#7a1428" transparent opacity={0.42} depthWrite={false} />
      </mesh>
      <spotLight position={[0, -0.2, 0.5]} angle={0.7} penumbra={0.55} intensity={28} color={suit.reactor} distance={4.5} />
      <IronMan pointer={pointer} />
      <Platform color={suit.reactor} />
      <Shockwave trigger={blast} color="#e9fbff" />
      <Shockwave trigger={assembleAt ?? 0} color={suit.reactor} />
    </group>
  );
}

function CameraRig({ pointer }: { pointer: { current: { x: number; y: number } } }) {
  const { camera, size } = useThree();
  const { focus, blast, suit } = useArmor();
  const look = useRef(new THREE.Vector3(0.2, 1.12, 0));
  const desired = useRef(new THREE.Vector3());

  useLayoutEffect(() => {
    camera.position.set(-0.1, 1.3, 5.5);
    camera.lookAt(0.2, 1.12, 0);
  }, [camera]);

  useFrame((_, dt) => {
    const mobile = size.width < 768;
    const bulkPad = (suit.bulk - 1) * 0.85;
    const presets = mobile
      ? {
          hero: { cam: [0, 1.55, 6.3], look: [0, 1.15, 0], fov: 38 },
          systems: { cam: [0.15, 1.4, 6.1], look: [0, 1.15, 0], fov: 38 },
          reactor: { cam: [0, 1.55, 4.4], look: [0, 1.48, 0], fov: 34 },
          archive: { cam: [0.4, 1.35, 6.2], look: [0, 1.15, 0], fov: 38 },
          chronicle: { cam: [0, 1.45, 6.6], look: [0, 1.1, 0], fov: 40 },
        }
      : {
          hero: { cam: [-0.15, 1.28, 5.5 + bulkPad], look: [0.15, 1.12, 0], fov: 30 },
          systems: { cam: [-0.35, 1.2, 5.15 + bulkPad], look: [0.35, 1.12, 0], fov: 30 },
          reactor: { cam: [1.85, 1.52, 2.85], look: [1.05, 1.5, 0], fov: 30 },
          archive: { cam: [0.15, 1.12, 5.05 + bulkPad], look: [0.55, 1.12, 0], fov: 30 },
          chronicle: { cam: [-0.2, 1.4, 5.9], look: [0.3, 1.05, 0], fov: 32 },
        };
    const preset = presets[focus] ?? presets.hero;
    const shake = blast && performance.now() - blast < 420 ? 1 - (performance.now() - blast) / 420 : 0;
    desired.current.set(
      preset.cam[0] + pointer.current.x * 0.18 + (Math.random() - 0.5) * 0.07 * shake,
      preset.cam[1] + pointer.current.y * -0.08 + (Math.random() - 0.5) * 0.05 * shake,
      preset.cam[2],
    );
    camera.position.lerp(desired.current, 1 - Math.pow(0.001, dt));
    look.current.lerp(new THREE.Vector3(preset.look[0], preset.look[1], preset.look[2]), 1 - Math.pow(0.0015, dt));
    camera.lookAt(look.current);
    if (camera instanceof THREE.PerspectiveCamera && Math.abs(camera.fov - preset.fov) > 0.05) {
      camera.fov = THREE.MathUtils.damp(camera.fov, preset.fov, 4, dt);
      camera.updateProjectionMatrix();
    }
  });
  return null;
}

function Scene({ pointer }: { pointer: { current: { x: number; y: number } } }) {
  return (
    <>
      <color attach="background" args={["#09070c"]} />
      <StudioEnv />
      <ambientLight intensity={0.62} />
      <hemisphereLight args={["#ffe6c8", "#2a1018", 0.9]} />
      <directionalLight position={[0.4, 2.8, 6.2]} intensity={5.6} color="#fff8f0" />
      <directionalLight position={[4.2, 3.2, 2.4]} intensity={2.6} color="#ffd7a4" />
      <directionalLight position={[-4.2, 2.2, -1.5]} intensity={3.8} color="#ff2a2a" />
      <directionalLight position={[1.6, 1.4, -4]} intensity={1.4} color="#8adfff" />
      <spotLight position={[1.5, 6.4, 2.6]} angle={0.46} penumbra={0.7} intensity={90} color="#fff4e4" distance={16} />
      <HeadLamp />
      <Skyline />
      <Stars />
      <mesh position={[5.6, 6.4, -9]}>
        <sphereGeometry args={[0.38, 20, 20]} />
        <meshBasicMaterial color="#f3e2c4" />
      </mesh>
      <sprite position={[5.6, 6.4, -9]} scale={[1.8, 1.8, 1]}>
        <spriteMaterial color="#ffd7a8" transparent opacity={0.28} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.2, -0.02, 0]}>
        <circleGeometry args={[9, 48]} />
        <meshBasicMaterial color="#050407" />
      </mesh>
      <Stage pointer={pointer} />
      <CameraRig pointer={pointer} />
      <EffectComposer enableNormalPass={false} multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={0.92} luminanceSmoothing={0.32} intensity={1.05} />
        <Vignette darkness={0.55} offset={0.22} />
      </EffectComposer>
    </>
  );
}

export default function ArmorScene() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Boundary>
      <div className="fixed inset-0 z-[1]" aria-hidden>
        <Canvas
          dpr={[1, 1.6]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance", stencil: false }}
          camera={{ position: [-0.1, 1.3, 5.5], fov: 30, near: 0.1, far: 40 }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.28;
            gl.setClearColor("#09070c", 1);
          }}
        >
          <Scene pointer={pointer} />
        </Canvas>
      </div>
    </Boundary>
  );
}
