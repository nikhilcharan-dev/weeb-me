'use client';

import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import FloatingSticker from './FloatingSticker';
import './ending.css';

const stickers = [
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



export default function EndScene() {
    return (
        <div className="ending-wrapper">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                dpr={[1, 1.5]}
            >
                <color attach="background" args={['#F5F1EC']} />

                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 5, 5]} intensity={0.6} />

                {stickers.map((src, i) => (
                    <FloatingSticker key={i} src={`/ruru/${src}`} index={i} />
                ))}

                {/* VERY limited control */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    rotateSpeed={0.15}
                />
            </Canvas>
        </div>
    );
}
