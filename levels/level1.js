/**
 * Number of horizontal background segments in Level 1.
 * @type {number}
 */
const LEVEL1_SEGMENTS = 8;

/**
 * Width of a single repeating background tile in pixels.
 * @type {number}
 */
const TILE_WIDTH = 719;
const TILE_WIDTH_LAYER_2 = 718;
const TILE_WIDTH_LAYER_3 = 717;
const TILE_WIDTH_LAYER_4 = 716;

/**
 * Total world width for Level 1 based on number of segments.
 * @type {number}
 */
const LEVEL1_WIDTH = LEVEL1_SEGMENTS * TILE_WIDTH_LAYER_4;

/**
 * Creates Level 1 including enemies, background layers,
 * clouds, collectables and the total level width.
 *
 * @returns {Level} Fully configured level instance.
 */
function createLevel1() {
    return new Level(
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

            new BackgroundObject("assets/5_background/layers/air.png", TILE_WIDTH, 0),
            new BackgroundObject("assets/5_background/layers/3_third_layer/2.png", TILE_WIDTH_LAYER_2, 0),
            new BackgroundObject("assets/5_background/layers/2_second_layer/2.png", TILE_WIDTH_LAYER_3, 0),
            new BackgroundObject("assets/5_background/layers/1_first_layer/2.png", TILE_WIDTH_LAYER_4, 0),

            new BackgroundObject("assets/5_background/layers/air.png", TILE_WIDTH * 2, 0),
            new BackgroundObject("assets/5_background/layers/3_third_layer/1.png", TILE_WIDTH_LAYER_2 * 2, 0),
            new BackgroundObject("assets/5_background/layers/2_second_layer/1.png", TILE_WIDTH_LAYER_3 * 2, 0),
            new BackgroundObject("assets/5_background/layers/1_first_layer/1.png", TILE_WIDTH_LAYER_4 * 2, 0),

            new BackgroundObject("assets/5_background/layers/air.png", TILE_WIDTH * 3, 0),
            new BackgroundObject("assets/5_background/layers/3_third_layer/2.png", TILE_WIDTH_LAYER_2 * 3, 0),
            new BackgroundObject("assets/5_background/layers/2_second_layer/2.png", TILE_WIDTH_LAYER_3 * 3, 0),
            new BackgroundObject("assets/5_background/layers/1_first_layer/2.png", TILE_WIDTH_LAYER_4 * 3, 0),

            new BackgroundObject("assets/5_background/layers/air.png", TILE_WIDTH * 4, 0),
            new BackgroundObject("assets/5_background/layers/3_third_layer/1.png", TILE_WIDTH_LAYER_2 * 4, 0),
            new BackgroundObject("assets/5_background/layers/2_second_layer/1.png", TILE_WIDTH_LAYER_3 * 4, 0),
            new BackgroundObject("assets/5_background/layers/1_first_layer/1.png", TILE_WIDTH_LAYER_4 * 4, 0),

            new BackgroundObject("assets/5_background/layers/air.png", TILE_WIDTH * 5, 0),
            new BackgroundObject("assets/5_background/layers/3_third_layer/2.png", TILE_WIDTH_LAYER_2 * 5, 0),
            new BackgroundObject("assets/5_background/layers/2_second_layer/2.png", TILE_WIDTH_LAYER_3 * 5, 0),
            new BackgroundObject("assets/5_background/layers/1_first_layer/2.png", TILE_WIDTH_LAYER_4 * 5, 0),

            new BackgroundObject("assets/5_background/layers/air.png", TILE_WIDTH * 6, 0),
            new BackgroundObject("assets/5_background/layers/3_third_layer/1.png", TILE_WIDTH_LAYER_2 * 6, 0),
            new BackgroundObject("assets/5_background/layers/2_second_layer/1.png", TILE_WIDTH_LAYER_3 * 6, 0),
            new BackgroundObject("assets/5_background/layers/1_first_layer/1.png", TILE_WIDTH_LAYER_4 * 6, 0),

            new BackgroundObject("assets/5_background/layers/air.png", TILE_WIDTH * 7, 0),
            new BackgroundObject("assets/5_background/layers/3_third_layer/2.png", TILE_WIDTH_LAYER_2 * 7, 0),
            new BackgroundObject("assets/5_background/layers/2_second_layer/2.png", TILE_WIDTH_LAYER_3 * 7, 0),
            new BackgroundObject("assets/5_background/layers/1_first_layer/2.png", TILE_WIDTH_LAYER_4 * 7, 0),
        ],
        [
            new Cloud(0),
            new Cloud(TILE_WIDTH * 1),
            new Cloud(TILE_WIDTH * 2),
            new Cloud(TILE_WIDTH * 3),
            new Cloud(TILE_WIDTH * 4),
            new Cloud(TILE_WIDTH * 5),
            new Cloud(TILE_WIDTH * 6),
            new Cloud(TILE_WIDTH * 7),
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
        LEVEL1_WIDTH
    );
}
