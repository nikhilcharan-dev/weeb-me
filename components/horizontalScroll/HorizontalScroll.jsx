'use client'

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import './styles.css';

export default function HorizontalScroll() {
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start 10%", "end start"],
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-290%"]);

    return (
        <section ref={sectionRef} className="hs-wrapper">
            <motion.div className="hs-track" style={{ x }} >
                <div className="hs-panel zero">Hii</div>
                <div className="hs-panel">Panel One</div>
                <div className="hs-panel">Panel Two</div>
                <div className="hs-panel">Panel Three</div>
            </motion.div>
        </section>
    );
}
