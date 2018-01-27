window.PIXI = require('phaser/build/custom/pixi');
window.p2 = require('phaser/build/custom/p2');
window.Phaser = require('phaser/build/custom/phaser-split');

const game = new window.Phaser.Game(800, 600, window.Phaser.CANVAS, 'rhythm', {
  preload,
  create,
  update,
  render,
});

let keys;
let keyArr;
let music;
let scoreString;
let scoreText;
let score;
let notes;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function preload() {
  game.load.image('middle', 'assets/middle.png');
  game.load.image('side', 'assets/side.png');
  game.load.image('background', 'assets/maniabg.png');
  game.load.image('middleh', 'assets/middleh.png');
  game.load.audio('music', ['assets/bg.mp3']);
}

function create() {
  // Background
  game.add.tileSprite(0, 0, 1000, 600, 'background');
  // Music
  music = game.add.audio('music');
  music.play();
  //  The score
  score = 0;
  scoreString = 'Score : ';
  scoreText = game.add.text(600, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });
  // Notes
  notes = game.add.group();
  notes.enableBody = true;
  notes.setAll('outOfBoundsKill', true);
  notes.setAll('checkWorldBounds', true);
  notes.scale.setTo(0.25, 0.25);
  notes.z = -5;
  for (let i = 0; i < 500; i += 1) {
    const note = notes.create(
      269 + 280 * getRandomInt(0, 4),
      0 - i * 200 - 100 * getRandomInt(0, 5),
      'middle',
    );
    note.name = i;
    note.body.velocity.x = 0;
    note.body.velocity.y = 1300;
    note.body.setSize(60, 20, 0, -15);
  }
  keys = game.add.group();
  keys.enableBody = true;
  keyArr = [];
  for (let i = 0; i < 4; i += 1) {
    keyArr[i] = keys.create(60 + i * 70, 500, 'middleh');
    keyArr[i].scale.setTo(0.9, 1);
    keyArr[i].alpha = 0;
    keyArr[i].body.setSize(5, 30, 20, 0);
  }
}

function update() {
  // Check key states every frame.
  // Move ONLY one of the left and right key is hold.

  if (game.input.keyboard.isDown(window.Phaser.Keyboard.Z)) {
    keyArr[0].alpha = 1;
  } else {
    keyArr[0].alpha = 0;
  }
  if (game.input.keyboard.isDown(window.Phaser.Keyboard.X)) {
    keyArr[1].alpha = 1;
  } else {
    keyArr[1].alpha = 0;
  }
  if (game.input.keyboard.isDown(window.Phaser.Keyboard.C)) {
    keyArr[2].alpha = 1;
  } else {
    keyArr[2].alpha = 0;
  }
  if (game.input.keyboard.isDown(window.Phaser.Keyboard.V)) {
    keyArr[3].alpha = 1;
  } else {
    keyArr[3].alpha = 0;
  }
  //  Run collision
  game.physics.arcade.overlap(notes, keys, collisionHandler, null, this);
}

function render() {
  //   notes.forEach(game.debug.body, game.debug, true, 'green', true);
  //   keys.forEach(game.debug.body, game.debug, true, 'green', true);
}

function collisionHandler(note, key) {
  //  When a bullet hits an alien we kill them both
  if (key.alpha === 1) {
    note.kill();
  }

  //  Increase the score
  score += 20;
  scoreText.text = scoreString + score;

  //   //  And create an explosion :)
  //   const explosion = explosions.getFirstExists(false);
  //   explosion.reset(alien.body.x, alien.body.y);
  //   explosion.play('kaboom', 30, false, true);

  //   if (aliens.countLiving() == 0) {
  //     score += 1000;
  //     scoreText.text = scoreString + score;

  //     enemyBullets.callAll('kill', this);
  //     stateText.text = ' You Won, \n Click to restart';
  //     stateText.visible = true;

  //     // the "click to restart" handler
  //     game.input.onTap.addOnce(restart, this);
  //   }
}
