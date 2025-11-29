class StartScreen extends BaseScreen {
    constructor(world, canvas, screenManager) {
        super(world, canvas, screenManager);

        this.backgroundImage = new Image();
        this.backgroundImage.src = 'assets/9_intro_outro_screens/start/startscreen_1.png'; // Anpassen falls nötig

        this.buttons = this.createButtons();
    }

    drawBackground(ctx) {
        ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }

    createButtons() {
        const w = 0.24;
        const h = 0.12;
        const y = 0.75;

        return [
            new CanvasButton(
                0.5 - w / 2, y, w, h,
                "▶ Start",
                () => this.startGame(),
                "green"
            ),
            new CanvasButton(
                0.18, y, w, h,
                "📖 Story",
                () => this.openStory(),
                "wood"
            ),
            new CanvasButton(
                0.82 - w, y, w, h,
                "🎮 Steuerung",
                () => this.openControls(),
                "wood"
            ),
        ];
    }

    startGame() {
        this.close();              // Overlay zu + activeOverlay = null
        this.world.resetGame();    // Spielzustand zurücksetzen
    }

    openStory() {
        console.log("Story öffnen (Screen später)");
    }

    openControls() {
        console.log("Steuerung öffnen (Screen später)");
    }
}
