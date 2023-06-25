var screen;
var ctx;
var screenWidth = 600;
var screenHeight = 300;

var menu = "title";

var clicked = false;

var mouseX = 0;
var mouseY = 0;

var playerX = 30;
var playerY = 130;
var speed = 20;
var instructionsPlaying = false;
var running = false;
var waitingPeriod = 6;


var runFrame = 1;

var lap = 0;
var level = 1;
var lives = 2;
var gameOver = false;



const background = new Image();
background.src = "assets/bg.png";

const player = new Image();
player.src = "assets/E/idle.png";

const instructions = new Audio("assets/audio/instructions.mp3");
instructions.onplay = function () {
    instructionsPlaying = true;


};
instructions.onended = function () {
    instructionsPlaying = false;
    running = true;
    music.play();
    setInterval(function () {
        player.src = "assets/" + direction + "/idle.png";
    }, 1000);
    setTimeout(gameplayLoop, waitingPeriod * 1000);
};

const ding = new Audio();
ding.volume = 1;

const music = new Audio("assets/audio/music.mp3");
music.onended = function () {
    music.play();
};


var direction = "E";

window.onload = function () {
    // initialize screen n shit
    screen = document.getElementById("screen");
    screen.width = screenWidth;
    screen.height = screenHeight;
    ctx = screen.getContext("2d");


    document.addEventListener("click", function (e) { 
        clicked = true;
        run("click"); // not a built-in function surprise surprise


    });

    document.addEventListener("mousemove", function (e) {
        getMouseCoords(e);
    });

    document.addEventListener("keyup", function (e) {
        run(e);
    });

    setInterval(updateScreen, 60); // run updateScreen function every 60 milliseconds





};

function gameplayLoop() {
    lap += 1;
    if ((level * 7) + (level - 1) === lap) { // if the current lap is when a level up occurs
        waitingPeriod *= 0.90; // waiting period decreases by 1/10th every level
        level += 1;
    }
    ding.src = "assets/audio/laps/" + lap.toString() + ".mp3"; // change ding's audio file to the appropriate lap announcement
    ding.play();

    if (running === true) { // if current lap has not been completed
        lives -= 1;
        if (lives === 0) {
            gameOver = true;
            menu = "game over";
            setTimeout(() => {
                music.pause();
                music.currentTime = 0;
            }, 2000);
        }
    }
    running = true;
    if (lap === 247){ // 247 is the max amount of laps you can get
        gameOver = true;
        menu = "complete";
        music.pause();
                music.currentTime = 0;
    }
    if (!gameOver) {
        setTimeout(gameplayLoop, waitingPeriod * 1000); // wait for [waitingPeriod] seconds then loop the function back around
    }
}

function run(e) {
    if (menu === "gameplay") {
        if (running) {
            // playerY = 130;
            if (mouseX >= 0 && mouseX <= screenWidth &&
                mouseY >= 0 && mouseY <= screenHeight) { // if mouse on the canvas
                document.getElementById("body").style.userSelect = "none"; // to prevent text from being selected

                if (e.code === "Space" || e === "click") {

                    if (runFrame === 1) {
                        player.src = "assets/" + direction + "/running.png";
                        runFrame = 2;
                    }
                    else {
                        player.src = "assets/" + direction + "/running2.png";
                        runFrame = 1;
                    }


                    if (direction === "E") {
                        playerX += speed;
                    }
                    else {
                        playerX -= speed;
                    }

                    playerY -= 10;
                    setTimeout(() => {
                        playerY += 10;

                    }, 70);

                    if (playerX >= screenWidth * 0.8833) {
                        direction = "W";
                        player.src = "assets/W/idle.png";
                        playerX = screenWidth * 0.8833;
                        running = false;
                    }


                    if (playerX <= screenWidth * 0.05) {
                        direction = "E";
                        player.src = "assets/E/idle.png";
                        playerX = screenWidth * 0.05;
                        running = false;
                    }



                }

            }
            else {
                document.getElementById("body").style.userSelect = "all";
            }
        }
    }
}

function getMouseCoords(e) {
    let rect = screen.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

}

function updateScreen() {
    if (menu === "title") {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, screenWidth, screenHeight);
        if (mouseX >= 250 && mouseX <= 350 &&
            mouseY >= 150 && mouseY <= 200) { // if mouse is over "play" button
            ctx.fillStyle = "darkred";
            if (clicked) {
                menu = "choose difficulty";
                clicked = false;
            }
        }
        else {
            ctx.fillStyle = "red";
        }

        ctx.fillRect(250, 150, 100, 50);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";

        ctx.font = "20px arial";
        ctx.fillText("play", 300, 180);
        ctx.font = "48px arial";
        ctx.fillText("fitnessgram pacer test", 300, 60);



    }

    else if (menu === "choose difficulty") {
        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, screenWidth, screenHeight);


        ctx.font = "48px arial";
        ctx.fillStyle = "white";
        ctx.fillText("Choose a difficulty:", 300, 60);

        ctx.font = "30px arial";



        if (mouseX >= 29 && mouseX <= 179 && // if mouse touching easy button
            mouseY >= 143 && mouseY <= 218) {
                ctx.fillStyle ="green";
                if (clicked) {
                    speed = 30;
                    menu = "gameplay";
                    instructions.play();
                }
        }
        else {
            ctx.fillStyle = "lightgreen";
        }
        
        ctx.fillRect(29, 143, 150, 75);
        ctx.fillStyle = "white";
        ctx.fillText("Easy", 104, 190)


        if (mouseX >= 225 && mouseX <= 375 && // if mouse touching medium button
            mouseY >= 143 && mouseY <= 218) {
                ctx.fillStyle ="#b0aa00";
                if (clicked) {
                    speed = 20;
                    menu = "gameplay";
                    instructions.play();
                }
        }
        else {
            ctx.fillStyle = "yellow";
        }

        
        ctx.fillRect(225, 143, 150, 75);
        ctx.fillStyle = "white";
        ctx.fillText("Medium", 300, 190)


        if (mouseX >= 421 && mouseX <= 571 && // if mouse touching hard button
            mouseY >= 143 && mouseY <= 218) {
                ctx.fillStyle ="darkred";
                if (clicked) {
                    speed = 15;
                    menu = "gameplay";
                    instructions.play();
                }
        }
        else {
            ctx.fillStyle = "red";
        }

        ctx.fillRect(421, 143, 150, 75);
        ctx.fillStyle = "white";
        ctx.fillText("Hard", 496, 190)


       


    }

    else if (menu === "gameplay") {
        ctx.drawImage(background, 0, 0, screenWidth, screenHeight);
        ctx.drawImage(player, playerX, playerY, 60, 120);
    }

    else if (menu === "game over") {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, screenWidth, screenHeight);

        ctx.fillStyle = "white";
        ctx.font = "48px arial";
        ctx.textAlign = "center";
        ctx.fillText("get good loser", screenWidth / 2, screenHeight / 2);
    }

    else if (menu === "complete") {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, screenWidth, screenHeight);

        ctx.fillStyle = "white";
        ctx.font = "48px arial";
        ctx.textAlign = "center";
        ctx.fillText("jock", screenWidth / 2, screenHeight / 2);
    }
}


