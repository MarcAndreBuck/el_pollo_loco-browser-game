/**
 * Configuration for default canvas button dimensions.
 */
const CANVAS_BUTTON_CONFIG = {
    baseWidth: 720,
    baseHeight: 480
};

/**
 * Represents an interactive button rendered on the canvas UI layer.
 *
 * @class
 */
class CanvasButton {
    /**
     * Creates a new canvas button.
     *
     * @param {number} relX - Relative x position (0–1).
     * @param {number} relY - Relative y position (0–1).
     * @param {number} relW - Relative width (0–1).
     * @param {number} relH - Relative height (0–1).
     * @param {string} text - Button label text.
     * @param {(pressed: boolean) => void} onChange - Callback for press/release.
     * @param {string} [style="green"] - Button visual style key.
     */
    constructor(relX, relY, relW, relH, text, onChange, style = "green") {
        Object.assign(this, { relX, relY, relW, relH, text, onChange, style });

        this.pressed = false;
        this.hover = false;

        this.baseWidth = CANVAS_BUTTON_CONFIG.baseWidth;
        this.baseHeight = CANVAS_BUTTON_CONFIG.baseHeight;
    }

    /**
     * Computes the absolute rectangle of the button in canvas coordinates.
     *
     * @returns {{x: number, y: number, w: number, h: number}}
     */
    getRect() {
        const w = this.baseWidth;
        const h = this.baseHeight;

        return {
            x: w * this.relX,
            y: h * this.relY,
            w: w * this.relW,
            h: h * this.relH
        };
    }

    /**
     * Draws the button using the ButtonRenderer.
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {HTMLCanvasElement} canvas
     * @returns {void}
     */
    draw(ctx, canvas) {
        const { x, y, w, h } = this.getRect();
        ButtonRenderer.draw(
            ctx,
            x,
            y,
            w,
            h,
            this.text,
            this.pressed,
            this.hover,
            this.style
        );
    }

    /**
     * Checks whether a given pointer position is inside the button.
     *
     * @param {HTMLCanvasElement} canvas
     * @param {number} px - Pointer x coordinate.
     * @param {number} py - Pointer y coordinate.
     * @returns {boolean} True if the pointer is inside the button.
     */
    contains(canvas, px, py) {
        const { x, y, w, h } = this.getRect();
        return px >= x && px <= x + w && py >= y && py <= y + h;
    }

    /**
     * Sets hover state for the button.
     *
     * @param {boolean} state
     * @returns {void}
     */
    setHover(state) {
        this.hover = state;
    }
}
