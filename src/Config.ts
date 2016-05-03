module TAVP {
	export var Config = {
		menuStyle: {
			font: 'VT323',
			stroke: '#000000',
			strokeThickness: 4,
			fill: '#ffffff',
			fontSize: 13
		},

		menuStyleChosen: {
			font: 'VT323',
			stroke: '#ee0000',
			strokeThickness: 4,
			fill: '#ffffff',
			fontSize: 13
		},

		dialogueTextStyle: {
			font: 'PT Mono',
			fontSize: 8,
			fill: '#ffffff',
			stroke: '#000000',
			strokeThickness: 3
		},

		messageStyle: {
			font: 'VT323',
			stroke: '#000000',
			strokeThickness: 4,
			fill: '#ffffff',
			fontSize: 20
		},

		timerStyle: {
			font: 'PT Mono',
			fontSize: 10,
			fill: '#ffffff',
			stroke: '#000000',
			strokeThickness: 2
		},

		gravityY: 450,
		maxHearts: 4,
		glitchWaveSpreadTime: 0.25 * Phaser.Timer.SECOND
	};
}

var WebFontConfig = {
	//  The Google Fonts we want to load (specify as many as you like in the array)
	google: {
		families: ['PT Mono', 'Homenaje', 'VT323']
	}

};