const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restartButton");
const restartButtonWin = document.getElementById("restartButtonWin");
const gameOverScreen = document.getElementById("game-over");
const winScreen = document.getElementById("win-screen");
const scoreDisplay = document.getElementById("score");
const submitScoreForm = document.getElementById("submitScoreForm");
const submitScoreFormWin = document.getElementById("submitScoreFormWin");
const nameInput = document.getElementById("nameInput");
const nameInputWin = document.getElementById("nameInputWin");
const scoreTableBody = document.querySelector("#scoreTable tbody");

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
restartButtonWin.addEventListener("click", restartGame);
submitScoreForm.addEventListener("submit", submitScore);
submitScoreFormWin.addEventListener("submit", submitScore);

async function gameLoop() {
    if (isGameOver()) {
        showGameOverScreen();
        await loadScores();
        return;
    }

    if (isWin()) {
        showWinScreen();
        await loadScores();
        return;
    }

    setTimeout(function() {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
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

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        speed = Math.max(50, speed - 2); // Increase speed
        food = getRandomFoodPosition();
    } else {
        snake.pop();
    }

    updateScore();
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

function isWin() {
    // Check if the snake has filled the entire board
    return snake.length === (canvasSize / gridSize) * (canvasSize / gridSize);
}

function showGameOverScreen() {
    gameOverScreen.classList.remove("hidden");
}

function showWinScreen() {
    winScreen.classList.remove("hidden");
}

function hideGameOverScreen() {
    gameOverScreen.classList.add("hidden");
}

function hideWinScreen() {
    winScreen.classList.add("hidden");
}

function restartGame() {
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    direction = { x: 0, y: 0 };
    food = getRandomFoodPosition();
    score = 0;
    speed = 100;
    updateScore();
    hideGameOverScreen();
    hideWinScreen();
    gameLoop();
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

async function submitScore(event) {
    event.preventDefault();
    const name = event.target.querySelector('input').value;
    await fetch('http://localhost:3000/api/scores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, score })
    });
    await loadScores(); // Обновление списка лидеров
    restartGame();
}


async function loadScores() {
    const response = await fetch('http://localhost:3000/api/scores');
    const scores = await response.json();
    scoreTableBody.innerHTML = scores.map(score => {
        const date = new Date(score.date);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы от 0 до 11
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;
        return `
            <tr>
                <td>${score.name}</td>
                <td>${score.score}</td>
                <td>${formattedDate}</td>
            </tr>
        `;
    }).join('');
}

gameLoop();
loadScores();
