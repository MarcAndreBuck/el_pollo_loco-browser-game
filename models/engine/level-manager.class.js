/**
 * Manages level creation, switching and restarting.
 * Uses factory functions to generate fresh level instances.
 */
class LevelManager {
    constructor() {
        /** @type {number} Index of the active level */
        this.currentIndex = 0;

        /**
         * List of level factory functions.
         * Each factory must return a new Level instance.
         * @type {Array<() => Level>}
         */
        this.levelFactories = [
            createLevel1,
        ];
    }

    /**
     * Returns the current level by calling its factory.
     * Always generates a fresh instance.
     * @returns {Level} Newly created level.
     */
    getCurrentLevel() {
        const factory = this.levelFactories[this.currentIndex];
        return factory();
    }

    /**
     * Restarts the current level and resets the world state.
     * @param {World} world - The world to reset.
     */
    restartCurrentLevel(world) {
        const newLevel = this.getCurrentLevel();
        world.resetGame(newLevel);
    }
}
