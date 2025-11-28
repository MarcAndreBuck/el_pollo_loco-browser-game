class Level {

    enemies;
    clouds;
    backgroundObjects;
    worldWidth = 0;

    constructor(enemies = [], backgroundObjects = [], clouds = [], collectables = [], levelWidth = 0) {

        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
        this.clouds = clouds;
        this.collectables = collectables;
        this.worldWidth = levelWidth
    }

}
