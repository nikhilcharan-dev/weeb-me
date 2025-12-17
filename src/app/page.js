'use client'

import { useEffect, useState } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

import Cursor from "../../components/cursor/Cursor";
import HorizontalScroll from "../../components/horizontalScroll/HorizontalScroll";
import './styles.css'

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
            { opacity: 0, y: 40 },
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

        const tl = gsap.timeline();

        tl.to(".title", {
            filter: "blur(8px)",
            duration: 0.1,
        })
        .to(".title", {
            filter: "blur(0px)",
            duration: 0.6,
        })
        .to(".title", {
            text: "ようこそ",
            duration: 1,
            ease: "none",
            delay: 2,
        })
        .to(".scroll-text", {
            opacity: 1,
            ease: "power2.out",
            duration: 3
        })
        .to(".title", {
            text: "Welcome",
            duration: 1.5,
            delay: 1
        })
        .to(".scroll-text", {
            filter: "blur(8px)",
        })
        .to(".scroll-text", {
            opacity: 0,
            text: "Scroll to view",
        })
        .to(".scroll-text", {
            opacity: 1,
            filter: "blur(0px)",
        })


    }, []);


    return (
        <>
            <Cursor />
            <section className="section-default intro" data-cursor="#000">
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

                <p className="scroll-text">スクロールしてください</p>
            </section>

            <HorizontalScroll />

            <section className="section-default" data-cursor="#000">
                End ↓
            </section>
        </>
    );
}
