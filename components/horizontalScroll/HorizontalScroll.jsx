'use client';

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles.css";

import PanelZero from "../hero-section/panelZero/PanelZero";
import PanelOne from "../hero-section/panelOne/PanelOne";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScroll() {
    const wrapperRef = useRef(null);
    const trackRef = useRef(null);
    const hsTimeline = useRef(null);
    const [timelineReady, setTimelineReady] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const panels = gsap.utils.toArray(".hs-panel");

            // IMPORTANT: exclude PanelZero from horizontal motion
            const horizontalPanels = panels.slice(1);
            const count = horizontalPanels.length;

            hsTimeline.current = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    pin: true,
                    scrub: 1,
                    start: "top top",
                    end: () => "+=" + count * window.innerWidth,
                    invalidateOnRefresh: true,
                },
            });

            horizontalPanels.forEach((_, i) => {
                const realIndex = i + 1; // panel-1, panel-2, ...

                hsTimeline.current.addLabel(`panel-${realIndex}`, i);

                hsTimeline.current.to(
                    trackRef.current,
                    {
                        xPercent: -100 * realIndex,
                        duration: 1,
                        ease: "none",
                    },
                    i
                );
            });

            setTimelineReady(true);
            ScrollTrigger.refresh();
        }, wrapperRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={wrapperRef} className="hs-wrapper">
            <div ref={trackRef} className="hs-track">
                <div className="hs-panel zero">
                    <PanelZero />
                </div>

                <div className="hs-panel one">
                    <PanelOne
                        hsTimeline={hsTimeline}
                        timelineReady={timelineReady}
                    />
                </div>

                <div className="hs-panel">Panel Two</div>
                <div className="hs-panel">Panel Three</div>
            </div>
        </section>
    );
}
