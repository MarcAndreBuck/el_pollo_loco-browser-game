class ButtonRenderer {
    static roundRect(ctx, x, y, w, h, r) {
        const radius = Math.min(r, h / 2, w / 2);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    static draw(ctx, x, y, w, h, text, pressed, hover, style) {
        if (style === "wood") {
            this.drawWood(ctx, x, y, w, h, text, pressed, hover);
        } else {
            this.drawGreen(ctx, x, y, w, h, text, pressed, hover);
        }
    }

    static drawGreen(ctx, x, y, w, h, label, pressed, hover) {
        const radius = h / 2;
        const offsetY = pressed ? 2 : 0;

        ctx.save();
        ctx.translate(0, offsetY);

        const grad = ctx.createLinearGradient(x, y, x, y + h);
        if (hover) {
            grad.addColorStop(0, "#c3ffb4");
            grad.addColorStop(0.5, "#6ed45b");
            grad.addColorStop(1, "#3f9631");
        } else {
            grad.addColorStop(0, "#7fe871");
            grad.addColorStop(0.5, "#47b43a");
            grad.addColorStop(1, "#2c7b22");
        }

        this.roundRect(ctx, x, y, w, h, radius);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.lineWidth = hover ? 3 : 2;
        ctx.strokeStyle = hover ? "#225f1b" : "#1f4f15";
        ctx.stroke();

        ctx.fillStyle = "#fff";
        ctx.font = `${h * 0.5}px Boogaloo, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, x + w / 2, y + h / 2);
        ctx.restore();
    }

    static drawWood(ctx, x, y, w, h, label, pressed, hover) {
        const offsetY = pressed ? 2 : 0;

        ctx.save();
        ctx.translate(0, offsetY);

        const grad = ctx.createLinearGradient(x, y, x, y + h);
        if (hover) {
            grad.addColorStop(0, "#fbe1a7");
            grad.addColorStop(0.5, "#d39545");
            grad.addColorStop(1, "#9a5f26");
        } else {
            grad.addColorStop(0, "#f7d28a");
            grad.addColorStop(0.5, "#c38a3a");
            grad.addColorStop(1, "#8b5a23");
        }

        this.roundRect(ctx, x, y, w, h, 18);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.lineWidth = hover ? 4 : 3;
        ctx.strokeStyle = "#5a3515";
        ctx.stroke();

        ctx.fillStyle = "#fff7df";
        ctx.font = `${h * 0.45}px Boogaloo, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, x + w / 2, y + h / 2);
        ctx.restore();

    }
}
