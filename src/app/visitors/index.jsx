'use client';

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function VisitorsClient({
                                           total,
                                           reachedEnd,
                                           times,
                                       }) {
    const rootRef = useRef(null);

    const completionRate =
        total > 0
            ? Math.round((Number(reachedEnd) / Number(total)) * 100)
            : 0;

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".stat", {
                opacity: 0,
                y: 20,
                duration: 0.9,
                ease: "power2.out",
                stagger: 0.15,
            });

            gsap.from(".visit-item", {
                opacity: 0,
                y: 12,
                duration: 0.6,
                ease: "power2.out",
                stagger: 0.04,
                delay: 0.4,
            });
        }, rootRef);

        return () => ctx.revert();
    }, []);

    return (
        <main
            ref={rootRef}
            style={{
                padding: "3rem",
                maxWidth: "720px",
                margin: "auto",
            }}
        >
            <h1>Visitors</h1>

            {/* stats */}
            <div style={{ marginBottom: "2.5rem" }}>
                <p className="stat">
                    Total visits: <strong>{total}</strong>
                </p>

                <p className="stat">
                    Reached the end:{" "}
                    <strong>{reachedEnd}</strong>
                </p>

                <p className="stat">
                    Completion rate:{" "}
                    <strong>{completionRate}%</strong>
                </p>
            </div>

            {/* timeline */}
            <ul style={{ listStyle: "none", padding: 0 }}>
                {times.map((t, i) => (
                    <li
                        key={i}
                        className="visit-item"
                        style={{
                            marginBottom: "0.7rem",
                            opacity: 0.8,
                            fontSize: "0.9rem",
                        }}
                    >
                        {new Date(t).toLocaleString()}
                    </li>
                ))}
            </ul>
        </main>
    );
}
