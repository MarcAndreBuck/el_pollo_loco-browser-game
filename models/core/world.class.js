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
    renderer;

    /* ---------- Constructor ---------- */

    constructor(canvas, keyboard, level, screenManager) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level;
        this.worldWidth = level.worldWidth;
        this.screenManager = screenManager;
        this.ui = new UIManager(this);
        this.initCore();
        this.initCamera();
        this.initScreens();
        this.initControls();
        this.renderer = new WorldRenderer(this);
        this.setState(GAME_STATE.START);
        this.gameLoop();
    }

    initCore() {
        this.initCharacter();
        this.initUI();
        this.initSystems();
        this.initMaxBottles();
    }

    initCamera() {
        const viewportWidth = this.screenManager?.baseWidth || this.canvas.width;
        this.camera = new Camera(this.worldWidth, viewportWidth, 150, 300);
    }

    initScreens() {
        this.startScreen = new StartScreen(this, this.canvas, this.screenManager);
        this.pauseOverlay = new PauseOverlay(this);
        this.endscreen = new Endscreen(this);
    }

    initControls() {
        this.controls = new CanvasControls(
            this.canvas,
            this.keyboard,
            this.screenManager,
            this
        );
        this.controlsOverlay = new ControlsOverlay(
            this,
            this.canvas,
            this.screenManager
        );
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
        this.maxBottles = this.level.collectables.filter(
            c => c instanceof Bottle
        ).length;
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
            case GAME_STATE.PAUSED:
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
        this.camera.update(this.character);

        if (this.handleDeathState()) {
            return;
        }

        this.updateLevel();
        this.updateUI();
    }

    handleDeathState() {
        if (!this.character.isDead) {
            return false;
        }

        if (this.character.deathFinished && this.state === GAME_STATE.RUNNING) {
            this.setState(GAME_STATE.LOST);
        }

        return true;
    }

    updateLevel() {
        this.updateLevelObjects();
        this.throwSystem.update();
        this.collisionSystem.update();
        Endboss.ensureSpawned(this);
    }

    updateLevelObjects() {
        this.enemies.forEach(e => e.update());
        this.clouds.forEach(c => c.update());
        this.collectables.forEach(c => c.update());
        this.level.collectables = this.collectables.filter(
            c => !c.isCollected
        );
    }

    updateUI() {
        this.healthBar.update();
        this.bottleBar.update();

        if (this.bossFightStarted && this.bossHealthBar) {
            this.bossHealthBar.update();
        }
    }

    /* ---------- Drawing ---------- */

    draw() {
        this.renderer.draw();
    }

    /* ---------- Game Reset ---------- */

    resetGame(newLevel) {
        soundManager.stopAllAudio();
        soundManager.playMusic("music_level");
        this.resetLevel(newLevel);
        this.resetCounters();
        this.resetBossState();
        this.initMaxBottles();
        this.initCharacter();
        this.resetCamera();
        this.initUI();
        this.initSystems();
        this.setState(GAME_STATE.RUNNING);
    }

    resetLevel(newLevel) {
        if (!newLevel) {
            return;
        }

        this.level = newLevel;
        this.worldWidth = newLevel.worldWidth;
    }

    resetCounters() {
        this.coins = 0;
        this.bottles = 0;
        this.projectiles = [];
    }

    resetBossState() {
        this.bossFightStarted = false;
        this.endboss = null;
        this.bossHealthBar = null;
    }

    resetCamera() {
        const viewportWidth = this.screenManager.baseWidth;
        this.camera = new Camera(this.worldWidth, viewportWidth, 150, 300);
    }
}
