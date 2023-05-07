import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js"
import { getDatabase, onChildAdded, ref, push, serverTimestamp, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js"
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-functions.js"
// import { checkSerial } from "https://cdn.jsdelivr.net/npm/p5.serialserver@latest/lib/p5.serialport.js"
// import { createSerial } from "https://unpkg.com/@gohai/p5.webserial@^1/libraries/p5.webserial.js"

// Serial stuff
let port;
// Game stuff
let player;
let asteroids;
const ASTEROID_COOLDOWN = 1000;
let last_added;
let gamestate;
let score;
const MAX_ASTEROIDS = 2;
// Asteroids prodcued by IOT button interaction
let game_start;
let buttons_enabled;
const BUTTONS_ENABLED_TIMER = 5000;
let bonus_asteroids;
// Firebase stuff, adapting the example code at https://editor.p5js.org/jenagosta/sketches/BJ69ITTxz
let name_input;
let submit_button;
let database;
let auth;
let uid;
// Return to expo button
let scores_button;

let connectBtn;

async function authenticate() {
    const firebaseConfig = {
      apiKey: "AIzaSyDBjUEw_DQNMQsZJWfTtLL0PQJoH-xF0kk",
      authDomain: "sta-cs5041.firebaseapp.com",
      databaseURL: "https://sta-cs5041-p4.firebaseio.com",
      projectId: "sta-cs5041",
      storageBucket: "sta-cs5041.appspot.com",
      messagingSenderId: "639987847762",
      appId: "1:639987847762:web:c5a35616a1aa1cf243458b"
    };
    const firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        uid = user.uid;
      }
    });
    database = getDatabase(firebaseApp);
    
    const functions = getFunctions(firebaseApp);
    const firebaseToken = "3182ffbb-14f3-46b0-bb5d-466dbf11d960";
    const getToken = httpsCallable(functions, "getToken");
    const token = await getToken({ token: firebaseToken });
    signInWithCustomToken(auth, token.data.token);
    
    const commentsRef = ref(database, 'data');
  
    const button_5 = query(commentsRef, orderByChild('groupId'), equalTo(5));
    const button_6 = query(commentsRef, orderByChild('groupId'), equalTo(6));
    const button_7 = query(commentsRef, orderByChild('groupId'), equalTo(7));
  
    onChildAdded(button_5, function(snapshot) {
        addBonusAsteroid(1)
    });
  
    onChildAdded(button_6, function(snapshot) {
        addBonusAsteroid(2)
    });
  
    onChildAdded(button_7, function(snapshot) {
        addBonusAsteroid(3)
    });
}

function setup() {
    buttons_enabled = false;
    authenticate();
    createCanvas(400, 400);
    player = new Player();
    last_added = new Date();
    score = 0;
    gamestate = 0;
    asteroids = [];
    // Firebase interaction stuff
    submit_button = createButton("submit");
    submit_button.mousePressed(uploadScore);
    submit_button.hide();
    name_input = createInput("username");
    name_input.hide();
    const input_width = submit_button.width + name_input.width;
    submit_button.position(width/2 - input_width/2, height);
    name_input.position(width/2 + submit_button.width - input_width/2, height);
    scores_button = createImg("HighScoresButton.png", "Highscores");
    scores_button.position(width/2 - 125, height + 40);
    scores_button.mousePressed(gotoHighscores);
    game_start = new Date();
    bonus_asteroids = 0;
    // Serial stuff
    // serial = new p5.SerialPort('138.251.29.109');
    // serial.on('data', serialEvent);
    // serial.open(portName);
    port = createSerial();
    let usedPorts = usedSerialPorts();
    if (usedPorts.length > 0) {
        port.open(usedPorts[0], 115200);
    }
    connectBtn = createButton('Connect to Micro:bit');
    connectBtn.position(width/2 - connectBtn.width/2, height/2);
    connectBtn.mousePressed(connectBtnClick);
}

function connectBtnClick() {
    if (!port.opened()) {
        port.open('MicroPython', 115200);
    } else {
        port.close();
    }
}

function uploadScore() {
    name_input.hide();
    submit_button.hide();
    push(ref(database, "data"), {
        userId: uid,
        groupId: 20,
        timestamp: serverTimestamp(),
        type: "str",
        string: name_input.value() + ", Score: " + score
    });
}

function addBonusAsteroid(type) {
    if (buttons_enabled && asteroids.length < 6 && gamestate == 0) {
        asteroids.push(new Asteroid(type));
        bonus_asteroids += 1;
        score += 1;
    }
}

function setupGameover() {
    gamestate = 1;
    name_input.show();
    submit_button.show();
}

function gotoHighscores() {
    window.location.href = 'http://localhost:19006/Highscores';
}


function draw() {
    if (port.opened()) {
        connectBtn.hide();
        if (gamestate == 0) {
            if (!buttons_enabled) {
                if (((new Date()) - game_start > BUTTONS_ENABLED_TIMER)) {
                    buttons_enabled = true;
                }
            }
            if (asteroids.length < MAX_ASTEROIDS && ((new Date()) - last_added > ASTEROID_COOLDOWN)) {
                asteroids.push(new Asteroid(0));
                last_added = (new Date());
            }
            background(255);
            fill(0);
            textSize(25);
            text("Score: " + score + ". Bonus Asteroids: " + bonus_asteroids, 10, 30);
            let serial_string = String(port.last());
            console.log(serial_string);
            console.log(serial_string == "L");
            if (keyIsDown(LEFT_ARROW) || serial_string == "L") {
                player.moveLeft();
            } else if (keyIsDown(RIGHT_ARROW) || serial_string == "R") {
                player.moveRight();
            }
            if (asteroids.length > 0) {
                asteroids.forEach(handleAsteroids);
            }
            player.drawComponent();
        } else {
            background(200);
            fill(0);
            textSize(25);
            text("Gameover. You scored: " + score, 10, 30);
            text("Refresh to try again.", 60, height/2);
            text("Upload your score:", 80, height - 20);
        }
    } else {
        background(255);
        connectBtn.show();
    }
}


class Player {
    constructor() {
        this.player_height = 30;
        this.player_width = 60;
        this.player_speed = 7;
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
        if (!asteroid.checkBounced()) {
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
    asteroid.drawComponent();
    if (asteroid.passedPlayer()) {
        setupGameover();
    }
}

class Asteroid {
    // Add cooldown to avoid multiple bounces breaking things
    // Add disable if the asteroid gets past the player
    constructor(type) {
        this.asteroid_radius = 5 + random(20);
        this.asteroid_speed = 3 + random(1);
        this.has_bounced = false;
        this.default_colour = 0;
        if (type == 0) {
            // A default asteroid, spawned normally
            this.x_pos = random(width - this.asteroid_radius);
        } else if (type == 1) {
            // An asteroid spawned by pushing button 5
            this.default_colour = 75;
            this.x_pos = random(width/3 - this.asteroid_radius);
        } else if (type == 2) {
            // An asteroid spawned by pushing button 6
            this.default_colour = 75;
            this.x_pos = (width/3) + random(width/3 - this.asteroid_radius);
        } else if (type == 3) {
            // An asteroid spawned by pushing button 7
            this.default_colour = 75;
            this.x_pos = (2 * width/3) + random(width/3 - this.asteroid_radius);
        }
        this.y_pos = 0;
        this.colour = this.default_colour;
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

    drawComponent() {
        fill(this.colour)
        ellipse(this.x_pos, this.y_pos, this.asteroid_radius*2, this.asteroid_radius*2);
    }

    // Check the collision cooldown
    checkBounced() {
        return this.has_bounced;
    }

    // If we collide with the player then bounce back up
    bounce() {
        // Reverse the direction of travel
        this.asteroid_speed = -this.asteroid_speed;
        this.colour = color(random(255), random(255), random(255));
        this.has_bounced = true;
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

window.setup = setup;
window.draw = draw;
