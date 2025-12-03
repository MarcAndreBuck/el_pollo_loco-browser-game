class BaseScreen {
    /**
     * @param {World} world
     * @param {HTMLCanvasElement} canvas
     * @param {ScreenManager} screenManager
     */
    constructor(world, canvas, screenManager) {
        this.world = world;
        this.canvas = canvas;
        this.screenManager = screenManager;

        this.baseWidth = screenManager?.baseWidth ?? canvas.width;
        this.baseHeight = screenManager?.baseHeight ?? canvas.height;

        /** @type {CanvasButton[]} */
        this.buttons = [];
    }

    /**
     * Default draw: background + buttons.
     * Child classes können draw() überschreiben, wenn nötig.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        this.drawBackground(ctx);
        this.drawButtons(ctx);
    }

    /**
     * Standard-Hintergrund: leicht abgedunkelt.
     * Spezifische Screens (Pause, Controls etc.) können das überschreiben.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawBackground(ctx) {
        const w = this.baseWidth;
        const h = this.baseHeight;

        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    }

    drawButtons(ctx) {
        this.buttons.forEach(btn => btn.draw(ctx, this.canvas));
    }

    /* ---------- Shared Button-Helpers ---------- */

    triggerButtons(buttons, x, y) {
        buttons.forEach(btn => {
            if (!btn) return;
            if (!btn.contains(this.canvas, x, y)) return;

            btn.pressed = true;
            btn.onChange(true);
        });
    }

    updateHover(buttons, x, y) {
        buttons.forEach(btn => {
            if (!btn) return;
            btn.setHover(btn.contains(this.canvas, x, y));
        });
    }

    resetButtons(buttons) {
        buttons.forEach(btn => {
            if (!btn) return;

            if (btn.pressed) {
                btn.onChange(false);
            }
            btn.pressed = false;
            btn.setHover(false);
        });
    }

    /* ---------- Pointer-Events (Standard-API für Screens) ---------- */

    handlePointerDown(x, y) {
        this.triggerButtons(this.buttons, x, y);
    }

    handlePointerMove(x, y) {
        this.updateHover(this.buttons, x, y);
    }

    handlePointerUp() {
        this.resetButtons(this.buttons);
    }

    close() { }

    openControls() {
        this.world.controlsOverlay.show();
    }

    openLegalNoctice() {
        window.location.href = "impressum.html";
    }
    openPrivacyPolicy() {
        window.location.href = "datenschutz.html";
    }
}
