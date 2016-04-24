module TAVP {
	export class RisingBust extends Phaser.Sprite {
		isWaiting: boolean;
		isJumping: boolean;
		isDropping: boolean;

		emitter: Phaser.Particles.Arcade.Emitter;

		constructor(x: number, y: number) {
			super(TAVP.Globals.game, x, y, 'bustSprite');

			this.game.physics.arcade.enableBody(this);
			this.body.immovable = true;

			this.isWaiting = false;
			this.isDropping = false;
			
			this.game.add.existing(this);

			this.emitter = this.game.add.emitter(this.width / 2, this.height, 30);
			this.emitter.makeParticles('dust');
			this.addChild(this.emitter);

			this.emitter.enableBody = true;
			this.emitter.width = 10;
			this.emitter.minParticleSpeed.setTo(-30, -60);
			this.emitter.maxParticleSpeed.setTo(30, -30);
			this.emitter.gravity = 60;
		}

		update() {
			if (!TAVP.Globals.paused) {
				this.body.enabled = true;

				if (this.body.onFloor() && !this.isWaiting) {
					this.isWaiting = true;

					if (this.isDropping) {
						this.emitter.start(true, Phaser.Timer.SECOND, null, 30);
						this.isDropping = false;
					}

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

					this.isDropping = true;

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