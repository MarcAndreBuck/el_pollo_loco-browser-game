class PauseOverlay extends BaseScreen {
    constructor(world) {
        super(world, world.canvas, world.screenManager);
        this.buttons = this.createButtons();
    }

    /* ---------- Buttons ---------- */

    createButtons() {
        const buttonWidth = 0.35;
        const smallButtonWidth = buttonWidth * 0.5 - 0.01;

        const halfWidth = buttonWidth * 0.5;

        const buttonHeight = 0.08;
        const buttonGap = 0.015;

        const centerX = 0.5 - halfWidth;
        const centerXBottom = 0.5;
        let buttonY = 0.5 - buttonHeight - buttonGap;

        return [
            new CanvasButton(centerX, buttonY, buttonWidth, buttonHeight, "Back to Game", state => state && this.onResume(), "wood"),

            new CanvasButton(centerX, buttonY += buttonHeight + buttonGap, buttonWidth, buttonHeight, "Restart", state => state && this.onRestart(), "wood"),

            new CanvasButton(centerX, buttonY += buttonHeight + buttonGap, buttonWidth, buttonHeight, "Back to Start", state => state && this.onBackToStart(), "wood"),
            new CanvasButton(centerXBottom - halfWidth, buttonY += buttonHeight + buttonGap * 2, smallButtonWidth, buttonHeight, "Datenschutz", state => state && this.onPrivacy(), "wood"),
            new CanvasButton(centerXBottom + 0.01, buttonY, smallButtonWidth, buttonHeight, "Impressum", state => state && this.onImprint(), "wood"),
        ];
    }

    /* ---------- Hintergrund ---------- */

    drawBackground(ctx) {
        const { width, height } = this.canvas;

        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#fff";
        ctx.font = "32px Boogaloo, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Game paused", width / 2, height * 0.3);

        ctx.restore();
    }

    /* ---------- Button Actions ---------- */

    onResume() {
        this.world.setState(GAME_STATE.RUNNING);
    }

    onRestart() {
        this.world.resetGame();
        this.world.setState(GAME_STATE.RUNNING);
    }

    onBackToStart() {
        this.world.setState(GAME_STATE.START);
    }

    onPrivacy() {
        window.location.href = "datenschutz.html";
    }

    onImprint() {
        window.location.href = "impressum.html";
    }
}
