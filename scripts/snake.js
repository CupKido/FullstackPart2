import * as db from '../scripts/dbfuncs.js'
db.LoadUser();
//board
var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

//snake head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

//food
var foodX;
var foodY;

var gameOver = false;
var speed = 1;
var score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); //used for drawing on the board

    placeFood();
    document.addEventListener("keyup", changeDirection);
    // update();
    let buttonList = document.querySelectorAll("button");
    buttonList.forEach(function (i) {
        i.addEventListener("click", function (e) {
            if (e.target.innerHTML == "Easy") {
                speed = 5;
            }
            else if (e.target.innerHTML == "Medium") {
                speed = 2;
            }
            else if (e.target.innerHTML == "Hard") {
                speed = 1;
            }
        })
    })
    setInterval(update, 100); //100 milliseconds-- call the update function every seconds
}

function update() {
    if (gameOver) {
        return;
    }
    document.getElementById('score').innerHTML = "Score: " + score;
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height); //color each block of the board in black

    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX > foodX - 25 && snakeX < foodX + 25 && snakeY < foodY + 25 && snakeY > foodY - 25) {
        snakeBody.push([foodX, foodY]);
        score++;
        placeFood();
    }

    for (let i = snakeBody.length - 1; i > 0; i--) { //make each block of the snake's body taking the one above it starting by the tail thus making the snake one entity
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) { //connect the head to the body
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle = "lime";
    snakeX += velocityX * blockSize / speed; /*set the place of the snake on X axe multiply by the size of a block 
                                                what makes it move one block evry seconds so we divide it to make it slower*/
    snakeY += velocityY * blockSize / speed;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize); //takes on eack element i the array the x and y coordinates and color it in snake color 
    }

    //game over conditions
    if (snakeX < 0 || snakeX > cols * blockSize || snakeY < 0 || snakeY > rows * blockSize) {
        gameOver = true;
        endGame();
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
            endGame();
        }
    }
}

function endGame() {
    var username = db.GetLoggedUser()["username"]
    alert("Game Over\n" + username + " Thank you for playing!");
    if (score > 0) {
        db.AddToScore(Math.ceil(score / 5), username, "Snake game");
        db.LoadUser()
    }
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {   //we dont allowed to go the opposite direction because he will fataly eats himself
        velocityX = 0;
        velocityY = -1;
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


function placeFood() {
    //(0-1) * cols -> (0-19.9999) -> (0-19) * 25
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}