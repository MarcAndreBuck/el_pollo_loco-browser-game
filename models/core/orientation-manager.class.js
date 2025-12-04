/**
 * Manages device orientation for mobile users.
 * Locks the game when in portrait mode and shows an overlay.
 */
class OrientationManager {
    /**
     * @param {World} world - Active game world instance.
     */
    constructor(world) {
        this.world = world;
        this.overlay = document.getElementById("rotateOverlay");
        this.wasRunningBeforeLock = false;

        this.updateState();

        window.addEventListener("resize", () => this.updateState());
        window.addEventListener("orientationchange", () => this.updateState());
    }

    /**
     * Checks whether the device is currently in landscape orientation.
     * @returns {boolean} True if width > height.
     */
    isLandscape() {
        return window.innerWidth > window.innerHeight;
    }

    /**
     * Detects whether the device is a mobile/touch device.
     * @returns {boolean} True if touch capability exists.
     */
    isMobileDevice() {
        return navigator.maxTouchPoints > 0;
    }

    /**
     * Updates the orientation state and locks/unlocks the game accordingly.
     */
    updateState() {
        const isMobile = this.isMobileDevice();
        const wrongOrientation = isMobile && !this.isLandscape();

        if (wrongOrientation) {
            this.lockForOrientation();
        } else {
            this.unlockForOrientation();
        }
    }

    /**
     * Locks the game when the orientation is incorrect.
     * Pauses game and disables mobile controls.
     */
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

    /**
     * Unlocks the game when the device returns to landscape mode.
     * Re-enables mobile controls and resumes gameplay if needed.
     */
    unlockForOrientation() {
        if (this.world.mobileControls) {
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

    /**
     * Toggles the visibility of the rotate-screen overlay.
     * @param {boolean} show - True to show, false to hide.
     */
    toggleOverlay(show) {
        if (!this.overlay) return;
        this.overlay.classList.toggle("hidden", !show);
    }
}
