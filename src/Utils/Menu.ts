module TAVP
{
	export class Menu
	{
		caller: Phaser.State;
		stateChanged: boolean;
		menuState: number;
		notChosenStyle: {};
		chosenStyle: {};
		menu: Phaser.Text[];
		texts: string[];
		upKey: Phaser.Key;
		downKey: Phaser.Key;
		enterKey: Phaser.Key;

		constructor(caller: Phaser.State, texts: string[], notChosenStyle: {}, chosenStyle: {})
		{
			this.caller = caller;
			this.texts = texts;
			this.notChosenStyle = notChosenStyle;
			this.chosenStyle = chosenStyle;
			this.menu = [];
			this.menuState = 0;
			this.stateChanged = true;

			this.menu.push(this.caller.game.add.text(0, 0, this.texts[0], this.notChosenStyle));
			this.menu[0].x = this.caller.world.centerX - (this.menu[0].width / 2);
			this.menu[0].y = this.caller.world.centerY - 10;

			for (var i = 1; i < this.texts.length; i++)
			{
				this.menu.push(this.caller.game.add.text(0, 0, this.texts[i], this.notChosenStyle));
				this.menu[i].x = this.caller.world.centerX - (this.menu[i].width / 2);
				this.menu[i].y = this.menu[i - 1].y + this.menu[i - 1].height;
			}
		}

		// setCallbacks function. Run it at the very end of create in your state.
		setCallbacks(handlers: { (): void }[]): void
		{
			if (this.menu.length == handlers.length)
			{
				this.upKey = this.caller.input.keyboard.addKey(Phaser.Keyboard.UP);
				this.downKey = this.caller.input.keyboard.addKey(Phaser.Keyboard.DOWN);
				this.enterKey = this.caller.input.keyboard.addKey(Phaser.Keyboard.ENTER);

				this.upKey.onDown.forget();
				this.downKey.onDown.forget();
				this.enterKey.onDown.forget();

				if (this.menu.length > 1)
				{
					this.upKey.onDown.add(
						() =>
						{
							this.menu[this.menuState].setStyle(this.notChosenStyle);
							this.menuState--;
							if (this.menuState < 0)
								this.menuState = this.menu.length - 1;
							this.stateChanged = true;
						},
						this.caller
						);

					this.downKey.onDown.add(
						() => 
						{
							this.menu[this.menuState].setStyle(this.notChosenStyle);
							this.menuState++;
							if (this.menuState > this.menu.length - 1)
								this.menuState = 0;
							this.stateChanged = true;
						},
						this.caller
						);
				}

				this.enterKey.onDown.add(
					() => handlers[this.menuState](),
					this.caller
					);
			}
		}

		// call it in update function in State if you want to change the actual choice
		// returns true if state was changed, false otherwise
		update(): boolean
		{
			if (this.stateChanged)
			{
				this.stateChanged = false;
				this.menu[this.menuState].setStyle(this.chosenStyle);

				return true;
			}

			return false;
		}
	}
} 