/**
 * Configuration for pause overlay layout and typography.
 */
const PAUSE_OVERLAY_CONFIG = {
    buttonWidth: 0.4,
    buttonHeight: 0.08,
    buttonGap: 0.015,
    legalOffsetX: 0.01,
    titleFontFactor: 0.125,
    titleYFactor: 0.1
};

/**
 * Pause overlay that shows pause title and action buttons.
 *
 * @class
 * @extends BaseScreen
 */
class PauseOverlay extends BaseScreen {
    /**
     * @param {World} world - The current world instance.
     */
    constructor(world) {
        super(world, world.canvas, world.screenManager);
        this.buttons = this.createButtons();
    }

    /**
     * Creates all pause screen buttons.
     *
     * @returns {CanvasButton[]}
     */
    createButtons() {
        const w = PAUSE_OVERLAY_CONFIG.buttonWidth;
        const h = PAUSE_OVERLAY_CONFIG.buttonHeight;
        const gap = PAUSE_OVERLAY_CONFIG.buttonGap;
        const legalX = PAUSE_OVERLAY_CONFIG.legalOffsetX;

        const half = w * 0.5;
        const smallW = w * 0.5 - legalX;
        const centerX = 0.5 - half;
        const centerBottom = 0.5;

        let y = 0.5 - h - gap;

        return [
            new CanvasButton(centerX, y, w, h, "Back to Game", s => s && this.onResume(), "wood"),
            new CanvasButton(centerX, (y += h + gap), w, h, "Restart", s => s && this.onRestart(), "wood"),
            new CanvasButton(centerX, (y += h + gap), w, h, "Back to Start", s => s && this.onBackToStart(), "wood"),
            new CanvasButton(centerX, (y += h + gap), w, h, "Controls", s => s && this.onControls(), "wood"),
            new CanvasButton(centerBottom - half, (y += h + gap * 2), smallW, h, "Privacy Policy", s => s && this.openPrivacyPolicy(), "wood"),
            new CanvasButton(centerBottom + legalX, y, smallW, h, "Legal Notice", s => s && this.openLegalNotice(), "wood")
        ];
    }

    /**
     * Draws the pause overlay background and title.
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    drawBackground(ctx) {
        this.drawDimmedLayer(ctx);
        this.drawPauseTitle(ctx);
    }

    /**
     * Draws a dark semi-transparent layer.
     *
     * @private
     * @param {CanvasRenderingContext2D} ctx
     */
    drawDimmedLayer(ctx) {
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, this.baseWidth, this.baseHeight);
        ctx.restore();
    }

    /**
     * Draws the "GAME PAUSE" title.
     *
     * @private
     * @param {CanvasRenderingContext2D} ctx
     */
    drawPauseTitle(ctx) {
        const { baseWidth: w, baseHeight: h } = this;
        ctx.save();
        ctx.font = `${h * PAUSE_OVERLAY_CONFIG.titleFontFactor}px Rye`;
        ctx.fillStyle = "#eec223";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.shadowColor = "#FF9300";
        ctx.shadowBlur = 20;
        ctx.fillText("GAME PAUSE", w / 2, h * PAUSE_OVERLAY_CONFIG.titleYFactor);
        ctx.shadowBlur = 0;
        ctx.restore();
    }

    /** @returns {void} */
    onResume() {
        this.world.setState(GAME_STATE.RUNNING);
    }

    /** @returns {void} */
    onRestart() {
        restartGame();
    }

    /** @returns {void} */
    onBackToStart() {
        this.world.setState(GAME_STATE.START);
        soundManager.stopAllAudio();
    }

    /** @returns {void} */
    onControls() {
        this.world.controlsOverlay.show();
    }
}
