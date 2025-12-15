'use client';
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedText() {
    const wrapperRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: "top center-=100",   // when section enters viewport
                    end: "top top",     // animation completes here
                    scrub: true,           // 🔥 scroll controls animation
                    markers: true,
                    id: "name-intro"
                },
            })
            .from(".l-1", {
                y: -200,
                opacity: 0,
                rotate: -60,
                ease: "none",
            })
            .from(
                ".l-2",
                {
                    y: -150,
                    opacity: 0,
                    ease: "none",
                },
                0.15
            )
            .from(
                ".icarus",
                {
                    y: -250,
                    opacity: 0,
                    scale: 0.8,
                    ease: "none",
                },
                0
            );
        }, wrapperRef);


        return () => ctx.revert();
    }, []);

    return (
        <div ref={wrapperRef} className="text-wrapper">
            <span className="text-layer l-1 image-text">Nikhil</span>
            <span className="text-layer l-2">Charan</span>
            <img src="/images/icarus.jpg" alt="icarus" className="icarus" />
        </div>
    );
}
