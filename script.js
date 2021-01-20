import anime from './animejs/lib/anime.es.js';
import enemies from './Enemies.js'

let containerWidth = 400;
let containerHeight = 850;


function scaleDrawArea(){
  let drawArea = document.querySelector('.drawArea');
  let heightOWindow = window.innerHeight;
  let heightOfDrawDrea = parseInt(getComputedStyle(drawArea).height);
  let scaleValue = (heightOWindow / heightOfDrawDrea).toFixed(3);
  drawArea.style.transform = `scale(${scaleValue})`;
}
scaleDrawArea();
window.addEventListener('resize',scaleDrawArea);

function startGeneratingEnemies(){
  anime({
    duration: 1000,
    loop: true,
    loopBegin(){
      generateEnemy();
    }
  })
}

function checkRocketsForStayingInGameArea(){
  console.log(rockets);
  for(let i in rockets){
    if((rockets[i].y + rockets[i].height) < 0){
      rockets.splice(i,1);
      break;
    }
  }
}

function checkColision(){
    for (let i = 0; i < rockets.length; i++){
      for(let j = 0; j < allEnemies.length; j++){
        let boxRocket = {
          position: [rockets[i].x, rockets[i].y],
          size: [rockets[i].width, rockets[i].height]
        }
        let boxEnemy = {
          position: [allEnemies[j].x, allEnemies[j].y],
          size: [allEnemies[j].width, allEnemies[j].height]
        }

        if(boxCollides(boxRocket.position, boxRocket.size, boxEnemy.position, boxEnemy.size)){
          rockets.splice(i,1);
          allEnemies.splice(j,1);
          explosions.push(new Explosion(boxEnemy.position));
          break;
        }
      }
    }
}


function collides(x, y, r, b, x2, y2, r2, b2) {
  return !(r <= x2 || x > r2 ||
           b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
  return collides(pos[0], pos[1],
                  pos[0] + size[0], pos[1] + size[1],
                  pos2[0], pos2[1],
                  pos2[0] + size2[0], pos2[1] + size2[1]);
}


let allEnemies = [];
function generateEnemy(){
  let enemiesKeysArray = Object.keys(enemies);
  let enemyKey = enemiesKeysArray[anime.random(0,enemiesKeysArray.length-1)];
  let enemy = enemies[enemyKey].call();
  enemy.x = anime.random(0 + enemy.width, canvasWidth - enemy.width);
  allEnemies.push(enemy);
}

function drawEnemies(){
  for(let i in allEnemies){
    allEnemies[i].move();
    allEnemies[i].draw(canvasContext);
  }
}


let canvas = document.querySelector('canvas');
let canvasContext = canvas.getContext('2d');
let canvasWidth = 400;
function setSizeForCanvas() {
    canvas.width = canvasWidth;
    canvas.height = containerHeight;
}

let rocketImage = new Image();
rocketImage.src = 'rocket.png';

function Rocket(){
  this.x = spaceship.x + spaceship.width /2 - 10;
  this.y = spaceship.y + 30;
  this.width = 15;
  this.height = 45;
  this.draw = function(){
    canvasContext.drawImage(rocketImage,this.x,this.y,this.width,this.height);
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

function launchRockets(){
  anime({
    duration: 500,
    loop: true,
    loopBegin(){
      rockets.push(new Rocket());
    }
  })
}


let img = new Image();
img.src = 'spaceShip.png';
let spaceship = {
  width: 70,
  height: 95, 
  x: containerWidth / 2 - 90 / 2,
  y: 1000,
  image: img,
  draw(){
    canvasContext.drawImage(this.image,this.x,this.y,this.width,this.height);
  },
  checkPotentialDirection(x,y){
    let potentiaRightSide = this.x + x + this.width;
    let potentiaLeftSide = this.x + x;
    return (potentiaLeftSide > 0 && potentiaRightSide < canvasWidth);
  },
  move(x,y){
    if(this.checkPotentialDirection(x,y)){
      this.x += x;
      this.y += y;
    }
  }
}

document.querySelector('.startScreen__button').addEventListener('click',startGame);

function startGame(){
  startGeneratingEnemies();
  hideStartScreen();
  showActionBackground();
  launchCanvasUpdate();
  startSpaceship();
  showGameInterface();
}

function showActionBackground(){
  anime({
    targets: '.actionBackground',
    opacity: 1,
    easing: 'easeInOutCubic',
    duration: 1500
  })
}

function startSpaceship(){
  anime({
    targets: spaceship,
    y: 650,
    duration: 1000,
    easing: 'easeOutQuad' 
  })
  setTimeout(launchRockets, 1000);
}

let explosionSprite = new Image();
explosionSprite.src = 'Images/Explosion.png';

function Explosion(position){
  this.position = position;
  this.size = [150,150];
  this.actualFrameColumn = 0;
  this.actualFrameRow = 0;
}

Explosion.prototype = {
  image: explosionSprite,
  draw(){
    canvasContext.drawImage(this.image,256*this.actualFrameColumn,248*this.actualFrameRow,256,248,
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

let explosions = [];

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

function launchCanvasUpdate(){
let render = anime({ 
    duration: 20,
    loop: true,
    loopBegin: function() {
      canvasContext.clearRect(0,0,canvas.width,canvas.height);
      moveRockets();
      drawRockets();
      spaceship.draw();
      drawEnemies();
      checkColision();
      drawExplosions();
      checkExplosionEnd();
      checkRocketsForStayingInGameArea();
    }
  });
}

function hideStartScreen(){
  anime({
    autoplay: true,
    targets: '.startScreen',
    opacity: 0,
    top: -200,
    easing: 'easeInOutCubic',
    duration: 1500,
    complete(){
      document.querySelector('.startScreen').style.visibility = 'hidden';
    }
  })
}

window.addEventListener('keydown', keyPress);
function keyPress (e){
    switch(e.code){
        case 'ArrowLeft': spaceship.move(-30,0); break;
        case 'ArrowRight': spaceship.move(30,0); break;
    }
}


setSizeForCanvas();
window.addEventListener('resize', setSizeForCanvas, false);

function gameButtonClick(e){
  if(e.currentTarget.dataset.direction == 'left'){
    spaceship.move(-30,0);
  }
  else{
    spaceship.move(30,0);
  }
}


let gameButtons = Array.from(document.querySelectorAll('.game-button'));
for(let i in gameButtons){
  gameButtons[i].addEventListener('mousedown',gameButtonClick);
}


function showGameInterface(){
  document.querySelector('.gameInterface').style.visibility = 'visible';
  anime({
    targets:'.gameInterface',
    opacity: 1,
    duration: 1000,
    easing: 'easeInOutExpo'
  })
}






