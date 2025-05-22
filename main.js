// kaboom setup
kaboom({
  width: 640,
  height: 360,
  background: [0, 0, 0], // black background
});

// Load sprites
loadSprite("monster1", "sprites/felipao.png");
loadSprite("monster2", "sprites/ze-chule.png");

// Load sounds
loadSound("felipao", "sounds/oh_felipao.wav");
loadSound("zechule", "sounds/ze-chule.wav");

// Add monster 1 on the left
const monster1 = add([
  sprite("monster1"),
  pos(100, 150),
  area(),     // adds collision/click detection
  "monster1", // tag
]);

// Add monster 2 on the right
const monster2 = add([
  sprite("monster2"),
  pos(400, 150),
  area(),
  "monster2",
]);

// Detect click on monster1
monster1.onClick(() => {
  play("felipao");
});

// Detect click on monster2
monster2.onClick(() => {
  play("zechule");
});
