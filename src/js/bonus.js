const request = require('browser-request');

let counter = 0;
const promises = [];
function requestChapter(chapter) {
  console.log(chapter);
  request(`../assets/pdf/c${chapter}.txt`, (er, res) => {
    // Parsing the text
    if (!er) {
      const body = res.body.split(/\.|\?|\s|:|A\)B\)C\)D\)E\)/);
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
      let questionsCorrect = 0;
      // console.log(body);
      let i;
      // parsing body
      for (i = 0; i < body.length; i += 1) {
        const token = body[i];
        if (token.includes(`${questionNum})`)) {
          if (state !== INITIAL_STATE) {
            // Cleaning the answers

            question.answer.e = question.answer.e.substr(0, question.answer.e.length - 8);
            question.answer.correct = question.answer.correct.substr(0, 1);
            if (question.answer.a) {
              // Excludes t/f
              questions.push(question);
              // console.log(question);
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
            question.answer.correct += `${token.substr(0, 1)}`;
            break;
          default:
            break;
        }
      }
      // Appending to screen
      // right/wrong function
      const change = function (e, value, correct) {
        if (e.prop('checked')) {
          if (correct.includes(value)) {
            e.parent().attr('class', 'correct');
          } else {
            e.parent().attr('class', 'incorrect');
          }
        } else {
          e.parent().attr('class', 'clean');
        }
        questionsCorrect = document.getElementById(panel.id).getElementsByClassName('correct').length;
        button.innerHTML = `Chapter ${chapter} Questions ${questionsCorrect}/${questions.length}`;
      };
      // Trigger all checkboxes
      const triggerAll = function (a, b, c, d, e) {
        $(`#${a.id}`).change();
        $(`#${b.id}`).change();
        $(`#${c.id}`).change();
        $(`#${d.id}`).change();
        $(`#${e.id}`).change();
      };
      // Make elements
      const button = document.createElement('button');
      button.setAttribute('class', 'accordion');
      button.innerHTML = `Chapter ${chapter} Questions ${questionsCorrect}/${questions.length}`;
      const panel = document.createElement('div');
      panel.setAttribute('class', 'panel survey');
      panel.id = `HRM${chapter}`;
      document.getElementById('HRM').appendChild(button);
      document.getElementById('HRM').appendChild(panel);
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
        aCheckbox.id = `a${chapter}_${i + 1}`;
        aCheckbox.type = 'radio';
        aCheckbox.name = 'radio';
        aCheckbox.value = 'A';
        aCheckbox.checked = false;
        aLabel.appendChild(aCheckbox);
        aLabel.innerHTML += q.answer.a;

        const bLabel = document.createElement('label');
        bLabel.setAttribute('for', 'radio');
        bLabel.setAttribute('class', 'pure-checkbox');
        const bCheckbox = document.createElement('input');
        bCheckbox.id = `b${chapter}_${i + 1}`;
        bCheckbox.type = 'radio';
        bCheckbox.name = 'radio';
        bCheckbox.value = 'B';
        bCheckbox.checked = false;
        bLabel.appendChild(bCheckbox);
        bLabel.innerHTML += q.answer.b;

        const cLabel = document.createElement('label');
        cLabel.setAttribute('for', 'radio');
        cLabel.setAttribute('class', 'pure-checkbox');
        const cCheckbox = document.createElement('input');
        cCheckbox.id = `c${chapter}_${i + 1}`;
        cCheckbox.type = 'radio';
        cCheckbox.name = 'radio';
        cCheckbox.value = 'C';
        cCheckbox.checked = false;
        cLabel.appendChild(cCheckbox);
        cLabel.innerHTML += q.answer.c;

        const eLabel = document.createElement('label');
        eLabel.setAttribute('for', 'radio');
        eLabel.setAttribute('class', 'pure-checkbox');
        const eCheckbox = document.createElement('input');
        eCheckbox.id = `e${chapter}_${i + 1}`;
        eCheckbox.type = 'radio';
        eCheckbox.name = 'radio';
        eCheckbox.value = 'E';
        eCheckbox.checked = false;
        eLabel.appendChild(eCheckbox);
        eLabel.innerHTML += q.answer.e;

        const dLabel = document.createElement('label');
        dLabel.setAttribute('for', 'radio');
        dLabel.setAttribute('class', 'pure-checkbox');
        const dCheckbox = document.createElement('input');
        dCheckbox.id = `d${chapter}_${i + 1}`;
        dCheckbox.type = 'radio';
        dCheckbox.name = 'radio';
        dCheckbox.value = 'D';
        dCheckbox.checked = false;
        dLabel.appendChild(dCheckbox);
        dLabel.innerHTML += q.answer.d;

        form.appendChild(aLabel);
        form.appendChild(bLabel);
        form.appendChild(cLabel);
        form.appendChild(dLabel);
        form.appendChild(eLabel);
        content.appendChild(form);
        panel.append(content);
        $(`#${aCheckbox.id}`).change(() => {
          change($(`#${aCheckbox.id}`), aCheckbox.value, q.answer.correct);
          $(`#${aCheckbox.id}`).prop('checked', false);
        });
        $(`#${bCheckbox.id}`).change(() => {
          change($(`#${bCheckbox.id}`), bCheckbox.value, q.answer.correct);
          $(`#${bCheckbox.id}`).prop('checked', false);
        });
        $(`#${cCheckbox.id}`).change(() => {
          change($(`#${cCheckbox.id}`), cCheckbox.value, q.answer.correct);
          $(`#${cCheckbox.id}`).prop('checked', false);
        });
        $(`#${dCheckbox.id}`).change(() => {
          change($(`#${dCheckbox.id}`), dCheckbox.value, q.answer.correct);
          $(`#${dCheckbox.id}`).prop('checked', false);
        });
        $(`#${eCheckbox.id}`).change(() => {
          change($(`#${eCheckbox.id}`), eCheckbox.value, q.answer.correct);
          $(`#${eCheckbox.id}`).prop('checked', false);
        });

        aLabel.addEventListener('click', () => {
          $(`#${aCheckbox.id}`).prop('checked', true);
          triggerAll(aCheckbox, bCheckbox, cCheckbox, dCheckbox, eCheckbox);
          $(`#${aCheckbox.id}`).prop('checked', true);
        }, false);
        bLabel.addEventListener('click', () => {
          $(`#${bCheckbox.id}`).prop('checked', true);
          triggerAll(aCheckbox, bCheckbox, cCheckbox, dCheckbox, eCheckbox);
          $(`#${bCheckbox.id}`).prop('checked', true);
        }, false);
        cLabel.addEventListener('click', () => {
          $(`#${cCheckbox.id}`).prop('checked', true);
          triggerAll(aCheckbox, bCheckbox, cCheckbox, dCheckbox, eCheckbox);
          $(`#${cCheckbox.id}`).prop('checked', true);
        }, false);
        dLabel.addEventListener('click', () => {
          $(`#${dCheckbox.id}`).prop('checked', true);
          triggerAll(aCheckbox, bCheckbox, cCheckbox, dCheckbox, eCheckbox);
          $(`#${dCheckbox.id}`).prop('checked', true);
        }, false);
        eLabel.addEventListener('click', () => {
          $(`#${eCheckbox.id}`).prop('checked', true);
          triggerAll(aCheckbox, bCheckbox, cCheckbox, dCheckbox, eCheckbox);
          $(`#${eCheckbox.id}`).prop('checked', true);
        }, false);
      }
    } else {
      console.log('There was an error, but at least browser-request loaded and ran!');
      throw er;
    }
    counter += 1;
    if (counter === 17) {
      // Set accordion buttons, shouldnt be in here, but works...
      let i;
      const acc = document.getElementsByClassName('accordion');
      for (i = 0; i < acc.length; i += 1) {
        console.log(i);
        acc[i].addEventListener('click', function () {
          /* Toggle between adding and removing the "active" class,
              to highlight the button that controls the panel */
          this.classList.toggle('active');
          /* Toggle between hiding and showing the active panel */
          const panel = this.nextSibling;
          if (panel.style.display === 'block') {
            panel.style.setProperty('display', 'none');
            game.paused = true;
          } else {
            panel.style.setProperty('display', 'block', 'important');
            game.paused = true;
          }
        });
      }
    }
  });
}
$(document).ready(() => {
  for (let chapter = 1; chapter <= 17; chapter += 1) {
    console.log(chapter);
    requestChapter(chapter);
  }
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
