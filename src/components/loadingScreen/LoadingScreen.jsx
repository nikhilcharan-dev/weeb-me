'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import './styles.css'
import { playLoadTick, playLoadComplete } from '@/lib/sounds'

const GLITCH_CHARS = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEFabcdef!@#$%&'
const TARGETS = ['ようこそ', 'Welcome']
const SCRAMBLE_SPEED = 50
const BG_FRAGMENT_COUNT = 22
const CHAR_COLORS = ['#ffffff', '#ffffff', '#aaaaaa', '#666666', '#ff2e2e']

function randomChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
}

function randomFragment() {
  const len = 2 + Math.floor(Math.random() * 6)
  let str = ''
  for (let i = 0; i < len; i++) str += randomChar()
  return str
}

function makeFragments() {
  return Array.from({ length: BG_FRAGMENT_COUNT }, (_, i) => ({
    id: i,
    text: randomFragment(),
    top: `${5 + Math.random() * 90}%`,
    left: `${2 + Math.random() * 96}%`,
    opacity: 0.04 + Math.random() * 0.13,
    fontSize: `${0.65 + Math.random() * 1.3}rem`,
    color: CHAR_COLORS[Math.floor(Math.random() * CHAR_COLORS.length)],
  }))
}

function BackgroundGlitch() {
  const [fragments, setFragments] = useState([])

  useEffect(() => {
    setFragments(makeFragments())
    const interval = setInterval(() => {
      setFragments(prev =>
        prev.map(f => ({
          ...f,
          text: randomFragment(),
          opacity: Math.random() < 0.12
            ? 0.18 + Math.random() * 0.22
            : 0.04 + Math.random() * 0.11,
          color: Math.random() < 0.08
            ? CHAR_COLORS[Math.floor(Math.random() * CHAR_COLORS.length)]
            : f.color,
        }))
      )
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="loading-bg-glitch" aria-hidden="true">
      {fragments.map(f => (
        <span
          key={f.id}
          className="loading-bg-char"
          style={{
            top: f.top,
            left: f.left,
            opacity: f.opacity,
            fontSize: f.fontSize,
            color: f.color,
          }}
        >
          {f.text}
        </span>
      ))}
    </div>
  )
}

export default function LoadingScreen({ progress, onComplete }) {
  const [displayText, setDisplayText] = useState('')
  const [displayPercent, setDisplayPercent] = useState(0)
  const [dismissing, setDismissing] = useState(false)
  const [removed, setRemoved] = useState(false)
  const targetIndex = useRef(0)
  const intervalRef = useRef(null)
  const completedRef = useRef(false)
  const prefersReducedMotion = useRef(false)
  const animatedProgress = useRef(0)
  const progressRaf = useRef(null)
  const lastTickMilestone = useRef(0)

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    const target = Math.min(Math.round(progress), 100)

    if (target >= 100) {
      cancelAnimationFrame(progressRaf.current)
      animatedProgress.current = 100
      setDisplayPercent(100)
      return
    }

    function tick() {
      const current = animatedProgress.current
      if (current < target) {
        const step = Math.max(1, Math.ceil((target - current) * 0.08))
        animatedProgress.current = Math.min(current + step, target)
        setDisplayPercent(animatedProgress.current)

        const milestone = Math.floor(animatedProgress.current / 25) * 25
        if (milestone > lastTickMilestone.current && milestone < 100) {
          lastTickMilestone.current = milestone
          try { playLoadTick() } catch {}
        }

        progressRaf.current = requestAnimationFrame(tick)
      } else {
        animatedProgress.current = target
        setDisplayPercent(target)
      }
    }

    progressRaf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(progressRaf.current)
  }, [progress])

  const scrambleTo = useCallback((target, onDone) => {
    let revealed = 0
    const len = target.length

    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      let result = ''
      for (let i = 0; i < len; i++) {
        if (i < revealed) {
          result += target[i]
        } else {
          result += randomChar()
        }
      }
      setDisplayText(result)
      revealed++

      if (revealed > len) {
        clearInterval(intervalRef.current)
        setDisplayText(target)
        onDone?.()
      }
    }, SCRAMBLE_SPEED)
  }, [])

  const runCycle = useCallback(() => {
    if (completedRef.current) return

    const target = TARGETS[targetIndex.current % TARGETS.length]
    scrambleTo(target, () => {
      setTimeout(() => {
        if (!completedRef.current) {
          targetIndex.current++
          runCycle()
        }
      }, 800)
    })
  }, [scrambleTo])

  useEffect(() => {
    if (prefersReducedMotion.current) {
      setDisplayText('Loading...')
      return
    }
    runCycle()
    return () => clearInterval(intervalRef.current)
  }, [runCycle])

  useEffect(() => {
    if (displayPercent < 100 || completedRef.current) return
    completedRef.current = true
    clearInterval(intervalRef.current)

    try { playLoadComplete() } catch {}

    if (prefersReducedMotion.current) {
      setDisplayText('Welcome')
      setTimeout(() => {
        setDismissing(true)
        setTimeout(() => {
          setRemoved(true)
          onComplete?.()
        }, 100)
      }, 300)
      return
    }

    scrambleTo('Welcome', () => {
      setTimeout(() => {
        setDismissing(true)
        setTimeout(() => {
          setRemoved(true)
          onComplete?.()
        }, 700)
      }, 500)
    })
  }, [displayPercent, scrambleTo, onComplete])

  if (removed) return null

  const padded = String(displayPercent).padStart(3, '0')

  return (
    <div className={`loading-screen ${dismissing ? 'loading-screen--dismiss' : ''}`}>
      <BackgroundGlitch />
      <div className="loading-scanlines" aria-hidden="true" />
      <div className="loading-vignette" aria-hidden="true" />

      <div className="loading-corner loading-corner--tl" aria-hidden="true" />
      <div className="loading-corner loading-corner--tr" aria-hidden="true" />
      <div className="loading-corner loading-corner--bl" aria-hidden="true" />
      <div className="loading-corner loading-corner--br" aria-hidden="true" />

      <span className="loading-side-text loading-side-text--left" aria-hidden="true">初期化中</span>
      <span className="loading-side-text loading-side-text--right" aria-hidden="true">PORTFOLIO</span>

      <div className="loading-content">
        <p className="loading-label">SYSTEM INIT</p>
        <p className="loading-glitch-text">{displayText}</p>
        <div className="loading-bar-wrap">
          <div className="loading-bar-track">
            <div
              className="loading-bar-fill"
              style={{ width: `${displayPercent}%` }}
            />
          </div>
          <div className="loading-bar-meta">
            <span className="loading-bar-status">LOADING ASSETS</span>
            <span className="loading-percent">[{padded}%]</span>
          </div>
        </div>
      </div>
    </div>
  )
}
