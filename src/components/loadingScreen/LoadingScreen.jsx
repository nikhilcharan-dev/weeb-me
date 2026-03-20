'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import './styles.css'

const GLITCH_CHARS = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEFabcdef!@#$%&'
const TARGETS = ['ようこそ', 'Welcome']
const SCRAMBLE_SPEED = 50
const BG_FRAGMENT_COUNT = 12

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
    opacity: 0.04 + Math.random() * 0.14,
    fontSize: `${0.7 + Math.random() * 1.4}rem`,
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
          opacity: Math.random() < 0.15
            ? 0.2 + Math.random() * 0.25
            : 0.04 + Math.random() * 0.12,
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

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Animate the percentage counter smoothly toward target progress
  useEffect(() => {
    const target = Math.min(Math.round(progress), 100)

    function tick() {
      const current = animatedProgress.current
      if (current < target) {
        const step = Math.max(1, Math.ceil((target - current) * 0.08))
        animatedProgress.current = Math.min(current + step, target)
        setDisplayPercent(animatedProgress.current)
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

  // Start the glitch cycle
  useEffect(() => {
    if (prefersReducedMotion.current) {
      setDisplayText('Loading...')
      return
    }
    runCycle()
    return () => clearInterval(intervalRef.current)
  }, [runCycle])

  // Handle completion
  useEffect(() => {
    if (displayPercent < 100 || completedRef.current) return
    completedRef.current = true
    clearInterval(intervalRef.current)

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
        }, 600)
      }, 500)
    })
  }, [displayPercent, scrambleTo, onComplete])

  if (removed) return null

  const padded = String(displayPercent).padStart(3, '0')

  return (
    <div className={`loading-screen ${dismissing ? 'loading-screen--dismiss' : ''}`}>
      <BackgroundGlitch />
      <div className="loading-content">
        <p className="loading-glitch-text">{displayText}</p>
        <div className="loading-bar-track">
          <div
            className="loading-bar-fill"
            style={{ width: `${displayPercent}%` }}
          />
        </div>
        <span className="loading-percent">{padded}%</span>
      </div>
    </div>
  )
}
