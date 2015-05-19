﻿// Trouble at Virtual Plaza entry point.

window.onload = () =>
{
	TAVP.Globals.game = new Phaser.Game(160, 144, Phaser.CANVAS, '');

	TAVP.Globals.game.state.add('Boot', TAVP.Boot);
	TAVP.Globals.game.state.add('Preloader', TAVP.Preloader);
	TAVP.Globals.game.state.add('Intro', TAVP.Intro);
	TAVP.Globals.game.state.add('MainMenu', TAVP.MainMenu);
	TAVP.Globals.game.state.add('Options', TAVP.Options);
	TAVP.Globals.game.state.add('Cheats', TAVP.Cheats);

	// levels below
	TAVP.Globals.game.state.add('Level1', TAVP.Level1);

	//TAVP.Globals.game.time.events.add(Phaser.Timer.SECOND,() => TAVP.Globals.game.state.start('Boot'), this);

	TAVP.Globals.game.state.start('Boot');
};