class PauseOverlay {
    constructor(world) {
        this.world = world;
        this.buttons = this.createButtons();
    }

    /* ---------- Buttons ---------- */

    createButtons() {
        const bw = 0.35;
        const bh = 0.08;
        const gap = 0.015;

        let y = 0.5 - bh - gap;

        return [
            new CanvasButton(0.5, y, bw, bh, "Back to Game",
                () => this.onResume(),
                "wood"
            ),
            new CanvasButton(0.5, y += bh + gap, bw, bh, "Restart",
                () => this.onRestart(),
                "wood"
            ),
            new CanvasButton(0.5, y += bh + gap, bw, bh, "Back to Start",
                () => this.onBackToStart(),
                "wood"
            ),
            new CanvasButton(0.5 - bw * 0.25, y += bh + gap * 2, bw * 0.5 - 0.01, bh,
                "Datenschutz",
                () => this.onPrivacy(),
                "wood"
            ),
            new CanvasButton(0.5 + bw * 0.25, y, bw * 0.5 - 0.01, bh,
                "Impressum",
                () => this.onImprint(),
                "wood"
            ),
        ];
    }

    /* ---------- Overlay Control ---------- */

    open() {
        this.world.activeOverlay = this;
        this.world.blocked = true;
    }

    close() {
        if (this.world.activeOverlay === this) {
            this.world.activeOverlay = null;
        }
        this.world.blocked = false;
    }

    toggle() {
        if (this.world.activeOverlay === this) this.close();
        else this.open();
    }

    /* ---------- Zeichnen ---------- */

    draw(ctx) {
        const { width, height } = this.world.canvas;

        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#fff";
        ctx.font = "32px Boogaloo, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Game paused", width / 2, height * 0.3);

        this.buttons.forEach(btn => btn.draw(ctx, this.world.canvas));

        ctx.restore();
    }

    /* ---------- Pointer Events (von CanvasControls) ---------- */

    handlePointerMove(x, y) {
        this.buttons.forEach(btn =>
            btn.setHover(btn.contains(this.world.canvas, x, y))
        );
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

    onResume() {
        this.close();
    }

    onRestart() {
        this.close();
        this.world.resetGame();
    }

    onBackToStart() {
        this.close();
        this.world.activeOverlay = this.world.startScreen;
    }

    onPrivacy() {
        window.location.href = "datenschutz.html";
    }

    onImprint() {
        window.location.href = "impressum.html";
    }
}
