class MobileControls extends BaseScreen {
    /**
     * @param {World} world
     * @param {HTMLCanvasElement} canvas
     * @param {ScreenManager} screenManager
     * @param {Keyboard} keyboard
     */
    constructor(world, canvas, screenManager, keyboard) {
        super(world, canvas, screenManager);

        this.keyboard = keyboard;
        this.enabled = MobileControls.isMobilePlatform();

        this.buttons = this.enabled ? this.createButtons() : [];
    }

    static isMobilePlatform() {
        const isTouch = navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth < 760;
        return isTouch || isSmallScreen;
    }

    isActive() {
        return this.enabled && this.world.state === GAME_STATE.RUNNING;
    }

    createButtons() {
        const w = 0.10;
        const h = 0.08;
        const baseY = 0.83;
        const offsetY = 0.08;
        const y = baseY + offsetY;

        return [
            new CanvasButton(0.05, y, w, h, "◀", state => this.keyboard.LEFT = state),
            new CanvasButton(0.20, y, w, h, "▶", state => this.keyboard.RIGHT = state),
            new CanvasButton(0.85, y, w, h, "⭡", state => this.keyboard.SPACE = state),
            new CanvasButton(0.70, y, w, h, "🤾", state => this.keyboard.THROW = state),
        ];
    }

    handlePointerDown(x, y) {
        if (!this.isActive()) return;
        super.handlePointerDown(x, y);
    }

    handlePointerMove(x, y) {
        if (!this.isActive()) return false;
        return super.handlePointerMove(x, y);
    }

    handlePointerUp() {
        if (!this.isActive()) return;
        super.handlePointerUp();
    }

    draw(ctx) {
        if (!this.isActive()) return;
        this.drawButtons(ctx);
    }
}
