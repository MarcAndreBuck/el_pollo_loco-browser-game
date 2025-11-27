class CanvasButton {
    constructor(relX, relY, relW, relH, text, onChange) {
        this.relX = relX;
        this.relY = relY;
        this.relW = relW;
        this.relH = relH;
        this.text = text;
        this.onChange = onChange;
        this.pressed = false;
    }

    getRect(canvas) {
        const width = canvas.width;
        const height = canvas.height;
        const x = width * this.relX;
        const y = height * this.relY;
        const w = width * this.relW;
        const h = height * this.relH;
        return { x, y, w, h };
    }

    draw(ctx, canvas) {
        const rect = this.getRect(canvas);
        const x = rect.x;
        const y = rect.y;
        const w = rect.w;
        const h = rect.h;
        this.drawBackground(ctx, x, y, w, h);
        this.drawLabel(ctx, x, y, w, h);
    }

    drawBackground(ctx, x, y, w, h) {
        ctx.save();
        ctx.fillStyle = this.pressed ? "#ffffff33" : "#ffffff22";
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = "#ffffffcc";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
        ctx.restore();
    }

    drawLabel(ctx, x, y, w, h) {
        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = (h * 0.45) + "px Boogaloo";
        ctx.fillText(this.text, x + w / 2, y + h / 2);
        ctx.restore();
    }

    contains(canvas, px, py) {
        const rect = this.getRect(canvas);
        const x = rect.x;
        const y = rect.y;
        const w = rect.w;
        const h = rect.h;
        const insideX = px >= x && px <= x + w;
        const insideY = py >= y && py <= y + h;
        return insideX && insideY;
    }
}

