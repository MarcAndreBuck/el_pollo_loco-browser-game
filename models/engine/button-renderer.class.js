/**
 * Utility class for rendering styled canvas buttons.
 * Supports wood and green styles with hover and pressed states.
 */
class ButtonRenderer {
    /**
     * Draws a rounded rectangle path.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {number} r - Corner radius.
     */
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

    /**
     * Draws a styled button based on the given style name.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {string} text - Button label.
     * @param {boolean} pressed
     * @param {boolean} hover
     * @param {"wood"|"green"} style
     */
    static draw(ctx, x, y, w, h, text, pressed, hover, style) {
        if (style === "wood") {
            this.drawWood(ctx, x, y, w, h, text, pressed, hover);
        } else {
            this.drawGreen(ctx, x, y, w, h, text, pressed, hover);
        }
    }

    /**
     * Draws a green button variant.
     */
    static drawGreen(ctx, x, y, w, h, label, pressed, hover) {
        const radius = h / 2;
        this.applyPressedOffset(ctx, pressed);
        const grad = this.createGreenGradient(ctx, x, y, h, hover);

        this.roundRect(ctx, x, y, w, h, radius);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.lineWidth = hover ? 3 : 2;
        ctx.strokeStyle = hover ? "#225f1b" : "#1f4f15";
        ctx.stroke();

        this.drawLabel(ctx, x, y, w, h, label, 0.5, "#fff");
        ctx.restore();
    }

    /**
     * Draws a wood-style button variant.
     */
    static drawWood(ctx, x, y, w, h, label, pressed, hover) {
        this.applyPressedOffset(ctx, pressed);
        const grad = this.createWoodGradient(ctx, x, y, h, hover);

        this.roundRect(ctx, x, y, w, h, 18);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.lineWidth = hover ? 4 : 3;
        ctx.strokeStyle = "#5a3515";
        ctx.stroke();

        this.drawLabel(ctx, x, y, w, h, label, 0.45, "#fff7df");
        ctx.restore();
    }

    /**
     * Applies a vertical offset when button is pressed.
     * @param {CanvasRenderingContext2D} ctx
     * @param {boolean} pressed
     */
    static applyPressedOffset(ctx, pressed) {
        const offsetY = pressed ? 2 : 0;
        ctx.save();
        ctx.translate(0, offsetY);
    }

    /**
     * Creates the gradient for green-style buttons.
     * @returns {CanvasGradient}
     */
    static createGreenGradient(ctx, x, y, h, hover) {
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

        return grad;
    }

    /**
     * Creates the gradient for wood-style buttons.
     * @returns {CanvasGradient}
     */
    static createWoodGradient(ctx, x, y, h, hover) {
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

        return grad;
    }

    /**
     * Draws the button label centered inside the button.
     * @param {CanvasRenderingContext2D} ctx
     */
    static drawLabel(ctx, x, y, w, h, text, factor, color) {
        ctx.fillStyle = color;
        ctx.font = `${h * factor}px rye, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, x + w / 2, y + h / 2);
    }
}
