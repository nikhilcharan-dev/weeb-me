'use client';

import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./styles.css";

export default function PanelOne({ hsTimeline, timelineReady }) {
    const panelRef = useRef(null);

    useEffect(() => {
        if (!timelineReady || !hsTimeline.current) return;

        const ctx = gsap.context(() => {
            // 🔒 initial state
            gsap.set(".p1-line", { scaleX: 0 });
            gsap.set(".p1-title", { x: 300, opacity: 0 });
            gsap.set(".p1-desc", { x: 200, opacity: 0 });

            // 🔥 start AFTER panel is clearly visible
            const start = "panel-1+=0.45";

            hsTimeline.current.to(
                ".p1-line",
                {
                    scaleX: 1,
                    transformOrigin: "left center",
                    duration: 0.35,
                    ease: "none",
                },
                start
            );

            hsTimeline.current.to(
                ".p1-title",
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.4,
                    ease: "none",
                },
                start
            );

            hsTimeline.current.to(
                ".p1-desc",
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.4,
                    ease: "none",
                },
                "panel-1+=0.6"
            );
        }, panelRef);

        return () => ctx.revert();
    }, [timelineReady]);

    return (
        <section ref={panelRef} className="panel-one">
            <div className="panel-one-inner">
                <div className="p1-line" />
                <h1 className="p1-title">About Me</h1>
                <p className="p1-desc">
                    I build interactive web experiences with motion,
                    performance, and obsessive attention to detail.
                </p>
            </div>
        </section>
    );
}
