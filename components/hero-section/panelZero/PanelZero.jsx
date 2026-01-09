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

            const roles = gsap.utils.toArray(".role");

            roles.forEach((role, i) => {
                const enterAt = `panel-0+=${i * 0.2}`;
                const exitAt  = `panel-0+=${i * 0.2 + 0.2}`;

                hsTimeline.current
                .to(role, {
                    y: 0,
                    opacity: 1,
                    duration: 0.2,
                    ease: "none",
                }, enterAt)
                .to(role, {
                    y: -20,
                    opacity: 0,
                    duration: 0.2,
                    ease: "none",
                }, exitAt);

            });
        }, panelRef);

        return () => ctx.revert();
    }, [timelineReady]);


    return (
        <section ref={panelRef} className="panel-0 zero">
            <Navigation />
            <AnimatedText />
            <div className="roles">
                <span className="role">Coder</span>
                <span className="role">Programmer</span>
                <span className="role">Blockchain Developer</span>
                <span className="role">Full-Stack Developer</span>
                <span className="role">Gamer</span>
                <span className="role">Anime Weeb</span>
                <span className="role">Yeah! It's Me!!</span>
            </div>
        </section>
    )
}