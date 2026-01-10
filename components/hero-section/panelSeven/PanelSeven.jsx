'use client';

import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./styles.css";

export default function PanelSeven({ hsTimeline, timelineReady }) {
    const panelRef = useRef(null);

    useEffect(() => {
        if (!timelineReady || !hsTimeline?.current) return;

        const ctx = gsap.context(() => {
            // start black
            gsap.set(panelRef.current, {
                width: "10vw",
                backgroundColor: "#000000",
            });

            // animate to white
            hsTimeline.current.to(
                panelRef.current,
                {
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "#ffffff",
                    duration: 0.5,
                    ease: "power2.out",
                },
                "panel-7+=1"
            );
        }, panelRef);

        return () => ctx.revert();
    }, [timelineReady]);

    return (
        <section ref={panelRef} className="panel-seven" data-cursor="transparent">

        </section>
    )
}
