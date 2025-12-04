/**
 * Central input manager for canvas-based UI.
 * Routes mouse and touch events to screens, overlays and controls.
 */
class UIInputManager {
    /**
     * @param {World} world - Active game world.
     * @param {ScreenManager} screenManager - Used to convert viewport to canvas coordinates.
     */
    constructor(world, screenManager) {
        this.world = world;
        this.canvas = world.canvas;
        this.screenManager = screenManager;

        this.registerMouseEvents();
        this.registerTouchEvents();
    }

    /**
     * Registers mouse event listeners on the canvas.
     */
    registerMouseEvents() {
        this.canvas.addEventListener("mousedown", e => this.handlePointerDown(e));
        this.canvas.addEventListener("mousemove", e => this.handlePointerMove(e));
        this.canvas.addEventListener("mouseup", () => this.handlePointerUp());
    }

    /**
     * Registers touch event listeners on the canvas.
     * Uses non-passive listeners to allow preventDefault.
     */
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

        this.canvas.addEventListener("touchend", () => this.handlePointerUp());
        this.canvas.addEventListener("touchcancel", () => this.handlePointerUp());
    }

    /**
     * Converts an event's coordinates into canvas space.
     * @param {MouseEvent|Touch} event
     * @returns {{x:number,y:number}}
     */
    getCanvasPos(event) {
        return this.screenManager.getCanvasCoords(event);
    }

    /**
     * Handles mouse or pointer down events on the canvas.
     * @param {MouseEvent} event
     */
    handlePointerDown(event) {
        const { x, y } = this.getCanvasPos(event);
        this.routePointerDown(x, y);
    }

    /**
     * Handles mouse or pointer move events on the canvas.
     * @param {MouseEvent} event
     */
    handlePointerMove(event) {
        const { x, y } = this.getCanvasPos(event);
        this.routePointerMove(x, y);
    }

    /**
     * Handles mouse or touch release events.
     */
    handlePointerUp() {
        this.routePointerUp();
    }

    /**
     * Handles touch start events and routes them as pointer down.
     * @param {TouchEvent} event
     */
    handleTouchStart(event) {
        event.preventDefault();
        const touch = event.touches[0];
        if (!touch) return;

        const { x, y } = this.getCanvasPos(touch);
        this.routePointerDown(x, y);
    }

    /**
     * Handles touch move events and routes them as pointer move.
     * @param {TouchEvent} event
     */
    handleTouchMove(event) {
        event.preventDefault();
        const touch = event.touches[0];
        if (!touch) return;

        const { x, y } = this.getCanvasPos(touch);
        this.routePointerMove(x, y);
    }

    /**
     * Routes pointer down events to overlays, screens and controls.
     * @param {number} x
     * @param {number} y
     */
    routePointerDown(x, y) {
        if (this.routeToControlsOverlay("down", x, y)) return;

        const state = this.world.state;
        this.routePointerDownToScreens(state, x, y);
        this.world.headerBar.handlePointerDown(x, y);

        if (state === GAME_STATE.RUNNING) {
            this.world.mobileControls.handlePointerDown(x, y);
        }
    }

    /**
     * Routes pointer down to state-specific screens.
     * @param {string} state
     * @param {number} x
     * @param {number} y
     */
    routePointerDownToScreens(state, x, y) {
        if (state === GAME_STATE.START) {
            this.world.startScreen.handlePointerDown(x, y);
        }

        if (state === GAME_STATE.PAUSED) {
            this.world.pauseOverlay.handlePointerDown(x, y);
        }

        if (state === GAME_STATE.WON || state === GAME_STATE.LOST) {
            this.world.endscreen.handlePointerDown(x, y);
        }
    }

    /**
     * Routes pointer move and updates hover cursor state.
     * @param {number} x
     * @param {number} y
     */
    routePointerMove(x, y) {
        if (this.routeToControlsOverlay("move", x, y)) {
            this.updateCursor(true);
            return;
        }

        const state = this.world.state;
        const hoveringScreens = this.routePointerMoveToScreens(state, x, y);
        const hoveringHeader = !!this.world.headerBar.handlePointerMove(x, y);
        const hoveringMobile =
            state === GAME_STATE.RUNNING &&
            !!this.world.mobileControls.handlePointerMove(x, y);

        this.updateCursor(hoveringScreens || hoveringHeader || hoveringMobile);
    }

    /**
     * Routes pointer move to state-specific screens and returns hover state.
     * @param {string} state
     * @param {number} x
     * @param {number} y
     * @returns {boolean} True if any screen reports hover.
     */
    routePointerMoveToScreens(state, x, y) {
        let hovering = false;

        if (state === GAME_STATE.START) {
            hovering = !!this.world.startScreen.handlePointerMove(x, y) || hovering;
        }

        if (state === GAME_STATE.PAUSED) {
            hovering = !!this.world.pauseOverlay.handlePointerMove(x, y) || hovering;
        }

        if (state === GAME_STATE.WON || state === GAME_STATE.LOST) {
            hovering = !!this.world.endscreen.handlePointerMove(x, y) || hovering;
        }

        return hovering;
    }

    /**
     * Routes pointer up events to overlays, screens and controls.
     */
    routePointerUp() {
        if (this.routeToControlsOverlay("up")) return;

        const state = this.world.state;
        this.routePointerUpToScreens(state);
        this.world.headerBar.handlePointerUp();

        if (state === GAME_STATE.RUNNING) {
            this.world.mobileControls.handlePointerUp();
        }
    }

    /**
     * Routes pointer up to state-specific screens.
     * @param {string} state
     */
    routePointerUpToScreens(state) {
        if (state === GAME_STATE.START) {
            this.world.startScreen.handlePointerUp();
        }

        if (state === GAME_STATE.PAUSED) {
            this.world.pauseOverlay.handlePointerUp();
        }

        if (state === GAME_STATE.WON || state === GAME_STATE.LOST) {
            this.world.endscreen.handlePointerUp();
        }
    }

    /**
     * Routes events to the controls overlay when visible.
     * Returns true if the overlay handled the event.
     * @param {"down"|"move"|"up"} type
     * @param {number} [x]
     * @param {number} [y]
     * @returns {boolean}
     */
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

    /**
     * Updates the canvas cursor based on hover state.
     * @param {boolean} isHovering
     */
    updateCursor(isHovering) {
        this.canvas.style.cursor = isHovering ? "pointer" : "default";
    }
}
