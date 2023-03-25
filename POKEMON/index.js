//getting canvas in js
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// canvas properties
canvas.width = innerWidth;
canvas.height = innerHeight;

//const offset
const offset = {
    x: -700,
    y: -500,
};
//collision map const
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, 70 + i));
}

//battleZones map const
const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
    battleZonesMap.push(battleZonesData.slice(i, 70 + i));
}


//class boundary
class Boundary {
    static width = 48;
    static height = 48;
    constructor({ position }) {
        this.position = position;
        this.width = 48;
        this.height = 48;
    }

    draw() {
        c.fillStyle = "rgba(255,0, 0,0)";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

//boundaries array
const boundaries = [];

//populating boundaries array
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y,
                    },
                })
            );
    });
});

//battleZones
const battleZones = [];

battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
            battleZones.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y,
                    },
                })
            );
    });
});

//bg image
const image = new Image();
image.src = "./Images/Pellet Town.png";

//player images
const playerUpImage = new Image();
playerUpImage.src = "./Images/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./Images/playerLeft.png";

const playerDownImage = new Image();
playerDownImage.src = "./Images/playerDown.png";

const playerRightImage = new Image();
playerRightImage.src = "./Images/playerRight.png";

//foreground image
const foregroundImage = new Image();
foregroundImage.src = "./Images/forgroundObjects.png";

//gary image
const garyImage = new Image();
garyImage.src = "./Images/lance.png";

//Cynthia image
const CynthiaImage = new Image();
CynthiaImage.src = "./Images/Cynthia.webp";

//class sprite
class Sprite {
    constructor({
        position,
        image,
        frames = { max: 1, hold: 10 },
        sprites,
        animate = false,
        rotation = 0,
    }) {
        this.position = position;
        this.image = new Image();
        this.frames = { ...frames, val: 0, elapsed: 0 };
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        };
        this.image.src = image.src;

        this.animate = animate;
        this.sprites = sprites;
        this.opacity = 1;
        this.rotation = rotation;
    }
    // drawing map
    draw() {
        c.save();
        c.translate(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        );
        c.rotate(this.rotation);
        c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);
        c.globalAlpha = this.opacity;
        c.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        );
        c.restore();

        if (this.animate) {
            //frames elapsed
            if (this.frames.max > 1) {
                this.frames.elapsed++;
            }

            if (this.frames.elapsed % this.frames.hold === 0) {
                //frames val
                if (this.frames.val < this.frames.max - 1) {
                    this.frames.val++;
                } else this.frames.val = 0;
            }
        }
    }
}

//random No. generator
function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//monster class
class Monster extends Sprite {
    constructor({
        position,
        image,
        frames = { max: 1, hold: 10 },
        sprites,
        animate = false,
        rotation = 0,
        name,
        isEnemy = false,
        attacks,
    }) {
        super({
            position,
            image,
            frames,
            sprites,
            animate,
            rotation,
        });
        this.name = name;
        this.health = 100;
        this.isEnemy = isEnemy;
        this.attacks = attacks;
    }
    //faint method
    faint() {
        document.querySelector("#dialogueBox").innerHTML = this.name + " fainted! ";
        gsap.to(this.position, {
            y: this.position.y + 20,
        });
        gsap.to(this, {
            opacity: 0,
        });
        audio.victory.play();
        audio.battle.stop();
    }

    //attack method
    attack({ attack, recipient, renderedSprites }) {
        document.querySelector("#dialogueBox").style.display = "block";
        document.querySelector("#dialogueBox").innerHTML =
            this.name + " used " + attack.name;

        let healthBar = "#enemyHealthBar";
        if (this.isEnemy) healthBar = "#playerHealthBar";
        //deducting health on attack
        if (attack.name === 'Fireball' && this.isEnemy === false) {
            recipient.health -= attack.damage * 1.9;
            document.querySelector("#dialogueBox").innerHTML =
                this.name + " used " + attack.name + '<br />' + '<br/>' + '<span class="red">' + "A Critical Hit" + "<span/>"
        } else if (attack.name === 'Scratch' && this.isEnemy) {
            if (enemyLevelTracker === 15 && this.isEnemy) {
                recipient.health -= attack.damage * 6;
            } else {
                recipient.health -= attack.damage * 2.5;
            }
            document.querySelector("#dialogueBox").innerHTML =
                this.name + " used " + attack.name + '<br />' + '<br/>' + '<span class="red">' + "A Critical Hit" + "<span/>"
        }
        else if (enemylevelNo < playerlevelNo && this.isEnemy === false) {
            recipient.health -= attack.damage * 1.25;
        }
        else if (enemylevelNo > playerlevelNo && this.isEnemy) {
            recipient.health -= attack.damage * 1.25;
        }
        else if (enemyLevelTracker === 15 && this.isEnemy) {
            recipient.health -= attack.damage * 4
        } else {
            recipient.health -= attack.damage
        }

        if (this.isEnemy === true) {
            if (recipient.health >= 0) {
                document.querySelector("#healthText").innerHTML = Math.floor(recipient.health) + '/100'
            }
            else {
                document.querySelector("#healthText").innerHTML = '0/100'
            }
        }

        let rotation = 1;
        if (this.isEnemy) rotation = -2.25;
        const tl = gsap.timeline();

        let movementDistance = 20;

        //attacks logic
        switch (attack.name) {
            case "Fireball":
                audio.initFireball.play();
                const fireballImage = new Image();
                fireballImage.src = "./Images/fireball.png";
                const fireball = new Sprite({
                    position: { x: this.position.x, y: this.position.y },
                    image: fireballImage,
                    frames: {
                        max: 4,
                        hold: 10,
                    },
                    animate: true,
                    rotation,
                });

                if (randomNumberBetween(1, 10) < 2) {
                    document.querySelector("#burned").style.display = "block";
                    if (this.isEnemy === false) {
                        recipient.health -= 5
                        queue.push(() => {
                            document.querySelector("#dialogueBox").innerHTML = "Caterpie Got Burned!";
                        })
                    }
                }

                renderedSprites.splice(1, 0, fireball);

                gsap.to(fireball.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () => {
                        audio.fireballHit.play();
                        renderedSprites.splice(1, 1);
                        gsap.to(healthBar, {
                            width: recipient.health + "%",
                        });

                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08,
                        });
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08,
                        });
                    },
                });

                break;


            case "Tackle":
                if (this.isEnemy) movementDistance = -20;

                tl.to(this.position, {
                    x: this.position.x - movementDistance,
                })
                    .to(this.position, {
                        x: this.position.x + movementDistance * 2,
                        duration: 0.1,
                        onComplete: () => {
                            audio.tackleHit.play();
                            gsap.to(healthBar, {
                                width: recipient.health + "%",
                            });

                            gsap.to(recipient.position, {
                                x: recipient.position.x + 10,
                                yoyo: true,
                                repeat: 5,
                                duration: 0.08,
                            });
                            gsap.to(recipient, {
                                opacity: 0,
                                repeat: 5,
                                yoyo: true,
                                duration: 0.08,
                            });
                        },
                    })
                    .to(this.position, {
                        x: this.position.x,
                    });
                break;
            case 'Scratch':
                if (this.isEnemy) movementDistance = -20;

                tl.to(this.position, {
                    y: this.position.y - movementDistance,
                })
                    .to(this.position, {
                        y: this.position.y + movementDistance / 2,
                        duration: 0.1,
                        onComplete: () => {
                            audio.Scratch.play();
                            gsap.to(healthBar, {
                                width: recipient.health + "%",
                            });

                            gsap.to(recipient.position, {
                                y: recipient.position.y + 10,
                                yoyo: true,
                                repeat: 5,
                                duration: 0.08,
                            });
                            gsap.to(recipient, {
                                opacity: 0,
                                repeat: 5,
                                yoyo: true,
                                duration: 0.08,
                            });
                        },
                    })
                    .to(this.position, {
                        y: this.position.y,
                    });
        }
    }

}


//const for classes
const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: image,
});

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: foregroundImage,
});

const player = new Sprite({
    position: {
        x: canvas.width / 2.5 - 192 / 4 / 2,
        y: canvas.height / 1.66 - 68 / 2,
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10,
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        down: playerDownImage,
        right: playerRightImage,
    },
});

const gary = new Sprite({
    position: {
        x: canvas.width * 1 - 222,
        y: canvas.height / 2.75 - 98,
    },
    image: garyImage,
});

//cynthia
const cynthia = new Sprite({
    position: {
        x: canvas.width * 1 - 222,
        y: canvas.height / .78 - 98,
    },
    image: CynthiaImage,
});

//const and let
const keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
};
let lastKey = "";

const movables = [background, ...boundaries, foreground, ...battleZones, gary, cynthia];

const battle = {
    initiated: false,
};

//function for collision
function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height
    );
}

//animation loop
function animate() {
    const animationId = window.requestAnimationFrame(animate);

    //drawing bg
    background.draw();

    //boundary drawing
    boundaries.forEach((boundary) => {
        boundary.draw();
    });

    //battleZones drawing
    battleZones.forEach((battleZone) => {
        battleZone.draw();
    });

    //drawing gary a interactive character
    gary.draw()

    //label text for gary
    c.fillStyle = "white";
    c.font = "22px Cursive";
    c.fillText(
        "Lance",
        gary.position.x + 8,
        gary.position.y - 5,
        300,
        100,
        600
    );

    //drawing cynthiaImage
    cynthia.draw();

    //label text for cynthia
    c.fillStyle = "white";
    c.font = "22px Cursive";
    c.fillText(
        "Cynthia",
        cynthia.position.x - 8,
        cynthia.position.y - 5,
        300,
        100,
        600
    );

    //drawing player
    player.draw();

    //label text
    c.fillStyle = "white";
    c.font = "22px Cursive";
    c.fillText(
        "Ash",
        player.position.x + 4,
        player.position.y - 12,
        300,
        100,
        600
    );

    //drawing foreground
    foreground.draw();

    //player moving var
    let moving = true;

    player.animate = false;
    //initiation for battle
    if (battle.initiated) return;

    //battlezones collision
    if (keys.a.pressed || keys.w.pressed || keys.d.pressed || keys.s.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i];
            //Complex geometry
            const overlappingArea =
                (Math.min(
                    player.position.x + player.width,
                    battleZone.position.x + battleZone.width
                ) -
                    Math.max(player.position.x, battleZone.position.x)) *
                (Math.min(
                    player.position.y + player.height,
                    battleZone.position.y + battleZone.height
                ) -
                    Math.max(player.position.y, battleZone.position.y));

            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: battleZone,
                }) &&
                overlappingArea > (player.width * player.height) / 2 &&
                Math.random() < 0.01
            ) {
                //end for this animation loop
                window.cancelAnimationFrame(animationId);
                audio.Map.stop();
                audio.initBattle.play();
                audio.battle.play();
                battle.initiated = true;
                //animation for battle activation
                gsap.to("#overlappingDiv", {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        gsap.to("#overlappingDiv", {
                            opacity: 1,
                            duration: 0.4,
                            onComplete() {
                                //new animation loop for battle activation
                                initBattle();
                                animateBattle();
                                gsap.to("#overlappingDiv", {
                                    opacity: 0,
                                    duration: 0.4,
                                });
                            },
                        });
                    },
                });
                break;
            }

        }

    }

    //starting gym battle

    if (keys.a.pressed || keys.w.pressed || keys.d.pressed || keys.s.pressed) {
        const overlappingGaryArea =
            (Math.min(
                player.position.x + player.width,
                gary.position.x + gary.width
            ) -
                Math.max(player.position.x, gary.position.x)) *
            (Math.min(
                player.position.y + player.height,
                gary.position.y + gary.height
            ) -
                Math.max(player.position.y, gary.position.y));
        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: gary,
            }) &&
            overlappingGaryArea > (player.width * player.height) / 2 &&
            Math.random() < 0.01) {
            //end for this animation loop
            window.cancelAnimationFrame(animationId);
            audio.Map.stop();
            audio.initBattle.play();
            audio.battle.play();
            battle.initiated = true;
            //animation for battle activation
            gsap.to("#overlappingDiv", {
                opacity: 1,
                repeat: 3,
                yoyo: true,
                duration: 0.4,
                onComplete() {
                    gsap.to("#overlappingDiv", {
                        opacity: 1,
                        duration: 0.4,
                        onComplete() {
                            //new animation loop for battle activation
                            initBattle();
                            animateGymBattle();
                            //dialogue for gary
                            document.querySelector("#dialogueBox").innerHTML = "Hey I am Lance, The Leader Of This City!";
                            queue.push(() => {
                                document.querySelector("#dialogueBox").innerHTML = "Ash I have Heard About your Pokemon Skills I am giving you a chance to showcase" + "<br />" + " <br />" + "Them! I Challenge you to a Battle! Watch Out Kid!";
                            })
                            gsap.to("#overlappingDiv", {
                                opacity: 0,
                                duration: 0.4,
                            });
                        },
                    });
                },
            });


        }
    }

    //interactions with Cynthia

    if (keys.a.pressed || keys.w.pressed || keys.d.pressed || keys.s.pressed) {
        const overlappingCynthiaArea =
            (Math.min(
                player.position.x + player.width,
                cynthia.position.x + cynthia.width
            ) -
                Math.max(player.position.x, cynthia.position.x)) *
            (Math.min(
                player.position.y + player.height,
                cynthia.position.y + cynthia.height
            ) -
                Math.max(player.position.y, cynthia.position.y));
        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: cynthia,
            }) &&
            overlappingCynthiaArea > (player.width * player.height) / 2 &&
            Math.random() < 0.01) {
            //end for this animation loop
            window.cancelAnimationFrame(animationId);
            audio.Map.stop();
            audio.initBattle.play();
            audio.battle.play();
            battle.initiated = true;
            //animation for battle activation
            gsap.to("#overlappingDiv", {
                opacity: 1,
                repeat: 3,
                yoyo: true,
                duration: 0.4,
                onComplete() {
                    gsap.to("#overlappingDiv", {
                        opacity: 1,
                        duration: 0.4,
                        onComplete() {
                            //new animation loop for battle activation
                            initBattle();
                            animateCynthiaBattle();
                            //dialogue for gary
                            document.querySelector("#dialogueBox").innerHTML = "Hey Ash! I am Cynthia! I Want To Help You!";
                            queue.push(() => {
                                document.querySelector("#dialogueBox").innerHTML = " I Would Like To Tell You About Lance The Leader! He is A Legendary Trainer" + '<br />' + '<br/>' + "But To Go Easy On His Opponents He Uses A Caterpie!";
                            })
                            queue.push(() => {
                                document.querySelector("#dialogueBox").innerHTML = "But Beat Me First Before Going!";
                            })
                            gsap.to("#overlappingDiv", {
                                opacity: 0,
                                duration: 0.4,
                            });
                        },
                    });
                },
            });

        }
    }

    //listen for key press
    if (keys.w.pressed && lastKey === "w") {
        player.animate = true;
        player.image = player.sprites.up;
        //detect collison
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3,
                        },
                    },
                })
            ) {
                moving = false;
                break;
            }
        }

        if (moving) {
            movables.forEach((movable) => {
                movable.position.y += 3;
            });
        }
    } else if (keys.a.pressed && lastKey === "a") {
        player.animate = true;
        player.image = player.sprites.left;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y,
                        },
                    },
                })
            ) {
                moving = false;
                break;
            }
        }
        if (moving)
            movables.forEach((movable) => {
                movable.position.x += 3;
            });
    } else if (keys.s.pressed && lastKey === "s") {
        player.image = player.sprites.down;
        player.animate = true;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3,
                        },
                    },
                })
            ) {
                moving = false;
                break;
            }
        }
        if (moving)
            movables.forEach((movable) => {
                movable.position.y -= 3;
            });
    } else if (keys.d.pressed && lastKey === "d") {
        player.animate = true;
        player.image = player.sprites.right;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y,
                        },
                    },
                })
            ) {
                moving = false;
                break;
            }
        }
        if (moving)
            movables.forEach((movable) => {
                movable.position.x -= 3;
            });
    }
}

//keydown event handler
addEventListener("keydown", (e) => {
    switch (e.key) {
        case "w":
            keys.w.pressed = true;
            lastKey = "w";
            break;
        case "a":
            keys.a.pressed = true;
            lastKey = "a";
            break;
        case "s":
            keys.s.pressed = true;
            lastKey = "s";
            break;
        case "d":
            keys.d.pressed = true;
            lastKey = "d";
            break;
    }
});

//keyup
addEventListener("keyup", (e) => {
    switch (e.key) {
        case "w":
            keys.w.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;
        case "s":
            keys.s.pressed = false;
            break;
        case "d":
            keys.d.pressed = false;
            break;
    }
});

//audio
let clicked = false;

addEventListener("click", () => {
    if (!clicked) {
        audio.Map.play();
        clicked = true;
    }
});

addEventListener("keydown", () => {
    if (!clicked) {
        audio.Map.play();
        clicked = true;
    }
});

document.querySelector("#dialogueBoxCynthia").addEventListener("click", () => {
    document.querySelector("#dialogueBoxCynthia").style.display = 'none'
})
