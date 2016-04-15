﻿module TAVP {
	export class Level extends Phaser.State {
		dialogue: TAVP.Dialogue;
		player: TAVP.Player;
		map: Phaser.Tilemap;
		bgLayer: Phaser.TilemapLayer;
		blockedLayer: Phaser.TilemapLayer;

		private findObjectsByType(typeName, map, layer) {
			var result = new Array();
			map.objects[layer].forEach(function (element) {
				if (element.properties.type === typeName) {
					//Phaser uses top left, Tiled bottom left so we have to adjust the y position
					//also keep in mind that the cup images are a bit smaller than the tile which is 16x16
					//so they might not be placed in the exact pixel position as in Tiled
					element.y -= map.tileHeight;
					result.push(element);
				}
			});
			return result;
		}

		create() {
			this.map = this.game.add.tilemap('level');
			this.map.addTilesetImage('Tiles', 'tileset');
			this.bgLayer = this.map.createLayer('Background');
			this.blockedLayer = this.map.createLayer('Blocking');

			this.map.setCollisionBetween(1, 50, true, 'Blocking');
			this.bgLayer.resizeWorld();

			var result = this.findObjectsByType('playerStart', this.map, 'Objects');
			this.player = new TAVP.Player(result[0].x, result[0].y);
			this.game.camera.follow(this.player);

			this.dialogue = new TAVP.Dialogue(
				this,
				[
					'The Virtual Plaza is facing the greatest danger of all time.',
					'The ominous glitch wave is corrupting the reality and will consume everything and everyone on its path.',
					'You have only one chance to escape.',
					'Do not waste it.'
				],
				TAVP.Config.dialogueTextStyle,
				'dialogueBox',
				'dialoguePrompt');
			this.dialogue.start();
		}

		update() {
			this.game.physics.arcade.collide(this.player, this.blockedLayer);
		}

		render() { TAVP.Utilities.render(); }
	}
} 