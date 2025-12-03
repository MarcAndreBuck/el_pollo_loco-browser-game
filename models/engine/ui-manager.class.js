class UIManager {
    constructor(world) {
        this.world = world;
        this.canvas = world.canvas;

        this.registerInput();
    }

    get activeOverlay() {
        return this.world.activeOverlay;
    }

    registerInput() {
        this.canvas.addEventListener("mousedown", e => this.handlePointerDown(e));
        this.canvas.addEventListener("mouseup",   e => this.handlePointerUp(e));

        this.canvas.addEventListener("touchstart",  e => this.handleTouchStart(e), { passive: false });
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



    handlePointerDown(e) {
        if (!this.activeOverlay) return;                  
        const pos = this.getPos(e);
        this.activeOverlay.handlePointerDown(pos.x, pos.y);
    }

    handlePointerUp(e) {
        if (!this.activeOverlay) return;
        const pos = this.getPos(e);
        this.activeOverlay.handlePointerUp(pos.x, pos.y);
    }



    handleTouchStart(e) {
        if (!this.activeOverlay) return;

        const touch = e.touches[0];
        const pos = this.getPos(touch);

        this.activeOverlay.handlePointerDown(pos.x, pos.y);
        e.preventDefault();
    }

    handleTouchEnd() {
        if (!this.activeOverlay) return;
        this.activeOverlay.handlePointerUp();
    }


    draw(ctx) {
        if (!this.activeOverlay) return;
        this.activeOverlay.draw(ctx);
    }
}
