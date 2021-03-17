window.addEventListener('resize',resizeCanvasContainerAndScaleContent);
window.addEventListener('load',resizeCanvasContainerAndScaleContent);

function resizeCanvasContainerAndScaleContent(){
  let ratio = 1 / 2;
  let height = window.innerHeight;
  let width = window.innerHeight * ratio;
  
  if (width > window.innerWidth){
    width = window.innerWidth;
    height = window.innerWidth / ratio;
  }

  $canvasContainer.style.height = `${height}px`;
  $canvasContainer.style.width = `${width}px`;

  

  let scaleValueForContent = height / $sizeOfContent.height;
  scaleContent(scaleValueForContent);
}


function scaleContent(value){
  let items = Array.from(document.querySelectorAll('.canvas-container > *'));
  for (let i in items){
    items[i].style.transform = `scale(${value})`;
  }
}

let $sizeOfContent = {
    width: 500,
    height: 1000,
  }

let $canvasContainer = document.querySelector('.canvas-container');

window.onload = addMainScript;

function addMainScript(){
    let body = document.querySelector('body');
    let script = document.createElement('script');
    script.type = 'module';
    script.src = 'script.js';
    body.append(script);
}
