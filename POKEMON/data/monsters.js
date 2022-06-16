//monsters object
const monsters = {
    Emby: {
        position: {
            x: 380,
            y: 400,
        },
        image: {
            src: "./Images/embySprite.png",
        },
        frames: {
            max: 4,
            hold: 30,
        },
        animate: true,
        name: "Charmeleon",
        attacks: [attacks.Tackle, attacks.Fireball, attacks.Scratch],
    },
    Draggle: {
        position: {
            x: 1090,
            y: 110,
        },
        image: {
            src: "./Images/draggleSprite.png",
        },
        frames: {
            max: 4,
            hold: 30,
        },
        animate: true,
        isEnemy: true,
        name: "Caterpie",
        attacks: [attacks.Tackle, attacks.Fireball, attacks.Scratch],
    },

};
