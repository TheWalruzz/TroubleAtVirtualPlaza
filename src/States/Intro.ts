﻿module TAVP {
	export class Intro extends Phaser.State {
		bust: Phaser.Sprite;
		background: Phaser.Sprite;
		pressAnyKey: Phaser.Text;
		logo1: Phaser.Text;
		logo2: Phaser.Text;
		timer: number = 0;
		alreadyEnded: boolean = false;
		showAnyKey: boolean = false;

		private anyKeyHandler(tweenAlpha) {
			if (!this.alreadyEnded) {
				tweenAlpha.stop();
				this.bust.alpha = 1;

				this.pressAnyKey.visible = false;

				var tween = this.add.tween(this.bust).to({ x: 0 }, 3500, Phaser.Easing.Linear.None, true);
				tween.onComplete.addOnce(
					() => {
						this.input.keyboard.onDownCallback = null;
						this.game.input.gamepad.pad1.onUpCallback = null;
						this.game.state.start('MainMenu');
					});

				this.alreadyEnded = true;
			} else if (!TAVP.Flags.mainMenuVisited) {
				TAVP.Flags.mainMenuVisited = true;
				this.input.keyboard.onDownCallback = null;
				this.game.input.gamepad.pad1.onUpCallback = null;
				this.game.state.start('MainMenu');
			}
		};

		create() {
			this.background = this.add.sprite(0, 0, 'bg');

			// upper line of title
			this.logo1 = this.game.add.text(0, 0, '私を買う', {});
			this.logo1.font = 'Homenaje';
			this.logo1.stroke = '#000000';
			this.logo1.strokeThickness = 4;
			this.logo1.fill = '#ffffff';
			this.logo1.fontSize = 20;
			this.logo1.fontWeight = 'bold';
			// coords are calculated here, because we need to know how big the text will be
			this.logo1.x = this.world.centerX - (this.logo1.width / 2);
			this.logo1.y = 4;

			// lower line of title
			this.logo2 = this.game.add.text(0, 0, 'Trouble at Virtual Plaza', {});
			this.logo2.font = 'Homenaje';
			this.logo2.stroke = '#000000';
			this.logo2.strokeThickness = 4;
			this.logo2.fill = '#ff11ff';
			this.logo2.fontSize = 13;
			// coords are calculated here, because we need to know how big the text will be
			this.logo2.x = this.world.centerX - (this.logo2.width / 2);
			this.logo2.y = this.logo1.height - 4;

			this.pressAnyKey = this.game.add.text(0, 0, 'Press Any Key', {});
			this.pressAnyKey.font = 'VT323';
			this.pressAnyKey.stroke = '#000000';
			this.pressAnyKey.strokeThickness = 4;
			this.pressAnyKey.fill = '#ffffff';
			this.pressAnyKey.fontSize = 14;
			this.pressAnyKey.fontWeight = 'bold';
			this.pressAnyKey.visible = false;
			this.pressAnyKey.x = this.world.centerX - (this.pressAnyKey.width / 2);
			this.pressAnyKey.y = this.world.height * 0.8;

			this.bust = this.add.sprite(0, 0, 'bust');
			this.bust.x = this.world.centerX - (this.bust.width / 2);
			this.bust.y = this.world.centerY;
			this.bust.alpha = 0;
			var tweenAlpha = this.add.tween(this.bust).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
			tweenAlpha.onComplete.addOnce(() => { this.showAnyKey = true; });

			this.input.keyboard.onDownCallback = this.anyKeyHandler.bind(this, tweenAlpha);
			this.game.input.gamepad.pad1.onUpCallback = this.anyKeyHandler.bind(this, tweenAlpha);

			this.time.events.loop(
				750,
				() => {
					if (!this.alreadyEnded && this.showAnyKey)
						this.pressAnyKey.visible = !this.pressAnyKey.visible;
				},
				this
			);

			TAVP.Globals.music = this.add.audio('introMusic');
			TAVP.Globals.music.loop = true;
			TAVP.Utilities.playMusic('introMusic');
		}

		update() {
		}

		render() { TAVP.Utilities.render(); }
	}
}