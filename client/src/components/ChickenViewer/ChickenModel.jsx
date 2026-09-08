import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Sparkles } from "@react-three/drei";

useGLTF.preload("/models/chicken.glb");

const MODEL_URL = "/models/chicken.glb";

// The model's raw bounding box (read from its glTF accessor): X -0.287..1.171,
// Y -0.681..1.401, Z -0.943..0.943. These constants recenter it on X/Z and
// rest its feet on Y=0, at a scale that reads well against the rest of the
// scene, independent of the per-frame animation below.
const BASE_SCALE = 0.58;
const RECENTER = [-0.44 * BASE_SCALE, 0.681 * BASE_SCALE, 0];

// Real, licensed low-poly model (single merged mesh, no separate head/wing
// nodes) — so it's animated as one rigid body: idle bob/sway, a yaw/tilt
// toward the cursor, a jump-and-peck on click, and a whole-body reaction
// (happy hop vs. a slow droop) whenever the selected day's status changes.
export default function ChickenModel({ status = "allowed", dateISO, isMobile, onReact }) {
  const groupRef = useRef();
  const { scene } = useGLTF(MODEL_URL);
  const model = useMemo(() => scene.clone(true), [scene]);

  const [hovered, setHovered] = useState(false);
  const anim = useRef({ kind: null, start: 0, duration: 0.6 });
  const pending = useRef("happy");

  useEffect(() => {
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [model]);

  // Trigger a reaction whenever the selected day's status changes.
  useEffect(() => {
    pending.current = status === "restricted" ? "shake" : "happy";
  }, [status, dateISO]);

  const handleClick = (e) => {
    e.stopPropagation();
    pending.current = "jump";
    onReact?.(status === "restricted" ? "sad" : "happy");
  };

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const { pointer } = state;
    const group = groupRef.current;
    if (!group) return;

    if (pending.current) {
      anim.current = {
        kind: pending.current,
        start: t,
        duration: pending.current === "shake" ? 0.9 : 0.6,
      };
      pending.current = null;
    }

    let jumpOffset = 0;
    let peckTilt = 0;
    let shakeYaw = 0;

    if (anim.current.kind) {
      const progress = Math.min((t - anim.current.start) / anim.current.duration, 1);
      if (anim.current.kind === "jump" || anim.current.kind === "happy") {
        jumpOffset = Math.sin(progress * Math.PI) * 0.28;
        peckTilt = Math.sin(progress * Math.PI * 3) * 0.16 * (1 - progress);
      } else if (anim.current.kind === "shake") {
        shakeYaw = Math.sin(progress * Math.PI * 6) * 0.18 * (1 - progress);
      }
      if (progress >= 1) anim.current.kind = null;
    }

    const restricted = status === "restricted";
    const bob = Math.sin(t * 1.6) * (restricted ? 0.02 : 0.045);

    group.position.y = -0.55 + bob + jumpOffset;

    const baseYaw = pointer.x * 0.4 + shakeYaw;
    const baseTilt = (restricted ? 0.12 : 0) + peckTilt - pointer.y * 0.04;
    group.rotation.y += (baseYaw - group.rotation.y) * 0.06;
    group.rotation.x += (baseTilt - group.rotation.x) * 0.08;

    const targetScale = hovered ? 1.08 : 1;
    group.scale.x += (targetScale - group.scale.x) * 0.12;
    group.scale.y += (targetScale - group.scale.y) * 0.12;
    group.scale.z += (targetScale - group.scale.z) * 0.12;
  });

  return (
    <group
      ref={groupRef}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      <group position={RECENTER} scale={BASE_SCALE}>
        <primitive object={model} />
      </group>
      {hovered && !isMobile && (
        <Sparkles count={22} scale={1.6} size={2.2} speed={0.5} color="#ff9a62" position={[0, 1, 0]} />
      )}
    </group>
  );
}
