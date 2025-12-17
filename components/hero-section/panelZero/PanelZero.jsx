import Navigation from "../../navigation/Navigation";
import './styles.css'
import AnimatedText from "../../textAnimation/AnimatedText";
import {useEffect, useRef} from "react";
import gsap from "gsap";

export default function PanelZero({ hsTimeline, timelineReady }) {

    const panelRef = useRef(null);

    useEffect(() => {
        if (!timelineReady || !hsTimeline.current) return;

        const ctx = gsap.context(() => {
            // 🔒 initial state
            gsap.set(".p1-line", { scaleX: 0 });
            gsap.set(".p1-title", { x: 300, opacity: 0 });
            gsap.set(".p1-desc", { x: 200, opacity: 0 });

            const start = "panel-1+=0.45";

            hsTimeline.current.to(
                ".p1-line",
                {
                    scaleX: 1,
                    transformOrigin: "left center",
                    duration: 0.35,
                    ease: "none",
                },
                start
            );

            hsTimeline.current.to(
                ".p1-title",
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.4,
                    ease: "none",
                },
                start
            );

            hsTimeline.current.to(
                ".p1-desc",
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.4,
                    ease: "none",
                },
                "panel-1+=0.6"
            );
        }, panelRef);

        return () => ctx.revert();
    }, [timelineReady]);


    return (
        <section ref={panelRef} className="panel-0 zero">
            <Navigation />
            <AnimatedText />
        </section>
    )
}