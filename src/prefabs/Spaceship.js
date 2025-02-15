class Spaceship extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, texture, frame, pointValue, spaceshipSpeed) {
		super(scene, x, y, texture, frame);

		scene.add.existing(this);

		this.points = pointValue;
		this.moveSpeed = spaceshipSpeed;
	}

	update(deltaTime) {
		this.x -= this.moveSpeed * deltaTime;

		if (this.x <= 0 - this.width) {
			this.x = game.config.width;
		}
	}

	reset() {
		this.x = game.config.width;
	}
}
