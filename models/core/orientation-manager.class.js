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

        this.world.controls.enabled = false;

        this.toggleOverlay(true);
    }


    unlockForOrientation() {
        this.world.controls.enabled = true;

        this.toggleOverlay(false);


        if (this.wasRunningBeforeLock && this.world.state === GAME_STATE.PAUSED) {
            this.world.setState(GAME_STATE.RUNNING);
        }
    }

    
    toggleOverlay(show) {
        this.overlay.classList.toggle("hidden", !show);
    }
}
