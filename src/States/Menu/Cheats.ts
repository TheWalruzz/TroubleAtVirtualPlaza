module TAVP
{
	export class Cheats extends Phaser.State
	{
		bust: Phaser.Sprite;
		title: Phaser.Text;

		menu: Phaser.Text[] = [null];

		create()
		{
			this.bust = this.add.sprite(0, 0, 'bust');
			this.bust.y = this.world.centerY;

			this.title = this.add.text(0, 0, 'Cheats', {});
			this.title.font = 'sans-serif';
			this.title.stroke = '#000000';
			this.title.strokeThickness = 4;
			this.title.fill = '#ffffff';
			this.title.fontSize = 16;
			this.title.fontWeight = 'bold';
			// coords are calculated here, because we need to know how big the text will be
			this.title.x = this.world.centerX - (this.title.width / 2);
			this.title.y = 3;

			this.menu = TAVP.Menu.create(this, TAVP.Config.menuStyle,
				[
					'Back'
				]);

			TAVP.Menu.init(this,
				TAVP.Config.menuStyle,
				[
					() => this.game.state.start('MainMenu')
				]);
		}

		update()
		{
			TAVP.Menu.update(this, TAVP.Config.menuStyleChosen);
		}

		render() { TAVP.Utilities.render(); }
	}
}  