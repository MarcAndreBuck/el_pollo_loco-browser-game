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
        world.bottles = (world.bottles) + this.value;
        super.onCollect(world);
    }
}



