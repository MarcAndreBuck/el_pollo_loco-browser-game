const ASSETS = {
    character: {
        idle: Array.from({ length: 10 }, (_, i) =>
            `assets/2_character_pepe/1_idle/idle/I-${i + 1}.png`
        ),
        walk: Array.from({ length: 6 }, (_, i) =>
            `assets/2_character_pepe/2_walk/W-${i + 21}.png`
        ),
        jump: Array.from({ length: 9 }, (_, i) =>
            `assets/2_character_pepe/2_walk/W-${i + 31}.png`
        ),
        hurt: Array.from({ length: 3 }, (_, i) =>
            `assets/2_character_pepe/2_walk/W-${i + 41}.png`
        ),
        dead: Array.from({ length: 7 }, (_, i) =>
            `assets/2_character_pepe/2_walk/W-${i + 51}.png`
        ),
        long_idle: Array.from({ length: 10 }, (_, i) =>
            `assets/2_character_pepe/1_idle/long_idle/I-${i + 11}.png`
        )
    },

    chicken_normal: {
        walk: Array.from({ length: 3 }, (_, i) =>
            `assets/3_enemies_chicken/chicken_normal/1_walk/${i + 1}_w.png`
        ),
        dead: Array.from({ length: 1 }, (_, i) =>
            `assets/3_enemies_chicken/chicken_normal/1_walk/${i + 1}_w.png`
        ),
    },

    chicken_small: {
        walk: Array.from({ length: 3 }, (_, i) =>
            `assets/3_enemies_chicken/chicken_small/1_walk/${i + 1}_w.png`
        ),
        dead: Array.from({ length: 1 }, (_, i) =>
            `assets/3_enemies_chicken/chicken_small/1_walk/${i + 1}_w.png`
        ),
    },

    boss_chicken: {
        walk: Array.from({ length: 4 }, (_, i) =>
            `assets/4_enemie_boss_chicken/1_walk/G${i + 1}.png`
        ),
        alert: Array.from({ length: 4 }, (_, i) =>
            `assets/4_enemie_boss_chicken/1_alert/G${i + 1}.png`
        ),
        attack: Array.from({ length: 4 }, (_, i) =>
            `assets/4_enemie_boss_chicken/1_attack/G${i + 1}.png`
        ),
        hurt: Array.from({ length: 4 }, (_, i) =>
            `assets/4_enemie_boss_chicken/1_hurt/G${i + 1}.png`
        ),
        dead: Array.from({ length: 4 }, (_, i) =>
            `assets/4_enemie_boss_chicken/1_dead/G${i + 1}.png`
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
    ],
};