module TAVP {
	export class GlitchWave extends Phaser.TileSprite {
		upperBound: Phaser.Point;
		lowerBound: Phaser.Point;

		cutMask: PIXI.Graphics;

		constructor() {
			super(TAVP.Globals.game, 0, 0, TAVP.Globals.game.world.width, TAVP.Globals.game.world.height, 'noise');

			this.animations.add('loop', [0, 1], 10, true);
			this.animations.play('loop');

			this.upperBound = new Phaser.Point(0, this.game.world.height);
			this.lowerBound = new Phaser.Point(0, this.game.world.height);
			this.cutMask = this.game.add.graphics(0, 0);
			this.visible = false;
			this.alpha = 0.8;

			this.game.time.events.loop(TAVP.Config.glitchWaveSpreadTime,
				() => {
					if (!TAVP.Globals.paused) {
						this.visible = true;

						if (this.upperBound.y > 0) {
							this.upperBound.y -= 1;
						} else if(this.upperBound.x < this.game.world.width) {
							this.upperBound.x += 1;
						}

						if (this.lowerBound.x < this.game.world.width) {
							this.lowerBound.x += 1;
						} else if (this.lowerBound.y > 0) {
							this.lowerBound.y -= 1;
						}

						this.cutMask.clear();
						this.cutMask.beginFill(0xffffff);
						if (this.lowerBound.x < this.game.world.width) {
							this.cutMask.drawPolygon(
								[
									this.upperBound.x, this.upperBound.y,
									this.lowerBound.x, this.lowerBound.y,
									0, this.lowerBound.y
								]
							);
						} else {
							this.cutMask.drawPolygon(
								[
									0, 0,
									this.upperBound.x, this.upperBound.y,
									this.lowerBound.x, this.lowerBound.y,
									0, this.lowerBound.y
								]
							);
						}

						this.cutMask.endFill();
						this.mask = this.cutMask;
					}
				});

			this.game.add.existing(this);
		}

		checkOverlap(x: number, y: number): boolean {
			if (!TAVP.Globals.paused) {
				return ((this.lowerBound.x - this.upperBound.x) * (y - this.upperBound.y)
					- (this.lowerBound.y - this.upperBound.y) * (x - this.upperBound.x)) > 0;
			} else {
				return false;
			}
		}
	}
}