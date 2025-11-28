class CanvasButton {
    constructor(relX, relY, relW, relH, text, onChange, style = "green") {
        Object.assign(this, { relX, relY, relW, relH, text, onChange, style });
        this.pressed = false;
        this.hover = false;
    }

    getRect(canvas) {
        const { width, height } = canvas;
        return {
            x: width * this.relX,
            y: height * this.relY,
            w: width * this.relW,
            h: height * this.relH,
        };
    }

    draw(ctx, canvas) {
        const { x, y, w, h } = this.getRect(canvas);
        ButtonRenderer.draw(
            ctx,
            x,
            y,
            w,
            h,
            this.text,
            this.pressed,
            this.hover,
            this.style
        );
    }

    contains(canvas, px, py) {
        const { x, y, w, h } = this.getRect(canvas);
        return px >= x && px <= x + w && py >= y && py <= y + h;
    }

    setHover(state) {
        this.hover = state;
    }
}
