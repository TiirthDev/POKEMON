//attacks object
const attacks = {
    Tackle: {
        name: "Tackle",
        damage: randomNumberBetween(3, 8),
        type: "Normal",
        color: "black",
        pp: 15,
        ppTotal: 15
    },
    Fireball: {
        name: "Fireball",
        damage: randomNumberBetween(5, 12),
        type: "Fire",
        color: "red",
        pp: 8,
        ppTotal: 8
    },
    Scratch: {
        name: "Scratch",
        damage: randomNumberBetween(4, 10),
        type: "Normal",
        color: "black",
        pp: 10,
        ppTotal: 10
    },

};

//random no. generator
function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}