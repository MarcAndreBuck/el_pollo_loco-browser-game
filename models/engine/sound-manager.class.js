class SoundManager {
    constructor(soundList, storageKey = "game_muted") {
        this.sounds = {};
        this.storageKey = storageKey;
        this.muted = this.loadMuted();
        this.currentMusicKey = null;
        this.preload(soundList);
    }

    preload(list) {
        Object.entries(list).forEach(([key, cfg]) => {
            const audio = new Audio(cfg.src);
            audio.loop = !!cfg.loop;
            audio.volume = cfg.volume ?? 1;
            audio.muted = this.muted;

            this.sounds[key] = {
                audio,
                category: cfg.category || "sfx",
                loop: !!cfg.loop,
                volume: cfg.volume ?? 1,
            };
        });
    }

    play(key, force = false) {
        const entry = this.sounds[key];
        if (!entry) return;

        const audio = entry.audio;
        if (!audio.paused && !force) return;

        audio.currentTime = 0;
        audio.play().catch(() => { });
    }

    stop(key) {
        const entry = this.sounds[key];
        if (!entry) return;

        const audio = entry.audio;
        audio.pause();
        audio.currentTime = 0;
    }

    stopCategory(category) {
        Object.values(this.sounds).forEach(entry => {
            if (entry.category !== category) return;
            const audio = entry.audio;
            audio.pause();
            audio.currentTime = 0;
        });
    }

    stopAllAudio() {
        Object.values(this.sounds).forEach(entry => {
            const audio = entry.audio;
            audio.pause();
            audio.currentTime = 0;
        });
        this.currentMusicKey = null;
    }

    /** ---------- Musik ---------- */

    playMusic(key) {
        const entry = this.sounds[key];
        if (!entry) return;

        const audio = entry.audio;

        if (this.currentMusicKey === key && !audio.paused) {
            return;
        }

        if (this.currentMusicKey && this.currentMusicKey !== key) {
            this.stop(this.currentMusicKey);
        }

        audio.loop = entry.loop;
        audio.volume = entry.volume;
        audio.currentTime = 0;
        audio.play().catch(() => { });

        this.currentMusicKey = key;
    }

    stopMusic() {
        if (!this.currentMusicKey) return;
        this.stop(this.currentMusicKey);
        this.currentMusicKey = null;
    }

    /** ---------- Mute ---------- */

    setMuted(muted) {
        this.muted = muted;
        Object.values(this.sounds).forEach(entry => {
            entry.audio.muted = muted;
        });
        this.saveMuted();
    }

    toggleMute() {
        this.setMuted(!this.muted);
    }

    loadMuted() {
        return localStorage.getItem(this.storageKey) === "true";
    }

    saveMuted() {
        localStorage.setItem(this.storageKey, this.muted);
    }
}

const soundManager = new SoundManager(SOUNDS);

