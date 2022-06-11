//images src for battle
const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./Images/battleBackground.png";

//battleground
const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    image: battleBackgroundImage,
});

//images src for battle
const gymBattleBackgroundImage = new Image();
gymBattleBackgroundImage.src = "./Images/gymbattleground.webp";

//battleground
const gymBattleBackground = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    image: gymBattleBackgroundImage,
});

//draggle
let draggle;

//emby
let emby;

//let variables
let renderedSprites;

let queue;
let battleAnimationId;

//level
const mylevelBar = document.querySelector('#playerlevelBar')
const enemylevelBar = document.querySelector('#enemylevelBar')
const mylevel = document.querySelector('#playerlevel')
const enemylevel = document.querySelector('#enemylevel')
var playerlevelNo = 1
var enemylevelNo = 1
var playerlevelBarWidth = 0
var enemylevelBarWidth = 0
var enemyLevelTracker = 0

//gym leader Image
let gymLeaderImage = new Image();
gymLeaderImage.src = "./Images/character.png";

//gym leader
gymLeader = new Sprite({
    position: {
        x: 1000,
        y: 60,
    },
    image: gymLeaderImage,
});

//potions
const potion = document.querySelector('#potion')
const potionNo = document.querySelector('#potionNo')
var potionCounter = 0

//random No. generator
function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//init function
function initBattle() {
    document.querySelector("#userInterface").style.display = "block";
    document.querySelector("#dialogueBox").style.display = "none";
    document.querySelector("#dialogueBoxExp").style.display = "none";
    document.querySelector("#enemyHealthBar").style.width = "100%";
    document.querySelector("#playerHealthBar").style.width = "100%";
    document.querySelector("#attacksBox").replaceChildren();
    mylevelBar.style.width = playerlevelBarWidth + '%';
    enemylevelBar.style.width = enemylevelBarWidth + '%';
    enemylevelNo = randomNumberBetween(1, 8)
    enemylevel.innerText = 'LV.' + enemylevelNo
    enemyLevelTracker = enemylevelNo

    //making fighters
    draggle = new Monster(monsters.Draggle);
    draggle.position.x = 1100;
    draggle.position.y = 130;
    emby = new Monster(monsters.Emby);
    draggle.position.x = 1100;
    draggle.position.y = 130;
    emby.position.x = 380;
    emby.position.y = 400;
    renderedSprites = [draggle, emby];
    queue = [];

    //initial dialogue
    document.querySelector("#dialogueBox").style.display = 'block'
    document.querySelector("#dialogueBox").innerHTML = "A Wild Caterpie Appeared!";


    emby.attacks.forEach((attack) => {
        //random attacks
        const button = document.createElement("button");
        button.innerHTML = attack.name;
        document.querySelector("#attacksBox").append(button);
    });

    document.querySelectorAll("button").forEach((button) => {

        //event listener for battle
        button.addEventListener("click", (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML];
            emby.attack({
                attack: selectedAttack,
                recipient: draggle,
                renderedSprites,
            });
            //death
            if (draggle.health <= 0) {
                queue.push(() => {
                    draggle.faint()
                    if (randomNumberBetween(1, 8) < 5) {
                        potionCounter = potionCounter + 1
                        potionNo.innerHTML = potionCounter
                    }
                    document.querySelector("#dialogueBoxExp").style.display = 'block'
                    if (playerlevelNo <= 3) {
                        playerlevelBarWidth += 50
                        document.querySelector("#dialogueBoxExp").innerHTML = "Caterpie Fainted!" + " <br /> " + " <br /> " + "Congratulations You Earned 50 Exp. Points!";
                    } else if (playerlevelNo <= 9) {
                        playerlevelBarWidth += 25
                        document.querySelector("#dialogueBoxExp").innerHTML = "Caterpie Fainted!" + " <br /> " + " <br /> " + "Congratulations You Earned 25 Exp. Points!";
                    } else if (playerlevelNo <= 15) {
                        playerlevelBarWidth += 10
                        document.querySelector("#dialogueBoxExp").innerHTML = "Caterpie Fainted!" + " <br /> " + " <br /> " + "Congratulations You Earned 10 Exp. Points!";
                    } else {
                        playerlevelBarWidth += 5
                        document.querySelector("#dialogueBoxExp").innerHTML = "Caterpie Fainted!" + " <br /> " + " <br /> " + "Congratulations You Earned 5 Exp. Points!";
                    }


                    mylevelBar.style.width = playerlevelBarWidth + '%';
                    if (playerlevelBarWidth >= 100) {
                        playerlevelBarWidth = 0;
                        mylevelBar.style.width = playerlevelBarWidth + '%'
                        playerlevelNo = playerlevelNo + 1;
                        mylevel.innerText = 'LV.' + playerlevelNo
                        document.querySelector("#dialogueBoxExp").innerHTML = "Caterpie Fainted!" + " <br /> " + " <br /> " + "Congratulations You Leveled Up!";
                    }
                });
                queue.push(() => {
                    gsap.to("#overlappingDiv", {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId);
                            animate();
                            document.querySelector("#userInterface").style.display = "none";
                            gsap.to("#overlappingDiv", {
                                opacity: 0,
                            });
                            battle.initiated = false;
                            audio.Map.play();
                        },
                    });
                });
            }
            //random attacks for draggle
            const randomAttack =
                draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];

            queue.push(() => {
                draggle.attack({
                    attack: randomAttack,
                    recipient: emby,
                    renderedSprites,
                });
                //death
                if (emby.health <= 0) {
                    queue.push(() => {
                        emby.faint();
                        if (enemylevelNo <= 3) {
                            enemylevelBarWidth += 50
                        } else if (enemylevelNo <= 9) {
                            enemylevelBarWidth += 25
                        } else if (enemylevelNo <= 15) {
                            enemylevelBarWidth += 10
                        } else {
                            enemylevelBarWidth += 5
                        }
                        enemylevelBar.style.width = enemylevelBarWidth + '%'
                        if (enemylevelBarWidth >= 100) {
                            enemylevelBarWidth = 0;
                            enemylevelBar.style.width = enemylevelBarWidth + '%'
                            enemylevelNo = enemylevelNo + 1;
                            enemylevel.innerText = 'LV.' + enemylevelNo
                        }
                    });
                    queue.push(() => {
                        gsap.to("#overlappingDiv", {
                            opacity: 1,
                            onComplete: () => {
                                cancelAnimationFrame(battleAnimationId);
                                animate();
                                document.querySelector("#userInterface").style.display = "none";
                                gsap.to("#overlappingDiv", {
                                    opacity: 0,
                                });

                                battle.initiated = false;
                                audio.Map.play();
                            },
                        });
                    });
                }
            });
        });
        //showing move type
        button.addEventListener("mouseenter", (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML];
            document.querySelector("#attackType").innerHTML = selectedAttack.type;
            document.querySelector("#attackType").style.color = selectedAttack.color;
        });
    });
}

//animate battle function
function animateBattle() {
    battleAnimationId = requestAnimationFrame(animateBattle);
    battleBackground.draw();
    renderedSprites.forEach((sprite) => {
        sprite.draw();
    });
}

animate();

//animate gym battle function
function animateGymBattle() {
    battleAnimationId = requestAnimationFrame(animateGymBattle);
    gymBattleBackground.draw();
    gymLeader.draw()
    //label text for gary
    c.fillStyle = "white";
    c.font = "22px Cursive";
    c.fillText(
        "Lance",
        gymLeader.position.x,
        gymLeader.position.y - 5,
        300,
        100,
        600
    );
    draggle.position.x = 850
    draggle.position.y = 130
    emby.position.x = 380;
    emby.position.y = 380;
    enemylevelNo = 15
    enemylevel.innerText = 'LV.' + enemylevelNo
    enemyLevelTracker = 15
    renderedSprites.forEach((sprite) => {
        sprite.draw();
    });
}

//dialogue queuing
document.querySelector("#dialogueBox").addEventListener("click", (e) => {
    if (queue.length > 0) {
        queue[0]();
        queue.shift();
    } else e.currentTarget.style.display = "none";
});


document.querySelector("#dialogueBoxExp").addEventListener("click", (e) => {
    if (queue.length > 0) {
        queue[0]();
        queue.shift();
    } else e.currentTarget.style.display = "none";
});

potion.addEventListener("click", () => {
    if (potionCounter > 0 && emby.health <= 80) {
        potionCounter = potionCounter - 1
        potionNo.innerHTML = potionCounter
        queue.push(() => {
            document.querySelector("#dialogueBox").innerHTML = 'You Used A Potion And Restored 20 HP'
        })
        emby.health += 20
    }
})