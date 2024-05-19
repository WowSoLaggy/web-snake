const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restartButton");
const gameOverScreen = document.getElementById("game-over");
const scoreDisplay = document.getElementById("score");

const gridSize = 20;
const canvasSize = 400;
canvas.width = canvasSize;
canvas.height = canvasSize;

let snake = [{ x: gridSize * 5, y: gridSize * 5 }];
let direction = { x: 0, y: 0 };
let food = getRandomFoodPosition();
let score = 0;
let speed = 100;

document.addEventListener("keydown", changeDirection);
restartButton.addEventListener("click", restartGame);

function gameLoop() {
    if (isGameOver()) {
        showGameOverScreen();
        return;
    }

    setTimeout(function() {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake(); // Ensure the snake is drawn after it moves
        gameLoop();
    }, speed);
}

function clearCanvas() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvasSize, canvasSize);
}

function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = "lime";
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
        ctx.strokeStyle = "#000"; // Цвет рамки (черный)
        ctx.lineWidth = 2; // Толщина рамки
        ctx.strokeRect(part.x, part.y, gridSize, gridSize);
    });
}

function changeDirection(event) {
    const goingUp = direction.y === -gridSize;
    const goingDown = direction.y === gridSize;
    const goingRight = direction.x === gridSize;
    const goingLeft = direction.x === -gridSize;

    let newDirection;
    if ((event.code === "ArrowUp" || event.code === "KeyW") && !goingDown) {
        newDirection = { x: 0, y: -gridSize };
    } else if ((event.code === "ArrowDown" || event.code === "KeyS") && !goingUp) {
        newDirection = { x: 0, y: gridSize };
    } else if ((event.code === "ArrowLeft" || event.code === "KeyA") && !goingRight) {
        newDirection = { x: -gridSize, y: 0 };
    } else if ((event.code === "ArrowRight" || event.code === "KeyD") && !goingLeft) {
        newDirection = { x: gridSize, y: 0 };
    }

    // Проверка на разворот на 180 градусов
    if (newDirection && (newDirection.x !== -direction.x || newDirection.y !== -direction.y)) {
        direction = newDirection;
    }
}


function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 1;
        speed = Math.max(40, speed - 1); // Increase speed
        food = getRandomFoodPosition();
    } else {
        snake.pop();
    }

    updateScore();
}


function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
    ctx.strokeStyle = "#000"; // Цвет рамки (черный)
    ctx.lineWidth = 2; // Толщина рамки
    ctx.strokeRect(food.x, food.y, gridSize, gridSize);
}

function getRandomFoodPosition() {
    let foodPosition;
    while (!foodPosition || snake.some(part => part.x === foodPosition.x && part.y === foodPosition.y)) {
        foodPosition = {
            x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize
        };
    }
    return foodPosition;
}

function isGameOver() {
    const head = snake[0];
    const hitWall = head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize;
    const hitSelf = snake.slice(1).some(part => part.x === head.x && part.y === head.y);

    return hitWall || hitSelf;
}

function showGameOverScreen() {
    gameOverScreen.classList.remove("hidden");
}

function hideGameOverScreen() {
    gameOverScreen.classList.add("hidden");
}

function restartGame() {
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    direction = { x: 0, y: 0 };
    food = getRandomFoodPosition();
    score = 0;
    speed = 100;
    updateScore();
    hideGameOverScreen();
    gameLoop();
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

gameLoop();
