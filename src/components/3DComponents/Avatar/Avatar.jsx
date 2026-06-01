'use client'

import { useEffect, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, useFBX } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'
import { playAvatarInteract } from '@/lib/sounds'

export default function Avatar({
    position = [0, 0, 0],
    scale = 1,
    isMobile = false,
}) {
    const group = useRef()
    const currentAction = useRef(null)
    const interactActionRef = useRef(null) // tracked separately from useAnimations actions
    const introFinished = useRef(false)
    const mixerRef = useRef(null)
    const interactClipRef = useRef(null)
    const loadingInteract = useRef(false)

    // ── MODEL ──────────────────────────────────────────────────
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

    // ── BASE ANIMATIONS (Intro + Idle only on initial load) ────
    const introFBX = useFBX('/animations/Intro.fbx')
    const idleFBX  = useFBX('/animations/Idle.fbx')

    introFBX.animations[0].name = 'Intro'
    idleFBX.animations[0].name  = 'Idle'

    const baseAnimations = useMemo(() => [
        introFBX.animations[0],
        idleFBX.animations[0],
    ], [introFBX, idleFBX])

    const { actions, mixer } = useAnimations(baseAnimations, group)

    useEffect(() => { mixerRef.current = mixer }, [mixer])

    // ── PLAY HELPER ────────────────────────────────────────────
    const playAction = (name, loop = THREE.LoopRepeat) => {
        if (!actions) return

        // Stop the dynamically-loaded interact action if it is running
        if (interactActionRef.current) {
            interactActionRef.current.stop()
            interactActionRef.current.enabled = false
            interactActionRef.current.setEffectiveWeight(0)
            interactActionRef.current = null
        }

        Object.values(actions).forEach(a => {
            a.stop()
            a.enabled = false
            a.setEffectiveWeight(0)
        })

        const next = actions[name]
        if (!next) return

        next.reset()
        next.enabled = true
        next.setEffectiveWeight(1)
        next.setEffectiveTimeScale(1)
        next.setLoop(loop, loop === THREE.LoopRepeat ? Infinity : 1)
        next.clampWhenFinished = false
        next.play()

        currentAction.current = next
    }

    // ── INTRO AUTO-PLAY ────────────────────────────────────────
    useEffect(() => {
        if (!actions || !mixerRef.current || introFinished.current) return

        const intro = actions['Intro']
        const idle  = actions['Idle']
        if (!intro || !idle) return

        playAction('Intro', THREE.LoopOnce)

        const onFinish = (e) => {
            if (e.action !== intro) return
            introFinished.current = true
            playAction('Idle', THREE.LoopRepeat)
        }

        mixerRef.current.addEventListener('finished', onFinish)
        return () => mixerRef.current?.removeEventListener('finished', onFinish)
    }, [actions])

    // ── INTERACT (lazy-loaded on first hover) ──────────────────
    const ensureInteractClip = async () => {
        if (interactClipRef.current) return interactClipRef.current
        if (loadingInteract.current) return null
        loadingInteract.current = true
        try {
            const { FBXLoader } = await import('three-stdlib')
            const fbx = await new FBXLoader().loadAsync('/animations/Interact.fbx')
            const clip = fbx.animations[0]
            clip.name = 'Interact'
            interactClipRef.current = clip
            return clip
        } catch {
            loadingInteract.current = false
            return null
        }
    }

    const handlePointerOver = async () => {
        if (!introFinished.current || !mixerRef.current || !group.current) return

        const clip = await ensureInteractClip()
        if (!clip) return

        // Stop all current actions cleanly
        if (interactActionRef.current) {
            interactActionRef.current.stop()
            interactActionRef.current.enabled = false
            interactActionRef.current.setEffectiveWeight(0)
        }
        Object.values(actions || {}).forEach(a => {
            a.stop()
            a.enabled = false
            a.setEffectiveWeight(0)
        })

        const interact = mixerRef.current.clipAction(clip, group.current)
        interact.reset()
        interact.enabled = true
        interact.setEffectiveWeight(1)
        interact.setEffectiveTimeScale(1)
        interact.setLoop(THREE.LoopOnce, 1)
        interact.clampWhenFinished = false // prevent pose-lock on last frame
        interact.play()

        interactActionRef.current = interact
        currentAction.current = interact

        try { playAvatarInteract() } catch {}

        const onFinish = (e) => {
            if (e.action !== interact) return
            mixerRef.current?.removeEventListener('finished', onFinish)
            interactActionRef.current = null
            playAction('Idle', THREE.LoopRepeat)
        }
        mixerRef.current.addEventListener('finished', onFinish)

        // Fallback cleanup in case 'finished' never fires
        setTimeout(() => {
            mixerRef.current?.removeEventListener('finished', onFinish)
        }, clip.duration * 1000 + 800)
    }

    // ── HEAD TRACKING ──────────────────────────────────────────
    const headTarget  = useRef(new THREE.Vector3())
    const currentLook = useRef(new THREE.Vector3())

    useFrame((state, delta) => {
        if (!group.current || !introFinished.current || isMobile) return

        const head = group.current.getObjectByName('Head')
        if (!head) return

        headTarget.current.set(
            state.mouse.x * 1.8,
            1.5 + state.mouse.y * 1.2,
            4
        )

        // Frame-rate independent exponential smoothing
        const t = 1 - Math.pow(0.05, delta * 3)
        currentLook.current.lerp(headTarget.current, t)
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

useGLTF.preload('/models/me.glb')
