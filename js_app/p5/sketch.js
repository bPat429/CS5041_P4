var textPixels = 22;
let player;
let asteroids = [];
let asteroid_cooldown = 0;
let cooldown_time;

function setup() {
    createCanvas(400, 400);
    player = new Player();
    cooldown_time = new Date();
}

function draw() {
    if (asteroids.length < 3 &&  asteroid_cooldown ) {
        asteroid = new Asteroid();
    }
    background(220);
    textSize(textPixels);
    text("Test", 30, 30);
    if (keyIsDown(LEFT_ARROW)) {
        player.moveLeft();
    } else if (keyIsDown(RIGHT_ARROW)) {
        player.moveRight();
    }
    asteroid.move();
    player.drawComponent();
    asteroid.drawComponent();
}


class Player {
    constructor() {
        this.player_height = 55;
        this.player_width = 55;
        this.player_speed = 5;
        this.x_pos = 0;
        this.y_pos = height - this.player_height;
    }

    drawComponent() {
        rect(this.x_pos, this.y_pos, this.player_width, this.player_height, 10, 10, 10, 10);
    }

    moveLeft() {
        if (this.x_pos > 0) {
            this.x_pos = this.x_pos - this.player_speed;
            this.x_pos = (this.x_pos > 0) ? this.x_pos : 0;
        }
    }

    moveRight() {
        if (this.x_pos < width - this.player_width) {
            this.x_pos = this.x_pos + this.player_speed;
            this.x_pos = (this.x_pos < width - this.player_width) ? this.x_pos : width - this.player_width;
        }//
    }
}

class Asteroid {
    constructor() {
        this.asteroid_height = 10 + random(40);
        this.asteroid_width = 10 + random(40);
        this.asteroid_speed = 1 + random(1);
        this.x_pos = random(width - this.asteroid_width);
        this.y_pos = -this.asteroid_height;
    }

    drawComponent() {
        ellipse(this.x_pos, this.y_pos, this.asteroid_width, this.asteroid_height);
    }

    move() {
        this.y_pos = this.y_pos + this.asteroid_speed;
    }
}

// TODO:
// Player box
// Asteroids