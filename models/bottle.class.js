class Bottle extends Collectable {
    collisionCategory = "collectable";

    constructor(x, y) {
        super(x, y, 60, 60);

        this.animations = ASSETS.bottle;
        this.snapToGround();

        this.loadImage(this.animations.on_ground[Math.floor(Math.random() * 2)]);

        this.value = 1;
        this.setHitbox(20, 10, 30, 40);
    }

     update() {
    }

    onCollect(world) {
        world.bottle = (world.bottle) + this.value;
        super.onCollect(world);
    }
}



class ThrowBottle extends MovableObject {
    collisionCategory = "projectile";

    constructor(x, y) {
        super();

        this.animations = ASSETS.bottle;
        this.x = x;
        this.snapToGround();

        this.loadImage(this.animations.rotation[0]);
        this.playAnimation(this.animations.rotation)
        this.setHitbox(0, 95, 100, 100);
    }

    update() {

    }
}