const attacks = {
    Tackle: {
        name: "Tackle",
        damage: randomNumberBetween(3, 8),
        type: "Normal",
        color: "black",
    },
    Fireball: {
        name: "Fireball",
        damage: randomNumberBetween(5, 12),
        type: "Fire",
        color: "red",
    },
    Scratch: {
        name: "Scratch",
        damage: randomNumberBetween(4, 10),
        type: "Normal",
        color: "black",
    },

};

function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}