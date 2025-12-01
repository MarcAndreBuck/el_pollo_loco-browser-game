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

        this.applyResponsiveSize();
        this.registerEvents();
    }

    /**
     * Touch-Gerät ODER kleiner Screen (< 760px)?
     */
    static isMobileOrSmallScreen() {
        const touch = navigator.maxTouchPoints > 0;
        const small = window.innerWidth < 760;
        return touch || small;
    }

    registerEvents() {
        document.addEventListener("fullscreenchange", () => this.handleFullscreenChange());
        window.addEventListener("resize", () => this.handleResize());
    }

    /**
     * Desktop: Spielauflösung = baseWidth/baseHeight
     * Mobile ODER Fullscreen: Spielauflösung = window.innerWidth/innerHeight
     * → Canvas UND Spiel werden gestreckt.
     */
    applyResponsiveSize() {
        const title = document.getElementById("gameTitle");
        const isMobile = ScreenManager.isMobileOrSmallScreen();

        if (this.isFullscreen || isMobile) {
            // 🔥 Handy + Fullscreen → Spielauflösung = Fenstergröße
            const w = window.innerWidth;
            const h = window.innerHeight;

            // Zeichenauflösung
            this.canvas.width = w;
            this.canvas.height = h;

            // Darstellung
            this.canvas.style.width = w + "px";
            this.canvas.style.height = h + "px";

            if (title) {
                title.classList.add("hide-in-fullscreen");
            }
        } else {
            // 💻 Desktop normal → feste Basisgröße
            this.canvas.width = this.baseWidth;
            this.canvas.height = this.baseHeight;

            this.canvas.style.width = this.baseWidth + "px";
            this.canvas.style.height = this.baseHeight + "px";

            if (title) {
                title.classList.remove("hide-in-fullscreen");
            }
        }
    }

    handleResize() {
        this.applyResponsiveSize();
        requestAnimationFrame(() => this.applyResponsiveSize());
        setTimeout(() => this.applyResponsiveSize(), 100);
    }

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

    async enterFullscreen() {
        try {
            if (this.canvas.requestFullscreen) {
                await this.canvas.requestFullscreen();
            } else if (this.canvas.webkitRequestFullscreen) {
                await this.canvas.webkitRequestFullscreen();
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
     * Konvertiert Maus-/Touch-Koordinaten in Spielwelt-Koordinaten.
     * Jetzt: canvas.width == sichtbare Breite → scale ist meist 1,
     * aber der Code bleibt korrekt.
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
