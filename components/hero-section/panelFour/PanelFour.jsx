'use client';

import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./styles.css";

const timelineItems = [
    {
        title: "2023 · B.Tech",
        subtitle: "Aditya Engineering College",
    },
    {
        title: "1st Sem",
        subtitle: "Ignite Coder · Learned C · Won Weekly Contest-3",
    },
    {
        title: "2nd Sem",
        subtitle: "Ignite Coder · Data Structures & Algorithms",
    },
    {
        title: "3rd Sem",
        subtitle:
            "Bamboo Coders · Java · Python · ADSA · HTML · CSS · JavaScript · Self-learned React & Node",
    },
    {
        title: "4th Sem",
        subtitle:
            "SkillUp · OS · DBMS · Owl Coder 4.0 · Competitive Programming",
    },
    {
        title: "5th–6th Sem",
        subtitle:
            "Drive Ready · MERN Stack · Owl Coder 5.0 · Industry Preparation",
    },
];

export default function PanelFour({ hsTimeline, timelineReady }) {
    const panelRef = useRef(null);

    useEffect(() => {
        if (!timelineReady || !hsTimeline?.current) return;

        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray(".p4-item");
            const total = items.length;

            // ===== 🎛️ ADJUST THESE =====
            const PANEL_ENTER_OFFSET = 0.5; // when animations start
            const PANEL_EXIT_OFFSET  = 0.3; // when animations finish
            const ITEM_REVEAL_SPREAD = 5.0;  // spacing tightness
            // ==========================

            const usableRange = 1 - PANEL_ENTER_OFFSET - PANEL_EXIT_OFFSET;

            const directions = [
                { x: -400, y: 0 },
                { x: 400, y: 0 },
                { x: 0, y: 400 },
                { x: 0, y: -400 },
                { x: -300, y: 200 },
                { x: 300, y: 200 },
            ];

            gsap.set(".p4-h-line", {
                scaleX: 0,
                transformOrigin: "left center",
            });

            items.forEach((item, i) => {
                const dir = directions[i % directions.length];

                gsap.set(item, {
                    opacity: 0,
                    x: dir.x,
                    y: dir.y,
                    filter: "blur(6px)",
                });

                // 🎯 CALCULATED SCROLL POSITION
                const rawProgress = i / (total - 1);
                const adjusted =
                    PANEL_ENTER_OFFSET +
                    rawProgress * usableRange * ITEM_REVEAL_SPREAD;

                // timeline line
                hsTimeline.current.to(
                    ".p4-h-line",
                    {
                        scaleX: adjusted,
                        ease: "none",
                    },
                    `panel-4+=${adjusted}`
                );

                // item reveal
                hsTimeline.current.to(
                    item,
                    {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        filter: "blur(0px)",
                        ease: "power2.out",
                    },
                    `panel-4+=${adjusted}`
                );
            });
        }, panelRef);

        return () => ctx.revert();
    }, [timelineReady]);



    return (
        <section ref={panelRef} className="panel-four">
            <div className="panel-four-inner">
                <h1 className="p4-title">Journey</h1>
                <p className="p4-sub">
                    A quiet progression through communities, semesters, and
                    skills that slowly turned curiosity into capability.
                </p>

                <div className="p4-horizontal">
                    <div className="p4-h-line" />

                    {timelineItems.map((item, i) => (
                        <div key={i} className="p4-item active">
                            <span className="p4-dot" />
                            <h3>{item.title}</h3>

                            {item.subtitle.split("·").map((line, j) => (
                                <p key={j} className="p4-line">
                                    {line.trim()}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
