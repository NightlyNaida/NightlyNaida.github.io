let img = new Image();
img.src = 'Images/spaceship.png';

let spaceship = {
  width: 70,
  height: 121, 
  x: 0,
  y: 1000,
  image: img,
  draw(canvasContex){
    jetTrace.draw(canvasContex);
    canvasContex.drawImage(this.image,this.x,this.y,this.width,this.height);
  },
  move(x,y,widthOfCanvas){
    let potentialPosition = x + this.x; 
    if(potentialPosition <= widthOfCanvas-this.width && potentialPosition >= 0){
      this.x += x;
      this.y += y;
    }
  },
  moveToCenter(width){
    this.x = width / 2 - this.width / 2;
  }
}



let jetTraceImg = new Image();
jetTraceImg.src = 'Images/jetTrace.png';
let jetTrace = {
  width: 40,
  height: 49,
  columnWidth: 125,
  rowHeight: 151,
  actualColumn: 0,
  actualRow: 0,
  draw(context){
    context.drawImage(jetTraceImg,this.columnWidth * this.actualColumn, this.rowHeight * this.actualRow,
                      this.columnWidth,this.rowHeight,
                      spaceship.x + (spaceship.width / 2) - (this.width / 2),spaceship.y + spaceship.height - 20,
                      this.width, this.height);
    if (this.actualColumn < 7){
      this.actualColumn++;
    }
    else {
      this.actualColumn = 0;
    }
    if (this.actualRow < 3){
      this.actualRow++;
    }
    else{
      this.actualRow = 0;
    }
    
  }
}

export default spaceship;