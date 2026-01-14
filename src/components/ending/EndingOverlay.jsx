'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './ending.css';

export default function EndingOverlay() {
    const rootRef = useRef(null);
    const nameRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ delay: 0.4 });

            tl.from('.ending-overlay > *', {
                opacity: 0,
                y: 12,
                duration: 1.2,
                ease: 'power2.out',
                stagger: 0.18,
            });

            // ✨ name breathing / floating
            gsap.to(nameRef.current, {
                y: -6,
                duration: 4,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
            });

            const spidy = rootRef.current.querySelector('.spidy');

            gsap.to(spidy, {
                rotation: 6,
                x: 18,
                duration: 3.8,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            });

            gsap.to(spidy, {
                scale: 1.035,
                duration: 4.5,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            });

        }, rootRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={rootRef} className="ending-overlay">
            <h1 ref={nameRef}>Nikhil Charan</h1>

            <p className="subtitle">
                Creative Engineer · Systems Thinker
            </p>

            <p className="closing-line">
                I don’t just build projects.<br />
                I build worlds where logic, emotion,<br />
                and motion meet.
            </p>

            <div className="ending-actions">
                <a
                    href="https://drive.google.com/file/d/1fOAL00BsaVEz0k9fc5M_7UBLfFLpyyTq/view?usp=drive_link"
                    target="_blank"
                >
                    View Resume
                </a>
                <a href="mailto:nikhilcharangollapalli@email.com">
                    Contact Me
                </a>
            </div>

            <span className="thanks">
                Thank you for staying till the end.
            </span>

            <img className="spidy" src="/ruru/spider_me.png" alt="spider-man" />
        </div>
    );
}
