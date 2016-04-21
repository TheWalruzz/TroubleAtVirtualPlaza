module TAVP {
	export class MainMenu extends Phaser.State {
		bust: Phaser.Sprite;
		background: Phaser.Image;
		logo1: Phaser.Text;
		logo2: Phaser.Text;

		menu: TAVP.Menu;

		menuChoicesGrp: Phaser.Group;

		create() {
			this.menuChoicesGrp = this.add.group();

			TAVP.Utilities.playMusic('introMusic');

			// so that main menu shows properly after getting back from the actual game
			this.world.width = this.game.width;
			this.world.height = this.game.height;

			this.background = this.add.image(0, 0, 'bg');
			this.background.sendToBack();

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

			this.bust = this.add.sprite(0, 0, 'bust');
			this.bust.y = this.world.centerY;

			this.menu = new TAVP.Menu(this,
				this.world.centerX,
				this.world.centerY - 10,
				['New Game', 'Options'],
				TAVP.Config.menuStyle,
				TAVP.Config.menuStyleChosen);

			for (var i = 0; i < this.menu.options.length; i++)
				this.menuChoicesGrp.add(this.menu.options[i]);

			if (!TAVP.Flags.mainMenuVisited) {
				this.menuChoicesGrp.alpha = 0;
				var menuTween = this.add.tween(this.menuChoicesGrp).to({ alpha: 1 }, 1500, Phaser.Easing.Linear.None, true);

				TAVP.Flags.mainMenuVisited = true;
			}

			this.menu.setCallbacks(
				[
					() => this.game.state.start('NewGame'),
					() => this.game.state.start('Options')
				]
			);
		}

		update() {
			this.menu.update();
		}

		render() { TAVP.Utilities.render(); }
	}
} 