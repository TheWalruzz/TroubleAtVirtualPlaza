﻿module TAVP {
	export class Level extends Phaser.State {
		dialogue: TAVP.Dialogue;
		player: TAVP.Player;
		glitchWave: TAVP.GlitchWave;

		map: Phaser.Tilemap;
		bgLayer: Phaser.TilemapLayer;
		blockedLayer: Phaser.TilemapLayer;
		enemyBounds: Phaser.TilemapLayer;

		elevators: Phaser.Group;
		enemies: Phaser.Group;

		private findObjectsByType(typeName, map, layer) {
			var result = new Array();
			map.objects[layer].forEach((element) => {
				if (element.properties.type === typeName) {
					//Phaser uses top left, Tiled bottom left so we have to adjust the y position
					element.y -= map.tileHeight;
					result.push(element);
				}
			});
			return result;
		}

		private createElevators() {
			this.elevators = this.game.add.group();

			var result = this.findObjectsByType('glitchElevator', this.map, 'Objects');
			result.forEach(
				(element) => {
					var elevator = new GlitchElevator(element.x, element.y, element.y + (+element.properties.maxMove), 20);
					this.elevators.add(elevator);
				}
			);
		}

		private createEnemies() {
			this.enemies = this.game.add.group();

			var result = this.findObjectsByType('risingBust', this.map, 'Objects');
			result.forEach(
				(element) => {
					var bust = new RisingBust(element.x, element.y);
					this.enemies.add(bust);
				}
			);

			result = this.findObjectsByType('walkingEnemy', this.map, 'Objects');
			result.forEach(
				(element) => {
					var enemy = new WalkingEnemy(element.x, element.y);
					this.enemies.add(enemy);
				}
			);
		}

		create() {
			this.map = this.game.add.tilemap('level');
			this.map.addTilesetImage('Tiles', 'tileset');
			this.bgLayer = this.map.createLayer('Background');
			this.blockedLayer = this.map.createLayer('Blocking');
			this.enemyBounds = this.map.createLayer('EnemyBounds');

			this.map.setCollisionBetween(1, 50, true, 'Blocking');
			this.bgLayer.resizeWorld();

			this.map.setCollision(81, true, 'EnemyBounds');
			this.enemyBounds.visible = false;

			var result = this.findObjectsByType('playerStart', this.map, 'Objects');
			this.player = new TAVP.Player(result[0].x, result[0].y,
				((TAVP.Globals.gameMode != GameMode.GodSuperSpeed) ? 60 : 500));
			this.game.camera.follow(this.player);

			this.createElevators();
			if (TAVP.Globals.gameMode != GameMode.NoEnemiesJumpOnly) {
				this.createEnemies();
			}

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
				'dialoguePrompt',
				() => {
					this.player.lifeManager.show();
				}
			);
			this.dialogue.start();

			this.glitchWave = new GlitchWave();
		}

		update() {
			if (this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
				this.game.state.start('MainMenu');
			}

			if (this.glitchWave.checkOverlap(this.player.body.x, this.player.body.y + this.player.height)) {
				// whoops! you're dead!
				// TODO: add graphical indication about losing
				console.log('Glitchwave got you!');
				this.game.state.start('MainMenu');
			}

			this.game.physics.arcade.collide(this.player, this.blockedLayer);
			this.game.physics.arcade.collide(this.player, this.elevators);

			if (TAVP.Globals.gameMode != GameMode.NoEnemiesJumpOnly) {
				this.game.physics.arcade.collide(this.player, this.enemies, null,
					(player, enemy) => {
						if (TAVP.Globals.gameMode != GameMode.GodSuperSpeed
							&& this.player.lifeManager.decreaseLife()) {
							// whoops! you're dead!
							// TODO: add graphical indication about losing
							console.log('Dead as dead can be!');
							this.game.state.start('MainMenu');
						}
					}, this);
				this.game.physics.arcade.collide(this.enemies, this.enemyBounds,
					(enemy, bound) => {
						if (enemy.changeDirection != null) {
							enemy.changeDirection();
						}
					});
				// collider below HAS to be on line below, or otherwise walking enemies don't change directions correctly
				this.game.physics.arcade.collide(this.enemies, this.blockedLayer);
			}
		}

		render() { TAVP.Utilities.render(); }
	}
} 