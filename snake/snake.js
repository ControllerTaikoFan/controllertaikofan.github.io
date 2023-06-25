var blockSize = 20;
var rows = 20;
var columns = 20;
var board;
var context;

// snake head x and y coords
var snakeX = blockSize * 10;
var snakeY = blockSize * 10;

// snake body
var snakeBody = [];

// snake speed
var velocityX = 0;
var velocityY = 0;

// food coords
var foodX;
var foodY;

var score = 0;

var gameOver = false;


window.onload = function () {
    board = document.getElementById("canvas");
    board.width = rows * blockSize;
    board.height = columns * blockSize;
    context = board.getContext("2d"); // context is used for drawing on the board

    
    document.addEventListener("keydown", changeDirection);
    setInterval(update, 70);
    placeFood();


}


function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1; // top -> bottom on the y axis is ascending
    }
    else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}


function drawGridLines() {
    let contextX = 0;
    let contextY = 0;
    context.moveTo(contextX, contextY);
    context.strokeStyle = "gray";
    for (i = 0; i < rows; i++) {
        contextX += blockSize;
        context.beginPath(); // indicate the path start

        context.moveTo(contextX, 0);
        context.lineTo(contextX, board.height);
        context.stroke(); // carry out the path
    }
    contextX = 0;
    for (i = 0; i < columns; i++) {
        contextY += blockSize;
        context.beginPath();
        context.moveTo(0, contextY);
        context.lineTo(board.width, contextY);
        context.stroke();

    }
}



function update() {

    if (gameOver) {
        return;
    }


    // fill canvas
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height); // top left is (0,0), fill a rectangle w/dimensions of the board

    /*
    syntax for fillRect
 
    context.fillRect(topleftX, topleftY, width, height)
    */


    // draw food

    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY) {
        placeFood();
        snakeBody.push([snakeX, snakeY]);
        score += 1;
        document.getElementById("score").innerHTML = "Score: " + score;
    }




    // update snake coords
    context.fillStyle = "lime";


    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1]
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY]
    }
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }



    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;




    // if edge reached, loop back around
    if (snakeX / blockSize > rows - 1) {
        snakeX -= board.width + blockSize;
    }
    else if (snakeX < 0) {
        snakeX += board.width;
    }

    if (snakeY / blockSize > columns - 1) {
        snakeY -= board.height;
    }
    else if (snakeY < 0) {
        snakeY += board.height;
    }








    // draw snake
    context.fillRect(snakeX, snakeY, blockSize, blockSize);





    // check if snake collides with a part of its body  
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeBody[i][0] == snakeX && snakeBody[i][1] == snakeY) {
            gameOver = true;
            document.getElementById("message").innerHTML = "lol get good loser";
        }
    }




    drawGridLines();




}

function placeFood() {
    let badApple = true;
    // Math.random() returns number from 0 to 1
    // Math.floor() rounds number to nearest integer
    while (badApple) {
        foodX = Math.floor(Math.random() * rows) * blockSize;
        foodY = Math.floor(Math.random() * columns) * blockSize;
        badApple = false
        for (let i = 0; i < snakeBody.length; i++) {
            if (snakeBody[i][0] == foodX && snakeBody[i][1] == foodY) {
                badApple = true;
                break;
            }
            else{
                badApple = false;
                
            }
        }
        
        
    }

}