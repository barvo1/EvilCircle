const BALLS_COUNT = 25;
const BALL_SIZE_MIN = 50;
const BALL_SIZE_MAX = 80;
const BALL_SPEED_MAX = 30;
const EVIL_SPEED = 25;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const para = document.getElementById('count');

class Shape {
  constructor(x, y, exists) {
    this.x = x;
    this.y = y;
    this.exists = exists;
  }
}

class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, true);
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (this.x + this.size >= canvas.width || this.x - this.size <= 0) {
      this.velX = -this.velX;
    }
    if (this.y + this.size >= canvas.height || this.y - this.size <= 0) {
      this.velY = -this.velY;
    }
    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    balls.forEach(ball => {
      if (this !== ball && this.exists && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + ball.size) {
          ball.color = this.color = randomColor();
        }
      }
    });
  }
}

class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, true);
    this.velX = EVIL_SPEED;
    this.velY = EVIL_SPEED;
    this.color = "white";
    this.size = 45;
    this.setControls();
  }

  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 20;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  checkBounds() {
    if (this.x + this.size >= canvas.width) {
      this.x -= this.size;
    }
    if (this.x - this.size <= 0) {
      this.x += this.size;
    }
    if (this.y + this.size >= canvas.height) {
      this.y -= this.size;
    }
    if (this.y - this.size <= 0) {
      this.y += this.size;
    }
  }

  setControls() {
    window.onkeydown = (e) => {
      switch (e.key) {
        case "a":
        case "A":
        case "ArrowLeft":
          this.x -= this.velX;
          break;
        case "d":
        case "D":
        case "ArrowRight":
          this.x += this.velX;
          break;
        case "w":
        case "W":
        case "ArrowUp":
          this.y -= this.velY;
          break;
        case "s":
        case "S":
        case "ArrowDown":
          this.y += this.velY;
          break;
      }
    };
  }

  collisionDetect() {
    balls.forEach(ball => {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + ball.size) {
          ball.exists = false;
          count--;
          para.textContent = "还剩 " + count + " 个球";
          if (count === 0) {
            para.textContent = "游戏结束";
          }
        }
      }
    });
  }
}

const balls = [];
let count = BALLS_COUNT;
const evilBall = new EvilCircle(random(0, canvas.width), random(0, canvas.height));

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor() {
  return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
}

function createBalls() {
  while (balls.length < BALLS_COUNT) {
    const size = random(BALL_SIZE_MIN, BALL_SIZE_MAX);
    const ball = new Ball(
      random(size, canvas.width - size),
      random(size, canvas.height - size),
      random(-BALL_SPEED_MAX, BALL_SPEED_MAX),
      random(-BALL_SPEED_MAX, BALL_SPEED_MAX),
      randomColor(),
      size
    );
    balls.push(ball);
  }
}

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  balls.forEach((ball, index) => {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    } else {
      balls.splice(index, 1);
    }
  });

  evilBall.draw();
  evilBall.checkBounds();
  evilBall.collisionDetect();

  requestAnimationFrame(loop);
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
createBalls();
loop();