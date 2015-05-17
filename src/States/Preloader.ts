module TAVP
{
	export class Preloader extends Phaser.State
	{
		preloadBar: Phaser.Sprite;
		bust: Phaser.Sprite;

		preload()
		{
			// make the bg look awesomely pink
			this.stage.backgroundColor = '#ffcfff'; 

			this.preloadBar = this.add.sprite(28, 80, 'preloadBar');
            this.game.load.setPreloadSprite(this.preloadBar);

			// all the resource loading goes here:
			this.game.load.audio('introMusic', 'res/intro.ogg');
			this.game.load.image('bust', 'res/ma_bust.png');
			this.game.load.image('bg', 'res/background.png');
		}

		create()
		{
			this.game.state.start('Intro');
		}

		render() { TAVP.Utilities.render(); }
	}
} 