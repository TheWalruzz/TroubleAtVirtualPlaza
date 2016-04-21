module TAVP {
	export class Globals {
		static pixel = { scale: 4, canvas: null, context: null, width: 0, height: 0 };

		static game: Phaser.Game;
		static music: Phaser.Sound;
		static paused: boolean = false;
		static musicMuted: boolean = true;
	}

	export var Flags = {
		mainMenuVisited: false
	};
} 