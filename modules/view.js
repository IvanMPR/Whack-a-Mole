//prettier-ignore
import { shuffle, gameData, largeScore, hitsCount, totalScore, currentShot, missesCount, targetsCount, gameContainer, ammoContainer, enableOtherButtons, showEndGameMessage, countSkippedTargets, increaseGameSpeed } from "../script.js";
// prettier-ignore
import { gunReloadSound, showTargetSound } from "./audio.js";
// prettier-ignore
import { injectTarget } from "./svg_target.js";
// Function for displaying large font score after every shot
export function displayLargeScore(currentScore) {
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
// Count score
export function countHitsAndMisses(e) {
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
// Render remaining number of lives with corresponding number of shiny bullets
export function remainingLives(num) {
  const path = 'img/bullets/b-empty.png';
  const image = document.querySelector(`.img-${num}`);
  image.setAttribute('src', path);
}
// Render bullet hole image on cursor click location
export function showBulletHole(e) {
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
// Fill empty bullet images with shiny bullets images (restart lives) with reload sound
export function reloadGun() {
  const bullets = document.querySelectorAll('.bullet-img');
  const path = 'img/bullets/Bullet.png';
  bullets.forEach(bullet => {
    bullet.setAttribute('src', path);
  });
  gunReloadSound();
}
// Display random target
export function showRandomTarget() {
  if (gameData.stateVar) {
    // Possible target locations
    const targetPositions = [
      'center',
      'center-left',
      'center-right',
      'bottom-left',
      'bottom-right',
      'top-left',
      'top-right',
    ];
    // Pick target location after shuffling them
    const domElement = document.querySelector(
      `.${shuffle(targetPositions)[0]}`
    );
    // Insert target in domElement
    injectTarget(domElement);
    // Play swoosh sound
    showTargetSound();
    // Make target appear
    domElement.children[0].style.visibility = 'visible';
    setTimeout(() => {
      // Hide target after timeout value
      domElement.children[0].style.visibility = 'hidden';

      // Delete target from domElement after displaying it and hiding
      domElement.innerHTML = '';
      // Increase stats
      gameData.appearedTargetsCount += 1;
      // Count if target appeared without being shot at
      countSkippedTargets(gameData.appearedTargetsCount, gameData.totalHits());
      // Check if the condition is met for game speed to be increased
      increaseGameSpeed(gameData.appearedTargetsCount);
      // Increase stats
      targetsCount.textContent = gameData.appearedTargetsCount;
      // Timeout amount in ms defined in gameData helper object, decreased every 10 targets
    }, gameData.showRandomTargetTimeoutValue);
  } else {
    showEndGameMessage();
  }
}
// Read current shot location on target and update score accordingly
export function displayScore(e) {
  const score = e.target.id.split('-').pop();
  const output = score === '' ? 0 : score === 'Layer_1' ? 0 : +score;
  const total = (gameData.initialTotalScore += output);
  // Render output values
  displayLargeScore(output);
  totalScore.textContent = total;
  currentShot.textContent = output;
}
// Read number of lives from gameData.livesCount and create appropriate number of shiny bullet images(lives)
// This function is called on game start
export function renderTotalRemainingLives(threshold) {
  // Array is reversed in order to render lost lives from right bullet imgs to left bullet imgs
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
