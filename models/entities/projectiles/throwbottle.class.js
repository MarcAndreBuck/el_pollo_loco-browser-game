class ThrowBottle extends MovableObject {
    collisionCategory = "projectile";
    hasHit = false;

    constructor(x, y, direction = 1) {
        super();
        this.setupBasics(x, y);
        this.setupPhysics(direction);
        this.setupLifetime();
        this.setupGraphics();
        this.setupHitbox();
    }

    setupBasics(x, y) {
        this.collisionCategory = "projectile";
        this.hasHit = false;
        this.width = 60;
        this.height = 60;
        this.x = x;
        this.y = y;
    }

    setupPhysics(direction) {
        this.speedX = 6 * direction;
        this.speedY = -7;
        this.hasGravity = true;
    }

    setupLifetime() {
        this.spawnTime = performance.now();
        this.lifeDuration = 2000;
    }

    setupGraphics() {
        this.animations = ASSETS.bottle;
        this.preloadAnimations(this.animations);
        this.loadImage(this.animations.rotation[0]);
        this.isBreaking = false;
    }

    setupHitbox() {
        this.setHitbox(20, 20, 20, 20);
    }


    update() {
        if (this.handleBreakingState()) return;
        this.applyGravity();
        this.x += this.speedX;

        if (this.shouldBreak()) {
            this.break();
        } else {
            this.playRotation();
        }
    }

    handleBreakingState() {
        if (!this.isBreaking) return false;

        this.playAnimation(this.animations.splash, 12, false, () => {
            this.isDead = true;
        });

        return true;
    }

    shouldBreak() {
        const age = performance.now() - this.spawnTime;
        const lifetimeOver = age >= this.lifeDuration;
        const hitGround = this.bottom >= this.groundY;
        return lifetimeOver || hitGround;
    }

    playRotation() {
        if (this.animations.rotation) {
            this.playAnimation(this.animations.rotation, 36);
        }
    }


    break() {
        if (this.isBreaking) return;
        soundManager.play("bottle_break", true)

        this.isBreaking = true;
        this.speedX = 0;
        this.speedY = 0;
        this.hasGravity = false;
        this.hasHit = true;
    }
}
