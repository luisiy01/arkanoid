const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

const state = {
  status: 'start',
  lives: 3,
  score: 0,
  ballAttached: true,
};

const paddle = {
  x: W / 2,
  y: H - 40,
  width: 80,
  height: 16,
  speed: 6,
};

const ball = {
  x: 0,
  y: 0,
  radius: 6,
  dx: 0,
  dy: 0,
  speed: 4,
};

const keys = {};

window.addEventListener('keydown', e => { keys[e.key] = true; });
window.addEventListener('keyup', e => { keys[e.key] = false; });

function update() {
  switch (state.status) {
    case 'start': updateStart(); break;
    case 'playing': updatePlaying(); break;
    case 'paused': break;
    case 'gameover': updateGameOver(); break;
    case 'victory': updateVictory(); break;
  }
}

function draw() {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, W, H);

  switch (state.status) {
    case 'start': drawStart(); break;
    case 'playing': drawPlaying(); break;
    case 'paused': drawPlaying(); drawPauseOverlay(); break;
    case 'gameover': drawGameOver(); break;
    case 'victory': drawVictory(); break;
  }
}

function updateStart() {}
function attachBall() {
  state.ballAttached = true;
  ball.dx = 0;
  ball.dy = 0;
}

function launchBall() {
  state.ballAttached = false;
  ball.dx = ball.speed * 0.6;
  ball.dy = -ball.speed * 0.8;
}

function updatePlaying() {
  if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
    paddle.x -= paddle.speed;
  }
  if (keys['ArrowRight'] || keys['d'] || keys['D']) {
    paddle.x += paddle.speed;
  }
  if (paddle.x - paddle.width / 2 < 0) paddle.x = paddle.width / 2;
  if (paddle.x + paddle.width / 2 > W) paddle.x = W - paddle.width / 2;

  if (state.ballAttached) {
    ball.x = paddle.x;
    ball.y = paddle.y - ball.radius;
    if (keys[' ']) launchBall();
    return;
  }

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x - ball.radius < 0) {
    ball.x = ball.radius;
    ball.dx = -ball.dx;
  }
  if (ball.x + ball.radius > W) {
    ball.x = W - ball.radius;
    ball.dx = -ball.dx;
  }
  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    ball.dy = -ball.dy;
  }
}
function updateGameOver() {}
function updateVictory() {}

function drawStart() {}
function drawPlaying() {
  drawSprite(ctx, 'paddle', paddle.x - paddle.width / 2, paddle.y, paddle.width, paddle.height);
  drawSprite(ctx, 'ball', ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
}
function drawPauseOverlay() {}
function drawGameOver() {}
function drawVictory() {}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

loadSpritesheet(() => {
  gameLoop();
});
