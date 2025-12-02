class Endscreen extends BaseScreen {
    constructor(world) {
        super(world, world.canvas, world.screenManager);

        this.isWin = false;
        this.winImage = null;
        this.loseImage = null;

        this.buttons = this.createButtons();
    }

    /* ---------- Zufallsbild ---------- */

    getRandomImage(paths) {
        const path = paths[Math.floor(Math.random() * paths.length)];
        const img = new Image();
        img.src = path;
        return img;
    }

    /* ---------- Öffnen ---------- */

    open(isWin) {
        this.isWin = isWin;

        this.winImage = this.getRandomImage(ASSETS.start_and_end_screen.win);
        this.loseImage = this.getRandomImage(ASSETS.start_and_end_screen.game_over);

        soundManager.stopAllAudio();
        if (isWin) {
            soundManager.play("game_win");
        } else {
            soundManager.play("game_lose");
        }
    }

    /* ---------- Eigener Draw für Overlay ---------- */

    draw(ctx) {
        const width = this.baseWidth;
        const height = this.baseHeight;

        ctx.save();

        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, width, height);

        this.drawContent(ctx, width, height);

        this.drawButtons(ctx);

        ctx.restore();
    }

    /* ---------- Buttons ---------- */

    createButtons() {
        const buttonWidth = 0.30;
        const buttonHeight = 0.08;
        const gap = 0.05;
        const buttonY = 0.85;

        const leftX = 0.5 - buttonWidth - gap;
        const rightX = 0.5 + gap;

        return [
            new CanvasButton(leftX, buttonY, buttonWidth, buttonHeight, "Restart", state => state && this.onRestart(), "wood"),
            new CanvasButton(rightX, buttonY, buttonWidth, buttonHeight, "Back to Start", state => state && this.onBackToStart(), "wood"),
        ];
    }

    /* ---------- Bild zeichnen ---------- */

    drawContent(ctx, width, height) {
        const img = this.isWin ? this.winImage : this.loseImage;
        if (!img) return;

        const maxWidth = width * 0.9;
        const maxHeight = height * 0.7;

        const scale = Math.min(
            maxWidth / img.width,
            maxHeight / img.height
        );

        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const drawX = (width - drawW) / 2;
        const drawY = height * 0.15;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }

    /* ---------- Button Actions ---------- */

    onRestart() {
        this.world.resetGame();
        this.world.setState(GAME_STATE.RUNNING);
    }

    onBackToStart() {
        this.world.setState(GAME_STATE.START);
    }
}
