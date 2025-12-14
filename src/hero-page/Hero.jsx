'use client'
import './styles.css'
import AnimatedText from "../../components/textAnimation/AnimatedText";

export default function HeroPage() {
    return (
        <section className="hero-section">
            <article className="hero">
                <div className="text-animation-container">
                    <AnimatedText />
                </div>
                <p className='subtitle' > -Enthusiast</p>
                <p className='hero-bio' >Full-stack developer and problem-solver with strong skills in MERN, C++, and modern frontend engineering. </p>
                <p className='hero-bio' >I enjoy building scalable products, solving complex challenges, and bringing ideas to life—from full-stack applications to 3D interfaces. </p>
                <p className='hero-bio' >Curiosity drives my learning, and I bring a calm, adaptable mindset even when things get chaotic. </p>
                <p className='hero-bio' >Focused on growth, impact, and working toward a future in big tech.</p>
            </article>
        </section>
    )
}