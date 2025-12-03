class PauseOverlay extends BaseScreen {
    constructor(world) {
        super(world, world.canvas, world.screenManager);
        this.buttons = this.createButtons();
    }

    createButtons() {
        const buttonWidth = 0.4;
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
            new CanvasButton(centerX, buttonY += buttonHeight + buttonGap, buttonWidth, buttonHeight, "Controls", state => state && this.onControls(), "wood"),
            new CanvasButton(centerXBottom - halfWidth, buttonY += buttonHeight + buttonGap * 2, smallButtonWidth, buttonHeight, "Privacy Policy", state => state && this.openPrivacyPolicy(), "wood"),
            new CanvasButton(centerXBottom + 0.01, buttonY, smallButtonWidth, buttonHeight, "Legal Notice", state => state && this.openLegalNoctice(), "wood"),
        ];
    }

    drawBackground(ctx) {
        const w = this.baseWidth;
        const h = this.baseHeight;

        ctx.save();

        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, w, h);
        this.drawPause(ctx, h, w)

        ctx.restore();
    }

    drawPause(ctx, h, w) {
        ctx.font = `${h * 0.125}px Rye`;
        ctx.fillStyle = "#eec223";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.shadowColor = "#FF9300";
        ctx.shadowBlur = 20;
        ctx.fillText("GAME PAUSE", w / 2, h * 0.1);
        ctx.shadowBlur = 0;
    }

    onResume() {
        this.world.setState(GAME_STATE.RUNNING);
    }

    onRestart() {
        restartGame();
    }

    onBackToStart() {
        this.world.setState(GAME_STATE.START);
        soundManager.stopAllAudio();
    }

    onControls() {
        this.world.controlsOverlay.show();
    }

    // onPrivacy / onImprint bleiben optional, falls du sie später brauchst
    onPrivacy() {
        window.location.href = "datenschutz.html";
    }

    onImprint() {
        window.location.href = "impressum.html";
    }
}
