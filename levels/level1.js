const LEVEL1_SEGMENTS = 4;
const TILE_WIDTH = 719;
const LEVEL1_WIDTH = LEVEL1_SEGMENTS * TILE_WIDTH;




const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new SmallChicken(),
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
    ],
    [
        new Cloud(),
    ],
    [
        new Coin(200, 270),
        new Coin(800, 350),



        new Bottle(500, 360),
        new Bottle(600, 360),
        new Bottle(900, 360),
        new Bottle(1450, 360),
        new Bottle(1600, 360),
        new Bottle(2000, 360),
    ],
    LEVEL1_WIDTH,
);

