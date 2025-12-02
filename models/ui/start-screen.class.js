class StartScreen extends BaseScreen {
    constructor(world, canvas, screenManager) {
        super(world, canvas, screenManager);

        this.backgroundImage = new Image();
        this.backgroundImage.src = "assets/9_intro_outro_screens/start/startscreen_1.png";

        this.buttons = this.createButtons();
    }

    drawBackground(ctx) {

        ctx.drawImage(
            this.backgroundImage,
            0,
            0,
            this.baseWidth,
            this.baseHeight
        );
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
            new CanvasButton(
                0.5 - buttonWidth - 0.05,
                buttonY,
                buttonWidth,
                buttonHeight,
                "Steuerung",
                state => state && this.startGame(),
                "wood"
            ),
            new CanvasButton(
                0.5 + 0.05,
                buttonY,
                buttonWidth,
                buttonHeight,
                "Story",
                state => state && this.openStory(),
                "wood"
            ),
        ];
    }

    createBottomButtons() {
        const buttonWidth = 0.2;
        const buttonHeight = 0.10;
        const buttonY = 0.88;

        return [
            new CanvasButton(
                0.5 - buttonWidth / 2,
                buttonY,
                buttonWidth,
                buttonHeight,
                "▶ Start",
                state => state && this.startGame(),
                "green"
            ),
            new CanvasButton(
                0.18,
                buttonY,
                buttonWidth,
                buttonHeight,
                "Impressum",
                state => state && this.openStory(),
                "wood"
            ),
            new CanvasButton(
                0.82 - buttonWidth,
                buttonY,
                buttonWidth,
                buttonHeight,
                "Datenschutz",
                state => state && this.openControls(),
                "wood"
            ),
        ];
    }

    startGame() {
        this.world.resetGame();
        this.world.setState(GAME_STATE.RUNNING);
    }

    openStory() {
        console.log("Story öffnen (Screen später)");
    }

    openControls() {
        console.log("Steuerung öffnen (Screen später)");
    }
}
