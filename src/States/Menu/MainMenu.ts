module TAVP
{
	export class MainMenu extends Phaser.State
	{
		bust: Phaser.Sprite;
		background: Phaser.Sprite;
		logo1: Phaser.Text;
		logo2: Phaser.Text;

		menu: TAVP.Menu;

		allImages: Phaser.Group;
		menuChoicesGrp: Phaser.Group;

		create()
		{
			this.allImages = this.add.group();
			this.menuChoicesGrp = this.add.group();

			this.background = this.add.sprite(0, 0, 'bg');
			this.allImages.add(this.background);

			TAVP.Utilities.playMusic('introMusic');

			// upper line of title
			this.logo1 = this.game.add.text(0, 0, '私を買う', {}, this.allImages);
			this.logo1.font = 'sans-serif';
			this.logo1.stroke = '#000000';
			this.logo1.strokeThickness = 4;
			this.logo1.fill = '#ffffff';
			this.logo1.fontSize = 20;
			this.logo1.fontWeight = 'bold';
			// coords are calculated here, because we need to know how big the text will be
			this.logo1.x = this.world.centerX - (this.logo1.width / 2);
			this.logo1.y = 4;
			this.allImages.add(this.logo1);

			// lower line of title
			this.logo2 = this.game.add.text(0, 0, 'Trouble at Virtual Plaza', {});
			this.logo2.font = 'sans-serif';
			this.logo2.stroke = '#000000';
			this.logo2.strokeThickness = 4;
			this.logo2.fill = '#ff11ff';
			this.logo2.fontSize = 11;
			// coords are calculated here, because we need to know how big the text will be
			this.logo2.x = this.world.centerX - (this.logo2.width / 2);
			this.logo2.y = this.logo1.height - 4;
			this.allImages.add(this.logo2);

			this.bust = this.add.sprite(0, 0, 'bust');
			this.bust.y = this.world.centerY;
			this.allImages.add(this.bust);

			this.menu = new TAVP.Menu(this,
				['New Game', 'Options', 'Cheats'],
				TAVP.Config.menuStyle,
				TAVP.Config.menuStyleChosen);

			for (var i = 0; i < this.menu.menu.length; i++)
				this.menuChoicesGrp.add(this.menu.menu[i]);
			this.allImages.add(this.menuChoicesGrp);
			
			if (!TAVP.Flags.mainMenuVisited)
			{
				this.menuChoicesGrp.alpha = 0;
				var menuTween = this.add.tween(this.menuChoicesGrp).to({ alpha: 1 }, 1500, Phaser.Easing.Linear.None, true);

				TAVP.Flags.mainMenuVisited = true;
			}

			this.menu.setCallbacks(
				[
					() =>
					{
						if (!TAVP.Config.musicMuted)
						{
							TAVP.Globals.music.fadeOut(1000);
							TAVP.Globals.music.onFadeComplete.addOnce(() => TAVP.Globals.music.stop());
						}
						var tween = this.add.tween(this.allImages).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
						tween.onComplete.addOnce(() => this.game.state.start('Level1'));
					},
					() => this.game.state.start('Options'),
					() => this.game.state.start('Cheats')]);
		}

		update()
		{
			this.menu.update();
		}

		render() { TAVP.Utilities.render(); }
	}
} 