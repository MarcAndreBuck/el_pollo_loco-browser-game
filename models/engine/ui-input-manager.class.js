class UIInputManager {
    /**
     * Zentraler Input-Manager für Canvas-UI (Header, Mobile, Screens, Overlays).
     * @param {World} world
     * @param {ScreenManager} screenManager
     */
    constructor(world, screenManager) {
        this.world = world;
        this.canvas = world.canvas;
        this.screenManager = screenManager;

        this.registerMouseEvents();
        this.registerTouchEvents();
    }

    /* ---------- Event-Registrierung ---------- */

    registerMouseEvents() {
        this.canvas.addEventListener("mousedown", e => this.handlePointerDown(e));
        this.canvas.addEventListener("mousemove", e => this.handlePointerMove(e));
        this.canvas.addEventListener("mouseup",   () => this.handlePointerUp());
    }

    registerTouchEvents() {
        this.canvas.addEventListener(
            "touchstart",
            e => this.handleTouchStart(e),
            { passive: false }
        );

        this.canvas.addEventListener(
            "touchmove",
            e => this.handleTouchMove(e),
            { passive: false }
        );

        this.canvas.addEventListener("touchend",   () => this.handlePointerUp());
        this.canvas.addEventListener("touchcancel", () => this.handlePointerUp());
    }

    /* ---------- Koordinaten ---------- */

    getCanvasPos(event) {
        return this.screenManager.getCanvasCoords(event);
    }

    /* ---------- Mouse ---------- */

    handlePointerDown(event) {
        const { x, y } = this.getCanvasPos(event);
        this.routePointerDown(x, y);
    }

    handlePointerMove(event) {
        const { x, y } = this.getCanvasPos(event);
        this.routePointerMove(x, y);
    }

    handlePointerUp() {
        this.routePointerUp();
    }

    /* ---------- Touch ---------- */

    handleTouchStart(event) {
        event.preventDefault();
        const touch = event.touches[0];
        if (!touch) return;

        const { x, y } = this.getCanvasPos(touch);
        this.routePointerDown(x, y);
    }

    handleTouchMove(event) {
        event.preventDefault();
        const touch = event.touches[0];
        if (!touch) return;

        const { x, y } = this.getCanvasPos(touch);
        this.routePointerMove(x, y);
    }

    /* ---------- Routing ---------- */

    routePointerDown(x, y) {
        if (this.routeToControlsOverlay("down", x, y)) return;

        const state = this.world.state;

        if (state === GAME_STATE.START) {
            this.world.startScreen.handlePointerDown(x, y);
        }

        if (state === GAME_STATE.PAUSED) {
            this.world.pauseOverlay.handlePointerDown(x, y);
        }

        if (state === GAME_STATE.WON || state === GAME_STATE.LOST) {
            this.world.endscreen.handlePointerDown(x, y);
        }

        this.world.headerBar.handlePointerDown(x, y);

        if (state === GAME_STATE.RUNNING) {
            this.world.mobileControls.handlePointerDown(x, y);
        }
    }

    routePointerMove(x, y) {
        let hovering = false;

        if (this.routeToControlsOverlay("move", x, y)) {
            this.updateCursor(true);
            return;
        }

        const state = this.world.state;

        if (state === GAME_STATE.START) {
            hovering = !!this.world.startScreen.handlePointerMove(x, y) || hovering;
        }

        if (state === GAME_STATE.PAUSED) {
            hovering = !!this.world.pauseOverlay.handlePointerMove(x, y) || hovering;
        }

        if (state === GAME_STATE.WON || state === GAME_STATE.LOST) {
            hovering = !!this.world.endscreen.handlePointerMove(x, y) || hovering;
        }

        hovering = !!this.world.headerBar.handlePointerMove(x, y) || hovering;

        if (state === GAME_STATE.RUNNING) {
            hovering = !!this.world.mobileControls.handlePointerMove(x, y) || hovering;
        }

        this.updateCursor(hovering);
    }

    routePointerUp() {
        if (this.routeToControlsOverlay("up")) return;

        const state = this.world.state;

        if (state === GAME_STATE.START) {
            this.world.startScreen.handlePointerUp();
        }

        if (state === GAME_STATE.PAUSED) {
            this.world.pauseOverlay.handlePointerUp();
        }

        if (state === GAME_STATE.WON || state === GAME_STATE.LOST) {
            this.world.endscreen.handlePointerUp();
        }

        this.world.headerBar.handlePointerUp();

        if (state === GAME_STATE.RUNNING) {
            this.world.mobileControls.handlePointerUp();
        }
    }

    /* ---------- Controls-Overlay (modal) ---------- */

    routeToControlsOverlay(type, x, y) {
        const overlay = this.world.controlsOverlay;
        if (!overlay || !overlay.visible) return false;

        if (type === "down") {
            overlay.handlePointerDown(x, y);
        } else if (type === "move") {
            overlay.handlePointerMove(x, y);
        } else if (type === "up") {
            overlay.handlePointerUp();
        }

        return true;
    }

    /* ---------- Cursor ---------- */

    updateCursor(isHovering) {
        this.canvas.style.cursor = isHovering ? "pointer" : "default";
    }
}
