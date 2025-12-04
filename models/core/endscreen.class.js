/**
 * Endscreen overlay shown after winning or losing the game.
 * Displays a random image and offers restart and back-to-start actions.
 */
class Endscreen extends BaseScreen {
    /**
     * @param {World} world - Active game world instance.
     */
    constructor(world) {
        super(world, world.canvas, world.screenManager);
        this.isWin = false;
        this.winImage = null;
        this.loseImage = null;
        this.buttons = this.createButtons();
    }

    /**
     * Returns a random image object from the given list of paths.
     * @param {string[]} paths - Array of image paths.
     * @returns {HTMLImageElement} Image instance with source set.
     */
    getRandomImage(paths) {
        const path = paths[Math.floor(Math.random() * paths.length)];
        const img = new Image();
        img.src = path;
        return img;
    }

    /**
     * Opens the endscreen with either win or lose state.
     * Loads random images and plays the corresponding sound.
     * @param {boolean} isWin - True if the player has won.
     */
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

    /**
     * Draws the dark overlay, endscreen image content and buttons.
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
     */
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

    /**
     * Creates the restart and back-to-start buttons.
     * @returns {CanvasButton[]} List of endscreen buttons.
     */
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

    /**
     * Draws the win or lose image centered and scaled within the screen.
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D context.
     * @param {number} width - Base screen width.
     * @param {number} height - Base screen height.
     */
    drawContent(ctx, width, height) {
        const img = this.isWin ? this.winImage : this.loseImage;
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

    /**
     * Button callback to restart the game.
     */
    onRestart() {
        restartGame();
    }

    /**
     * Button callback to return to the start state and stop all audio.
     */
    onBackToStart() {
        this.world.setState(GAME_STATE.START);
        stopAllAudio();
    }
}
