'use client'

import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'

import LoadingScreen from '@/components/loadingScreen/LoadingScreen'
import Cursor from '@/components/cursor/Cursor'
import HorizontalScroll from '@/components/horizontalScroll/HorizontalScroll'
import EndingOverlay from '@/components/ending/EndingOverlay'

import './styles.css'

gsap.registerPlugin(TextPlugin, ScrollTrigger)

// ── Cycling role text ─────────────────────────────────────────
const ROLES = [
    'Full-Stack Developer',
    'Gamer',
    'Anime Otaku',
    'Creative Engineer',
    'Code Wizard',
]

function HeroRoles() {
    const [idx, setIdx]           = useState(0)
    const [animating, setAnimating] = useState(false)

    useEffect(() => {
        const id = setInterval(() => {
            setAnimating(true)
            setTimeout(() => {
                setIdx(i => (i + 1) % ROLES.length)
                setAnimating(false)
            }, 340)
        }, 2800)
        return () => clearInterval(id)
    }, [])

    return (
        <div className="hero-role-badge">
            <span className={`hero-role-text ${animating ? 'hero-role-text--out' : 'hero-role-text--in'}`}>
                {ROLES[idx]}
            </span>
        </div>
    )
}

// ── Particle constellation canvas ─────────────────────────────
function HeroParticles() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let animId

        const mobile = window.innerWidth <= 768
        const COUNT  = mobile ? 48 : 95

        let W, H
        const resize = () => {
            W = canvas.width  = canvas.offsetWidth
            H = canvas.height = canvas.offsetHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const pts = Array.from({ length: COUNT }, () => ({
            x:  Math.random() * W,
            y:  Math.random() * H,
            vx: (Math.random() - 0.5) * 0.22,
            vy: (Math.random() - 0.5) * 0.22,
            r:  0.7 + Math.random() * 1.3,
            a:  0.25 + Math.random() * 0.55,
        }))

        const DIST = 145

        const frame = () => {
            ctx.clearRect(0, 0, W, H)

            for (let i = 0; i < COUNT; i++) {
                const p = pts[i]
                p.x = (p.x + p.vx + W) % W
                p.y = (p.y + p.vy + H) % H
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${p.a})`
                ctx.fill()
            }

            for (let i = 0; i < COUNT; i++) {
                for (let j = i + 1; j < COUNT; j++) {
                    const dx = pts[i].x - pts[j].x
                    const dy = pts[i].y - pts[j].y
                    const d  = Math.sqrt(dx * dx + dy * dy)
                    if (d < DIST) {
                        ctx.beginPath()
                        ctx.moveTo(pts[i].x, pts[i].y)
                        ctx.lineTo(pts[j].x, pts[j].y)
                        ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - d / DIST) * 0.10})`
                        ctx.lineWidth   = 0.5
                        ctx.stroke()
                    }
                }
            }

            animId = requestAnimationFrame(frame)
        }
        frame()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return <canvas ref={canvasRef} className="hero-particles-canvas" />
}

// ── Main ──────────────────────────────────────────────────────
export default function Home() {
    const [showEnding, setShowEnding]     = useState(false)
    const [loaded, setLoaded]             = useState(false)
    const [loadProgress, setLoadProgress] = useState(0)
    const [isMobile, setIsMobile]         = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    useEffect(() => {
        document.documentElement.style.overflow = loaded ? '' : 'hidden'
    }, [loaded])

    // No heavy 3D assets — brief pause for font / initial paint, then dismiss
    useEffect(() => {
        const t = setTimeout(() => setLoadProgress(100), 700)
        return () => clearTimeout(t)
    }, [])

    // ── GSAP intro timeline ────────────────────────────────────
    useEffect(() => {
        if (!loaded) return

        fetch('/api/view', { method: 'POST' })

        const key  = 'nova-portfolio-visits'
        const prev = Number(localStorage.getItem(key) || Math.floor(Math.random() * 1000))
        const next = prev + 1
        localStorage.setItem(key, next.toString())

        const ctx = gsap.context(() => {
            gsap.fromTo('.visit-count', { innerText: 0 }, {
                innerText: next, duration: 1.5, ease: 'power2.out', snap: { innerText: 1 },
            })

            // Staggered entrance
            gsap.fromTo('.hero-eyebrow',   { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.8, delay: 0.0, ease: 'power3.out' })
            gsap.fromTo('.hero-role-badge', { opacity: 0, y: 14 },  { opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: 'power3.out' })
            gsap.fromTo('.welcome-text',   { opacity: 0, y: 40 },  { opacity: 1, y: 0, duration: 1.0, delay: 0.25, ease: 'power3.out' })
            gsap.fromTo('.hero-divider',   { scaleX: 0 },          { scaleX: 1, duration: 0.8, delay: 0.6, ease: 'power2.out', transformOrigin: 'left' })
            gsap.fromTo('.hero-tagline',   { opacity: 0, y: 16 },  { opacity: 1, y: 0, duration: 0.8, delay: 0.7, ease: 'power2.out' })

            // Title cycling
            const tl = gsap.timeline({ delay: 1 })
            tl.to('.title', { filter: 'blur(8px)', duration: 0.1 })
              .to('.title', { filter: 'blur(0px)', duration: 0.6 })
              .to('.title', { text: 'ようこそ', duration: 1, ease: 'none', delay: 2 })
              .to('.scroll-text', { opacity: 1, duration: 2.5, ease: 'power2.out' })
              .to('.title', { text: 'Welcome', duration: 1.5, delay: 1 })
              .to('.scroll-text', { filter: 'blur(6px)' }, '-=1')
              .to('.scroll-text', { opacity: 0, text: 'Scroll to Explore' }, '-=0.4')
              .to('.scroll-text', { opacity: 1, filter: 'blur(0px)' })

            ScrollTrigger.create({
                trigger: '#ending-trigger',
                start: 'bottom+=100vh bottom',
                onEnter:     () => { setShowEnding(true);  fetch('/api/ending-visit', { method: 'POST' }) },
                onEnterBack: () => setShowEnding(true),
                onLeaveBack: () => setShowEnding(false),
            })
        })

        return () => ctx.revert()
    }, [loaded])

    return (
        <>
            <LoadingScreen key="loading-screen" progress={loadProgress} onComplete={() => setLoaded(true)} />
            <Cursor key="cursor" />

            <section key="intro-section" className="section-default intro" data-cursor="white">

                {/* Background layer */}
                <HeroParticles />
                <div className="hero-orb hero-orb-1" />
                <div className="hero-orb hero-orb-2" />
                <div className="hero-scanline" />

                {/* Visit counter */}
                <div className="visit-counter">
                    <span className="visit-label">visits</span>
                    <span className="visit-count">0</span>
                </div>

                {/* Main content */}
                <div className="hero-content">
                    <div className="hero-eyebrow">
                        Nikhil Charan — Portfolio
                    </div>

                    <HeroRoles />

                    <h1 className="welcome-text title">Yawwwn!!</h1>

                    <div className="hero-divider" />

                    <p className="hero-tagline">
                        A traveler between reality and dreams.
                    </p>

                    <p className="scroll-text">スクロールしてください</p>
                </div>

                {/* Decorative kanji watermark */}
                <div className="hero-deco-text" aria-hidden="true">夢</div>

            </section>

            <HorizontalScroll key="horizontal-scroll" isMobile={isMobile} />

            <section key="spacer-1" style={{ height: '2000vh' }} />
            <section key="ending-trigger" id="ending-trigger" style={{ height: '600vh' }} />

            <section key="ending-section" id="ending" className="ending-section" style={{ display: 'contents' }}>
                {showEnding && <EndingOverlay />}
            </section>

            <section key="spacer-2" style={{ height: '50vh' }} />
        </>
    )
}
