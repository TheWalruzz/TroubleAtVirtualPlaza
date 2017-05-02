var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TAVP;
(function (TAVP) {
    TAVP.Config = {
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
})(TAVP || (TAVP = {}));
var WebFontConfig = {
    google: {
        families: ['PT Mono', 'Homenaje', 'VT323']
    }
};
var TAVP;
(function (TAVP) {
    (function (GameMode) {
        GameMode[GameMode["Regular"] = 0] = "Regular";
        GameMode[GameMode["GodSuperSpeed"] = 1] = "GodSuperSpeed";
        GameMode[GameMode["NoEnemiesJumpOnly"] = 2] = "NoEnemiesJumpOnly";
    })(TAVP.GameMode || (TAVP.GameMode = {}));
    var GameMode = TAVP.GameMode;
    var Globals = (function () {
        function Globals() {
        }
        Globals.pixel = { scale: 4, canvas: null, context: null, width: 0, height: 0 };
        Globals.paused = false;
        Globals.musicMuted = true;
        Globals.gameMode = GameMode.Regular;
        return Globals;
    }());
    TAVP.Globals = Globals;
    TAVP.Flags = {
        mainMenuVisited: false
    };
})(TAVP || (TAVP = {}));
window.onload = function () {
    TAVP.Globals.game = new Phaser.Game(160, 144, Phaser.CANVAS, '');
    TAVP.Globals.game.state.add('Boot', TAVP.Boot);
    TAVP.Globals.game.state.add('Preloader', TAVP.Preloader);
    TAVP.Globals.game.state.add('Intro', TAVP.Intro);
    TAVP.Globals.game.state.add('MainMenu', TAVP.MainMenu);
    TAVP.Globals.game.state.add('Options', TAVP.Options);
    TAVP.Globals.game.state.add('NewGame', TAVP.NewGame);
    TAVP.Globals.game.state.add('Level', TAVP.Level);
    TAVP.Globals.game.state.start('Boot');
};
var TAVP;
(function (TAVP) {
    var GlitchElevator = (function (_super) {
        __extends(GlitchElevator, _super);
        function GlitchElevator(startX, startY, endY, speed) {
            _super.call(this, TAVP.Globals.game, startX, startY, 'glitchElevator');
            this.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
            this.game.physics.arcade.enableBody(this);
            this.body.immovable = true;
            this.body.allowGravity = false;
            this.startX = startX;
            this.startY = startY;
            this.endY = endY;
            this.speed = speed;
            this.animations.play('move');
        }
        GlitchElevator.prototype.update = function () {
            if (!TAVP.Globals.paused) {
                this.body.enabled = true;
                this.body.velocity.y = -this.speed;
                if (this.y <= this.endY) {
                    this.y = this.startY;
                }
            }
            else {
                this.body.enabled = false;
            }
        };
        return GlitchElevator;
    }(Phaser.Sprite));
    TAVP.GlitchElevator = GlitchElevator;
})(TAVP || (TAVP = {}));
var TAVP;
(function (TAVP) {
    var GlitchWave = (function (_super) {
        __extends(GlitchWave, _super);
        function GlitchWave() {
            var _this = this;
            _super.call(this, TAVP.Globals.game, 0, 0, TAVP.Globals.game.world.width, TAVP.Globals.game.world.height, 'noise');
            this.animations.add('loop', [0, 1], 10, true);
            this.animations.play('loop');
            this.upperBound = new Phaser.Point(0, this.game.world.height);
            this.lowerBound = new Phaser.Point(0, this.game.world.height);
            this.cutMask = this.game.add.graphics(0, 0);
            this.visible = false;
            this.alpha = 0.8;
            this.game.time.events.loop(TAVP.Config.glitchWaveSpreadTime, function () {
                if (!TAVP.Globals.paused) {
                    _this.visible = true;
                    if (_this.upperBound.y > 0) {
                        _this.upperBound.y -= 1;
                    }
                    else if (_this.upperBound.x < _this.game.world.width) {
                        _this.upperBound.x += 1;
                    }
                    if (_this.lowerBound.x < _this.game.world.width) {
                        _this.lowerBound.x += 1;
                    }
                    else if (_this.lowerBound.y > 0) {
                        _this.lowerBound.y -= 1;
                    }
                    _this.cutMask.clear();
                    _this.cutMask.beginFill(0xffffff);
                    if (_this.lowerBound.x < _this.game.world.width) {
                        _this.cutMask.drawPolygon([
                            _this.upperBound.x, _this.upperBound.y,
                            _this.lowerBound.x, _this.lowerBound.y,
                            0, _this.lowerBound.y
                        ]);
                    }
                    else {
                        _this.cutMask.drawPolygon([
                            0, 0,
                            _this.upperBound.x, _this.upperBound.y,
                            _this.lowerBound.x, _this.lowerBound.y,
                            0, _this.lowerBound.y
                        ]);
                    }
                    _this.cutMask.endFill();
                    _this.mask = _this.cutMask;
                }
            });
            this.game.add.existing(this);
        }
        GlitchWave.prototype.checkOverlap = function (x, y) {
            if (!TAVP.Globals.paused) {
                return ((this.lowerBound.x - this.upperBound.x) * (y - this.upperBound.y)
                    - (this.lowerBound.y - this.upperBound.y) * (x - this.upperBound.x)) > 0;
            }
            else {
                return false;
            }
        };
        return GlitchWave;
    }(Phaser.TileSprite));
    TAVP.GlitchWave = GlitchWave;
})(TAVP || (TAVP = {}));
var TAVP;
(function (TAVP) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(x, y, moveSpeed) {
            var _this = this;
            _super.call(this, TAVP.Globals.game, x, y, 'playerSprite');
            this.smoothed = false;
            this.anchor.setTo(0.5, 0.5);
            this.animations.add('idle', [0, 1, 2, 3, 2, 1], 10, true);
            this.animations.add('run', [4, 5, 6, 7, 8, 9, 10, 11], 12, true);
            this.animations.add('jump', [42, 43, 44], 10, false);
            this.animations.add('death', [16, 17, 18, 19, 20, 21, 22, 23], 10, false);
            this.fallAnim = this.animations.add('fall', [45, 46, 47], 10, false);
            this.game.physics.arcade.enableBody(this);
            this.body.setSize(15, 32, 0, 0);
            this.body.collideWorldBounds = true;
            this.isJumping = false;
            this.lifeManager = new TAVP.LifeManager(TAVP.Globals.game);
            this.lifeManager.hide();
            this.game.time.events.loop(0.1 * Phaser.Timer.SECOND, function () {
                if (_this.lifeManager.isInvincible) {
                    _this.visible = !_this.visible;
                }
                else if (!_this.visible) {
                    _this.visible = true;
                }
            }, this);
            this.moveSpeed = moveSpeed;
            this.game.add.existing(this);
        }
        Player.prototype.update = function () {
            if (!TAVP.Globals.paused) {
                this.body.enable = true;
                this.body.velocity.x = 0;
                if (!this.isJumping) {
                    if (TAVP.Globals.gameMode != TAVP.GameMode.NoEnemiesJumpOnly
                        && (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || TAVP.GamePadUtils.instance.axisX < -0.1)) {
                        this.body.velocity.x = -this.moveSpeed;
                        this.animations.play('run');
                        if (this.scale.x == 1) {
                            this.scale.x = -1;
                        }
                    }
                    else if (TAVP.Globals.gameMode != TAVP.GameMode.NoEnemiesJumpOnly
                        && (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || TAVP.GamePadUtils.instance.axisX > 0.1)) {
                        this.body.velocity.x = this.moveSpeed;
                        this.animations.play('run');
                        if (this.scale.x == -1) {
                            this.scale.x = 1;
                        }
                    }
                    else {
                        this.animations.play('idle');
                    }
                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || TAVP.GamePadUtils.instance.isDown(Phaser.Gamepad.XBOX360_A)) {
                        this.body.velocity.y = -200;
                        this.animations.play('jump');
                        this.isJumping = true;
                    }
                }
                else {
                    if (this.animations.currentAnim == this.fallAnim)
                        if (this.body.velocity.y <= 0)
                            this.isJumping = false;
                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || TAVP.GamePadUtils.instance.axisX < -0.1) {
                        this.scale.x = -1;
                        this.body.velocity.x = -70;
                    }
                    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || TAVP.GamePadUtils.instance.axisX > 0.1) {
                        this.scale.x = 1;
                        this.body.velocity.x = 70;
                    }
                }
                if (this.body.velocity.y > 0 && this.animations.currentAnim != this.fallAnim)
                    this.animations.play('fall');
            }
            else
                this.body.enable = false;
        };
        return Player;
    }(Phaser.Sprite));
    TAVP.Player = Player;
})(TAVP || (TAVP = {}));
var TAVP;
(function (TAVP) {
    var RisingBust = (function (_super) {
        __extends(RisingBust, _super);
        function RisingBust(x, y) {
            _super.call(this, TAVP.Globals.game, x, y, 'bustSprite');
            this.game.physics.arcade.enableBody(this);
            this.body.immovable = true;
            this.isWaiting = false;
            this.isDropping = false;
            this.game.add.existing(this);
            this.emitter = this.game.add.emitter(this.width / 2, this.height, 30);
            this.emitter.makeParticles('dust');
            this.addChild(this.emitter);
            this.emitter.enableBody = true;
            this.emitter.width = 10;
            this.emitter.minParticleSpeed.setTo(-30, -60);
            this.emitter.maxParticleSpeed.setTo(30, -30);
            this.emitter.gravity = 60;
        }
        RisingBust.prototype.update = function () {
            var _this = this;
            if (!TAVP.Globals.paused) {
                this.body.enabled = true;
                if (this.body.onFloor() && !this.isWaiting) {
                    this.isWaiting = true;
                    if (this.isDropping) {
                        this.emitter.start(true, Phaser.Timer.SECOND, null, 30);
                        this.isDropping = false;
                    }
                    this.game.time.events.add(Phaser.Timer.SECOND * 2, function () {
                        _this.body.velocity.y = -200;
                        _this.isWaiting = false;
                        _this.isJumping = true;
                    }, this);
                }
                else if (this.body.velocity.y >= 0 && this.isJumping) {
                    this.body.allowGravity = false;
                    this.isJumping = false;
                    this.isDropping = true;
                    this.game.time.events.add(Phaser.Timer.SECOND, function () {
                        _this.body.allowGravity = true;
                        _this.body.velocity.y = 250;
                    }, this);
                }
            }
            else {
                this.body.enabled = false;
            }
        };
        return RisingBust;
    }(Phaser.Sprite));
    TAVP.RisingBust = RisingBust;
})(TAVP || (TAVP = {}));
var TAVP;
(function (TAVP) {
    var WalkingEnemy = (function (_super) {
        __extends(WalkingEnemy, _super);
        function WalkingEnemy(x, y) {
            _super.call(this, TAVP.Globals.game, x, y, 'playerSprite');
            this.smoothed = false;
            this.anchor.setTo(0.5, 0.5);
            this.animations.add('walk', [33, 34, 35, 36, 37, 38, 39], 10, true);
            this.animations.play('walk');
            this.game.physics.arcade.enableBody(this);
            this.body.setSize(15, 32, 0, 0);
            this.body.collideWorldBounds = true;
            this.body.immovable = true;
            this.game.add.existing(this);
        }
        WalkingEnemy.prototype.changeDirection = function () {
            this.scale.x *= -1;
        };
        WalkingEnemy.prototype.update = function () {
            if (!TAVP.Globals.paused) {
                this.body.velocity.x = this.scale.x * 20;
            }
        };
        return WalkingEnemy;
    }(Phaser.Sprite));
    TAVP.WalkingEnemy = WalkingEnemy;
})(TAVP || (TAVP = {}));
var TAVP;
(function (TAVP) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.game.load.image('preloadBar', 'res/preloadBar.png');
        };
        Boot.prototype.create = function () {
            this.game.state.start('Preloader');
        };
        Boot.prototype.init = function () {
            this.game.canvas.style['display'] = 'none';
            TAVP.Globals.pixel.canvas = Phaser.Canvas.create(document.getElementById('content'), this.game.width * TAVP.Globals.pixel.scale, this.game.height * TAVP.Globals.pixel.scale);
            TAVP.Globals.pixel.context = TAVP.Globals.pixel.canvas.getContext('2d');
            Phaser.Canvas.addToDOM(TAVP.Globals.pixel.canvas, document.getElementById('content'));
            Phaser.Canvas.setSmoothingEnabled(TAVP.Globals.pixel.context, false);
            TAVP.Globals.pixel.width = TAVP.Globals.pixel.canvas.width;
            TAVP.Globals.pixel.height = TAVP.Globals.pixel.canvas.height;
        };
        return Boot;
    }(Phaser.State));
    TAVP.Boot = Boot;
})(TAVP || (TAVP = {}));
var TAVP;
(function (TAVP) {
    var Intro = (function (_super) {
        __extends(Intro, _super);
        function Intro() {
            _super.apply(this, arguments);
            this.timer = 0;
            this.alreadyEnded = false;
            this.showAnyKey = false;
        }
        Intro.prototype.anyKeyHandler = function (tweenAlpha) {
            var _this = this;
            if (!this.alreadyEnded) {
                tweenAlpha.stop();
                this.bust.alpha = 1;
                this.pressAnyKey.visible = false;
                var tween = this.add.tween(this.bust).to({ x: 0 }, 3500, Phaser.Easing.Linear.None, true);
                tween.onComplete.addOnce(function () {
                    _this.input.keyboard.onDownCallback = null;
                    _this.game.input.gamepad.pad1.onUpCallback = null;
                    _this.game.state.start('MainMenu');
                });
                this.alreadyEnded = true;
            }
            else if (!TAVP.Flags.mainMenuVisited) {
                TAVP.Flags.mainMenuVisited = true;
                this.input.keyboard.onDownCallback = null;
                this.game.input.gamepad.pad1.onUpCallback = null;
                this.game.state.start('MainMenu');
            }
        };
        ;
        Intro.prototype.create = function () {
            var _this = this;
            this.background = this.add.sprite(0, 0, 'bg');
            this.logo1 = this.game.add.text(0, 0, '私を買う', {});
            this.logo1.font = 'Homenaje';
            this.logo1.stroke = '#000000';
            this.logo1.strokeThickness = 4;
            this.logo1.fill = '#ffffff';
            this.logo1.fontSize = 20;
            this.logo1.fontWeight = 'bold';
            this.logo1.x = this.world.centerX - (this.logo1.width / 2);
            this.logo1.y = 4;
            this.logo2 = this.game.add.text(0, 0, 'Trouble at Virtual Plaza', {});
            this.logo2.font = 'Homenaje';
            this.logo2.stroke = '#000000';
            this.logo2.strokeThickness = 4;
            this.logo2.fill = '#ff11ff';
            this.logo2.fontSize = 13;
            this.logo2.x = this.world.centerX - (this.logo2.width / 2);
            this.logo2.y = this.logo1.height - 4;
            this.pressAnyKey = this.game.add.text(0, 0, 'Press Any Key', {});
            this.pressAnyKey.font = 'VT323';
            this.pressAnyKey.stroke = '#000000';
            this.pressAnyKey.strokeThickness = 4;
            this.pressAnyKey.fill = '#ffffff';
            this.pressAnyKey.fontSize = 14;
            this.pressAnyKey.fontWeight = 'bold';
            this.pressAnyKey.visible = false;
            this.pressAnyKey.x = this.world.centerX - (this.pressAnyKey.width / 2);
            this.pressAnyKey.y = this.world.height * 0.8;
            this.bust = this.add.sprite(0, 0, 'bust');
            this.bust.x = this.world.centerX - (this.bust.width / 2);
            this.bust.y = this.world.centerY;
            this.bust.alpha = 0;
            var tweenAlpha = this.add.tween(this.bust).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
            tweenAlpha.onComplete.addOnce(function () { _this.showAnyKey = true; });
            this.input.keyboard.onDownCallback = this.anyKeyHandler.bind(this, tweenAlpha);
            this.game.input.gamepad.pad1.onUpCallback = this.anyKeyHandler.bind(this, tweenAlpha);
            this.time.events.loop(750, function () {
                if (!_this.alreadyEnded && _this.showAnyKey)
                    _this.pressAnyKey.visible = !_this.pressAnyKey.visible;
            }, this);
            TAVP.Globals.music = this.add.audio('introMusic');
            TAVP.Globals.music.loop = true;
            TAVP.Utilities.playMusic('introMusic');
        };
        Intro.prototype.update = function () {
        };
        Intro.prototype.render = function () { TAVP.Utilities.render(); };
        return Intro;
    }(Phaser.State));
    TAVP.Intro = Intro;
})(TAVP || (TAVP = {}));
var TAVP;
(function (TAVP) {
    var Level = (function (_super) {
        __extends(Level, _super);
        function Level() {
            _super.apply(this, arguments);
        }
        Level.prototype.findObjectsByType = function (typeName, map, layer) {
            var result = new Array();
            map.objects[layer].forEach(function (element) {
                if (element.properties.type === typeName) {
                    element.y -= map.tileHeight;
                    result.push(element);
                }
            });
            return result;
        };
        Level.prototype.createPlatforms = function () {
            var _this = this;
            this.platforms = this.game.add.group();
            var result = this.findObjectsByType('glitchElevator', this.map, 'Objects');
            result.forEach(function (element) {
                var elevator = new TAVP.GlitchElevator(element.x, element.y, element.y + (+element.properties.maxMove), 20);
                _this.platforms.add(elevator);
            });
        };
        Level.prototype.createEnemies = function () {
            var _this = this;
            this.enemies = this.game.add.group();
            var result = this.findObjectsByType('risingBust', this.map, 'Objects');
            result.forEach(function (element) {
                var bust = new TAVP.RisingBust(element.x, element.y);
                _this.enemies.add(bust);
            });
            result = this.findObjectsByType('walkingEnemy', this.map, 'Objects');
            result.forEach(function (element) {
                var enemy = new TAVP.WalkingEnemy(element.x, element.y);
                _this.enemies.add(enemy);
            });
        };
        Level.prototype.createExit = function () {
            var result = this.findObjectsByType('playerEnd', this.map, 'Objects');
            this.exit = this.game.add.sprite(result[0].x, result[0].y, 'bustSprite');
            this.exit.renderable = false;
            this.game.physics.arcade.enableBody(this.exit);
            this.exit.body.collideWorldBounds = true;
            this.exit.body.immovable = true;
            this.exit.body.allowGravity = false;
        };
        Level.prototype.create = function () {
            var _this = this;
            this.map = this.game.add.tilemap('level');
            this.map.addTilesetImage('Tiles', 'tileset');
            this.bgLayer = this.map.createLayer('Background');
            this.blockedLayer = this.map.createLayer('Blocking');
            this.enemyBounds = this.map.createLayer('EnemyBounds');
            this.background = this.game.add.sprite(0, 0, 'bg');
            this.background.fixedToCamera = true;
            this.background.alpha = 0;
            this.map.setCollisionBetween(1, 50, true, 'Blocking');
            this.bgLayer.resizeWorld();
            this.map.setCollision(81, true, 'EnemyBounds');
            this.enemyBounds.visible = false;
            var result = this.findObjectsByType('playerStart', this.map, 'Objects');
            this.player = new TAVP.Player(result[0].x, result[0].y, ((TAVP.Globals.gameMode != TAVP.GameMode.GodSuperSpeed) ? 75 : 500));
            this.game.camera.follow(this.player);
            this.createPlatforms();
            if (TAVP.Globals.gameMode != TAVP.GameMode.NoEnemiesJumpOnly) {
                this.createEnemies();
            }
            this.createExit();
            this.dialogue = new TAVP.Dialogue(this, [
                'The Virtual Plaza is facing the greatest danger of all time.',
                'The ominous glitch wave is corrupting the reality and will consume everything and everyone on its path.',
                'You have only one chance to escape.',
                'Do not waste it.'
            ], TAVP.Config.dialogueTextStyle, 'dialogueBox', 'dialoguePrompt', function () {
                _this.player.lifeManager.show();
                _this.timerText.startTimer();
            });
            this.dialogue.start();
            this.glitchWave = new TAVP.GlitchWave();
            this.messageScreen = new TAVP.MessageScreen(function () {
                _this.input.keyboard.onDownCallback = null;
                _this.background.bringToTop();
                var tweenAlpha = _this.game.add.tween(_this.background).to({ alpha: 1 }, Phaser.Timer.SECOND, Phaser.Easing.Linear.None, true);
                tweenAlpha.onComplete.add(function () { _this.game.state.start('MainMenu', true, false, true); }, _this);
            });
            this.timerText = new TAVP.Timer();
        };
        Level.prototype.update = function () {
            var _this = this;
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.ESC) || TAVP.GamePadUtils.instance.isJustDown(Phaser.Gamepad.XBOX360_START)) {
                this.background.bringToTop();
                var tweenAlpha = this.game.add.tween(this.background).to({ alpha: 1 }, Phaser.Timer.SECOND, Phaser.Easing.Linear.None, true);
                tweenAlpha.onComplete.add(function () { _this.game.state.start('MainMenu', true, false, true); }, this);
            }
            this.game.physics.arcade.overlap(this.player, this.exit, function () {
                _this.player.lifeManager.hide();
                var timeElapsed = _this.timerText.getTimeString();
                _this.timerText.stopTimer();
                _this.messageScreen.show('Congratulations!\nYou Win!\nYour time: ' + timeElapsed + 's');
            });
            if (this.glitchWave.checkOverlap(this.player.body.x, this.player.body.y + this.player.height)) {
                this.player.lifeManager.hide();
                this.timerText.stopTimer();
                this.messageScreen.show('You Lose');
            }
            this.game.physics.arcade.collide(this.player, this.blockedLayer);
            this.game.physics.arcade.collide(this.player, this.platforms);
            if (TAVP.Globals.gameMode != TAVP.GameMode.NoEnemiesJumpOnly) {
                this.game.physics.arcade.collide(this.player, this.enemies, null, function (player, enemy) {
                    if (TAVP.Globals.gameMode != TAVP.GameMode.GodSuperSpeed
                        && _this.player.lifeManager.decreaseLife()) {
                        _this.player.lifeManager.hide();
                        _this.timerText.stopTimer();
                        _this.messageScreen.show('You Lose');
                    }
                }, this);
                this.game.physics.arcade.collide(this.enemies, this.enemyBounds, function (enemy, bound) {
                    if (enemy.changeDirection != null) {
                        enemy.changeDirection();
                    }
                });
                this.game.physics.arcade.collide(this.enemies, this.blockedLayer);
            }
        };
        Level.prototype.render = function () { TAVP.Utilities.render(); };
        return Level;
    }(Phaser.State));
    TAVP.Level = Level;
})(TAVP || (TAVP = {}));
var TAVP;
(function (TAVP) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.init = function (fadeIn) {
            if (fadeIn === void 0) { fadeIn = false; }
            this.fadeIn = fadeIn;
        };
        MainMenu.prototype.create = function () {
            var _this = this;
            this.menuChoicesGrp = this.add.group();
            TAVP.Utilities.playMusic('introMusic');
            this.world.width = this.game.width;
            this.world.height = this.game.height;
            this.background = this.add.image(0, 0, 'bg');
            this.background.sendToBack();
            this.logo1 = this.game.add.text(0, 0, '私を買う', {});
            this.logo1.font = 'Homenaje';
            this.logo1.stroke = '#000000';
            this.logo1.strokeThickness = 4;
            this.logo1.fill = '#ffffff';
            this.logo1.fontSize = 20;
            this.logo1.fontWeight = 'bold';
            this.logo1.x = this.world.centerX - (this.logo1.width / 2);
            this.logo1.y = 4;
            this.logo2 = this.game.add.text(0, 0, 'Trouble at Virtual Plaza', {});
            this.logo2.font = 'Homenaje';
            this.logo2.stroke = '#000000';
            this.logo2.strokeThickness = 4;
            this.logo2.fill = '#ff11ff';
            this.logo2.fontSize = 13;
            this.logo2.x = this.world.centerX - (this.logo2.width / 2);
            this.logo2.y = this.logo1.height - 4;
            this.bust = this.add.sprite(0, 0, 'bust');
            this.bust.y = this.world.centerY;
            this.menu = new TAVP.Menu(this, this.world.centerX, this.world.centerY - 10, ['New Game', 'Options'], TAVP.Config.menuStyle, TAVP.Config.menuStyleChosen);
            for (var i = 0; i < this.menu.options.length; i++)
                this.menuChoicesGrp.add(this.menu.options[i]);
            if (!TAVP.Flags.mainMenuVisited || this.fadeIn) {
                this.menuChoicesGrp.alpha = 0;
                var menuTween = this.add.tween(this.menuChoicesGrp).to({ alpha: 1 }, 1500, Phaser.Easing.Linear.None, true);
                TAVP.Flags.mainMenuVisited = true;
            }
            this.menu.setCallbacks([
                function () { return _this.game.state.start('NewGame'); },
                function () { return _this.game.state.start('Options'); }
            ]);
        };
        MainMenu.prototype.update = function () {
            this.menu.update();
        };
        MainMenu.prototype.render = function () { TAVP.Utilities.render(); };
        return MainMenu;
    }(Phaser.State));
    TAVP.MainMenu = MainMenu;
})(TAVP || (TAVP = {}));
var TAVP;
(function (TAVP) {
    var NewGame = (function (_super) {
        __extends(NewGame, _super);
        function NewGame() {
            _super.apply(this, arguments);
        }
        NewGame.prototype.startNewGame = function () {
            var _this = this;
            if (!TAVP.Globals.musicMuted) {
                TAVP.Globals.music.fadeOut(1000);
                TAVP.Globals.music.onFadeComplete.addOnce(function () { return TAVP.Globals.music.stop(); });
            }
            var tween = this.add.tween(this.allImages).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.addOnce(function () {
                _this.game.state.start('Level');
            });
        };
        NewGame.prototype.create = function () {
            var _this = this;
            this.allImages = this.add.group();
            this.background = this.add.image(0, 0, 'bg');
            this.background.sendToBack();
            this.bust = this.add.sprite(0, 0, 'bust');
            this.bust.y = this.world.centerY;
            this.allImages.add(this.bust);
            this.title = this.add.text(0, 0, 'New Game', {});
            this.title.font = 'Homenaje';
            this.title.stroke = '#000000';
            this.title.strokeThickness = 4;
            this.title.fill = '#ffffff';
            this.title.fontSize = 16;
            this.title.fontWeight = 'bold';
            this.title.x = this.world.centerX - (this.title.width / 2);
            this.title.y = 3;
            this.allImages.add(this.title);
            this.menu = new TAVP.Menu(this, this.world.centerX, this.world.centerY - 10, [
                'Regular',
                'God mode/Super speed',
                'No enemies/Jump only',
                'Back'
            ], TAVP.Config.menuStyle, TAVP.Config.menuStyleChosen);
            for (var i = 0; i < this.menu.options.length; i++) {
                this.allImages.add(this.menu.options[i]);
            }
            this.menu.setCallbacks([
                function () {
                    TAVP.Globals.gameMode = TAVP.GameMode.Regular;
                    _this.startNewGame();
                },
                function () {
                    TAVP.Globals.gameMode = TAVP.GameMode.GodSuperSpeed;
                    _this.startNewGame();
                },
                function () {
                    TAVP.Globals.gameMode = TAVP.GameMode.NoEnemiesJumpOnly;
                    _this.startNewGame();
                },
                function () { return _this.game.state.start('MainMenu'); }
            ]);
        };
        NewGame.prototype.update = function () {
            this.menu.update();
        };
        NewGame.prototype.render = function () { TAVP.Utilities.render(); };
        return NewGame;
    }(Phaser.State));
    TAVP.NewGame = NewGame;
})(TAVP || (TAVP = {}));
var TAVP;
(function (TAVP) {
    var Options = (function (_super) {
        __extends(Options, _super);
        function Options() {
            _super.apply(this, arguments);
        }
        Options.prototype.create = function () {
            var _this = this;
            this.background = this.add.image(0, 0, 'bg');
            this.background.sendToBack();
            this.bust = this.add.sprite(0, 0, 'bust');
            this.bust.y = this.world.centerY;
            this.title = this.add.text(0, 0, 'Options', {});
            this.title.font = 'Homenaje';
            this.title.stroke = '#000000';
            this.title.strokeThickness = 4;
            this.title.fill = '#ffffff';
            this.title.fontSize = 16;
            this.title.fontWeight = 'bold';
            this.title.x = this.world.centerX - (this.title.width / 2);
            this.title.y = 3;
            this.menu = new TAVP.Menu(this, this.world.centerX, this.world.centerY - 10, [
                'Music: ' + ((TAVP.Globals.musicMuted) ? 'Off' : 'On'),
                'Back'
            ], TAVP.Config.menuStyle, TAVP.Config.menuStyleChosen);
            this.menu.setCallbacks([
                function () {
                    TAVP.Globals.musicMuted = !TAVP.Globals.musicMuted;
                    TAVP.Utilities.playMusic('introMusic');
                    _this.menu.options[0].text = 'Music: ' + ((TAVP.Globals.musicMuted) ? 'Off' : 'On');
                },
                function () { return _this.game.state.start('MainMenu'); }]);
        };
        Options.prototype.update = function () {
            this.menu.update();
        };
        Options.prototype.render = function () { TAVP.Utilities.render(); };
        return Options;
    }(Phaser.State));
    TAVP.Options = Options;
})(TAVP || (TAVP = {}));
var TAVP;
(function (TAVP) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            this.stage.backgroundColor = '#ffcfff';
            this.preloadBar = this.add.sprite(28, 80, 'preloadBar');
            this.game.load.setPreloadSprite(this.preloadBar);
            this.game.load.audio('introMusic', 'res/intro.ogg');
            this.game.load.image('bust', 'res/ma_bust.png');
            this.game.load.image('bg', 'res/background.png');
            this.game.load.image('dialogueBox', 'res/dialogueBox.png');
            this.game.load.image('dialoguePrompt', 'res/dialoguePrompt.png');
            this.game.load.spritesheet('playerSprite', 'res/player.png', 32, 32);
            this.game.load.image('tileset', 'res/tileset.png');
            this.game.load.tilemap('level', 'res/level.json', null, Phaser.Tilemap.TILED_JSON);
            this.game.load.spritesheet('glitchElevator', 'res/glitch_elevator.png', 16, 7);
            this.game.load.image('bustSprite', 'res/bustSprite.png');
            this.game.load.spritesheet('heart', 'res/heart.png', 12, 12);
            this.game.load.spritesheet('noise', 'res/noise.png', 128, 128);
            this.game.load.image('dust', 'res/dust.png');
            this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity = new Phaser.Point(0, TAVP.Config.gravityY);
        };
        Preloader.prototype.create = function () {
            this.game.time.events.add(Phaser.Timer.SECOND, function () { return TAVP.Globals.game.state.start('Intro'); }, this);
            this.game.input.gamepad.start();
        };
        Preloader.prototype.render = function () { TAVP.Utilities.render(); };
        return Preloader;
    }(Phaser.State));
    TAVP.Preloader = Preloader;
})(TAVP || (TAVP = {}));
var TAVP;
(function (TAVP) {
    var Dialogue = (function () {
        function Dialogue(caller, texts, textStyle, boxID, promptID, stopCallback) {
            var _this = this;
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
            this.spaceKey.onDown.add(this.skipHandler, this.caller);
            this.enterKey.onDown.add(this.skipHandler, this.caller);
            TAVP.Globals.game.input.gamepad.pad1.onDownCallback = function () {
                if (TAVP.Globals.game.input.gamepad.pad1.justPressed(Phaser.Gamepad.XBOX360_A)) {
                    _this.skipHandler();
                }
            };
            this.stopCallback = stopCallback;
        }
        Dialogue.prototype.skipHandler = function () {
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
        };
        Dialogue.prototype.start = function () {
            var _this = this;
            TAVP.Globals.paused = true;
            this.active = true;
            this.currentText = 0;
            this.isReadyForNext = false;
            this.currentTextLines = [null, null, null, null];
            this.box.visible = true;
            for (var i = 0; i < 4; i++)
                this.textLines[i].visible = true;
            this.promptTimer = this.caller.time.events.loop(750, function () {
                if (_this.isReadyForNext)
                    _this.prompt.visible = !_this.prompt.visible;
            }, this.caller);
            this.showNextText();
        };
        Dialogue.prototype.showNextText = function () {
            var _this = this;
            this.prompt.visible = false;
            this.isReadyForNext = false;
            this.currentLine = 0;
            if (this.currentText < this.texts.length) {
                for (var i = 0; i < this.textLines.length; i++)
                    this.textLines[i].text = '';
                this.currentTextLines = this.divideText(this.texts[this.currentText]);
                this.timer = this.caller.game.time.events.loop(80, function () {
                    if (_this.currentLine < _this.currentTextLines.length) {
                        if (_this.textLines[_this.currentLine].text.length < _this.currentTextLines[_this.currentLine].length)
                            _this.textLines[_this.currentLine].text = _this.currentTextLines[_this.currentLine].substr(0, _this.textLines[_this.currentLine].text.length + 1);
                        else
                            _this.currentLine++;
                    }
                    else {
                        _this.caller.game.time.events.remove(_this.timer);
                        _this.isReadyForNext = true;
                    }
                }, this.caller);
            }
            else
                this.stop();
        };
        Dialogue.prototype.stop = function () {
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
            this.stopCallback();
        };
        Dialogue.prototype.divideText = function (text) {
            var textArr = [];
            var letter = new Phaser.Text(this.caller.game, 0, 0, 'a', this.textStyle);
            var letterWidth = letter.width;
            letter.destroy();
            var howManyLines = Math.ceil((letterWidth * text.length) / this.box.width) + this.countNewlines(text);
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
        };
        Dialogue.prototype.countCharsFromArray = function (text) {
            var sum = 0;
            for (var i = 0; i < text.length; i++)
                for (var j = 0; j < text[i].length; j++)
                    sum++;
            return sum;
        };
        Dialogue.prototype.countNewlines = function (text) {
            var count = 0;
            for (var i = 0; i < text.length; i++)
                if (text[i] == '\n')
                    count++;
            return count;
        };
        return Dialogue;
    }());
    TAVP.Dialogue = Dialogue;
})(TAVP || (TAVP = {}));
var TAVP;
(function (TAVP) {
    var GamePadUtils = (function () {
        function GamePadUtils() {
            this.anyUp = false;
            this.padCooldown = 0;
        }
        Object.defineProperty(GamePadUtils, "instance", {
            get: function () {
                if (!GamePadUtils.internalInstance) {
                    GamePadUtils.internalInstance = new GamePadUtils();
                }
                return GamePadUtils.internalInstance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GamePadUtils.prototype, "dpadAxifiedX", {
            get: function () {
                return TAVP.Globals.game.input.gamepad.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT)
                    ? -1
                    : (TAVP.Globals.game.input.gamepad.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT)
                        ? 1
                        : 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GamePadUtils.prototype, "dpadAxifiedY", {
            get: function () {
                return TAVP.Globals.game.input.gamepad.pad1.justReleased(Phaser.Gamepad.XBOX360_DPAD_UP)
                    ? -1
                    : (TAVP.Globals.game.input.gamepad.pad1.justReleased(Phaser.Gamepad.XBOX360_DPAD_DOWN)
                        ? 1
                        : 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GamePadUtils.prototype, "padStatus", {
            get: function () {
                return TAVP.Globals.game.input.gamepad.supported && TAVP.Globals.game.input.gamepad.active && TAVP.Globals.game.input.gamepad.pad1.connected;
            },
            enumerable: true,
            configurable: true
        });
        GamePadUtils.prototype.isDown = function (button) {
            return this.padStatus && TAVP.Globals.game.input.gamepad.pad1.isDown(button);
        };
        GamePadUtils.prototype.isJustDown = function (button) {
            return this.padStatus && TAVP.Globals.game.input.gamepad.pad1.justPressed(button);
        };
        GamePadUtils.prototype.isUp = function (button) {
            return this.padStatus && TAVP.Globals.game.input.gamepad.pad1.isUp(button);
        };
        Object.defineProperty(GamePadUtils.prototype, "axisX", {
            get: function () {
                return this.padStatus && (this.dpadAxifiedX || TAVP.Globals.game.input.gamepad.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GamePadUtils.prototype, "axisY", {
            get: function () {
                return this.padStatus && (this.dpadAxifiedY || TAVP.Globals.game.input.gamepad.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y));
            },
            enumerable: true,
            configurable: true
        });
        GamePadUtils.prototype.setOnDown = function (button, callback) {
            var _this = this;
            TAVP.Globals.game.input.gamepad.pad1.onDownCallback = function () {
                if (_this.padStatus) {
                    callback();
                }
            };
        };
        GamePadUtils.internalInstance = null;
        return GamePadUtils;
    }());
    TAVP.GamePadUtils = GamePadUtils;
})(TAVP || (TAVP = {}));
var TAVP;
(function (TAVP) {
    var LifeManager = (function () {
        function LifeManager(game) {
            this.hearts = game.add.group();
            this.hearts.fixedToCamera = true;
            this.hp = TAVP.Config.maxHearts;
            this.isInvincible = false;
            for (var i = 0; i < TAVP.Config.maxHearts; i++) {
                var sprite = new Phaser.Sprite(game, 0, 0, 'heart', 0);
                sprite.x = i * sprite.width;
                this.hearts.add(sprite);
            }
            game.add.existing(this.hearts);
            game.world.bringToTop(this.hearts);
        }
        LifeManager.prototype.decreaseLife = function () {
            var _this = this;
            if (!this.isInvincible) {
                this.hp--;
                this.updateLife();
                if (this.hp <= 0) {
                    return true;
                }
                this.isInvincible = true;
                TAVP.Globals.game.time.events.add(4 * Phaser.Timer.SECOND, function () { _this.isInvincible = false; }, this);
            }
            return false;
        };
        LifeManager.prototype.updateLife = function () {
            for (var i = 0; i < TAVP.Config.maxHearts; i++) {
                if (i < this.hp) {
                    this.hearts.getAt(i).frame = 0;
                }
                else {
                    this.hearts.getAt(i).frame = 1;
                }
            }
        };
        LifeManager.prototype.resetLife = function () {
            this.hp = TAVP.Config.maxHearts;
            this.updateLife();
        };
        LifeManager.prototype.hide = function () {
            this.hearts.visible = false;
        };
        LifeManager.prototype.show = function () {
            this.hearts.visible = true;
        };
        return LifeManager;
    }());
    TAVP.LifeManager = LifeManager;
})(TAVP || (TAVP = {}));
var TAVP;
(function (TAVP) {
    var Menu = (function () {
        function Menu(caller, centerXCoord, startYCoord, texts, notChosenStyle, chosenStyle) {
            this.caller = caller;
            this.texts = texts;
            this.notChosenStyle = notChosenStyle;
            this.chosenStyle = chosenStyle;
            this.options = [];
            this.menuState = 0;
            this.stateChanged = true;
            this.options.push(this.caller.game.add.text(0, 0, this.texts[0], this.notChosenStyle));
            this.options[0].x = centerXCoord - (this.options[0].width / 2);
            this.options[0].y = startYCoord;
            for (var i = 1; i < this.texts.length; i++) {
                this.options.push(this.caller.game.add.text(0, 0, this.texts[i], this.notChosenStyle));
                this.options[i].x = centerXCoord - (this.options[i].width / 2);
                this.options[i].y = startYCoord + ((this.options[i - 1].height * 0.75) * i);
            }
        }
        Menu.prototype.setCallbacks = function (handlers) {
            if (this.options.length == handlers.length) {
                this.upKey = this.caller.input.keyboard.addKey(Phaser.Keyboard.UP);
                this.downKey = this.caller.input.keyboard.addKey(Phaser.Keyboard.DOWN);
                this.enterKey = this.caller.input.keyboard.addKey(Phaser.Keyboard.ENTER);
                this.upKey.onDown.forget();
                this.downKey.onDown.forget();
                this.enterKey.onDown.forget();
                if (this.options.length > 1) {
                    this.upKey.onDown.add(this.upHandler.bind(this), this.caller);
                    this.downKey.onDown.add(this.downHandler.bind(this), this.caller);
                }
                this.enterKey.onDown.add(this.confirmHandler.bind(this), this.caller);
                this.handlers = handlers;
            }
        };
        Menu.prototype.upHandler = function () {
            this.options[this.menuState].setStyle(this.notChosenStyle);
            this.menuState--;
            if (this.menuState < 0)
                this.menuState = this.options.length - 1;
            this.stateChanged = true;
        };
        Menu.prototype.downHandler = function () {
            this.options[this.menuState].setStyle(this.notChosenStyle);
            this.menuState++;
            if (this.menuState > this.options.length - 1)
                this.menuState = 0;
            this.stateChanged = true;
        };
        Menu.prototype.confirmHandler = function (handlers) {
            this.handlers[this.menuState]();
        };
        Menu.prototype.update = function () {
            if ((new Date()).getTime() > TAVP.GamePadUtils.instance.padCooldown && TAVP.GamePadUtils.instance.axisY < -0.1) {
                TAVP.GamePadUtils.instance.padCooldown = (new Date()).getTime() + 250;
                this.upHandler();
            }
            if ((new Date()).getTime() > TAVP.GamePadUtils.instance.padCooldown && TAVP.GamePadUtils.instance.axisY > 0.1) {
                TAVP.GamePadUtils.instance.padCooldown = (new Date()).getTime() + 250;
                this.downHandler();
            }
            if ((new Date()).getTime() > TAVP.GamePadUtils.instance.padCooldown && TAVP.GamePadUtils.instance.isJustDown(Phaser.Gamepad.XBOX360_A)) {
                TAVP.GamePadUtils.instance.padCooldown = (new Date()).getTime() + 250;
                this.confirmHandler(this.handlers);
            }
            if (this.stateChanged) {
                this.stateChanged = false;
                this.options[this.menuState].setStyle(this.chosenStyle);
                return true;
            }
            return false;
        };
        return Menu;
    }());
    TAVP.Menu = Menu;
})(TAVP || (TAVP = {}));
var TAVP;
(function (TAVP) {
    var MessageScreen = (function () {
        function MessageScreen(endCallback) {
            this.game = TAVP.Globals.game;
            this.endCallback = endCallback;
            this.background = this.game.add.graphics(0, 0);
            this.background.beginFill(0x000000, 1);
            this.background.drawRect(0, 0, this.game.width, this.game.height);
            this.background.endFill();
            this.background.fixedToCamera = true;
            this.text = this.game.add.text(this.game.width / 2, (this.game.height / 2) * 0.7, "", TAVP.Config.messageStyle);
            this.text.anchor = new Phaser.Point(0.5, 0.5);
            this.text.align = 'center';
            this.text.fixedToCamera = true;
            this.pressAnyKey = this.game.add.text(this.game.width / 2, this.game.height * 0.85, 'Press Any Key', TAVP.Config.menuStyle);
            this.pressAnyKey.fontWeight = 'bold';
            this.pressAnyKey.anchor = new Phaser.Point(0.5, 0.5);
            this.pressAnyKey.fixedToCamera = true;
            this.background.visible = false;
            this.text.visible = false;
            this.pressAnyKey.visible = false;
        }
        MessageScreen.prototype.showEverything = function () {
            var _this = this;
            this.text.visible = true;
            this.text.bringToTop();
            this.pressAnyKey.visible = true;
            this.pressAnyKey.bringToTop();
            this.game.time.events.loop(750, function () {
                _this.pressAnyKey.visible = !_this.pressAnyKey.visible;
            }, this);
            this.game.input.keyboard.onDownCallback = this.endCallback;
            this.game.input.gamepad.pad1.onUpCallback = function () {
                _this.endCallback();
                _this.game.input.gamepad.pad1.onUpCallback = null;
            };
        };
        MessageScreen.prototype.show = function (message) {
            TAVP.Globals.paused = true;
            this.background.visible = true;
            this.text.text = message;
            this.background.alpha = 0;
            var tweenAlpha = this.game.add.tween(this.background).to({ alpha: 0.75 }, Phaser.Timer.SECOND, Phaser.Easing.Linear.None, true);
            tweenAlpha.onComplete.add(this.showEverything, this);
        };
        return MessageScreen;
    }());
    TAVP.MessageScreen = MessageScreen;
})(TAVP || (TAVP = {}));
var TAVP;
(function (TAVP) {
    var Timer = (function (_super) {
        __extends(Timer, _super);
        function Timer() {
            _super.call(this, TAVP.Globals.game, TAVP.Globals.game.width, -2, '', TAVP.Config.timerStyle);
            this.anchor = new Phaser.Point(1, 0);
            this.fixedToCamera = true;
            this.timer = this.game.time.create();
            this.timer.stop();
            this.visible = false;
            this.game.add.existing(this);
        }
        Timer.prototype.getTimeString = function () {
            return (this.timer.ms / 1000).toFixed(3).toString();
        };
        Timer.prototype.startTimer = function () {
            this.visible = true;
            this.timer.start();
        };
        Timer.prototype.stopTimer = function () {
            this.visible = false;
            this.timer.stop();
        };
        Timer.prototype.update = function () {
            this.text = this.getTimeString();
        };
        return Timer;
    }(Phaser.Text));
    TAVP.Timer = Timer;
})(TAVP || (TAVP = {}));
var TAVP;
(function (TAVP) {
    TAVP.Utilities = {
        render: function () {
            TAVP.Globals.pixel.context.drawImage(TAVP.Globals.game.canvas, 0, 0, TAVP.Globals.game.width, TAVP.Globals.game.height, 0, 0, TAVP.Globals.pixel.width, TAVP.Globals.pixel.height);
        },
        playMusic: function (soundName) {
            if (!TAVP.Globals.musicMuted) {
                if (!TAVP.Globals.music.isPlaying) {
                    if (TAVP.Globals.music.name == soundName) {
                        TAVP.Globals.music.volume = 1;
                        TAVP.Globals.music.play();
                    }
                    else {
                        TAVP.Globals.music.stop();
                        TAVP.Globals.music = this.add.audio(soundName);
                        TAVP.Globals.music.volume = 1;
                        TAVP.Globals.music.play();
                    }
                }
                else if (TAVP.Globals.music.name != soundName) {
                    TAVP.Globals.music.stop();
                    TAVP.Globals.music = this.add.audio(soundName);
                    TAVP.Globals.music.volume = 1;
                    TAVP.Globals.music.play();
                }
            }
            else if (TAVP.Globals.music.isPlaying) {
                TAVP.Globals.music.stop();
            }
        }
    };
})(TAVP || (TAVP = {}));
//# sourceMappingURL=tavp.js.map