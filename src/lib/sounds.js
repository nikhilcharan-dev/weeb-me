let ctx = null
let unlocked = false

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// Unlock audio context on first user interaction
function ensureUnlocked() {
  if (unlocked) return

  const unlock = () => {
    const ac = getCtx()
    if (ac.state === 'suspended') ac.resume()

    // Play silent buffer to fully unlock on iOS/Safari
    const buf = ac.createBuffer(1, 1, ac.sampleRate)
    const src = ac.createBufferSource()
    src.buffer = buf
    src.connect(ac.destination)
    src.start(0)

    unlocked = true
    window.removeEventListener('click', unlock)
    window.removeEventListener('touchstart', unlock)
    window.removeEventListener('keydown', unlock)
  }

  window.addEventListener('click', unlock)
  window.addEventListener('touchstart', unlock)
  window.addEventListener('keydown', unlock)
}

// Auto-attach unlock listeners
if (typeof window !== 'undefined') {
  ensureUnlocked()
}

// ─── CLICK SOUND ── crystal bell tap ───────────────
export function playClick() {
  const ac = getCtx()
  if (ac.state === 'suspended') return
  const t = ac.currentTime

  // Three stacked harmonics for a crystal-bell tone
  const freqs  = [1320, 1980, 2640]
  const master = ac.createGain()
  master.gain.setValueAtTime(0.13, t)
  master.gain.exponentialRampToValueAtTime(0.001, t + 0.22)
  master.connect(ac.destination)

  freqs.forEach((f, i) => {
    const osc  = ac.createOscillator()
    const gain = ac.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(f, t)
    osc.frequency.exponentialRampToValueAtTime(f * 0.5, t + 0.18)
    gain.gain.setValueAtTime(1 - i * 0.28, t)
    osc.connect(gain)
    gain.connect(master)
    osc.start(t)
    osc.stop(t + 0.22)
  })
}

// ─── LOADING TICK ── soft digital blip ─────────────
export function playLoadTick() {
  const ac = getCtx()
  if (ac.state === 'suspended') return
  const t = ac.currentTime

  const osc  = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = 'square'
  osc.frequency.setValueAtTime(880, t)
  osc.frequency.exponentialRampToValueAtTime(440, t + 0.04)
  gain.gain.setValueAtTime(0.04, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06)
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.start(t)
  osc.stop(t + 0.06)
}

// ─── LOAD COMPLETE ── ascending arpeggio chime ─────
export function playLoadComplete() {
  const ac = getCtx()
  if (ac.state === 'suspended') return
  const t = ac.currentTime

  // C5 – E5 – G5 – C6 quick arpeggio
  const notes = [523, 659, 784, 1047]
  const master = ac.createGain()
  master.gain.setValueAtTime(0.12, t)
  master.connect(ac.destination)

  notes.forEach((freq, i) => {
    const osc  = ac.createOscillator()
    const gain = ac.createGain()
    const s    = t + i * 0.075
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.9, s)
    gain.gain.exponentialRampToValueAtTime(0.001, s + 0.35)
    osc.connect(gain)
    gain.connect(master)
    osc.start(s)
    osc.stop(s + 0.35)
  })
}

// ─── GLITCH SOUND ───
// Digital noise burst — louder, longer, more presence
export function playGlitch() {
  const ac = getCtx()
  if (ac.state === 'suspended') return // skip if audio not yet unlocked
  const duration = 0.25

  // Noise buffer
  const bufferSize = Math.floor(ac.sampleRate * duration)
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.round((Math.random() * 2 - 1) * 4) / 4
  }

  const noise = ac.createBufferSource()
  noise.buffer = buffer

  // Bandpass for character
  const filter = ac.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 1500 + Math.random() * 2500
  filter.Q.value = 3

  // Distortion for crunch
  const waveshaper = ac.createWaveShaper()
  const curve = new Float32Array(256)
  for (let i = 0; i < 256; i++) {
    const x = (i * 2) / 256 - 1
    curve[i] = Math.tanh(x * 3)
  }
  waveshaper.curve = curve

  const gain = ac.createGain()
  gain.gain.setValueAtTime(0.25, ac.currentTime)
  gain.gain.linearRampToValueAtTime(0.15, ac.currentTime + duration * 0.3)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration)

  noise.connect(filter)
  filter.connect(waveshaper)
  waveshaper.connect(gain)
  gain.connect(ac.destination)
  noise.start(ac.currentTime)
}

// ─── BLACKHOLE DRONE ───
// Audible on laptop speakers: mid-range hum + harmonics + rumble
let activeDrone = null

export function startBlackHoleDrone() {
  if (activeDrone) return activeDrone

  const ac = getCtx()
  if (ac.state === 'suspended') return null

  // Main tone — audible range
  const osc1 = ac.createOscillator()
  osc1.type = 'sine'
  osc1.frequency.value = 110 // A2, clearly audible

  // Detuned for beating/unease
  const osc2 = ac.createOscillator()
  osc2.type = 'sine'
  osc2.frequency.value = 113

  // Upper harmonic for presence on small speakers
  const osc3 = ac.createOscillator()
  osc3.type = 'triangle'
  osc3.frequency.value = 220

  const osc3Gain = ac.createGain()
  osc3Gain.gain.value = 0.06

  // Sub-bass for systems that can play it
  const sub = ac.createOscillator()
  sub.type = 'sine'
  sub.frequency.value = 55

  const subGain = ac.createGain()
  subGain.gain.value = 0.1

  // LFO for slow pulsing
  const lfo = ac.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = 0.25
  const lfoGain = ac.createGain()
  lfoGain.gain.value = 0.06

  // Rumble noise
  const bufferSize = ac.sampleRate * 2
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1)
  }
  const noise = ac.createBufferSource()
  noise.buffer = buffer
  noise.loop = true

  const noiseFilter = ac.createBiquadFilter()
  noiseFilter.type = 'lowpass'
  noiseFilter.frequency.value = 250
  noiseFilter.Q.value = 3

  const noiseGain = ac.createGain()
  noiseGain.gain.value = 0.08

  // Master gain — fade in
  const master = ac.createGain()
  master.gain.setValueAtTime(0, ac.currentTime)
  master.gain.linearRampToValueAtTime(0.2, ac.currentTime + 1.5)

  // Connect LFO
  lfo.connect(lfoGain)
  lfoGain.connect(master.gain)

  // Connect oscillators
  osc1.connect(master)
  osc2.connect(master)
  osc3.connect(osc3Gain)
  osc3Gain.connect(master)
  sub.connect(subGain)
  subGain.connect(master)

  // Connect noise
  noise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(master)

  master.connect(ac.destination)

  osc1.start()
  osc2.start()
  osc3.start()
  sub.start()
  lfo.start()
  noise.start()

  const stop = () => {
    const now = ac.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(master.gain.value, now)
    master.gain.linearRampToValueAtTime(0, now + 1.0)
    setTimeout(() => {
      try {
        osc1.stop()
        osc2.stop()
        osc3.stop()
        sub.stop()
        lfo.stop()
        noise.stop()
      } catch {}
      activeDrone = null
    }, 1200)
  }

  activeDrone = { stop }
  return activeDrone
}

export function stopBlackHoleDrone() {
  if (activeDrone) {
    activeDrone.stop()
  }
}

// ─── AVATAR VOICE ───
// Pre-generated ElevenLabs voice lines
const VOICE_COUNT = 14
let lastVoiceLine = -1
let voicePlaying = false

export function playAvatarInteract() {
  if (voicePlaying) return

  // Pick random line, avoid repeat
  let idx = Math.floor(Math.random() * VOICE_COUNT)
  if (idx === lastVoiceLine && VOICE_COUNT > 1) {
    idx = (idx + 1) % VOICE_COUNT
  }
  lastVoiceLine = idx

  const padded = String(idx).padStart(2, '0')
  const audio = new Audio(`/sounds/voice_${padded}.mp3`)
  audio.volume = 0.85

  voicePlaying = true
  audio.onended = () => { voicePlaying = false }
  audio.onerror = () => { voicePlaying = false }
  audio.play().catch(() => { voicePlaying = false })
}
