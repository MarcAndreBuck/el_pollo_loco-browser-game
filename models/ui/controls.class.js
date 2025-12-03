class ControlsOverlay extends BaseScreen {
    /**
     * Simple controls overlay that sits on top of the current screen.
     * It shows a semi-transparent background, a centered box with text
     * and a single "Zurück" button at the bottom.
     *
     * @param {World} world
     * @param {HTMLCanvasElement} canvas
     * @param {ScreenManager} screenManager
     */
    constructor(world, canvas, screenManager) {
        super(world, canvas, screenManager);

        this.visible = false;
        this.buttons = this.createButtons();
    }

    /* ---------- Sichtbarkeit ---------- */

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    toggle() {
        this.visible = !this.visible;
    }

    /* ---------- Buttons ---------- */

    createButtons() {
        const buttonWidth = 0.25;
        const buttonHeight = 0.12;
        const buttonY = 0.8; // unten zentriert (relativ)

        return [
            new CanvasButton(
                0.5 - buttonWidth / 2,
                buttonY,
                buttonWidth,
                buttonHeight,
                "Back",
                state => state && this.hide(),
                "green"
            )
        ];
    }

    /* ---------- Drawing ---------- */

    /**
     * Wird von World.draw() aufgerufen, nachdem ScreenManager bereits skaliert hat.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        if (!this.visible) return;

        const width = this.baseWidth;
        const height = this.baseHeight;

        this.drawBackground(ctx, width, height);

        this.drawContent(ctx, width, height);
        this.drawButtons(ctx);
    }

    drawBackground(ctx, width, height) {
        super.drawBackground(ctx);
        ctx.save();

        const boxWidth = width * 0.7;
        const boxHeight = height * 0.6;
        const boxX = (width - boxWidth) / 2;
        const boxY = (height - boxHeight) / 2;

        ctx.fillStyle = "rgba(30, 15, 5, 0.95)";
        ctx.strokeStyle = "#FFD12A";
        ctx.lineWidth = 4;

        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        ctx.restore();
    }


    drawContent(ctx, width, height) {
        const centerX = width / 2;

        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "top";


        ctx.font = "42px rye";
        ctx.fillStyle = "#FFD12A";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 6;
        ctx.fillText("Controls", centerX, height * 0.26);


        ctx.shadowBlur = 0;
        ctx.font = "24px rye";
        ctx.fillStyle = "#FFFFFF";

        const startY = height * 0.40;
        const lineHeight = 40;

        const lines = [
            "←        : Move Left",
            "→        : Move Right",
            "Space    : Jump",
            "F        : Throw Bottle",
        ];

        lines.forEach((text, index) => {
            ctx.fillText(text, centerX, startY + index * lineHeight);
        });

        ctx.restore();
    }

    /* ---------- Pointer vom CanvasControls ---------- */

    // CanvasControls ruft bei offenem Overlay z.B. handleClick(x, y) auf:
    // -> wir mappen das einfach auf die Basis-Logik (PointerDown)

    handleClick(x, y) {
        if (!this.visible) return;
        super.handlePointerDown(x, y);
    }

    handlePointerUp() {
        if (!this.visible) return;
        super.handlePointerUp();
    }

    handlePointerMove(x, y) {
        if (!this.visible) return;
        super.handlePointerMove(x, y);
    }
}
