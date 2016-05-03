module TAVP {
	export class Player extends Phaser.Sprite {
		isJumping: boolean;
		fallAnim: Phaser.Animation;
		lifeManager: TAVP.LifeManager;

		moveSpeed: number;

		constructor(x: number, y: number, moveSpeed: number) {
			super(TAVP.Globals.game, x, y, 'playerSprite');

			this.smoothed = false;

			this.anchor.setTo(0.5, 0.5);

			this.animations.add('idle', [0, 1, 2, 3, 2, 1], 10, true);
			this.animations.add('run', [4, 5, 6, 7, 8, 9, 10, 11], 10, true);
			//this.animations.add('shoot', [12, 13, 14, 15], 10, false);
			this.animations.add('jump', [42, 43, 44], 10, false);
			this.animations.add('death', [16, 17, 18, 19, 20, 21, 22, 23], 10, false);
			this.fallAnim = this.animations.add('fall', [45, 46, 47], 10, false);
			// possibly add walking up/down the stairs

			this.game.physics.arcade.enableBody(this);

			// to make sure transparent pixels on player's sprite aren't colliding with anything
			// we just create thinner collision box
			this.body.setSize(15, 32, 0, 0);
			this.body.collideWorldBounds = true;

			this.isJumping = false;

			this.lifeManager = new LifeManager(TAVP.Globals.game);
			this.lifeManager.hide();

			this.game.time.events.loop(0.1 * Phaser.Timer.SECOND,
				() => {
					if (this.lifeManager.isInvincible) {
						this.visible = !this.visible;
					} else if (!this.visible) {
						this.visible = true;
					}
				},
				this);

			this.moveSpeed = moveSpeed;

			this.game.add.existing(this);
		}

		update() {
			if (!TAVP.Globals.paused) {
				// so it works after being paused
				this.body.enable = true;

				this.body.velocity.x = 0;

				if (!this.isJumping) {
					if (TAVP.Globals.gameMode != GameMode.NoEnemiesJumpOnly
						&& this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
						this.body.velocity.x = -this.moveSpeed;
						this.animations.play('run');

						if (this.scale.x == 1) {
							this.scale.x = -1;
						}
					} else if (TAVP.Globals.gameMode != GameMode.NoEnemiesJumpOnly
						&& this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
						this.body.velocity.x = this.moveSpeed;
						this.animations.play('run');

						if (this.scale.x == -1) {
							this.scale.x = 1;
						}
					} else {
						this.animations.play('idle');
					}

					if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
						this.body.velocity.y = -200;
						this.animations.play('jump');

						this.isJumping = true;
					}
				}
				else {
					if (this.animations.currentAnim == this.fallAnim)
						if (this.body.velocity.y <= 0)
							this.isJumping = false;

					if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
						this.scale.x = -1;
						this.body.velocity.x = -70;
					} else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
						this.scale.x = 1;
						this.body.velocity.x = 70;
					}
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