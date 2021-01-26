import enemies from './Enemies.js';
import spaceship from './spaceship.js';
import timer from './timer.js';


let $sizeOfContent = {
  width: 500,
  height: 1000,
}
spaceship.moveToCenter($sizeOfContent.width);
let $canvasContainer = document.querySelector('.canvas-container');
let $canvas = document.querySelector('canvas');
let $canvasContext = $canvas.getContext('2d');
let $timer = null;
let isWin = true;

window.addEventListener('resize',resizeCanvasContainerAndScaleContent);
window.addEventListener('load',resizeCanvasContainerAndScaleContent);

function resizeCanvasContainerAndScaleContent(){
  let ratio = 1 / 2;
  $canvasContainer.style.height = `${window.innerHeight}px`;
  $canvasContainer.style.width = `${window.innerHeight * ratio}px`;

  let scaleValueForContent = window.innerHeight / $sizeOfContent.height;
  scaleContent(scaleValueForContent);
}


function scaleContent(value){
  let items = Array.from(document.querySelectorAll('.canvas-container > *'));
  for (let i in items){
    items[i].style.transform = `scale(${value})`;
  }
}


function stopGame(){
  clearInterval($timer);
  if(isWin){
    setWinFinishScreen();
  }
  else{
    setLoseFinishScreen();
  }
  canvasAnimationController.restart();
  gameControlAnimationController.restart();
  actionBackgroundAnimationController.restart();
  canvasRepaintController.pause();
  enemyGenerator.pause();
  finishScreenAnimationController.restart();
  rocketsGenerator.pause();
}

function restartGame(){
  finishScreenAnimationController.restart();
  startGame();
}

function startGame(){
  allEnemies = [];
  rockets = [];
  explosions = [];
  $canvasContext.clearRect(0,0,$sizeOfContent.width,$sizeOfContent.height);
  canvasAnimationController.restart();
  gameControlAnimationController.restart();
  actionBackgroundAnimationController.restart();
  spawnSpaceshipAndLaunchRockets();
  canvasRepaintController.restart();
  enemyGenerator.restart();
  var deadline = new Date(Date.parse(new Date()) + 60 * 1000);
  $timer = timer('timer', deadline, stopGame);
  speedOfEnemies = 1;
}

let startScreenAnimationController = anime({
  autoplay: false,
  targets: '.startScreen',
  easing: 'easeInOutCubic',
  top: -200,
  opacity: 0,
  duration: 1500,
  complete(){
    this.reverse();
  }
})

let finishScreenAnimationController = anime({
  autoplay: false,
  targets: '.finish-screen',
  easing: 'easeInOutCubic',
  top: 0,
  opacity: 1,
  duration: 1500,
  complete(){
    this.reverse();
  }
})


let gameControlAnimationController = anime({
  autoplay: false,
  targets:'.gameInterface',
  opacity: 1,
  duration: 1000,
  easing: 'easeInOutExpo',
  complete(){
    this.reverse();
  }
});

let actionBackgroundAnimationController = anime({
  autoplay: false,
  targets: '.actionBackground',
  opacity: 1,
  easing: 'easeInOutCubic',
  duration: 1500,
  complete(){
    this.reverse();
  }
})

let canvasAnimationController = anime({
  autoplay: false,
  targets: '.action',
  opacity: 1,
  easing: 'easeInOutCubic',
  duration: 1500,
  complete(){
    this.reverse();
  }
})

let spaceShipSpawnAnimationController = anime({
  autoplay: false,
  targets: spaceship,
  y: $canvas.height - 95 - 200,
  duration: 1000,
  easing: 'easeOutQuad'
})



function spawnSpaceshipAndLaunchRockets(){
  spaceship.y = 1200;
  spaceShipSpawnAnimationController.restart();
  setTimeout(function(){rocketsGenerator.restart();},1000);
}

let canvasRepaintController = anime({
    autoplay: false, 
    duration: 10,
    loop: true,
    loopBegin: function() {
      $canvasContext.clearRect(0,0,$sizeOfContent.width,$sizeOfContent.height);
      moveRockets();
      moveEnemies();
      checkRocketsForStayingInGameArea();
      drawRockets();
      drawEnemies();
      checkColision();
      spaceship.draw($canvasContext); 
      drawExplosions();
      checkExplosionEnd();
      speedOfEnemies += 0.002;
    }
});


let allEnemies = [];

let enemyGenerator = 
  anime({
    autoplay: false,
    duration: 1200,
    loop: true,
    loopBegin(){
      generateEnemy();
    }
})


function generateEnemy(){
  let enemiesKeysArray = Object.keys(enemies);
  let enemyKey = enemiesKeysArray[anime.random(0,enemiesKeysArray.length-1)];
  let enemy = enemies[enemyKey].call();
  enemy.x = anime.random(0 + enemy.width, $canvas.width - enemy.width);
  allEnemies.push(enemy);
}

let speedOfEnemies = 1;
function moveEnemies(){
  for(let i in allEnemies){
    allEnemies[i].move(speedOfEnemies);
  }
}

function drawEnemies(){
  for(let i in allEnemies){
    allEnemies[i].draw($canvasContext);
  }
}

let rocketImage = new Image();
rocketImage.src = './Images/rocket.png';
function Rocket(){
  this.x = spaceship.x + spaceship.width / 2;
  this.y = spaceship.y + 30;
  this.width = 15;
  this.height = 35
  ;
  this.image = rocketImage;
  this.draw = function(){
    $canvasContext.drawImage(this.image,this.x,this.y,this.width,this.height);
  }
}
let rockets = [];


function moveRockets(){
  let speed = 5;
  for(let i in rockets){
    rockets[i].y -= speed;
  }
}

function drawRockets(){
  for(let i in rockets){
    rockets[i].draw();
  }
}


let rocketsGenerator = anime({
  autoplay: false,
  duration:500,
  loop: true,
  loopComplete(){
    rockets.push(new Rocket());
  }
})


function checkRocketsForStayingInGameArea(){
  for(let i in rockets){
    if((rockets[i].y + rockets[i].height) < 0){
      rockets.splice(i,1);
      break;
    }
  }
}

function checkColision(){
  for(let i in allEnemies){
    if (allEnemies[i].y + allEnemies[i].height > $sizeOfContent.height){
      isWin = false;
      stopGame();
      break;
    }
  }

  for (let i = 0; i < allEnemies.length; i++){
    for(let j = 0; j < rockets.length; j++){
      let boxEnemy = {
        position: [allEnemies[i].x, allEnemies[i].y],
        size: [allEnemies[i].width, allEnemies[i].height]
      }
      let boxRocket = {
        position: [rockets[j].x, rockets[j].y],
        size: [rockets[j].width, rockets[j].height]
      }

      if(boxCollides(boxEnemy.position,boxEnemy.size,[spaceship.x,spaceship.y],[spaceship.width,spaceship.height])){
        explosions.push(new Explosion([spaceship.x,spaceship.y]));
        isWin = false;
        clearInterval($timer);
        setTimeout(stopGame,1000);
        break;
      }

      if(boxCollides(boxRocket.position, boxRocket.size, boxEnemy.position, boxEnemy.size)){
        allEnemies.splice(i,1);
        rockets.splice(j,1);
        explosions.push(new Explosion(boxEnemy.position));
        break;
      }
    }
  }
}

function boxCollides(pos, size, pos2, size2) {
return collides(pos[0], pos[1],
                pos[0] + size[0], pos[1] + size[1],
                pos2[0], pos2[1],
                pos2[0] + size2[0], pos2[1] + size2[1]);
}

function collides(x, y, r, b, x2, y2, r2, b2) {
  return !(r <= x2 || x > r2 ||
           b <= y2 || y > b2);
}


function setWinFinishScreen(){
  let mainCaption = document.querySelector('.finish-screen__caption');
  let text = document.querySelector('.finish-screen__text');

  mainCaption.innerText = 'Круто!';
  text.innerText = 'Да ты прирожденный чемпион. Забирай фрибет и побеждай на Олимпе!';
}

function setLoseFinishScreen(){
  let mainCaption = document.querySelector('.finish-screen__caption');
  let text = document.querySelector('.finish-screen__text');

  mainCaption.innerText = 'Поражение';
  text.innerHTML = 'Как сказал мудрец:<br><i>«Не повезло в мини-игре, повезёт в ставках на спорт...».</i><br>Забирай фрибет и побеждай на Олимпе!';
}

let explosionSprite = new Image();
explosionSprite.src = 'Images/Explosion.png';
let explosions = [];

function Explosion(position){
  this.position = position;
  this.size = [150,150];
  this.actualFrameColumn = 0;
  this.actualFrameRow = 0;
}

Explosion.prototype = {
  image: explosionSprite,
  draw(){
    $canvasContext.drawImage(this.image,100*this.actualFrameColumn,96.8*this.actualFrameRow,100,96.8,
                            this.position[0] - this.size[0] / 2,this.position[1],this.size[0],this.size[1]);
    if(this.actualFrameColumn < 7){
      this.actualFrameColumn++;
    }
    else if(this.actualFrameRow < 5){
      this.actualFrameColumn = 0;
      this.actualFrameRow ++; 
    }
  }
}

function drawExplosions(){
  for(let i in explosions){
    explosions[i].draw();
  }
}
function checkExplosionEnd(){
  for(let i in explosions){
    if (explosions[i].actualFrameRow == 5 && explosions[i].actualFrameColumn == 7){
      explosions.splice(i,1);
    }
  }
}

window.addEventListener('keydown', keyPress);
function keyPress (e){
    switch(e.code){
        case 'ArrowLeft': spaceship.move(-30,0,$sizeOfContent.width); break;
        case 'ArrowRight': spaceship.move(30,0,$sizeOfContent.width); break;
    }
}

document.querySelector('.startScreen__button').addEventListener('click',function(){
  startScreenAnimationController.restart();
  startGame();
});

function gameButtonClick(e){
  if(e.currentTarget.dataset.direction == 'left'){
    spaceship.move(-30,0,$sizeOfContent.width);
  }
  else{
    spaceship.move(30,0,$sizeOfContent.width);
  }
}

let gameButtons = Array.from(document.querySelectorAll('.game-button'));
for(let i in gameButtons){
  gameButtons[i].addEventListener('mousedown',gameButtonClick);
}

function openBonusSite(){
  document.location.href = 'https://www.olimp.bet/welcome_bonus/';
}

document.querySelector('#restart').addEventListener('click',restartGame);
document.querySelector('#freebet').addEventListener('click',openBonusSite);









