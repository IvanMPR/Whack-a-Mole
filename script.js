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
// //////////////////////////////////////////////////////////////////////////

const gameData = {
  stateVar: false,
  isModalOpen: false,
  hits: 0,
  misses: 0,
  livesCount: 5,
  initialTotalScore: 0,
  appearedTargetsCount: 0,
  skippedTargets: 0,
  skippedTargetsLimit: 5,
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
const endGameTheme = new Audio(
  'sounds/175149__minigunfiend__western-brooding-01.wav'
);

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

// ///////////////////////////////////////////////////////////////////////////
function closeModal() {
  modalDiv.innerHTML = '';
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

  const html = `<div class="overlay">
  <div class="modal-box">
    <span class="close-modal">&times;</span>
    <h2 class="modal-title">Hello!</h2>
    <p class="first paragraph">
      It is pretty obvious that inspiration for this project came from
      well known
      <a
        href="https://youtu.be/nANNPAlR2Z4?t=23"
        target="_blank"
        class="youTube-link"
        >'Whack a Mole'</a
      >
      original game. As I began developing, I decided to use as much as
      possible of my personal graphic resources, such as
      <a
        href="https://www.shutterstock.com/image-vector/archery-target-vector-illustration-1239642031"
        class="youTube-link"
        target="_blank"
        >target images</a
      >,
      <a
        href="https://www.shutterstock.com/image-vector/illustration-randomly-grouped-bullet-holes-pierced-1684976872"
        class="youTube-link"
        target="_blank"
        >bullet holes images</a
      >, bullets images, targets x-marks,<a
        href="https://www.shutterstock.com/image-illustration/set-fifteen-red-cross-hairs-bullet-138385712"
        class="youTube-link"
        target="_blank"
        >crosshair image</a
      >
      etc.
    </p>
    <p class="second paragraph">
      Even though this game could be significantly improved by adding
      extra functionality, such as levels, various choices and options for
      user...I rather kept it simple in order to save a valuable time,
      time I'd rather spend building another project and learning and
      practicing new JavaScript skills, as this one in my opinion
      fulfilled it's purpose.
    </p>
    <h2 class="modal-title">Rules</h2>
    <p class="third paragraph">
      Click on the Start button, and after short music intro, targets will
      appear randomly on their spots. Earned points depends on your
      precision. 'Green' circle is 'Bullseye', and it brings 12 points. As
      you progress, targets will appear with progressing speed. Every time
      you miss, you lose one life. Number of lives is represented by
      number of shiny bullets left.
    </p>
    <p class="fourth paragraph">
      Press <kbd>Esc</kbd> button, click <span class="x">X</span> in the
      upper right corner or anywhere outside this window to leave.
      <span class="x">Enjoy</span> the game.
    </p>
  </div>
</div>`;

  modalDiv.insertAdjacentHTML('beforeend', html);

  const closeModalSpan = document.querySelector('.close-modal');
  closeModalSpan.addEventListener('click', closeModal);
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
      gameData.appearedTargetsCount += 1;
      targetsCount.textContent = gameData.appearedTargetsCount;
      // countSkippedTargets(gameData.totalHits(), gameData.appearedTargetsCount);
    }, 1000);
  } else {
    showEndGameMessage();
  }
}
// ///////////////////////////////////////////////////////////////////////////
function gameFlow() {
  clearStatsFields();
  disableOtherButtons();
  introMusic();
  reloadGun();
  endGameTheme.pause();
  endGameTheme.currentTime = 0;
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
    gameData.misses += 1;
    missesCount.textContent = gameData.misses;
    // Render lost life
    remainingLives(gameData.misses);
    // If all lives are lost
    if (gameData.misses === gameData.livesCount) {
      gameData.stateVar = false;
      enableOtherButtons();
    }
  } else {
    gameData.hits += 1;
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
  gameData.skippedTargets = 0;
  statsNumbers.forEach(number => (number.textContent = 0));
  largeScore.textContent = '';
  largeScore.style.opacity = '0';
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
function showEndGameMessage() {
  endGameTheme.play();
  largeScore.style.opacity = '1';
  largeScore.textContent = `Game Over Cowboy!`;
}
function additionalEndMessage() {
  largeScore.style.opacity = '1';
  largeScore.style.fontSize = '2.5rem';
  largeScore.textContent = `You Skipped ${gameData.skippedTargetsLimit} Targets!`;
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
    const timer = setTimeout(() => {
      largeScore.style.opacity = '0';
    }, 550);
    if (!gameData.stateVar) clearTimeout(timer);
  }
}
// function countSkippedTargets(fn, shownTargets) {
//   if (shownTargets > fn) {
//     gameData.skippedTargets += 1;
//     console.log(gameData.skippedTargets);
//   }
//   if (gameData.skippedTargets === gameData.skippedTargetsLimit) {
//     gameData.stateVar = false;
//     showEndGameMessage();
//     setTimeout(() => {
//       additionalEndMessage();
//     }, 1500);
//     enableOtherButtons();
//   }
// }
