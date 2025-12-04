/**
 * Manages mouse and touch input for UI elements on the canvas.
 * Routes events to overlays, header bar and mobile controls.
 *
 * @class
 */
class UIInputManager {
    /**
     * @param {World} world - The current world instance.
     * @param {ScreenManager} screenManager - Handles canvas scaling and coordinates.
     */
    constructor(world, screenManager) {
        this.world = world;
        this.canvas = world.canvas;
        this.screenManager = screenManager;
        this.registerInput();
    }

    /**
     * Currently active overlay, if any.
     *
     * @type {BaseScreen|null}
     */
    get activeOverlay() {
        return this.world.activeOverlay;
    }

    /**
     * Registers mouse and touch event listeners on the canvas.
     *
     * @returns {void}
     */
    registerInput() {
        this.canvas.addEventListener("mousedown", e => this.handlePointerDown(e));
        this.canvas.addEventListener("mousemove", e => this.handlePointerMove(e));
        this.canvas.addEventListener("mouseup", e => this.handlePointerUp(e));

        this.canvas.addEventListener("touchstart", e => this.handleTouchStart(e), { passive: false });
        this.canvas.addEventListener("touchmove", e => this.handleTouchMove(e), { passive: false });
        this.canvas.addEventListener("touchend", () => this.handlePointerUp());
        this.canvas.addEventListener("touchcancel", () => this.handlePointerUp());
    }

    /**
     * Maps event or touch coordinates into canvas coordinates.
     *
     * @param {MouseEvent|Touch} event
     * @returns {{x: number, y: number}}
     */
    getCanvasPos(event) {
        return this.screenManager.getCanvasCoords(event);
    }

    /**
     * Handles pointer down events from mouse.
     *
     * @param {MouseEvent} event
     * @returns {void}
     */
    handlePointerDown(event) {
        const { x, y } = this.getCanvasPos(event);
        this.routePointerDown(x, y);
    }

    /**
     * Handles pointer move events from mouse.
     *
     * @param {MouseEvent} event
     * @returns {void}
     */
    handlePointerMove(event) {
        const { x, y } = this.getCanvasPos(event);
        this.routePointerMove(x, y);
    }

    /**
     * Handles pointer up events from mouse or touch.
     *
     * @returns {void}
     */
    handlePointerUp() {
        this.routePointerUp();
    }

    /**
     * Handles touch start and maps it to pointer down.
     *
     * @param {TouchEvent} event
     * @returns {void}
     */
    handleTouchStart(event) {
        event.preventDefault();
        const touch = event.touches[0];
        const { x, y } = this.getCanvasPos(touch);
        this.routePointerDown(x, y);
    }

    /**
     * Handles touch move and maps it to pointer move.
     *
     * @param {TouchEvent} event
     * @returns {void}
     */
    handleTouchMove(event) {
        event.preventDefault();
        const touch = event.touches[0];
        if (!touch) return;

        const { x, y } = this.getCanvasPos(touch);
        this.routePointerMove(x, y);
    }

    /**
     * Routes pointer down to active overlay or HUD controls.
     *
     * @param {number} x - Canvas x coordinate.
     * @param {number} y - Canvas y coordinate.
     * @returns {void}
     */
    routePointerDown(x, y) {
        if (this.activeOverlay) {
            this.activeOverlay.handlePointerDown(x, y);
            return;
        }

        this.world.headerBar.handlePointerDown(x, y);
        this.world.mobileControls.handlePointerDown(x, y);
    }

    /**
     * Routes pointer move and updates cursor hover state.
     *
     * @param {number} x - Canvas x coordinate.
     * @param {number} y - Canvas y coordinate.
     * @returns {void}
     */
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

    /**
     * Routes pointer up to overlay or HUD controls.
     *
     * @returns {void}
     */
    routePointerUp() {
        if (this.activeOverlay) {
            this.activeOverlay.handlePointerUp();
            return;
        }

        this.world.headerBar.handlePointerUp();
        this.world.mobileControls.handlePointerUp();
    }

    /**
     * Updates the cursor style based on hover state.
     *
     * @param {boolean} isHovering - True if any button is hovered.
     * @returns {void}
     */
    updateCursor(isHovering) {
        this.canvas.style.cursor = isHovering ? "pointer" : "default";
    }
}
