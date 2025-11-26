class Chicken extends MovableObject {
    collisionCategory = "enemy";

    constructor() {
        super();

        this.animations = ASSETS.chicken_normal;
        this.feetOffset = -10;

        this.speed = 0.2 + Math.random() * 0.4;

        this.health = 1;
        this.isDead = false;
        this.deathFinished = false;

        this.x = 200 + Math.random() * 500;
        this.snapToGround();

        this.preloadAnimations(this.animations);
        this.loadImage(this.animations.walk[0]);
        this.setHitbox(0, 0, 100, 100);
    }

    update() {

        this.updateAnimation();
        this.applyGravity();

        if (!this.isDead) {
            this.moveLeft(this.speed);
        }
    }

    updateAnimation() {
        
        if (this.isDead) {
            this.playAnimation(this.animations.dead, 8, false);
            return
        }
        else this.playAnimation(this.animations.walk, 8);;
    }
}


class SmallChicken extends MovableObject {
    collisionCategory = "enemy";

    constructor() {
        super();

        this.animations = ASSETS.chicken_small;
        this.feetOffset = -10;

        this.speed = 0.2 + Math.random() * 0.4;

        this.health = 1;
        this.isDead = false;
        this.deathFinished = false;

        this.x = 200 + Math.random() * 500;
        this.snapToGround();

        this.preloadAnimations(this.animations);
        this.loadImage(this.animations.walk[0]);
        this.setHitbox(0, 0, 100, 100);
    }

    update() {

        this.updateAnimation();
        this.applyGravity();

        if (!this.isDead) {
            this.moveLeft(this.speed);
        }
    }

    updateAnimation() {
        
        if (this.isDead) {
            this.playAnimation(this.animations.dead, 8, false);
            return
        }
        else this.playAnimation(this.animations.walk, 8);;
    }
}
