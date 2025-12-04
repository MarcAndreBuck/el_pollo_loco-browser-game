/**
 * Base class for movable objects with gravity, hitboxes and animations.
 * Extends DrawableObject with physics, health and sprite animation logic.
 */
class MovableObject extends DrawableObject {
    /** @type {number} Horizontal movement speed */
    speed = 0.25;
    /** @type {number} Vertical speed used for gravity/jumps */
    speedY = 0;
    /** @type {number} Gravity acceleration per frame */
    acceleration = 0.2;
    /** @type {boolean} True when facing left */
    otherDirection = false;

    /** @type {number} Current animation frame index */
    currentImage = 0;
    /** @type {string[]|null} Currently active animation frames */
    currentAnimation = null;
    /** @type {number} Last frame timestamp in ms */
    lastFrameTime = 0;

    /** @type {boolean} True if object is dead */
    isDead = false;
    /** @type {boolean} True while hurt is active */
    isHurt = false;
    /** @type {number} Timestamp until hurt effect lasts */
    hurtUntil = 0;
    /** @type {number} Current health value */
    health = 0;

    /** @type {boolean} Whether gravity should be applied */
    hasGravity = true;
    /** @type {number} Ground Y position */
    groundY = 430;
    /** @type {boolean} True if object is currently on ground */
    isGrounded = false;
    /** @type {number} Offset for feet correction on ground checks */
    feetOffset = 0;

    /** @type {string} Collision category for debug and systems */
    collisionCategory = "other";

    /** @type {{offsetX:number, offsetY:number, width:number|null, height:number|null}} */
    hitbox = {
        offsetX: 0,
        offsetY: 0,
        width: null,
        height: null,
    };

    /**
     * @param {number} [x=0] - Initial x position.
     * @param {number} [y=0] - Initial y position.
     * @param {number} [width=100] - Width of the object.
     * @param {number} [height=100] - Height of the object.
     */
    constructor(x = 0, y = 0, width = 100, height = 100) {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * Preloads all animation frames into the image cache.
     * @param {Record<string, string[]>} animations - Map of animation keys to frame paths.
     */
    preloadAnimations(animations) {
        Object.values(animations).forEach(frames => this.loadImages(frames));
    }

    /**
     * Plays an animation at a given frame rate.
     * Handles looping and optional callback once finished.
     * @param {string[]} images - Frame paths of the animation.
     * @param {number} [fps=10] - Frames per second.
     * @param {boolean} [loop=true] - Whether to loop the animation.
     * @param {Function|null} [cb=null] - Callback when non-looping animation ends.
     */
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

    /**
     * Updates the animation frame based on elapsed time.
     * @param {string[]} images - Frames of the animation.
     * @param {number} fps - Frames per second.
     * @returns {boolean} True if a new frame should be rendered.
     */
    updateAnimationFrame(images, fps) {
        const now = performance.now();
        const frameDur = 1000 / fps;

        this.startNewAnimation(images, now);

        if (!this.lastFrameTime) this.lastFrameTime = now;
        if (now - this.lastFrameTime < frameDur) return false;

        this.lastFrameTime = now;
        return true;
    }

    /**
     * Starts a new animation sequence if it differs from the current one.
     * @param {string[]} images - New animation frames.
     * @param {number} now - Current timestamp.
     */
    startNewAnimation(images, now) {
        if (this.currentAnimation === images) return;
        this.currentAnimation = images;
        this.currentImage = 0;
        this.lastFrameTime = now;
    }

    /**
     * Checks whether the current frame is the last one.
     * @param {string[]} images - Animation frames.
     * @returns {boolean} True if current frame is the last.
     */
    isLastFrame(images) {
        return this.currentImage >= images.length - 1;
    }

    /**
     * Applies the current frame image from the cache.
     * @param {string[]} images - Animation frames.
     */
    applyFrame(images) {
        this.img = this.imageCache[images[this.currentImage]];
    }

    /**
     * Returns the bottom Y position used for ground checks.
     * @returns {number}
     */
    get bottom() {
        return this.y + this.height - this.feetOffset;
    }

    /**
     * Configures the hitbox offsets and optional custom size.
     * @param {number} [offsetX=0]
     * @param {number} [offsetY=0]
     * @param {number|null} [width=null]
     * @param {number|null} [height=null]
     */
    setHitbox(offsetX = 0, offsetY = 0, width = null, height = null) {
        this.hitbox.offsetX = offsetX;
        this.hitbox.offsetY = offsetY;
        this.hitbox.width = width;
        this.hitbox.height = height;
    }

    /**
     * Returns the current world-space hitbox.
     * @returns {{x:number,y:number,width:number,height:number}}
     */
    getHitbox() {
        return {
            x: this.x + this.hitbox.offsetX,
            y: this.y + this.hitbox.offsetY,
            width: this.hitbox.width ?? this.width,
            height: this.hitbox.height ?? this.height,
        };
    }

    /**
     * Snaps the object directly onto the ground level.
     */
    snapToGround() {
        this.y = this.groundY - this.height + this.feetOffset;
    }

    /**
     * Applies gravity to vertical speed and position.
     * Handles ground collision and grounded state.
     */
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

    /**
     * Moves the object horizontally by the given delta.
     * @param {number} dx - Horizontal delta.
     */
    moveHorizontal(dx) {
        this.x += dx;
    }

    /**
     * Moves the object to the right.
     * @param {number} [speed=this.speed] - Optional custom speed.
     */
    moveRight(speed = this.speed) {
        this.moveHorizontal(speed);
    }

    /**
     * Moves the object to the left.
     * @param {number} [speed=this.speed] - Optional custom speed.
     */
    moveLeft(speed = this.speed) {
        this.moveHorizontal(-speed);
    }

    /**
     * Marks the object as dead and resets animation state.
     */
    die() {
        this.isDead = true;
        this.currentImage = 0;
        this.lastFrameTime = 0;
        this.currentAnimation = null;
    }

    /**
     * Applies damage to the object and triggers hurt state.
     * Kills the object if health reaches zero.
     * @param {number} [amount=1] - Damage to apply.
     */
    takeDamage(amount = 1) {
        if (this.isDead) return;

        this.health = Math.max(0, this.health - amount);
        this.isHurt = true;
        this.hurtUntil = performance.now() + 300;

        if (this.health === 0) this.die();
    }
}
