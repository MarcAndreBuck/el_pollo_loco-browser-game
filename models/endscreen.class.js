class Endscreen {
    constructor() {
        this.loader = new MovableObject();
        this.loader.loadImages([
            ...ASSETS.start_and_end_screen.game_over,
            ...ASSETS.start_and_end_screen.win,
        ]);
        this.currentImage = null;
    }

    draw(ctx, canvas, hasWon) {
        const list = hasWon
            ? ASSETS.start_and_end_screen.win
            : ASSETS.start_and_end_screen.game_over;

        if (!this.currentImage) {
            const randomPath = list[Math.floor(Math.random() * list.length)];
            this.currentImage = this.loader.imageCache[randomPath];
        }

        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        ctx.drawImage(this.currentImage, 0, 0, canvas.width, canvas.height);
    }

    reset() {
        this.currentImage = null;
    }
}
