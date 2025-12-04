class UIInputManager {
    /**
     * @param {World} world
     * @param {ScreenManager} screenManager
     */
    constructor(world, screenManager) {
        this.world = world;
        this.canvas = world.canvas;
        this.screenManager = screenManager;

        this.registerInput();
    }

    get activeOverlay() {
        return this.world.activeOverlay;
    }

    registerInput() {
        this.canvas.addEventListener("mousedown", e => this.handlePointerDown(e));
        this.canvas.addEventListener("mousemove", e => this.handlePointerMove(e));
        this.canvas.addEventListener("mouseup",   e => this.handlePointerUp(e));

        this.canvas.addEventListener(
            "touchstart",
            e => this.handleTouchStart(e),
            { passive: false }
        );
        this.canvas.addEventListener("touchmove",  e => this.handleTouchMove(e), { passive: false });
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
        if (this.activeOverlay) {
            this.activeOverlay.handlePointerDown(x, y);
            return;
        }

        this.world.headerBar.handlePointerDown(x, y);
        this.world.mobileControls.handlePointerDown(x, y);
    }

    routePointerMove(x, y) {
        let hovering = false;

        if (this.activeOverlay) {
            hovering = !!this.activeOverlay.handlePointerMove(x, y);
        } else {
            const headerHover = this.world.headerBar.handlePointerMove(x, y) || false;
            const mobileHover = this.world.mobileControls.handlePointerMove(x, y) || false;
            hovering = headerHover || mobileHover;
        }

        this.updateCursor(hovering);
    }

    routePointerUp() {
        if (this.activeOverlay) {
            this.activeOverlay.handlePointerUp();
            return;
        }

        this.world.headerBar.handlePointerUp();
        this.world.mobileControls.handlePointerUp();
    }

    /* ---------- Cursor ---------- */

    updateCursor(isHovering) {
        this.canvas.style.cursor = isHovering ? "pointer" : "default";
    }
}
