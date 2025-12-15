'use client';

import { useEffect } from "react";
import gsap from "gsap";
import './styles.css'

// use at data-cursor to a tag data-cursor="#000"

export default function Cursor() {
    useEffect(() => {
        const cursor = document.querySelector(".cursor");
        if (!cursor) return;

        const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const mouse = { x: pos.x, y: pos.y };

        // Smooth follow
        const tick = () => {
            pos.x += (mouse.x - pos.x) * 0.15;
            pos.y += (mouse.y - pos.y) * 0.15;

            gsap.set(cursor, {
                x: pos.x + 10,
                y: pos.y + 10,
                xPercent: -100,
                yPercent: -100,
            });

        };

        gsap.ticker.add(tick);

        const onMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;

            const el = document.elementFromPoint(e.clientX, e.clientY);
            if (!el) return;

            const section = el.closest("[data-cursor]");
            if (!section) return;

            const color = section.dataset.cursor;

            gsap.to(cursor, {
                backgroundColor: color,
                duration: 0.25,
                ease: "power2.out",
            });
        };

        window.addEventListener("mousemove", onMouseMove);

        return () => {
            gsap.ticker.remove(tick);
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, []);

    return <div className="cursor" />;
}

