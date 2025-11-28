class UIManager {
    constructor(world) {
        this.world = world;
        this.canvas = world.canvas;
        this.activeOverlay = null;

        this.registerInput();
    }

    registerInput() {
        this.canvas.addEventListener("mousedown", e => this.handlePointer(e));
        this.canvas.addEventListener("mouseup", e => this.handlePointerUp(e));

        this.canvas.addEventListener("touchstart", e => this.handleTouch(e), { passive: false });
        this.canvas.addEventListener("touchend", e => this.handleTouchEnd(e));
        this.canvas.addEventListener("touchcancel", e => this.handleTouchEnd(e));
    }

    getPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    handlePointer(e) {
        if (!this.activeOverlay) return;
        const pos = this.getPos(e);
        this.activeOverlay.handleClick(pos.x, pos.y);
    }

    handlePointerUp(e) {
    }

    handleTouch(e) {
        if (!this.activeOverlay) return;
        const touch = e.touches[0];
        const pos = this.getPos(touch);
        this.activeOverlay.handleClick(pos.x, pos.y);
        e.preventDefault();
    }

    handleTouchEnd(e) {}

    showOverlay(overlay) {
        this.activeOverlay = overlay;
        this.world.blocked = true;
    }

    hideOverlay() {
        this.activeOverlay = null;
        this.world.blocked = false;
    }

    draw(ctx) {
        if (this.activeOverlay) {
            this.activeOverlay.draw(ctx);
        }
    }
}
