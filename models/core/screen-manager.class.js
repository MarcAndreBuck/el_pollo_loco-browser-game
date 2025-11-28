class ScreenManager {
    /**
     * Manages fullscreen and scaling for the game canvas.
     * @param {HTMLCanvasElement} canvas
     * @param {number} baseWidth
     * @param {number} baseHeight
     */
    constructor(canvas, baseWidth = 720, baseHeight = 480) {
        this.canvas = canvas;
        this.baseWidth = baseWidth;
        this.baseHeight = baseHeight;
        this.isFullscreen = false;

        // interne Auflösung der Spielwelt
        this.canvas.width = this.baseWidth;
        this.canvas.height = this.baseHeight;

        this.applyNormalSize();
        this.registerEvents();
    }

    registerEvents() {
        document.addEventListener("fullscreenchange", () => this.handleFullscreenChange());
        window.addEventListener("resize", () => this.handleResize());
    }

    applyNormalSize() {
        // Normale Ansicht z.B. 720×480
        this.canvas.style.width = this.baseWidth + "px";
        this.canvas.style.height = this.baseHeight + "px";
    }

    applyFullscreenSize() {
        this.canvas.style.width = window.innerWidth + "px";
        this.canvas.style.height = window.innerHeight + "px";
    }

    handleFullscreenChange() {
        this.isFullscreen = !!document.fullscreenElement;

        const title = document.getElementById("gameTitle");
        if (title) {
            if (this.isFullscreen) {
                title.classList.add("hide-in-fullscreen");
            } else {
                title.classList.remove("hide-in-fullscreen");
            }
        }

        if (this.isFullscreen) {
            this.applyFullscreenSize();
        } else {
            this.applyNormalSize();
        }
    }

    handleResize() {
        if (this.isFullscreen) {
            this.applyFullscreenSize();
        }
    }

    async enterFullscreen() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            await elem.webkitRequestFullscreen();
        }
    }

    async exitFullscreen() {
        if (!document.fullscreenElement) return;
        if (document.exitFullscreen) {
            await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            await document.webkitExitFullscreen();
        }
    }

    /**
     * Convert mouse/touch event coordinates into game (base) coordinates.
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
