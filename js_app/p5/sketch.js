let player;
let asteroids = [];
let asteroid_cooldown = 1000;
let last_added;
let gamestate = 0;
let score = 0;
const MAX_ASTEROIDS = 2;

function setup() {
    createCanvas(400, 400);
    player = new Player();
    last_added = new Date();
}

function draw() {
    if (gamestate == 0) {
        if (asteroids.length < MAX_ASTEROIDS && ((new Date()) - last_added > asteroid_cooldown)) {
            asteroids.push(new Asteroid());
            last_added = (new Date());
        }
        background(220);
        text(score, 30, 30);
        if (keyIsDown(LEFT_ARROW)) {
            player.moveLeft();
        } else if (keyIsDown(RIGHT_ARROW)) {
            player.moveRight();
        }
        if (asteroids.length > 0) {
            asteroids.forEach(handleAsteroids);
        }
        player.drawComponent();
    } else {
        // TODO draw gameover screen
    }
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
        fill(255)
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
        }
    }

    // Check collision, adapted from https://editor.p5js.org/mrbombmusic/sketches/l95s9fZJY
    checkCollision(asteroid) {
        if (asteroid.checkCooldown()) {
            let test_X = asteroid.getX();
            let test_Y = asteroid.getY();
            const test_R = asteroid.getR();
            if (test_X < this.x_pos)                            test_X = this.x_pos;      // test left edge
            else if (test_X > this.x_pos + this.player_width)   test_X = this.x_pos + this.player_width;   // right edge
            if (test_Y < this.y_pos)                            test_Y = this.y_pos;      // top edge
            else if (test_Y > this.y_pos + this.player_height)  test_Y = this.y_pos + this.player_height;   // bottom edge
            
            let d = dist(asteroid.getX(), asteroid.getY(), test_X, test_Y);

            if (d <= test_R) {
                score += 1;
                asteroid.bounce();
            }
        }
    }
}

function handleAsteroids(asteroid, index, arr) {
    asteroid.move();
    if (!asteroid.checkOnscreen()) {
        arr.splice(index, 1);
    }
    // arr.forEach(function(other_asteroid) {asteroid.collide(other_asteroid)});
    player.checkCollision(asteroid);
    asteroid.updateColour();
    asteroid.drawComponent();
    gamestate = (asteroid.passedPlayer()) ? 1 : 0;
}

class Asteroid {
    // Add cooldown to avoid multiple bounces breaking things
    // Add disable if the asteroid gets past the player
    constructor() {
        this.asteroid_radius = 5 + random(20);
        this.asteroid_speed = 1 + random(5);
        this.collision_cooldown = 0;
        this.last_collision = new Date();
        this.x_pos = random(width - this.asteroid_radius * 2);
        this.y_pos = 0;
        this.colour = 0;
    }

    getX() {
        return this.x_pos;
    }

    getY() {
        return this.y_pos;
    }

    getR() {
        return this.asteroid_radius;
    }

    updateColour() {
        if (this.checkCooldown()) {
            this.colour = 0;
        } else {
            this.colour = 150;
        }
    }

    drawComponent() {
        fill(this.colour)
        ellipse(this.x_pos, this.y_pos, this.asteroid_radius*2, this.asteroid_radius*2);
    }

    // Check the collision cooldown
    checkCooldown() {
        return ((new Date()) - this.last_collision > this.collision_cooldown);
    }

    // If we collide with the player then bounce back up
    bounce() {
        // Reverse the direction of travel
        this.asteroid_speed = -this.asteroid_speed;
        // Add a 1 second cooldown on collisions
        this.collision_cooldown = 1000;
        this.last_collision = new Date();
    }

    // If we collide with another asteroid then bounce back
    collide(other_asteroid) {
        if (this.checkCooldown() && other_asteroid.checkCooldown()) {
            const d = dist(other_asteroid.getX(), other_asteroid.getY(), this.x_pos, this.y_pos);
            if (d <= (other_asteroid.getR() + this.asteroid_radius)) {
                this.bounce();
                other_asteroid.bounce();
            }
        }
    }

    move() {
        this.y_pos = this.y_pos + this.asteroid_speed;
    }

    checkOnscreen() {
        return (this.y_pos + this.asteroid_radius > 0 && this.y_pos - this.asteroid_radius < height);
    }

    passedPlayer() {
        return (this.y_pos - this.asteroid_radius > height);
    }
}

// TODO score tracker