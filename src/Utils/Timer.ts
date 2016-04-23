module TAVP {
	export class Timer extends Phaser.Text {
		timer: Phaser.Timer;

		constructor() {
			super(TAVP.Globals.game, TAVP.Globals.game.width, -2, '', TAVP.Config.timerStyle);

			this.anchor = new Phaser.Point(1, 0);

			this.fixedToCamera = true;

			this.timer = this.game.time.create();
			this.timer.stop();

			this.visible = false;

			this.game.add.existing(this);
		}

		getTimeString() {
			return (this.timer.ms / 1000).toFixed(3).toString();
		}

		startTimer() {
			this.visible = true;
			this.timer.start();
		}

		stopTimer() {
			this.visible = false;
			this.timer.stop();
		}

		update() {
			this.text = this.getTimeString();
		}
	}
}