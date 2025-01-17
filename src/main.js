// Name: Peter Dobbins
// Title: Rocket Patrol 2: Electric Boogaloo
// Date: 16/1/25
// Time Spent: 1 hour
// Mods:
//  - New enemy spaceship type
//  - New timing/scoring mechanism that adds time to the clock for successful hits and subtracts time for misses
//  - Mouse input
//  - Phaser particle emitter for ship explosions

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
