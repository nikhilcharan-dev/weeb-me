'use client';

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./styles.css";

export default function PanelSix({ hsTimeline, timelineReady }) {
    const panelRef = useRef(null);
    const titleRef = useRef(null);
    const [copied, setCopied] = useState(false);

    const email = "nikhilcharangollapalli@example.com";

    useEffect(() => {
        if (!timelineReady || !hsTimeline?.current) return;

        const ctx = gsap.context(() => {

            /* ================= PREPARE TITLE WORDS FIRST ================= */
            const titleEl = titleRef.current;
            const words = titleEl.innerText.split(" ");

            titleEl.innerHTML = words
            .map(
                w =>
                    `<span class="p6-word-wrap"><span class="p6-word">${w}</span></span>`
            )
            .join(" ");

            gsap.set(".p6-word", {
                yPercent: 120,
                skewY: 6,
                opacity: 0,
            });

            /* ================= PREPARE NARRATION ================= */
            gsap.set(".fang-line", {
                opacity: 0,
                y: 40,
            });

            /* ================= FANG YUAN NARRATION ================= */
            hsTimeline.current
            .to(".fang-line.f1", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power4.out",
            }, "panel-6+=1.3")

            .to({}, { duration: 0.35 })

            .to(".fang-line.f2", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power4.out",
            }, "panel-6+=1.3")

            .to(".fang-line.f3", {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power4.out",
            }, "panel-6+=1.3")

            .to(".fang-line.f3", {
                textShadow: "0 0 18px rgba(198,40,40,0.6)",
                duration: 0.5,
            }, "panel-6+=1.3");

            /* ================= TITLE WORD REVEAL ================= */
            hsTimeline.current.to(
                ".p6-word",
                {
                    yPercent: 0,
                    skewY: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.08,
                    ease: "power4.out",
                },
                "panel-6+=0.5"
            );

            /* ================= REST CONTENT ================= */
            gsap.set(".p6-item", { opacity: 0, y: 30 });

            hsTimeline.current.to(
                ".p6-item",
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.15,
                    ease: "power2.out",
                },
                "panel-6+=0.5"
            );

        }, panelRef);

        return () => ctx.revert();
    }, [timelineReady]);

    const copyEmail = async () => {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <section ref={panelRef} className="panel-six" data-cursor="white">

            <div className="panel-six-inner">
                <div className="p6-content">

                    <div className="p6-status p6-item">
                        <span className="dot" />
                        Available for Internships · Full-Time · Collaborations
                    </div>

                    <h1 ref={titleRef} className="p6-title">
                        Let’s Build Something That Ships
                    </h1>

                    <p className="p6-sub p6-item">
                        I work on systems that scale cleanly, fail gracefully,
                        and actually reach production.
                    </p>

                    <button onClick={copyEmail} className="p6-email p6-item">
                        {copied ? "Email Copied ✓" : email}
                    </button>

                    <div className="p6-links p6-item">
                        <a href="https://github.com/nikhilcharan-dev" target="_blank">GitHub</a>
                        <a href="https://www.linkedin.com/in/shadow01" target="_blank">LinkedIn</a>
                    </div>

                    <p className="p6-foot p6-item">
                        Prefer thoughtful work over rushed code.
                    </p>
                </div>
            </div>

            {/* ===== FANG YUAN NARRATION ===== */}
            <div className="fang-narration">
                <p className="fang-line f1">I am not afraid of failure.</p>
                <p className="fang-line f2">Because failure is just another step</p>
                <p className="fang-line f3">toward my goal.</p>
            </div>

            {/* ===== IMAGE ===== */}
            <img
                className="fang-yuan"
                src="/images/fang_yuan.jpeg"
                alt="Fang Yuan"
            />

        </section>
    );
}
