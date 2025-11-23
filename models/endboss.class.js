class Endboss extends MovableObject {

    constructor() {
        super();

        this.animations = ASSETS.boss_chicken;
        this.feetOffset = -10;

        this.speed = 0.2;

        this.x = CONFIG.world.width - 300
        this.snapToGround();

        this.preloadAnimations(this.animations);
        this.loadImage(this.animations.walk[0]);
    }

    update() {
        this.moveLeft(this.speed);
        this.playAnimation(this.animations.walk, 8);
        this.applyGravity()
    }
}
