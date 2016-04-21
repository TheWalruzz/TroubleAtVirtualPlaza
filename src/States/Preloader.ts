module TAVP {
	export class Preloader extends Phaser.State {
		preloadBar: Phaser.Sprite;
		bust: Phaser.Sprite;

		preload() {
			// make the bg look awesomely pink
			this.stage.backgroundColor = '#ffcfff';

			this.preloadBar = this.add.sprite(28, 80, 'preloadBar');
			this.game.load.setPreloadSprite(this.preloadBar);

			// all the resource loading goes here:
			this.game.load.audio('introMusic', 'res/intro.ogg');
			this.game.load.image('bust', 'res/ma_bust.png');
			this.game.load.image('bg', 'res/background.png');
			this.game.load.image('dialogueBox', 'res/dialogueBox.png');
			this.game.load.image('dialoguePrompt', 'res/dialoguePrompt.png');
			this.game.load.spritesheet('playerSprite', 'res/player.png', 32, 32);
			this.game.load.image('tileset', 'res/tileset.png');
			this.game.load.tilemap('level', 'res/level.json', null, Phaser.Tilemap.TILED_JSON);
			this.game.load.spritesheet('glitchElevator', 'res/glitch_elevator.png', 16, 7);
			this.game.load.image('bustSprite', 'res/bustSprite.png');
			this.game.load.spritesheet('heart', 'res/heart.png', 12, 12);
			// TODO: add proper enemy sprite!
			//this.game.load.spritesheet('walkingEnemy', 'res/walkingEnemy.png', 16, 16);

			// load webfonts
			this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

			this.game.physics.startSystem(Phaser.Physics.ARCADE);
			this.game.physics.arcade.gravity = new Phaser.Point(0, TAVP.Config.gravityY);
		}

		create() {
			this.game.time.events.add(Phaser.Timer.SECOND, () => TAVP.Globals.game.state.start('Intro'), this);
		}

		render() { TAVP.Utilities.render(); }
	}
} 