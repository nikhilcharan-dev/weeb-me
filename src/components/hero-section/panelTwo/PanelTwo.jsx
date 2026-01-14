'use client';

import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./styles.css";

const profiles = [
    {
        id: "leetcode",
        name: "LeetCode",
        username: "NIKHILCHARAN",
        solved: 700,
        rating: 1861,
        rank: "Top 5.48%",
        link: "https://leetcode.com/u/NIKHILCHARAN",
        image: "/images/leetcode.png",
        accent: "#f89f1b",
    },
    {
        id: "codechef",
        name: "CodeChef",
        username: "nikiru",
        solved: 500,
        stars: "3★",
        rating: 1639,
        link: "https://www.codechef.com/users/nikiru",
        image: "/images/codechef.png",
        accent: "#5b4638",
    },
    {
        id: "codeforces",
        name: "Codeforces",
        username: "nikiru",
        solved: 60,
        rating: 1200,
        rank: "Pupil",
        link: "https://codeforces.com/profile/nikiru",
        image: "/images/codeforces.png",
        accent: "#1f8acb",
    },
    {
        id: "gfg",
        name: "GeeksForGeeks",
        username: "nikhilcharan",
        solved: 257,
        instituteRank: 296,
        link: "https://auth.geeksforgeeks.org/user/nikhilcharan",
        image: "/images/gfg.png",
        accent: "#2f8d46",
    },
    {
        id: "code360",
        name: "Coding Ninjas",
        username: "Nikiru",
        solved: 66,
        level: "Specialist",
        link: "https://www.naukri.com/code360/profile/Nikiru",
        image: "/images/code360.jpg",
        accent: "#ff6b00",
    },
];

export default function PanelTwo({ hsTimeline, timelineReady }) {
    const panelRef = useRef(null);

    useEffect(() => {
        if (!timelineReady || !hsTimeline?.current) return;

        const ctx = gsap.context(() => {
            gsap.set(".p2-card", { y: 60, opacity: 0 });
            gsap.set(".p2-crown", {
                top: "30%",
                left: "-7%",
                scale: 0.7,
                rotation: 0,
                opacity: 1,
            });

            // hsTimeline.current.to(
            //     ".p2-card",
            //     {
            //         y: 0,
            //         opacity: 1,
            //         duration: 0.5,
            //         stagger: 0.12,
            //         ease: "power2.out",
            //     },
            //     "panel-2+=0.3"
            // );

            hsTimeline.current.to(
                ".p2-card",
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: {
                        each: 0.12,
                        onStart: function () {
                            const card = this.targets()[0];
                            const numbers = card.querySelectorAll(".count");

                            gsap.fromTo(
                                numbers,
                                { textContent: 0 },
                                {
                                    textContent: (i, el) => el.dataset.value,
                                    duration: 1,
                                    ease: "power2.out",
                                    snap: { textContent: 1 },
                                    delay: (i) => i * 0.005,
                                }
                            );
                        },
                    },
                    ease: "power2.out",
                },
                "panel-2+=0.3"
            );




            hsTimeline.current.to(
                ".p2-crown",
                {
                    top: "-23%",
                    left: "20%",
                    scale: 0.5,
                    rotation: 30,
                    opacity: 1,
                    duration: 0.6,
                    ease: "power3.out",
                },
                "panel-2+=0.4"
            );
        }, panelRef);

        return () => ctx.revert();
    }, [timelineReady]);

    return (
        <section ref={panelRef} className="panel-two" data-cursor="white">
            <img className="p2-crown" src="/images/P2Crown.png" alt="crown"/>
            <div className="panel-two-inner">
                <h1 className="p2-title">Achievements</h1>
                <p className="p2-sub">
                    Competitive programming profiles backed by consistent practice and real numbers.
                </p>

                <div className="p2-grid">
                    {profiles.map((p) => (
                        <a
                            key={p.id}
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p2-card"
                            style={{ "--accent": p.accent }}
                        >
                            <div className="p2-card-top">
                                <img src={p.image} alt={p.name} />
                                <div>
                                    <h2>{p.name}</h2>
                                    <span>@{p.username}</span>
                                </div>
                            </div>

                            <div className="p2-stats">
                                <div>
                                    <strong className="count" data-value={p.solved}>0</strong>
                                    <span>Problems</span>
                                </div>

                                {p.rating && (
                                    <div>
                                        <strong className="count" data-value={p.rating}>0</strong>
                                        <span>Rating</span>
                                    </div>
                                )}

                                {p.stars && (
                                    <div>
                                        <strong>{p.stars}</strong>
                                        <span>Stars</span>
                                    </div>
                                )}

                                {p.rank && (
                                    <div>
                                        <strong>{p.rank}</strong>
                                        <span>Rank</span>
                                    </div>
                                )}

                                {p.level && (
                                    <div>
                                        <strong>{p.level}</strong>
                                        <span>Level</span>
                                    </div>
                                )}

                                {p.instituteRank && (
                                    <div>
                                        <strong>#<span className="count" data-value={p.instituteRank}>0</span></strong>
                                        <span>Rank</span>
                                    </div>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
