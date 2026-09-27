import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useArmor } from "../context/ArmorContext";

type Vec3 = [number, number, number];
type ProgressRef = { current: number };
type NumRef = { current: number };

function usePlateMat(color: string, rough: number, metal: number) {
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        roughness: rough,
        metalness: metal,
        clearcoat: metal > 0.8 ? 0.84 : 0.2,
        clearcoatRoughness: 0.28,
        envMapIntensity: 1.3,
      }),
    [color, rough, metal],
  );
  useEffect(() => () => mat.dispose(), [mat]);
  return mat;
}

function Piece({
  progress,
  delay,
  from,
  children,
}: {
  progress: ProgressRef;
  delay: number;
  from: Vec3;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const group = ref.current;
    if (!group) return;
    const local = THREE.MathUtils.smoothstep(progress.current, delay, Math.min(1, delay + 0.4));
    const eased = 1 - Math.pow(1 - local, 3);
    group.position.set(from[0] * (1 - eased), from[1] * (1 - eased), from[2] * (1 - eased));
    group.rotation.y = (1 - eased) * (from[0] === 0 ? 0.7 : Math.sign(from[0]) * 0.9);
    group.rotation.x = (1 - eased) * 0.35;
  });
  return (
    <group ref={ref} position={from}>
      {children}
    </group>
  );
}

function HelmetShell() {
  const { suit } = useArmor();
  const plate = usePlateMat(suit.plate, suit.roughness, suit.metalness);
  const trim = usePlateMat(suit.trim, Math.max(0.14, suit.roughness - 0.08), Math.min(1, suit.metalness + 0.04));
  const dark = usePlateMat(suit.dark, 0.48, 0.72);
  return (
    <group>
      <mesh position={[0, 2.05, -0.02]} material={plate} scale={[1, 1.08, 0.96]}>
        <sphereGeometry args={[0.225, 40, 32]} />
      </mesh>
      <mesh position={[0, 2.24, -0.01]} material={trim}>
        <boxGeometry args={[0.016, 0.1, 0.16]} />
      </mesh>
      <mesh position={[0, 2.16, 0.12]} rotation={[-0.45, 0, 0]} material={plate}>
        <boxGeometry args={[0.3, 0.07, 0.1]} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.21, 2.03, 0]}>
          <mesh material={trim}>
            <boxGeometry args={[0.07, 0.11, 0.13]} />
          </mesh>
          <mesh position={[side * 0.03, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={dark}>
            <cylinderGeometry args={[0.035, 0.04, 0.04, 12]} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.84, 0.02]} material={dark}>
        <cylinderGeometry args={[0.075, 0.09, 0.12, 16]} />
      </mesh>
    </group>
  );
}

function Faceplate({ progress }: { progress: ProgressRef }) {
  const { suit, highlight, blast } = useArmor();
  const trim = usePlateMat(suit.trim, Math.max(0.12, suit.roughness - 0.1), 1);
  const dark = usePlateMat("#07080c", 0.32, 0.86);
  const eyeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f7fdff",
        emissive: new THREE.Color(suit.eye),
        emissiveIntensity: 0,
        toneMapped: false,
      }),
    [suit.eye],
  );
  const glowMat = useMemo(
    () =>
      new THREE.SpriteMaterial({
        color: suit.eye,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [suit.eye],
  );
  useEffect(() => () => {
    eyeMat.dispose();
    glowMat.dispose();
  }, [eyeMat, glowMat]);

  useFrame(({ clock }) => {
    const ignite = THREE.MathUtils.smoothstep(progress.current, 0.62, 0.92);
    const pulse = 0.82 + Math.sin(clock.elapsedTime * 5.5) * 0.18;
    const blasting = blast > 0 && performance.now() - blast < 700;
    const boost = (highlight === "eyes" ? 1.55 : 1) * (blasting ? 1.7 : 1);
    const intensity = ignite * suit.eyeGlow * pulse * boost;
    eyeMat.emissiveIntensity = intensity;
    glowMat.opacity = ignite * 0.42 * boost;
  });

  return (
    <group>
      <mesh position={[0, 2.02, 0.07]} scale={[0.8, 0.94, 0.68]} material={trim}>
        <sphereGeometry args={[0.205, 36, 28]} />
      </mesh>
      <mesh position={[0, 1.86, 0.1]} rotation={[0.35, 0, 0]} material={trim}>
        <boxGeometry args={[0.16, 0.1, 0.12]} />
      </mesh>
      <mesh position={[0, 1.78, 0.12]} rotation={[0.55, 0, 0]} material={trim}>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
      </mesh>
      <mesh position={[0, 2.07, 0.2]} material={dark}>
        <boxGeometry args={[0.25, 0.055, 0.05]} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          material={eyeMat}
          position={[side * 0.078, 2.075, 0.236]}
          rotation={[0, side * -0.15, side * -0.5]}
        >
          <boxGeometry args={[0.11, 0.026, 0.02]} />
        </mesh>
      ))}
      <sprite position={[0, 2.075, 0.3]} scale={[0.48, 0.12, 1]} material={glowMat} />
      <mesh position={[0, 2.0, 0.22]} material={trim}>
        <boxGeometry args={[0.012, 0.055, 0.016]} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 1.95 - i * 0.018, 0.218]} material={dark}>
          <boxGeometry args={[0.11 - i * 0.012, 0.006, 0.012]} />
        </mesh>
      ))}
    </group>
  );
}

function Torso({ thrust }: { thrust: NumRef }) {
  const { suit, highlight, power, blast } = useArmor();
  const bulk = suit.bulk;
  const plate = usePlateMat(suit.plate, suit.roughness, suit.metalness);
  const trim = usePlateMat(suit.trim, Math.max(0.14, suit.roughness - 0.08), Math.min(1, suit.metalness + 0.03));
  const dark = usePlateMat(suit.dark, 0.5, 0.7);
  const seam = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: suit.reactor,
        emissive: new THREE.Color(suit.reactor),
        emissiveIntensity: suit.seams ? 2.2 : 0,
        toneMapped: false,
        roughness: 0.3,
        metalness: 0.4,
      }),
    [suit.reactor, suit.seams],
  );
  const tri = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.17);
    shape.lineTo(0.155, -0.11);
    shape.lineTo(-0.155, -0.11);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.028,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.005,
      bevelSegments: 1,
    });
    geo.center();
    return geo;
  }, []);
  const housing = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#071016",
        metalness: 0.9,
        roughness: 0.28,
        emissive: new THREE.Color(suit.reactor),
        emissiveIntensity: 0.25,
      }),
    [suit.reactor],
  );
  const ringMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: suit.reactor,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    [suit.reactor],
  );
  const coreMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ffffff",
        toneMapped: false,
      }),
    [],
  );
  const spriteMat = useMemo(
    () =>
      new THREE.SpriteMaterial({
        color: suit.reactor,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [suit.reactor],
  );
  const light = useRef<THREE.PointLight>(null);
  const spin = useRef<THREE.Group>(null);
  const spin2 = useRef<THREE.Group>(null);
  const backMat = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(
    () => () => {
      seam.dispose();
      tri.dispose();
      housing.dispose();
      ringMat.dispose();
      coreMat.dispose();
      spriteMat.dispose();
    },
    [seam, tri, housing, ringMat, coreMat, spriteMat],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const heat = power.weapons / 100;
    const pulse = 1 + Math.sin(t * 4.4) * 0.12;
    const blasting = blast > 0 && performance.now() - blast < 860;
    const boost = (highlight === "reactor" ? 1.8 : 1) * (blasting ? 2.4 : 1);
    const core = heat > 0.55 ? "#ffb15e" : suit.reactor;
    if (light.current) {
      light.current.intensity = (22 + heat * 18) * pulse * boost;
      light.current.color.set(core);
    }
    ringMat.color.set(core);
    spriteMat.color.set(core);
    housing.emissive.set(core);
    if (spin.current) spin.current.rotation.z = t * 1.7;
    if (spin2.current) spin2.current.rotation.z = -t * 0.8;
    spriteMat.opacity = 0.38 + Math.sin(t * 4.4) * 0.1 + (blasting ? 0.35 : 0);
    if (backMat.current) {
      backMat.current.opacity = 0.25 + thrust.current * 0.7;
      backMat.current.color.set(suit.reactor);
    }
    seam.emissiveIntensity = suit.seams ? 1.6 + Math.sin(t * 3) * 0.5 : highlight === "frame" ? 1.4 : 0;
  });

  return (
    <group>
      <RoundedBox
        args={[0.6 * bulk, 0.44, 0.32 * bulk]}
        radius={0.05}
        smoothness={3}
        creaseAngle={0.35}
        position={[0, 1.52, 0]}
        material={plate}
      />
      {[-1, 1].map((side) => (
        <RoundedBox
          key={side}
          args={[0.24, 0.16, 0.08]}
          radius={0.03}
          smoothness={2}
          position={[side * 0.13, 1.58, 0.15]}
          rotation={[0.12, side * -0.18, side * -0.05]}
          material={plate}
        />
      ))}
      <mesh geometry={tri} material={trim} position={[0, 1.54, 0.185]} />
      <mesh position={[0, 1.5, 0.2]} rotation={[Math.PI / 2, 0, 0]} material={housing}>
        <cylinderGeometry args={[0.086, 0.086, 0.03, 32]} />
      </mesh>
      <group position={[0, 1.5, 0.222]}>
        <mesh material={ringMat}>
          <ringGeometry args={[0.055, 0.082, 40]} />
        </mesh>
        <group ref={spin}>
          <mesh material={ringMat}>
            <ringGeometry args={[0.028, 0.042, 3]} />
          </mesh>
        </group>
        <group ref={spin2}>
          <mesh material={ringMat}>
            <ringGeometry args={[0.018, 0.024, 32]} />
          </mesh>
        </group>
        <mesh material={coreMat}>
          <circleGeometry args={[0.016, 20]} />
        </mesh>
        <pointLight ref={light} color={suit.reactor} intensity={4} distance={1.8} />
        <sprite scale={[0.52, 0.52, 1]} material={spriteMat} />
      </group>
      {[0, 1, 2].map((i) => (
        <RoundedBox
          key={i}
          args={[0.34 - i * 0.03, 0.07, 0.1]}
          radius={0.02}
          smoothness={2}
          position={[0, 1.24 - i * 0.08, 0.12]}
          material={i === 1 ? trim : plate}
        />
      ))}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.27 * bulk, 1.42, 0]} material={dark}>
          <boxGeometry args={[0.07, 0.28, 0.22]} />
        </mesh>
      ))}
      <RoundedBox args={[0.42, 0.08, 0.24]} radius={0.02} smoothness={2} position={[0, 1.02, 0]} material={trim} />
      <RoundedBox args={[0.34, 0.12, 0.18]} radius={0.03} smoothness={2} position={[0, 0.94, 0.04]} material={plate} />
      <mesh position={[0, 1.4, -0.17]} material={dark}>
        <boxGeometry args={[0.1, 0.36, 0.06]} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.12, 1.38, -0.2]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={dark}>
            <cylinderGeometry args={[0.05, 0.065, 0.1, 14]} />
          </mesh>
          <mesh position={[0, 0, -0.06]} rotation={[0, Math.PI, 0]}>
            <circleGeometry args={[0.038, 16]} />
            <meshBasicMaterial
              ref={side === -1 ? backMat : undefined}
              color={suit.reactor}
              transparent
              opacity={0.45}
              toneMapped={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}
      {suit.seams &&
        [-0.16, 0.16].map((x) => (
          <mesh key={x} position={[x, 1.48, 0.17]} material={seam}>
            <boxGeometry args={[0.012, 0.28, 0.012]} />
          </mesh>
        ))}
      <mesh position={[0, 1.68, 0.08]} material={trim}>
        <boxGeometry args={[0.16, 0.06, 0.1]} />
      </mesh>
    </group>
  );
}

function Gauntlet({ side, plate, trim, reactor }: { side: number; plate: THREE.Material; trim: THREE.Material; reactor: string }) {
  const { highlight, blast } = useArmor();
  const glow = useRef<THREE.Sprite>(null);
  const mat = useMemo(
    () =>
      new THREE.SpriteMaterial({
        color: reactor,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [reactor],
  );
  useEffect(() => () => mat.dispose(), [mat]);
  useFrame(({ clock }) => {
    const blasting = blast > 0 && performance.now() - blast < 800;
    const hot = highlight === "repulsor" || blasting;
    const s = (hot ? 0.2 : 0.11) + Math.sin(clock.elapsedTime * 8) * 0.01;
    if (glow.current) glow.current.scale.set(s, s, 1);
    mat.opacity = hot ? 0.95 : 0.72;
  });
  return (
    <group>
      <RoundedBox args={[0.11, 0.12, 0.08]} radius={0.028} smoothness={2} material={plate} />
      {[-0.03, 0, 0.03].map((x) => (
        <mesh key={x} position={[x, -0.07, 0.02]} rotation={[0.55, 0, 0]} material={trim}>
          <cylinderGeometry args={[0.012, 0.014, 0.055, 8]} />
        </mesh>
      ))}
      <mesh position={[side * 0.055, -0.01, 0.01]} material={trim}>
        <sphereGeometry args={[0.02, 10, 10]} />
      </mesh>
      <mesh position={[0, -0.01, 0.045]} material={trim}>
        <circleGeometry args={[0.03, 16]} />
      </mesh>
      <sprite ref={glow} position={[0, -0.01, 0.07]} material={mat} />
    </group>
  );
}

function Arm({
  side,
  flight,
  blastAmt,
}: {
  side: number;
  flight: NumRef;
  blastAmt: NumRef;
}) {
  const { suit } = useArmor();
  const plate = usePlateMat(suit.plate, suit.roughness, suit.metalness);
  const trim = usePlateMat(suit.trim, Math.max(0.14, suit.roughness - 0.08), Math.min(1, suit.metalness + 0.03));
  const shoulder = useRef<THREE.Group>(null);
  const elbow = useRef<THREE.Group>(null);
  const beam = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    const f = flight.current;
    const ready = side === -1 ? 1 : 0;
    if (shoulder.current) {
      shoulder.current.rotation.z = THREE.MathUtils.damp(
        shoulder.current.rotation.z,
        side * (0.5 + f * 0.28) + Math.sin(performance.now() / 900 + side) * 0.03,
        5,
        dt,
      );
      shoulder.current.rotation.x = THREE.MathUtils.damp(
        shoulder.current.rotation.x,
        -0.22 - ready * 0.55 * (1 - f) + f * 0.62 - blastAmt.current * ready * 0.5,
        5,
        dt,
      );
    }
    if (elbow.current) {
      elbow.current.rotation.x = THREE.MathUtils.damp(
        elbow.current.rotation.x,
        -0.5 * (1 - f) + f * 0.28 - blastAmt.current * ready * 0.15,
        5,
        dt,
      );
    }
    if (beam.current) {
      const a = side === -1 ? blastAmt.current : 0;
      beam.current.scale.y = THREE.MathUtils.damp(beam.current.scale.y, 0.02 + a * 1.15, 10, dt);
      beam.current.visible = beam.current.scale.y > 0.06;
    }
  });

  return (
    <group ref={shoulder} position={[side * 0.44, 1.66, 0]} rotation={[-0.45, 0, side * 0.5]}>
      <mesh position={[side * 0.03, 0.05, 0]} material={plate}>
        <sphereGeometry args={[0.16 * suit.bulk, 26, 22]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} material={trim}>
        <torusGeometry args={[0.105, 0.015, 8, 22]} />
      </mesh>
      <mesh position={[side * 0.08, 0.02, 0.08]} material={trim}>
        <sphereGeometry args={[0.02, 10, 10]} />
      </mesh>
      <mesh position={[0, -0.2, 0]} material={plate}>
        <cylinderGeometry args={[0.072 * suit.bulk, 0.08 * suit.bulk, 0.32, 16]} />
      </mesh>
      <mesh position={[0, -0.08, 0.06]} material={trim}>
        <boxGeometry args={[0.09, 0.04, 0.03]} />
      </mesh>
      <group ref={elbow} position={[0, -0.38, 0]} rotation={[-0.45, 0, 0]}>
        <mesh material={trim}>
          <sphereGeometry args={[0.068, 16, 16]} />
        </mesh>
        <mesh position={[0, -0.18, 0]} material={trim}>
          <cylinderGeometry args={[0.06, 0.068, 0.28, 16]} />
        </mesh>
        <mesh position={[side * 0.045, -0.16, 0.04]} material={plate}>
          <boxGeometry args={[0.02, 0.16, 0.035]} />
        </mesh>
        {suit.seams && (
          <mesh position={[0, -0.16, 0.06]}>
            <boxGeometry args={[0.01, 0.18, 0.01]} />
            <meshStandardMaterial color={suit.reactor} emissive={suit.reactor} emissiveIntensity={1.8} toneMapped={false} />
          </mesh>
        )}
        <group position={[0, -0.36, 0.02]}>
          <Gauntlet side={side} plate={plate} trim={trim} reactor={suit.reactor} />
          {side === -1 && (
            <group ref={beam} position={[0, -0.02, 0.06]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.02, 1]}>
              <mesh position={[0, 0.7, 0]}>
                <cylinderGeometry args={[0.012, 0.06, 1.4, 14, 1, true]} />
                <meshBasicMaterial
                  color="#e9fbff"
                  transparent
                  opacity={0.85}
                  depthWrite={false}
                  side={THREE.DoubleSide}
                  blending={THREE.AdditiveBlending}
                  toneMapped={false}
                />
              </mesh>
            </group>
          )}
        </group>
      </group>
    </group>
  );
}

function Leg({ side, thrust }: { side: number; thrust: NumRef }) {
  const { suit } = useArmor();
  const plate = usePlateMat(suit.plate, suit.roughness, suit.metalness);
  const trim = usePlateMat(suit.trim, Math.max(0.14, suit.roughness - 0.08), Math.min(1, suit.metalness + 0.03));
  const hip = useRef<THREE.Group>(null);
  const knee = useRef<THREE.Group>(null);
  const flame = useRef<THREE.MeshBasicMaterial>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame(({ clock }, dt) => {
    const f = thrust.current;
    if (hip.current) {
      hip.current.rotation.x = THREE.MathUtils.damp(hip.current.rotation.x, -0.52 - f * 0.28, 5, dt);
      hip.current.rotation.z = THREE.MathUtils.damp(hip.current.rotation.z, side * 0.08, 5, dt);
    }
    if (knee.current) {
      knee.current.rotation.x = THREE.MathUtils.damp(knee.current.rotation.x, 0.82 + f * 0.22, 5, dt);
    }
    if (flame.current) {
      flame.current.opacity = 0.28 + f * 0.7 + Math.sin(clock.elapsedTime * 22 + side) * 0.08;
      flame.current.color.set(suit.reactor);
    }
    if (light.current) light.current.intensity = 1.2 + f * 10;
  });

  const bulk = suit.bulk;
  return (
    <group ref={hip} position={[side * 0.15, 0.98, 0]} rotation={[-0.52, 0, side * 0.08]}>
      <mesh position={[side * 0.04, 0.02, 0.06]} rotation={[0.2, 0, side * 0.2]} material={plate}>
        <boxGeometry args={[0.12, 0.14, 0.05]} />
      </mesh>
      <mesh position={[0, -0.21, 0]} material={plate}>
        <cylinderGeometry args={[0.095 * bulk, 0.082 * bulk, 0.38, 16]} />
      </mesh>
      <mesh position={[side * 0.07, -0.2, 0.045]} material={trim}>
        <boxGeometry args={[0.025, 0.22, 0.04]} />
      </mesh>
      <group ref={knee} position={[0, -0.42, 0]} rotation={[0.82, 0, 0]}>
        <mesh material={trim}>
          <sphereGeometry args={[0.078 * bulk, 16, 16]} />
        </mesh>
        <mesh position={[0, -0.2, 0]} material={plate}>
          <cylinderGeometry args={[0.068 * bulk, 0.074 * bulk, 0.34, 16]} />
        </mesh>
        <mesh position={[side * 0.05, -0.18, 0.04]} material={trim}>
          <boxGeometry args={[0.02, 0.16, 0.04]} />
        </mesh>
        <group position={[0, -0.42, 0.03]} rotation={[0.4, 0, 0]}>
          <RoundedBox args={[0.15 * bulk, 0.12, 0.24]} radius={0.03} smoothness={2} position={[0, 0, 0.02]} material={plate} />
          <mesh position={[0, -0.02, 0.11]} material={trim}>
            <boxGeometry args={[0.12, 0.045, 0.07]} />
          </mesh>
          <mesh position={[0, -0.07, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.04, 18]} />
            <meshBasicMaterial
              ref={flame}
              color={suit.reactor}
              transparent
              opacity={0.6}
              toneMapped={false}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
          <pointLight ref={light} position={[0, -0.1, -0.02]} color={suit.reactor} intensity={0.4} distance={0.85} />
        </group>
      </group>
    </group>
  );
}

function Embers({ color, thrust }: { color: string; thrust: NumRef }) {
  const speeds = useRef<Float32Array>(new Float32Array());
  const geo = useMemo(() => {
    const count = 80;
    const positions = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.2 + Math.random() * 1.2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.random() * 2.3;
      positions[i * 3 + 2] = Math.sin(a) * r * 0.72;
      s[i] = 0.15 + Math.random() * 0.45;
    }
    speeds.current = s;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame((_, dt) => {
    const attr = geo.getAttribute("position") as THREE.BufferAttribute;
    const extra = 1 + thrust.current * 2.4;
    for (let i = 0; i < speeds.current.length; i++) {
      let y = attr.getY(i) + speeds.current[i] * dt * extra;
      if (y > 2.55) y = 0.02;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
  });
  return (
    <points geometry={geo}>
      <pointsMaterial color={color} size={0.028} transparent opacity={0.75} depthWrite={false} sizeAttenuation />
    </points>
  );
}

function ScanLine({ scan }: { scan: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    const mesh = ref.current;
    const material = mat.current;
    if (!mesh || !material) return;
    const elapsed = scan ? (performance.now() - scan) / 1000 : 99;
    const active = elapsed >= 0 && elapsed < 1.5;
    mesh.visible = active;
    if (!active) return;
    const p = elapsed / 1.5;
    mesh.position.y = 0.12 + p * 2.2;
    material.opacity = Math.sin(p * Math.PI) * 0.55;
  });
  return (
    <mesh ref={ref} visible={false}>
      <boxGeometry args={[1.55, 0.012, 1.55]} />
      <meshBasicMaterial
        ref={mat}
        color="#9af6ff"
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

export function IronMan({ pointer }: { pointer: { current: { x: number; y: number } } }) {
  const { suit, mode, blast, assembleAt, scan, highlight, focus } = useArmor();
  const root = useRef<THREE.Group>(null);
  const progress = useRef(0);
  const flight = useRef(0);
  const blastAmt = useRef(0);
  const thrust = useRef(0.25);
  const uni = useRef<THREE.Group>(null);
  const gyro = useRef<THREE.Mesh>(null);
  const reduce = useRef(false);
  const aura = useMemo(
    () =>
      new THREE.SpriteMaterial({
        color: "#9a1830",
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );
  const gyroMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: suit.reactor,
        transparent: true,
        opacity: 0,
        toneMapped: false,
      }),
    [suit.reactor],
  );
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  useEffect(() => () => {
    aura.dispose();
    gyroMat.dispose();
  }, [aura, gyroMat]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const elapsed = assembleAt == null ? 0 : (performance.now() - assembleAt) / 2300;
    progress.current = reduce.current ? 1 : THREE.MathUtils.clamp(elapsed, 0, 1);
    const wantFlight = mode === "flight" ? 1 : 0;
    flight.current = THREE.MathUtils.damp(flight.current, wantFlight, 3.2, dt);
    const blasting = blast > 0 && performance.now() - blast < 820;
    blastAmt.current = THREE.MathUtils.damp(blastAmt.current, blasting ? 1 : 0, 8, dt);
    thrust.current = Math.max(0.22 + flight.current * 0.78, highlight === "flight" ? 0.9 : 0);

    const group = root.current;
    if (!group) return;
    const mobile = state.size.width < 768;
    let yaw = mobile ? Math.sin(t * 0.32) * 0.5 : pointer.current.x * 0.62;
    yaw += Math.sin(t * 0.22) * 0.05;
    if (focus === "archive") yaw -= 0.5;
    if (focus === "chronicle") yaw += Math.sin(t * 0.45) * 0.35;
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, yaw, 3.1, dt);
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      (mode === "flight" ? -0.42 : -0.04) + pointer.current.y * -0.08,
      3,
      dt,
    );
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, mode === "flight" ? pointer.current.x * -0.06 : 0, 3, dt);
    const bob = reduce.current ? 0 : Math.sin(t * 1.4) * 0.055;
    group.position.y = THREE.MathUtils.damp(group.position.y, 0.06 + bob + flight.current * 0.32, 3, dt);

    if (uni.current) {
      const a = blastAmt.current;
      uni.current.scale.y = THREE.MathUtils.damp(uni.current.scale.y, 0.02 + a * 1.2, 9, dt);
      uni.current.scale.x = 0.45 + a * 0.7;
      uni.current.scale.z = 0.45 + a * 0.7;
      uni.current.visible = uni.current.scale.y > 0.05;
    }
    if (gyro.current) {
      gyro.current.rotation.z += dt * (0.8 + flight.current * 3.5);
      gyroMat.opacity = 0.08 + flight.current * 0.55;
    }
  });

  const scale = 1.08 + suit.bulk * 0.1;

  return (
    <group ref={root} scale={scale}>
      <sprite position={[0, 1.35, -0.7]} scale={[3.1, 3.6, 1]} material={aura} />
      <Piece progress={progress} delay={0.02} from={[0, 1.4, 0]}>
        <HelmetShell />
      </Piece>
      <Piece progress={progress} delay={0.46} from={[0, 0.2, 0.85]}>
        <Faceplate progress={progress} />
      </Piece>
      <Piece progress={progress} delay={0.08} from={[0, 0.2, 0.95]}>
        <Torso thrust={thrust} />
      </Piece>
      <Piece progress={progress} delay={0.18} from={[-1.25, 0.35, 0.2]}>
        <Arm side={-1} flight={flight} blastAmt={blastAmt} />
      </Piece>
      <Piece progress={progress} delay={0.24} from={[1.25, 0.35, 0.2]}>
        <Arm side={1} flight={flight} blastAmt={blastAmt} />
      </Piece>
      <Piece progress={progress} delay={0.14} from={[-0.45, -1.15, 0]}>
        <Leg side={-1} thrust={thrust} />
      </Piece>
      <Piece progress={progress} delay={0.2} from={[0.45, -1.15, 0]}>
        <Leg side={1} thrust={thrust} />
      </Piece>
      <group ref={uni} position={[0, 1.5, 0.24]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.02, 1]}>
        <mesh position={[0, 1.15, 0]}>
          <cylinderGeometry args={[0.015, 0.18, 2.3, 18, 1, true]} />
          <meshBasicMaterial
            color="#f4fdff"
            transparent
            opacity={0.72}
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 1.15, 0]}>
          <cylinderGeometry args={[0.006, 0.035, 2.3, 10]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.95} toneMapped={false} />
        </mesh>
      </group>
      <mesh ref={gyro} position={[0, 1.16, 0]} rotation={[Math.PI / 2, 0, 0]} material={gyroMat}>
        <torusGeometry args={[0.72, 0.008, 8, 64]} />
      </mesh>
      <ScanLine scan={scan} />
      <Embers color={suit.trim} thrust={thrust} />
      <pointLight position={[0.2, 1.7, 0.8]} color="#fff4e2" intensity={1.4} distance={3.5} />
    </group>
  );
}
