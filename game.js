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
function updatePlaying() {}
function updateGameOver() {}
function updateVictory() {}

function drawStart() {}
function drawPlaying() {}
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
