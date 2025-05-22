// Initialize kaboom (no assignment)
kaboom({
  width: 640,
  height: 360,
  background: [135, 206, 235],
  debug: true,
});

// Load sprites
loadSprite("monster1", "sprites/felipao.png");
loadSprite("monster2", "sprites/ze_chule.png");

// Load sounds
loadSound("felipao", "sounds/oh_felipao.wav");
loadSound("zechule", "sounds/ze-chule.wav");
loadSound("hit", "sounds/hit.wav");
loadSound("miss", "sounds/miss.mp3");
loadSound("levelup", "sounds/level-up.mp3");

// Game variables
let score = 0;
let level = 1;
const scoreToLevelUp = 5;
let lives = 3;
let timeLeft = 30;
let timerId = null;
let monsters = [];
let gameState = "start";

let scoreLabel, livesLabel, timerLabel;
let startScreen, endScreen;

// Reset Game
function resetGame() {
  score = 0;
  level = 1;
  lives = 3;
  timeLeft = 30;
  gameState = "playing";

  destroyAll("monster");
  destroyAll("ui");
  
  initUI();
  spawnMonsters();
  startTimer();
}

// Initialize UI
function initUI() {
  scoreLabel = add([
    text(`Score: ${score}`, { size: 24 }),
    pos(12, 12),
    z(100),
    "ui",
  ]);
  livesLabel = add([
    text(`Lives: ${lives}`, { size: 24 }),
    pos(12, 40),
    z(100),
    "ui",
  ]);
  timerLabel = add([
    text(`Time: ${timeLeft}`, { size: 24 }),
    pos(width() - 120, 12),
    z(100),
    "ui",
  ]);
}

// Spawn monsters
function spawnMonsters() {
  const numMonsters = level + 1;
  
  for (let i = 0; i < numMonsters; i++) {
    const type = Math.random() < 0.5 ? "monster1" : "monster2";
    const soundName = type === "monster1" ? "felipao" : "zechule";

    let m = add([
      sprite(type),
      pos(rand(50, width() - 100), rand(100, height() - 100)),
      area(),
      scale(1),
      anchor("center"),
      z(50),
      "monster",
      {
        monsterType: type,
        clicked: false,
        sound: soundName,
      },
    ]);

    m.onClick(() => {
      if (gameState !== "playing") return;
      if (m.clicked) return;

      play(m.sound);
      play("hit");
      m.clicked = true;
      incrementScore();

      // Animation effect
      tween(m.scale.x, 1.3, 0.1, (val) => m.scale = vec2(val), easings.easeOutQuad).then(() => {
        tween(m.scale.x, 1, 0.1, (val) => m.scale = vec2(val), easings.easeInQuad);
      });
    });

    monsters.push(m);
  }
}

function incrementScore() {
  score++;
  scoreLabel.text = `Score: ${score}`;
  if (score % scoreToLevelUp === 0) {
    levelUp();
  }
}

function levelUp() {
  play("levelup");
  level++;
  monsters.forEach(m => destroy(m));
  monsters = [];
  
  let levelMsg = add([
    text(`Level ${level}`, { size: 48 }),
    pos(width() / 2, height() / 2),
    anchor("center"),
    z(200),
    "ui",
  ]);
  wait(1.5, () => {
    destroy(levelMsg);
  });
  spawnMonsters();
}

function startTimer() {
  if (timerId) clearInterval(timerId);
  timerId = setInterval(() => {
    if (gameState !== "playing") return;
    timeLeft--;
    timerLabel.text = `Time: ${timeLeft}`;
    if (timeLeft <= 0) {
      gameOver();
    }
  }, 1000);
}

function gameOver() {
  gameState = "gameover";
  clearInterval(timerId);
  play("miss");

  monsters.forEach(m => destroy(m));
  monsters = [];
  
  endScreen = add([
    rect(width(), height()),
    color(0, 0, 0),
    opacity(0.8),
    pos(0, 0),
    z(150),
    "ui",
  ]);
  const endText = add([
    text(`Game Over\nFinal Score: ${score}\nClick to Restart`, { 
      size: 32, 
      align: "center" 
    }),
    pos(width()/2, height()/2),
    anchor("center"),
    z(200),
    "ui",
  ]);

  onMousePress(() => {
    if (gameState === "gameover") {
      destroy(endScreen);
      destroy(endText);
      resetGame();
    }
  });
}

onMousePress(() => {
  if (gameState !== "playing") return;
  
  // Check if click was on a monster
  const clickedOnMonster = get("monster").some(m => {
    const mousePosition = mousePos();
    return m.hasPoint(mousePosition);
  });
  
  if (!clickedOnMonster) {
    lives--;
    play("miss");
    livesLabel.text = `Lives: ${lives}`;
    if (lives <= 0) {
      gameOver();
    }
  }
});

function showStartScreen() {
  gameState = "start";
  startScreen = add([
    rect(width(), height()),
    color(0, 0, 0),
    opacity(0.7),
    pos(0, 0),
    z(150),
    "ui",
  ]);
  const title = add([
    text("Monster Clicker", { size: 48 }),
    pos(width()/2, height()/2 - 50),
    anchor("center"),
    z(200),
    "ui",
  ]);
  const instruction = add([
    text("Click to Start", { size: 24 }),
    pos(width()/2, height()/2 + 50),
    anchor("center"),
    z(200),
    "ui",
  ]);

  onMousePress(() => {
    if (gameState === "start") {
      destroy(startScreen);
      destroy(title);
      destroy(instruction);
      resetGame();
    }
  });
}

showStartScreen();