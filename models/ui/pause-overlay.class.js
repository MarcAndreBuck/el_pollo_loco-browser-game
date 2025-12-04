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
    * Builds all pause overlay buttons.
    * @returns {CanvasButton[]}
    */
    createButtons() {
        /** @type {CanvasButton[]} */
        const buttons = [];
        this.lastButtonY = 0;

        this.createCoreButtons(buttons);
        this.createControlsButton(buttons);
        this.createLegalButtons(buttons);

        return buttons;
    }

    /**
     * Creates main action buttons: Back, Restart, Back to Start.
     * @param {CanvasButton[]} buttons
     */
    createCoreButtons(buttons) {
        const c = PAUSE_OVERLAY_CONFIG;
        const w = c.buttonWidth;
        const h = c.buttonHeight;
        const gap = c.buttonGap;
        const centerX = 0.5 - w * 0.5;
        let y = 0.5 - h - gap;
        buttons.push(new CanvasButton(centerX, y, w, h, "Back to Game", s => s && this.onResume(), "wood"));
        y += h + gap;
        buttons.push(new CanvasButton(centerX, y, w, h, "Restart", s => s && this.onRestart(), "wood"));
        y += h + gap;
        buttons.push(new CanvasButton(centerX, y, w, h, "Back to Start", s => s && this.onBackToStart(), "wood"));
        this.lastButtonY = y;
    }

    /**
     * Adds the Controls button on desktop only.
     * @param {CanvasButton[]} buttons
     */
    createControlsButton(buttons) {
        if (ScreenManager.isMobileOrSmallScreen()) return;

        const c = PAUSE_OVERLAY_CONFIG;
        const w = c.buttonWidth;
        const h = c.buttonHeight;
        const gap = c.buttonGap;
        const centerX = 0.5 - w * 0.5;

        const y = this.lastButtonY + h + gap;
        buttons.push(new CanvasButton(centerX, y, w, h, "Controls", s => s && this.onControls(), "wood"));
        this.lastButtonY = y;
    }

    /**
     * Adds legal/privacy buttons at the bottom.
     * @param {CanvasButton[]} buttons
     */
    createLegalButtons(buttons) {
        const c = PAUSE_OVERLAY_CONFIG;
        const w = c.buttonWidth;
        const h = c.buttonHeight;
        const gap = c.buttonGap;
        const legalX = c.legalOffsetX;
        const half = w * 0.5;
        const smallW = w * 0.5 - legalX;
        const centerBottom = 0.5;
        const y = this.lastButtonY + h + gap * 2;

        buttons.push(new CanvasButton(centerBottom - half, y, smallW, h, "Datenschutz", s => s && this.openPrivacyPolicy(), "wood"));
        buttons.push(new CanvasButton(centerBottom + legalX, y, smallW, h, "Impressum", s => s && this.openLegalNotice(), "wood"));
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
