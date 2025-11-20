class Level {

    enemies;
    clouds;
    backgroundObjects;
    worldWidth = 0;

    constructor(enemies, backgroundObjects, clouds, collectables = []) {

        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.collectables = collectables;
    }

}