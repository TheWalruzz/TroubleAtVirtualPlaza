module TAVP
{
	export class Boot extends Phaser.State
	{
		preload()
		{
			// load the resources for the preloader
			this.game.load.image('preloadBar', 'res/preloadBar.png');
		}

		create()
		{
			// config stuff below
			//game.stage.disableVisibilityChange = true;

			//transit to next state
			this.game.state.start('Preloader');
		}

		init()
		{
			//  Hide the un-scaled game canvas
			this.game.canvas.style['display'] = 'none';
	 
			//  Create our scaled canvas. It will be the size of the game * whatever scale value you've set
			TAVP.Globals.pixel.canvas = Phaser.Canvas.create(this.game.width * TAVP.Globals.pixel.scale, this.game.height * TAVP.Globals.pixel.scale);
	 
			//  Store a reference to the Canvas Context
			TAVP.Globals.pixel.context = TAVP.Globals.pixel.canvas.getContext('2d');
	 
			//  Add the scaled canvas to the DOM
			Phaser.Canvas.addToDOM(TAVP.Globals.pixel.canvas, document.getElementById('content'));
	 
			//  Disable smoothing on the scaled canvas
			Phaser.Canvas.setSmoothingEnabled(TAVP.Globals.pixel.context, false);
	 
			//  Cache the width/height to avoid looking it up every render
			TAVP.Globals.pixel.width = TAVP.Globals.pixel.canvas.width;
			TAVP.Globals.pixel.height = TAVP.Globals.pixel.canvas.height;
		}
	}
} 