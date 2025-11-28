class CanvasControls {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Keyboard} keyboard
     * @param {ScreenManager} screenManager
     */
    constructor(canvas, keyboard, screenManager) {
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.screenManager = screenManager;

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

        const menu = new CanvasButton(0.55, top, w, h, "☰", state => { if (!state) return; this.handleMenu(); }, "wood");
        const fullscreen = new CanvasButton(0.70, top, w, h, "⛶", state => { if (!state) return; this.toggleFullscreen(); }, "wood");
        const mute = new CanvasButton(0.85, top, w, h, this.isMuted ? "🔇" : "🔊", state => { if (!state) return; this.toggleMute(); }, "wood");

        this.menuButton = menu;
        this.fullscreenButton = fullscreen;
        this.muteButton = mute;

        return [menu, fullscreen, mute];
    }

    bindMouseEvents() {
        this.canvas.addEventListener("mousedown", event => { const { x, y } = this.screenManager.getCanvasCoords(event); this.onPointerDown(x, y, event); });
        this.canvas.addEventListener("mouseup", event => { this.onPointerUp(event); });
        this.canvas.addEventListener("mousemove", event => { const { x, y } = this.screenManager.getCanvasCoords(event); this.onMouseMove(x, y, event); });
    }

    bindTouchEvents() {
        this.canvas.addEventListener("touchstart", event => { event.preventDefault(); const { x, y } = this.screenManager.getCanvasCoords(event); this.onPointerDown(x, y, event); }, { passive: false });
        this.canvas.addEventListener("touchmove", event => { event.preventDefault(); const { x, y } = this.screenManager.getCanvasCoords(event); this.onMouseMove(x, y, event); }, { passive: false });
        this.canvas.addEventListener("touchend", event => { event.preventDefault(); this.onPointerUp(event); }, { passive: false }); this.canvas.addEventListener("touchcancel", event => { event.preventDefault(); this.onPointerUp(event); }, { passive: false });
    }

    onPointerDown(x, y, event) { this.updatePressedState(x, y, true); }

    onPointerUp(event) {
        this.buttons.forEach(btn => { if (btn.pressed) { btn.onChange(false); } btn.pressed = false; });
    }

    onMouseMove(x, y, event) {
        this.buttons.forEach(btn => { const inside = btn.contains(this.canvas, x, y); btn.setHover(inside); });
    }

    updatePressedState(x, y, isDown) {
        this.buttons.forEach(btn => {
            const inside = btn.contains(this.canvas, x, y);
            const pressedNow = isDown && inside;

            if (btn.pressed !== pressedNow) {
                btn.pressed = pressedNow;
                btn.onChange(btn.pressed);
            }
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

        // TODO: AudioManager einbinden
        console.log("Muted:", this.isMuted);
    }

    handleMenu() {
        // TODO: Overlay einbinden
        console.log("Menu öffnen!");
    }

    toggleFullscreen() {
        if (this.screenManager.isFullscreen) {
            this.screenManager.exitFullscreen();
            if (this.fullscreenButton) {
                this.fullscreenButton.pressed = false;
                this.fullscreenButton.onChange(false);
            }
        } else {
            this.screenManager.enterFullscreen();

            if (this.fullscreenButton) {
                this.fullscreenButton.pressed = false;
                this.fullscreenButton.onChange(false);
            }
        }
    }
}
