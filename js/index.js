class Game {
  constructor() {
    this.score = 0;
    this.player = null;
    this.bg = null
    this.ctx = null;
    this.obstacles = []
    this.time = 0
    this.intervalId = null
  }

  startGame() {
    const canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');

    const car = new Car(45, 100, 250, 500);

    this.player = car

    const background = new Image() 

    background.src = './images/road.png'

    background.onload = () => {this.bg = background}

    this.drawPlayer()
    this.updateCanvas()
  }

  drawPlayer() {
    this.ctx.drawImage(
      this.player.img,
      this.player.posX - this.player.width / 2,
      this.player.posY,
      this.player.width,
      this.player.height
    );
  }

  moveObstacles(){
    this.obstacles.forEach((obstacle, i) => {
      obstacle.moveDown()
      if (obstacle.posY > 601) {
        this.obstacles = this.obstacles.slice(1)  
        this.score += 1
      }
    })
  }

  drawObstacles() {
    this.obstacles.forEach(obstacle => {
      this.ctx.fillStyle = 'rgb(193, 6, 6)'
      this.ctx.fillRect(obstacle.posX, obstacle.posY, obstacle.width, obstacle.height)
      this.collisionDetection(obstacle)
    })
  }

  collisionDetection(obstacle) {
    if (
      this.player.posX - this.player.width / 2 < obstacle.posX + obstacle.width &&
      this.player.posX + this.player.width / 2 > obstacle.posX &&
      this.player.posY < obstacle.posY + obstacle.height &&
      this.player.height + this.player.posY > obstacle.posY
    ) {
      clearInterval(this.intervalId)
      window.alert('test')
    } 
  }

  drawScore() {
    this.ctx.fillStyle = 'white'
    this.ctx.fillRect(380, 0, 200, 30)
    this.ctx.fillStyle = 'black'
    this.ctx.font = '18px Arial'
    this.ctx.fillText(`Score: ${this.score}`, 390, 20)
  }


  updateCanvas(){
    this.intervalId = setInterval(() => {
      this.ctx.clearRect(0, 0, 500, 700);

     this.ctx.drawImage(this.bg, 0, 0, 500, 600)

      this.drawPlayer()
      
      this.time += 10

      if (this.time % 1500 === 0) {
        
        let minWidth = 50;
        let maxWidth = 300;
        let width = Math.floor(Math.random() * (maxWidth - minWidth + 1) + minWidth);
        let minGap = 60;
        let maxGap = 180;
        let gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);

        const newBlockRight = new Obstacle(500 - width - gap, 15, width + gap, 0)
        const newBlockLeft = new Obstacle(width, 15, 0, 0)

        this.obstacles.push(newBlockRight, newBlockLeft)

      }
      
      
      if (this.time % 150 === 0) {
        this.moveObstacles()
      }
      
      this.drawObstacles()

      if (this.time % 1000 === 0) {
        this.score += 10
      }


      this.drawScore()

    }, 20)
  }
  
}

class Thing {
  constructor(width, height, posX, posY) {
    this.width = width;
    this.height = height;
    this.posX = posX;
    this.posY = posY;
  }

  moveRight(){
    this.posX += 10;
  }
  moveLeft(){
    this.posX -= 10;
  }
  moveUp(){
    this.posY -= 20;
  }
  moveDown(){
    this.posY += 20;
  }
}

class Car extends Thing {
  constructor(width, height, posX, posY) {
    super(width, height, posX, posY)
    this.img = this.createCar();
  }

  createCar() {
    const car = new Image();

    car.src = './images/car.png';

    return car;
  }

  move(event) {
    switch(event) {
      case 'ArrowRight':
        if (this.posX <= 500 - this.width/2)
        this.moveRight()
        break;
      case 'ArrowLeft':
        if (this.posX >=0 + this.width/2)
        this.moveLeft()
        break;  
      case 'ArrowUp':
        if (this.posY >= 1)
        this.moveUp()
        break;    
      case 'ArrowDown':
        if (this.posY <= 499)
        this.moveDown()
        break;    
    }
  }

}

class Obstacle extends Thing {
  constructor(width, height, posX, posY){
    super(width, height, posX, posY)
  }
}

window.onload = () => {
  
	document.getElementById('start-button').onclick = () => {
    const game = new Game();
		game.startGame();
    document.addEventListener('keydown', e => {
      game.player.move(e.key);
    })
	};
  
};
