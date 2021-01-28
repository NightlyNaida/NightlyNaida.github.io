let pathToImages = 'Images/Enemies/';
let object = { 
    Knife(){return new Enemy([83,96],`${pathToImages}Knife.png`)},
    Striker(){return new Enemy([80,88],`${pathToImages}Striker.png`)},
    Hunter(){return new Enemy([85,79],`${pathToImages}Hunter.png`)},
}

function Enemy (size,image){
    this.x = 0;
    this.y = -60;
    this.width = size[0];
    this.height = size[1];
    this.image = initImage(image);
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
