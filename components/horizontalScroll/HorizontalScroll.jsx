'use client';

import {useEffect, useRef, useState} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import "./styles.css";

import dynamic from "next/dynamic";

const PanelZero = dynamic(
    () => import("../hero-section/panelZero/PanelZero"),
    { ssr: false }
);

const PanelOne = dynamic(
    () => import("../hero-section/panelOne/PanelOne"),
    { ssr: false }
);

const PanelTwo = dynamic(
    () => import("../hero-section/panelTwo/PanelTwo"),
    { ssr: false }
);

const PanelThree = dynamic(
    () => import("../hero-section/panelThree/PanelThree"),
    { ssr: false }
);

const PanelFour = dynamic(
    () => import("../hero-section/panelFour/PanelFour"),
    { ssr: false }
);

const PanelFive = dynamic(
    () => import("../hero-section/panelFive/PanelFive"),
    { ssr: false }
);

const PanelSix = dynamic(
    () => import("../hero-section/panelSix/PanelSix"),
    { ssr: false }
);

const PanelSeven = dynamic(
    () => import("../hero-section/panelSeven/PanelSeven"),
    { ssr: false }
);


gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScroll() {
    const wrapperRef = useRef(null);
    const trackRef = useRef(null);

    const hsTimeline = useRef(null);
    const [timelineReady, setTimelineReady] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const horizontalPanels = gsap.utils.toArray(".hs-panel");
            const count = horizontalPanels.length - 1;

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
        <>
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
                    <div className="hs-panel seven"></div>
                </div>
            </section>
            <section className="hs-wrapper" data-cursor="transparent">
                <div className="hs-panel eight">
                    <PanelSeven />
                </div>
            </section>
        </>
    );
}
