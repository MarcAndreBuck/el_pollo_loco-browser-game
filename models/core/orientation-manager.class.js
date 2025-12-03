class OrientationManager {
    /**
     * @param {World} world
     */
    constructor(world) {
        this.world = world;
        this.overlay = document.getElementById("rotateOverlay");
        this.wasRunningBeforeLock = false;

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
        const isMobile = this.isMobileDevice();
        const wrongOrientation = isMobile && !this.isLandscape();

        if (wrongOrientation) {
            this.lockForOrientation();
        } else {
            this.unlockForOrientation();
        }
    }

    lockForOrientation() {
        if (this.world.state === GAME_STATE.RUNNING) {
            this.wasRunningBeforeLock = true;
            this.world.setState(GAME_STATE.PAUSED);
        } else {
            this.wasRunningBeforeLock = false;
        }

        if (this.world.mobileControls) {
            this.world.mobileControls.enabled = false;
        }

        this.toggleOverlay(true);
    }

    unlockForOrientation() {
        if (this.world.mobileControls) {
            // Buttons nur auf echten Touch-Geräten aktivieren
            this.world.mobileControls.enabled = this.isMobileDevice();
        }

        this.toggleOverlay(false);

        if (
            this.wasRunningBeforeLock &&
            this.world.state === GAME_STATE.PAUSED
        ) {
            this.world.setState(GAME_STATE.RUNNING);
        }
    }

    toggleOverlay(show) {
        if (!this.overlay) return;
        this.overlay.classList.toggle("hidden", !show);
    }
}
