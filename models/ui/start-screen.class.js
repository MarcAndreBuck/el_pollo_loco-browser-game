class StartScreen extends BaseScreen {
    constructor(world, canvas, screenManager) {
        super(world, canvas, screenManager);

        this.backgroundImage = new Image();
        this.backgroundImage.src = "assets/9_intro_outro_screens/start/startscreen_1.png";

        this.buttons = this.createButtons();
    }

    drawBackground(ctx) {
        ctx.drawImage(this.backgroundImage, 0, 0, this.baseWidth, this.baseHeight);
    }

    createButtons() {
        return [
            ...this.createCenterButtons(),
            ...this.createBottomButtons(),
        ];
    }

    createCenterButtons() {
        const buttonWidth = 0.2;
        const buttonHeight = 0.08;
        const buttonY = 0.15;

        return [
            new CanvasButton(0.5 - buttonWidth - 0.05, buttonY, buttonWidth, buttonHeight, "controls", state => state && this.openControls(), "wood"),
            new CanvasButton(0.5 + 0.05, buttonY, buttonWidth, buttonHeight, "Story", state => state && this.openStory(), "wood"),
        ];
    }

    createBottomButtons() {
        const buttonWidth = 0.23;
        const buttonHeight = 0.10;
        const buttonY = 0.88;

        return [
            new CanvasButton(0.5 - buttonWidth / 2, buttonY, buttonWidth, buttonHeight, "▶ Start", state => state && this.startGame(), "green"),
            new CanvasButton(0.13, buttonY, buttonWidth, buttonHeight, "Legal Notice", state => state && this.openLegalNoctice(), "wood"),
            new CanvasButton(0.87 - buttonWidth, buttonY, buttonWidth, buttonHeight, "Privacy Policy", state => state && this.openPrivacyPolicy(), "wood"),
        ];
    }

    startGame() {
        restartGame()
        this.world.setState(GAME_STATE.RUNNING);
    }

    openStory() {
        window.location.href = "story.html";
    }
}
