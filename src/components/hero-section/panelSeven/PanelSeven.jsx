'use client';

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles.css";
import { getScenes } from "./scenes";
import EndingMusic from "@/components/ending/EndingMusic";

gsap.registerPlugin(ScrollTrigger);

const scenes = getScenes(window.innerWidth, window.innerHeight);

export default function PanelSeven() {
    const panelRef   = useRef(null);
    const overlayRef = useRef(null);
    const imagesRef  = useRef({});
    const textRef    = useRef({});
    const titleRef   = useRef({});
    const [musicOn, setMusicOn] = useState(false);

    useEffect(() => {
        // ── Auto-scroll state (all plain vars — no re-render needed) ──
        const panelStartY = { current: 0 };
        const autoTween   = { current: null };
        const resumeTimer = { current: null };
        let inPanel = false;

        const PANEL_DIST = 20000;
        const PX_PER_FRAME = 11; // ~660 px/s at 60 fps

        function startAutoScroll(easeIn = false) {
            if (autoTween.current) cancelAnimationFrame(autoTween.current);
            let frame = 0;
            const RAMP = easeIn ? 80 : 0; // frames to ease-in from 0 → PX_PER_FRAME

            function tick() {
                if (!inPanel) return;
                if (window.scrollY >= panelStartY.current + PANEL_DIST - 10) {
                    autoTween.current = null;
                    return;
                }
                frame++;
                const px = RAMP === 0
                    ? PX_PER_FRAME
                    : Math.min(PX_PER_FRAME, (frame / RAMP) * PX_PER_FRAME);
                window.scrollBy(0, px);
                autoTween.current = requestAnimationFrame(tick);
            }
            autoTween.current = requestAnimationFrame(tick);
        }

        function scheduleResume() {
            if (resumeTimer.current) clearTimeout(resumeTimer.current);
            resumeTimer.current = setTimeout(() => {
                if (inPanel && window.scrollY < panelStartY.current + PANEL_DIST) {
                    startAutoScroll(false);
                }
            }, 5000);
        }

        // Fires on every wheel / touch tick — debounces the resume timer
        function handleUserInput() {
            if (autoTween.current) { cancelAnimationFrame(autoTween.current); autoTween.current = null; }
            if (inPanel) scheduleResume();
        }

        function addListeners() {
            window.removeEventListener('wheel',      handleUserInput);
            window.removeEventListener('touchstart', handleUserInput);
            window.addEventListener('wheel',      handleUserInput, { passive: true });
            window.addEventListener('touchstart', handleUserInput, { passive: true });
        }

        function removeListeners() {
            window.removeEventListener('wheel',      handleUserInput);
            window.removeEventListener('touchstart', handleUserInput);
        }

        function teardown() {
            inPanel = false;
            if (autoTween.current)  { cancelAnimationFrame(autoTween.current); autoTween.current = null; }
            if (resumeTimer.current){ clearTimeout(resumeTimer.current); resumeTimer.current = null; }
            removeListeners();
        }

        // ─────────────────────────────────────────────────────────────
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
                    onEnter: () => {
                        inPanel = true;
                        panelStartY.current = window.scrollY;
                        setMusicOn(true);
                        addListeners();
                        startAutoScroll(true); // ease-in on first entry
                    },
                    onEnterBack: () => {
                        inPanel = true;
                        addListeners();
                        // user is scrolling back in manually — just schedule a resume
                        scheduleResume();
                    },
                    onLeaveBack: () => {
                        setMusicOn(false);
                        teardown();
                    },
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

        return () => { teardown(); ctx.revert(); };

    }, []);

    return (
        <section ref={panelRef} className="panel-seven">
            <div ref={overlayRef} className="p7-overlay" />
            {musicOn && <EndingMusic />}
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
