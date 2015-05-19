module TAVP
{
	export class Options extends Phaser.State
	{
		bust: Phaser.Sprite;
		title: Phaser.Text;

		menu: TAVP.Menu;

		create()
		{
			this.bust = this.add.sprite(0, 0, 'bust');
			this.bust.y = this.world.centerY;

			this.title = this.add.text(0, 0, 'Options', {});
			this.title.font = 'Homenaje';
			this.title.stroke = '#000000';
			this.title.strokeThickness = 4;
			this.title.fill = '#ffffff';
			this.title.fontSize = 16;
			this.title.fontWeight = 'bold';
			// coords are calculated here, because we need to know how big the text will be
			this.title.x = this.world.centerX - (this.title.width / 2);
			this.title.y = 3;

			this.menu = new TAVP.Menu(this,
				this.world.centerX,
				this.world.centerY - 10,
				[
					'Music: ' + ((TAVP.Config.musicMuted) ? 'Off' : 'On'),
					'Back'
				],
				TAVP.Config.menuStyle,
				TAVP.Config.menuStyleChosen);

			this.menu.setCallbacks(
				[
					() =>
					{
						TAVP.Config.musicMuted = !TAVP.Config.musicMuted;
						TAVP.Utilities.playMusic('introMusic');

						this.menu.options[0].text = 'Music: ' + ((TAVP.Config.musicMuted) ? 'Off' : 'On');
					},
					() => this.game.state.start('MainMenu')]);
		}

		update()
		{
			this.menu.update();
		}

		render() { TAVP.Utilities.render(); }
	}
}  