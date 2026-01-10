'use client';

import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./styles.css";

const certifications = [
    {
        title: "Cisco C++",
        image: "/images/cpp.png",
        date: "Aug 14, 2024",
        link: "https://drive.google.com/your-dsa-cert",
    },
    {
        title: "Cisco Python",
        image: "/images/python.png",
        date: "Nov 1, 2024",
        link: "https://drive.google.com/your-mern-cert",
    },
    {
        title: "Java Oracle Foundations",
        image: "/images/oracle-java.png",
        date: "May 12, 2025",
        link: "https://drive.google.com/file/d/1Y6Rh1qev6xFl6YxvWfDLvkgE8CYSqfPG/view",
    },
    {
        title: "IT Specialist",
        image: "/images/certiport-it.png",
        date: "Aug 2, 2024",
        link: "https://drive.google.com/file/d/1wvJd330kqz8J6CG-djzdSKcSS2aH3xzh/view",
    },
    {
        title: "Redhat System Administrator",
        image: "/images/redhat.png",
        date: "Aug 11, 2025",
        link: "https://drive.google.com/file/d/1IMpj2TphODa1Z3UOoorTj_H8WWcUziid/view",
    },
    {
        title: "Oracle Database Certification",
        image: "/images/oracle-dbms.png",
        date: "Sep 25, 2025",
        link: "https://drive.google.com/file/d/1v3qqe0TtUbLfGWebFNgo7DdT3nBJ81Eq/view",
    },
];

export default function PanelFive({ hsTimeline, timelineReady }) {
    const panelRef = useRef(null);

    useEffect(() => {
        if (!timelineReady || !hsTimeline?.current) return;

        const ctx = gsap.context(() => {
            gsap.set(".p5-resume", { opacity: 0, y: 40 });
            gsap.set(".p5-cert-card", { opacity: 0, y: 30, scale: 0.96 });

            // Resume animation (panel fully settling)
            hsTimeline.current.to(
                ".p5-resume",
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.45,
                    ease: "power2.out",
                },
                "panel-5+=0.25"
            );

            // Certification cards animation
            hsTimeline.current.to(
                ".p5-cert-card",
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.45,
                    stagger: 0.1,
                    ease: "power2.out",
                },
                "panel-5+=0.45"
            );
        }, panelRef);

        return () => ctx.revert();
    }, [timelineReady]);

    return (
        <section
            ref={panelRef}
            className="panel-five" >
            <div className="p5-overlay" />

            <div className="panel-five-inner">
                <h1 className="p5-title">Resume & Certifications</h1>
                <p className="p5-sub">
                    A snapshot of my professional profile and verified learning milestones.
                </p>

                {/* Resume Highlight */}
                <a
                    href="https://drive.google.com/file/d/1fOAL00BsaVEz0k9fc5M_7UBLfFLpyyTq/view"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p5-resume"
                >
                    <img
                        src="/images/resume-cover.png"
                        className="resume-cover"
                        alt="Resume"
                    />
                    <div>
                        <h2>Resume</h2>
                        <span>View / Download</span>
                    </div>
                </a>

                {/* Certifications */}
                <div className="p5-cert-grid">
                    {certifications.map((cert, i) => (
                        <a
                            key={i}
                            href={cert.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p5-cert-card"
                        >
                            <img src={cert.image} alt={cert.title} />
                            <h3>{cert.title}</h3>
                            <span className="p5-cert-date">{cert.date}</span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
