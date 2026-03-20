'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { startBlackHoleDrone, stopBlackHoleDrone } from '@/lib/sounds'

const PARTICLE_COUNT = 1200
const RING_COUNT = 5

// Accretion disk particles
function AccretionDisk({ isMobile, hovered }) {
  const pointsRef = useRef()
  const count = isMobile ? Math.floor(PARTICLE_COUNT * 0.5) : PARTICLE_COUNT

  const { positions, velocities, baseRadii, currentRadii, angles } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count)
    const baseRadii = new Float32Array(count)
    const currentRadii = new Float32Array(count)
    const angles = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const r = 1.2 + Math.random() * 3.5
      const angle = Math.random() * Math.PI * 2
      const ySpread = (Math.random() - 0.5) * 0.15 * (1 / (r * 0.5))

      positions[i * 3] = Math.cos(angle) * r
      positions[i * 3 + 1] = ySpread
      positions[i * 3 + 2] = Math.sin(angle) * r

      velocities[i] = (0.3 + Math.random() * 0.7) / (r * 0.6)
      baseRadii[i] = r
      currentRadii[i] = r
      angles[i] = angle
    }

    return { positions, velocities, baseRadii, currentRadii, angles }
  }, [count])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position.array

    for (let i = 0; i < count; i++) {
      // Lerp radius: shrink inward when hovered, restore when not
      const targetR = hovered ? baseRadii[i] * 0.25 : baseRadii[i]
      currentRadii[i] += (targetR - currentRadii[i]) * 2.5 * delta

      // Speed up orbit when spiraling in
      const speedMult = hovered ? 3.0 : 1.0
      angles[i] += velocities[i] * speedMult * delta

      const r = currentRadii[i]
      pos[i * 3] = Math.cos(angles[i]) * r
      // Flatten disk more when collapsing
      const yScale = hovered ? 0.3 : 1.0
      pos[i * 3 + 1] *= (1 - 2 * delta) // dampen Y toward 0 over time
      pos[i * 3 + 1] += (Math.random() - 0.5) * 0.01 * yScale
      pos[i * 3 + 2] = Math.sin(angles[i]) * r
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#000000"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// Gravitational lensing rings
function LensingRings() {
  const ringsRef = useRef([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    ringsRef.current.forEach((ring, i) => {
      if (!ring) return
      ring.rotation.x = Math.PI / 2 + Math.sin(t * 0.15 + i * 0.9) * 0.35
      ring.rotation.z = t * 0.05 * (i % 2 === 0 ? 1 : -1)
    })
  })

  return (
    <>
      {Array.from({ length: RING_COUNT }, (_, i) => {
        const radius = 1.4 + i * 0.5
        return (
          <mesh
            key={i}
            ref={el => { ringsRef.current[i] = el }}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[radius, 0.01, 8, 128]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={0.15 - i * 0.02}
            />
          </mesh>
        )
      })}
    </>
  )
}

// Pitch-black event horizon sphere with hover hitbox
function EventHorizon({ onPointerOver, onPointerOut }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    const s = 0.95 + Math.sin(t * 0.5) * 0.05
    meshRef.current.scale.setScalar(s)
  })

  return (
    <mesh
      ref={meshRef}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <sphereGeometry args={[0.8, 64, 64]} />
      <meshBasicMaterial color="#000000" />
    </mesh>
  )
}

// Rest position and hover target
const REST_POS = new THREE.Vector3(3, 2.5, -4)
const HOVER_POS = new THREE.Vector3(1.5, 1.8, 1.5)

export default function BlackHole({ isMobile, lightsRef }) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const targetPos = useRef(new THREE.Vector3().copy(REST_POS))
  const currentPos = useRef(new THREE.Vector3().copy(REST_POS))

  // Store original light intensities
  const originalLights = useRef({ ambient: 0.15, directional: 1.5 })

  const handleOver = () => {
    setHovered(true)
    document.body.style.cursor = 'pointer'
    try { startBlackHoleDrone() } catch {}

    // Capture current intensities on first hover
    if (lightsRef?.ambient?.current) {
      originalLights.current.ambient = lightsRef.ambient.current.intensity
    }
    if (lightsRef?.directional?.current) {
      originalLights.current.directional = lightsRef.directional.current.intensity
    }
  }

  const handleOut = () => {
    setHovered(false)
    document.body.style.cursor = ''
    try { stopBlackHoleDrone() } catch {}
  }

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    // Set target based on hover
    if (hovered) {
      targetPos.current.copy(HOVER_POS)
    } else {
      // Drift around rest position
      targetPos.current.set(
        REST_POS.x + Math.sin(t * 0.08) * 0.8,
        REST_POS.y + Math.cos(t * 0.06) * 0.4,
        REST_POS.z
      )
    }

    // Smooth lerp to target
    const lerpSpeed = hovered ? 1.8 : 1.2
    currentPos.current.lerp(targetPos.current, lerpSpeed * delta)
    groupRef.current.position.copy(currentPos.current)

    // Rotation
    groupRef.current.rotation.y = t * 0.03
    groupRef.current.rotation.x = Math.sin(t * 0.04) * 0.15

    // Dim/restore lights
    const dimFactor = hovered ? 0.15 : 1.0
    if (lightsRef?.ambient?.current) {
      const targetIntensity = originalLights.current.ambient * dimFactor
      lightsRef.ambient.current.intensity = THREE.MathUtils.lerp(
        lightsRef.ambient.current.intensity,
        targetIntensity,
        3 * delta
      )
    }
    if (lightsRef?.directional?.current) {
      const targetIntensity = originalLights.current.directional * dimFactor
      lightsRef.directional.current.intensity = THREE.MathUtils.lerp(
        lightsRef.directional.current.intensity,
        targetIntensity,
        3 * delta
      )
    }
  })

  return (
    <group ref={groupRef} position={[REST_POS.x, REST_POS.y, REST_POS.z]}>
      <EventHorizon onPointerOver={handleOver} onPointerOut={handleOut} />
      <AccretionDisk isMobile={isMobile} hovered={hovered} />
      <LensingRings />
    </group>
  )
}
