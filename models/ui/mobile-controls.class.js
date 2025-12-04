/**
 * Configuration for mobile on-screen controls.
 */
const MOBILE_CONTROLS_CONFIG = {
    buttonWidth: 0.1,
    buttonHeight: 0.08,
    baseY: 0.83,
    offsetY: 0.08,
    leftX: 0.05,
    rightX: 0.2,
    jumpX: 0.85,
    throwX: 0.7,
    mobileWidthThreshold: 760
};

/**
 * Provides on-screen controls for mobile/touch devices.
 *
 * @class
 * @extends BaseScreen
 */
class MobileControls extends BaseScreen {
    /**
     * @param {World} world - The current world instance.
     * @param {HTMLCanvasElement} canvas - The game canvas.
     * @param {ScreenManager} screenManager - Manages canvas scaling.
     * @param {Keyboard} keyboard - Keyboard abstraction to control input flags.
     */
    constructor(world, canvas, screenManager, keyboard) {
        super(world, canvas, screenManager);

        this.keyboard = keyboard;
        this.enabled = MobileControls.isMobilePlatform();
        this.buttons = this.enabled ? this.createButtons() : [];
    }

    /**
     * Detects whether the current platform should use mobile controls.
     *
     * @returns {boolean} True if touch or a small screen is detected.
     */
    static isMobilePlatform() {
        const isTouch = navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth < MOBILE_CONTROLS_CONFIG.mobileWidthThreshold;
        return isTouch || isSmallScreen;
    }

    /**
     * Checks whether the mobile controls are active and the game is running.
     *
     * @returns {boolean} True if controls should be processed and drawn.
     */
    isActive() {
        return this.enabled && this.world.state === GAME_STATE.RUNNING;
    }

    /**
     * Creates the on-screen control buttons and maps them to keyboard flags.
     *
     * @returns {CanvasButton[]} Array of configured mobile control buttons.
     */
    createButtons() {
        const w = MOBILE_CONTROLS_CONFIG.buttonWidth;
        const h = MOBILE_CONTROLS_CONFIG.buttonHeight;
        const y = MOBILE_CONTROLS_CONFIG.baseY + MOBILE_CONTROLS_CONFIG.offsetY;

        return [
            new CanvasButton(MOBILE_CONTROLS_CONFIG.leftX, y, w, h, "◀", state => { this.keyboard.LEFT = state; }),
            new CanvasButton(MOBILE_CONTROLS_CONFIG.rightX, y, w, h, "▶", state => { this.keyboard.RIGHT = state; }),
            new CanvasButton(MOBILE_CONTROLS_CONFIG.jumpX, y, w, h, "⭡", state => { this.keyboard.SPACE = state; }),
            new CanvasButton(MOBILE_CONTROLS_CONFIG.throwX, y, w, h, "🤾", state => { this.keyboard.THROW = state; })
        ];
    }

    /**
     * Handles pointer down events and forwards them to the base button logic.
     *
     * @param {number} x - Pointer x coordinate in canvas space.
     * @param {number} y - Pointer y coordinate in canvas space.
     * @returns {void}
     */
    handlePointerDown(x, y) {
        if (!this.isActive()) return;
        super.handlePointerDown(x, y);
    }

    /**
     * Handles pointer move events to update hover states.
     *
     * @param {number} x - Pointer x coordinate in canvas space.
     * @param {number} y - Pointer y coordinate in canvas space.
     * @returns {boolean|undefined} True if hovering a button, otherwise undefined when inactive.
     */
    handlePointerMove(x, y) {
        if (!this.isActive()) return false;
        return super.handlePointerMove(x, y);
    }

    /**
     * Handles pointer up events and resets button states.
     *
     * @returns {void}
     */
    handlePointerUp() {
        if (!this.isActive()) return;
        super.handlePointerUp();
    }

    /**
     * Draws mobile control buttons when active.
     *
     * @param {CanvasRenderingContext2D} ctx - Rendering context.
     * @returns {void}
     */
    draw(ctx) {
        if (!this.isActive()) return;
        this.drawButtons(ctx);
    }
}
