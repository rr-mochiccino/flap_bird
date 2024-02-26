let board;
let boardWidth = 360;
let boardHeight = 640;
let context;
let birdImage;

const birdWidth = 50;
const birdHeight = 50;

const bird = {
    x: 50,
    y: boardHeight / 2 - 15,
    height: birdHeight,
    width: birdWidth,
};

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth; 
let pipeY = 0;
let topPipeImage;
let bottomPipeImage;

let velocity = -2
let velocityY = 0;
const gravity = 0.4;

let gameOver =  false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    birdImage = new Image();
    birdImage.src = "ghost.png";
    birdImage.onload = function () {
        context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    };

    topPipeImage = new Image();
    topPipeImage.src = "./toppipe.png";

    bottomPipeImage = new Image();
    bottomPipeImage.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
    document.getElementById("board").focus();
};

function update() {
    if (gameOver) {
        // Display game over message or perform any other necessary actions
        context.fillStyle = "white";
        context.font = "30px Arial";
        context.fillText("GAME OVER", boardWidth / 2 - 70, boardHeight / 2);
        setTimeout(function () {
            location.reload();
        }, 2000);

        return;
    }

    requestAnimationFrame(update);

    context.clearRect(0, 0, boardWidth, boardHeight);

    velocityY += gravity;
    bird.y = Math.min(Math.max(bird.y + velocityY, 0), boardHeight - bird.height); // Limit bird.y to canvas height
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocity;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipeWidth) {
            score += 0.5;
            pipe.passed = true;
        }

        if (checkCollision()) {
            gameOver = true;
            // Display game over message or perform any other necessary actions
            console.log("Game Over!");
            return; // Stop the game loop immediately
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font = "30px Arial";
    context.fillText("Score: " + score, 5, 45);
}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY  -  pipeHeight/4 - Math.random() * (pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img: topPipeImage,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImage,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(event) {
    if (event.keyCode === 32) {
        velocityY = -6;
    }
}

function checkCollision() {
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];

        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            bird.y < pipe.y + pipe.height &&
            bird.y + bird.height > pipe.y
        ) {
            // Collision detected, handle it as needed
            return true;
        }
    }
    return false; // No collision detected
}
