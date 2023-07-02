let screen;
let ctx;
const width = 700;
const height = 899;

let gameStarted = false;
let score = 0;
let frame = 0;

let mouseX;
let mouseY;

let gameOver = false;
let restartAvailable = false;
const pipeImg = new Image();
pipeImg.src = "./sprites/pipe.png";
let pipes = [];

const birdImg = new Image();
birdImg.src = "./sprites/bird.png";

const restartButton = new Image();
restartButton.src = "./sprites/restartsel.png";
restartButton.src = "./sprites/restart.png";

const message = new Image();
message.src = "./sprites/message.png"

new Audio("./sprites/flap.wav");
const point = new Audio("./sprites/point.wav");
const death = new Audio("./sprites/death.mp3");
class Bird {
    constructor() {
        this.x = 100;
        this.y = height / 2;
        this.jumping = false;
        this.fallSpeed = 10;

        this.angle = 0;
        this.width = 68;
        this.height = 68;
    }

    move() {
        if (gameStarted) {
            if (!gameOver) {
                if (!this.jumping) {
                    if (this.y + 10 > height - 40) { // if bird is past the ground
                        this.y = height - 40;
                        gameOver = true;
                        death.play();
                        
                        return;
                    }
                    else {
                        this.fallSpeed = 10;
                        if (this.angle >= 45) {
                            this.angle = 45;
                        }
                        else {
                            this.angle += 15;
                        }
                    }
                }
                else {
                    if (frame <= 3) {
                        if (this.angle <= 0) {
                            this.angle -= 20;
                        }

                        this.fallSpeed = -8;
                    }
                    else if (frame < 20) {
                        this.fallSpeed += 1;

                    }
                    else {
                        this.jumping = false;
                        this.fallSpeed = 10;
                    }
                }

                this.y += this.fallSpeed;


                this.angle += 3;
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle * Math.PI / 180);
                ctx.drawImage(birdImg, -this.width / 2, -this.height / 2, this.width, this.height);
                ctx.restore();




            }
            else {
                
                    if (!(this.y >= height - this.width)) {
                        this.y += 50;
                    }
                  
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(90 * Math.PI / 180);
                ctx.drawImage(birdImg, -this.width / 2, -this.height / 2, this.width, this.height);
                ctx.restore();

            }
        }
        else {


            ctx.drawImage(birdImg, this.x - (this.width / 2), this.y, this.width, this.height);


        }
    }
}



class Pipe {
    constructor() {
        this.x = width;
        this.y = this.y;
        this.width = 13 * 8;
        this.height = 80 * 8;
        this.pipeGap = 170;
        this.passedBird = false;


        this.newY()
    }

    newY() {
        this.y = Math.floor(Math.random() * (height - 500)) + 300;
    }
    move() {
        if (!gameOver) {
            this.x -= 5;
            if (this.x <= -this.width) {
                this.x = width;
                this.passedBird = false;
                this.newY();
            }

            this.detectCollision();

        }
        ctx.drawImage(pipeImg, this.x, this.y + (this.pipeGap / 2), this.width, this.height);
        rotateCanvas180Degrees();
        ctx.drawImage(pipeImg, width - this.x - this.width, (height - this.y) + (this.pipeGap / 2), this.width, this.height);
        rotateCanvas180Degrees();


    }
    detectCollision() {
        let birdX = bird.x - bird.width / 2;
        let birdY = bird.y - bird.height / 2;
        let birdWidth = bird.width;
        let birdHeight = bird.height;

        let insidePipeGap = (birdY + birdHeight) <= (this.y + (this.pipeGap / 2)) && birdY >= (this.y - (this.pipeGap / 2))
        let notInPipeGap = (birdX + birdWidth) < this.x || birdX > (this.x + this.width);

        if (!(insidePipeGap || notInPipeGap)) {
            
            gameOver = true;
            death.play();
        }

        if (this.x + this.width / 2 < birdX * 2 && !this.passedBird) {
            score += 1;
            new Audio("./sprites/point.wav").play();
            this.passedBird = true;
        }




    }
}

const bird = new Bird();


function checkForRestart() {
    if (gameOver){
        if (bird.y >= height- bird.width){
            setTimeout(function() {
                
                restartAvailable = true;
                
            }, 2000)
            
        }
        else{
            setTimeout(checkForRestart, 10);
        }
    }
    else {
        setTimeout(checkForRestart, 200);
    }
    
}
window.onload = function () {
    screen = document.getElementById("screen");
    ctx = screen.getContext("2d");

    const canvasDiv = document.getElementById("canvasDiv");
    screen.width = width;
    screen.height = height;


    // window.innerHeight - document.getElementById("FUCK").clientHeight;

    ctx.textAlign = "center";

    document.addEventListener("mousemove", function (e) {
        getMouseCoords(e);
    });

    document.addEventListener("keypress", function (e) {
        jump(e);
    });

    document.addEventListener("mousedown", function () {
        jump("Click")
    });


    addPipes();
    checkForRestart();
    setInterval(update, 16);

}

function getMouseCoords(e) {
    let rect = screen.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

}

function addPipes() {
    if (gameStarted) {
        setTimeout(function () {
            pipes.push(new Pipe());

            setTimeout(function () {
                pipes.push(new Pipe());
            }, 1300)
        }, 1000);


    }
    else {
        setTimeout(addPipes, 10);
    }


}
function rotateCanvas180Degrees() {
    ctx.translate(width, height);
    ctx.rotate(180 * (Math.PI / 180));

    // ctx.translate(width, height);
    //  ctx.rotate(180 * (Math.PI / 180));

}



function jump(e) {
    if (e.code === "Space" || e === "Click") {
        if (!restartAvailable) {
            if ((mouseX >= 0 && mouseX <= width &&
                mouseY >= 0 && mouseY <= height) || e.code === "Space") { // if mouse on the canvas
                if (!gameStarted) {
                    gameStarted = true;
                }
                if (!gameOver){
                    new Audio("./sprites/flap.wav").play();
                    frame = 0;
                    bird.jumping = true;
                    bird.angle = 0;
                    document.getElementById("body").style.userSelect = "none";
                }
                
            }
        }
        else {
            let cursonWithinRestartX = mouseX >= width / 2 - 147 / 2 && mouseX <= (width / 2 - 147 / 2) + 147;
            let cursorWithinRestartY = mouseY >= height / 2 + 90 / 2 && mouseY <= height / 2 + 90 / 2 + 90;
            if (cursonWithinRestartX && cursorWithinRestartY) {
                score = 0;
                pipes = [];
                bird.angle = 0;
                bird.y = height / 2;
                gameStarted = false;
                gameOver = false;
                restartAvailable = false;
                checkForRestart();
                addPipes();
            }
        }


    }
}



function update() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    if (bird.jumping == true) {
        frame += 1
    }
    bird.move();

    for (let i = 0; i < pipes.length; i++) {
        pipes[i].move();
    }
    ctx.fillStyle = "black"
    ctx.font = "50px Comic Sans MS";
    ctx.fillText(score, width / 2, 100)

    if (restartAvailable) {
        ctx.drawImage(restartButton, width / 2 - 147 / 2, height / 2 + 90 / 2, 147, 90);

        let cursonWithinRestartX = mouseX >= width / 2 - 147 / 2 && mouseX <= (width / 2 - 147 / 2) + 147;
        let cursorWithinRestartY = mouseY >= height / 2 + 90 / 2 && mouseY <= height / 2 + 90 / 2 + 90;
        if (cursonWithinRestartX && cursorWithinRestartY) {
            restartButton.src = "./sprites/restartsel.png";
        }
        else {
            restartButton.src = "./sprites/restart.png";
        }
    }

    if (!gameStarted){
        ctx.drawImage(message, width / 2 - 184/2, height / 2 - 267/2 - 100);
    }
}