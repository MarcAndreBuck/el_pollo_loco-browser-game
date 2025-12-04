/**
 * Central sound manager for effects and music.
 * Handles preload, playback, categories and mute state persistence.
 */
class SoundManager {
    /**
     * @param {Object<string, {src:string,loop?:boolean,volume?:number,category?:string}>} soundList
     * @param {string} [storageKey="game_muted"] - LocalStorage key for mute state.
     */
    constructor(soundList, storageKey = "game_muted") {
        this.sounds = {};
        this.storageKey = storageKey;
        this.muted = this.loadMuted();
        this.currentMusicKey = null;
        this.preload(soundList);
    }

    /**
     * Preloads all sounds from a config map into Audio instances.
     * @param {Object} list - Sound configuration map.
     */
    preload(list) {
        Object.entries(list).forEach(([key, cfg]) => {
            const audio = this.createAudio(cfg);
            this.sounds[key] = this.createSoundEntry(audio, cfg);
        });
    }

    /**
     * Creates a configured HTMLAudioElement from sound config.
     * @param {{src:string,loop?:boolean,volume?:number}} cfg
     * @returns {HTMLAudioElement}
     */
    createAudio(cfg) {
        const audio = new Audio(cfg.src);
        audio.loop = !!cfg.loop;
        audio.volume = cfg.volume ?? 1;
        audio.muted = this.muted;
        return audio;
    }

    /**
     * Wraps an audio element into a sound entry object.
     * @param {HTMLAudioElement} audio
     * @param {{category?:string,loop?:boolean,volume?:number}} cfg
     * @returns {{audio:HTMLAudioElement,category:string,loop:boolean,volume:number}}
     */
    createSoundEntry(audio, cfg) {
        return {
            audio,
            category: cfg.category || "sfx",
            loop: !!cfg.loop,
            volume: cfg.volume ?? 1,
        };
    }

    /**
     * Returns the sound entry for a given key or throws if unknown.
     * Runtime errors are intentional here to expose wrong keys.
     * @param {string} key
     * @returns {{audio:HTMLAudioElement,category:string,loop:boolean,volume:number}}
     */
    getEntry(key) {
        const entry = this.sounds[key];
        if (!entry) {
            throw new Error(`Sound "${key}" is not registered in SoundManager.`);
        }
        return entry;
    }

    /**
     * Plays a sound by key, optionally forcing restart.
     * @param {string} key
     * @param {boolean} [force=false] - Restart even if already playing.
     */
    play(key, force = false) {
        const entry = this.getEntry(key);
        const audio = entry.audio;
        if (!audio.paused && !force) return;

        audio.currentTime = 0;
        audio.play().catch(() => {});
    }

    /**
     * Stops a sound by key and resets its playback position.
     * @param {string} key
     */
    stop(key) {
        const entry = this.getEntry(key);
        this.stopAudio(entry.audio);
    }

    /**
     * Stops and rewinds a given audio instance.
     * @param {HTMLAudioElement} audio
     */
    stopAudio(audio) {
        audio.pause();
        audio.currentTime = 0;
    }

    /**
     * Iterates over all sound entries and calls the given callback.
     * @param {(entry: {audio:HTMLAudioElement,category:string,loop:boolean,volume:number}) => void} callback
     */
    forEachSound(callback) {
        Object.values(this.sounds).forEach(callback);
    }

    /**
     * Stops all sounds belonging to a specific category.
     * @param {string} category - E.g. "music" or "sfx".
     */
    stopCategory(category) {
        this.forEachSound(entry => {
            if (entry.category !== category) return;
            this.stopAudio(entry.audio);
        });
    }

    /**
     * Stops all audio and clears the current music key.
     */
    stopAllAudio() {
        this.forEachSound(entry => this.stopAudio(entry.audio));
        this.currentMusicKey = null;
    }

    /**
     * Starts playing music for the given key, stopping previous music if needed.
     * @param {string} key
     */
    playMusic(key) {
        const entry = this.getEntry(key);
        if (this.shouldSkipMusic(entry, key)) return;

        if (this.currentMusicKey && this.currentMusicKey !== key) {
            this.stopMusic();
        }

        this.startMusic(entry, key);
    }

    /**
     * Checks if music should be skipped because the same track is already playing.
     * @param {{audio:HTMLAudioElement}} entry
     * @param {string} key
     * @returns {boolean} True if the same track is already running.
     */
    shouldSkipMusic(entry, key) {
        const audio = entry.audio;
        return this.currentMusicKey === key && !audio.paused;
    }

    /**
     * Starts music playback and updates the current music key.
     * @param {{audio:HTMLAudioElement,loop:boolean,volume:number}} entry
     * @param {string} key
     */
    startMusic(entry, key) {
        const audio = entry.audio;

        audio.loop = !!entry.loop;
        audio.volume = entry.volume;
        audio.currentTime = 0;
        audio.play().catch(() => {});

        this.currentMusicKey = key;
    }

    /**
     * Stops the currently playing music if any.
     */
    stopMusic() {
        if (!this.currentMusicKey) return;
        this.stop(this.currentMusicKey);
        this.currentMusicKey = null;
    }

    /**
     * Sets the global muted state and applies it to all sounds.
     * Persists the value in localStorage.
     * @param {boolean} muted
     */
    setMuted(muted) {
        this.muted = muted;
        this.forEachSound(entry => {
            entry.audio.muted = muted;
        });
        this.saveMuted();
    }

    /**
     * Toggles the muted state on or off.
     */
    toggleMute() {
        this.setMuted(!this.muted);
    }

    /**
     * Loads the muted state from localStorage.
     * @returns {boolean} True if muted, false otherwise.
     */
    loadMuted() {
        return localStorage.getItem(this.storageKey) === "true";
    }

    /**
     * Saves the current muted state to localStorage.
     */
    saveMuted() {
        localStorage.setItem(this.storageKey, this.muted);
    }
}

/**
 * Global sound manager instance used by the game.
 * Exposes the configured sounds from SOUNDS.
 * @type {SoundManager}
 */
const soundManager = new SoundManager(SOUNDS);
