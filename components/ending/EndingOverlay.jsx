'use client';

import './ending.css';

export default function EndingOverlay() {
    return (
        <div className="ending-overlay">
            <h1>Nikhil Charan</h1>
            <p className="subtitle">
                Creative Engineer · Systems Thinker
            </p>

            <p className="closing-line">
                I don’t just build projects.<br />
                I build worlds where logic, emotion,<br />
                and motion meet.
            </p>

            <div className="ending-actions">
                <a href="https://drive.google.com/file/d/1fOAL00BsaVEz0k9fc5M_7UBLfFLpyyTq/view?usp=drive_link" target="_blank">View Resume</a>
                <a href="mailto:nikhilcharangollapalli@email.com">Contact Me</a>
            </div>

            <span className="thanks">Thank you for staying till the end.</span>
        </div>
    );
}
