class HeaderBar extends BaseScreen {
    /**
     * @param {World} world
     * @param {HTMLCanvasElement} canvas
     * @param {ScreenManager} screenManager
     */
    constructor(world, canvas, screenManager) {
        super(world, canvas, screenManager);

        this.isMuted = soundManager.muted;
        this.isFullscreen = !!document.fullscreenElement;

        this.muteButton = null;
        this.menuButton = null;
        this.fullscreenButton = null;

        this.rebuildButtons();
    }

    isMenuVisible() {
        return this.world.state === GAME_STATE.RUNNING;
    }

    rebuildButtons() {
        const w = 0.06;
        const h = 0.08;
        const y = 0.05;

        const fullscreenX = 0.82;
        const menuX = 0.74;
        const muteX = 0.90;

        const fullscreen = new CanvasButton(
            fullscreenX,
            y,
            w,
            h,
            "⛶",
            state => state && this.toggleFullscreen(),
            "wood"
        );

        const mute = new CanvasButton(
            muteX,
            y,
            w,
            h,
            this.isMuted ? "🔇" : "🔊",
            state => state && this.toggleMute(),
            "wood"
        );

        let menu = null;
        let buttons;

        if (this.isMenuVisible()) {
            menu = new CanvasButton(
                menuX,
                y,
                w,
                h,
                "☰",
                state => state && this.handleMenu(),
                "wood"
            );
            buttons = [fullscreen, menu, mute];
        } else {
            buttons = [fullscreen, mute];
        }

        this.fullscreenButton = fullscreen;
        this.menuButton = menu;
        this.muteButton = mute;
        this.buttons = buttons;
    }

    updateMuteIcon() {
        if (!this.muteButton) return;
        this.muteButton.text = this.isMuted ? "🔇" : "🔊";
    }

    toggleMute() {
        soundManager.toggleMute();
        this.isMuted = soundManager.muted;
        this.updateMuteIcon();
    }

    toggleFullscreen() {
        const manager = this.world.screenManager;
        if (!manager.isFullscreen) {
            manager.enterFullscreen();
        } else {
            manager.exitFullscreen();
        }
    }

    handleMenu() {
        const state = this.world.state;

        if (state === GAME_STATE.RUNNING) {
            this.world.setState(GAME_STATE.PAUSED);
            return;
        }

        if (state === GAME_STATE.PAUSED) {
            this.world.setState(GAME_STATE.RUNNING);
        }
    }

    draw(ctx) {
        this.drawButtons(ctx);
    }
}
