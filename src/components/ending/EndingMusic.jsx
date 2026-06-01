'use client';

import { useEffect, useRef, useState } from 'react';
import './ending-music.css';

// ── Frequencies ───────────────────────────────────────────────
const N = {
    D2: 73.42,  E2: 82.41,  F2: 87.31,  G2: 98.00,  A2: 110.00, B2: 123.47,
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00,
    A3: 220.00, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63,
    F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99,
};

// ── Timing ────────────────────────────────────────────────────
const BPM  = 58;
const B    = 60 / BPM;   // ~1.03 s per beat
const BAR  = B * 4;       // ~4.14 s per bar  →  8 bars ≈ 33 s loop

// Dynamic swell — bar 0 is intimate, bar 7 is orchestral climax
const DYN = [0.28, 0.38, 0.52, 0.62, 0.72, 0.82, 0.90, 1.0];

// ── Chord progression  Am Am F F C G Am Em ───────────────────
const CHORDS = [
    { bass: N.A2, notes: [N.A3, N.C4, N.E4] },
    { bass: N.A2, notes: [N.A3, N.C4, N.E4] },
    { bass: N.F2, notes: [N.F3, N.A3, N.C4] },
    { bass: N.F2, notes: [N.F3, N.A3, N.C4] },
    { bass: N.C3, notes: [N.C3, N.E3, N.G3] },
    { bass: N.G2, notes: [N.G3, N.B3, N.D4] },
    { bass: N.A2, notes: [N.A3, N.C4, N.E4] },
    { bass: N.E2, notes: [N.E3, N.G3, N.B3] },
];

// ── Main melody [freq | null, beats] ─────────────────────────
const MELODY = [
    [N.E4, 1],  [N.A4,  1],  [N.C5, 1.5], [N.B4, 0.5], // Bar 0 — rising yearning
    [N.A4, 2],  [N.G4,  1.5],[N.F4, 0.5],               // Bar 1 — falling back
    [N.A4, 1],  [N.F4,  1],  [N.G4, 2],                 // Bar 2 — reaching
    [N.A4, 3.5],[null,  0.5],                            // Bar 3 — sustained longing
    [N.G4, 1],  [N.E4,  1],  [N.C5, 2],                 // Bar 4 — moment of light
    [N.B4, 1.5],[N.A4,  0.5],[N.G4, 2],                 // Bar 5 — tension builds
    [N.F4, 1.5],[N.E4,  0.5],[N.D4, 1],  [N.E4, 1],    // Bar 6 — the descent
    [N.A4, 2.5],[N.G4,  0.5],[null, 1],                  // Bar 7 — bittersweet close
];

// Flute counter-melody above violin (bars 4-5)
const COUNTER = [
    [N.E5, 1], [N.C5, 1], [N.G5, 1], [N.E5, 1],   // Bar 4 (C)
    [N.D5, 1], [N.B4, 1], [N.D5, 1], [N.B4, 1],   // Bar 5 (G)
];

const ARP = [0, 1, 2, 1, 0, 2, 1, 0]; // up-down arpeggio pattern

// ── Convolution reverb (synthetic hall) ──────────────────────
function createReverb(ctx) {
    const conv = ctx.createConvolver();
    const sr   = ctx.sampleRate;
    const len  = Math.floor(sr * 3.8);
    const buf  = ctx.createBuffer(2, len, sr);
    for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        for (let i = 0; i < len; i++)
            d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
    }
    conv.buffer = buf;
    return conv;
}

// ── Instrument voices ─────────────────────────────────────────

// Warm sine pad — triple-detuned chorus shimmer
function playPad(ctx, dry, rev, freq, t, dur, vol) {
    for (const cents of [0, 7, -7]) {
        const osc = ctx.createOscillator();
        const g   = ctx.createGain();
        osc.type            = 'sine';
        osc.frequency.value = freq;
        osc.detune.value    = cents;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol, t + 1.4);
        g.gain.setValueAtTime(vol, t + dur - 0.4);
        g.gain.linearRampToValueAtTime(0, t + dur + 0.4);
        osc.connect(g); g.connect(dry); g.connect(rev);
        osc.start(t); osc.stop(t + dur + 0.5);
    }
}

// Harp — triangle + octave harmonic, fast pluck decay
function playHarp(ctx, dry, rev, freq, t, vol) {
    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const gH = ctx.createGain();
    const g  = ctx.createGain();
    o1.type = 'triangle'; o1.frequency.value = freq;
    o2.type = 'sine';     o2.frequency.value = freq * 2;
    gH.gain.value = 0.18;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.007);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);
    o2.connect(gH); gH.connect(g); o1.connect(g);
    g.connect(dry); g.connect(rev);
    o1.start(t); o1.stop(t + 1.1);
    o2.start(t); o2.stop(t + 1.1);
}

// Flute — sine + breath noise + vibrato on frequency
function playFlute(ctx, dry, rev, freq, t, dur, vol) {
    if (!freq || vol <= 0) return;
    const osc     = ctx.createOscillator();
    const lfo     = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const g       = ctx.createGain();

    // Breath noise
    const nBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const nD   = nBuf.getChannelData(0);
    for (let i = 0; i < nD.length; i++) nD[i] = Math.random() * 2 - 1;
    const nSrc  = ctx.createBufferSource();
    const nFilt = ctx.createBiquadFilter();
    const nGain = ctx.createGain();
    nSrc.buffer = nBuf; nSrc.loop = true;
    nFilt.type = 'bandpass'; nFilt.frequency.value = freq * 1.4; nFilt.Q.value = 3;
    nGain.gain.value = 0.025;

    osc.type = 'sine'; osc.frequency.value = freq;

    // Vibrato — modulate frequency directly
    lfo.type = 'sine'; lfo.frequency.value = 4.8;
    lfoGain.gain.setValueAtTime(0, t);
    lfoGain.gain.linearRampToValueAtTime(freq * 0.006, t + 0.22); // ≈10 cents
    lfo.connect(lfoGain); lfoGain.connect(osc.frequency);

    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.07);
    g.gain.setValueAtTime(vol, t + Math.max(0, dur - 0.05));
    g.gain.linearRampToValueAtTime(0, t + dur + 0.06);

    nSrc.connect(nFilt); nFilt.connect(nGain); nGain.connect(g);
    osc.connect(g); g.connect(dry); g.connect(rev);

    const end = t + dur + 0.1;
    lfo.start(t);  lfo.stop(end);
    nSrc.start(t); nSrc.stop(end);
    osc.start(t);  osc.stop(end);
}

// Violin — sawtooth + detune + LFO vibrato + low-pass
function playViolin(ctx, dry, rev, freq, t, dur, vol) {
    if (!freq || vol <= 0) return;
    const o1      = ctx.createOscillator();
    const o2      = ctx.createOscillator();
    const lfo     = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const filt    = ctx.createBiquadFilter();
    const g       = ctx.createGain();

    o1.type = 'sawtooth'; o1.frequency.value = freq;
    o2.type = 'sawtooth'; o2.frequency.value = freq; o2.detune.value = 9;

    lfo.type = 'sine'; lfo.frequency.value = 5.5;
    lfoGain.gain.setValueAtTime(0, t);
    lfoGain.gain.linearRampToValueAtTime(14, t + Math.min(0.3, dur * 0.35));
    lfo.connect(lfoGain);
    lfoGain.connect(o1.detune);
    lfoGain.connect(o2.detune);

    filt.type = 'lowpass'; filt.frequency.value = 2100; filt.Q.value = 0.5;

    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.14);     // bow attack
    g.gain.setValueAtTime(vol, t + Math.max(0, dur - 0.1));
    g.gain.linearRampToValueAtTime(0, t + dur + 0.09);

    o1.connect(filt); o2.connect(filt); filt.connect(g);
    g.connect(dry); g.connect(rev);

    const end = t + dur + 0.15;
    lfo.start(t); lfo.stop(end);
    o1.start(t);  o1.stop(end);
    o2.start(t);  o2.stop(end);
}

// Cello — deeper violin; warmer filter, slower bow
function playCello(ctx, dry, rev, freq, t, dur, vol) {
    if (!freq || vol <= 0) return;
    const o1      = ctx.createOscillator();
    const o2      = ctx.createOscillator();
    const lfo     = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const filt    = ctx.createBiquadFilter();
    const g       = ctx.createGain();

    o1.type = 'sawtooth'; o1.frequency.value = freq;
    o2.type = 'sawtooth'; o2.frequency.value = freq; o2.detune.value = 11;

    lfo.type = 'sine'; lfo.frequency.value = 4.3;
    lfoGain.gain.setValueAtTime(0, t);
    lfoGain.gain.linearRampToValueAtTime(11, t + 0.42);
    lfo.connect(lfoGain); lfoGain.connect(o1.detune);

    filt.type = 'lowpass'; filt.frequency.value = 1600; filt.Q.value = 0.7;

    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.26);     // slower bow
    g.gain.setValueAtTime(vol, t + Math.max(0, dur - 0.14));
    g.gain.linearRampToValueAtTime(0, t + dur + 0.14);

    o1.connect(filt); o2.connect(filt); filt.connect(g);
    g.connect(dry); g.connect(rev);

    const end = t + dur + 0.2;
    lfo.start(t); lfo.stop(end);
    o1.start(t);  o1.stop(end);
    o2.start(t);  o2.stop(end);
}

// French horn — square wave through warm filter, majestic attack
function playHorn(ctx, dry, rev, freq, t, dur, vol) {
    if (vol <= 0) return;
    const osc  = ctx.createOscillator();
    const filt = ctx.createBiquadFilter();
    const g    = ctx.createGain();
    osc.type = 'square'; osc.frequency.value = freq;
    filt.type = 'lowpass'; filt.frequency.value = 1500; filt.Q.value = 0.8;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.14);
    g.gain.setValueAtTime(vol, t + Math.max(0, dur - 0.16));
    g.gain.linearRampToValueAtTime(0, t + dur + 0.2);
    osc.connect(filt); filt.connect(g);
    g.connect(dry); g.connect(rev);
    osc.start(t); osc.stop(t + dur + 0.25);
}

// Choir "aah" — harmonic series, very slow attack
function playChoir(ctx, dry, rev, freq, t, dur, vol) {
    const harmonics = [
        [1.0,   0,  1.00],
        [2.0,   5,  0.50],
        [3.0,  -4,  0.24],
        [4.0,   7,  0.11],
        [0.5,  -3,  0.32],  // sub-octave warmth
    ];
    for (const [ratio, cents, rel] of harmonics) {
        const osc = ctx.createOscillator();
        const g   = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq * ratio;
        osc.detune.value    = cents;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol * rel, t + 1.0); // choir breathes in slowly
        g.gain.setValueAtTime(vol * rel, t + dur - 0.2);
        g.gain.linearRampToValueAtTime(0, t + dur + 0.7);
        osc.connect(g); g.connect(dry); g.connect(rev);
        osc.start(t); osc.stop(t + dur + 0.8);
    }
}

// Orchestral kick — sine sweep 160 → 40 Hz
function playKick(ctx, dry, t, vol) {
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.13);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
    osc.connect(g); g.connect(dry);
    osc.start(t); osc.stop(t + 0.48);
}

// ── Main scheduling loop ──────────────────────────────────────
function scheduleLoop(ctx, dry, rev, t0, activeRef, tidRef) {
    if (!activeRef.current || ctx.state === 'closed') return;

    const total = CHORDS.length * BAR;

    // 1. Warm pads — all bars
    CHORDS.forEach((ch, bi) => {
        const t = t0 + bi * BAR;
        const d = DYN[bi];
        playPad(ctx, dry, rev, ch.bass, t, BAR, 0.10 * d);
        ch.notes.forEach(f => playPad(ctx, dry, rev, f, t, BAR, 0.034 * d));
    });

    // 2. Harp arpeggios — all bars, volume grows
    CHORDS.forEach((ch, bi) => {
        const bs = t0 + bi * BAR;
        const d  = DYN[bi];
        ARP.forEach((ni, si) => playHarp(ctx, dry, rev, ch.notes[ni], bs + si * (B / 2), 0.040 * d));
    });

    // 3. Pre-compute melody note times
    const melNotes = [];
    let mt = t0;
    for (const [freq, beats] of MELODY) {
        melNotes.push({ freq, beats, t: mt, bi: Math.floor((mt - t0) / BAR) });
        mt += beats * B;
    }

    // 4. Flute — melody bars 0-1 (intimate solo), counter bars 4-5
    melNotes.forEach(({ freq, beats, t, bi }) => {
        if (bi < 2) playFlute(ctx, dry, rev, freq, t, beats * B - 0.05, 0.22 * DYN[bi]);
    });

    // Flute counter-melody over violin (bars 4-5)
    let ct = t0 + 4 * BAR;
    for (const [freq, beats] of COUNTER) {
        const bi = Math.floor((ct - t0) / BAR);
        playFlute(ctx, dry, rev, freq, ct, beats * B - 0.05, 0.11 * DYN[bi]);
        ct += beats * B;
    }

    // 5. Violin — melody bars 2-7 (takes over from flute)
    melNotes.forEach(({ freq, beats, t, bi }) => {
        if (bi >= 2) playViolin(ctx, dry, rev, freq, t, beats * B - 0.05, 0.17 * DYN[bi]);
    });

    // 6. Cello — harmony bars 2-7 (chord root + 5th sustained)
    CHORDS.slice(2).forEach((ch, i) => {
        const bi = i + 2;
        const t  = t0 + bi * BAR;
        const d  = DYN[bi];
        playCello(ctx, dry, rev, ch.bass * 2, t, BAR, 0.085 * d);   // octave up from bass
        playCello(ctx, dry, rev, ch.notes[2],  t, BAR, 0.050 * d);   // chord 5th/top
    });

    // 7. Horn — bars 5-6, staggered entries
    [5, 6].forEach(bi => {
        const t  = t0 + bi * BAR;
        const d  = DYN[bi];
        const ch = CHORDS[bi];
        playHorn(ctx, dry, rev, ch.notes[0], t,              BAR * 0.5, 0.075 * d);
        playHorn(ctx, dry, rev, ch.notes[2], t + BAR * 0.5,  BAR * 0.5, 0.075 * d);
    });

    // 8. CLIMAX: bar 7 — choir + horn wall + heavy drums
    const ct7 = t0 + 7 * BAR;

    // Choir swells on all chord tones
    CHORDS[7].notes.forEach(f => playChoir(ctx, dry, rev, f, ct7, BAR, 0.20));
    playChoir(ctx, dry, rev, CHORDS[7].bass * 2, ct7, BAR, 0.12); // bass octave choir

    // Horn enters on each note slightly staggered (epic fanfare feel)
    CHORDS[7].notes.forEach((f, i) =>
        playHorn(ctx, dry, rev, f, ct7 + i * 0.07, BAR - i * 0.07, 0.11)
    );
    // Violin tutti on climax chord
    CHORDS[7].notes.forEach(f => playViolin(ctx, dry, rev, f, ct7, BAR, 0.13));
    // Cello doubles the bass
    playCello(ctx, dry, rev, CHORDS[7].bass * 2, ct7, BAR, 0.12);

    // 9. Drums — build from bar 5, peak at bar 7
    // Bar 5: light 2-hit
    [0, 2].forEach(beat =>
        playKick(ctx, dry, t0 + 5 * BAR + beat * B, 0.22)
    );
    // Bar 6: quarter-note pulse
    [0, 1, 2, 3].forEach(beat =>
        playKick(ctx, dry, t0 + 6 * BAR + beat * B, 0.32)
    );
    // Bar 7: driving 8th-note tribal (HTTYD)
    [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.25, 3.5, 3.75].forEach(beat =>
        playKick(ctx, dry, ct7 + beat * B, 0.42)
    );

    // ── loop ──
    const ms = Math.max((t0 + total - ctx.currentTime - 1) * 1000, 0);
    tidRef.current = setTimeout(() => {
        scheduleLoop(ctx, dry, rev, t0 + total, activeRef, tidRef);
    }, ms);
}

// ── Component ─────────────────────────────────────────────────
export default function EndingMusic() {
    const [playing, setPlaying] = useState(false);
    const [started, setStarted] = useState(false);

    const ctxRef    = useRef(null);
    const masterRef = useRef(null);
    const activeRef = useRef(true);
    const tidRef    = useRef(null);
    const initRef   = useRef(false);

    function boot(ctx) {
        if (initRef.current) return;
        initRef.current = true;

        const rev  = createReverb(ctx);
        const dry  = ctx.createGain(); dry.gain.value = 1;
        const wet  = ctx.createGain(); wet.gain.value = 0.36;

        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.value = 5500;

        // Compressor prevents clipping on the climax
        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -20;
        comp.knee.value      = 8;
        comp.ratio.value     = 5;
        comp.attack.value    = 0.004;
        comp.release.value   = 0.3;

        const master = ctx.createGain();
        master.gain.setValueAtTime(0, ctx.currentTime);
        master.gain.linearRampToValueAtTime(0.68, ctx.currentTime + 5);
        masterRef.current = master;

        rev.connect(wet);
        wet.connect(lp);
        dry.connect(lp);
        lp.connect(comp);
        comp.connect(master);
        master.connect(ctx.destination);

        scheduleLoop(ctx, dry, rev, ctx.currentTime + 0.1, activeRef, tidRef);
        setStarted(true);
        setPlaying(true);
    }

    useEffect(() => {
        activeRef.current = true;

        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        ctxRef.current = ctx;

        // Attempt auto-start — scroll gesture is enough in modern browsers
        ctx.resume().then(() => {
            if (ctx.state === 'running') boot(ctx);
        });

        return () => {
            activeRef.current = false;
            if (tidRef.current) clearTimeout(tidRef.current);
            ctx.close();
        };
    }, []);

    function handleClick() {
        const ctx = ctxRef.current;
        if (!ctx) return;

        if (!initRef.current) {
            ctx.resume().then(() => boot(ctx));
            return;
        }

        const m   = masterRef.current;
        const now = ctx.currentTime;
        m.gain.cancelScheduledValues(now);
        m.gain.setValueAtTime(m.gain.value, now);

        if (playing) {
            m.gain.linearRampToValueAtTime(0, now + 0.6);
            setPlaying(false);
        } else {
            m.gain.linearRampToValueAtTime(0.68, now + 0.6);
            setPlaying(true);
        }
    }

    return (
        <button
            className={`ending-music-btn${playing ? ' is-playing' : ''}`}
            onClick={handleClick}
            aria-label={playing ? 'Mute music' : started ? 'Unmute music' : 'Play music'}
            title={playing ? 'Mute' : started ? 'Unmute' : 'Play'}
        >
            {playing && (
                <>
                    <span className="music-ring" style={{ '--delay': '0s' }} />
                    <span className="music-ring" style={{ '--delay': '0.7s' }} />
                    <span className="music-ring" style={{ '--delay': '1.4s' }} />
                </>
            )}
            <span className="ending-music-icon">{playing ? '♫' : '♪'}</span>
        </button>
    );
}
