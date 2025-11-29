class CanvasButton {
    /**
     * @param {number} xRel   - relative x Position (0–1)
     * @param {number} yRel   - relative y Position (0–1)
     * @param {number} wRel   - relative Breite (0–1)
     * @param {number} hRel   - relative Höhe (0–1)
     * @param {string} label  - Button Text
     * @param {function} onClickOrChange - Callback (click oder change)
     * @param {string} style  - "wood" | "default"
     */
    constructor(xRel, yRel, wRel, hRel, label, onClickOrChange, style = "default") {
        this.xRel = xRel;
        this.yRel = yRel;
        this.wRel = wRel;
        this.hRel = hRel;

        this.label = label;
        this.style = style;

        // Controls nutzen onChange(state)
        // Overlays nutzen onClick()
        this.onClickOrChange = onClickOrChange;

        this.hover = false;
        this.pressed = false;
    }

    /** Absolute Position */
    getRect(canvas) {
        const { width, height } = canvas;

        const w = this.wRel * width;
        const h = this.hRel * height;

        const x = this.xRel * width - w / 2;
        const y = this.yRel * height - h / 2;

        return { x, y, w, h };
    }

    /** Pointer-Test */
    contains(canvas, px, py) {
        const { x, y, w, h } = this.getRect(canvas);
        return px >= x && px <= x + w && py >= y && py <= y + h;
    }

    /** Hover setzen */
    setHover(state) {
        this.hover = state;
    }

    /** Vom CanvasControls gesetzt */
    onChange(state) {
        if (!this.onClickOrChange) return;
        this.onClickOrChange(state); // Controls: state = true/false
    }

    /** Overlay-Klick */
    onClick() {
        if (!this.onClickOrChange) return;
        this.onClickOrChange(); // Overlays: kein state
    }

    /** Zeichnen */
    draw(ctx, canvas) {
        const { x, y, w, h } = this.getRect(canvas);

        ButtonRenderer.draw(
            ctx,
            x,
            y,
            w,
            h,
            this.label,
            this.pressed,
            this.hover,
            this.style
        );
    }
}
