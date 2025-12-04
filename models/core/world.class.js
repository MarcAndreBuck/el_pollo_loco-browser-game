/**
 * All available game states for the world.
 * Used to control update and rendering flow.
 * @readonly
 * @enum {string}
 */
const GAME_STATE = {
    START: "start",
    RUNNING: "running",
    PAUSED: "paused",
    WON: "won",
    LOST: "lost",
};

/**
 * Main game world.
 * Holds level, player, systems, UI and game state.
 */
class World {

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

    headerBar;
    mobileControls;
    controlsOverlay;
    uiInput;
    renderer;

    /**
     * Creates a new world instance and starts the game loop.
     * @param {HTMLCanvasElement} canvas - Main canvas element.
     * @param {Keyboard} keyboard - Keyboard input handler.
     * @param {Level} level - Initial level configuration.
     * @param {ScreenManager} screenManager - Screen and scaling manager.
     */
    constructor(canvas, keyboard, level, screenManager) {
        this.initBase(canvas, keyboard, level, screenManager);

        this.initCore();
        this.initCamera();
        this.initScreens();
        this.initUIComponents();
        this.initRenderer();

        this.setState(GAME_STATE.START);
        this.gameLoop();
    }

    /**
     * Initializes base references like canvas, context and level.
     * @param {HTMLCanvasElement} canvas
     * @param {Keyboard} keyboard
     * @param {Level} level
     * @param {ScreenManager} screenManager
     */
    initBase(canvas, keyboard, level, screenManager) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level;
        this.worldWidth = level.worldWidth;
        this.screenManager = screenManager;
    }

    /**
     * Initializes core gameplay components and systems.
     */
    initCore() {
        this.initCharacter();
        this.initUI();
        this.initSystems();
        this.initMaxBottles();
    }

    /**
     * Initializes the camera using world width and viewport width.
     */
    initCamera() {
        const viewportWidth = this.screenManager.baseWidth || this.canvas.width;
        this.camera = new Camera(this.worldWidth, viewportWidth, 150, 300);
    }

    /**
     * Initializes start, pause and endscreen overlays.
     */
    initScreens() {
        this.startScreen = new StartScreen(this, this.canvas, this.screenManager);
        this.pauseOverlay = new PauseOverlay(this);
        this.endscreen = new Endscreen(this);
    }

    /**
     * Initializes header bar, mobile controls and controls overlay.
     */
    initUIComponents() {
        this.headerBar = new HeaderBar(this, this.canvas, this.screenManager);
        this.mobileControls = new MobileControls(
            this,
            this.canvas,
            this.screenManager,
            this.keyboard
        );
        this.controlsOverlay = new ControlsOverlay(
            this,
            this.canvas,
            this.screenManager
        );
    }

    /**
     * Initializes renderer and UI input handling.
     */
    initRenderer() {
        this.renderer = new WorldRenderer(this);
        this.uiInput = new UIInputManager(this, this.screenManager);
    }

    /**
     * Sets the current game state and triggers state-specific actions.
     * @param {string} newState - One of GAME_STATE values.
     */
    setState(newState) {
        this.state = newState;
        this.headerBar.rebuildButtons();

        if (newState === GAME_STATE.WON) {
            this.endscreen.open(true);
        }

        if (newState === GAME_STATE.LOST) {
            this.endscreen.open(false);
        }
    }

    /**
     * Checks whether the world is currently in running state.
     * @returns {boolean} True if game is running.
     */
    isRunning() {
        return this.state === GAME_STATE.RUNNING;
    }

    /**
     * Triggers a win state when the game is running.
     */
    triggerWin() {
        if (this.state === GAME_STATE.RUNNING) {
            this.setState(GAME_STATE.WON);
        }
    }

    /** @returns {Array<Enemies>} */
    get enemies() {
        return this.level.enemies;
    }

    /** @returns {Array<Object>} */
    get clouds() {
        return this.level.clouds;
    }

    /** @returns {Array<Object>} */
    get backgroundObjects() {
        return this.level.backgroundObjects;
    }

    /** @returns {Array<Object>} */
    get collectables() {
        return this.level.collectables;
    }

    /**
     * Creates the player character instance.
     */
    initCharacter() {
        this.character = new Character();
    }

    /**
     * Initializes health bar, bottle bar and coin counter.
     */
    initUI() {
        this.healthBar = new HealthBar(20, 10, this);
        this.bottleBar = new BottleBar(20, 50, this);
        this.coinCounter = new CoinCounter(20, 100);
    }

    /**
     * Initializes collision, debug and throw systems.
     */
    initSystems() {
        this.collisionSystem = new CollisionSystem(this);
        this.debug = new DebugSystem(this);
        this.throwSystem = new ThrowSystem(this);
    }

    /**
     * Calculates the maximum number of bottles in the current level.
     */
    initMaxBottles() {
        this.maxBottles = this.level.collectables
            .filter(c => c instanceof Bottle)
            .length;
    }

    /**
     * Main game loop: updates and draws the world each frame.
     */
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Updates the world based on the current state.
     */
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

    /**
     * Updates all running gameplay elements when game is active.
     */
    updateRunning() {
        this.character.update();
        this.camera.update(this.character);

        if (this.handleDeathState()) {
            return;
        }

        this.updateLevel();
        this.updateUI();
    }

    /**
     * Handles death state transition for the player.
     * @returns {boolean} True if death state handling is active.
     */
    handleDeathState() {
        if (!this.character.isDead) {
            return false;
        }

        if (this.character.deathFinished && this.state === GAME_STATE.RUNNING) {
            this.setState(GAME_STATE.LOST);
        }

        return true;
    }

    /**
     * Updates level-related objects and systems.
     */
    updateLevel() {
        this.updateLevelObjects();
        this.throwSystem.update();
        this.collisionSystem.update();
        Endboss.ensureSpawned(this);
    }

    /**
     * Updates enemies, clouds and collectables.
     * Also cleans up collected items.
     */
    updateLevelObjects() {
        this.enemies.forEach(e => e.update());
        this.clouds.forEach(c => c.update());
        this.collectables.forEach(c => c.update());
        this.level.collectables = this.collectables.filter(
            c => !c.isCollected
        );
    }

    /**
     * Updates UI elements such as health, bottles and boss bar.
     */
    updateUI() {
        this.healthBar.update();
        this.bottleBar.update();

        if (this.bossFightStarted && this.bossHealthBar) {
            this.bossHealthBar.update();
        }
    }

    /**
     * Delegates world rendering to the renderer.
     */
    draw() {
        this.renderer.draw();
    }

    /**
     * Resets the game with a new level and reinitializes core systems.
     * @param {Level} newLevel - Level to load for the reset.
     */
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

    /**
     * Replaces the current level and updates world width.
     * @param {Level} newLevel - New level instance.
     */
    resetLevel(newLevel) {
        this.level = newLevel;
        this.worldWidth = newLevel.worldWidth;
    }

    /**
     * Resets coin, bottle and projectile counters.
     */
    resetCounters() {
        this.coins = 0;
        this.bottles = 0;
        this.projectiles = [];
    }

    /**
     * Resets boss-related state and UI.
     */
    resetBossState() {
        this.bossFightStarted = false;
        this.endboss = null;
        this.bossHealthBar = null;
    }

    /**
     * Recreates the camera using current world width and base width.
     */
    resetCamera() {
        const viewportWidth = this.screenManager.baseWidth;
        this.camera = new Camera(this.worldWidth, viewportWidth, 150, 300);
    }
}
