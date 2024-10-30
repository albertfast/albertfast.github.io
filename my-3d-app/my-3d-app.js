import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function RotatingBox() {
  const mesh = useRef();

  // Animation loop
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'orange'} />
    </mesh>
  );
}

export default function My3DApp() {
  return (
    <Canvas style={{ height: '500px', background: '#202020' }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <RotatingBox />
    </Canvas>
  );
}
