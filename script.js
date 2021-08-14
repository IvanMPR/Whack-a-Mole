'use-strict';
// ///////////////////////////////////////////////////////////////////////////
const gameContainer = document.querySelector('.game-container');
const targetContainers = document.querySelectorAll('.target-container');
const svgWrappers = document.querySelectorAll('.svg-wrapper');
// ///////////////////////////////////////////////////////////////////////////
const startBtn = document.querySelector('.start');
const resetBtn = document.querySelector('.reset');
// ///////////////////////////////////////////////////////////////////////////
let stateVar = false;
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
// ///////////////////////////////////////////////////////////////////////////

gameContainer.addEventListener('click', function () {
  return !stateVar ? emptyGun() : gunShot();
});
gameContainer.addEventListener('click', e => {
  console.log(e.target.id);
  showBulletHole(e);
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
  }, 200);
}
// ///////////////////////////////////////////////////////////////////////////

function showRandomTarget() {
  const targetPositions = [
    'center',
    'center-left',
    'center-right',
    'bottom-left',
    'bottom-right',
    'top-left',
    'top-right',
  ];
  const domElement = document.querySelector(`.${shuffle(targetPositions)[0]}`);
  // console.log(domElement.children);
  domElement.children[0].style.visibility = 'visible';
  setTimeout(() => {
    domElement.children[0].style.visibility = 'hidden';
  }, 1000);
}
// ///////////////////////////////////////////////////////////////////////////
function gameFlow() {
  stateVar = true;
  const startGame = setInterval(() => {
    showRandomTarget();
    if (!stateVar) clearInterval(startGame);
  }, 1500);
}
// ///////////////////////////////////////////////////////////////////////////

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
