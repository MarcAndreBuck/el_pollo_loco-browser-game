class MovableObject {
    x = 120;
    y = 335;
    img;
    height = 100;
    width = 100;
    imageCache = {};
    currentImage = 0;
    currentAnimation = null;
    speed = 0.25;
    otherDirection = false;
    isDead = false;

    speedY = 0;
    acceleration = 0.2;
    hasGravity = true;

    groundY = 430;
    isGrounded = false;
    feetOffset = 0;

    collisionCategory = "other";
    health = 0;

    hitbox = {
        offsetX: 0,
        offsetY: 0,
        width: null,
        height: null,
    };

    constructor() {
        this.lastFrameTime = 0;
    }

    /* ---------- Assets ---------- */

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach(path => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    preloadAnimations(animations) {
        Object.values(animations).forEach(frames => this.loadImages(frames));
    }

    /* ---------- Animation (universal) ---------- */


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

    /* ---------- Geometrie / Hitbox ---------- */

    get worldWidth() {
        return CONFIG.world.width;
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
        const width = this.hitbox.width ?? this.width;
        const height = this.hitbox.height ?? this.height;

        return {
            x: this.x + this.hitbox.offsetX,
            y: this.y + this.hitbox.offsetY,
            width,
            height,
        };
    }

    /* ---------- Bewegung / Physik ---------- */

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

    /* ---------- Leben / Schaden ---------- */

    die() {
        this.isDead = true;
        this.currentImage = 0;
        this.lastFrameTime = 0;
        this.currentAnimation = null;
    }

    takeDamage(amount = 1) {
        if (this.isDead) return;

        this.health = Math.max(0, this.health - amount);
        console.log(this.collisionCategory, "HP:", this.health);

        if (this.health === 0) {
            this.die();
        }
    }
}
