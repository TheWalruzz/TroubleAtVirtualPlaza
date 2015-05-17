module TAVP
{
	export var Menu = {create: null, init: null, update: null};

	Menu.create = function (caller, style: {}, texts: string[]): Phaser.Text[]
	{
		var menu: Phaser.Text[] = [];
		menu.push(caller.game.add.text(0, 0, texts[0], style));
		menu[0].x = caller.world.centerX - (menu[0].width / 2);
		menu[0].y = caller.world.centerY - 10;

		for (var i = 1; i < texts.length; i++)
		{
			menu.push(caller.game.add.text(0, 0, texts[i], style));
			menu[i].x = caller.world.centerX - (menu[i].width / 2);
			menu[i].y = menu[i - 1].y + menu[i - 1].height;
		}

		return menu;
	}

	// init function. run it at the very end of create in your state.
	// also, caller should be always 'this' (i.e. a State that is calling it)
	Menu.init = function (caller, style: {}, handlers: { (): void }[]): void
	{
		caller.menuState = 0;
		caller.stateChanged = true;

		if (caller.menu.length == handlers.length)
		{
			caller.upKey = caller.input.keyboard.addKey(Phaser.Keyboard.UP);
			caller.downKey = caller.input.keyboard.addKey(Phaser.Keyboard.DOWN);
			caller.enterKey = caller.input.keyboard.addKey(Phaser.Keyboard.ENTER);

			caller.upKey.onDown.forget();
			caller.downKey.onDown.forget();
			caller.enterKey.onDown.forget();

			if (caller.menu.length > 1)
			{
				caller.upKey.onDown.add(
					() =>
					{
						caller.menu[caller.menuState].setStyle(style);
						caller.menuState--;
						if (caller.menuState < 0)
							caller.menuState = caller.menu.length - 1;
						caller.stateChanged = true;
					},
					caller
					);

				caller.downKey.onDown.add(
					() => 
					{
						caller.menu[caller.menuState].setStyle(style);
						caller.menuState++;
						if (caller.menuState > caller.menu.length - 1)
							caller.menuState = 0;
						caller.stateChanged = true;
					},
					caller
					);
			}

			caller.enterKey.onDown.add(
				() => handlers[caller.menuState](),
				caller
				);
		}
	}

	// call it in update function in State if you want to change the actual choice
	// returns true if state was changed, false otherwise
	Menu.update = function (caller, chosenStyle: {}): boolean
	{
		if (caller.stateChanged)
		{
			caller.stateChanged = false;
			caller.menu[caller.menuState].setStyle(chosenStyle);

			return true;
		}

		return false;
	}
} 