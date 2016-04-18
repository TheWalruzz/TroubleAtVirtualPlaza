module TAVP {
	export class GlitchElevator extends Phaser.Sprite {
		startX: number;
		startY: number;
		endY: number;
		speed: number;

		constructor(startX: number, startY: number, endY: number, speed: number) {
			super(TAVP.Globals.game, startX, startY, 'glitchElevator');

			this.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);

			this.game.physics.arcade.enableBody(this);
			this.body.immovable = true;
			this.body.allowGravity = false;

			this.startX = startX;
			this.startY = startY;
			this.endY = endY;

			this.speed = speed;
			this.animations.play('move');
		}

		update() {
			if (!TAVP.Globals.paused) {
				this.body.enabled = true;

				this.body.velocity.y = -this.speed;

				if (this.y <= this.endY) {
					this.y = this.startY
				}
			} else {
				this.body.enabled = false;
			}
		}
	}
}