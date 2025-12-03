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
            const audio = this.createAudio(cfg);
            this.sounds[key] = this.createSoundEntry(audio, cfg);
        });
    }

    createAudio(cfg) {
        const audio = new Audio(cfg.src);
        audio.loop = !!cfg.loop;
        audio.volume = cfg.volume ?? 1;
        audio.muted = this.muted;
        return audio;
    }

    createSoundEntry(audio, cfg) {
        return {
            audio,
            category: cfg.category || "sfx",
            loop: !!cfg.loop,
            volume: cfg.volume ?? 1,
        };
    }

    getEntry(key) {
        return this.sounds[key] || null;
    }

    play(key, force = false) {
        const entry = this.getEntry(key);
        if (!entry) return;

        const audio = entry.audio;
        if (!audio.paused && !force) return;

        audio.currentTime = 0;
        audio.play().catch(() => {});
    }

    stop(key) {
        const entry = this.getEntry(key);
        if (!entry) return;
        this.stopAudio(entry.audio);
    }

    stopAudio(audio) {
        audio.pause();
        audio.currentTime = 0;
    }

    forEachSound(callback) {
        Object.values(this.sounds).forEach(callback);
    }

    stopCategory(category) {
        this.forEachSound(entry => {
            if (entry.category !== category) return;
            this.stopAudio(entry.audio);
        });
    }

    stopAllAudio() {
        this.forEachSound(entry => this.stopAudio(entry.audio));
        this.currentMusicKey = null;
    }

    /* ---------- Musik ---------- */

    playMusic(key) {
        const entry = this.getEntry(key);
        if (!entry) return;

        if (this.shouldSkipMusic(entry, key)) return;

        if (this.currentMusicKey && this.currentMusicKey !== key) {
            this.stopMusic();
        }

        this.startMusic(entry, key);
    }

    shouldSkipMusic(entry, key) {
        const audio = entry.audio;
        return this.currentMusicKey === key && !audio.paused;
    }

    startMusic(entry, key) {
        const audio = entry.audio;

        audio.loop = !!entry.loop;
        audio.volume = entry.volume;
        audio.currentTime = 0;
        audio.play().catch(() => {});

        this.currentMusicKey = key;
    }

    stopMusic() {
        if (!this.currentMusicKey) return;
        this.stop(this.currentMusicKey);
        this.currentMusicKey = null;
    }

    /* ---------- Mute ---------- */

    setMuted(muted) {
        this.muted = muted;
        this.forEachSound(entry => {
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
