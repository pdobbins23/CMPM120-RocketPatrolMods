class Rocket extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture, frame);

		scene.add.existing(this);

		this.isFiring = false;
		this.moveSpeed = 2;
		this.lastMoveWasMouse = false;
		this.lastMouseX = 0;

		this.sfxShot = scene.sound.add("sfx-shot");
	}

	update() {
		if (!this.isFiring) {
			if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
				this.lastMoveWasMouse = false;
				this.x -= this.moveSpeed;
			} else if (
				keyRIGHT.isDown &&
				this.x <= game.config.width - borderUISize - this.width
			) {
				this.lastMoveWasMouse = false;
				this.x += this.moveSpeed;
			} else {
				if (this.lastMouseX != this.scene.pointer.worldX) {
					this.lastMoveWasMouse = true;
					this.lastMouseX = this.scene.pointer.worldX;
				}

				if (
					this.lastMoveWasMouse &&
					Math.abs(this.x - this.scene.pointer.worldX) > this.moveSpeed
				) {
					if (this.x < this.scene.pointer.worldX) {
						this.x += this.moveSpeed;
					} else {
						this.x -= this.moveSpeed;
					}
				}
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
			this.y -= this.moveSpeed;
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
