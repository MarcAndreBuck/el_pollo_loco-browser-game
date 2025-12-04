/**
 * Configuration for header bar button layout.
 */
const HEADER_BAR_CONFIG = {
    buttonWidth: 0.06,
    buttonHeight: 0.08,
    buttonY: 0.05,
    fullscreenX: 0.82,
    menuX: 0.74,
    muteX: 0.9
};

/**
 * Header bar that provides mute, fullscreen and menu controls.
 *
 * @class
 * @extends BaseScreen
 */
class HeaderBar extends BaseScreen {
    /**
     * @param {World} world - The current world instance.
     * @param {HTMLCanvasElement} canvas - The game canvas.
     * @param {ScreenManager} screenManager - Manages canvas scaling and fullscreen.
     */
    constructor(world, canvas, screenManager) {
        super(world, canvas, screenManager);

        this.isMuted = soundManager.muted;
        this.isFullscreen = !!document.fullscreenElement;

        /** @type {CanvasButton|null} */
        this.muteButton = null;

        /** @type {CanvasButton|null} */
        this.menuButton = null;

        /** @type {CanvasButton|null} */
        this.fullscreenButton = null;

        this.rebuildButtons();
    }

    /**
     * Checks whether the menu button should be visible.
     *
     * @returns {boolean} True if the menu button should be shown.
     */
    isMenuVisible() {
        return this.world.state === GAME_STATE.RUNNING;
    }

    /**
     * Rebuilds header buttons based on current state (menu visibility, mute state).
     *
     * @returns {void}
     */
    rebuildButtons() {
        const w = HEADER_BAR_CONFIG.buttonWidth;
        const h = HEADER_BAR_CONFIG.buttonHeight;
        const y = HEADER_BAR_CONFIG.buttonY;

        const fullscreen = this.createFullscreenButton(w, h, y);
        const mute = this.createMuteButton(w, h, y);
        const menu = this.isMenuVisible() ? this.createMenuButton(w, h, y) : null;

        this.applyButtons(fullscreen, mute, menu);
    }

    /**
     * Creates the fullscreen toggle button.
     *
     * @private
     * @param {number} w - Button width (relative).
     * @param {number} h - Button height (relative).
     * @param {number} y - Button y-position (relative).
     * @returns {CanvasButton}
     */
    createFullscreenButton(w, h, y) {
        return new CanvasButton(HEADER_BAR_CONFIG.fullscreenX, y, w, h, "⛶", state => state && this.toggleFullscreen(), "wood");
    }

    /**
     * Creates the mute toggle button.
     *
     * @private
     * @param {number} w - Button width (relative).
     * @param {number} h - Button height (relative).
     * @param {number} y - Button y-position (relative).
     * @returns {CanvasButton}
     */
    createMuteButton(w, h, y) {
        const label = this.isMuted ? "🔇" : "🔊";
        return new CanvasButton(HEADER_BAR_CONFIG.muteX, y, w, h, label, state => state && this.toggleMute(), "wood");
    }

    /**
     * Creates the menu toggle button.
     *
     * @private
     * @param {number} w - Button width (relative).
     * @param {number} h - Button height (relative).
     * @param {number} y - Button y-position (relative).
     * @returns {CanvasButton}
     */
    createMenuButton(w, h, y) {
        return new CanvasButton(HEADER_BAR_CONFIG.menuX, y, w, h, "☰", state => state && this.handleMenu(), "wood");
    }

    /**
     * Assigns buttons to instance properties and button list.
     *
     * @private
     * @param {CanvasButton} fullscreen
     * @param {CanvasButton} mute
     * @param {CanvasButton|null} menu
     * @returns {void}
     */
    applyButtons(fullscreen, mute, menu) {
        const buttons = menu ? [fullscreen, menu, mute] : [fullscreen, mute];

        this.fullscreenButton = fullscreen;
        this.menuButton = menu;
        this.muteButton = mute;
        this.buttons = buttons;
    }

    /**
     * Updates the mute button icon based on current mute state.
     *
     * @returns {void}
     */
    updateMuteIcon() {
        if (!this.muteButton) return;
        this.muteButton.text = this.isMuted ? "🔇" : "🔊";
    }

    /**
     * Toggles global sound mute state and updates the button icon.
     *
     * @returns {void}
     */
    toggleMute() {
        soundManager.toggleMute();
        this.isMuted = soundManager.muted;
        this.updateMuteIcon();
    }

    /**
     * Toggles fullscreen mode using the ScreenManager.
     *
     * @returns {void}
     */
    toggleFullscreen() {
        const manager = this.world.screenManager;
        if (!manager.isFullscreen) {
            manager.enterFullscreen();
        } else {
            manager.exitFullscreen();
        }
    }

    /**
     * Handles menu button logic: toggles between RUNNING and PAUSED states.
     *
     * @returns {void}
     */
    handleMenu() {
        const state = this.world.state;

        if (state === GAME_STATE.RUNNING) {
            this.world.setState(GAME_STATE.PAUSED);
            return;
        }

        if (state === GAME_STATE.PAUSED) {
            this.world.setState(GAME_STATE.RUNNING);
        }
    }

    /**
     * Draws the header bar buttons.
     *
     * @param {CanvasRenderingContext2D} ctx - Rendering context.
     * @returns {void}
     */
    draw(ctx) {
        this.drawButtons(ctx);
    }
}
