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


            hsTimeline.current.to(
                ".p1-skills-inner",
                {
                    opacity: 1,
                    duration: 0.4,
                    ease: "none",
                },
                "panel-1+=0.8"
            );

            hsTimeline.current.to(
                ".hero-p1",
                {
                    x: 100,
                    y: 0,
                    scaleX: 1,
                    opacity: 1,
                    duration: 1,
                },
                "panel-1+=0.1"
            )
        }, panelRef);

        return () => ctx.revert();
    }, [timelineReady]);

    return (
        <section ref={panelRef} className="panel-one">
            <img src="/images/P0Hero.jpg" className="hero-p1" alt="Hero" />
            <div className="panel-one-inner">
                <div className="p1-line" />
                <h1 className="p1-title">About Me</h1>
                <p className="p1-desc">
                    I build interactive web experiences with motion, performance, and obsessive attention to detail. <br /> <br />
                    Behind the scenes, I engineer efficient backends, scalable microservices, payment systems, WhatsApp APIs, and cloud deployments on OCI.
                </p>
            </div>
            <div className="p1-skills">
                <ul className="p1-skills-inner">
                    <li>C++</li>
                    <li>Python</li>
                    <li>Java</li>
                    <li>Web 2.0</li>
                    <li>TypeScript</li>
                    <li>GSAP</li>
                    <li>React JS</li>
                    <li>Express JS</li>
                    <li>Flask</li>
                    <li>Next JS</li>
                    <li>MongoDB</li>
                    <li>MySQL</li>
                    <li>React Three Fiber(R3F)</li>
                    <li>Docker</li>
                    <li>Nginx</li>
                    <li>Github Actions</li>
                    <li>Oracle Cloud / AWS</li>
                </ul>
            </div>
        </section>
    );
}
