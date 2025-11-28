class CanvasControls {
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.enabled = CanvasControls.isMobilePlatform();

        this.isMuted = false;
        this.muteButton = null;
        this.menuButton = null;

        this.headerButtons = this.createHeaderButtons();
        this.controlButtons = this.enabled ? this.createControlButtons() : [];
        this.buttons = [...this.headerButtons, ...this.controlButtons];

        this.bindMouseEvents();
        this.bindTouchEvents();
    }

    static isMobilePlatform() {
        const isTouch = navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth < 760;
        return isTouch || isSmallScreen;
    }

    createControlButtons() {
        const w = 0.10;
        const h = 0.08;
        const bottom = 0.83;

        return [
            new CanvasButton(0.05, bottom + 0.08, w, h, "◀", state => this.keyboard.LEFT = state),
            new CanvasButton(0.20, bottom + 0.08, w, h, "▶", state => this.keyboard.RIGHT = state),
            new CanvasButton(0.85, bottom + 0.08, w, h, "⭡", state => this.keyboard.SPACE = state),
            new CanvasButton(0.70, bottom + 0.08, w, h, "🤾", state => this.keyboard.THROW = state),
        ];
    }

    createHeaderButtons() {
        const w = 0.10;
        const h = 0.08;
        const top = 0.05;

        const menu = new CanvasButton(0.7,top, w, h, "☰", state => { if (!state) return; this.handleMenu(); }, "wood");
        const mute = new CanvasButton(0.85, top, w, h, "🔊", state => { if (!state) return; this.toggleMute(); }, "wood");

        this.menuButton = menu;
        this.muteButton = mute;

        return [menu, mute];
    }

    bindMouseEvents() {
        this.canvas.addEventListener("mousedown", event => this.onPointerDown(event));
        this.canvas.addEventListener("mouseup", () => this.onPointerUp());
        this.canvas.addEventListener("mousemove", e => this.onMouseMove(e));
    }

    bindTouchEvents() {
        this.canvas.addEventListener("touchstart", event => this.onTouchStart(event), { passive: false });
        this.canvas.addEventListener("touchend", () => this.onPointerUp());
        this.canvas.addEventListener("touchcancel", () => this.onPointerUp());
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
        this.buttons.forEach(btn => {
            if (btn.pressed) btn.onChange(false);
            btn.pressed = false;
        });
    }

    getCanvasPos(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    updatePressedState(x, y, isDown) {
        this.buttons.forEach(btn => {
            const inside = btn.contains(this.canvas, x, y);
            btn.pressed = isDown && inside;
            btn.onChange(btn.pressed);
        });
    }

    onMouseMove(event) {
        const pos = this.getCanvasPos(event);

        this.buttons.forEach(btn => {
            const inside = btn.contains(this.canvas, pos.x, pos.y);
            btn.setHover(inside);
        });
    }

    draw(ctx) {
        this.headerButtons.forEach(btn => btn.draw(ctx, this.canvas));

        if (this.enabled) {
            this.controlButtons.forEach(btn => btn.draw(ctx, this.canvas));
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;

        if (this.muteButton) {
            this.muteButton.text = this.isMuted ? "🔇" : "🔊";
        }

        // TODO AudioManager einbinden.
        // AudioManager.setMuted(this.isMuted);

        console.log("Muted:", this.isMuted);
    }

    handleMenu() {
        // TODO: Overlay einbinden
        console.log("Menu öffnen!");
    }
}
