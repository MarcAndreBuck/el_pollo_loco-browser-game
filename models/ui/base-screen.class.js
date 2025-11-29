class BaseScreen {
    constructor(world, canvas, screenManager) {
        this.world = world;
        this.canvas = canvas;
        this.screenManager = screenManager;

        this.isActive = true;
        this.buttons = [];
    }

    /** wird vom World-Loop aufgerufen */
    draw(ctx) {
        this.drawBackground(ctx);
        this.drawButtons(ctx);
    }

    /** optional überschreibbar */
    drawBackground(ctx) { }

    drawButtons(ctx) {
        this.buttons.forEach(btn => btn.draw(ctx, this.canvas));
    }

    /** Pointer-Events, werden von CanvasControls geroutet */
    handlePointerDown(x, y) {
        this.buttons.forEach(btn => {
            if (btn.contains(this.canvas, x, y)) {
                btn.pressed = true;
                btn.onChange(true);
            }
        });
    }

    handlePointerMove(x, y) {
        this.buttons.forEach(btn => {
            btn.setHover(btn.contains(this.canvas, x, y));
        });
    }

    handlePointerUp() {
        this.buttons.forEach(btn => {
            if (btn.pressed) btn.onChange(false);
            btn.pressed = false;
        });
    }

    /** Overlay beenden */
    close() {
        this.isActive = false;
        this.world.activeOverlay = null;
    }
}
