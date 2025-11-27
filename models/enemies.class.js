class Enemies extends MovableObject {
    collisionCategory = "enemy";

    constructor(x, y, width, height, animations) {
        super(x, y, width, height);

        this.animations = animations;
        this.speed = 0.2 + Math.random() * 0.4;
        this.health = 1;
        this.feetOffset = -10;

        this.preloadAnimations(this.animations);
        this.loadImage(this.animations.walk[0]);
    }

    update() {
        this.applyGravity();

        if (!this.isDead) {
            this.moveLeft(this.speed);
        }

        this.updateAnimation();
    }

    updateAnimation() {
        if (this.isDead) {
            this.playAnimation(this.animations.dead, 8, false);
        } else {
            this.playAnimation(this.animations.walk, 8);
        }
    }
}



class Chicken extends Enemies {
    constructor(x, y, width = 90, height = 70) {
        if (x == null) x = 400 + Math.random() * 2000;

        super(x, y, width, height, ASSETS.chicken_normal);

        this.setHitbox(10, 20, 80, 50);
    }
}


class SmallChicken extends Enemies {
    constructor(x, y, width = 60, height = 45) {
        if (x == null) x = 200 + Math.random() * 2000;

        super(x, y, width, height, ASSETS.chicken_small);

        this.setHitbox(5, 5, 50, 40);
    }
}