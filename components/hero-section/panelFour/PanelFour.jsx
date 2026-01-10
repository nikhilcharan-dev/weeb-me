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
        subtitle: "Ignite Coder · DSA",
    },
    {
        title: "3rd Sem",
        subtitle:
            "Bamboo Coders · Java, Python, ADSA · HTML, CSS, JS · Self-learned React & Node",
    },
    {
        title: "4th Sem",
        subtitle:
            "SkillUp (OS, DBMS) · Owl Coder 4.0 (Competitive Programming)",
    },
    {
        title: "5th–6th Sem",
        subtitle: "Drive Ready (MERN) · Owl Coder 5.0 (Current)",
    },
];

export default function PanelFour({ hsTimeline, timelineReady }) {
    const panelRef = useRef(null);

    useEffect(() => {
        if (!timelineReady || !hsTimeline?.current) return;

        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray(".p4-item");
            const total = items.length;

            gsap.set(".p4-h-line", {
                scaleX: 0,
                transformOrigin: "left center",
            });

            gsap.set(items, {
                opacity: 0,
                y: 30,
            });

            items.forEach((item, i) => {
                const progress = (i + 1) / total;
                const baseTime = 0.4 + i * 0.3;

                // grow timeline line
                hsTimeline.current.to(
                    ".p4-h-line",
                    {
                        scaleX: progress,
                        duration: 0.4,
                        ease: "power2.out",
                    },
                    `panel-4+=${baseTime}`
                );

                // reveal + activate item
                hsTimeline.current.to(
                    item,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        ease: "power2.out",
                        onStart: () => {
                            items.forEach((el) => el.classList.remove("active"));
                            item.classList.add("active");
                        },
                    },
                    `panel-4+=${baseTime}`
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
                    Progression through learning communities, semesters, and real-world
                    skill building.
                </p>

                <div className="p4-horizontal">
                    <div className="p4-h-line" />

                    {timelineItems.map((item, i) => (
                        <div key={i} className="p4-item">
                            <span className="p4-dot" />
                            <h3>{item.title}</h3>
                            <p>{item.subtitle}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
