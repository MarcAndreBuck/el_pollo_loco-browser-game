/**
 * Manages canvas sizing, scaling and fullscreen behavior.
 * Keeps a logical base resolution and adapts to screen and device size.
 */
class ScreenManager {
    /**
     * @param {HTMLCanvasElement} canvas - Target canvas element.
     * @param {number} [baseWidth=720] - Logical game width.
     * @param {number} [baseHeight=480] - Logical game height.
     */
    constructor(canvas, baseWidth = 720, baseHeight = 480) {
        this.canvas = canvas;
        this.baseWidth = baseWidth;
        this.baseHeight = baseHeight;
        this.isFullscreen = !!document.fullscreenElement;
        this.scaleX = 1;
        this.scaleY = 1;

        this.canvas.width = this.baseWidth;
        this.canvas.height = this.baseHeight;

        this.applyResponsiveSize();
        this.registerEvents();
    }

    /**
     * Detects mobile or small-screen devices based on touch and width.
     * @returns {boolean} True if device is mobile or narrow.
     */
    static isMobileOrSmallScreen() {
        const touch = navigator.maxTouchPoints > 0;
        const small = window.innerWidth < 760;
        return touch || small;
    }

    /**
     * Registers resize and fullscreen-related event listeners.
     */
    registerEvents() {
        document.addEventListener("fullscreenchange", () => this.handleFullscreenChange());
        window.addEventListener("resize", () => this.handleResize());

        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", () => this.handleResize());
        }
    }

    /**
     * Applies responsive sizing based on fullscreen and device state.
     * Updates canvas size and title visibility.
     */
    applyResponsiveSize() {
        const title = document.getElementById("gameTitle");
        const { vw, vh } = this.getViewportSize();
        const isMobile = ScreenManager.isMobileOrSmallScreen();

        if (this.isFullscreen || isMobile) {
            this.applyFullSize(vw, vh);
            this.toggleTitle(title, true);
            return;
        }

        this.applyBaseSize();
        this.toggleTitle(title, false);
    }

    /**
     * Returns the current viewport size, using visualViewport when available.
     * @returns {{vw: number, vh: number}} Width and height of the viewport.
     */
    getViewportSize() {
        const vw = window.visualViewport.width || window.innerWidth;
        const vh = window.visualViewport.height || window.innerHeight;
        return { vw, vh };
    }

    /**
     * Applies full available size to the canvas and updates scale factors.
     * @param {number} vw - Viewport width in pixels.
     * @param {number} vh - Viewport height in pixels.
     */
    applyFullSize(vw, vh) {
        this.canvas.width = vw;
        this.canvas.height = vh;
        this.canvas.style.width = `${vw}px`;
        this.canvas.style.height = `${vh}px`;
        this.scaleX = vw / this.baseWidth;
        this.scaleY = vh / this.baseHeight;
    }

    /**
     * Resets canvas to the logical base size and clears scaling.
     */
    applyBaseSize() {
        const { baseWidth, baseHeight } = this;
        this.canvas.width = baseWidth;
        this.canvas.height = baseHeight;
        this.canvas.style.width = `${baseWidth}px`;
        this.canvas.style.height = `${baseHeight}px`;
        this.scaleX = 1;
        this.scaleY = 1;
    }

    /**
     * Shows or hides the game title based on fullscreen state.
     * @param {HTMLElement|null} title - Title element.
     * @param {boolean} hidden - True to hide, false to show.
     */
    toggleTitle(title, hidden) {
        if (!title) return;
        title.classList.toggle("hide-in-fullscreen", hidden);
    }

    /**
     * Handles window and viewport resize events.
     * Re-applies responsive sizing with an extra animation frame.
     */
    handleResize() {
        this.applyResponsiveSize();
        requestAnimationFrame(() => this.applyResponsiveSize());
    }

    /**
     * Handles fullscreen state changes and updates controls and layout.
     */
    handleFullscreenChange() {
        this.isFullscreen = !!document.fullscreenElement;

        if (window.world && window.world.controls && window.world.controls.fullscreenButton) {
            const btn = window.world.controls.fullscreenButton;
            btn.pressed = false;
            btn.onChange(false);
            btn.text = this.isFullscreen ? "🡼" : "⛶";
        }

        this.applyResponsiveSize();
    }

    /**
     * Requests fullscreen mode for the canvas if supported.
     * @async
     * @returns {Promise<void>} Resolves when fullscreen request completes.
     */
    async enterFullscreen() {
        if (this.canvas.requestFullscreen) {
            await this.canvas.requestFullscreen();
        } else if (this.canvas.webkitRequestFullscreen) {
            await this.canvas.webkitRequestFullscreen();
        }
    }

    /**
     * Exits fullscreen mode if currently active.
     * @async
     * @returns {Promise<void>} Resolves when fullscreen is exited.
     */
    async exitFullscreen() {
        if (!document.fullscreenElement) return;
        if (document.exitFullscreen) {
            await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            await document.webkitExitFullscreen();
        }
    }

    /**
     * Converts mouse or touch event coordinates into logical canvas space.
     * @param {MouseEvent|TouchEvent} event - Pointer event.
     * @returns {{x: number, y: number}} Normalized canvas coordinates.
     */
    getCanvasCoords(event) {
        const rect = this.canvas.getBoundingClientRect();
        const touch = event.touches ? event.touches[0] : null;
        const clientX = touch ? touch.clientX : event.clientX;
        const clientY = touch ? clientY = touch.clientY : event.clientY;
        const scaleX = this.baseWidth / rect.width;
        const scaleY = this.baseHeight / rect.height;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY,
        };
    }
}
