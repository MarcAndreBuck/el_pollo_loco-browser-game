class ScreenManager {

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


    static isMobileOrSmallScreen() {
        const touch = navigator.maxTouchPoints > 0;
        const small = window.innerWidth < 760;
        return touch || small;
    }


    registerEvents() {
        document.addEventListener("fullscreenchange", () => this.handleFullscreenChange());
        window.addEventListener("resize", () => this.handleResize());

        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", () => this.handleResize());
        }
    }


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
    
    
    getViewportSize() {
        const vw = window.visualViewport?.width || window.innerWidth;
        const vh = window.visualViewport?.height || window.innerHeight;
        return { vw, vh };
    }


    applyFullSize(vw, vh) {
        this.canvas.width = vw;
        this.canvas.height = vh;
        this.canvas.style.width = `${vw}px`;
        this.canvas.style.height = `${vh}px`;
        this.scaleX = vw / this.baseWidth;
        this.scaleY = vh / this.baseHeight;
    }


    applyBaseSize() {
        const { baseWidth, baseHeight } = this;
        this.canvas.width = baseWidth;
        this.canvas.height = baseHeight;
        this.canvas.style.width = `${baseWidth}px`;
        this.canvas.style.height = `${baseHeight}px`;
        this.scaleX = 1;
        this.scaleY = 1;
    }


    toggleTitle(title, hidden) {
        if (!title) return;
        title.classList.toggle("hide-in-fullscreen", hidden);
    }


    handleResize() {
        this.applyResponsiveSize();
        requestAnimationFrame(() => this.applyResponsiveSize());
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
        if (this.canvas.requestFullscreen) {
            await this.canvas.requestFullscreen();
        } else if (this.canvas.webkitRequestFullscreen) {
            await this.canvas.webkitRequestFullscreen();
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


    getCanvasCoords(event) {
        const rect = this.canvas.getBoundingClientRect();
        const touch = event.touches ? event.touches[0] : null;
        const clientX = touch ? touch.clientX : event.clientX;
        const clientY = touch ? touch.clientY : event.clientY;
        const scaleX = this.baseWidth / rect.width;
        const scaleY = this.baseHeight / rect.height;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY,
        };
    }
}
