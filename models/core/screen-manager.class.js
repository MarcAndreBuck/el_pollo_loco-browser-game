class ScreenManager {
    /**
     * Handles resolution, responsive canvas sizing and fullscreen logic.
     * @param {HTMLCanvasElement} canvas
     * @param {number} baseWidth
     * @param {number} baseHeight
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


    static isMobileOrSmallScreen() {
        const touch = navigator.maxTouchPoints > 0;
        const small = window.innerWidth < 760;
        return touch || small;
    }

    registerEvents() {
        document.addEventListener("fullscreenchange", () => this.handleFullscreenChange());
        window.addEventListener("resize", () => this.handleResize());
    }


    applyResponsiveSize() {
        const title = document.getElementById("gameTitle");

        if (ScreenManager.isMobileOrSmallScreen()) {
            this.canvas.style.width = window.innerWidth + "px";
            this.canvas.style.height = window.innerHeight + "px";

            if (title) title.classList.add("hide-in-fullscreen");

        } else {
            this.canvas.style.width = this.baseWidth + "px";
            this.canvas.style.height = this.baseHeight + "px";

            if (title) title.classList.remove("hide-in-fullscreen");
        }
    }

    handleResize() {
        this.applyResponsiveSize();
    }

    handleFullscreenChange() {
        this.isFullscreen = !!document.fullscreenElement;

        const title = document.getElementById("gameTitle");
        if (title) {
            if (this.isFullscreen) title.classList.add("hide-in-fullscreen");
            else title.classList.remove("hide-in-fullscreen");
        }

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
