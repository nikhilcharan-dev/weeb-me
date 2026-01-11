'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import FloatingSticker from './FloatingSticker';
import './ending.css';

const stickers = [
    // vintage
    "/ruru/a_tree.png","/ruru/angels_on_clouds.png","/ruru/bouque_2.png","/ruru/bouque.png","/ruru/bunnies_swinging.png",
    "/ruru/catz_1.png","/ruru/catz_2.png","/ruru/catz_3.png","/ruru/catz_4.png",
    "/ruru/clouds_1.png","/ruru/clouds_2.png","/ruru/clouds_3.jpg","/ruru/clouds_decor.png",
    "/ruru/crown.png","/ruru/cupid_god.png",
    "/ruru/deer_resting.png","/ruru/deer_resting_mini.png","/ruru/decor.png",
    "/ruru/dream_hands.png","/ruru/dream_hands_1.png","/ruru/dreamy_us.png","/ruru/empty_yet_full.png",
    "/ruru/feather_decor.png","/ruru/feather_hand.png",
    "/ruru/flower_blue.png","/ruru/flower_decor.png","/ruru/flower_decor_1.png","/ruru/flower_decor_2.png","/ruru/flower_decor_3.png","/ruru/flower_guy.png",
    "/ruru/foxy_me.png",
    "/ruru/galaxy_1.png","/ruru/galaxy_2.jpg",
    "/ruru/looking_down.png","/ruru/love_bird.png","/ruru/love_letter.png","/ruru/mushrooms.png",
    "/ruru/nova_falling.png","/ruru/our_faith.png","/ruru/peacock.png",
    "/ruru/rabbit_sorcerer.jpg","/ruru/rabbit_violinist.png",
    "/ruru/reaching_heavens.png","/ruru/rose.png","/ruru/roses_side.png",
    "/ruru/ruru_dancing.png","/ruru/ruru_eyes.png","/ruru/ruru_no_mercy.png","/ruru/ruru_reading.png","/ruru/ruru_smiling.png",
    "/ruru/spider_me.png","/ruru/stars_decor.png","/ruru/sun_moon.png","/ruru/teddy.png","/ruru/us_as_catzz.png",
    "/ruru/vase_1.png","/ruru/waterfall.png","/ruru/who_might_it_be.png","/ruru/wings.png","/ruru/wine_1.png","/ruru/wine_2.png",

    // anime
    "/anime/img_1.jpg","/anime/img_2.jpg","/anime/img_3.jpg","/anime/img_4.jpg","/anime/img_5.jpg","/anime/img_6.jpg","/anime/img_7.jpg","/anime/img_8.jpg",
    "/anime/img_9.jpg","/anime/img_10.jpg","/anime/img_11.jpg","/anime/img_12.jpg","/anime/img_13.jpg","/anime/img_14.jpg","/anime/img_15.jpg","/anime/img_16.jpg",
    "/anime/img_17.jpg","/anime/img_18.jpg","/anime/img_19.jpg","/anime/img_20.jpg","/anime/img_21.jpg","/anime/img_22.jpg","/anime/img_23.jpg","/anime/img_24.jpg",
    "/anime/img_25.jpg","/anime/img_26.jpg","/anime/img_27.jpg","/anime/img_28.jpg","/anime/img_29.jpg","/anime/img_30.jpg","/anime/img_31.jpg","/anime/img_32.jpg",
    "/anime/img_33.jpg","/anime/img_34.jpg","/anime/img_35.jpg","/anime/img_36.jpg","/anime/img_37.jpg","/anime/img_38.jpg","/anime/img_39.jpg","/anime/img_40.jpg",
    "/anime/img_41.jpg","/anime/img_42.jpg","/anime/img_43.jpg","/anime/img_44.jpg","/anime/img_45.jpg","/anime/img_46.jpg","/anime/img_47.jpg","/anime/img_48.jpg",
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
                    <FloatingSticker key={i} src={src} index={i} />
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
