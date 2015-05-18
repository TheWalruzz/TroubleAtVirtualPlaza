module TAVP
{
	export class Level1 extends Phaser.State
	{
		flag = true;
		dialogue: TAVP.Dialogue;

		create()
		{
			this.dialogue = new TAVP.Dialogue(
				this,
				[
					'The Virtual Plaza is facing the greatest danger of all time.',
					'Evil vaporwave prodigy called "ブレーズ☆★☆ 420" has appeared.'
				],
				TAVP.Config.dialogueTextStyle,
				'dialogueBox');

			this.dialogue.start();
		}

		update()
		{
		}

		render() { TAVP.Utilities.render(); }
	}
} 