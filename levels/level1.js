const LEVEL1_SEGMENTS = 8;
const TILE_WIDTH = 719;
const LEVEL1_WIDTH = LEVEL1_SEGMENTS * TILE_WIDTH;




const level1 = new Level(
    [
        new Chicken(900, 0),
        new SmallChicken(1345, 0),
        new Chicken(1790, 0),
        new SmallChicken(2235, 0),
        new Chicken(2680, 0),
        new SmallChicken(3120, 0),
        new Chicken(3565, 0),
        new SmallChicken(4010, 0),
        new Chicken(4455, 0),
        new SmallChicken(4900, 0),
    ],
    [
        new BackgroundObject("assets/5_background/layers/air.png", 0, 0),
        new BackgroundObject("assets/5_background/layers/3_third_layer/1.png", 0, 0),
        new BackgroundObject("assets/5_background/layers/2_second_layer/1.png", 0, 0),
        new BackgroundObject("assets/5_background/layers/1_first_layer/1.png", 0, 0),

        new BackgroundObject("assets/5_background/layers/air.png", 719, 0),
        new BackgroundObject("assets/5_background/layers/3_third_layer/2.png", 719, 0),
        new BackgroundObject("assets/5_background/layers/2_second_layer/2.png", 719, 0),
        new BackgroundObject("assets/5_background/layers/1_first_layer/2.png", 719, 0),

        new BackgroundObject("assets/5_background/layers/air.png", 719 * 2, 0),
        new BackgroundObject("assets/5_background/layers/3_third_layer/1.png", 719 * 2, 0),
        new BackgroundObject("assets/5_background/layers/2_second_layer/1.png", 719 * 2, 0),
        new BackgroundObject("assets/5_background/layers/1_first_layer/1.png", 719 * 2, 0),

        new BackgroundObject("assets/5_background/layers/air.png", 719 * 3, 0),
        new BackgroundObject("assets/5_background/layers/3_third_layer/2.png", 719 * 3, 0),
        new BackgroundObject("assets/5_background/layers/2_second_layer/2.png", 719 * 3, 0),
        new BackgroundObject("assets/5_background/layers/1_first_layer/2.png", 719 * 3, 0),

        new BackgroundObject("assets/5_background/layers/air.png", 719 * 4, 0),
        new BackgroundObject("assets/5_background/layers/3_third_layer/1.png", 719 * 4, 0),
        new BackgroundObject("assets/5_background/layers/2_second_layer/1.png", 719 * 4, 0),
        new BackgroundObject("assets/5_background/layers/1_first_layer/1.png", 719 * 4, 0),

        new BackgroundObject("assets/5_background/layers/air.png", 719 * 5, 0),
        new BackgroundObject("assets/5_background/layers/3_third_layer/2.png", 719 * 5, 0),
        new BackgroundObject("assets/5_background/layers/2_second_layer/2.png", 719 * 5, 0),
        new BackgroundObject("assets/5_background/layers/1_first_layer/2.png", 719 * 5, 0),

        new BackgroundObject("assets/5_background/layers/air.png", 719 * 6, 0),
        new BackgroundObject("assets/5_background/layers/3_third_layer/1.png", 719 * 6, 0),
        new BackgroundObject("assets/5_background/layers/2_second_layer/1.png", 719 * 6, 0),
        new BackgroundObject("assets/5_background/layers/1_first_layer/1.png", 719 * 6, 0),

        new BackgroundObject("assets/5_background/layers/air.png", 719 * 7, 0),
        new BackgroundObject("assets/5_background/layers/3_third_layer/2.png", 719 * 7, 0),
        new BackgroundObject("assets/5_background/layers/2_second_layer/2.png", 719 * 7, 0),
        new BackgroundObject("assets/5_background/layers/1_first_layer/2.png", 719 * 7, 0),
    ],
    [
        new Cloud(),
    ],
    [
        new Coin(620, 280),
        new Coin(660, 260),
        new Coin(700, 240),
        new Coin(740, 260),
        new Coin(780, 280),

        new Coin(1520, 280),
        new Coin(1560, 260),
        new Coin(1600, 240),
        new Coin(1640, 260),
        new Coin(1680, 280),

        new Coin(2420, 280),
        new Coin(2460, 260),
        new Coin(2500, 240),
        new Coin(2540, 260),
        new Coin(2580, 280),

        new Coin(3320, 280),
        new Coin(3360, 260),
        new Coin(3400, 240),
        new Coin(3440, 260),
        new Coin(3480, 280),

        new Coin(4220, 280),
        new Coin(4260, 260),
        new Coin(4300, 240),
        new Coin(4340, 260),
        new Coin(4380, 280),



        new Bottle(800, 360),
        new Bottle(1180, 360),
        new Bottle(1560, 360),
        new Bottle(1945, 360),
        new Bottle(2325, 360),
        new Bottle(2710, 360),
        new Bottle(3090, 360),
        new Bottle(3475, 360),
        new Bottle(3855, 360),
        new Bottle(4235, 360),
        new Bottle(4620, 360),
        new Bottle(5000, 360),
    ],
    LEVEL1_WIDTH,
);

