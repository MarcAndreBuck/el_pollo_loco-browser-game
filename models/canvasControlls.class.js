class CanvasControls {
    constructor(canvas, keyboard) {
        this.enabled = CanvasControls.isMobilePlatform();
        if (!this.enabled) {
            return;
        }

        this.canvas = canvas;
        this.keyboard = keyboard;
        this.buttons = this.createButtons();
        this.bindMouseEvents();
        this.bindTouchEvents();
    }

    static isMobilePlatform() {
        const isTouch = navigator.maxTouchPoints > 0;
        const isSmall = window.innerWidth <= 900;
        return isTouch || isSmall;
    }

    createButtons() {
        const w = 0.16;
        const h = 0.16;
        const bottom = 0.80;

        return [
            new CanvasButton(0.06, bottom, w, h, "◀", (state) => {
                this.keyboard.LEFT = state;
            }),
            new CanvasButton(0.24, bottom, w, h, "▶", (state) => {
                this.keyboard.RIGHT = state;
            }),
            new CanvasButton(0.70, bottom + 0.02, w, h, "JUMP", (state) => {
                this.keyboard.SPACE = state;
            }),
            new CanvasButton(0.84, bottom - 0.06, w, h, "THROW", (state) => {
                this.keyboard.THROW = state;
            }),
        ];
    }

    bindMouseEvents() {
        this.canvas.addEventListener("mousedown", (event) => {
            this.onPointerDown(event);
        });

        this.canvas.addEventListener("mouseup", () => {
            this.onPointerUp();
        });
    }

    bindTouchEvents() {
        this.canvas.addEventListener("touchstart", (event) => {
            this.onTouchStart(event);
        }, { passive: false });

        this.canvas.addEventListener("touchend", () => {
            this.onPointerUp();
        });

        this.canvas.addEventListener("touchcancel", () => {
            this.onPointerUp();
        });
    }

    onPointerDown(event) {
        const pos = this.getCanvasPos(event);
        this.updatePressedState(pos.x, pos.y, true);
    }

    onTouchStart(event) {
        const touch = event.touches[0];
        const pos = this.getCanvasPos(touch);
        this.updatePressedState(pos.x, pos.y, true);
        event.preventDefault();
    }

    onPointerUp() {
        this.buttons.forEach((btn) => {
            if (btn.pressed) {
                btn.onChange(false);
            }
            btn.pressed = false;
        });
    }

    getCanvasPos(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return { x, y };
    }

    updatePressedState(x, y, isDown) {
        this.buttons.forEach((btn) => {
            const inside = btn.contains(this.canvas, x, y);
            btn.pressed = isDown && inside;
            btn.onChange(btn.pressed);
        });
    }

    draw(ctx) {
        if (!this.enabled) {
            return;
        }
        this.buttons.forEach((btn) => {
            btn.draw(ctx, this.canvas);
        });
    }
}
