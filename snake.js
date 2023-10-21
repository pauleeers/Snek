const board = document.getElementById('game-board');
const scoreElement = document.getElementById('score');

let snake = [{ x: 150, y: 150 }];
let food = { x: getRandomCoordinate(), y: getRandomCoordinate() };
let dx = 15;
let dy = 0;
let score = 0;
let speed = 100;  // Adjusted starting speed

let startX = 0;
let startY = 0;

function getRandomCoordinate() {
    return Math.floor(Math.random() * 20) * 15;
}

function drawGame() {
    board.innerHTML = '';

    drawSnake();
    drawFood();

    let head = { ...snake[0] };
    head.x += dx;
    head.y += dy;

    // Wrap around logic for the walls
    if (head.x < 0) head.x = 285;
    if (head.x >= 300) head.x = 0;
    if (head.y < 0) head.y = 285;
    if (head.y >= 300) head.y = 0;

    snake.unshift(head);
    snake.pop();

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        speed *= 0.90;  
        startGame();   
        scoreElement.textContent = score;

        food = { x: getRandomCoordinate(), y: getRandomCoordinate() };
        snake.push({});
    }

    // Removed wall collision logic here

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            endGame();
        }
    }
}


function drawSnake() {
    snake.forEach(part => {
        let snakePart = document.createElement('div');
        snakePart.style.left = `${part.x}px`;
        snakePart.style.top = `${part.y}px`;
        snakePart.classList.add('snake-part');
        board.appendChild(snakePart);
    });
}

function drawFood() {
    let foodElement = document.createElement('div');
    foodElement.style.left = `${food.x}px`;
    foodElement.style.top = `${food.y}px`;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

function endGame() {
    clearInterval(gameInterval);
    alert('Game Over! Your score is: ' + score);
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -15; }
            break;
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = 15; }
            break;
        case 'ArrowLeft':
            if (dx === 0) { dx = -15; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx === 0) { dx = 15; dy = 0; }
            break;
    }
});

function handleTouchStart(event) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!startX || !startY) {
        return;
    }

    let diffX = startX - event.touches[0].clientX;
    let diffY = startY - event.touches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY)) { 
        if (diffX > 0 && dx === 0) { 
            dx = -15; dy = 0;
        } else if (dx === 0) { 
            dx = 15; dy = 0;
        }
    } else { 
        if (diffY > 0 && dy === 0) { 
            dx = 0; dy = -15;
        } else if (dy === 0) { 
            dx = 0; dy = 15;
        }
    }

    startX = null;
    startY = null;
}

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

let gameInterval;

function startGame() {
    if(gameInterval) {
        clearInterval(gameInterval);
    }
    gameInterval = setInterval(drawGame, speed);
}

startGame();
