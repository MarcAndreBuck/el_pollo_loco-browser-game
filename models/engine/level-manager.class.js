class LevelManager {
    constructor() {
        this.currentIndex = 0;

        this.levelFactories = [
            createLevel1,
        ];
    }

    getCurrentLevel() {
        const factory = this.levelFactories[this.currentIndex];
        return factory();
    }

    restartCurrentLevel(world) {
        const newLevel = this.getCurrentLevel();
        world.resetGame(newLevel);
    }
}
