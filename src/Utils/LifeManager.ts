module TAVP {
	export class LifeManager {
		hp: number;
		isInvincible: boolean;

		private hearts: Phaser.Group;

		constructor(game: Phaser.Game) {
			this.hearts = game.add.group();
			this.hearts.fixedToCamera = true;

			this.hp = TAVP.Config.maxHearts;
			this.isInvincible = false;

			for (var i = 0; i < TAVP.Config.maxHearts; i++) {
				var sprite = new Phaser.Sprite(game, i * 16, 0, 'heart', 0);
				this.hearts.add(sprite);
			}

			game.add.existing(this.hearts);
			game.world.bringToTop(this.hearts);
		}

		// returns true if the hp is down to zero, false otherwise
		decreaseLife(): boolean {
			if (!this.isInvincible) {
				this.hp--;

				this.updateLife();

				if (this.hp <= 0) {
					return true;
				}

				this.isInvincible = true;
				TAVP.Globals.game.time.events.add(4 * Phaser.Timer.SECOND,
					() => { this.isInvincible = false; }, this);
			}

			return false;
		}

		updateLife() {
			for (var i = 0; i < TAVP.Config.maxHearts; i++) {
				if (i < this.hp) {
					(<Phaser.Sprite>this.hearts.getAt(i)).frame = 0;
				} else {
					(<Phaser.Sprite>this.hearts.getAt(i)).frame = 1;
				}
			}
		}

		resetLife() {
			this.hp = TAVP.Config.maxHearts;
			this.updateLife();
		}

		hide() {
			this.hearts.visible = false;
		}

		show() {
			this.hearts.visible = true;
		}
	}
}