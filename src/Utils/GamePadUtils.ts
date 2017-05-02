module TAVP {
    export class GamePadUtils {
        private static internalInstance: GamePadUtils = null;
        private anyUp: boolean = false;
        public padCooldown: number = 0;

        public static get instance(): GamePadUtils {
            if (!GamePadUtils.internalInstance) {
                GamePadUtils.internalInstance = new GamePadUtils();
            }

            return GamePadUtils.internalInstance;
        }

        private get dpadAxifiedX(): number {
            return TAVP.Globals.game.input.gamepad.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT)
                ? -1
                : (TAVP.Globals.game.input.gamepad.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT)
                    ? 1
                    : 0
                );
        }

        private get dpadAxifiedY(): number {
            return TAVP.Globals.game.input.gamepad.pad1.justReleased(Phaser.Gamepad.XBOX360_DPAD_UP)
                ? -1
                : (TAVP.Globals.game.input.gamepad.pad1.justReleased(Phaser.Gamepad.XBOX360_DPAD_DOWN)
                    ? 1
                    : 0
                );
        }

        public get padStatus(): boolean {
            return TAVP.Globals.game.input.gamepad.supported && TAVP.Globals.game.input.gamepad.active && TAVP.Globals.game.input.gamepad.pad1.connected;
        }

        public isDown(button: number): boolean {
            return this.padStatus && TAVP.Globals.game.input.gamepad.pad1.isDown(button);
        }

        public isJustDown(button: number): boolean {
            return this.padStatus && TAVP.Globals.game.input.gamepad.pad1.justPressed(button);
        }

        public isUp(button: number): boolean {
            return this.padStatus && TAVP.Globals.game.input.gamepad.pad1.isUp(button);
        }

        public isJustUp(button: number): boolean {
            return this.padStatus && TAVP.Globals.game.input.gamepad.pad1.justReleased(button);
        }

        public get axisX(): number {
            return this.padStatus && (this.dpadAxifiedX || TAVP.Globals.game.input.gamepad.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X));
        }

        public get axisY(): number {
            return this.padStatus && (this.dpadAxifiedY || TAVP.Globals.game.input.gamepad.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y));
        }

        public setOnDown(button: number, callback: Function): void {
            TAVP.Globals.game.input.gamepad.pad1.onDownCallback = () => {
                if (this.padStatus) {
                    callback();
                }
            };
        }
    }
}