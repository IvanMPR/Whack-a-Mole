'use-strict';
// ///////////////////////////////////////////////////////////////////////////
const gameContainer = document.querySelector('.game-container');
const targetContainers = document.querySelectorAll('.target-container');
const svgWrappers = document.querySelectorAll('.svg-wrapper');
// ///////////////////////////////////////////////////////////////////////////
const startBtn = document.querySelector('.start');
const resetBtn = document.querySelector('.reset');
// ///////////////////////////////////////////////////////////////////////////
const bullets = document.querySelectorAll('.bullet-img');
// ///////////////////////////////////////////////////////////////////////////
const hitsCount = document.querySelector('.hits-count');
const missesCount = document.querySelector('.misses-count');
// //////////////////////////////////////////////////////////////////////////
const currentShot = document.querySelector('.current-shot');
const totalScore = document.querySelector('.total-score');
// ///////////////////////////////////////////////////////////////////////////
const gameData = {
  stateVar: false,
  hits: 0,
  misses: 0,
  livesCount: 7,
  initialTotalScore: 0,
  totalHits() {
    return this.hits + this.misses;
  },
};
// ///////////////////////////////////////////////////////////////////////////
const emptyGun = function () {
  const tone = new Audio('sounds/543928__eminyildirim__pistol-gun-trigger.wav');
  return tone.play();
};
const gunShot = function () {
  const tone = new Audio('sounds/376060__morganpurkis__mouth-gun.wav');
  return tone.play();
};
const introMusic = function () {
  const tone = new Audio('sounds/124454__juskiddink__western-themetune.wav');
  return tone.play();
};
const gunReloadSound = function () {
  const tone = new Audio('sounds/396331__nioczkus__1911-reload.wav');
  return tone.play();
};
const showTargetSound = function () {
  const tone = new Audio('sounds/60013__qubodup__whoosh_show_target.wav');
  return tone.play();
};
const removeTargetSound = function () {
  const tone = new Audio('sounds/391952__ssierra1202__swing_remove_target.wav');
  return tone.play();
};

// ///////////////////////////////////////////////////////////////////////////

gameContainer.addEventListener('click', function () {
  return !gameData.stateVar ? emptyGun() : gunShot();
});
gameContainer.addEventListener('click', e => {
  console.log(e.target.id);
  showBulletHole(e);
  countHitsAndMisses(e);
  displayScore(e);
});

window.addEventListener('load', function () {
  svgWrappers.forEach(wrapper => {
    wrapper.style.visibility = 'hidden';
  });
});

startBtn.addEventListener('click', gameFlow);
resetBtn.addEventListener('click', () => location.reload());
// ///////////////////////////////////////////////////////////////////////////

function showBulletHole(e) {
  const randomNum = Math.floor(Math.random() * 8 + 1);
  const x = e.clientX;
  const y = e.clientY;
  const source = `img/bullets/bullet${randomNum}.png`;

  const bulletHoleImg = document.createElement('img');
  bulletHoleImg.style.position = 'absolute';
  bulletHoleImg.style.transform = 'translate(-50%, -50%)';
  bulletHoleImg.style.width = '0.75vw';
  bulletHoleImg.setAttribute('src', source);
  bulletHoleImg.style.left = `${x}px`;
  bulletHoleImg.style.top = `${y}px`;

  if (e.target.id === '') return;

  gameContainer.appendChild(bulletHoleImg);
  setTimeout(() => {
    bulletHoleImg.parentNode.removeChild(bulletHoleImg);
  }, 300);
}
// ///////////////////////////////////////////////////////////////////////////

function showRandomTarget() {
  if (gameData.stateVar) {
    const targetPositions = [
      'center',
      'center-left',
      'center-right',
      'bottom-left',
      'bottom-right',
      'top-left',
      'top-right',
    ];
    const domElement = document.querySelector(
      `.${shuffle(targetPositions)[0]}`
    );
    removeTargetSound();
    domElement.children[0].style.visibility = 'visible';
    setTimeout(() => {
      domElement.children[0].style.visibility = 'hidden';
    }, 1000);
  }
}
// ///////////////////////////////////////////////////////////////////////////
function gameFlow() {
  introMusic();
  reloadGun();
  setTimeout(() => {
    gameData.stateVar = true;
    const startGame = setInterval(() => {
      showRandomTarget();
    }, 1500);
  }, 5000);
}

// ///////////////////////////////////////////////////////////////////////////
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  //While there remain elements to shuffle...
  while (0 !== currentIndex) {
    //Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    //And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function reloadGun() {
  const path = 'img/bullets/Bullet.png';
  bullets.forEach(bullet => {
    bullet.setAttribute('src', path);
  });
  gunReloadSound();
}

function countHitsAndMisses(e) {
  if (!gameData.stateVar) return;
  if (e.target.id === '' || e.target.id === 'Layer_1') {
    gameData.misses++;
    missesCount.textContent = gameData.misses;
    remainingLives(gameData.misses);

    if (gameData.misses === gameData.livesCount) {
      gameData.stateVar = false;
    }
  } else {
    gameData.hits++;
    hitsCount.textContent = gameData.hits;
  }
}

function remainingLives(num) {
  const path = 'img/bullets/b-empty.png';
  const image = document.querySelector(`.img-${num}`);
  image.setAttribute('src', path);
}

function displayScore(e) {
  const score = e.target.id.split('-').pop();
  const output = score === '' ? 0 : score === 'Layer_1' ? 0 : +score;

  const total = (gameData.initialTotalScore += output);

  totalScore.textContent = total;
  currentShot.textContent = output;
}
