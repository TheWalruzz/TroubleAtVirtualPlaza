module TAVP
{
	export class Dialogue
	{
		caller: Phaser.State;
		texts: string[];
		boxID: string;
		spaceKey: Phaser.Key;
		textStyle: {};

		box: Phaser.Sprite;
		textLines: Phaser.Text[];

		currentText: number;
		currentLine: number;
		currentTextLines: string[];
		isReadyForNext: boolean;
		timer: Phaser.TimerEvent;

		constructor(caller: Phaser.State, texts: string[], textStyle: {}, boxID: string)
		{
			this.caller = caller;
			this.texts = texts;
			this.boxID = boxID;
			this.textStyle = textStyle;

			this.currentText = 0;
			this.isReadyForNext = false;
			this.textLines = [null, null, null, null];
			this.currentTextLines = [null, null, null, null];

			this.spaceKey = this.caller.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		}

		start()
		{
			TAVP.Globals.paused = true;

			this.box = this.caller.add.sprite(0, 1, this.boxID);
			this.box.x = this.caller.world.centerX - (this.box.width / 2);

			this.textLines[0] = this.caller.add.text(this.box.x + 3, 2, '', this.textStyle);
			for (var i = 1; i < 4; i++)
				this.textLines[i] = this.caller.add.text(this.box.x + 3, 2 + ((this.textLines[i - 1].height * 0.7) * i), '', this.textStyle);

			this.spaceKey.onDown.add(
				() =>
				{
					if (this.isReadyForNext)
					{
						if (this.currentText < this.texts.length)
						{
							this.currentText++;
							this.showNextText();
						}
						else
						{
							for (var i = 0; i < this.textLines.length; i++)
								this.textLines[i].destroy();

							this.box.destroy();
							this.spaceKey.onDown.forget();
							this.timer.pendingDelete = true;
							TAVP.Globals.paused = false;
						}
					}
					else
					{
						for (var i = 0; i < this.currentTextLines.length; i++)
							this.textLines[i].text = this.currentTextLines[i];

						this.spaceKey.reset(false);
						this.isReadyForNext = true;
						this.timer.pendingDelete = true;
					}
				},
				this.caller);

			this.showNextText();
		}

		showNextText()
		{
			this.currentLine = 0;
			if (this.currentText < this.texts.length)
			{
				for (var i = 0; i < this.textLines.length; i++)
					this.textLines[i].text = '';
				this.currentTextLines = this.divideText(this.texts[this.currentText]);
				this.isReadyForNext = false;

				this.timer = this.caller.game.time.events.repeat(80, this.countCharsFromArray(this.currentTextLines) + 1,
					() =>
					{
						if (this.currentLine < this.currentTextLines.length)
						{
							if (this.textLines[this.currentLine].text.length < this.currentTextLines[this.currentLine].length)
								this.textLines[this.currentLine].text = this.currentTextLines[this.currentLine].substr(0, this.textLines[this.currentLine].text.length + 1);
							else
								this.currentLine++;
						}

						if (this.currentLine >= this.currentTextLines.length)
							this.isReadyForNext = true;
					},
					this.caller);
			}
			else
			{
				for (var i = 0; i < this.textLines.length; i++)
					this.textLines[i].destroy();

				this.box.destroy();
				this.spaceKey.onDown.forget();
				this.timer.pendingDelete = true;
				TAVP.Globals.paused = false;
			}
		}

		// quick'n'dirty implementation, but it works.
		// to be possibly refactorized later
		private divideText(text: string): string[]
		{
			var textArr = [];

			// we create one letter in given style (assuming it's monospace!), and we check its width
			var letter = new Phaser.Text(this.caller.game, 0, 0, 'a', this.textStyle);
			var letterWidth = letter.width;
			letter.destroy();

			var howManyLines = Math.ceil((letterWidth * text.length) / this.box.width);
			// -2 is arbitral for now
			var charsPerLine = Math.floor(this.box.width / (letterWidth - 2));
			var lastLineLastLetter = -1;

			for (var i = 0, j = 0; i < howManyLines && j < text.length; i++)
			{
				textArr.push();
				var lastSpace = -1;
				for (; j < text.length; j++)
				{
					var char = text.charAt(j);
					if (char == ' ' || char == ',' || char == '.' || char == '!' || char == '?')
					{
						lastSpace = j;
						continue;
					}

					if (j - ((lastLineLastLetter == -1) ? 0 : lastLineLastLetter) >= charsPerLine)
					{
						textArr[i] = text.substring(((lastLineLastLetter == -1) ? 0 : lastLineLastLetter),((lastSpace == -1) ? j : lastSpace))
							.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
						lastLineLastLetter = lastSpace;
						break;
					}
				}
				//console.log(textArr[i]);

				if (j == text.length && j < howManyLines * charsPerLine)
				{
					textArr[i] = text.substring(((lastLineLastLetter == -1) ? 0 : lastLineLastLetter))
						.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
				}
			}

			return textArr;
		}

		private countCharsFromArray(text: string[]): number
		{
			var sum = 0;
			for (var i = 0; i < text.length; i++)
				for (var j = 0; j < text[i].length; j++)
					sum++;
			return sum;
		}
	}
}