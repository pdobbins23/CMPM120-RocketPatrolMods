// Name: Peter Dobbins
// Title: ???
// Date: 15/1/25
// Time Spent: 0 hours
// Mods: ???

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
