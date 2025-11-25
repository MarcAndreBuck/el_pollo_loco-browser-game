class Collectable extends MovableObject {
    collisionCategory = "collectable";
    isCollected = false;

    constructor(x, y, width = 40, height = 40) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.setHitbox(0, 0, this.width, this.height);
    }

    
    update() {
    }


    onCollect(world) {
        this.isCollected = true;
    }
}
