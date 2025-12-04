/**
 * Handles all drawing for the world depending on the current game state.
 * Uses camera offset and screen scaling to render world and UI.
 */
class WorldRenderer {
    /**
     * @param {World} world - Active game world instance.
     */
    constructor(world) {
        this.world = world;
        this.ctx = world.ctx;
    }

    /**
     * Draws the world based on the current game state.
     */
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

    /* ---------- State-specific drawing ---------- */

    /**
     * Draws the start screen, header and controls overlay.
     */
    drawStartScreen() {
        this.clearCanvas();

        this.withScale(() => {
            this.world.startScreen.draw(this.ctx);
            this.world.headerBar.draw(this.ctx);
            this.world.controlsOverlay.draw(this.ctx);
        });
    }

    /**
     * Draws the running game: world, UI, debug and mobile controls.
     */
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

    /**
     * Draws the paused view with world, UI and pause overlays.
     */
    drawPaused() {
        this.clearCanvas();

        this.withScale(() => {
            this.drawWorldObjects();
            this.drawUI();

            this.world.pauseOverlay.draw(this.ctx);
            this.world.headerBar.draw(this.ctx);
            this.world.controlsOverlay.draw(this.ctx);
        });
    }

    /**
     * Draws the world with UI and endscreen on top.
     */
    drawWithEndscreen() {
        this.clearCanvas();

        this.withScale(() => {
            this.drawWorldObjects();
            this.drawUI();

            this.world.endscreen.draw(this.ctx);
            this.world.headerBar.draw(this.ctx);
        });
    }

    /* ---------- Canvas helpers ---------- */

    /**
     * Resets transform and clears the entire canvas.
     */
    clearCanvas() {
        const { ctx, world } = this;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);
    }

    /**
     * Wraps drawing in a save/restore block and applies screen scaling.
     * @param {Function} renderFn - Callback that performs the actual drawing.
     */
    withScale(renderFn) {
        const sm = this.world.screenManager;

        this.ctx.save();
        if (sm) {
            this.ctx.scale(sm.scaleX, sm.scaleY);
        }
        renderFn();
        this.ctx.restore();
    }

    /* ---------- World content ---------- */

    /**
     * Draws all world objects in the correct order.
     */
    drawWorldObjects() {
        const w = this.world;

        this.addObjectToMap(w.backgroundObjects);
        this.addObjectToMap(w.clouds);
        this.addObjectToMap(w.enemies);
        this.addToMap(w.character);
        this.addObjectToMap(w.collectables);
        this.addObjectToMap(w.projectiles);
    }

    /**
     * Draws UI elements like health, bottles, coins and boss bar.
     */
    drawUI() {
        const w = this.world;

        w.healthBar.draw(this.ctx);
        w.bottleBar.draw(this.ctx);
        w.coinCounter.draw(this.ctx, w);

        if (w.bossFightStarted && w.bossHealthBar) {
            w.bossHealthBar.draw(this.ctx);
        }
    }

    /**
     * Adds each object from an array to the render map.
     * @param {Array<MovableObject>} objects - Objects to draw.
     */
    addObjectToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    /**
     * Draws a single movable object with camera offset and flipping.
     * @param {MovableObject} mo - Object to render.
     */
    addToMap(mo) {
        const { ctx, world } = this;
        const drawX = mo.x - world.camera.x;
        const x = mo.otherDirection ? -drawX - mo.width : drawX;

        ctx.save();
        if (mo.otherDirection) ctx.scale(-1, 1);
        ctx.drawImage(mo.img, x, mo.y, mo.width, mo.height);
        ctx.restore();
    }
}
