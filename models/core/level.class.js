/**
 * Represents a game level containing enemies, background objects,
 * clouds, collectables and the total world width.
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    worldWidth = 0;

    /**
     * @param {Enemies[]} enemies - Array of enemy instances.
     * @param {Object[]} backgroundObjects - Array of background layers.
     * @param {Object[]} clouds - Array of cloud objects.
     * @param {Object[]} collectables - Items such as coins or bottles.
     * @param {number} levelWidth - Total width of the level.
     */
    constructor(
        enemies = [],
        backgroundObjects = [],
        clouds = [],
        collectables = [],
        levelWidth = 0
    ) {
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
        this.clouds = clouds;
        this.collectables = collectables;
        this.worldWidth = levelWidth;
    }
}

/**
 * Factory function to create level 1 using the predefined arrays.
 * @returns {Level} Instance of Level configured as Level 1.
 */
function createLevel1() {
    return new Level(
        enemiesArray,
        backgroundArray,
        cloudsArray,
        collectablesArray,
        LEVEL1_WIDTH
    );
}
