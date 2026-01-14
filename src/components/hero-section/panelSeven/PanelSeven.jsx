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
    const textRef = useRef({});
    const titleRef = useRef({});

    useEffect(() => {

        const ctx = gsap.context(() => {

            Object.values(imagesRef.current).forEach((el) =>
                gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 })
            );

            Object.values(textRef.current).forEach((el) =>
                gsap.set(el, { opacity: 0 })
            );

            Object.values(titleRef.current).forEach((el) =>
                gsap.set(el, { opacity: 0 })
            );

            gsap.set(overlayRef.current, {
                scaleX: 0,
                scaleY: 0,
                backgroundColor: "#000",
                transformOrigin: "50% 50%",
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: panelRef.current,
                    start: "top top",
                    end: "+=20000",
                    pin: true,
                    scrub: 1,
                },
            });

            tl.to(overlayRef.current, {
                scaleX: 1,
                scaleY: 1,
                duration: 1,
                ease: "power2.out",
            })
            .to(overlayRef.current, {
                backgroundColor: "#E5DDD3",
                duration: 0.6,
            });

            scenes.forEach((scene, i) => {
                const label = `scene-${i}`;
                tl.addLabel(label);

                /* ---------- TITLE ---------- */
                const titleEl = titleRef.current[scene.title.text];
                if (titleEl) {
                    tl.fromTo(
                        titleEl,
                        scene.title.from,
                        { ...scene.title.to, duration: 1 },
                        label
                    );

                    tl.to(
                        titleEl,
                        { ...scene.title.exit, duration: 0.8 },
                        `${label}+=${scene.title.hold}`
                    );
                }

                /* ---------- ITEMS (images + text) ---------- */
                scene.items.forEach((item) => {
                    const el =
                        item.type === "image"
                            ? imagesRef.current[item.id]
                            : textRef.current[item.id];

                    if (!el) return;

                    // ENTER
                    tl.fromTo(
                        el,
                        item.from,
                        { ...item.to, duration: 2, ease: "power3.out" },
                        `${label}+=${scene.title.hold + 0.5}`
                    );

                    // EXIT
                    tl.to(
                        el,
                        { ...item.exit, duration: 1.5, ease: "power3.in" },
                        `${label}+=${scene.title.hold + item.hold}`
                    );
                });

                // scene pause
                tl.to({}, { duration: 1 });
            });

        }, panelRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={panelRef} className="panel-seven">
            <div ref={overlayRef} className="p7-overlay" />
            {/*<div className="debug-grid" />*/}

            {scenes.map((scene, i) => (
                <h2
                    key={scene.title.text + i}
                    ref={(el) => el && (titleRef.current[scene.title.text] = el)}
                    className="scene-title"
                >
                    {scene.title.text}
                </h2>
            ))}

            {scenes.flatMap((s) => s.items).map((item, i) => {
                if (item.type === "image") {
                    return (
                        <img
                            key={item.id + i}
                            ref={(el) => el && (imagesRef.current[item.id] = el)}
                            src={item.path}
                            className={`p7-image ${item.id.split('.')[0]}`}
                            alt=""
                        />
                    );
                }

                if (item.type === "text") {
                    return (
                        <p
                            key={item.id + i}
                            ref={(el) => el && (textRef.current[item.id] = el)}
                            className="scene-text"
                        >
                            {item.text}
                        </p>
                    );
                }

                return null;
            })}
        </section>
    );
}
