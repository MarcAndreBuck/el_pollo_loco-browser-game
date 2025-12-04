/**
 * Central asset registry containing all image paths used in the game.
 * 
 * Structure:
 * - character, enemies, boss, backgrounds, UI elements, collectibles, etc.
 * - Arrays represent animation frames in correct order.
 *
 * @typedef {Object.<string, string[] | Object>} AssetSet
 *
 * @type {AssetSet}
 */
const ASSETS = {
    character: {
        idle: Array.from({ length: 10 }, (_, i) =>
            `assets/2_character_pepe/1_idle/idle/I-${i + 1}.png`
        ),
        walk: Array.from({ length: 6 }, (_, i) =>
            `assets/2_character_pepe/2_walk/W-${i + 21}.png`
        ),
        jump: Array.from({ length: 9 }, (_, i) =>
            `assets/2_character_pepe/3_jump/J-${i + 31}.png`
        ),
        hurt: Array.from({ length: 3 }, (_, i) =>
            `assets/2_character_pepe/4_hurt/H-${i + 41}.png`
        ),
        dead: Array.from({ length: 7 }, (_, i) =>
            `assets/2_character_pepe/5_dead/D-${i + 51}.png`
        ),
        long_idle: Array.from({ length: 10 }, (_, i) =>
            `assets/2_character_pepe/1_idle/long_idle/I-${i + 11}.png`
        )
    },

    chicken_normal: {
        walk: Array.from({ length: 3 }, (_, i) =>
            `assets/3_enemies_chicken/chicken_normal/1_walk/${i + 1}_w.png`
        ),
        dead: [
            `assets/3_enemies_chicken/chicken_normal/2_dead/dead.png`,
        ]
    },

    chicken_small: {
        walk: Array.from({ length: 3 }, (_, i) =>
            `assets/3_enemies_chicken/chicken_small/1_walk/${i + 1}_w.png`
        ),
        dead: Array.from({ length: 1 }, (_, i) =>
            `assets/3_enemies_chicken/chicken_small/2_dead/dead.png`
        ),
    },

    boss_chicken: {
        walk: Array.from({ length: 4 }, (_, i) =>
            `assets/4_enemie_boss_chicken/1_walk/G${i + 1}.png`
        ),
        alert: Array.from({ length: 4 }, (_, i) =>
            `assets/4_enemie_boss_chicken/2_alert/G${i + 5}.png`
        ),
        attack: Array.from({ length: 4 }, (_, i) =>
            `assets/4_enemie_boss_chicken/3_attack/G${i + 13}.png`
        ),
        hurt: Array.from({ length: 3 }, (_, i) =>
            `assets/4_enemie_boss_chicken/4_hurt/G${i + 21}.png`
        ),
        dead: Array.from({ length: 3 }, (_, i) =>
            `assets/4_enemie_boss_chicken/5_dead/G${i + 24}.png`
        ),
    },

    background: [
        "assets/5_background/layers/air.png",
        "assets/5_background/layers/3_third_layer/1.png",
        "assets/5_background/layers/2_second_layer/1.png",
        "assets/5_background/layers/1_first_layer/1.png",
    ],

    clouds: [
        "assets/5_background/layers/4_clouds/1.png",
        "assets/5_background/layers/4_clouds/2.png",
    ],

    bottle: {
        rotation: Array.from({ length: 4 }, (_, i) =>
            `assets/6_salsa_bottle/bottle_rotation/${i + 1}_bottle_rotation.png`
        ),
        splash: Array.from({ length: 6 }, (_, i) =>
            `assets/6_salsa_bottle/bottle_rotation/bottle_splash/${i + 1}_bottle_splash.png`
        ),
        on_ground: Array.from({ length: 2 }, (_, i) =>
            `assets/6_salsa_bottle/${i + 1}_salsa_bottle_on_ground.png`
        )
    },

    statusbar: {

        coin: {
            icon: ["assets/7_statusbars/3_icons/icon_coin.png"],
        },

        health: {
            green: Array.from({ length: 6 }, (_, i) =>
                `assets/7_statusbars/1_statusbar/2_statusbar_health/green/${i * 20}.png`
            ),
        },

        bottle: {
            blue: Array.from({ length: 6 }, (_, i) =>
                `assets/7_statusbars/1_statusbar/3_statusbar_bottle/blue/${i * 20}.png`
            ),
        },

        endboss: {
            orange: Array.from({ length: 6 }, (_, i) =>
                `assets/7_statusbars/2_statusbar_endboss/orange/orange${i * 20}.png`
            ),
        },
    },

    coin: [
        "assets/8_coin/coin_1.png",
        "assets/8_coin/coin_2.png",
    ],

    start_and_end_screen: {

        game_over: [
            "assets/You won, you lost/Game Over.png",
            "assets/You won, you lost/You lost.png",
            "assets/You won, you lost/Game over A.png",
            "assets/You won, you lost/You lost b.png",
        ],

        start: [
            "assets/9_intro_outro_screens/start/startscreen_1.png",
            "assets/9_intro_outro_screens/start/startscreen_2.png",
        ],

        win: [
            "assets/You won, you lost/You Win A.png",
            "assets/You won, you lost/You win B.png",
            "assets/You won, you lost/You won A.png",
            "assets/You won, you lost/You Won B.png",
        ]
    },
    controls: [
        "assets/5_background/second_half_background.png",
    ],

};