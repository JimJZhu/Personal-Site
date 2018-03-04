const acc = document.getElementsByClassName('accordion');
const request = require('browser-request');

$(document).ready(() => {
  let i;
  for (i = 0; i < acc.length; i += 1) {
    acc[i].addEventListener('click', function () {
      /* Toggle between adding and removing the "active" class,
          to highlight the button that controls the panel */
      this.classList.toggle('active');
      /* Toggle between hiding and showing the active panel */
      const panel = this.children[0];
      if (panel.style.display === 'block') {
        panel.style.setProperty('display', 'none');
        game.paused = true;
      } else {
        panel.style.setProperty('display', 'block', 'important');
        game.paused = true;
      }
    });
  }
  request('../assets/pdf/c1.txt', (er, res) => {
    // Parsing the text

    if (!er) {
      const body = res.body.split(/\.|\s|:/);
      const QUESTION_STATE = 0;
      const ANSWER_STATE_A = 1;
      const ANSWER_STATE_B = 2;
      const ANSWER_STATE_C = 3;
      const ANSWER_STATE_D = 4;
      const ANSWER_STATE_E = 5;
      const CORRECT_ANSWER_STATE = 6;
      const INITIAL_STATE = -1;
      const questions = [];
      let question = {};
      let questionNum = 1;
      let state = INITIAL_STATE;
      console.log(body);
      for (i = 0; i < body.length; i += 1) {
        const token = body[i];
        if (token.includes(`${questionNum})`)) {
          if (state !== INITIAL_STATE) {
            question.answer.e = question.answer.e.substr(0, question.answer.e.length - 8);
            if (question.answer.a) {
              questions.push(question);
              console.log(question);
            }
          }
          question = {
            id: questionNum,
            question: '',
            answer: {
              a: '',
              b: '',
              c: '',
              d: '',
              e: '',
              correct: '',
            },
          };
          questionNum += 1;
          state = QUESTION_STATE;
        } else if (token.includes('A)')) {
          state = ANSWER_STATE_A;
        } else if (token.includes('B)')) {
          state = ANSWER_STATE_B;
        } else if (token.includes('C)')) {
          state = ANSWER_STATE_C;
        } else if (token.includes('D)')) {
          state = ANSWER_STATE_D;
        } else if (token.includes('E)')) {
          state = ANSWER_STATE_E;
        } else if (token.substr(1) === 'Explanation') {
          state = CORRECT_ANSWER_STATE;
          console.log(token);
        }
        switch (state) {
          case QUESTION_STATE:
            question.question += `${token.match(/(\d{0,1}.*)/i)[1]} `;
            if (question.question.includes('A)B)')) {
              question.question = question.question.substr(10);
            }
            break;
          case ANSWER_STATE_A:
            question.answer.a += `${token} `;
            break;
          case ANSWER_STATE_B:
            question.answer.b += `${token} `;
            break;
          case ANSWER_STATE_C:
            question.answer.c += `${token} `;
            break;
          case ANSWER_STATE_D:
            question.answer.d += `${token} `;
            break;
          case ANSWER_STATE_E:
            question.answer.e += `${token} `;
            break;
          case CORRECT_ANSWER_STATE:
            question.answer.correct = `${token.substr(0, 1)}`;
            break;
          default:
            break;
        }
      }
      // Appending to screen
      const elem = $('#HRM');
      for (i = 0; i < questions.length; i += 1) {
        const q = questions[i];
        const content = document.createElement('div');
        const form = document.createElement('form');
        form.setAttribute('class', 'pure-form');
        const header = document.createElement('h3');
        header.innerHTML = q.question;
        form.appendChild(header);

        const aLabel = document.createElement('label');
        aLabel.setAttribute('for', 'radio');
        aLabel.setAttribute('class', 'pure-checkbox');
        const aCheckbox = document.createElement('input');
        aCheckbox.id = 'a';
        aCheckbox.type = 'radio';
        aCheckbox.name = 'radio';
        aCheckbox.value = 'a';
        aLabel.appendChild(aCheckbox);
        aLabel.innerHTML += q.answer.a;

        const bLabel = document.createElement('label');
        bLabel.setAttribute('for', 'radio');
        bLabel.setAttribute('class', 'pure-checkbox');
        const bCheckbox = document.createElement('input');
        bCheckbox.id = 'b';
        bCheckbox.type = 'radio';
        bCheckbox.name = 'radio';
        bCheckbox.value = 'b';
        bLabel.appendChild(bCheckbox);
        bLabel.innerHTML += q.answer.b;

        const cLabel = document.createElement('label');
        cLabel.setAttribute('for', 'radio');
        cLabel.setAttribute('class', 'pure-checkbox');
        const cCheckbox = document.createElement('input');
        cCheckbox.id = 'c';
        cCheckbox.type = 'radio';
        cCheckbox.name = 'radio';
        cCheckbox.value = 'c';
        cLabel.appendChild(cCheckbox);
        cLabel.innerHTML += q.answer.c;

        const eLabel = document.createElement('label');
        eLabel.setAttribute('for', 'radio');
        eLabel.setAttribute('class', 'pure-checkbox');
        const eCheckbox = document.createElement('input');
        eCheckbox.id = 'e';
        eCheckbox.type = 'radio';
        eCheckbox.name = 'radio';
        eCheckbox.value = 'e';
        eLabel.appendChild(eCheckbox);
        eLabel.innerHTML += q.answer.e;

        const dLabel = document.createElement('label');
        dLabel.setAttribute('for', 'radio');
        dLabel.setAttribute('class', 'pure-checkbox');
        const dCheckbox = document.createElement('input');
        dCheckbox.id = 'd';
        dCheckbox.type = 'radio';
        dCheckbox.name = 'radio';
        dCheckbox.value = 'd';
        dLabel.appendChild(dCheckbox);
        dLabel.innerHTML += q.answer.d;

        form.appendChild(aLabel);
        form.appendChild(bLabel);
        form.appendChild(cLabel);
        form.appendChild(dLabel);
        form.appendChild(eLabel);
        content.appendChild(form);
        elem.append(content);
      }
    } else {
      console.log('There was an error, but at least browser-request loaded and ran!');
      throw er;
    }
  });
});
window.PIXI = require('phaser/build/custom/pixi');
window.p2 = require('phaser/build/custom/p2');
window.Phaser = require('phaser/build/custom/phaser-split');

const game = new window.Phaser.Game(800, 600, window.Phaser.CANVAS, 'Mania', {
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
  // music.play();
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
}
