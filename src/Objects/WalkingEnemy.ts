module TAVP {
	export class WalkingEnemy extends Phaser.Sprite {
		constructor(x: number, y: number) {
			// TODO: add proper enemy sprite!
			super(TAVP.Globals.game, x, y, 'playerSprite');

			this.smoothed = false;

			this.anchor.setTo(0.5, 0.5);
			// TODO: add animation definitions below and play it
			this.animations.add('walk', [33, 34, 35, 36, 37, 38, 39], 10, true);
			this.animations.play('walk');

			this.game.physics.arcade.enableBody(this);
			this.body.setSize(15, 32, 0, 0);
			this.body.collideWorldBounds = true;

			this.body.immovable = true;
			
			this.game.add.existing(this);
		}

		changeDirection() {
			this.scale.x *= -1;
		}

		update() {
			if (!TAVP.Globals.paused) {
				this.body.velocity.x = this.scale.x * 20;
			}
		}
	}
}