class World {
    /* ---------- Properties ---------- */

    ctx;
    canvas;
    keyboard;
    level;

    character;
    collisionSystem;
    debug;

    camera_x = 0;
    worldWidth;

    coins = 0;
    bottles = 0;
    maxBottles = 0;

    projectiles = [];
    lastThrowTime = 0;

    bossFightStarted = false;
    endboss = null;
    bossHealthBar = null;

    gameOver = false;
    hasWon = false;
    endScreenImage = null;
    endLoader = null;

    /* ---------- Constructor ---------- */

    constructor(canvas, keyboard, level) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level;
        this.worldWidth = CONFIG.world.width;

        this.initCharacter();
        this.initUI();
        this.initSystems();
        this.initMaxBottles();
        this.initEndscreenLoader();

        this.gameLoop();
    }

    /* ---------- Level Object Getters (wichtig!) ---------- */

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
        if (this.hasWon || this.gameOver) return;

        this.character.update();

        if (this.character.isDead) {
            this.updateCamera();
            if (this.character.deathFinished) this.gameOver = true;
            return;
        }

        this.keepCharacterInBounds();
        this.updateCamera();

        this.updateLevelObjects();
        this.handleThrow();
        this.updateProjectiles();
        this.collisionSystem.update();
        this.checkBossTrigger();
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
        if (this.bossFightStarted) this.bossHealthBar?.update();
    }

    /* ---------- Drawing ---------- */

    draw() {
        this.clearCanvas();
        this.drawWorldObjects();
        this.drawUI();
        this.drawEndscreen();
        this.debug.drawHitboxes();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawWorldObjects() {
        this.addObjectToMap(this.backgroundObjects);
        this.addObjectToMap(this.clouds);
        this.addObjectToMap(this.collectables);
        this.addObjectToMap(this.enemies);
        this.addObjectToMap(this.projectiles);
        this.addToMap(this.character);
    }

    drawUI() {
        this.healthBar.draw(this.ctx);
        this.bottleBar.draw(this.ctx);
        this.coinCounter.draw(this.ctx, this);

        if (this.bossFightStarted) {
            this.bossHealthBar?.draw(this.ctx);
        }
    }

    drawEndscreen() {
        if (!this.gameOver && !this.hasWon) return;

        const screen = this.gameOver
            ? ASSETS.start_and_end_screen.game_over
            : ASSETS.start_and_end_screen.win;

        this.drawEndScreen(screen);
    }

    /* ---------- Boss Trigger ---------- */

    checkBossTrigger() {
        if (this.bossFightStarted) return;

        const TRIGGER = this.worldWidth * 0.6;
        if (this.character.x >= TRIGGER) {
            this.startBossFight();
        }
    }

    startBossFight() {
        this.bossFightStarted = true;

        this.endboss = new Endboss();
        this.endboss.world = this;   
        this.endboss.x = this.worldWidth - 350;
        this.level.enemies.push(this.endboss);

        this.bossHealthBar = new ChickenBossHealth(
            this.canvas.width - 240,
            10,
            this
        );
    }

    /* ---------- Throw Logic ---------- */

    handleThrow() {
        const now = performance.now();
        const COOLDOWN = 300;

        if (!this.keyboard.THROW) return;
        if (now - this.lastThrowTime < COOLDOWN) return;
        if (this.bottles <= 0) return;

        this.spawnThrowBottle();
        this.bottles--;
        this.lastThrowTime = now;
    }

    spawnThrowBottle() {
        const dir = this.character.otherDirection ? -1 : 1;
        const startX = this.character.x + (dir > 0 ? this.character.width * 0.6 : -10);
        const startY = this.character.y + this.character.height * 0.5;

        this.projectiles.push(new ThrowBottle(startX, startY, dir));
    }

    updateProjectiles() {
        this.projectiles.forEach(p => p.update());
        this.projectiles = this.projectiles.filter(p => !p.isDead);
    }

    /* ---------- Rendering Helpers ---------- */

    addObjectToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    addToMap(mo) {
        const drawX = mo.x - this.camera_x;
        this.ctx.save();

        if (mo.otherDirection) {
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(mo.img, -drawX - mo.width, mo.y, mo.width, mo.height);
        } else {
            this.ctx.drawImage(mo.img, drawX, mo.y, mo.width, mo.height);
        }

        this.ctx.restore();
    }

    /* ---------- Camera ---------- */

    keepCharacterInBounds() {
        const right = this.worldWidth - this.character.width;
        this.character.x = Math.max(0, Math.min(this.character.x, right));
    }

    updateCamera() {
        const offset = (this.canvas.width - this.character.width) / 2;
        const target = this.character.x - offset;
        const max = this.worldWidth - this.canvas.width;

        this.camera_x = Math.max(0, Math.min(target, max));
    }

    /* ---------- Endscreen ---------- */

    initEndscreenLoader() {
        this.endLoader = new MovableObject();
        this.endLoader.loadImages([
            ...ASSETS.start_and_end_screen.game_over,
            ...ASSETS.start_and_end_screen.win,
        ]);
    }

    drawEndScreen(imageList) {
        this.endScreenImage ??= this.endLoader.imageCache[
            imageList[Math.floor(Math.random() * imageList.length)]
        ];

        this.ctx.save();
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();

        this.ctx.drawImage(this.endScreenImage, 0, 0, this.canvas.width, this.canvas.height);
    }
}
