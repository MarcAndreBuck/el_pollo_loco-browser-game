class OrientationManager {
    constructor(world) {
        this.world = world;
        this.overlay = document.getElementById("rotateOverlay");

        this.updateState();
        window.addEventListener("resize", () => this.updateState());
        window.addEventListener("orientationchange", () => this.updateState());
    }

    isLandscape() {
        return window.innerWidth > window.innerHeight;
    }

    isMobileDevice() {
        return navigator.maxTouchPoints > 0;
    }

    updateState() {
        const mobile = this.isMobileDevice();
        const wrongOrientation = mobile && !this.isLandscape();

        this.setBlocked(wrongOrientation);
        this.toggleOverlay(wrongOrientation);
    }

    setBlocked(state) {
        this.world.blocked = state;
        if (this.world.controls) {
            this.world.controls.enabled = !state;
        }
    }

    toggleOverlay(show) {
        this.overlay.classList.toggle("hidden", !show);
    }
}
