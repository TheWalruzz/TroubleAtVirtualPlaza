﻿module TAVP
{
	export class Globals
	{
		static pixel = { scale: 4, canvas: null, context: null, width: 0, height: 0 };

		static game: Phaser.Game;
		static music: Phaser.Sound;
	}

	export var Flags = {
		mainMenuVisited: false
	};
} 