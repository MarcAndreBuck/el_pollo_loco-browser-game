const GAME_STATE = {
    START: "start",
    RUNNING: "running",
    PAUSED: "paused",
    WON: "won",
    LOST: "lost",
};

class World {
    /* ---------- Properties ---------- */

    ctx;
    canvas;
    keyboard;
    level;

    startScreen;
    pauseOverlay;
    endscreen;

    character;
    collisionSystem;
    debug;
    throwSystem;

    camera;
    worldWidth;

    coins = 0;
    bottles = 0;
    maxBottles = 0;

    projectiles = [];

    bossFightStarted = false;
    endboss = null;
    bossHealthBar = null;

    state = GAME_STATE.START;

    ui;
    controls;

    /* ---------- Constructor ---------- */

    constructor(canvas, keyboard, level, screenManager) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level;
        this.worldWidth = level.worldWidth;
        this.screenManager = screenManager;

        this.ui = new UIManager(this);

        this.initCharacter();
        this.initUI();
        this.initSystems();
        this.initMaxBottles();

        const viewportWidth = this.screenManager?.baseWidth || this.canvas.width;
        this.camera = new Camera(this.worldWidth, viewportWidth, 150, 300);

        this.startScreen = new StartScreen(this, canvas, screenManager);
        this.pauseOverlay = new PauseOverlay(this);
        this.endscreen = new Endscreen(this);

        this.controls = new CanvasControls(canvas, keyboard, this.screenManager, this);

        this.setState(GAME_STATE.START);

        this.gameLoop();
    }

    /* ---------- State Helpers ---------- */

    setState(newState) {
        this.state = newState;

        if (newState === GAME_STATE.WON) {
            this.endscreen.open(true);
        }

        if (newState === GAME_STATE.LOST) {
            this.endscreen.open(false);
        }
    }

    isRunning() {
        return this.state === GAME_STATE.RUNNING;
    }

    triggerWin() {
        if (this.state === GAME_STATE.RUNNING) {
            this.setState(GAME_STATE.WON);
        }
    }

    /* ---------- Level Object Getters ---------- */

    get enemies() {
        return this.level.enemies;
    }

    get clouds() {
        return this.level.clouds;
    }

    get backgroundObjects() {
        return this.level.backgroundObjects;
    }

    get collectables() {
        return this.level.collectables;
    }

    /* ---------- Init Helpers ---------- */

    initCharacter() {
        this.character = new Character();
    }

    initUI() {
        this.healthBar = new HealthBar(20, 10, this);
        this.bottleBar = new BottleBar(20, 50, this);
        this.coinCounter = new CoinCounter(20, 100);
    }

    initSystems() {
        this.collisionSystem = new CollisionSystem(this);
        this.debug = new DebugSystem(this);
        this.throwSystem = new ThrowSystem(this);
    }

    initMaxBottles() {
        this.maxBottles = this.level.collectables.filter(c => c instanceof Bottle).length;
    }

    /* ---------- Game Loop ---------- */

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        switch (this.state) {
            case GAME_STATE.START:
                return;

            case GAME_STATE.PAUSED:
                return;

            case GAME_STATE.WON:
            case GAME_STATE.LOST:
                return;

            case GAME_STATE.RUNNING:
            default:
                this.updateRunning();
                return;
        }
    }

    updateRunning() {
        this.character.update();

        if (this.character.isDead) {
            this.camera.update(this.character);

            if (this.character.deathFinished && this.state === GAME_STATE.RUNNING) {
                this.setState(GAME_STATE.LOST);
            }
            return;
        }

        this.camera.update(this.character);

        this.updateLevelObjects();
        this.throwSystem.update();
        this.collisionSystem.update();
        Endboss.ensureSpawned(this);
        this.updateUI();

        if (this.endboss && this.endboss.isDead && this.state === GAME_STATE.RUNNING) {
            this.setState(GAME_STATE.WON);
        }
    }

    updateLevelObjects() {
        this.enemies.forEach(e => e.update());
        this.clouds.forEach(c => c.update());
        this.collectables.forEach(c => c.update());
        this.level.collectables = this.collectables.filter(c => !c.isCollected);
    }

    updateUI() {
        this.healthBar.update();
        this.bottleBar.update();
        if (this.bossFightStarted) {
            this.bossHealthBar.update();
        }
    }

    /* ---------- Drawing ---------- */

    draw() {
        switch (this.state) {
            case GAME_STATE.START:
                this.drawStartScreen();
                return;

            case GAME_STATE.PAUSED:
                this.drawGameplay();

                this.ctx.save();
                if (this.screenManager) {
                    this.ctx.scale(
                        this.screenManager.scaleX,
                        this.screenManager.scaleY
                    );
                }
                this.pauseOverlay.draw(this.ctx);
                this.controls.drawHeaderOnly(this.ctx);
                this.ctx.restore();
                return;

            case GAME_STATE.WON:
            case GAME_STATE.LOST:
                this.drawGameplay();

                this.ctx.save();
                if (this.screenManager) {
                    this.ctx.scale(
                        this.screenManager.scaleX,
                        this.screenManager.scaleY
                    );
                }
                this.endscreen.draw(this.ctx);
                this.controls.drawHeaderOnly(this.ctx);
                this.ctx.restore();
                return;

            case GAME_STATE.RUNNING:
            default:
                this.drawGameplay();
                return;
        }
    }

    drawStartScreen() {
        this.clearCanvas();

        this.ctx.save();

        if (this.screenManager) {
            this.ctx.scale(
                this.screenManager.scaleX,
                this.screenManager.scaleY
            );
        }

        this.startScreen.draw(this.ctx);
        this.controls.drawHeaderOnly(this.ctx);

        this.ctx.restore();
    }

    drawGameplay() {
        this.clearCanvas();

        this.ctx.save();

        if (this.screenManager) {
            this.ctx.scale(
                this.screenManager.scaleX,
                this.screenManager.scaleY
            );
        }

        this.drawWorldObjects();
        this.drawUI();
        this.debug.drawHitboxes();
        this.ui.draw(this.ctx);

        if (this.controls) {
            this.controls.draw(this.ctx);
        }

        this.ctx.restore();
    }

    clearCanvas() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawWorldObjects() {
        this.addObjectToMap(this.backgroundObjects);
        this.addObjectToMap(this.clouds);
        this.addObjectToMap(this.collectables);
        this.addToMap(this.character);
        this.addObjectToMap(this.enemies);
        this.addObjectToMap(this.projectiles);
    }

    drawUI() {
        this.healthBar.draw(this.ctx);
        this.bottleBar.draw(this.ctx);
        this.coinCounter.draw(this.ctx, this);

        if (this.bossFightStarted) {
            this.bossHealthBar.draw(this.ctx);
        }
    }

    addObjectToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    addToMap(mo) {
        const drawX = mo.x - this.camera.x;

        this.ctx.save();

        if (mo.otherDirection) {
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(
                mo.img,
                -drawX - mo.width,
                mo.y,
                mo.width,
                mo.height
            );
        } else {
            this.ctx.drawImage(
                mo.img,
                drawX,
                mo.y,
                mo.width,
                mo.height
            );
        }

        this.ctx.restore();
    }

    /* ---------- Game Reset ---------- */

    resetGame(newLevel) {
        soundManager.stopAllAudio()
        soundManager.playMusic("music_level");
        if (newLevel) {
            this.level = newLevel;
            this.worldWidth = newLevel.worldWidth;
        }

        this.coins = 0;
        this.bottles = 0;
        this.projectiles = [];

        this.bossFightStarted = false;
        this.endboss = null;
        this.bossHealthBar = null;

        this.initMaxBottles();
        this.initCharacter();

        const viewportWidth = this.screenManager.baseWidth;
        this.camera = new Camera(this.worldWidth, viewportWidth, 150, 300);

        this.initUI();
        this.initSystems();

        this.setState(GAME_STATE.RUNNING);
    }
}
