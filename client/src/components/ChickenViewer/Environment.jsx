import { ContactShadows, Sparkles } from "@react-three/drei";

export default function Environment({ isMobile }) {
  return (
    <>
      {!isMobile && (
        <ContactShadows position={[0, -1.05, 0]} opacity={0.35} blur={2.6} far={2.2} scale={6} color="#26221d" />
      )}

      {/* ambient floating particles, always on but very subtle */}
      <Sparkles count={isMobile ? 12 : 26} scale={[5, 3, 3]} size={1.6} speed={0.25} opacity={0.35} color="#ffb98a" />

      {/* minimal geometric shapes for depth, kept small/subtle and fully in-frame */}
      {!isMobile && (
        <>
          <mesh position={[-1.7, 1.0, -3.4]} rotation={[0.4, 0.3, 0]}>
            <torusGeometry args={[0.4, 0.1, 16, 40]} />
            <meshStandardMaterial color="#ffd9b8" roughness={0.6} transparent opacity={0.3} />
          </mesh>
          <mesh position={[1.7, -0.5, -3.6]} rotation={[0.2, -0.4, 0.2]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#cfe3d4" roughness={0.7} transparent opacity={0.25} />
          </mesh>
        </>
      )}
    </>
  );
}
