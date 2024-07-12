const scores_api = 'https://snake.laggy.info/api/highscore';


document.addEventListener('DOMContentLoaded', () => {
    checkServerStatus();
});

async function checkServerStatus() {
    try {
        const response = await fetch(scores_api);
        if (!response.ok) {
            throw new Error('Server unavailable');
        }
        document.getElementById('content').classList.remove('hidden');
        document.getElementById('error').style.display = 'none'; // Скрываем сообщение об ошибке
    } catch (error) {
        document.getElementById('content').classList.add('hidden');
        document.getElementById('error').style.display = 'block'; // Показываем сообщение об ошибке
        console.error('Server check failed:', error);
    }
}


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

let snake, direction, food, score, speed;
let directionChanged = false; // Флаг для блокировки изменения направления

function initializeGame() {
    const startPosition = {
        x: Math.floor(canvasSize / 2 / gridSize) * gridSize,
        y: Math.floor(canvasSize / 2 / gridSize) * gridSize
    };

    snake = [startPosition];
    direction = { x: 0, y: 0 };
    food = getRandomFoodPosition();
    score = 0;
    speed = 100;
    directionChanged = false; // Сброс флага при инициализации игры
}

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
        directionChanged = false; // Сброс флага после изменения направления
        gameLoop(); // Продолжаем игровой цикл
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
        score += 1; // Увеличиваем счет только на 1
        speed = Math.max(50, speed - 2); // Увеличиваем скорость
        food = getRandomFoodPosition();
    } else {
        snake.pop();
    }

    updateScore();
}

function changeDirection(event) {
    if (directionChanged) return; // Блокировка изменения направления

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
        directionChanged = true; // Установка флага после изменения направления
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
    initializeGame();
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
    await fetch(scores_api, {
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
    const response = await fetch(scores_api);
    const scores = await response.json();
    scoreTableBody.innerHTML = scores.map(score => {
        const date = new Date(score.date);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы от 0 до 11
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        return `
            <tr>
                <td>${score.name}</td>
                <td>${score.score}</td>
                <td>${formattedDate}</td>
            </tr>
        `;
    }).join('');
}

initializeGame();
gameLoop();
loadScores();
