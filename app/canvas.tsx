'use client'

import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { OrthographicCamera } from "@react-three/drei";
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUvs;

  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUvs = uv;
  }
`

const fragmentShader = `
  precision mediump float;

  //Our input texture
  uniform sampler2D uTexture;
  varying vec2 vUvs;

  void main() {
    //special method to sample from texture
    vec4 initTexture = texture2D(uTexture, vUvs);

  vec3 colour = initTexture.rgb;

  gl_FragColor = vec4(colour, 1.0);
}
`

function createDataTexture(width: number, height: number) {
  const size = width * height;
  const data = new Uint8Array(4 * size);

  for (let i = 0; i < size; i++) {
    const stride = i * 4;

    if (Math.random() < 0.5) {
      data[stride] = 255;
      data[stride + 1] = 255;
      data[stride + 2] = 255;
      data[stride + 3] = 255;
    } else {
      data[stride] = 0;
      data[stride + 1] = 0;
      data[stride + 2] = 0;
      data[stride + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(
    data,
    width,
    height,
    THREE.RGBAFormat
  );

  texture.needsUpdate = true;

  return texture;
}

type Uniforms = {
  uTexture: { value: THREE.DataTexture },
  uResolution: { value: THREE.Vector3 }
}

const CanvasComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number, height: number }>({ width: 100, height: 100 })
  const [uniforms, setUniforms] = useState<Uniforms | null>(null)

  useLayoutEffect(() => {
    if (!ref?.current) return;
    const rect = ref?.current?.getBoundingClientRect();

    setSize({ width: rect.width, height: rect.height });
  }, []);

  useEffect(() => {
    setUniforms(
      {
        uTexture: {
          value: createDataTexture(size.width, size.height)
        },
        uResolution: {
          value:
            new THREE.Vector3(
              size.width,
              size.height,
              1)
        }
      }
    )
  }, [size])


  return (
    <div ref={ref} className="h-screen w-screen">
      <Canvas>
        <ambientLight intensity={1} />
        <OrthographicCamera
          makeDefault
          left={-1}
          right={1}
          top={1}
          bottom={-1}
          near={0}
          far={1}
        />
        <mesh>
          <planeGeometry args={[2, 2]} />
          {
            uniforms && <shaderMaterial
              uniforms={uniforms}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
            />
          }

        </mesh>
      </Canvas>
    </div >
  )
}

export default CanvasComponent
