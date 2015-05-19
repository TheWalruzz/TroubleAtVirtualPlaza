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
			this.game.load.image('dialogueBox', 'res/dialogueBox.png');

			// load webfonts
			this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
		}

		create()
		{
			//this.game.state.start('Intro');
			this.game.time.events.add(Phaser.Timer.SECOND,() => TAVP.Globals.game.state.start('Intro'), this);
		}

		render() { TAVP.Utilities.render(); }
	}
} 