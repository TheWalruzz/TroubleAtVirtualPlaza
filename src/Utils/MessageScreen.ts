module TAVP {
	export class MessageScreen {
		game: Phaser.Game;
		background: Phaser.Graphics;
		text: Phaser.Text;
		pressAnyKey: Phaser.Text;
		endCallback: () => void;

		constructor(endCallback: () => void) {
			this.game = TAVP.Globals.game;
			this.endCallback = endCallback;

			this.background = this.game.add.graphics(0, 0);
			this.background.beginFill(0x000000, 1);
			this.background.drawRect(0, 0, this.game.width, this.game.height);
			this.background.endFill();
			this.background.fixedToCamera = true;

			this.text = this.game.add.text(this.game.width / 2, (this.game.height / 2) * 0.7, "", TAVP.Config.messageStyle);
			this.text.anchor = new Phaser.Point(0.5, 0.5);
			this.text.align = 'center';
			this.text.fixedToCamera = true;

			this.pressAnyKey = this.game.add.text(this.game.width / 2, this.game.height * 0.85, 'Press Any Key', TAVP.Config.menuStyle);
			this.pressAnyKey.fontWeight = 'bold';
			this.pressAnyKey.anchor = new Phaser.Point(0.5, 0.5);
			this.pressAnyKey.fixedToCamera = true;

			this.background.visible = false;
			this.text.visible = false;
			this.pressAnyKey.visible = false;
		}

		private showEverything() {
			this.text.visible = true;
			this.text.bringToTop();
			this.pressAnyKey.visible = true;
			this.pressAnyKey.bringToTop();

			this.game.time.events.loop(
				750,
				() => {
					this.pressAnyKey.visible = !this.pressAnyKey.visible;
				},
				this);

			this.game.input.keyboard.onDownCallback = this.endCallback;
		}

		show(message: string) {
			TAVP.Globals.paused = true;
			this.background.visible = true;
			this.text.text = message;
			this.background.alpha = 0;
			var tweenAlpha = this.game.add.tween(this.background).to({ alpha: 0.75 }, Phaser.Timer.SECOND, Phaser.Easing.Linear.None, true);
			tweenAlpha.onComplete.add(this.showEverything, this);
		}
	}
}