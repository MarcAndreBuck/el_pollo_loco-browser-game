class Endboss extends MovableObject {

    constructor() {
        super();

        this.animations = ASSETS.boss_chicken;

        this.speed = 0.2;

        this.x = CONFIG.world.width - 300
        this.y = 350;

        this.preloadAnimations(this.animations);
        this.loadImage(this.animations.walk[0]);
    }

    update() {
        this.x -= this.speed;
        this.playAnimation(this.animations.walk, 8);
    }
}
