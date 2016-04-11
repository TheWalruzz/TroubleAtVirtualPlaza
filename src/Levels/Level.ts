module TAVP {
	export class Level extends Phaser.State {
		dialogue: TAVP.Dialogue;
		player: TAVP.Player;

		create() {
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

			this.player = new TAVP.Player(50, 100);

			this.dialogue.start();
		}

		update() {
		}

		render() { TAVP.Utilities.render(); }
	}
} 