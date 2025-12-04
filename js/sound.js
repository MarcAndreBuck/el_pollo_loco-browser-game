/**
 * Global sound configuration map used by the SoundManager.
 *
 * @typedef {Object} SoundConfig
 * @property {string} src - File path to the audio file.
 * @property {boolean} [loop] - Whether the sound loops.
 * @property {number} volume - Playback volume (0.0–1.0).
 * @property {"music" | "sfx" | "ui"} category - Type of sound.
 *
 * @type {Object.<string, SoundConfig>}
 */
const SOUNDS = {

    music_level: {
        src: "sounds/freepik__vibrant-shadows-of-the-fiesta__1131.mp3",
        loop: true,
        volume: 0.2,
        category: "music",
    },

    music_boss: {
        src: "sounds/freepik__fiesta-fury_-battle-for-the-crown__1128.mp3",
        loop: true,
        volume: 0.6,
        category: "music",
    },

    boss_hurt: {
        src: "sounds/chicken-hurt.wav",
        loop: false,
        volume: 0.9,
        category: "sfx",
    },

    boss_death: {
        src: "sounds/chicken-death.wav",
        loop: false,
        volume: 1.0,
        category: "sfx",
    },

    boss_idle: {
        src: "sounds/chicken-idle.wav",
        loop: true,
        volume: 0.3,
        category: "sfx",
    },

    boss_alert: {
        src: "sounds/chicken-alert.wav",
        loop: false,
        volume: 0.6,
        category: "sfx",
    },

    boss_attack: {
        src: "sounds/chicken-attack.wav",
        loop: false,
        volume: 0.7,
        category: "sfx",
    },

    chicken_death: {
        src: "sounds/chicken-430403.mp3",
        loop: false,
        volume: 0.9,
        category: "sfx",
    },

    player_jump: {
        src: "sounds/pixel-jump-319167.mp3",
        volume: 0.02,
        category: "sfx",
    },

    player_step: {
        src: "sounds/sand_step-87182 (mp3cut.net).wav",
        loop: false,
        volume: 0.5,
        category: "sfx",
    },

    player_hurt: {
        src: "sounds/ouchmp3-14591.mp3",
        loop: false,
        volume: 0.9,
        category: "sfx",
    },

    player_collect_coin: {
        src: "sounds/collectcoin-6075.mp3",
        loop: false,
        volume: 0.6,
        category: "sfx",
    },

    player_collect_bottle: {
        src: "sounds/paper-collect-7-186721.mp3",
        loop: false,
        volume: 0.6,
        category: "sfx",
    },

    player_snore: {
        src: "sounds/big-snore-78224 (mp3cut.net).wav",
        loop: false,
        volume: 0.9,
        category: "sfx",
    },

    bottle_break: {
        src: "sounds/short-break-363190.wav",
        loop: false,
        volume: 0.6,
        category: "sfx",
    },

    ui_click: {
        src: "sounds/mouse-click-290204.mp3",
        loop: false,
        volume: 0.6,
        category: "ui",
    },

    game_win: {
        src: "sounds/orchestral-win-331233.mp3",
        loop: false,
        volume: 0.8,
        category: "music",
    },

    game_lose: {
        src: "sounds/verloren-87837.mp3",
        loop: false,
        volume: 0.7,
        category: "sfx",
    },
};
