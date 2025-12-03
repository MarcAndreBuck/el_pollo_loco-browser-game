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

        this.buttons = [];
    }

    draw(ctx) {
        this.drawBackground(ctx);
        this.drawButtons(ctx);
    }

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

    /* ---------- Buttons ---------- */

    triggerButtons(buttons, x, y) {
        buttons.forEach(btn => {
            if (!btn) return;
            if (!btn.contains(this.canvas, x, y)) return;

            btn.pressed = true;
            btn.onChange(true);
        });
    }

    updateHover(buttons, x, y) {
        let hovering = false;

        buttons.forEach(btn => {
            if (!btn) return;

            const inside = btn.contains(this.canvas, x, y);
            btn.setHover(inside);

            if (inside) {
                hovering = true;
            }
        });

        return hovering;
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

    /* ---------- Pointer-API ---------- */

    handlePointerDown(x, y) {
        this.triggerButtons(this.buttons, x, y);
    }

    handlePointerMove(x, y) {
        return this.updateHover(this.buttons, x, y);
    }

    handlePointerUp() {
        this.resetButtons(this.buttons);
    }

    /* ---------- Gemeinsame Actions ---------- */

    close() {}

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
