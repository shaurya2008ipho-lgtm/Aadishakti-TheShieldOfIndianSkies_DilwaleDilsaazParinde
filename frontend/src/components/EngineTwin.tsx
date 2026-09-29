import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo } from 'react'

function Engine({ heat }: { heat: number }) {
  const hot = useMemo(() => new THREE.Color().setHSL(Math.max(0, 0.62 - Math.min(1, heat) * 0.62), 1, 0.52), [heat])
  return <group rotation={[0.12, 0.2, -0.04]}>
    <mesh position={[-0.8, 0, 0]}>
      <cylinderGeometry args={[0.95, 0.95, 2.9, 48]} />
      <meshStandardMaterial color="#a8c8d8" metalness={0.85} roughness={0.28} transparent opacity={0.95} />
    </mesh>
    {[1.0, 1.55, 2.1].map((x) => <mesh key={x} position={[x - 1.7, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      <torusGeometry args={[0.95 + (x - 1) * 0.05, 0.08, 18, 48]} />
      <meshStandardMaterial color="#3b86bd" metalness={0.8} roughness={0.22} />
    </mesh>)}
    <mesh position={[0.15, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      <cylinderGeometry args={[0.58, 0.78, 1.3, 48]} />
      <meshStandardMaterial color={hot} emissive={hot} emissiveIntensity={0.32} metalness={0.35} roughness={0.38} />
    </mesh>
    {[-0.85, -0.4, 0.05, 0.5].map((y, i) => <mesh key={i} position={[0.2, y, 0.72]} rotation={[0, 0.25, 0]}>
      <boxGeometry args={[0.46, 0.12, 0.22]} />
      <meshStandardMaterial color="#d8e8f2" metalness={0.75} roughness={0.3} />
    </mesh>)}
    <mesh position={[1.2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      <cylinderGeometry args={[0.68, 0.68, 0.9, 48]} />
      <meshStandardMaterial color="#b7d3df" metalness={0.9} roughness={0.22} />
    </mesh>
    <mesh position={[2.05, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      <coneGeometry args={[0.48, 1.15, 48]} />
      <meshStandardMaterial color="#a7c3cf" metalness={0.92} roughness={0.18} />
    </mesh>
    <group position={[2.65, 0, 0]} rotation={[0.2, 0.1, 0]}>
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((r) => <mesh key={r} rotation={[0, 0, r]}>
        <boxGeometry args={[2.0, 0.12, 0.12]} />
        <meshStandardMaterial color="#dcebf4" metalness={0.86} roughness={0.2} />
      </mesh>)}
    </group>
    <mesh position={[-2.25, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      <cylinderGeometry args={[0.55, 0.55, 0.5, 48]} />
      <meshStandardMaterial color="#7c9bad" metalness={0.8} roughness={0.3} />
    </mesh>
  </group>
}

export function EngineTwin({ egt, mode = '3d' }: { egt: number; mode?: '3d' | 'thermal' }) {
  const heat = Math.max(0, Math.min(1, (egt - 650) / 300))
  return <div className="twin-canvas">
    <Canvas camera={{ position: [5, 2.7, 6.2], fov: 43 }} dpr={[1, 2]}>
      <color attach="background" args={["#041226"]} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 4, 6]} intensity={2.0} />
      <pointLight position={[0, 0, 2]} intensity={8} distance={10} color={mode === 'thermal' ? '#ff6622' : '#46b9ff'} />
      <Engine heat={mode === 'thermal' ? heat : 0.3} />
      <Environment preset="city" />
      <OrbitControls enablePan={false} minDistance={4.5} maxDistance={8} autoRotate autoRotateSpeed={0.55} />
    </Canvas>
    {mode === 'thermal' && <div className="thermal-scale"><span>900</span><i/><span>700</span><i/><span>500</span><i/><span>300</span><i/><span>100</span></div>}
  </div>
}
