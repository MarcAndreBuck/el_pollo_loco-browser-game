/**
 * Configuration for the start screen layout and assets.
 */
const START_SCREEN_CONFIG = {
    backgroundImage: "assets/9_intro_outro_screens/start/startscreen_1.png",
    centerButtonWidth: 0.2,
    centerButtonHeight: 0.08,
    centerButtonY: 0.15,
    centerButtonGapX: 0.05,
    bottomButtonWidth: 0.23,
    bottomButtonHeight: 0.1,
    bottomButtonY: 0.88,
    bottomLegalX: 0.13,
    bottomPrivacyRightX: 0.87
};

/**
 * Start screen shown before the game begins.
 *
 * @class
 * @extends BaseScreen
 */
class StartScreen extends BaseScreen {
    /**
     * @param {World} world
     * @param {HTMLCanvasElement} canvas
     * @param {ScreenManager} screenManager
     */
    constructor(world, canvas, screenManager) {
        super(world, canvas, screenManager);

        this.backgroundImage = new Image();
        this.backgroundImage.src = START_SCREEN_CONFIG.backgroundImage;

        this.buttons = this.createButtons();
    }

    /**
     * Draws the full background.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawBackground(ctx) {
        ctx.drawImage(this.backgroundImage, 0, 0, this.baseWidth, this.baseHeight);
    }

    /**
     * Builds all buttons on the StartScreen.
     * @returns {CanvasButton[]}
     */
    createButtons() {
        return [
            ...this.createCenterButtons(),
            ...this.createBottomButtons()
        ];
    }

    /**
     * Creates the top-center row of buttons (Controls & Story).
     * @returns {CanvasButton[]}
     */
    createCenterButtons() {
        const w = START_SCREEN_CONFIG.centerButtonWidth;
        const h = START_SCREEN_CONFIG.centerButtonHeight;
        const y = START_SCREEN_CONFIG.centerButtonY;
        const gap = START_SCREEN_CONFIG.centerButtonGapX;

        return [
            new CanvasButton(0.5 - w - gap, y, w, h, "Controls", state => state && this.openControls(), "wood"),
            new CanvasButton(0.5 + gap, y, w, h, "Story", state => state && this.openStory(), "wood")
        ];
    }

    /**
     * Creates the bottom row (Start, Legal, Privacy).
     * @returns {CanvasButton[]}
     */
    createBottomButtons() {
        const w = START_SCREEN_CONFIG.bottomButtonWidth;
        const h = START_SCREEN_CONFIG.bottomButtonHeight;
        const y = START_SCREEN_CONFIG.bottomButtonY;

        return [
            new CanvasButton(0.5 - w / 2, y, w, h, "▶ Start", state => state && this.startGame(), "green"),
            new CanvasButton(START_SCREEN_CONFIG.bottomLegalX, y, w, h, "Legal Notice", state => state && this.openLegalNotice(), "wood"),
            new CanvasButton(START_SCREEN_CONFIG.bottomPrivacyRightX - w, y, w, h, "Privacy Policy", state => state && this.openPrivacyPolicy(), "wood")
        ];
    }

    /**
     * Starts the game.
     */
    startGame() {
        restartGame();
        this.world.setState(GAME_STATE.RUNNING);
    }

    /**
     * Opens the story page.
     */
    openStory() {
        window.location.href = "story.html";
    }
}
