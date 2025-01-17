class Play extends Phaser.Scene {
	constructor() {
		super("playScene");
	}

	create() {
		this.starfield = this.add
			.tileSprite(0, 0, 640, 480, "starfield")
			.setOrigin(0, 0);

		this.add
			.rectangle(
				0,
				borderUISize + borderPadding,
				game.config.width,
				borderUISize * 2,
				0x00ff00,
			)
			.setOrigin(0, 0);

		this.p1Rocket = new Rocket(
			this,
			game.config.width / 2,
			game.config.height - borderUISize - borderPadding,
			"rocket",
		).setOrigin(0.5, 0);

		this.ships = [];

		// ship01
		this.ships.push(
			new Spaceship(
				this,
				game.config.width + borderUISize * 6,
				borderUISize * 4,
				"spaceship",
				0,
				30,
				game.settings.spaceshipSpeed,
			).setOrigin(0, 0),
		);

		// ship02
		this.ships.push(
			new Spaceship(
				this,
				game.config.width + borderUISize * 3,
				borderUISize * 5 + borderPadding * 2,
				"spaceship",
				0,
				20,
				game.settings.spaceshipSpeed,
			).setOrigin(0, 0),
		);

		// ship03
		this.ships.push(
			new Spaceship(
				this,
				game.config.width,
				borderUISize * 6 + borderPadding * 4,
				"spaceship",
				0,
				10,
				game.settings.spaceshipSpeed,
			).setOrigin(0, 0),
		);

		// ship04
		this.ships.push(
			new Spaceship(
				this,
				game.config.width,
				borderUISize * 7 + borderPadding * 6,
				"microship",
				0,
				50,
				game.settings.spaceshipSpeed * 1.5,
			).setOrigin(0, 0),
		);

		keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
		keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
		keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
		keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

		this.p1Score = 0;

		this.scoreConfig = {
			fontFamily: "Courier",
			fontSize: "28px",
			backgroundColor: "#F3B141",
			color: "#843605",
			align: "right",
			padding: {
				top: 5,
				bottom: 5,
			},
			fixedWidth: 100,
		};

		this.scoreLeft = this.add.text(
			borderUISize + borderPadding,
			borderUISize + borderPadding * 2,
			this.p1Score,
			this.scoreConfig,
		);

		this.scoreConfig.fixedWidth = 0;

		this.add
			.rectangle(0, 0, game.config.width, borderUISize, 0xffffff)
			.setOrigin(0, 0);
		this.add
			.rectangle(
				0,
				game.config.height - borderUISize,
				game.config.width,
				borderUISize,
				0xffffff,
			)
			.setOrigin(0, 0);
		this.add
			.rectangle(0, 0, borderUISize, game.config.height, 0xffffff)
			.setOrigin(0, 0);
		this.add
			.rectangle(
				game.config.width - borderUISize,
				0,
				borderUISize,
				game.config.height,
				0xffffff,
			)
			.setOrigin(0, 0);

		this.gameOver = false;

		// pointer
		this.pointer = this.input.activePointer;

		// time tracking
		this.timeRemaining = game.settings.gameTimer;
		this.lastFrameTime = this.time.now;

		// particles
		this.emitter = this.add.particles(0, 0, "particle", {
			frame: [],
			lifespan: 3000,
			speed: { min: 200, max: 250 },
			scale: { start: 0.6, end: 0 },
			gravityY: 0,
			blendMode: "ADD",
			emitting: false,
		});
	}

	update() {
		const deltaTime = this.time.now - this.lastFrameTime;
		this.lastFrameTime = this.time.now;

		this.timeRemaining -= deltaTime;

		// console.log(this.timeRemaining);

		const scaledDeltaTime = Math.min(deltaTime / 1000, 0.25);

		if (!this.gameOver && this.timeRemaining <= 0) {
			this.gameOver = true;

			this.add
				.text(
					game.config.width / 2,
					game.config.height / 2,
					"GAME OVER",
					this.scoreConfig,
				)
				.setOrigin(0.5);
			this.add
				.text(
					game.config.width / 2,
					game.config.height / 2 + 64,
					"Press (R) to Restart or <- for Menu",
					this.scoreConfig,
				)
				.setOrigin(0.5);
		}

		this.starfield.tilePositionX -= 200 * scaledDeltaTime;

		if (!this.gameOver) {
			this.p1Rocket.update(scaledDeltaTime);

			for (let ship of this.ships) {
				ship.update(scaledDeltaTime);
			}
		} else if (Phaser.Input.Keyboard.JustDown(keyRESET)) {
			this.scene.restart();
		} else if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
			this.scene.start("menuScene");
		}

		for (let ship of this.ships) {
			if (this.checkCollision(this.p1Rocket, ship)) {
				this.p1Rocket.reset();
				this.shipExplode(ship);

				this.timeRemaining += hitReward;
			}
		}
	}

	checkCollision(rocket, ship) {
		return (
			rocket.x < ship.x + ship.width &&
			rocket.x + rocket.width > ship.x &&
			rocket.y < ship.y + ship.height &&
			rocket.height + rocket.y > ship.y
		);
	}

	shipExplode(ship) {
		ship.alpha = 0;

		let boom = this.add.sprite(ship.x, ship.y, "explosion").setOrigin(0, 0);

		boom.anims.play("explode");
		boom.on("animationcomplete", () => {
			ship.reset();
			ship.alpha = 1;
			boom.destroy();
		});

		this.p1Score += ship.points;
		this.scoreLeft.text = this.p1Score;

		this.sound.play("sfx-explosion");

		this.emitter.x = ship.x;
		this.emitter.y = ship.y;

		this.emitter.explode(16);
	}
}
