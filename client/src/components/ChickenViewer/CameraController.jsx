import { useFrame } from "@react-three/fiber";

export default function CameraController() {
  useFrame((state) => {
    const { camera, pointer } = state;
    const targetX = pointer.x * 0.6;
    const targetY = 1.3 + pointer.y * 0.25;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0.1, 0);
  });

  return null;
}
