'use client'

import { Canvas } from '@react-three/fiber'

const CanvasComponent = () => {
  return (
    <div className="h-screen w-screen">
      <Canvas>
        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[0, 0, 5]} />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
      </Canvas>
    </div>
  )
}

export default CanvasComponent
