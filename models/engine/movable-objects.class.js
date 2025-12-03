class MovableObject extends DrawableObject {
    speed = 0.25;
    speedY = 0;
    acceleration = 0.2;
    otherDirection = false;

    currentImage = 0;
    currentAnimation = null;
    lastFrameTime = 0;

    isDead = false;
    isHurt = false;
    hurtUntil = 0;
    health = 0;

    hasGravity = true;
    groundY = 430;
    isGrounded = false;
    feetOffset = 0;

    collisionCategory = "other";

    hitbox = {
        offsetX: 0,
        offsetY: 0,
        width: null,
        height: null,
    };


    constructor(x = 0, y = 0, width = 100, height = 100) {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    preloadAnimations(animations) {
        Object.values(animations).forEach(frames => this.loadImages(frames));
    }

    playAnimation(images, fps = 10, loop = true, cb = null) {
        if (!this.updateAnimationFrame(images, fps)) return;
        this.applyFrame(images);
        if (this.isLastFrame(images)) {
            if (!loop) {
                cb && cb();
                return;
            }
            this.currentImage = 0;
        } else {
            this.currentImage++;
        }
    }

    updateAnimationFrame(images, fps) {
        const now = performance.now();
        const frameDur = 1000 / fps;

        this.startNewAnimation(images, now);

        if (!this.lastFrameTime) this.lastFrameTime = now;
        if (now - this.lastFrameTime < frameDur) return false;

        this.lastFrameTime = now;
        return true;
    }

    startNewAnimation(images, now) {
        if (this.currentAnimation === images) return;
        this.currentAnimation = images;
        this.currentImage = 0;
        this.lastFrameTime = now;
    }

    isLastFrame(images) {
        return this.currentImage >= images.length - 1;
    }

    applyFrame(images) {
        this.img = this.imageCache[images[this.currentImage]];
    }


    get bottom() {
        return this.y + this.height - this.feetOffset;
    }

    setHitbox(offsetX = 0, offsetY = 0, width = null, height = null) {
        this.hitbox.offsetX = offsetX;
        this.hitbox.offsetY = offsetY;
        this.hitbox.width = width;
        this.hitbox.height = height;
    }

    getHitbox() {
        return {
            x: this.x + this.hitbox.offsetX,
            y: this.y + this.hitbox.offsetY,
            width: this.hitbox.width ?? this.width,
            height: this.hitbox.height ?? this.height,
        };
    }

    snapToGround() {
        this.y = this.groundY - this.height + this.feetOffset;
    }

    applyGravity() {
        if (!this.hasGravity) return;

        this.speedY += this.acceleration;
        this.y += this.speedY;

        if (this.bottom >= this.groundY) {
            this.snapToGround();
            this.speedY = 0;
            this.isGrounded = true;
        } else {
            this.isGrounded = false;
        }
    }

    moveHorizontal(dx) {
        this.x += dx;
    }

    moveRight(speed = this.speed) {
        this.moveHorizontal(speed);
    }

    moveLeft(speed = this.speed) {
        this.moveHorizontal(-speed);
    }

    die() {
        this.isDead = true;
        this.currentImage = 0;
        this.lastFrameTime = 0;
        this.currentAnimation = null;
    }

    takeDamage(amount = 1) {
        if (this.isDead) return;

        this.health = Math.max(0, this.health - amount);
        this.isHurt = true;
        this.hurtUntil = performance.now() + 300;

        if (this.health === 0) this.die();
    }
}
