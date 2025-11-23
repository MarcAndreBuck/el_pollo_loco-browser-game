class Chicken extends MovableObject {

    constructor() {
        super();

        this.animations = ASSETS.chicken_normal;
        this.feetOffset = -10;

        this.speed = 0.2 + Math.random() * 0.4;

        this.x = 200 + Math.random() * 500;
        this.snapToGround();

        this.preloadAnimations(this.animations);
        this.loadImage(this.animations.walk[0]);
    }

    update() {
        this.moveLeft(this.speed)
        this.playAnimation(this.animations.walk, 8);
        this.applyGravity()
    }
}
