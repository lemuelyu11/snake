const gameBoard = document.querySelector("#gameBoard");
const context = gameBoard.getContext("2d"); 
const scorePoint = document.querySelector("#scorePoint");
const startButton = document.querySelector("#startButton");
const resetButton = document.querySelector("#resetButton");
const gameHeight = gameBoard.height;
const gameWidth = gameBoard.width;
const boardBackground = "white";
const unitSize = 20;
const foodColor = "red";
const snakeColor = "green";
const snakeBorder = "black";
let foodX;
let foodY; //declare with Math.random later
let speedX = unitSize; // moving to the right
let speedY = 0; //not moving up or down
let score = 0; //initial score
let snake = [ //snake size
    {x:unitSize * 2, y:0},
    {x:unitSize * 1, y:0},
    {x:0, y:0} //tail 
];
let running = false; //examine whether game is running or not 

function start(){
    running= true;
    scorePoint.textContent = score;
    createFood();
    drawFood();
    nextFrame();
};

startButton.addEventListener("click", startGame); 
window.addEventListener("keydown", changeDirection); 
resetButton.addEventListener("click", resetGame); 

function startGame(){
    start();
};
function nextFrame(){
    if(running){
        setTimeout(()=>{
            clearBoard();
            drawFood();
            drawSnake();
            moveSnake();
            checkGameOver();
            nextFrame();
        }, 100);
    }
    else{
        displayGameOver();
    }
};
function clearBoard(){
    context.fillStyle = boardBackground;
    context.fillRect(0, 0, gameWidth, gameHeight); // top right to bottom left
};
function createFood(){
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize; 
        return randNum; //no food will be generated without this
    }
    foodX = randomFood(0, gameWidth - unitSize); //min and max, max minus unitSize to get to the opposite end
    foodY = randomFood(0, gameHeight - unitSize); //not hard coded to allow flexibility in both gameBoard and unitSize
};
function drawFood(){
    context.fillStyle = foodColor;
    context.fillRect(foodX, foodY, unitSize, unitSize); //coordinates then width&height
};
function moveSnake(){
    const head = {x: snake[0].x + speedX, //coordinates of snake head + going right
                  y: snake[0].y + speedY}; 
    
    snake.unshift(head); 
    //if food is eaten
    if(snake[0].x == foodX && snake[0].y == foodY){
        score+=1;
        scorePoint.textContent = score; //overwite data on score
        createFood();
    }
    else{
        snake.pop(); //to eliminate tail as snake moves along
    }     
};
function drawSnake(){
    context.fillStyle = snakeColor;
    context.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        context.fillRect(snakePart.x, snakePart.y, unitSize, unitSize); //snake coordinate, then width&height
        context.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize); //for snake border
    })
};
function changeDirection(event){
    const keyPressed = event.keyCode;
    const left = 37; //all 4 have their own keynumber
    const up = 38;
    const right = 39;
    const down = 40;
    const goingUp = (speedY == -unitSize);
    const goingDown = (speedY == unitSize);
    const goingRight = (speedX == unitSize);
    const goingLeft = (speedX == -unitSize);

    switch(true){
        case(keyPressed == left && !goingRight): //stopping the snake from going opposite direction that its facing
            speedX = -unitSize;
            speedY = 0;
            break;
        case(keyPressed == up && !goingDown):
            speedX = 0;
            speedY = -unitSize;
            break;
        case(keyPressed == right && !goingLeft):
            speedX = unitSize;
            speedY = 0;
            break;
        case(keyPressed == down && !goingUp):
            speedX = 0;
            speedY = unitSize;
            break;
    }
};
function checkGameOver(){
    //if crash into wall 
    switch(true){ 
        case (snake[0].x < 0): //crash into left border
            running = false;
            break;
        case (snake[0].x >= gameWidth): //crash into right border
            running = false;
            break;
        case (snake[0].y < 0): //crash into top 
            running = false;
            break;
        case (snake[0].y >= gameHeight): //crash into bottom
            running = false;
            break;
    }
    //if crash into itself
    for(let i = 1; i < snake.length; i+=1){ 
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
        }
    }
};
function displayGameOver(){
    context.textAlign = "center";
    context.fillText("Game Over", gameWidth / 2, gameHeight / 2); //place it in the middle
    running = false;
};
function resetGame(){
    score = 0;
    speedX = unitSize;
    speedY = 0;
    snake = [
        {x:unitSize * 2, y:0},
        {x:unitSize * 1, y:0},
        {x:0, y:0}
    ];
    start();
};
