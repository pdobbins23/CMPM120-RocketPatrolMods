class Rocket extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture, frame);

		scene.add.existing(this);

		this.isFiring = false;
		this.moveSpeed = 100;

		// for tracking mouse movement
		this.lastMoveWasMouse = false;
		this.lastMouseX = 0;

		this.sfxShot = scene.sound.add("sfx-shot");
	}

	update(deltaTime) {
		if (!this.isFiring) {
			let movX = 0;

			if (keyLEFT.isDown) {
				this.lastMoveWasMouse = false;
				movX = -this.moveSpeed;
			} else if (keyRIGHT.isDown) {
				this.lastMoveWasMouse = false;
				movX = this.moveSpeed;
			} else {
				if (this.lastMouseX != this.scene.pointer.worldX) {
					this.lastMoveWasMouse = true;
					this.lastMouseX = this.scene.pointer.worldX;
				}

				if (
					this.lastMoveWasMouse &&
					Math.abs(this.x - this.scene.pointer.worldX) > 5
				) {
					if (this.x < this.scene.pointer.worldX) {
						movX = this.moveSpeed;
					} else {
						movX = -this.moveSpeed;
					}
				}
			}

			this.x += movX * deltaTime;

			// lock player in bounds
			if (this.x > game.config.width - borderUISize - this.width / 2) {
				this.x = game.config.width - borderUISize - this.width / 2;
			} else if (this.x < borderUISize + this.width / 2) {
				this.x = borderUISize + this.width / 2;
			}
		}

		if (
			(Phaser.Input.Keyboard.JustDown(keyFIRE) || this.scene.pointer.isDown) &&
			!this.isFiring
		) {
			this.isFiring = true;
			this.sfxShot.play();
		}

		if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
			this.y -= this.moveSpeed * deltaTime;
		}

		if (this.y <= borderUISize * 3 + borderPadding) {
			this.isFiring = false;
			this.y = game.config.height - borderUISize - borderPadding;

			this.scene.timeRemaining -= missPunishment;
		}
	}

	reset() {
		this.isFiring = false;
		this.y = game.config.height - borderUISize - borderPadding;
	}
}
