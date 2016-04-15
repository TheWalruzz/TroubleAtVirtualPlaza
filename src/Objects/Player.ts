module TAVP {
	export class Player extends Phaser.Sprite {
		isJumping: boolean;
		fallAnim: Phaser.Animation;

		constructor(x: number, y: number) {
			super(TAVP.Globals.game, x, y, 'playerSprite');

			this.anchor.setTo(0.5, 0.5);

			this.animations.add('idle', [0, 1, 2, 3, 2, 1], 10, true);
			this.animations.add('run', [4, 5, 6, 7, 8, 9, 10, 11], 10, true);
			//this.animations.add('shoot', [12, 13, 14, 15], 10, false);
			this.animations.add('jump', [42, 43, 44], 10, false);
			this.fallAnim = this.animations.add('fall', [45, 46, 47], 10, false);
			// possibly add walking up/down the stairs

			this.game.physics.arcade.enableBody(this);
			this.body.setSize(15, 32, 0, 0);
			this.body.collideWorldBounds = true;

			this.isJumping = false;

			this.game.add.existing(this);
		}

		update() {
			if (!TAVP.Globals.paused) {
				// so it works after being paused
				this.body.enable = true;

				this.body.velocity.x = 0;

				if (!this.isJumping) {
					if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
						this.body.velocity.x = -60;
						this.animations.play('run');

						if (this.scale.x == 1)
							this.scale.x = -1;
					}
					else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
						this.body.velocity.x = 60;
						this.animations.play('run');

						if (this.scale.x == -1)
							this.scale.x = 1;
					}
					else
						this.animations.play('idle');

					if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
						this.body.velocity.y = -107;
						this.animations.play('jump');

						this.isJumping = true;
					}
				}
				else {
					if (this.animations.currentAnim == this.fallAnim)
						if (this.body.velocity.y == 0)
							this.isJumping = false;

					if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.scale.x == -1)
						this.body.velocity.x = -30;
					else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.scale.x == 1)
						this.body.velocity.x = 30;
				}

				// so it always changes animation to falling when player is, well... falling
				if (this.body.velocity.y > 0 && this.animations.currentAnim != this.fallAnim)
					this.animations.play('fall');
			}
			else
				this.body.enable = false;
		}
	}
} 