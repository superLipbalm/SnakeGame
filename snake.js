const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const cellSize = 25;
const defaultSize = 3;

const snakeCell = {
  width: cellSize,
  height: cellSize,
};

const snakeSpeed = {
  dx: -cellSize,
  dy: 0,
};

const food = {
  x: cellSize,
  y: cellSize,
  stat: false,
};

const snake = [];

function drawSnake() {
  snake.forEach((cell) => {
    ctx.beginPath();
    ctx.rect(cell.x, cell.y, cell.width, cell.height);
    ctx.fillStyle = '#636e72';
    ctx.fill();
    ctx.closePath();
  });
}

function drawFood() {
  if (food.stat === false) {
    while (snakeCheck(food.x, food.y)) {
      food.x = Math.floor((Math.random() * canvas.width) / cellSize) * cellSize;
      food.y = Math.floor((Math.random() * canvas.height) / cellSize) * cellSize;
    }
  }

  ctx.beginPath();
  ctx.rect(food.x, food.y, snakeCell.width, snakeCell.height);
  ctx.fillStyle = '#d63031';
  ctx.fill();
  ctx.closePath();

  food.stat = true;
}

function snakeCheck(x, y) {
  let check = false;

  snake.forEach((cell) => {
    if (cell.x === x && cell.y === y) {
      check = true;
    }
  });

  return check;
}

function moveSnake() {
  const x = snake[0].x + snakeSpeed.dx;
  const y = snake[0].y + snakeSpeed.dy;

  if (x + snakeCell.width > canvas.width) {
    snakeSpeed.dx = 0;
    snakeSpeed.dy = cellSize;
    return;
  } else if (x < 0) {
    snakeSpeed.dx = 0;
    snakeSpeed.dy = -cellSize;
    return;
  } else if (y < 0) {
    snakeSpeed.dx = cellSize;
    snakeSpeed.dy = 0;
    return;
  } else if (y + snakeCell.height > canvas.height) {
    snakeSpeed.dx = -cellSize;
    snakeSpeed.dy = 0;
    return;
  }

  if (snakeCheck(x, y)) {
    snake.splice(0, snake.length, {});
    snakeSpeed.dx = cellSize;
    snakeSpeed.dy = 0;
    makeSnake();
    return;
  }

  snake.splice(0, 0, { x, y, ...snakeCell });
  if (x === food.x && y === food.y) {
    food.stat = false;
  } else {
    snake.splice(snake.length - 1, 1);
  }
}

function makeSnake() {
  for (let i = 0; i < defaultSize; i++) {
    const x = 250 + snakeCell.width * i;
    const y = 250;
    snake[i] = { x, y, ...snakeCell };
  }
}

function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  moveSnake();
  drawSnake();
  drawFood();
}

function keyDownHandle(e) {
  switch (e.key) {
    case 'ArrowLeft':
      snakeSpeed.dx = snakeSpeed.dx === cellSize ? snakeSpeed.dx : -cellSize;
      snakeSpeed.dy = 0;
      break;
    case 'ArrowRight':
      snakeSpeed.dx = snakeSpeed.dx === -cellSize ? snakeSpeed.dx : cellSize;
      snakeSpeed.dy = 0;
      break;
    case 'ArrowDown':
      snakeSpeed.dx = 0;
      snakeSpeed.dy = snakeSpeed.dy === -cellSize ? snakeSpeed.dy : cellSize;
      break;
    case 'ArrowUp':
      snakeSpeed.dx = 0;
      snakeSpeed.dy = snakeSpeed.dy === cellSize ? snakeSpeed.dy : -cellSize;
      break;
    default:
  }
}

makeSnake();
setInterval(updateCanvas, 65);

document.addEventListener('keydown', keyDownHandle);
