//prettier-ignore
import { emptyGun, gunShot, introMusic, endGameTheme } from "./modules/audio.js";
//prettier-ignore
import { showModal, closeModal } from './modules/modal.js';
//prettier-ignore
import { displayScore, renderTotalRemainingLives, countHitsAndMisses, showBulletHole, reloadGun, showRandomTarget } from "./modules/view.js";

// ///////////////////////////////////////////////////////////////////////////
// Elements selection

export const gameContainer = document.querySelector('.game-container');
// ///////////////////////////////////////////////////////////////////////////
export const startBtn = document.querySelector('.start');
const resetBtn = document.querySelector('.reset');
export const rulesBtn = document.querySelector('.rules-and-info');
// ///////////////////////////////////////////////////////////////////////////
export const hitsCount = document.querySelector('.hits-count');
export const missesCount = document.querySelector('.misses-count');
export const targetsCount = document.querySelector('.targets-count');
// //////////////////////////////////////////////////////////////////////////
export const statsNumbers = document.querySelectorAll('.span-stats');
// //////////////////////////////////////////////////////////////////////////
export const currentShot = document.querySelector('.current-shot');
export const totalScore = document.querySelector('.total-score');
// ///////////////////////////////////////////////////////////////////////////
export const ammoContainer = document.querySelector('.ammo');
// ///////////////////////////////////////////////////////////////////////////
export const largeScore = document.querySelector('.large-score');
// //////////////////////////////////////////////////////////////////////////
export const modalDiv = document.querySelector('.modal');
// //////////////////////////////////////////////////////////////////////////

// Main helper object for storing game data
export const gameData = {
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
// Event listeners
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
// Borrowed code, Knuth shuffle algorithm
export function shuffle(array) {
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
// Disable Start and Rules buttons
export function disableOtherButtons() {
  startBtn.style.pointerEvents = 'none';
  startBtn.style.cursor = 'default';
  rulesBtn.style.pointerEvents = 'none';
  rulesBtn.style.cursor = 'default';
}
// Reset and clear fields and data
export function clearStatsFields() {
  gameData.hits = 0;
  gameData.misses = 0;
  gameData.initialTotalScore = 0;
  gameData.appearedTargetsCount = 0;
  gameData.skippedTargets = 0;
  statsNumbers.forEach(number => (number.textContent = 0));
  largeScore.textContent = '';
  largeScore.style.opacity = '0';
}
// ///////////////////////////////////////////////////////////////////////////

// Enable buttons for click event
export function enableOtherButtons() {
  startBtn.style.pointerEvents = 'auto';
  startBtn.style.cursor = 'pointer';
  rulesBtn.style.pointerEvents = 'auto';
  rulesBtn.style.cursor = 'pointer';
}
// Render end game message
export function showEndGameMessage() {
  endGameTheme.play();
  largeScore.style.opacity = '1';
  largeScore.textContent = `Game Over Cowboy!`;
}
// ///////////////////////////////////////////////////////////////////////////

// Function that starts the game, called on Start button
function gameFlow() {
  clearStatsFields();
  disableOtherButtons();
  introMusic();
  reloadGun();
  // If game is started again before end music theme has ended
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
// ////////////////////////////////////////////////////////////////////////
function countSkippedTargets(fn, shownTargets) {
  if (shownTargets > fn) {
    gameData.skippedTargets += 1;
    console.log(gameData.skippedTargets);
  } // check every 5-10 targets if the number of appeared targets are larger than gameData.totalHits()
  // if (gameData.skippedTargets === gameData.skippedTargetsLimit) {
  //   gameData.stateVar = false;
  //   showEndGameMessage();
  //   setTimeout(() => {
  //     additionalEndMessage();
  //   }, 1500);
  //   enableOtherButtons();
  // }
}
// function additionalEndMessage() {
//   largeScore.style.opacity = '1';
//   largeScore.style.fontSize = '2.5rem';
//   largeScore.textContent = `You Skipped ${gameData.skippedTargetsLimit} Targets!`;
// }
