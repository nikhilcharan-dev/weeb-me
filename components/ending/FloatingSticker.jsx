import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useTexture } from "@react-three/drei";

export default function FloatingSticker({ src }) {
    const meshRef = useRef();
    const texture = useTexture(src);

    const data = useMemo(() => {
        // ----- DEPTH -----
        const z = -1 - Math.random() * 6; // behind foreground

        // ----- ZONES -----
        // 0–3 : corners (HIGH priority)
        // 4–7 : edges   (LOWER priority)
        const zone = Math.floor(Math.random() * 8);

        const edgeX = 6.5;
        const edgeY = 4.8;
        const jitter = 1.5;

        let x = 0;
        let y = 0;

        switch (zone) {
            // ---- CORNERS ----
            case 0: // TOP LEFT
                x = -edgeX + (Math.random() - 0.5) * jitter;
                y =  edgeY + (Math.random() - 0.5) * jitter;
                break;

            case 1: // TOP RIGHT
                x =  edgeX + (Math.random() - 0.5) * jitter;
                y =  edgeY + (Math.random() - 0.5) * jitter;
                break;

            case 2: // BOTTOM LEFT
                x = -edgeX + (Math.random() - 0.5) * jitter;
                y = -edgeY + (Math.random() - 0.5) * jitter;
                break;

            case 3: // BOTTOM RIGHT
                x =  edgeX + (Math.random() - 0.5) * jitter;
                y = -edgeY + (Math.random() - 0.5) * jitter;
                break;

            // ---- EDGES ----
            case 4: // LEFT
                x = -edgeX + (Math.random() - 0.5) * jitter;
                y = (Math.random() - 0.5) * edgeY * 1.6;
                break;

            case 5: // RIGHT
                x =  edgeX + (Math.random() - 0.5) * jitter;
                y = (Math.random() - 0.5) * edgeY * 1.6;
                break;

            case 6: // TOP
                x = (Math.random() - 0.5) * edgeX * 1.6;
                y =  edgeY + (Math.random() - 0.5) * jitter;
                break;

            case 7: // BOTTOM
                x = (Math.random() - 0.5) * edgeX * 1.6;
                y = -edgeY + (Math.random() - 0.5) * jitter;
                break;
        }

        // ----- SIZE NORMALIZATION -----
        const scale = 0.35 + Math.random() * 0.3;

        return {
            x,
            y,
            z,
            scale,

            driftX: (Math.random() - 0.5) * 0.18,
            driftY: (Math.random() - 0.5) * 0.18,
            driftZ: Math.random() * 0.25,
            phase: Math.random() * Math.PI * 2,
        };
    }, []);


    useFrame(({ clock }) => {
        if (!meshRef.current) return;

        const t = clock.getElapsedTime();

        // subtle inward drift
        meshRef.current.position.x =
            data.x + Math.sin(t * 0.07 + data.phase) * data.driftX;

        meshRef.current.position.y =
            data.y + Math.cos(t * 0.06 + data.phase) * data.driftY;

        // forward drift but never invade center UI
        meshRef.current.position.z = Math.min(
            -1.2,
            data.z + Math.sin(t * 0.05 + data.phase) * data.driftZ
        );
    });

    return (
        <Float
            speed={0.22 * 10}
            rotationIntensity={0.06 * 10}
            floatIntensity={0.3 * 10}
        >
            <mesh
                ref={meshRef}
                position={[data.x, data.y, data.z]}
                scale={data.scale}
            >
                <planeGeometry args={[2.2, 2.2]} />
                <meshBasicMaterial
                    map={texture}
                    transparent
                    opacity={0.8}
                    depthWrite={false}
                    toneMapped={false}   // ⬅ add this
                    premultipliedAlpha   // ⬅ add this
                />
            </mesh>
        </Float>
    );
}
