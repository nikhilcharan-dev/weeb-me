import Navigation from "../../navigation/Navigation";
import './styles.css'
import AnimatedText from "../../textAnimation/AnimatedText";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PanelZero({ hsTimeline, timelineReady }) {
    const panelRef = useRef(null)

    // Spotlight follows cursor
    useEffect(() => {
        const panel = panelRef.current
        if (!panel) return
        const move = (e) => {
            const r = panel.getBoundingClientRect()
            panel.style.setProperty('--spx', `${((e.clientX - r.left) / r.width) * 100}%`)
            panel.style.setProperty('--spy', `${((e.clientY - r.top) / r.height) * 100}%`)
        }
        panel.addEventListener('mousemove', move)
        return () => panel.removeEventListener('mousemove', move)
    }, [])

    useEffect(() => {
        if (!timelineReady || !hsTimeline.current) return

        const ctx = gsap.context(() => {
            // Signal-lock entry: panel snaps in from blurred zoom
            gsap.set(panelRef.current, { scale: 1.04, filter: 'blur(10px)', opacity: 0 })
            hsTimeline.current.to(panelRef.current, {
                scale: 1,
                filter: 'blur(0px)',
                opacity: 1,
                duration: 0.28,
                ease: 'power3.out',
            }, 'panel-0')

            // Enhanced roles: zoom+blur in, zoom+blur out
            const roles = gsap.utils.toArray('.role')
            gsap.set(roles, { opacity: 0, y: 22, scale: 0.68, filter: 'blur(7px)' })

            roles.forEach((role, i) => {
                const enterAt = `panel-0+=${i * 0.2}`
                const exitAt  = `panel-0+=${i * 0.2 + 0.2}`

                hsTimeline.current
                    .to(role, {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        filter: 'blur(0px)',
                        duration: 0.2,
                        ease: 'none',
                    }, enterAt)
                    .to(role, {
                        y: -16,
                        opacity: 0,
                        scale: 1.18,
                        filter: 'blur(5px)',
                        duration: 0.2,
                        ease: 'none',
                    }, exitAt)
            })
        }, panelRef)

        return () => ctx.revert()
    }, [timelineReady])

    return (
        <section ref={panelRef} className="panel-0 zero">
            {/* Cursor spotlight */}
            <div className="panel-zero-spot" aria-hidden="true" />

            {/* Background kanji watermarks */}
            <div className="pz-bg-kanji pz-bk-1" aria-hidden="true">夢</div>
            <div className="pz-bg-kanji pz-bk-2" aria-hidden="true">力</div>
            <div className="pz-bg-kanji pz-bk-3" aria-hidden="true">道</div>

            <Navigation />
            <AnimatedText />
            <div className="roles">
                <span className="role">Gamer</span>
                <span className="role">Coder</span>
                <span className="role">Programmer</span>
                <span className="role">Blockchain Developer</span>
                <span className="role">Full-Stack Developer</span>
                <span className="role">Anime Otaku</span>
                <span className="role">Yeah! It's Me!!</span>
            </div>
        </section>
    )
}
