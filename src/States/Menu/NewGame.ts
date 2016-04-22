module TAVP {
	export class NewGame extends Phaser.State {
		bust: Phaser.Sprite;
		background: Phaser.Image;
		title: Phaser.Text;
		allImages: Phaser.Group;

		menu: TAVP.Menu;

		// TODO: add argument defining cheat to be used in the level
		private startNewGame() {
			if (!TAVP.Globals.musicMuted) {
				TAVP.Globals.music.fadeOut(1000);
				TAVP.Globals.music.onFadeComplete.addOnce(() => TAVP.Globals.music.stop());
			}
			var tween = this.add.tween(this.allImages).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
			tween.onComplete.addOnce(() => this.game.state.start('Level'));
		}

		create() {
			this.allImages = this.add.group();

			this.background = this.add.image(0, 0, 'bg');
			this.background.sendToBack();
			//this.allImages.add(this.background);

			this.bust = this.add.sprite(0, 0, 'bust');
			this.bust.y = this.world.centerY;
			this.allImages.add(this.bust);

			this.title = this.add.text(0, 0, 'New Game', {});
			this.title.font = 'Homenaje';
			this.title.stroke = '#000000';
			this.title.strokeThickness = 4;
			this.title.fill = '#ffffff';
			this.title.fontSize = 16;
			this.title.fontWeight = 'bold';
			// coords are calculated here, because we need to know how big the text will be
			this.title.x = this.world.centerX - (this.title.width / 2);
			this.title.y = 3;
			this.allImages.add(this.title);

			this.menu = new TAVP.Menu(this,
				this.world.centerX,
				this.world.centerY - 10,
				[
					'Regular',
					'God mode/Super speed',
					'No enemies/Jump only',
					'Back'
				],
				TAVP.Config.menuStyle,
				TAVP.Config.menuStyleChosen);

			for (var i = 0; i < this.menu.options.length; i++) {
				this.allImages.add(this.menu.options[i]);
			}

			this.menu.setCallbacks(
				[
					() => {
						TAVP.Globals.gameMode = GameMode.Regular;
						this.startNewGame();
					},
					() => {
						TAVP.Globals.gameMode = GameMode.GodSuperSpeed;
						this.startNewGame();
					},
					() => {
						TAVP.Globals.gameMode = GameMode.NoEnemiesJumpOnly;
						this.startNewGame();
					},
					() => this.game.state.start('MainMenu')
				]);
		}

		update() {
			this.menu.update();
		}

		render() { TAVP.Utilities.render(); }
	}
}   