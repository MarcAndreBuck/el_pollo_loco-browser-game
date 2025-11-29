class CanvasControls {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Keyboard} keyboard
     * @param {ScreenManager} screenManager
     * @param {World} world
     */
    constructor(canvas, keyboard, screenManager, world) {
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.screenManager = screenManager;
        this.world = world;

        this.enabled = CanvasControls.isMobilePlatform();

        this.isMuted = false;
        this.muteButton = null;
        this.menuButton = null;

        this.headerButtons = this.createHeaderButtons();
        this.controlButtons = this.enabled ? this.createControlButtons() : [];

        this.bindMouseEvents();
        this.bindTouchEvents();
    }

    static isMobilePlatform() {
        const isTouch = navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth < 760;
        return isTouch || isSmallScreen;
    }

    /**
     * Menu-Button nur im laufenden Spiel (kein Overlay).
     */
    isMenuAvailable() {
        return !this.world.activeOverlay;
    }

    /* ---------- Events ---------- */

    bindMouseEvents() {
        this.canvas.addEventListener("mousedown", event => {
            const { x, y } = this.screenManager.getCanvasCoords(event);

            // Header-Buttons (Mute immer, Menu nur wenn erlaubt)
            this.onPointerDownHeader(x, y);

            // Overlay aktiv? → zusätzlich Input an Overlay
            if (this.world.activeOverlay) {
                this.world.activeOverlay.handlePointerDown(x, y);
            } else {
                // Sonst Gameplay-Buttons
                this.onPointerDownControls(x, y);
            }
        });

        this.canvas.addEventListener("mousemove", event => {
            const { x, y } = this.screenManager.getCanvasCoords(event);

            this.updateHover(this.headerButtons, x, y);

            if (this.world.activeOverlay) {
                this.world.activeOverlay.handlePointerMove(x, y);
            } else {
                this.updateHover(this.controlButtons, x, y);
            }
        });

        this.canvas.addEventListener("mouseup", () => {
            this.resetButtons(this.headerButtons);
            this.resetButtons(this.controlButtons);

            if (this.world.activeOverlay) {
                this.world.activeOverlay.handlePointerUp();
            }
        });
    }

    bindTouchEvents() {
        this.canvas.addEventListener("touchstart", event => {
            event.preventDefault();
            const { x, y } = this.screenManager.getCanvasCoords(event);

            this.onPointerDownHeader(x, y);

            if (this.world.activeOverlay) {
                this.world.activeOverlay.handlePointerDown(x, y);
            } else {
                this.onPointerDownControls(x, y);
            }
        }, { passive: false });

        this.canvas.addEventListener("touchmove", event => {
            event.preventDefault();
            const { x, y } = this.screenManager.getCanvasCoords(event);

            this.updateHover(this.headerButtons, x, y);

            if (this.world.activeOverlay) {
                this.world.activeOverlay.handlePointerMove(x, y);
            } else {
                this.updateHover(this.controlButtons, x, y);
            }
        }, { passive: false });

        this.canvas.addEventListener("touchend", event => {
            event.preventDefault();
            this.resetButtons(this.headerButtons);
            this.resetButtons(this.controlButtons);

            if (this.world.activeOverlay) {
                this.world.activeOverlay.handlePointerUp();
            }
        }, { passive: false });

        this.canvas.addEventListener("touchcancel", event => {
            event.preventDefault();
            this.resetButtons(this.headerButtons);
            this.resetButtons(this.controlButtons);

            if (this.world.activeOverlay) {
                this.world.activeOverlay.handlePointerUp();
            }
        }, { passive: false });
    }

    /* ---------- Pointer-Helpers ---------- */

    onPointerDownHeader(x, y) {
        this.triggerButtons(this.headerButtons, x, y);
    }

    onPointerDownControls(x, y) {
        this.triggerButtons(this.controlButtons, x, y);
    }

    triggerButtons(buttons, x, y) {
        buttons.forEach(btn => {
            // Menü ignorieren, wenn nicht verfügbar
            if (btn === this.menuButton && !this.isMenuAvailable()) {
                return;
            }

            if (btn.contains(this.canvas, x, y)) {
                btn.pressed = true;
                btn.onChange(true);
            }
        });
    }

    updateHover(buttons, x, y) {
        buttons.forEach(btn => {
            // Kein Hover für Menü, wenn nicht verfügbar
            if (btn === this.menuButton && !this.isMenuAvailable()) {
                btn.setHover(false);
                return;
            }

            btn.setHover(btn.contains(this.canvas, x, y));
        });
    }

    resetButtons(buttons) {
        buttons.forEach(btn => {
            if (btn.pressed) {
                btn.onChange(false);
            }
            btn.pressed = false;
            btn.setHover(false); 
        });
    }

    /* ---------- Buttons erzeugen ---------- */

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

        const menu = new CanvasButton(
            0.70,
            top,
            w,
            h,
            "☰",
            state => {
                if (!state) return;
                this.handleMenu();
            },
            "wood"
        );

        const mute = new CanvasButton(
            0.85,
            top,
            w,
            h,
            "🔊",
            state => {
                if (!state) return;
                this.toggleMute();
            },
            "wood"
        );

    const fullscreen = new CanvasButton(0.70, top, w, h, "⛶", state => { if (!state) return; this.toggleFullscreen(); }, "wood");

        this.menuButton = menu;
        this.muteButton = mute;

        return [menu, mute];
    }

    /* ---------- Rendering ---------- */

    draw(ctx) {
        this.drawHeaderOnly(ctx);

        if (!this.world.activeOverlay && this.enabled) {
            this.controlButtons.forEach(btn => btn.draw(ctx, this.canvas));
        }
    }

    drawHeaderOnly(ctx) {
        this.headerButtons.forEach(btn => {
            // Menü nicht zeichnen, wenn nicht verfügbar
            if (btn === this.menuButton && !this.isMenuAvailable()) {
                return;
            }
            btn.draw(ctx, this.canvas);
        });
    }

    /* ---------- Actions ---------- */

    toggleMute() {
        this.isMuted = !this.isMuted;

        if (this.muteButton) {
            this.muteButton.text = this.isMuted ? "🔇" : "🔊";
        }

        console.log("Muted:", this.isMuted);
        // TODO: AudioManager anbinden
    }

    handleMenu() {
        console.log("Menü öffnen (Pause-Screen)");
        this.world.pauseOverlay.toggle();
    }
}
