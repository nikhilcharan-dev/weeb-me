'use client'

import React, { useEffect, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, useFBX } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'

useGLTF.preload('/models/me.glb')

export default function Avatar({
                                   position = [0, 0, 0],
                                   scale = 1,
                               }) {

    const group = useRef()
    const currentAction = useRef(null)
    const introFinished = useRef(false)
    const mixerRef = useRef(null)

    // ---------------- MODEL ----------------
    const { scene } = useGLTF('/models/me.glb')

    const clone = useMemo(() => {
        const cloned = SkeletonUtils.clone(scene)
        cloned.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        return cloned
    }, [scene])

    // ---------------- ANIMATIONS ----------------
    const introFBX = useFBX('/animations/Intro.fbx')
    const idleFBX = useFBX('/animations/Idle.fbx')
    const interactFBX = useFBX('/animations/Interact.fbx')

    introFBX.animations[0].name = "Intro"
    idleFBX.animations[0].name = "Idle"
    interactFBX.animations[0].name = "Interact"

    const animations = useMemo(() => [
        introFBX.animations[0],
        idleFBX.animations[0],
        interactFBX.animations[0],
    ], [introFBX, idleFBX, interactFBX])

    const { actions, mixer } = useAnimations(animations, group)

    useEffect(() => {
        mixerRef.current = mixer
    }, [mixer])

    // ---------------- HARD PLAY FUNCTION ----------------
    const playAction = (name, loop = THREE.LoopRepeat) => {
        if (!actions) return

        Object.values(actions).forEach(action => {
            action.stop()
            action.enabled = false
            action.setEffectiveWeight(0)
        })

        const next = actions[name]
        if (!next) return

        next.reset()
        next.enabled = true
        next.setEffectiveWeight(1)
        next.setEffectiveTimeScale(1)
        next.setLoop(loop, loop === THREE.LoopRepeat ? Infinity : 1)
        next.clampWhenFinished = loop !== THREE.LoopRepeat
        next.play()

        currentAction.current = next
    }

    // ---------------- INTRO AUTO PLAY ----------------
    useEffect(() => {
        if (!actions || !mixerRef.current) return
        if (introFinished.current) return

        const intro = actions["Intro"]
        const idle = actions["Idle"]

        if (!intro || !idle) return

        playAction("Intro", THREE.LoopOnce)

        const handleFinish = (e) => {
            if (e.action === intro) {
                introFinished.current = true
                playAction("Idle", THREE.LoopRepeat)
            }
        }

        mixerRef.current.addEventListener("finished", handleFinish)

        return () => {
            mixerRef.current?.removeEventListener("finished", handleFinish)
        }

    }, [actions])

    // ---------------- INTERACT ON HOVER ----------------
    const handlePointerOver = () => {
        if (!introFinished.current) return
        if (!actions) return

        const interact = actions["Interact"]
        if (!interact) return

        playAction("Interact", THREE.LoopOnce)

        const handleFinish = (e) => {
            if (e.action === interact) {
                playAction("Idle", THREE.LoopRepeat)
            }
        }

        mixerRef.current?.addEventListener("finished", handleFinish)

        setTimeout(() => {
            mixerRef.current?.removeEventListener("finished", handleFinish)
        }, interact._clip.duration * 1000)
    }

    // ---------------- LOOK AT MOUSE (Only After Intro) ----------------
    const headTarget = useRef(new THREE.Vector3())
    const currentLook = useRef(new THREE.Vector3())

    useFrame((state) => {
        if (!group.current) return
        if (!introFinished.current) return

        const head = group.current.getObjectByName("Head")
        if (!head) return

        headTarget.current.set(
            state.mouse.x * 2,
            1.5 + state.mouse.y * 1.5,
            4
        )

        currentLook.current.lerp(headTarget.current, 0.08)
        head.lookAt(currentLook.current)
    })

    return (
        <group
            ref={group}
            position={position}
            scale={scale}
            onPointerOver={handlePointerOver}
            dispose={null}
        >
            <primitive object={clone} />
        </group>
    )
}