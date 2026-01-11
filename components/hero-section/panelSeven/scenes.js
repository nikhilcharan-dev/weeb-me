const Left = { x: -window.innerWidth / 2 - 300, y: 117, scale: 0, opacity: 0, zIndex: 100 }
const Right = { x: window.innerWidth / 2 + 300, y: 117, scale: 0, opacity: 0, zIndex: 100}
const Top = { x: -106, y: -window.innerHeight / 2 - 300, scale: 0, opacity: 0, zIndex: 100 }
const Down = { x: -106, y: window.innerHeight / 2 + 300, scale: 0, opacity: 0, zIndex: 100}
const Center = { x: -106, y: 117, scale: 0, opacity: 0, zIndex: 100}

const sceneOne = {
    title: {
        text: "A Perfect Past",
        from: { y: 40, opacity: 0 },
        to: { y: 0, opacity: 1 },
        exit: { y: -40, opacity: 0 },
        hold: 1.2,
    },
    items: [
        {
            type: "image",
            id: "looking_down.pn",
            path: "/ruru/looking_down.png",
            from: Top,
            to: { x: 580, y: -210, scale: 0.14, opacity: 1 },
            hold: 2,
            exit: { x: 580, y: -198, scale: 0.12, opacity: 0 },
        },
        {
            type: "image",
            id: "reaching_heavens.png",
            path: "/ruru/reaching_heavens.png",
            from: Down,
            to: { x: -129, y: 146, scale: 0.15, opacity: 1 },
            hold: 2,
            exit: { x: -100, y: 146, scale: 0.17, opacity: 0, },
        },
        {
            type: "image",
            id: "sun.png",
            path: "/ruru/sun.png",
            from: Top,
            to: { x: 117, y: -172, scale: 0.2, opacity: 1 },
            hold: 2,
            exit: {  x: 117, y: -172, scale: 0.12,  opacity: 0, },
        },
        {
            type: "image",
            id: "clouds_1.jpg",
            path: "/ruru/clouds_1.png",
            from: { x: -106, y: 117, scale: 2, opacity: 0},
            to: { x: 0, y: 0, scale: 1.50, opacity: 0.3, zIndex: 2 },
            hold: 2,
            exit: { x: 0, y: 0, scale: 1.50, opacity: 0, zIndex: 2 },
        },
        {
            type: "image",
            id: "wine_1.png",
            path: "/ruru/wine_1.png",
            from: Left,
            to: { x: -463, y: -219, scale: 0.17, opacity: 1 },
            hold: 2,
            exit: { x: -463, y: -219, scale: 0.19, opacity: 0, },
        },
        {
            type: "text",
            id: "scene1-line",
            text: "Forever felt closer than it truly was.",
            from: { x: 71, y: -85, opacity: 0 },
            to: { x: 0, y: 0, opacity: 1 },
            hold: 2,
            exit: { y: -80, opacity: 0 },
        },
    ]
}

const sceneThree = {
    title: {
        text: "A tragedy and a never future",
        from: { y: 40, opacity: 0 },
        to: { y: 0, opacity: 1 },
        exit: { y: -40, opacity: 0 },
        hold: 1.2,
    },
    items: [
        {
            type: "image",
            id: "dreamy_us.png",
            path: "/ruru/dreamy_us.png",
            from: Center,
            to: { x: -106, y: 117, scale: 0.24, opacity: 1 },
            hold: 2,
            exit: { x: -106, y: 117, scale: 0.24, opacity: 0 },
        },
        {
            type: "image",
            id: "cupid_god.png",
            path: "/ruru/cupid_god.png",
            from: Left,
            to: { x: -631, y: 220, scale: 0.17, opacity: 1 },
            hold: 2,
            exit: { x: -631, y: 220, scale: 0.17, opacity: 0, },
        },
        {
            type: "image",
            id: "sun_moon.png",
            path: "/ruru/sun_moon.png",
            from: Top,
            to: { x: 117, y: -172, scale: 0.12, opacity: 1 },
            hold: 2,
            exit: {  x: 117, y: -172, scale: 0.12,  opacity: 0, },
        },
        {
            type: "image",
            id: "clouds_3.jpg",
            path: "/ruru/clouds_3.jpg",
            from: { x: -106, y: 117, scale: 2, opacity: 0, zIndex: 100},
            to: { x: 0, y: 0, scale: 1.5, opacity: 1, zIndex: 2 },
            hold: 2,
            exit: { x: 0, y: 0, scale: 1.50, opacity: 0, zIndex: 2 },
        },
        {
            type: "image",
            id: "love_bird.png",
            path: "/ruru/love_bird.png",
            from: Left,
            to: { x: -564, y: -281, scale: 0.10, opacity: 1 },
            hold: 2,
            exit: { x: -564, y: -281, scale: 0.10, opacity: 0, },
        },
        {
            type: "text",
            id: "scene2-line",
            text: "Thought forever had no end.",
            from: { x: 71, y: -85, opacity: 0 },
            to: { x: 71, y: -85, opacity: 1 },
            hold: 2,
            exit: { y: -80, opacity: 0 },
        },
    ]
}


export const scenes = [
    // ===== SCENE 1 =====
    sceneOne,

    // ===== SCENE 2 =====
    sceneThree
];
