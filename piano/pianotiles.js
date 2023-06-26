var screen;
var ctx;
var screenWidth = 480;
var screenHeight = 904;
var gameOver = false;
var rows = []; // stores the notes that are placed on each row
// the value of an element represents the column the note goes in, while its index represents the row it goes in
var scoreBoard;
var currentNote = 1;
var score = 0;
const fail = new Audio("fail.mp3"); // fail sound
fail.onended = function () {
    restart.style.visibility = "visible";
};

var doubles = false;
var toggle;
var restart;

window.onload = function () {
    screen = document.getElementById("screen");
    restart = document.getElementById("restart");
    restart.addEventListener("click", function () {
        score = 0
        scoreBoard.innerHTML = "Score: 0";
        rows = [];
        generateRows();
        gameOver = false;
        currentNote = 1;
        restart.style.visibility = "hidden";
    });
    toggle = document.getElementById("toggle");
    toggle.addEventListener("click", function () {
        if (doubles) {
            doubles = false;
            toggle.innerHTML = "Click to turn double notes ON";
        }

        else {
            doubles = true;
            toggle.innerHTML = "Click to turn double notes OFF";
        }
    });


    // preload note sounds

    for (let i = 1; i < 19; i++) {
        new Audio("notes/" + i + ".mp3");
    }
    /*
    code for scaling the canvas dimensions based on browser width and height

    screenWidth = window.innerWidth * 0.25;
    screenHeight = window.innerHeight - 25;
    
    */

    screen.width = screenWidth;
    screen.height = screenHeight;

    ctx = screen.getContext("2d"); // initialize context
    scoreBoard = document.getElementById("score");
    generateRows();

    document.addEventListener("keydown", function (e) {
        if (!gameOver) {
            keyPressed(e);
        }
    });

    
    setInterval(updateWindow, 10);


}

function generateRows() {
    for (let i = 0; i < 5; i++) { // generates a random note 5 times for each row
        rows.push(Math.floor(Math.random() * 4)); // Math.floor(Math.random() * x) generates a random number from 0 to x-1
        while (rows[i] === rows[i - 1]) { // generate a new note until it's not the same as the note above it
            rows[i] = (Math.floor(Math.random() * 4));
        }
    }
}


function keyPressed(e) {
    let key;
    switch (e.code) {
        // default keys are DFJK
        case "KeyD":
            key = 0;
            break;
        case "KeyF":
            key = 1;
            break;
        case "KeyJ":
            key = 2;
            break;
        case "KeyK":
            key = 3;
            break;
        default:
            key = 99;


    }

    if (rows[0] === key) { // if correct key pressed

        // move elements down the array
        for (let i = 1; i < 5; i++) {
            rows[i - 1] = rows[i]
        }
        rows[4] = rows[3];


        // generate a new note until it is different 
        while (rows[4] === rows[3]) {
            rows[4] = Math.floor(Math.random() * 4)

            if (doubles) {
                if (rows[4] === rows[3] && rows[3] !== rows[2]) { // if note is the same as the one below it and there is no mini-jack directly below
                    break;
                }
            }


        }

        new Audio("notes/" + currentNote + ".mp3").play(); // start playing the note corresponding to currentNote

        // cycle through numbers 1-18, each number corresponding to a specific note of fur elise
        currentNote += 1;
        if (currentNote === 19) {
            currentNote = 1;
        }

        //update score
        score += 1
        scoreBoard.innerHTML = "Score: " + score;
    }

    else if (key === 99) { return; } // avoids game-overs from non-dfjk keys

    else {
        gameOver = true;
        fail.play();

        // draw red note where the misinput occured
        ctx.fillStyle = "red";
        ctx.fillRect(key * (screenWidth / 4), screenHeight * 0.8, screenWidth / 4, screenHeight / 5);



    }

}
function drawBorders() {
    ctx.strokeStyle = "gray";

    // draw gray lines for each row
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, screenHeight / 5 * i + 0.05)
        ctx.lineTo(screenWidth + 0.05, screenHeight / 5 * i + 0.05);
        ctx.closePath();
        ctx.stroke();
    }

    /*

    code for drawing column borders

        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(screenWidth/4 * i, screenHeight);
            ctx.lineTo(screenWidth/4 * i, 0);
            ctx.closePath();
            ctx.stroke();
        }

    */
}


function updateWindow() {
    if (!gameOver) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, screenWidth, screenHeight);

        // draw each note in the rows array
        ctx.fillStyle = "black";
        for (let i = 0; i < 5; i++) {
            ctx.fillRect(rows[i] * (screenWidth / 4), screenHeight - ((i + 1) * (screenHeight / 5)), screenWidth / 4, screenHeight / 5);
        }


        drawBorders();
    }


}



