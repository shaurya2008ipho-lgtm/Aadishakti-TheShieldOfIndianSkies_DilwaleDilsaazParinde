import { Suspense, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  Bounds,
  Environment,
  Html,
  OrbitControls,
  useGLTF,
} from '@react-three/drei'
import * as THREE from 'three'

interface EngineModelProps {
  egt: number
  thermal: boolean
}

function cloneEngineScene(scene: THREE.Object3D) {
  const cloned = scene.clone(true)

  cloned.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) {
      return
    }

    object.castShadow = true
    object.receiveShadow = true

    if (Array.isArray(object.material)) {
      object.material = object.material.map((material) =>
        material.clone(),
      )
    } else if (object.material) {
      object.material = object.material.clone()
    }
  })

  return cloned
}

function EngineModel({
  egt,
  thermal,
}: EngineModelProps) {
  const { scene } = useGLTF(
    '/models/aero_piston_engine.glb',
  )

  const model = useMemo(
    () => cloneEngineScene(scene),
    [scene],
  )

  /*
   * Thermal visualization:
   * We preserve the original engine materials and add a
   * temperature-dependent emissive / color overlay.
   */
  useEffect(() => {
    model.updateMatrixWorld(true)

    const engineBounds = new THREE.Box3().setFromObject(
      model,
    )

    const engineCenter = new THREE.Vector3()
    const engineSize = new THREE.Vector3()

    engineBounds.getCenter(engineCenter)
    engineBounds.getSize(engineSize)

    const halfLength = Math.max(
      engineSize.x / 2,
      0.001,
    )

    const globalHeat = THREE.MathUtils.clamp(
      (egt - 600) / 330,
      0,
      1,
    )

    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) {
        return
      }

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material]

      const worldPosition = new THREE.Vector3()

      object.getWorldPosition(worldPosition)

      /*
       * Make the central engine region hotter than the
       * outer sections, giving a more natural thermal
       * distribution.
       */
      const distanceFromCenter =
        Math.abs(
          worldPosition.x - engineCenter.x,
        ) / halfLength

      const centralHeat = THREE.MathUtils.clamp(
        1 - distanceFromCenter,
        0,
        1,
      )

      const heatLevel = THREE.MathUtils.clamp(
        globalHeat * 0.65 +
          centralHeat * 0.35,
        0,
        1,
      )

      /*
       * Blue → Cyan → Green → Yellow → Orange → Red
       */
      const heatColor = new THREE.Color().setHSL(
        0.62 - 0.62 * heatLevel,
        0.9,
        0.5,
      )

      materials.forEach((material) => {
        if (
          !(
            material instanceof
              THREE.MeshStandardMaterial ||
            material instanceof
              THREE.MeshPhysicalMaterial
          )
        ) {
          return
        }

        /*
         * Save the original material color only once.
         */
        if (!material.userData.aadiOriginalColor) {
          material.userData.aadiOriginalColor =
            material.color.clone()
        }

        const originalColor =
          material.userData.aadiOriginalColor as THREE.Color

        if (thermal) {
          material.color
            .copy(originalColor)
            .lerp(
              heatColor,
              0.15 + heatLevel * 0.4,
            )

          material.emissive.copy(heatColor)

          material.emissiveIntensity =
            0.08 + heatLevel * 1.05
        } else {
          material.color.copy(originalColor)
          material.emissive.set('#000000')
          material.emissiveIntensity = 0
        }

        material.needsUpdate = true
      })
    })
  }, [model, egt, thermal])

  return (
    <primitive
      object={model}
      scale={1}
      position={[0, -0.2, 0]}
      rotation={[0, 0, 0]}
    />
  )
}

function LoadingEngine() {
  return (
    <Html center>
      <div className="engine-loading">
        Loading Digital Twin...
      </div>
    </Html>
  )
}

export function EngineTwin({
  egt,
  mode = '3d',
}: {
  egt: number
  mode?: '3d' | 'thermal'
}) {
  const thermal = mode === 'thermal'

  return (
    <div className="twin-canvas">

      <Canvas
        camera={{
          position: [5.2, 3.2, 6.8],
          fov: 42,
        }}
        dpr={[1, 2]}
        shadows
      >

        <color
          attach="background"
          args={['#020e1c']}
        />

        <ambientLight intensity={0.85} />

        <directionalLight
          position={[5, 7, 6]}
          intensity={2.3}
          castShadow
        />

        <directionalLight
          position={[-4, 2, -3]}
          intensity={1.1}
        />

        <pointLight
          position={[0, 1.5, 3]}
          intensity={thermal ? 5 : 2.5}
          distance={10}
          color={
            thermal
              ? '#ff7138'
              : '#36bfff'
          }
        />

        <pointLight
          position={[-2, 0, -2]}
          intensity={2}
          distance={8}
          color="#1687ff"
        />

        <Suspense fallback={<LoadingEngine />}>

          <Bounds
            fit
            clip
            observe
            margin={1.18}
          >
            <EngineModel
              egt={egt}
              thermal={thermal}
            />
          </Bounds>

          <Environment preset="city" />

        </Suspense>

        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={3.5}
          maxDistance={9}
          autoRotate={!thermal}
          autoRotateSpeed={0.45}
          minPolarAngle={0.45}
          maxPolarAngle={2.35}
        />

        <gridHelper
          args={[
            10,
            20,
            '#0b3a57',
            '#062337',
          ]}
          position={[0, -1.55, 0]}
        />

      </Canvas>

      {thermal && (
        <div className="thermal-scale">

          <div className="thermal-title">
            TEMPERATURE
          </div>

          <span>900°C</span>

          <i />

          <span>700°C</span>

          <i />

          <span>500°C</span>

          <i />

          <span>300°C</span>

          <i />

          <span>100°C</span>

        </div>
      )}

    </div>
  )
}

useGLTF.preload(
  '/models/aero_piston_engine.glb',
)