class ThrowBottle extends MovableObject {
    collisionCategory = "projectile";

    constructor(x, y, direction = 1) {
        super();

        this.animations = ASSETS.bottle;
        this.width = 60;
        this.height = 60;

        this.x = x;
        this.y = y;

        this.speedX = 4 * direction;
        this.speedY = -8;

        this.hasGravity = true;

        this.spawnTime = performance.now();
        this.lifeDuration = 2000;

        this.preloadAnimations(this.animations);
        this.loadImage(this.animations.rotation[0]);

        this.setHitbox(20, 20, 20, 20);

        this.isBreaking = false;
    }

    update() {
        if (this.isBreaking) {
            this.playAnimation(this.animations.splash, 12, false, () => (this.isDead = true));
            return;
        }
        this.applyGravity();
        this.x += this.speedX;
        const age = performance.now() - this.spawnTime;
        const lifetimeOver = age >= this.lifeDuration;
        const hitGround = this.bottom >= this.groundY;
        if (lifetimeOver || hitGround) {
            this.break();
        } else if (this.animations.rotation) { this.playAnimation(this.animations.rotation, 36); }
    }

    break() {
        if (this.isBreaking) return;

        this.isBreaking = true;
        this.speedX = 0;
        this.speedY = 0;
        this.hasGravity = false;
    }
}
