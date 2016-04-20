module TAVP {
	export class RisingBust extends Phaser.Sprite {
		isWaiting: boolean;
		isJumping: boolean;

		constructor(x: number, y: number) {
			super(TAVP.Globals.game, x, y, 'bustSprite');

			this.game.physics.arcade.enableBody(this);
			this.body.immovable = true;

			this.isWaiting = false;

			this.game.add.existing(this);
		}

		update() {
			if (!TAVP.Globals.paused) {
				this.body.enabled = true;

				if (this.body.onFloor() && !this.isWaiting) {
					this.isWaiting = true;

					this.game.time.events.add(Phaser.Timer.SECOND * 2,
						() => {
							this.body.velocity.y = -90;
							this.isWaiting = false;
							this.isJumping = true;
						},
						this);
				} else if (this.body.velocity.y >= 0 && this.isJumping) {
					this.body.allowGravity = false;
					this.isJumping = false;

					this.game.time.events.add(Phaser.Timer.SECOND,
						() => {
							this.body.allowGravity = true;
							this.body.velocity.y = 150;
						},
						this);
				}
			} else {
				this.body.enabled = false;
			}
		}
	}
}