// TO DO
// Remove rain drops and splats proportionally to the frame rate
class Particle {
  constructor(x, y, vx, vy) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.acc = createVector(0, -0.1);
    this.radius = 2;
  }

  draw() {
    noStroke();
    fill(255);
    ellipse(this.pos.x, height - this.pos.y, this.radius);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }
}

class RainSplat {
  constructor(rainDrop) {
    this.splat = [];
    const total = 12;//rainDrop.length / 3;
    for (let i = 0; i < total; i++) {
      const x = rainDrop.pos.x;
      const y = 0;//rainDrop.pos.y;
      const vx = random(-2, 2);
      const vy = random(0, -1 * rainDrop.vel.y/5);
      this.splat.push(new Particle(x, y, vx, vy));
    }
  }

  draw() {
    this.splat.forEach((particle) => {
      particle.draw();
    });
  }

  update() {
    this.splat.forEach((particle) => {
      particle.update();
    });
  }

  isVisible() {
    for (let i = 0; i < this.splat.length; i++) {
      let particle = this.splat[i];
      if (particle.pos.y + particle.radius > 0) return true;
    }
    return false;
  }
}

class RainDrop {
  constructor() {
    this.reset();
    this.acc = createVector(0, -0.1);
    this.length = 30;
    this.width = 3;
  }

  draw() {
    noStroke();
    fill(255);
    rect(this.pos.x, height - this.pos.y, this.width, this.length);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }

  hasCollided() {
    return this.pos.y - this.length <= 0
  }

  reset() {
    this.pos = createVector(random(width), random(height + 100, height + 1000));
    this.vel = createVector(0, random(-8, -3));
  }
}

class Rain {
  constructor(totalDrops) {
    this.rainDrops = [];
    for (let i = 0; i < totalDrops; i++) {
      this.rainDrops.push(new RainDrop());
    }
    this.rainSplats = [];
  }

  draw() {
    this.rainDrops.forEach((rainDrop) => {
      rainDrop.draw();
    });
    this.rainSplats.forEach((rainSplat) => {
      rainSplat.draw();
    });
  }
  
  update() {
    this.rainDrops.forEach((rainDrop) => {
      rainDrop.update();
    });
    this.rainSplats.forEach((rainSplat) => {
      rainSplat.update();
    });
  }

  resolveCollisions() {
    this.rainDrops.forEach((rainDrop) => {
      if (rainDrop.hasCollided()) {
        this.rainSplats.push(new RainSplat(rainDrop));
        rainDrop.reset();
      }
    });
  }

  cullSplats() {
    for (let i = this.rainSplats.length - 1; i >= 0; i--) {
      let rainSplat = this.rainSplats[i];
      if (rainSplat.isVisible()) continue;
      this.rainSplats.splice(i, 1);
    }
  }
}

let rain;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rain = new Rain(80);
}

function draw() {
  background(40);
  rain.draw();
  rain.update();
  rain.resolveCollisions();
  rain.cullSplats();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}