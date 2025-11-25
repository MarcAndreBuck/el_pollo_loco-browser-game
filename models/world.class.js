class World {
    character;
    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    worldWidth;
    endScreenImage = null;
    hasWon = false;
    gameOver = false;
    endLoader;
    collisionSystem;
    debug;

    coins = 0;
    bottles = 0;
    maxBottles = 0;

    endboss = null;
    bossFightStarted = false;
    bossHealthBar = null;


    constructor(canvas, keyboard, level) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level;
        this.worldWidth = CONFIG.world.width;

        this.character = new Character();

        // Anzahl Flaschen im Level zählen
        this.maxBottles = this.level.collectables.filter(
            (c) => c instanceof Bottle
        ).length;

        // UI-Bars initialisieren
        this.healthBar  = new HealthBar(20, 10, this);
        this.bottleBar  = new BottleBar(20, 50, this);
        this.coinCounter = new CoinCounter(20, 100);

        this.collisionSystem = new CollisionSystem(this);
        this.debug = new DebugSystem(this);

        this.initEndscreenLoader();
        this.gameLoop();
    }

    /* ---------- Getter für Level-Objekte ---------- */

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

    /* ---------- Game-Loop ---------- */

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        if (this.gameOver || this.hasWon) return;

        this.character.update();

        if (this.character.isDead) {
            this.updateCamera();

            if (this.character.deathFinished) {
                this.gameOver = true;
            }
            return;
        }

        this.keepCharacterInBounds();
        this.updateCamera();

        this.enemies.forEach(e => e.update());
        this.clouds.forEach(c => c.update());
        this.level.collectables.forEach(c => c.update());
        this.level.collectables = this.level.collectables.filter(c => !c.isCollected);

        this.collisionSystem.update();

        // Boss-Kampf triggern, falls erreicht
        this.checkBossTrigger();

        // UI aktualisieren (Health, Bottles)
        this.updateUI();

        // Boss-Healthbar updaten, falls aktiv
        if (this.bossFightStarted && this.bossHealthBar) {
            this.bossHealthBar.update();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addObjectToMap(this.backgroundObjects);
        this.addObjectToMap(this.clouds);
        this.addObjectToMap(this.collectables);
        this.addObjectToMap(this.enemies);
        this.addToMap(this.character);

        this.drawUI();

        if (this.gameOver) {
            this.drawEndScreen(ASSETS.start_and_end_screen.game_over);
            return;
        }

        if (this.hasWon) {
            this.drawEndScreen(ASSETS.start_and_end_screen.win);
            return;
        }

        this.debug.drawHitboxes();
    }

    /* ---------- UI ---------- */

    updateUI() {
        this.healthBar.update();
        this.bottleBar.update();
    }

    drawUI() {
        this.healthBar.draw(this.ctx);
        this.bottleBar.draw(this.ctx);
        this.coinCounter.draw(this.ctx, this);

        if (this.bossFightStarted && this.bossHealthBar) {
            this.bossHealthBar.draw(this.ctx);
        }
    }

    /* ---------- Boss-Trigger ---------- */

    checkBossTrigger() {
        if (this.bossFightStarted) return;

        const BOSS_TRIGGER_X = this.worldWidth * 0.6;

        if (this.character.x >= BOSS_TRIGGER_X) {
            this.startBossFight();
        }
    }

    startBossFight() {
        this.bossFightStarted = true;

        this.endboss = new Endboss();
        this.endboss.x = this.worldWidth - 350;

        this.level.enemies.push(this.endboss);

        this.bossHealthBar = new ChickenBossHealth(
            this.canvas.width - 240,
            10,
            this
        );

        console.log("[World] Bossfight gestartet");
    }

    /* ---------- Render-Helper ---------- */

    addObjectToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    addToMap(mo) {
        const drawX = mo.x - this.camera_x;
        this.ctx.save();

        if (mo.otherDirection) {
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(
                mo.img,
                -drawX - mo.width,
                mo.y,
                mo.width,
                mo.height,
            );
        } else {
            this.ctx.drawImage(
                mo.img,
                drawX,
                mo.y,
                mo.width,
                mo.height,
            );
        }

        this.ctx.restore();
    }

    /* ---------- Kamera & Bewegung ---------- */

    keepCharacterInBounds() {
        const right = this.worldWidth - this.character.width;
        this.character.x = Math.max(0, Math.min(this.character.x, right));
    }

    updateCamera() {
        const centerOffset = (this.canvas.width - this.character.width) / 2;
        const target = this.character.x - centerOffset;
        const maxCameraX = this.worldWidth - this.canvas.width;

        this.camera_x = Math.max(0, Math.min(target, maxCameraX));
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

        this.ctx.drawImage(
            this.endScreenImage,
            0,
            0,
            this.canvas.width,
            this.canvas.height,
        );
    }
}
