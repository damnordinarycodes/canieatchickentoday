import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function Lights({ isMobile }) {
  const rimLight = useRef();

  useFrame((state) => {
    if (!rimLight.current) return;
    const { pointer } = state;
    rimLight.current.position.x = -2 + pointer.x * 1.2;
    rimLight.current.position.y = 2 + pointer.y * 0.6;
  });

  return (
    <>
      <ambientLight intensity={1.15} color="#fff2e2" />
      <directionalLight
        position={[2.5, 4, 3]}
        intensity={1.6}
        color="#fff6ea"
        castShadow={!isMobile}
        shadow-mapSize-width={isMobile ? 512 : 1024}
        shadow-mapSize-height={isMobile ? 512 : 1024}
        shadow-camera-left={-2}
        shadow-camera-right={2}
        shadow-camera-top={2}
        shadow-camera-bottom={-2}
        shadow-camera-near={1}
        shadow-camera-far={8}
      />
      <pointLight ref={rimLight} position={[-2, 2, -2]} intensity={0.9} color="#ff9a62" />
      <pointLight position={[1.5, -1, 2]} intensity={0.4} color="#6f9c7d" />
      <pointLight position={[1, 1.5, 2.5]} intensity={0.7} color="#ffffff" />
    </>
  );
}
