import anime from './animejs/lib/anime.es.js';

let pathToImages = 'Images/Enemies/';
let object = { 
    Bob(){return new Enemy([60,68],`${pathToImages}Bob.png`,1)},
    Cucumber(){return new Enemy([55,63],`${pathToImages}Cucumber.png`,2)},
    DoubleShit(){return new Enemy([55,57],`${pathToImages}DoubleShit.png`,2)},
    Knife(){return new Enemy([53,41],`${pathToImages}Knife.png`,3)},
    Liquid(){return new Enemy([60,62],`${pathToImages}Liquid.png`,2)},
    NoDeathStar(){return new Enemy([80,82],`${pathToImages}NoDeathStar.png`,1)},
    Smol(){return new Enemy([45,47],`${pathToImages}Smol.png`,3)},
}

function Enemy (size,image,speed){
    this.x = 0;
    this.y = -60;
    this.width = size[0];
    this.height = size[1];
    this.image = initImage(image);
    this.speed = speed;
    // this.ammunition = ammunition;
    // this.rateOfFire = rateOfFire
}

Enemy.prototype = {
    move(){
        this.y += this.speed;
    },
    draw(context){
        context.drawImage(this.image,this.x,this.y,this.width,this.height);
    }
}

function initImage(url){
    let img = new Image();
    img.src = url;
    return img;
}

export default object;
