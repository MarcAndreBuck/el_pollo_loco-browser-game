class World {
    /* ---------- Properties ---------- */

    ctx;
    canvas;
    keyboard;
    level;

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

    gameOver = false;
    hasWon = false;

    endscreen = null;
    blocked = false;

    /* ---------- Constructor ---------- */

    constructor(canvas, keyboard, level, screenManager) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level;
        this.worldWidth = level.worldWidth;
        this.ui = new UIManager(this);
        this.screenManager = screenManager;

        this.initCharacter();
        this.initUI();
        this.initSystems();
        this.initMaxBottles();

        this.camera = new Camera(this.worldWidth, this.canvas.width, 150, 300);

        this.endscreen = new Endscreen();

        this.gameLoop();
        this.controls = new CanvasControls(canvas, keyboard, this.screenManager);
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
        if (this.blocked) return;
        if (this.hasWon || this.gameOver) return;

        this.character.update();

        if (this.character.isDead) {
            this.camera.update(this.character);
            if (this.character.deathFinished) this.gameOver = true;
            return;
        }

        this.camera.update(this.character);

        this.updateLevelObjects();
        this.throwSystem.update();
        this.collisionSystem.update();
        Endboss.ensureSpawned(this);
        this.updateUI();
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
        if (this.bossFightStarted) { this.bossHealthBar.update(); }
    }

    /* ---------- Drawing ---------- */

    draw() {
        this.clearCanvas();
        this.drawWorldObjects();
        this.drawUI();
        this.debug.drawHitboxes();
        if (this.controls) {
            this.controls.draw(this.ctx);
        }
        this.drawEndscreen();
        this.ui.draw(this.ctx);

    }

    clearCanvas() {
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

    drawEndscreen() {
        if (!this.gameOver && !this.hasWon) return;
        this.endscreen.draw(this.ctx, this.canvas, this.hasWon);
    }

    /* ---------- Rendering Helpers ---------- */

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
}
