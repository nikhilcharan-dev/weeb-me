'use client';
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles.css";

import PanelZero from "../hero-section/panelZero/PanelZero";
import PanelOne from "../hero-section/panelOne/PanelOne";
import PanelTwo from "../hero-section/panelTwo/PanelTwo";
import PanelThree from "../hero-section/panelThree/PanelThree";
import PanelFour from "../hero-section/panelFour/PanelFour";
import PanelFive from "../hero-section/panelFive/PanelFive";
import PanelSix from "../hero-section/panelSix/PanelSix";
import PanelSeven from "../hero-section/panelSeven/PanelSeven";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScroll() {
    const wrapperRef = useRef(null);
    const trackRef = useRef(null);
    const hsTimeline = useRef(null);
    const [timelineReady, setTimelineReady] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const panels = gsap.utils.toArray(".hs-panel");

            const horizontalPanels = panels;
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
                const realIndex = i; // panel-1, panel-2, ...

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
        <section ref={wrapperRef} className="hs-wrapper " data-cursor="white">
            <div ref={trackRef} className="hs-track">
                <div className="hs-panel zero">
                    <PanelZero
                        hsTimeline={hsTimeline}
                        timelineReady={timelineReady}
                    />
                </div>

                <div className="hs-panel one">
                    <PanelOne
                        hsTimeline={hsTimeline}
                        timelineReady={timelineReady}
                    />
                </div>

                <div className="hs-panel two">
                    <PanelTwo
                        hsTimeline={hsTimeline}
                        timelineReady={timelineReady}
                    />
                </div>

                <div className="hs-panel three">
                    <PanelThree
                        hsTimeline={hsTimeline}
                        timelineReady={timelineReady}
                    />
                </div>

                <div className="hs-panel four">
                    <PanelFour
                        hsTimeline={hsTimeline}
                        timelineReady={timelineReady}
                    />
                </div>
                <div className="hs-panel five">
                    <PanelFive
                        hsTimeline={hsTimeline}
                        timelineReady={timelineReady}
                    />
                </div>
                <div className="hs-panel six">
                    <PanelSix
                        hsTimeline={hsTimeline}
                        timelineReady={timelineReady}
                    />
                </div>
                <div className="hs-panel seven">
                    <PanelSeven
                        hsTimeline={hsTimeline}
                        timelineReady={timelineReady}
                    />
                </div>
                <div className="hs-panel eight"></div>
                <div className="hs-panel nine"></div>
            </div>
        </section>
    );
}
