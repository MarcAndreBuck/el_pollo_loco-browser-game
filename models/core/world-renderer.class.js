class WorldRenderer {
    constructor(world) {
        this.world = world;
        this.ctx = world.ctx;
    }

    draw() {
        const { state } = this.world;

        if (state === GAME_STATE.START) {
            this.drawStartScreen();
            return;
        }

        if (state === GAME_STATE.PAUSED) {
            this.drawPaused();
            return;
        }

        if (state === GAME_STATE.WON || state === GAME_STATE.LOST) {
            this.drawWithEndscreen();
            return;
        }

        this.drawRunning();
    }

    /* ---------- State-spezifisches Drawing ---------- */

    drawStartScreen() {
        this.clearCanvas();

        this.withScale(() => {
            this.world.startScreen.draw(this.ctx);
            this.world.headerBar.draw(this.ctx);
            this.world.controlsOverlay.draw(this.ctx);
        });
    }

    drawRunning() {
        this.clearCanvas();

        this.withScale(() => {
            this.drawWorldObjects();
            this.drawUI();
            this.world.debug.drawHitboxes();

            this.world.headerBar.draw(this.ctx);
            this.world.mobileControls.draw(this.ctx);
        });
    }

    drawPaused() {
        this.clearCanvas();

        this.withScale(() => {
            // Welt + HUD im Hintergrund
            this.drawWorldObjects();
            this.drawUI();

            // Overlay + Header oben drauf
            this.world.pauseOverlay.draw(this.ctx);
            this.world.headerBar.draw(this.ctx);
            this.world.controlsOverlay.draw(this.ctx);
        });
    }

    drawWithEndscreen() {
        this.clearCanvas();

        this.withScale(() => {
            // Welt + HUD im Hintergrund
            this.drawWorldObjects();
            this.drawUI();

            // Endscreen + Header oben drauf
            this.world.endscreen.draw(this.ctx);
            this.world.headerBar.draw(this.ctx);
        });
    }

    /* ---------- Canvas Helpers ---------- */

    clearCanvas() {
        const { ctx, world } = this;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);
    }

    withScale(renderFn) {
        const sm = this.world.screenManager;

        this.ctx.save();
        if (sm) {
            this.ctx.scale(sm.scaleX, sm.scaleY);
        }

        renderFn();
        this.ctx.restore();
    }

    /* ---------- World Content ---------- */

    drawWorldObjects() {
        const w = this.world;

        this.addObjectToMap(w.backgroundObjects);
        this.addObjectToMap(w.clouds);
        this.addObjectToMap(w.collectables);
        this.addToMap(w.character);
        this.addObjectToMap(w.enemies);
        this.addObjectToMap(w.projectiles);
    }

    drawUI() {
        const w = this.world;

        w.healthBar.draw(this.ctx);
        w.bottleBar.draw(this.ctx);
        w.coinCounter.draw(this.ctx, w);

        if (w.bossFightStarted && w.bossHealthBar) {
            w.bossHealthBar.draw(this.ctx);
        }
    }

    addObjectToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    addToMap(mo) {
        const { ctx, world } = this;
        const drawX = mo.x - world.camera.x;

        ctx.save();

        if (mo.otherDirection) {
            ctx.scale(-1, 1);
            ctx.drawImage(
                mo.img,
                -drawX - mo.width,
                mo.y,
                mo.width,
                mo.height
            );
        } else {
            ctx.drawImage(
                mo.img,
                drawX,
                mo.y,
                mo.width,
                mo.height
            );
        }

        ctx.restore();
    }
}
