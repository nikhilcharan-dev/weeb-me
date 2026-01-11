'use client'

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin, } from "gsap/TextPlugin";

import Cursor from "../../components/cursor/Cursor";
import HorizontalScroll from "../../components/horizontalScroll/HorizontalScroll";

import { StickerPreload } from "../../components/ending/CacheSticker";

import EndScene from "../../components/ending/EndScene";
import EndingOverlay from '../../components/ending/EndingOverlay';
import './styles.css'

const videos = ["hero", "ruru", "serene", "dragon", "nova"];

gsap.registerPlugin(TextPlugin, ScrollTrigger);

export default function Home() {
    const [videoSrc, setVideoSrc] = useState(null);
    const [showEnding, setShowEnding] = useState(false);
    useEffect(() => {
        setVideoSrc(
            `/videos/${videos[Math.floor(Math.random() * videos.length)]}.mp4`
        );

        gsap.fromTo(
            ".welcome-text",
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
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

        ScrollTrigger.create({
            trigger: "#ending-trigger",
            start: "bottom bottom",
            onEnter: () => {
                setShowEnding(true)
            },
            onEnterBack: () => {
                setShowEnding(true)
            },
            onLeaveBack: () => {
                setShowEnding(false)
            },
        });


    }, []);


    return (
        <>
            <Cursor/>
            <StickerPreload/>
            <section className="section-default intro" data-cursor="black">
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

            <HorizontalScroll/>

            <section style={{height: "2000vh"}} aria-hidden={false}/>

            <section
                id="ending-trigger"
                style={{height: "500vh"}}
                aria-hidden
            />

            {showEnding && (
                <section id="ending"
                         className="ending-section">
                    <EndScene/>
                    <EndingOverlay/>
                    HIii
                </section>
            )}
        </>
    );
}
