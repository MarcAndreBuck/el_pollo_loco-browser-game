/**
 * Configuration for the controls overlay layout and styling.
 */
const CONTROLS_OVERLAY_CONFIG = {
    boxWidthFactor: 0.7,
    boxHeightFactor: 0.6,
    titleYFactor: 0.26,
    startYFactor: 0.4,
    lineHeight: 40,
    titleFont: "42px rye",
    textFont: "24px rye",
    buttonWidth: 0.25,
    buttonHeight: 0.12,
    buttonY: 0.8
};

/**
 * Simple controls overlay that sits on top of the current screen.
 * It shows a semi-transparent background, a centered box with text
 * and a single "Back" button at the bottom.
 *
 * @class
 * @extends BaseScreen
 */
class ControlsOverlay extends BaseScreen {
    /**
     * @param {World} world - The current world instance.
     * @param {HTMLCanvasElement} canvas - The game canvas.
     * @param {ScreenManager} screenManager - Manages canvas scaling.
     */
    constructor(world, canvas, screenManager) {
        super(world, canvas, screenManager);
        this.visible = false;
        this.buttons = this.createButtons();
    }

    /**
     * Shows the overlay.
     *
     * @returns {void}
     */
    show() {
        this.visible = true;
    }

    /**
     * Hides the overlay.
     *
     * @returns {void}
     */
    hide() {
        this.visible = false;
    }

    /**
     * Toggles overlay visibility.
     *
     * @returns {void}
     */
    toggle() {
        this.visible = !this.visible;
    }

    /**
     * Creates and returns the button for this overlay.
     *
     * @private
     * @returns {CanvasButton[]} Array of configured buttons.
     */
    createButtons() {
        const w = CONTROLS_OVERLAY_CONFIG.buttonWidth;
        const h = CONTROLS_OVERLAY_CONFIG.buttonHeight;
        const y = CONTROLS_OVERLAY_CONFIG.buttonY;

        return [
            new CanvasButton(0.5 - w / 2, y, w, h, "Back", state => state && this.hide(), "green")
        ];
    }

    /**
     * Draws the overlay if it is visible.
     *
     * @param {CanvasRenderingContext2D} ctx - Rendering context.
     * @returns {void}
     */
    draw(ctx) {
        if (!this.visible) return;
        const width = this.baseWidth;
        const height = this.baseHeight;
        this.drawBackground(ctx, width, height);
        this.drawContent(ctx, width, height);
        this.drawButtons(ctx);
    }

    /**
     * Draws the darkened background and inner box.
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
    drawBackground(ctx, width, height) {
        super.drawBackground(ctx);
        ctx.save();

        const boxWidth = width * CONTROLS_OVERLAY_CONFIG.boxWidthFactor;
        const boxHeight = height * CONTROLS_OVERLAY_CONFIG.boxHeightFactor;
        const boxX = (width - boxWidth) / 2;
        const boxY = (height - boxHeight) / 2;

        ctx.fillStyle = "rgba(30, 15, 5, 0.95)";
        ctx.strokeStyle = "#FFD12A";
        ctx.lineWidth = 4;
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        ctx.restore();
    }

    /**
     * Draws the title and the controls text.
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
    drawContent(ctx, width, height) {
        this.drawTitle(ctx, width, height);
        this.drawControlLines(ctx, width, height);
    }

    /**
     * Draws the "Controls" title.
     *
     * @private
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
    drawTitle(ctx, width, height) {
        const centerX = width / 2;
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.font = CONTROLS_OVERLAY_CONFIG.titleFont;
        ctx.fillStyle = "#FFD12A";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 6;
        ctx.fillText("Controls", centerX, height * CONTROLS_OVERLAY_CONFIG.titleYFactor);
        ctx.shadowBlur = 0;
        ctx.restore();
    }

    /**
     * Draws the list of control instructions.
     *
     * @private
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
    drawControlLines(ctx, width, height) {
        const centerX = width / 2;
        const startY = height * CONTROLS_OVERLAY_CONFIG.startYFactor;
        const lineHeight = CONTROLS_OVERLAY_CONFIG.lineHeight;
        const lines = this.getControlLines();

        ctx.save();
        this.applyTextStyle(ctx);

        lines.forEach((text, index) => {
            ctx.fillText(text, centerX, startY + index * lineHeight);
        });

        ctx.restore();
    }

    /**
     * Returns the control description lines.
     *
     * @private
     * @returns {string[]} Control label lines.
     */
    getControlLines() {
        return [
            "←        : Move Left",
            "→        : Move Right",
            "Space    : Jump",
            "F        : Throw Bottle"
        ];
    }

    /**
     * Applies text style for the control lines.
     *
     * @private
     * @param {CanvasRenderingContext2D} ctx
     * @returns {void}
     */
    applyTextStyle(ctx) {
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.font = CONTROLS_OVERLAY_CONFIG.textFont;
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 0;
    }

    /**
     * Handles click/tap events forwarded from CanvasControls.
     *
     * @param {number} x - Pointer x coordinate in canvas space.
     * @param {number} y - Pointer y coordinate in canvas space.
     * @returns {void}
     */
    handleClick(x, y) {
        if (!this.visible) return;
        super.handlePointerDown(x, y);
    }

    /**
     * Handles pointer up events when the overlay is visible.
     *
     * @returns {void}
     */
    handlePointerUp() {
        if (!this.visible) return;
        super.handlePointerUp();
    }

    /**
     * Handles pointer move events when the overlay is visible.
     *
     * @param {number} x - Pointer x coordinate in canvas space.
     * @param {number} y - Pointer y coordinate in canvas space.
     * @returns {boolean|undefined} True if hovering a button, otherwise undefined when hidden.
     */
    handlePointerMove(x, y) {
        if (!this.visible) return;
        return super.handlePointerMove(x, y);
    }
}
