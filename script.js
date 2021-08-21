'use-strict';
// ///////////////////////////////////////////////////////////////////////////
const gameContainer = document.querySelector('.game-container');
const targetContainers = document.querySelectorAll('.target-container');
const svgWrappers = document.querySelectorAll('.svg-wrapper');
// ///////////////////////////////////////////////////////////////////////////
const startBtn = document.querySelector('.start');
const resetBtn = document.querySelector('.reset');
const rulesBtn = document.querySelector('.rules-and-info');
// ///////////////////////////////////////////////////////////////////////////
const hitsCount = document.querySelector('.hits-count');
const missesCount = document.querySelector('.misses-count');
const targetsCount = document.querySelector('.targets-count');
// //////////////////////////////////////////////////////////////////////////
const statsNumbers = document.querySelectorAll('.span-stats');
// //////////////////////////////////////////////////////////////////////////
const currentShot = document.querySelector('.current-shot');
const totalScore = document.querySelector('.total-score');
// ///////////////////////////////////////////////////////////////////////////
const ammoContainer = document.querySelector('.ammo');
// ///////////////////////////////////////////////////////////////////////////
const largeScore = document.querySelector('.large-score');
// //////////////////////////////////////////////////////////////////////////
const modalDiv = document.querySelector('.modal');
const closeModalSpan = document.querySelector('.close-modal');
// //////////////////////////////////////////////////////////////////////////

const gameData = {
  stateVar: false,
  isModalOpen: false,
  hits: 0,
  misses: 0,
  livesCount: 5,
  initialTotalScore: 0,
  appearedTargetsCount: 0,
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
  renderTotalRemainingLives(gameData.livesCount);
});

startBtn.addEventListener('click', e => {
  e.preventDefault();
  gameFlow();
});
resetBtn.addEventListener('click', e => {
  e.preventDefault();
  location.reload();
});
rulesBtn.addEventListener('click', e => {
  e.preventDefault();
  showModal();
});
window.addEventListener('keydown', e => {
  if (!gameData.isModalOpen) return;
  if (e.key === 'Escape') closeModal();
});
window.addEventListener('click', e => {
  if (!gameData.isModalOpen) return;
  if (e.target.classList.contains('overlay')) closeModal();
});

closeModalSpan.addEventListener('click', closeModal);
// ///////////////////////////////////////////////////////////////////////////
function closeModal() {
  modalDiv.classList.add('hidden');
  modalDiv.classList.remove('visible');
  modalDiv.style.zIndex = '-5';
  gameData.isModalOpen = false;
}
function showModal() {
  gameData.isModalOpen = true;
  modalDiv.classList.remove('hidden');
  modalDiv.classList.add('visible');
  modalDiv.style.zIndex = '10';
}
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

  if (e.target.id === '' || e.target.id === 'Layer_1') return;

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
    showTargetSound();
    domElement.children[0].style.visibility = 'visible';
    setTimeout(() => {
      domElement.children[0].style.visibility = 'hidden';
      gameData.appearedTargetsCount++;
      targetsCount.textContent = gameData.appearedTargetsCount;
    }, 1000);
  }
}
// ///////////////////////////////////////////////////////////////////////////
function gameFlow() {
  clearStatsFields();
  disableOtherButtons();
  introMusic();
  reloadGun();
  setTimeout(() => {
    gameData.stateVar = true;
    const startGame = setInterval(() => {
      showRandomTarget();
      if (!gameData.stateVar) clearInterval(startGame);
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
  const bullets = document.querySelectorAll('.bullet-img');
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
      enableOtherButtons();
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
  displayLargeScore(output);
  totalScore.textContent = total;
  currentShot.textContent = output;
}

function disableOtherButtons() {
  startBtn.style.pointerEvents = 'none';
  startBtn.style.cursor = 'default';
  rulesBtn.style.pointerEvents = 'none';
  rulesBtn.style.cursor = 'default';
}
function enableOtherButtons() {
  startBtn.style.pointerEvents = 'auto';
  startBtn.style.cursor = 'pointer';
  rulesBtn.style.pointerEvents = 'auto';
  rulesBtn.style.cursor = 'pointer';
}
function clearStatsFields() {
  gameData.hits = 0;
  gameData.misses = 0;
  gameData.initialTotalScore = 0;
  gameData.appearedTargetsCount = 0;
  statsNumbers.forEach(number => (number.textContent = 0));
}
function renderTotalRemainingLives(threshold) {
  const arr = Array.from({ length: threshold }, (_, i) => i + 1).reverse();
  return arr.map(el => {
    const html = `<img
  src="img/bullets/b-empty.png"
  alt="bullet"
  class="bullet-img img-${el}"
/>`;
    ammoContainer.insertAdjacentHTML('beforeend', html);
  });
}

function displayLargeScore(currentScore) {
  if (gameData.stateVar) {
    const color =
      currentScore === 1 || currentScore === 2
        ? 'white'
        : currentScore === 3 || currentScore === 4
        ? 'black'
        : currentScore === 5 || currentScore === 6
        ? 'blue'
        : currentScore === 7 || currentScore === 8
        ? 'red'
        : currentScore === 9 || currentScore === 10
        ? 'yellow'
        : 'green';
    largeScore.style.opacity = '1';
    largeScore.innerText = `${
      currentScore === 12
        ? `Bullseye ! + ${currentScore}`
        : currentScore === 0 || currentScore === 'Layer_1'
        ? 'MISS!'
        : `+ ${currentScore}`
    }`;
    largeScore.style.color = color;
    setTimeout(() => {
      largeScore.style.opacity = '0';
    }, 550);
  }
}
