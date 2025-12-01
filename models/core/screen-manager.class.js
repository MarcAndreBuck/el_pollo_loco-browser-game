class ScreenManager {
    /**
     * Handles resolution, responsive canvas sizing and fullscreen logic.
     * @param {HTMLCanvasElement} canvas
     * @param {number} baseWidth
     * @param {number} baseHeight}
     */
    constructor(canvas, baseWidth = 720, baseHeight = 480) {
        this.canvas = canvas;
        this.baseWidth = baseWidth;
        this.baseHeight = baseHeight;
        this.isFullscreen = !!document.fullscreenElement;

        this.canvas.width = this.baseWidth;
        this.canvas.height = this.baseHeight;

        this.applyResponsiveSize();
        this.registerEvents();
    }

    /**
     * Touch-Gerät ODER kleiner Screen (< 760px)?
     */
    static isMobileOrSmallScreen() {
        const isTouchDevice = navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth < 760;
        return isTouchDevice || isSmallScreen;
    }

    registerEvents() {
        document.addEventListener("fullscreenchange", () => this.handleFullscreenChange());
        window.addEventListener("resize", () => this.handleResize());
    }

    /**
     * Passt die sichtbare Canvas-Größe an:
     * - Im echten Fullscreen: immer window.innerWidth/innerHeight
     * - Sonst:
     *   - Mobile/klein: window.innerWidth/innerHeight
     *   - Desktop/groß: baseWidth/baseHeight
     * Zusätzlich: h1 (#gameTitle) über .hide-in-fullscreen an/aus
     */
    applyResponsiveSize() {
        const title = document.getElementById("gameTitle");
        const isMobile = ScreenManager.isMobileOrSmallScreen();

        if (this.isFullscreen) {
            this.canvas.style.width = window.innerWidth + "px";
            this.canvas.style.height = window.innerHeight + "px";

            title.classList.add("hide-in-fullscreen");
            return;
        }

        if (isMobile) {
            this.canvas.style.width = window.innerWidth + "px";
            this.canvas.style.height = window.innerHeight + "px";

            title.classList.add("hide-in-fullscreen");
        } else {
            this.canvas.style.width = this.baseWidth + "px";
            this.canvas.style.height = this.baseHeight + "px";

            title.classList.remove("hide-in-fullscreen");
        }
    }

    handleResize() {
        this.applyResponsiveSize();
    }

    handleFullscreenChange() {
        this.isFullscreen = !!document.fullscreenElement;

        if (window.world && window.world.controls && window.world.controls.fullscreenButton) {
            const btn = window.world.controls.fullscreenButton;
            btn.pressed = false;
            btn.onChange(false);
        }

        this.applyResponsiveSize();
    }

    async enterFullscreen() {
        const elem = document.documentElement;

        try {
            if (elem.requestFullscreen) {
                await elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                await elem.webkitRequestFullscreen();
            }
        } catch (e) {
            console.warn("Fullscreen konnte nicht aktiviert werden:", e);
        }
    }

    async exitFullscreen() {
        if (!document.fullscreenElement) return;

        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                await document.webkitExitFullscreen();
            }
        } catch (e) {
            console.warn("Fullscreen konnte nicht beendet werden:", e);
        }
    }

    /**
     * Konvertiert Maus-/Touch-Koordinaten in Spielwelt-Koordinaten (z.B. 720x480).
     * @param {MouseEvent | TouchEvent} event
     * @returns {{x: number, y: number}}
     */
    getCanvasCoords(event) {
        const rect = this.canvas.getBoundingClientRect();

        const touch = event.touches ? event.touches[0] : null;
        const clientX = touch ? touch.clientX : event.clientX;
        const clientY = touch ? touch.clientY : event.clientY;

        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY,
        };
    }
}
