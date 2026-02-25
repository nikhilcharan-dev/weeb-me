'use client'
import * as THREE from "three"

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

import {Canvas, useThree} from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Avatar from "@/components/3DComponents/Avatar/Avatar";


import Cursor from "@/components/cursor/Cursor";
import HorizontalScroll from "@/components/horizontalScroll/HorizontalScroll";
import EndingOverlay from '@/components/ending/EndingOverlay';

import './styles.css'

gsap.registerPlugin(TextPlugin, ScrollTrigger);

export default function Home() {

    const [showEnding, setShowEnding] = useState(false);

    useEffect(() => {

        fetch("/api/view", {
            method: "POST",
        });

        const key = "nova-portfolio-visits";
        const prev = Number(localStorage.getItem(key) || Math.random() * (10 ** 3));
        const next = prev + 1;
        localStorage.setItem(key, next.toString());

        gsap.fromTo(
            ".visit-count",
            { innerText: 0 },
            {
                innerText: next,
                duration: 1.5,
                ease: "power2.out",
                snap: { innerText: 1 },
            }
        );

        gsap.fromTo(
            ".welcome-text",
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                x: -10,
                duration: 1,
                ease: "power2.out",
            }
        );

        const tl = gsap.timeline();

        tl.to(".title", {
            filter: "blur(8px)",
            duration: 0.1,
        })
        .to(".title", {
            filter: "blur(0px)",
            duration: 0.6,
        })
        .to(".title", {
            text: "ようこそ",
            duration: 1,
            ease: "none",
            delay: 2,
        })
        .to(".scroll-text", {
            opacity: 1,
            ease: "power2.out",
            duration: 3
        })
        .to(".title", {
            text: "Welcome",
            duration: 1.5,
            delay: 1
        })
        .to(".scroll-text", {
            filter: "blur(8px)",
        }, "-=1")
        .to(".scroll-text", {
            opacity: 0,
            text: "Scroll to view",
        }, "-=0.5")
        .to(".scroll-text", {
            opacity: 1,
            filter: "blur(0px)",
        })

        ScrollTrigger.create({
            trigger: "#ending-trigger",
            start: "bottom+=100vh bottom",
            onEnter: () => {
                setShowEnding(true)
                fetch("/api/ending-visit", {
                    method: "POST",
                });
            },
            onEnterBack: () => {
                setShowEnding(true)
            },
            onLeaveBack: () => {
                setShowEnding(false)
            },
        });

    }, []);

    function CinematicCamera() {
        const { camera } = useThree();

        useEffect(() => {
            camera.lookAt(0.3, 1.4, 0); // slight offset right
        }, [camera]);

        return null;
    }

    return (
        <>
            <Cursor />

            <section className="section-default intro" data-cursor="black">

                <h1 className="welcome-text title">Yawwwn!!</h1>

                <div className="visit-counter">
                    <span className="visit-label">visits</span>
                    <span className="visit-count">0</span>
                </div>

                <div className="avatar-container">
                    <Canvas
                        shadows
                        dpr={[1,2]}
                        camera={{ position: [-0.5, 1.8, 4], fov: 40 }}
                        gl={{ antialias: true }}
                        onCreated={({ gl }) => {
                            gl.shadowMap.enabled = true
                            gl.shadowMap.type = THREE.PCFSoftShadowMap
                        }}
                    >
                        <ambientLight intensity={0.15} />

                        <directionalLight
                            position={[5, 8, 5]}
                            intensity={1.5}
                            castShadow
                            shadow-mapSize-width={4096}
                            shadow-mapSize-height={4096}
                            shadow-camera-near={1}
                            shadow-camera-far={25}
                            shadow-camera-left={-6}
                            shadow-camera-right={6}
                            shadow-camera-top={6}
                            shadow-camera-bottom={-6}
                            shadow-bias={-0.0001}
                            shadow-normalBias={0.02}
                        />

                        <group position={[-1.3, 0.3, 0]}>
                            <Avatar />
                            <mesh
                                rotation={[-Math.PI / 2, 0, 0]}
                                position={[0, 0, 0]}
                                receiveShadow
                            >
                                <planeGeometry args={[20, 20]} />
                                <shadowMaterial transparent opacity={0.35} />
                            </mesh>
                        </group>

                        <CinematicCamera />

                        <Environment preset="sunset" />
                    </Canvas>
                </div>

                <p className="scroll-text">スクロールしてください</p>

            </section>

            <HorizontalScroll />

            <section style={{ height: "2000vh" }} />

            <section
                id="ending-trigger"
                style={{ height: "600vh" }}
            />

            {showEnding && (
                <section
                    id="ending"
                    className="ending-section">
                    <EndingOverlay />
                </section>
            )}

            <section style={{ height: "50vh" }} />

        </>
    );
}