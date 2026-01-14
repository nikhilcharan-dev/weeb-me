'use client';

import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./styles.css";

export default function PanelSeven({ hsTimeline, timelineReady }) {
    const panelRef = useRef(null);

    useEffect(() => {
        if (!timelineReady || !hsTimeline?.current) return;

        const ctx = gsap.context(() => {

            /* =====================
               INITIAL STATES
            ====================== */

            gsap.set(".p7-item", {
                opacity: 0,
                y: 24,
            });

            gsap.set(".p7-name", {
                opacity: 0,
                y: 18,
            });

            const angelsFrom = {
                opacity: 0,
                x: 0,
                y: -130,
                scale: 0.95,
                rotation: 0,
            };

            const angelsTo = {
                opacity: 1,
                x: -60,
                y: -130,
                scale: 1,
                rotation: 0,
                duration: 1.6,
                ease: "power2.out",
            };

            // FLOWER IMAGE
            const decorFrom = {
                opacity: 0,
                x: 100,
                y: 500,
                scale: 0.9,
                rotation: -4,
            };

            const decorTo = {
                opacity: 1,
                x: 100,
                y: 500,
                scale: 1,
                rotation: 0,
                duration: 1.6,
                ease: "power2.out",
            };

            /* =====================
               TIMELINE REVEAL
            ====================== */

            hsTimeline.current.to(
                ".p7-name",
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                },
                "panel-7+=1"
            );

            hsTimeline.current.to(
                ".p7-item",
                {
                    opacity: 1,
                    y: 0,
                    duration: 2,
                    stagger: 0.12,
                    ease: "power2.out",
                },
                "panel-7+=1.5"
            );

            hsTimeline.current.fromTo(
                ".p7-angels",
                angelsFrom,
                angelsTo,
                "panel-7+=1.1"
            );

            hsTimeline.current.fromTo(
                ".p7-decor",
                decorFrom,
                decorTo,
                "panel-7+=1.2"
            );

            /* =====================
               CONTINUOUS MOTION
            ====================== */

            // Name breathing
            gsap.to(".p7-name", {
                y: "-=10",
                duration: 2,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
            });

        }, panelRef);

        return () => ctx.revert();
    }, [timelineReady, hsTimeline]);

    return (
        <section
            ref={panelRef}
            className="panel-seven-footer"
            data-cursor="white"
        >
            <div className="p7-inner">

                {/* Overlay visuals */}
                <img
                    className="p7-img p7-angels"
                    src="/ruru/angels_on_clouds.png"
                    alt="angels on clouds"
                />

                <img
                    className="p7-img p7-decor"
                    src="/ruru/flower_decor.png"
                    alt="flower decor"
                />

                <h2 className="p7-name">Nikhil Charan</h2>

                <p className="p7-line p7-item">
                    Some things don’t ask to be remembered.<br />
                    They simply remain.
                </p>

                <div className="p7-meta p7-item">
                    Made with care · Left to be found
                </div>
            </div>
        </section>
    );
}
