// Name: Peter Dobbins
// Title: Rocket Patrol 2: Electric Boogaloo
// Date: 16/1/25
// Time Spent: 1 hour
// Mods:
//  - New enemy spaceship type
//  - New timing/scoring mechanism that adds time to the clock for successful hits and subtracts time for misses
//  - Mouse input
//  - Phaser particle emitter for ship explosions
// Other Changes:
//  - Use deltaTime for movement calculations (fixes some issues with varying/high FPS)
//  - Store ships in an array and iterate for updates and collision checks (rather than hard-coding)
//  - Switch from Clock delayedCall to my own time tracking thats simpler and can easily be shortened/extended dynamically

"use strict";

let config = {
	type: Phaser.AUTO,
	width: 640,
	height: 480,
	scene: [Menu, Play],
};

let game = new Phaser.Game(config);

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let keyFIRE, keyRESET, keyLEFT, keyRIGHT;

let hitReward = 3000;
let missPunishment = 5000;
