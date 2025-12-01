class UIManager {
    constructor(world) {
        this.world = world;
        this.canvas = world.canvas;
        this.activeOverlay = null;

        this.registerInput();
    }

    registerInput() {
        this.canvas.addEventListener("mousedown", e => this.handlePointer(e));
        this.canvas.addEventListener("mouseup",   e => this.handlePointerUp(e));

        this.canvas.addEventListener("touchstart",  e => this.handleTouch(e),     { passive: false });
        this.canvas.addEventListener("touchend",    e => this.handleTouchEnd(e));
        this.canvas.addEventListener("touchcancel", e => this.handleTouchEnd(e));
    }

    getPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }

    handlePointer(e) {
        if (!this.activeOverlay || typeof this.activeOverlay.handleClick !== "function") return;
        const pos = this.getPos(e);
        this.activeOverlay.handleClick(pos.x, pos.y);
    }

    handlePointerUp(e) {
        if (this.activeOverlay && typeof this.activeOverlay.handlePointerUp === "function") {
            const pos = this.getPos(e);
            this.activeOverlay.handlePointerUp(pos.x, pos.y);
        }
    }

    handleTouch(e) {
        if (!this.activeOverlay || typeof this.activeOverlay.handleClick !== "function") return;

        const touch = e.touches[0];
        const pos = this.getPos(touch);

        this.activeOverlay.handleClick(pos.x, pos.y);
        e.preventDefault();
    }

    handleTouchEnd(e) {
        if (this.activeOverlay && typeof this.activeOverlay.handleTouchEnd === "function") {
            this.activeOverlay.handleTouchEnd(e);
        }
    }

    showOverlay(overlay) {
        this.activeOverlay = overlay;
        
    }

    hideOverlay() {
        this.activeOverlay = null;
      
    }

    draw(ctx) {
        if (this.activeOverlay && typeof this.activeOverlay.draw === "function") {
            this.activeOverlay.draw(ctx);
        }
    }
}
