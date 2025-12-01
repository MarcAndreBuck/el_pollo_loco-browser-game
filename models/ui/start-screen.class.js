class StartScreen extends BaseScreen {
    constructor(world, canvas, screenManager) {
        super(world, canvas, screenManager);

        this.backgroundImage = new Image();
        this.backgroundImage.src = "assets/9_intro_outro_screens/start/startscreen_1.png";

        this.buttons = this.createButtons();
    }

    drawBackground(ctx) {
        ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }

    createButtons() {
        const buttonWidth = 0.24;
        const buttonHeight = 0.12;
        const buttonY = 0.75;

        const centerX = 0.5;
        const leftX = 0.18;
        const rightX = 0.82 - buttonWidth;

        return [
            new CanvasButton(
                centerX - buttonWidth / 2,
                buttonY,
                buttonWidth,
                buttonHeight,
                "▶ Start",
                () => this.startGame(),
                "green"
            ),
            new CanvasButton(
                leftX,
                buttonY,
                buttonWidth,
                buttonHeight,
                "📖 Story",
                () => this.openStory(),
                "wood"
            ),
            new CanvasButton(
                rightX,
                buttonY,
                buttonWidth,
                buttonHeight,
                "🎮 Steuerung",
                () => this.openControls(),
                "wood"
            ),
        ];
    }

    startGame() {
        this.world.resetGame();
        this.world.setState(GAME_STATE.RUNNING);
        this.close();
    }

    openStory() {
        console.log("Story öffnen (Screen später)");
    }

    openControls() {
        console.log("Steuerung öffnen (Screen später)");
    }
}
