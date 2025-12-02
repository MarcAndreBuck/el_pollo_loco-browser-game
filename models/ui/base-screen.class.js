class BaseScreen {
    constructor(world, canvas, screenManager) {
        this.world = world;
        this.canvas = canvas;
        this.screenManager = screenManager;


        this.baseWidth = screenManager.baseWidth ;
        this.baseHeight = screenManager.baseHeight; 

        this.buttons = [];
    }

    draw(ctx) {
        this.drawBackground(ctx);
        this.drawButtons(ctx);
    }

    drawBackground(ctx) { }

    drawButtons(ctx) {
        this.buttons.forEach(btn => btn.draw(ctx, this.canvas));
    }

    /* ---------- Pointer-Events ---------- */

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
            if (btn.pressed) {
                btn.onChange(false);
            }
            btn.pressed = false;
        });
    }

    close() {}
}
