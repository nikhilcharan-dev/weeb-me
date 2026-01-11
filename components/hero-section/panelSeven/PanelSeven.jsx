'use client';

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles.css";
import { scenes } from "./scenes";

gsap.registerPlugin(ScrollTrigger);

export default function PanelSeven() {
    const panelRef = useRef(null);
    const overlayRef = useRef(null);
    const imagesRef = useRef({});
    const timeline = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // 🔑 lock coordinate system (MATCHES TUNER)
            Object.values(imagesRef.current).forEach((img) => {
                gsap.set(img, {
                    xPercent: -50,
                    yPercent: -50,
                    opacity: 0,
                });
            });

            // overlay initial
            gsap.set(overlayRef.current, {
                width: "0%",
                height: "0%",
                backgroundColor: "#000",
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: panelRef.current,
                    start: "top top",
                    end: "+=3000", // tune freely
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                },
            });

            timeline.current = tl;

            // overlay animation
            tl.to(overlayRef.current, {
                width: "100%",
                height: "100%",
                duration: 1,
                ease: "power2.out",
            });

            tl.to(overlayRef.current, {
                backgroundColor: "#E5DDD3",
                duration: 0.6,
                ease: "power1.out",
            });

            // SCENES
            scenes.forEach((round, sceneIndex) => {
                const sceneLabel = `scene-${sceneIndex}`;
                tl.addLabel(sceneLabel);

                round.forEach((img) => {
                    const el = imagesRef.current[img.id];
                    if (!el) return;

                    // ENTER (parallel)
                    tl.fromTo(
                        el,
                        img.from,
                        { ...img.to, duration: 2, ease: "power3.out" },
                        sceneLabel
                    );

                    // EXIT (parallel)
                    tl.to(
                        el,
                        { ...img.exit, duration: 2, ease: "power3.in" },
                        `${sceneLabel}+=${2 + img.hold}`
                    );
                });

                // scene gap
                tl.to({}, { duration: 1 });
            });

        }, panelRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={panelRef} className="panel-seven">
            <div ref={overlayRef} className="p7-overlay" />
            {/*<div className="debug-grid" />*/}

            {scenes.flat().map((img) => (
                <img
                    key={img.id}
                    ref={(el) => el && (imagesRef.current[img.id] = el)}
                    src={img.path}
                    className="p7-image"
                    alt=""
                />
            ))}
        </section>
    );
}
