let pathToImages = 'Images/Enemies/';
let images = {
    striker: initImage(`${pathToImages}Striker.png`),
    knife: initImage(`${pathToImages}Knife.png`),
    hunter: initImage (`${pathToImages}Hunter.png`)
}

let object = { 
    Knife(){return new Enemy([83,96],`knife`)},
    Striker(){return new Enemy([80,88],`striker`)},
    Hunter(){return new Enemy([85,79],`hunter`)},
}

function Enemy (size,type){
    this.x = 0;
    this.y = -60;
    this.width = size[0];
    this.height = size[1];
    this.image = images[type];
}

Enemy.prototype = {
    move(speed){
        this.y += speed;
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
