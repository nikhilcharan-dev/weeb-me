'use client';

import { useEffect } from "react";
import gsap from "gsap";
import { playClick } from "@/lib/sounds";
import './styles.css';

export default function Cursor() {
    useEffect(() => {
        const cursor = document.querySelector(".cursor");
        if (!cursor) return;

        const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const mouse = { x: pos.x, y: pos.y };

        const tick = () => {
            pos.x += (mouse.x - pos.x) * 0.15;
            pos.y += (mouse.y - pos.y) * 0.15;

            gsap.set(cursor, {
                x: pos.x,
                y: pos.y,
                xPercent: -50,
                yPercent: -50,
            });
        };

        gsap.ticker.add(tick);

        const onMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        // 🔥 IMPORTANT PART
        const cursorTargets = document.querySelectorAll("[data-cursor]");

        cursorTargets.forEach(el => {
            el.addEventListener("mouseenter", () => {
                gsap.to(cursor, {
                    backgroundColor: el.dataset.cursor,
                    duration: 0.25,
                    ease: "power2.out",
                });
            });

            el.addEventListener("mouseleave", () => {
                gsap.to(cursor, {
                    backgroundColor: "#000",
                    duration: 0.25,
                    ease: "power2.out",
                });
            });
        });

        const onMouseDown = () => {
            try { playClick() } catch {}
            gsap.to(cursor, { scale: 0.6, duration: 0.1 });
        };

        const onMouseUp = () => {
            gsap.to(cursor, { scale: 1, duration: 0.15, ease: "back.out(2)" });
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);

        return () => {
            gsap.ticker.remove(tick);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
            cursorTargets.forEach(el => {
                el.replaceWith(el.cloneNode(true)); // clean listeners safely
            });
        };
    }, []);

    return <div className="cursor" />;
}
