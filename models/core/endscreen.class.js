class Endscreen {
    constructor(world) {
        this.world = world;
        this.isWin = false;

        this.winImage = null;
        this.loseImage = null;

        this.buttons = this.createButtons();
    }

    /* ---------- Zufallsbild laden ---------- */
    getRandomImage(pathsArray) {
        const path = pathsArray[Math.floor(Math.random() * pathsArray.length)];
        const img = new Image();
        img.src = path;
        return img;
    }

    /* ---------- State ---------- */
    open(isWin) {
        this.isWin = isWin;

        // Jedes Mal neues Random-Bild
        this.winImage  = this.getRandomImage(ASSETS.start_and_end_screen.win);
        this.loseImage = this.getRandomImage(ASSETS.start_and_end_screen.game_over);

        this.world.activeOverlay = this;
        this.world.blocked = true;
    }

    close() {
        if (this.world.activeOverlay === this) {
            this.world.activeOverlay = null;
        }
        this.world.blocked = false;
    }

    /* ---------- Buttons (nebeneinander) ---------- */

    createButtons() {
        const bw = 0.30;
        const bh = 0.08;
        const gap = 0.05;
        const y = 0.85;

        const leftX  = 0.5 - (bw + gap) / 2;
        const rightX = 0.5 + (bw + gap) / 2;

        return [
            new CanvasButton(leftX,  y, bw, bh, "Restart",       () => this.onRestart(),     "wood"),
            new CanvasButton(rightX, y, bw, bh, "Back to Start", () => this.onBackToStart(), "wood"),
        ];
    }

    /* ---------- Zeichnen ---------- */

    draw(ctx) {
        const { width, height } = this.world.canvas;

        ctx.save();

        // Hintergrund abdunkeln
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, width, height);

        // Win oder Lose Bild wählen
        const img = this.isWin ? this.winImage : this.loseImage;

        // Bild skalieren und zentrieren
        const maxImgWidth  = width * 0.9;
        const maxImgHeight = height * 0.6;

        const scale = Math.min(
            maxImgWidth  / img.width,
            maxImgHeight / img.height
        );

        const drawW = img.width  * scale;
        const drawH = img.height * scale;
        const drawX = (width  - drawW) / 2;
        const drawY = height * 0.15;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        // Buttons
        this.buttons.forEach(btn => btn.draw(ctx, this.world.canvas));

        ctx.restore();
    }

    /* ---------- Pointer Events ---------- */

    handlePointerMove(x, y) {
        this.buttons.forEach(btn => {
            btn.setHover(btn.contains(this.world.canvas, x, y));
        });
    }

    handlePointerDown(x, y) {
        this.buttons.forEach(btn => {
            if (btn.contains(this.world.canvas, x, y)) {
                btn.pressed = true;
            }
        });
    }

    handlePointerUp() {
        this.buttons.forEach(btn => {
            if (btn.pressed && btn.hover) {
                btn.onClick();
            }
            btn.pressed = false;
        });
    }

    /* ---------- Button Actions ---------- */

    onRestart() {
        this.close();
        this.isWin = false;
        this.world.resetGame();
        
    }

    onBackToStart() {
        this.close();
        this.world.activeOverlay = this.world.startScreen;
    }
}
