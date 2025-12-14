'use client'
import { useState, useEffect } from "react";
import "./styles.css";

const fonts = [
    "'Alex Brush', cursive",
    "'Arizonia', cursive",
    "'Black Han Sans', sans-serif",
    "'Cinzel Decorative', serif",
    "'Nothing You Could Do', cursive",
    "'Parisienne', cursive",
    "'Poiret One', sans-serif",
    "cursive",
    "'Sorts Mill Goudy', serif"
];

export default function AnimatedText() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const t = setInterval(() => {
            setIndex((i) => (i + 1) % fonts.length);
        }, 800);

        return () => clearInterval(t);
    }, []);

    return (
        <div className="font-fade-wrapper">
            {fonts.map((font, i) => (
                <span
                    key={i}
                    className={`font-layer ${index === i ? "visible" : ""}`}
                    style={{ fontFamily: font }}
                >
                  Nikhil Charan
                </span>
            ))}
        </div>
    );
}
