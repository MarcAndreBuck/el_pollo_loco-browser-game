class PauseOverlay {
    constructor(world) {
        this.world = world;
        this.buttons = this.createButtons();
    }

    /* ---------- Buttons ---------- */

    createButtons() {
        const buttonWidth = 0.35;
        const buttonHeight = 0.08;
        const buttonGap = 0.015;

        const centerX = 0.5;
        let buttonY = 0.5 - buttonHeight - buttonGap;

        const halfWidth = buttonWidth * 0.5;
        const smallButtonWidth = buttonWidth * 0.5 - 0.01;

        return [
            new CanvasButton(
                centerX,
                buttonY,
                buttonWidth,
                buttonHeight,
                "Back to Game",
                () => this.onResume(),
                "wood"
            ),

            new CanvasButton(
                centerX,
                buttonY += buttonHeight + buttonGap,
                buttonWidth,
                buttonHeight,
                "Restart",
                () => this.onRestart(),
                "wood"
            ),

            new CanvasButton(
                centerX,
                buttonY += buttonHeight + buttonGap,
                buttonWidth,
                buttonHeight,
                "Back to Start",
                () => this.onBackToStart(),
                "wood"
            ),


            new CanvasButton(
                centerX - halfWidth * 0.5,
                buttonY += buttonHeight + buttonGap * 2,
                smallButtonWidth,
                buttonHeight,
                "Datenschutz",
                () => this.onPrivacy(),
                "wood"
            ),


            new CanvasButton(
                centerX + halfWidth * 0.5,
                buttonY,
                smallButtonWidth,
                buttonHeight,
                "Impressum",
                () => this.onImprint(),
                "wood"
            ),
        ];
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

    /* ---------- Pointer Events ---------- */

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
