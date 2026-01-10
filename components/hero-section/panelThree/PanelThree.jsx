'use client';

import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./styles.css";

const projects = [
    {
        id: "lastline",
        title: "LastLine",
        role: "Backend & Frontend Overseer",
        description:
            "A MERN + ML based mail intelligence system that filters and labels emails into internships, jobs, alerts, OTPs, and spam using a Naive Bayes classifier. Built with a minimal UI focused on speed, clarity, and smooth UX.",
        stack: ["MERN", "Machine Learning", "Naive Bayes", "Mail Parsing", "Fast UX"],
        accent: "#4f8cff",
    },
    {
        id: "workping",
        title: "WorkPing",
        role: "Backend Lead & System Architect",
        description:
            "A large-scale MERN + AI platform integrating PhonePe payments, WhatsApp Business API, OTP services, and multiple microservices. Architected intent-detection pipelines, ML tunneling for images and messages, owned backend architecture and DevOps on Oracle Cloud (OCI), and led a team of two.",
        stack: [
            "MERN",
            "AI / ML",
            "PhonePe Gateway",
            "WhatsApp Business API",
            "Microservices",
            "OTP (Nodemailer, Twilio)",
        ],
        accent: "#ff6b6b",
    },
];

export default function PanelThree({ hsTimeline, timelineReady }) {
    const panelRef = useRef(null);

    useEffect(() => {
        if (!timelineReady || !hsTimeline?.current) return;

        const ctx = gsap.context(() => {
            gsap.set(".p3-card", { y: 80, opacity: 0 });

            hsTimeline.current.to(
                ".p3-card",
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.2,
                    ease: "power2.out",
                },
                "panel-3+=0.3"
            );
        }, panelRef);

        return () => ctx.revert();
    }, [timelineReady]);

    return (
        <section ref={panelRef} className="panel-three">
            <div className="panel-three-inner">
                <h1 className="p3-title">Projects</h1>
                <p className="p3-sub">
                    A selection of systems I’ve built and overseen — focused on scale,
                    reliability, and real-world complexity.
                </p>

                <div className="p3-grid">
                    {projects.map((p) => (
                        <div
                            key={p.id}
                            className="p3-card"
                            style={{ "--accent": p.accent }}
                        >
                            <div className="p3-header">
                                <h2>{p.title}</h2>
                                <span>{p.role}</span>
                            </div>

                            <p className="p3-desc">{p.description}</p>

                            <div className="p3-stack">
                                {p.stack.map((tech, i) => (
                                    <span key={i}>{tech}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
