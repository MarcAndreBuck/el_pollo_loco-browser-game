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
        this.isFullscreen = false;

        this.muteButton = null;
        this.menuButton = null;
        this.fullscreenButton = null;

        this.headerButtons = this.createHeaderButtons();
        this.controlButtons = this.enabled ? this.createControlButtons() : [];

        this.isMuted = soundManager.muted;
        this.muteButton.text = this.isMuted ? "🔇" : "🔊";

        this.bindMouseEvents();
        this.bindTouchEvents();
    }

    static isMobilePlatform() {
        const isTouch = navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth < 760;
        return isTouch || isSmallScreen;
    }

    isMenuAvailable() {
        return this.world.state === GAME_STATE.RUNNING;
    }

    getActiveScreen() {
        const state = this.world.state;

        if (state === GAME_STATE.START) {
            return this.world.startScreen;
        }

        if (state === GAME_STATE.PAUSED) {
            return this.world.pauseOverlay;
        }

        if (state === GAME_STATE.WON || state === GAME_STATE.LOST) {
            return this.world.endscreen;
        }

        return null;
    }

    /* ---------- Events ---------- */

    bindMouseEvents() {
        this.canvas.addEventListener("mousedown", event => {
            const { x, y } = this.screenManager.getCanvasCoords(event);

            this.onPointerDownHeader(x, y);

            const activeScreen = this.getActiveScreen();
            if (activeScreen) {
                activeScreen.handlePointerDown(x, y);
            } else {
                this.onPointerDownControls(x, y);
            }
        });

        this.canvas.addEventListener("mousemove", event => {
            const { x, y } = this.screenManager.getCanvasCoords(event);

            this.updateHover(this.headerButtons, x, y);

            const activeScreen = this.getActiveScreen();
            if (activeScreen) {
                activeScreen.handlePointerMove(x, y);
            } else {
                this.updateHover(this.controlButtons, x, y);
            }
        });

        this.canvas.addEventListener("mouseup", () => {
            this.resetButtons(this.headerButtons);
            this.resetButtons(this.controlButtons);

            const activeScreen = this.getActiveScreen();
            if (activeScreen) {
                activeScreen.handlePointerUp();
            }
        });
    }

    bindTouchEvents() {
        this.canvas.addEventListener("touchstart", event => {
            event.preventDefault();
            const { x, y } = this.screenManager.getCanvasCoords(event);

            this.onPointerDownHeader(x, y);

            const activeScreen = this.getActiveScreen();
            if (activeScreen) {
                activeScreen.handlePointerDown(x, y);
            } else {
                this.onPointerDownControls(x, y);
            }
        }, { passive: false });

        this.canvas.addEventListener("touchmove", event => {
            event.preventDefault();
            const { x, y } = this.screenManager.getCanvasCoords(event);

            this.updateHover(this.headerButtons, x, y);

            const activeScreen = this.getActiveScreen();
            if (activeScreen) {
                activeScreen.handlePointerMove(x, y);
            } else {
                this.updateHover(this.controlButtons, x, y);
            }
        }, { passive: false });

        this.canvas.addEventListener("touchend", event => {
            event.preventDefault();
            this.resetButtons(this.headerButtons);
            this.resetButtons(this.controlButtons);

            const activeScreen = this.getActiveScreen();
            if (activeScreen) {
                activeScreen.handlePointerUp();
            }
        }, { passive: false });

        this.canvas.addEventListener("touchcancel", event => {
            event.preventDefault();
            this.resetButtons(this.headerButtons);
            this.resetButtons(this.controlButtons);

            const activeScreen = this.getActiveScreen();
            if (activeScreen) {
                activeScreen.handlePointerUp();
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
        const controlButtonWidth = 0.10;
        const controlButtonHeight = 0.08;
        const controlAreaY = 0.83;
        const controlOffsetY = 0.08;

        const y = controlAreaY + controlOffsetY;

        return [
            new CanvasButton(0.05, y, controlButtonWidth, controlButtonHeight, "◀", state => this.keyboard.LEFT = state),
            new CanvasButton(0.20, y, controlButtonWidth, controlButtonHeight, "▶", state => this.keyboard.RIGHT = state),
            new CanvasButton(0.85, y, controlButtonWidth, controlButtonHeight, "⭡", state => this.keyboard.SPACE = state),
            new CanvasButton(0.70, y, controlButtonWidth, controlButtonHeight, "🤾", state => this.keyboard.THROW = state),
        ];
    }

    createHeaderButtons() {
        const headerButtonWidth = 0.06;
        const headerButtonHeight = 0.08;
        const headerY = 0.05;

        const fullscreenX = 0.82;
        const menuX = 0.74;
        const muteX = 0.90;

        const fullscreen = new CanvasButton(fullscreenX, headerY, headerButtonWidth, headerButtonHeight, "⛶", state => { if (!state) return; this.toggleFullscreen(); }, "wood");
        const menu = new CanvasButton(menuX, headerY, headerButtonWidth, headerButtonHeight, "☰", state => { if (!state) return; this.handleMenu(); }, "wood");
        const mute = new CanvasButton(muteX, headerY, headerButtonWidth, headerButtonHeight, "🔊", state => { if (!state) return; this.toggleMute(); }, "wood");

        this.fullscreenButton = fullscreen;
        this.menuButton = menu;
        this.muteButton = mute;

        return [fullscreen, menu, mute];
    }

    /* ---------- Rendering ---------- */

    draw(ctx) {
        this.drawHeaderOnly(ctx);

        if (this.enabled && this.world.state === GAME_STATE.RUNNING) {
            this.controlButtons.forEach(btn => btn.draw(ctx, this.canvas));
        }
    }

    drawHeaderOnly(ctx) {
        this.headerButtons.forEach(btn => {
            if (btn === this.menuButton && this.world.state !== GAME_STATE.RUNNING) {
                return;
            }

            btn.draw(ctx, this.canvas);
        });
    }

    /* ---------- Actions ---------- */

    toggleMute() {
        soundManager.toggleMute();
        this.isMuted = soundManager.muted;
        this.muteButton.text = this.isMuted ? "🔇" : "🔊";
    }

    toggleFullscreen() {
        if (!this.screenManager.isFullscreen) {
            this.screenManager.enterFullscreen();
        } else {
            this.screenManager.exitFullscreen();
        }
    }

    handleMenu() {
        const state = this.world.state;

        if (state === GAME_STATE.RUNNING) {
            this.world.setState(GAME_STATE.PAUSED);
            return;
        }

        if (state === GAME_STATE.PAUSED) {
            this.world.setState(GAME_STATE.RUNNING);
        }
    }
}
