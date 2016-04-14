module TAVP {
	export class Dialogue {
		caller: Phaser.State;
		texts: string[];
		boxID: string;
		promptID: string;
		spaceKey: Phaser.Key;
		enterKey: Phaser.Key;
		textStyle: {};

		box: Phaser.Sprite;
		prompt: Phaser.Sprite;
		textLines: Phaser.Text[];

		currentText: number;
		currentLine: number;
		currentTextLines: string[];
		isReadyForNext: boolean;
		timer: Phaser.TimerEvent;
		promptTimer: Phaser.TimerEvent;

		active: boolean;

		constructor(caller: Phaser.State, texts: string[], textStyle: {}, boxID: string, promptID: string) {
			this.caller = caller;
			this.texts = texts;
			this.boxID = boxID;
			this.promptID = promptID;
			this.textStyle = textStyle;

			this.active = false;

			this.spaceKey = this.caller.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			this.enterKey = this.caller.input.keyboard.addKey(Phaser.Keyboard.ENTER);

			this.box = this.caller.add.sprite(0, 1, this.boxID);
			this.box.x = (this.caller.game.width / 2) - (this.box.width / 2);
			this.box.visible = false;
			this.box.bringToTop();
			this.box.fixedToCamera = true;

			this.textLines = [null, null, null, null];
			this.textLines[0] = this.caller.add.text(this.box.x + 3, 2, '', this.textStyle);
			this.textLines[0].visible = false;
			this.textLines[0].fixedToCamera = true;
			for (var i = 1; i < 4; i++) {
				this.textLines[i] = this.caller.add.text(this.box.x + 3, 2 + ((this.textLines[i - 1].height * 0.7) * i), '', this.textStyle);
				this.textLines[i].visible = false;
				this.textLines[i].bringToTop();
				this.textLines[i].fixedToCamera = true;
			}

			this.prompt = this.caller.add.sprite(0, 0, this.promptID);
			this.prompt.x = this.box.x + this.box.width - (this.prompt.width + 2);
			this.prompt.y = this.box.y + this.box.height - (this.prompt.height + 2);
			this.prompt.visible = false;
			this.prompt.bringToTop();
			this.prompt.fixedToCamera = true;

			this.spaceKey.onDown.add(
				() => {
					if (this.active) {
						if (this.isReadyForNext) {
							this.currentText++;
							this.showNextText();
						}
						else {
							for (var i = 0; i < this.currentTextLines.length; i++)
								this.textLines[i].text = this.currentTextLines[i];

							this.isReadyForNext = true;
						}
					}
				},
				this.caller);

			this.enterKey.onDown.add(
				() => {
					if (this.active) {
						if (this.isReadyForNext) {
							this.currentText++;
							this.showNextText();
						}
						else {
							for (var i = 0; i < this.currentTextLines.length; i++)
								this.textLines[i].text = this.currentTextLines[i];

							this.isReadyForNext = true;
						}
					}
				},
				this.caller);
		}

		start() {
			TAVP.Globals.paused = true;
			this.active = true;

			this.currentText = 0;
			this.isReadyForNext = false;
			this.currentTextLines = [null, null, null, null];

			this.box.visible = true;
			for (var i = 0; i < 4; i++)
				this.textLines[i].visible = true;

			this.promptTimer = this.caller.time.events.loop(
				750,
				() => {
					if (this.isReadyForNext)
						this.prompt.visible = !this.prompt.visible;
				},
				this.caller);

			this.showNextText();
		}

		showNextText() {
			this.prompt.visible = false;
			this.isReadyForNext = false;
			this.currentLine = 0;
			if (this.currentText < this.texts.length) {
				for (var i = 0; i < this.textLines.length; i++)
					this.textLines[i].text = '';
				this.currentTextLines = this.divideText(this.texts[this.currentText]);

				this.timer = this.caller.game.time.events.loop(80,
					() => {
						if (this.currentLine < this.currentTextLines.length) {
							if (this.textLines[this.currentLine].text.length < this.currentTextLines[this.currentLine].length)
								this.textLines[this.currentLine].text = this.currentTextLines[this.currentLine].substr(0, this.textLines[this.currentLine].text.length + 1);
							else
								this.currentLine++;
						}
						else {
							this.caller.game.time.events.remove(this.timer);

							this.isReadyForNext = true;
						}
					},
					this.caller);
			}
			else
				this.stop();
		}

		stop() {
			for (var i = 0; i < this.currentTextLines.length; i++)
				this.textLines[i].visible = false;

			this.box.visible = false;
			this.prompt.visible = false;

			this.promptTimer.pendingDelete = true;
			this.caller.game.time.events.remove(this.timer);
			this.isReadyForNext = false;
			TAVP.Globals.paused = false;
			this.active = false;

			this.spaceKey.reset(false);
			this.enterKey.reset(false);
		}

		// quick'n'dirty implementation, but it works.
		// to be possibly refactorized later
		private divideText(text: string): string[] {
			var textArr = [];

			// we create one letter in given style (assuming it's monospace!), and we check its width
			var letter = new Phaser.Text(this.caller.game, 0, 0, 'a', this.textStyle);
			var letterWidth = letter.width;
			letter.destroy();

			var howManyLines = Math.ceil((letterWidth * text.length) / this.box.width) + this.countNewlines(text);
			// -3 is arbitral for now
			var charsPerLine = Math.floor(this.box.width / (letterWidth - 3));
			var lastLineLastLetter = -1;

			for (var i = 0, j = 0; i < howManyLines && i < 4 && j < text.length; i++) {
				textArr.push();
				var lastSpace = -1;
				for (; j < text.length; j++) {
					var actualChar = text.charAt(j);
					if (actualChar == ' ' || actualChar == ',' || actualChar == '.' || actualChar == '!' || actualChar == '?') {
						lastSpace = j;
						continue;
					}

					if (j - ((lastLineLastLetter == -1) ? 0 : lastLineLastLetter) >= charsPerLine) {
						textArr[i] = text.substring(((lastLineLastLetter == -1) ? 0 : lastLineLastLetter), ((lastSpace == -1) ? j : lastSpace))
							.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
						lastLineLastLetter = ((lastSpace == -1) ? j : lastSpace);
						break;
					}
					else if (actualChar == '\n') {
						textArr[i] = text.substring(((lastLineLastLetter == -1) ? 0 : lastLineLastLetter), j)
							.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
						j++;
						lastLineLastLetter = j;
						lastSpace = j;
						break;
					}
				}

				if (j == text.length && j < howManyLines * charsPerLine && i < 4)
					textArr[i] = text.substring(((lastLineLastLetter == -1) ? 0 : lastLineLastLetter))
						.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
			}

			return textArr;
		}

		private countCharsFromArray(text: string[]): number {
			var sum = 0;
			for (var i = 0; i < text.length; i++)
				for (var j = 0; j < text[i].length; j++)
					sum++;
			return sum;
		}

		private countNewlines(text: string) {
			var count = 0;

			for (var i = 0; i < text.length; i++)
				if (text[i] == '\n')
					count++;

			return count;
		}
	}
}