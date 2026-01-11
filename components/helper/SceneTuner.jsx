'use client';

import { useState, useRef } from "react";
import "./sceneTuner.css";

const images = [
    "a_tree.png",
    "angels_on_clouds.png",
    "bouque.png",
    "bouque_2.png",
    "bunnies_swinging.png",

    "catz_1.png",
    "catz_2.png",
    "catz_3.png",
    "catz_4.png",

    "clouds_1.png",
    "clouds_2.png",
    "clouds_3.jpg",
    "clouds_decor.png",

    "crown.png",
    "cupid_god.png",

    "deer_resting.png",
    "deer_resting_mini.png",

    "decor.png",

    "dream_hands.png",
    "dream_hands_1.png",
    "dreamy_us.png",

    "empty_yet_full.png",

    "feather_decor.png",
    "feather_hand.png",

    "flower_blue.png",
    "flower_decor.png",
    "flower_decor_1.png",
    "flower_decor_2.png",
    "flower_decor_3.png",
    "flower_guy.png",

    "foxy_me.png",

    "galaxy_1.png",
    "galaxy_2.jpg",

    "looking_down.png",
    "love_bird.png",
    "love_letter.png",

    "mushrooms.png",

    "nova_falling.png",

    "our_faith.png",

    "peacock.png",

    "rabbit_sorcerer.jpg",
    "rabbit_violinist.png",

    "reaching_heavens.png",

    "rose.png",
    "roses_side.png",

    "ruru_dancing.png",
    "ruru_eyes.png",
    "ruru_no_mercy.png",
    "ruru_reading.png",
    "ruru_smiling.png",

    "spider_me.png",

    "stars_decor.png",

    "sun_moon.png",

    "teddy.png",

    "us_as_catzz.png",

    "vase_1.png",

    "waterfall.png",

    "who_might_it_be.png",

    "wings.png",

    "wine_1.png",
    "wine_2.png",
];


export default function PanelSceneTuner() {
    const cardRef = useRef(null);
    const drag = useRef({ x: 0, y: 0, active: false });

    // 🔑 state per image
    const [items, setItems] = useState(() =>
        Object.fromEntries(
            images.map((img) => [
                img,
                { x: 0, y: 0, scale: 0.7, visible: false },
            ])
        )
    );

    const [active, setActive] = useState(images[0]);

    const current = items[active];

    // -------- drag card --------
    function onMouseDown(e) {
        drag.current.active = true;
        drag.current.x = e.clientX;
        drag.current.y = e.clientY;
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }

    function onMouseMove(e) {
        if (!drag.current.active || !cardRef.current) return;
        const dx = e.clientX - drag.current.x;
        const dy = e.clientY - drag.current.y;
        const rect = cardRef.current.getBoundingClientRect();
        cardRef.current.style.left = rect.left + dx + "px";
        cardRef.current.style.top = rect.top + dy + "px";
        drag.current.x = e.clientX;
        drag.current.y = e.clientY;
    }

    function onMouseUp() {
        drag.current.active = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }

    // -------- update helpers --------
    function update(key, value) {
        setItems((prev) => ({
            ...prev,
            [active]: { ...prev[active], [key]: value, visible: true },
        }));
    }

    return (
        <div className="tuner-root">
            {/* PANEL */}
            <div className="panel-canvas">
                {Object.entries(items).map(([name, data]) =>
                    data.visible ? (
                        <img
                            key={name}
                            src={`/ruru/${name}`}
                            className={`tuner-image ${active === name ? "active" : ""}`}
                            style={{
                                transform: `
                                  translate(-50%, -50%)
                                  translate(${data.x}px, ${data.y}px)
                                  scale(${data.scale})
                                `,
                            }}
                            onClick={() => setActive(name)}
                            alt=""
                        />
                    ) : null
                )}
            </div>

            {/* FLOATING CARD */}
            <div
                ref={cardRef}
                className="tuner-card"
                style={{ top: 20, left: 20 }}
            >
                <div className="tuner-header" onMouseDown={onMouseDown}>
                    🎛 Scene Controls
                </div>

                <div className="tuner-controls">
                    <select value={active} onChange={(e) => setActive(e.target.value)}>
                        {images.map((img) => (
                            <option key={img} value={img}>
                                {img}
                            </option>
                        ))}
                    </select>

                    <label>
                        scale ({current.scale.toFixed(2)})
                        <input
                            type="range"
                            min="0.1"
                            max="1.5"
                            step="0.01"
                            value={current.scale}
                            onChange={(e) => update("scale", +e.target.value)}
                        />
                    </label>

                    <label>
                        x ({current.x}px)
                        <input
                            type="range"
                            min="-800"
                            max="800"
                            value={current.x}
                            onChange={(e) => update("x", +e.target.value)}
                        />
                    </label>

                    <label>
                        y ({current.y}px)
                        <input
                            type="range"
                            min="-450"
                            max="450"
                            value={current.y}
                            onChange={(e) => update("y", +e.target.value)}
                        />
                    </label>

                    <pre className="code">
                    {`{ id: "${active}", x: ${current.x}, y: ${current.y}, scale: ${current.scale.toFixed(2)} }, }`}
                    </pre>
                </div>
            </div>
        </div>
    );
}
