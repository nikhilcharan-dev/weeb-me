'use client';

import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./styles.css";

const timelineItems = [
  {
    idx: "01", year: "2023",
    title: "B.Tech Begins",
    tags: ["Aditya Engineering College"],
  },
  {
    idx: "02", year: "Sem 1",
    title: "First Code",
    tags: ["Ignite Coder", "Learned C", "Won Weekly Contest-3"],
  },
  {
    idx: "03", year: "Sem 2",
    title: "Going Deeper",
    tags: ["Ignite Coder", "Data Structures & Algorithms"],
  },
  {
    idx: "04", year: "Sem 3",
    title: "Stack Expands",
    tags: ["Bamboo Coders", "Java · Python", "ADSA", "React & Node"],
  },
  {
    idx: "05", year: "Sem 4",
    title: "Going Pro",
    tags: ["SkillUp", "OS · DBMS", "Competitive Programming"],
  },
  {
    idx: "06", year: "Sem 5–6",
    title: "Industry Ready",
    tags: ["MERN Stack", "Owl Coder 5.0", "Drive Ready"],
  },
]

// 22vw steps — cards spread with breathing room, last at 116vw
const LEFT_POS = ['6vw', '28vw', '50vw', '72vw', '94vw', '116vw']

export default function PanelFour({ hsTimeline, timelineReady }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!timelineReady || !hsTimeline?.current) return

    const ctx = gsap.context(() => {

      // Header
      gsap.set('.p4-header', { opacity: 0, x: -28 })
      hsTimeline.current.to('.p4-header', {
        opacity: 1, x: 0, duration: 0.4, ease: 'power2.out',
      }, 'panel-4+=0.05')

      // Rail draws left → right
      gsap.set('.p4-h-line', { scaleX: 0, transformOrigin: 'left center' })
      hsTimeline.current.to('.p4-h-line', {
        scaleX: 1, duration: 1.5, ease: 'none',
      }, 'panel-4+=0.1')

      // Spark travels along the rail
      gsap.set('.p4-spark', { x: 0, opacity: 1 })
      hsTimeline.current.to('.p4-spark', {
        x: () => window.innerWidth * 1.16,
        duration: 1.5, ease: 'power2.inOut',
      }, 'panel-4+=0.6')
      hsTimeline.current.to('.p4-spark', {
        opacity: 0, duration: 0.2,
      }, 'panel-4+=2.05')

      // Items
      const items = gsap.utils.toArray('.p4-item')
      items.forEach((item, i) => {
        const above = i % 2 !== 0
        const at = `panel-4+=${0.28 + i * 0.24}`

        gsap.set(item, { opacity: 0, y: above ? -52 : 52, filter: 'blur(9px)' })
        hsTimeline.current.to(item, {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 0.32, ease: 'power3.out',
        }, at)

        // Dot: scale pop + glow burst + settle
        const dot = item.querySelector('.p4-dot')
        if (dot) {
          gsap.set(dot, { scale: 0 })
          hsTimeline.current.to(dot, {
            scale: 1, duration: 0.2, ease: 'back.out(2.8)',
          }, at)
          hsTimeline.current.to(dot, {
            boxShadow: '0 0 20px rgba(255,255,255,1), 0 0 40px rgba(255,255,255,0.5)',
            duration: 0.15,
          }, `${at}+=0.1`)
          hsTimeline.current.to(dot, {
            boxShadow: '0 0 6px rgba(255,255,255,0.35), 0 0 14px rgba(255,255,255,0.1)',
            duration: 0.5,
          }, `${at}+=0.25`)
        }
      })

    }, panelRef)

    return () => ctx.revert()
  }, [timelineReady])

  return (
    <section ref={panelRef} className="panel-four">

      {/* Dot-grid background */}
      <div className="p4-grid" aria-hidden="true" />

      {/* Header */}
      <div className="p4-header">
        <div className="p4-header-line" />
        <h1 className="p4-title">Journey</h1>
        <p className="p4-sub">
          A quiet progression through communities, semesters,<br />
          and skills that slowly turned curiosity into capability.
        </p>
      </div>

      {/* Rail + traveling spark */}
      <div className="p4-h-line" />
      <div className="p4-spark" aria-hidden="true" />

      {/* Timeline items */}
      {timelineItems.map((item, i) => {
        const above = i % 2 !== 0
        return (
          <div
            key={i}
            className={`p4-item ${above ? 'p4-item--above' : 'p4-item--below'}`}
            style={{ left: LEFT_POS[i] }}
          >
            {above ? (
              <>
                <div className="p4-card">
                  <span className="p4-card-idx" aria-hidden="true">{item.idx}</span>
                  <span className="p4-card-year">{item.year}</span>
                  <h3 className="p4-card-title">{item.title}</h3>
                  <ul className="p4-card-tags">
                    {item.tags.map((t, j) => <li key={j}>{t}</li>)}
                  </ul>
                </div>
                <div className="p4-conn" />
                <span className="p4-dot" />
              </>
            ) : (
              <>
                <span className="p4-dot" />
                <div className="p4-conn" />
                <div className="p4-card">
                  <span className="p4-card-idx" aria-hidden="true">{item.idx}</span>
                  <span className="p4-card-year">{item.year}</span>
                  <h3 className="p4-card-title">{item.title}</h3>
                  <ul className="p4-card-tags">
                    {item.tags.map((t, j) => <li key={j}>{t}</li>)}
                  </ul>
                </div>
              </>
            )}
          </div>
        )
      })}

    </section>
  )
}
