module TAVP {
	export class Menu {
		caller: Phaser.State;
		stateChanged: boolean;
		menuState: number;
		notChosenStyle: {};
		chosenStyle: {};
		options: Phaser.Text[];
		texts: string[];
		upKey: Phaser.Key;
		downKey: Phaser.Key;
		enterKey: Phaser.Key;
		escapeKey: Phaser.Key;
		handlers: { (): void }[];
		changeOptionSound: Phaser.Sound;
		confirmOptionSound: Phaser.Sound;
		previousState: string;

		constructor(caller: Phaser.State, centerXCoord: number, startYCoord: number, texts: string[], notChosenStyle: {}, chosenStyle: {}, previousState: string = null) {
			this.caller = caller;
			this.texts = texts;
			this.notChosenStyle = notChosenStyle;
			this.chosenStyle = chosenStyle;
			this.options = [];
			this.menuState = 0;
			this.stateChanged = true;
			this.previousState = previousState;

			this.options.push(this.caller.game.add.text(0, 0, this.texts[0], this.notChosenStyle));
			this.options[0].x = centerXCoord - (this.options[0].width / 2);
			this.options[0].y = startYCoord;

			for (var i = 1; i < this.texts.length; i++) {
				this.options.push(this.caller.game.add.text(0, 0, this.texts[i], this.notChosenStyle));
				this.options[i].x = centerXCoord - (this.options[i].width / 2);
				this.options[i].y = startYCoord + ((this.options[i - 1].height * 0.75) * i);
			}

			this.changeOptionSound = TAVP.Globals.game.add.audio('changeOption');
			this.changeOptionSound.volume = 0.1;
		}

		// setCallbacks function. Run it at the very end of create in your state.
		setCallbacks(handlers: { (): void }[]): void {
			if (this.options.length == handlers.length) {
				this.upKey = this.caller.input.keyboard.addKey(Phaser.Keyboard.UP);
				this.downKey = this.caller.input.keyboard.addKey(Phaser.Keyboard.DOWN);
				this.enterKey = this.caller.input.keyboard.addKey(Phaser.Keyboard.ENTER);
				this.escapeKey = this.caller.input.keyboard.addKey(Phaser.Keyboard.ESC);

				this.upKey.onDown.forget();
				this.downKey.onDown.forget();
				this.enterKey.onDown.forget();
				this.escapeKey.onDown.forget();

				if (this.options.length > 1) {
					this.upKey.onDown.add(this.upHandler.bind(this), this.caller);
					this.downKey.onDown.add(this.downHandler.bind(this), this.caller);
				}

				this.enterKey.onDown.add(this.confirmHandler.bind(this), this.caller);
				this.escapeKey.onDown.add(this.backHandler.bind(this), this.caller);
				
				this.handlers = handlers;
			}
		}

		private upHandler(): void {
			this.changeOptionSound.play();
			this.options[this.menuState].setStyle(this.notChosenStyle);
			this.menuState--;
			if (this.menuState < 0)
				this.menuState = this.options.length - 1;
			this.stateChanged = true;
		}

		private downHandler(): void {
			this.changeOptionSound.play();
			this.options[this.menuState].setStyle(this.notChosenStyle);
			this.menuState++;
			if (this.menuState > this.options.length - 1)
				this.menuState = 0;
			this.stateChanged = true;
		}

		private confirmHandler(handlers): void {
			this.handlers[this.menuState]();
		}

		private backHandler(): void {
			if (!!this.previousState) {
				this.caller.game.state.start(this.previousState);
			}
		}

		// call it in update function in State if you want to change the actual choice
		// returns true if state was changed, false otherwise
		update(): boolean {
			if ((new Date()).getTime() > GamePadUtils.instance.padCooldown && GamePadUtils.instance.axisY < -0.1) {
				GamePadUtils.instance.padCooldown = (new Date()).getTime() + 250;
				this.upHandler();
			}

			if ((new Date()).getTime() > GamePadUtils.instance.padCooldown && GamePadUtils.instance.axisY > 0.1) {
				GamePadUtils.instance.padCooldown = (new Date()).getTime() + 250;
				this.downHandler();
			}

			if ((new Date()).getTime() > GamePadUtils.instance.padCooldown && GamePadUtils.instance.isJustDown(Phaser.Gamepad.XBOX360_A)) {
				GamePadUtils.instance.padCooldown = (new Date()).getTime() + 250;
				this.confirmHandler(this.handlers);
			}

			if ((new Date()).getTime() > GamePadUtils.instance.padCooldown && GamePadUtils.instance.isJustDown(Phaser.Gamepad.XBOX360_B)) {
				GamePadUtils.instance.padCooldown = (new Date()).getTime() + 250;
				this.backHandler();
			}

			if (this.stateChanged) {
				this.stateChanged = false;
				this.options[this.menuState].setStyle(this.chosenStyle);

				return true;
			}

			return false;
		}
	}
} 