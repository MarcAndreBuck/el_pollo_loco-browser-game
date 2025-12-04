/**
 * Base class for UI screens such as Start, Pause, Win, Lose, Controls etc.
 * Handles drawing, background overlays, button management and pointer input.
 *
 * @class
 */
class BaseScreen {
    /**
     * Creates a new screen instance.
     *
     * @param {World} world - The current world instance.
     * @param {HTMLCanvasElement} canvas - The game canvas.
     * @param {ScreenManager} screenManager - Manages canvas scaling and resolution.
     */
    constructor(world, canvas, screenManager) {
        this.world = world;
        this.canvas = canvas;
        this.screenManager = screenManager;

        this.baseWidth = screenManager.baseWidth ?? canvas.width;
        this.baseHeight = screenManager.baseHeight ?? canvas.height;

        /** @type {CanvasButton[]} */
        this.buttons = [];
    }

    /**
     * Draws background and buttons.
     *
     * @param {CanvasRenderingContext2D} ctx - Rendering context.
     * @returns {void}
     */
    draw(ctx) {
        this.drawBackground(ctx);
        this.drawButtons(ctx);
    }

    /**
     * Draws a darkened background overlay.
     *
     * @param {CanvasRenderingContext2D} ctx
     * @returns {void}
     */
    drawBackground(ctx) {
        const w = this.baseWidth;
        const h = this.baseHeight;

        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    }

    /**
     * Draws all overlay buttons.
     *
     * @param {CanvasRenderingContext2D} ctx
     * @returns {void}
     */
    drawButtons(ctx) {
        this.buttons.forEach(btn => btn.draw(ctx, this.canvas));
    }

    /**
     * Triggers buttons on pointer/mouse down.
     *
     * @private
     * @param {CanvasButton[]} buttons
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    triggerButtons(buttons, x, y) {
        buttons.forEach(btn => {
            if (!btn) return;
            if (!btn.contains(this.canvas, x, y)) return;

            btn.pressed = true;
            btn.onChange(true);
        });
    }

    /**
     * Updates hover state for all buttons.
     *
     * @private
     * @param {CanvasButton[]} buttons
     * @param {number} x
     * @param {number} y
     * @returns {boolean} True if any button is hovered.
     */
    updateHover(buttons, x, y) {
        let hovering = false;

        buttons.forEach(btn => {
            if (!btn) return;
            const inside = btn.contains(this.canvas, x, y);
            btn.setHover(inside);
            if (inside) hovering = true;
        });

        return hovering;
    }

    /**
     * Resets pressed and hover state when pointer is released.
     *
     * @private
     * @param {CanvasButton[]} buttons
     * @returns {void}
     */
    resetButtons(buttons) {
        buttons.forEach(btn => {
            if (!btn) return;

            if (btn.pressed) btn.onChange(false);

            btn.pressed = false;
            btn.setHover(false);
        });
    }

    /**
     * Handles pointer/mouse down.
     *
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    handlePointerDown(x, y) {
        this.triggerButtons(this.buttons, x, y);
    }

    /**
     * Handles pointer/mouse move.
     *
     * @param {number} x
     * @param {number} y
     * @returns {boolean} True if hovering a button.
     */
    handlePointerMove(x, y) {
        return this.updateHover(this.buttons, x, y);
    }

    /**
     * Handles pointer/mouse up.
     *
     * @returns {void}
     */
    handlePointerUp() {
        this.resetButtons(this.buttons);
    }

    /**
     * Optional override for screens that need cleanup.
     *
     * @returns {void}
     */
    close() {}

    /**
     * Opens the controls/help overlay.
     *
     * @returns {void}
     */
    openControls() {
        this.world.controlsOverlay.show();
    }

    /**
     * Navigates to the legal notice page.
     *
     * @returns {void}
     */
    openLegalNotice() {
        window.location.href = "impressum.html";
    }

    /**
     * Navigates to the privacy policy page.
     *
     * @returns {void}
     */
    openPrivacyPolicy() {
        window.location.href = "datenschutz.html";
    }
}
