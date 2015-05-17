module TAVP
{
	export var Utilities = {
		// render function to be supplied to all the render functions in the states
		// to handle pixelation
		render: function()
		{
			//  Every iteration we need to render the un-scaled game canvas to the displayed scaled canvas:
			TAVP.Globals.pixel.context.drawImage(TAVP.Globals.game.canvas,
				0, 0, TAVP.Globals.game.width, TAVP.Globals.game.height,
				0, 0, TAVP.Globals.pixel.width, TAVP.Globals.pixel.height);
		},

		playMusic: function(soundName: string)
		{
			if (!TAVP.Config.musicMuted)
			{
				if (!TAVP.Globals.music.isPlaying)
				{
					if (TAVP.Globals.music.name == soundName)
						TAVP.Globals.music.play();
					else
					{
						TAVP.Globals.music.stop();
						TAVP.Globals.music = this.add.audio(soundName);
						TAVP.Globals.music.play();
					}
				}
				else if (TAVP.Globals.music.name != soundName)
				{
					TAVP.Globals.music.stop();
					TAVP.Globals.music = this.add.audio(soundName);
					TAVP.Globals.music.play();
				}
			}
			else
			{
				if (TAVP.Globals.music.isPlaying)
					TAVP.Globals.music.stop();
			}
		}
	};
} 