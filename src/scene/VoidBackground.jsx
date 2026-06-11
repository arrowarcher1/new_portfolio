import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

// Giant inward-facing sphere painted with drifting aurora bands.
// Follows the camera so the journey never reaches its edge.

const vertexShader = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vDir;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int k = 0; k < 4; k++) {
      v += a * noise(p);
      p *= 2.1;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // Spherical coords: x = longitude, y = latitude
    float lon = atan(vDir.z, vDir.x);
    float lat = asin(clamp(vDir.y, -1.0, 1.0));

    // Deep void base, slightly lighter toward the horizon
    vec3 base = mix(vec3(0.02, 0.008, 0.063), vec3(0.071, 0.031, 0.149), 1.0 - abs(lat) * 1.2);

    // Aurora curtains: warped horizontal bands
    float t = uTime * 0.03;
    float warp = fbm(vec2(lon * 1.5 + t, lat * 3.0 - t * 0.7));

    float band1 = smoothstep(0.35, 0.0, abs(lat - 0.25 + (warp - 0.5) * 0.55));
    float band2 = smoothstep(0.3, 0.0, abs(lat + 0.18 + (warp - 0.5) * -0.4));
    float band3 = smoothstep(0.25, 0.0, abs(lat - 0.55 + (warp - 0.5) * 0.3));

    vec3 fuchsia = vec3(0.851, 0.275, 0.937);
    vec3 cyan    = vec3(0.133, 0.827, 0.933);
    vec3 violet  = vec3(0.545, 0.361, 0.965);

    vec3 col = base;
    col += fuchsia * band1 * 0.16 * (0.7 + 0.3 * sin(t * 4.0 + lon * 2.0));
    col += cyan    * band2 * 0.12 * (0.7 + 0.3 * cos(t * 3.0 + lon * 3.0));
    col += violet  * band3 * 0.10;

    // Soft nebula glow patches
    float nebula = fbm(vec2(lon * 0.8 - t * 0.5, lat * 1.6 + t * 0.3));
    col += mix(fuchsia, violet, nebula) * pow(nebula, 3.0) * 0.14;

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function VoidBackground() {
  const mesh = useRef()
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
    if (mesh.current) {
      mesh.current.position.copy(state.camera.position)
    }
  })

  return (
    <mesh ref={mesh} frustumCulled={false}>
      <sphereGeometry args={[110, 48, 32]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}
