
const Left = { x: -window.innerWidth / 2 - 300, y: 117, scale: 0, opacity: 0, zIndex: 100 }

const Right = { x: window.innerWidth / 2 + 300, y: 117, scale: 0, opacity: 0, zIndex: 100}

const Top = { x: -106, y: -window.innerHeight / 2 - 300, scale: 0, opacity: 0, zIndex: 100 }

const Down = { x: -106, y: window.innerHeight / 2 + 300, scale: 0, opacity: 0, zIndex: 100}

const Center = { x: -106, y: 117, scale: 0, opacity: 0, zIndex: 100}

const sceneOne = [
    {
        id: "dreamy_us.png",
        path: "/ruru/dreamy_us.png",
        from: Center,
        to: { x: -106, y: 117, scale: 0.24, opacity: 1 },
        hold: 2,
        exit: { x: -106, y: 117, scale: 0.24, opacity: 0 },
    },
    {
        id: "cupid_god.png",
        path: "/ruru/cupid_god.png",
        from: Right,
        to: { x: -631, y: 220, scale: 0.17, opacity: 1 },
        hold: 2,
        exit: { x: -631, y: 220, scale: 0.17, opacity: 0, },
    },
    {
        id: "sun_moon.png",
        path: "/ruru/sun_moon.png",
        from: Top,
        to: { x: 117, y: -172, scale: 0.12, opacity: 1 },
        hold: 2,
        exit: {  x: 117, y: -172, scale: 0.12,  opacity: 0, },
    },
    {
        id: "clouds_3.jpg",
        path: "/ruru/clouds_3.jpg",
        from: { x: -106, y: 117, scale: 2, opacity: 0, zIndex: 100},
        to: { x: 0, y: 0, scale: 1.50, opacity: 1, zIndex: 2 },
        hold: 2,
        exit: { x: 0, y: 0, scale: 1.50, opacity: 0, zIndex: 2 },
    },
    {
        id: "love_bird.png",
        path: "/ruru/love_bird.png",
        from: Left,
        to: { x: -564, y: -281, scale: 0.10, opacity: 1 },
        hold: 2,
        exit: { x: -564, y: -281, scale: 0.10, opacity: 0, },
    }
]


export const scenes = [
    // ===== SCENE 1 =====
    sceneOne,

    // ===== SCENE 2 =====
    [
        {
            id: "img3",
            path: "/ruru/catz_2.png",
            from: { x: -500, y: 400, opacity: 0, scale: 0 },
            to: { x: 400, y: 400, opacity: 1, scale: 1 },
            hold: 2,
            exit: { x: 400, y: 900, opacity: 0, scale: 0 },
        },
    ],
];

/*
{
    id: "",
    path: "/ruru/",
    from: { x: 0, y: 0, scale: 0, opacity: 0, },
    to: { x: -106, y: 117, scale: 0.24, opacity: 1 },
    hold: 2,
    exit: { x: 200, y: -300, scale: 0, opacity: 0, },
}*/