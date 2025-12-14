'use client'

import { useEffect, useState } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

import HorizontalScroll from "../../components/horizontalScroll/HorizontalScroll";
import "./globals.css";

const videos = ["hero", "ruru", "serene", "dragon", "nova"];

gsap.registerPlugin(TextPlugin);

export default function Home() {
    const [videoSrc, setVideoSrc] = useState(null);

    useEffect(() => {
        setVideoSrc(
            `/videos/${videos[Math.floor(Math.random() * videos.length)]}.mp4`
        );

        document.body.style.pointerEvents = "none";

        gsap.fromTo(
            ".welcome-text",
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                    document.body.style.pointerEvents = "auto";
                }
            }
        );

        gsap.timeline()
        .to(".title", {
            text: "Welcome",
            duration: 2.5,
            ease: "none",
            delay: 2,
        })
        .to(".title", {
            text: "Scroll to view",
            duration: 2.5,
            delay: 1
        });

    }, []);

    return (
        <>
            <section className="section-default intro">
                <h1 className="welcome-text title">Yawwwn!!</h1>

                {videoSrc && (
                    <video
                        className="clipped-video"
                        src={videoSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                )}
            </section>

            <HorizontalScroll />

            <section className="section-default">
                End ↓
            </section>
        </>
    );
}
