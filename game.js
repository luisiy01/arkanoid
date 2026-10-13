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

const BLOCK_ROWS = 7;
const BLOCK_COLS = 12;
const BLOCK_W = 32;
const BLOCK_H = 16;
const BLOCK_PAD = 4;
const BLOCK_OFFSET_TOP = 60;
const BLOCK_OFFSET_LEFT = (W - BLOCK_COLS * (BLOCK_W + BLOCK_PAD) + BLOCK_PAD) / 2;
const ROW_COLORS = ['red', 'hotpink', 'magenta', 'yellow', 'green', 'cyan', 'gray'];

let blocks = [];
let explosions = [];

function spawnExplosion(block) {
  explosions.push({
    x: block.x,
    y: block.y,
    width: block.width,
    height: block.height,
    color: block.color,
    frame: 0,
    elapsed: 0,
  });
}

function createBlocks() {
  blocks = [];
  for (let r = 0; r < BLOCK_ROWS; r++) {
    for (let c = 0; c < BLOCK_COLS; c++) {
      blocks.push({
        x: BLOCK_OFFSET_LEFT + c * (BLOCK_W + BLOCK_PAD),
        y: BLOCK_OFFSET_TOP + r * (BLOCK_H + BLOCK_PAD),
        width: BLOCK_W,
        height: BLOCK_H,
        color: ROW_COLORS[r],
        alive: true,
      });
    }
  }
}

const keys = {};

function resetGame() {
  state.status = 'playing';
  state.lives = 3;
  state.score = 0;
  paddle.x = W / 2;
  createBlocks();
  attachBall();
}

window.addEventListener('keydown', e => {
  keys[e.key] = true;
  if ((e.key === 'Escape' || e.key === 'p' || e.key === 'P') && state.status === 'playing') {
    state.status = 'paused';
  } else if ((e.key === 'Escape' || e.key === 'p' || e.key === 'P') && state.status === 'paused') {
    state.status = 'playing';
  }
});
window.addEventListener('keyup', e => { keys[e.key] = false; });

function updateExplosions(dt) {
  for (let i = explosions.length - 1; i >= 0; i--) {
    explosions[i].elapsed += dt;
    if (explosions[i].elapsed >= EXPLOSION_DURATION) {
      explosions.splice(i, 1);
    }
  }
}

function update(dt) {
  switch (state.status) {
    case 'start': updateStart(); break;
    case 'playing': updatePlaying(dt); break;
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

function updateStart() {
  if (keys[' ']) resetGame();
}
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

function updatePlaying(dt) {
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

  // Colisión bola-paddle
  const pLeft = paddle.x - paddle.width / 2;
  const pRight = paddle.x + paddle.width / 2;
  if (
    ball.dy > 0 &&
    ball.y + ball.radius >= paddle.y &&
    ball.y + ball.radius <= paddle.y + paddle.height &&
    ball.x >= pLeft &&
    ball.x <= pRight
  ) {
    const hit = (ball.x - paddle.x) / (paddle.width / 2);
    const maxAngle = Math.PI / 3;
    const angle = hit * maxAngle;
    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
    ball.y = paddle.y - ball.radius;
  }

  // Colisión bola-bloques
  for (const b of blocks) {
    if (!b.alive) continue;
    if (
      ball.x + ball.radius > b.x &&
      ball.x - ball.radius < b.x + b.width &&
      ball.y + ball.radius > b.y &&
      ball.y - ball.radius < b.y + b.height
    ) {
      spawnExplosion(b);
      b.alive = false;
      state.score += 10;

      const overlapLeft = ball.x + ball.radius - b.x;
      const overlapRight = b.x + b.width - (ball.x - ball.radius);
      const overlapTop = ball.y + ball.radius - b.y;
      const overlapBottom = b.y + b.height - (ball.y - ball.radius);
      const minOverlapX = Math.min(overlapLeft, overlapRight);
      const minOverlapY = Math.min(overlapTop, overlapBottom);

      if (minOverlapX < minOverlapY) {
        ball.dx = -ball.dx;
      } else {
        ball.dy = -ball.dy;
      }
      break;
    }
  }

  // Victoria: no quedan bloques vivos
  if (blocks.every(b => !b.alive)) {
    state.status = 'victory';
    return;
  }

  updateExplosions(dt);

  // Bola cae por debajo del canvas
  if (ball.y - ball.radius > H) {
    state.lives--;
    if (state.lives <= 0) {
      state.status = 'gameover';
    } else {
      attachBall();
    }
  }
}
function updateGameOver() {
  if (keys[' ']) resetGame();
}
function updateVictory() {
  if (keys[' ']) resetGame();
}

function drawHUD() {
  ctx.fillStyle = '#fff';
  ctx.font = '16px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Lives: ' + state.lives, 12, 24);
  ctx.textAlign = 'right';
  ctx.fillText('Score: ' + state.score, W - 12, 24);
  ctx.textAlign = 'left';
}

function drawCenterText(title, subtitle) {
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 36px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(title, W / 2, H / 2 - 20);
  ctx.font = '18px monospace';
  ctx.fillStyle = '#aaa';
  ctx.fillText(subtitle, W / 2, H / 2 + 20);
  ctx.textAlign = 'left';
}

function drawStart() {
  drawCenterText('ARKANOID', 'Press Space to start');
}
function drawBlocks() {
  for (const b of blocks) {
    if (!b.alive) continue;
    drawSprite(ctx, 'block_' + b.color, b.x, b.y, b.width, b.height);
  }
}

function drawExplosions() {
  for (const e of explosions) {
    const frameIndex = Math.min(Math.floor(e.elapsed / (EXPLOSION_DURATION / 4)), 3);
    const frames = EXPLOSION_FRAMES[e.color];
    if (frames) {
      drawFrame(ctx, frames[frameIndex], e.x, e.y, e.width, e.height);
    }
  }
}

function drawPlaying() {
  drawBlocks();
  drawExplosions();
  drawSprite(ctx, 'paddle', paddle.x - paddle.width / 2, paddle.y, paddle.width, paddle.height);
  drawSprite(ctx, 'ball', ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
  drawHUD();
}
function drawPauseOverlay() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, W, H);
  drawCenterText('PAUSED', 'Press Esc or P to resume');
}
function drawGameOver() {
  drawCenterText('GAME OVER', 'Score: ' + state.score + '  |  Press Space to restart');
}
function drawVictory() {
  drawCenterText('VICTORY!', 'Score: ' + state.score + '  |  Press Space to restart');
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

loadSpritesheet(() => {
  createBlocks();
  gameLoop();
});
