/**
 * Configuration for shared enemy properties.
 */
const ENEMY_CONFIG = {
    speedMin: 0.2,
    speedRandom: 0.4,
    health: 1,
    feetOffset: -10
};

/**
 * Base class for common enemy behavior such as movement, animation, and death.
 *
 * @class
 * @extends MovableObject
 */
class Enemies extends MovableObject {
    /**
     * Collision category for the collision system.
     * @type {string}
     */
    collisionCategory = "enemy";

    /**
     * Indicates whether the death sound was already played.
     * @type {boolean}
     */
    deathSoundPlayed = false;

    /**
     * Creates a new enemy instance.
     *
     * @param {number} x - World x position in pixels.
     * @param {number} y - World y position in pixels.
     * @param {number} width - Width of the enemy sprite.
     * @param {number} height - Height of the enemy sprite.
     * @param {{ walk: string[], dead: string[] }} animations - Animation asset set.
     */
    constructor(x, y, width, height, animations) {
        super(x, y, width, height);

        this.animations = animations;
        this.speed = ENEMY_CONFIG.speedMin + Math.random() * ENEMY_CONFIG.speedRandom;
        this.health = ENEMY_CONFIG.health;
        this.feetOffset = ENEMY_CONFIG.feetOffset;

        this.movingRight = false;
        this.otherDirection = true;

        this.preloadAnimations(this.animations);
        this.loadImage(this.animations.walk[0]);
    }

    /**
     * Updates physics, movement, and animation each frame.
     *
     * @returns {void}
     */
    update() {
        this.applyGravity();

        if (!this.isDead) {
            if (this.movingRight) {
                this.moveRight(this.speed);
                this.otherDirection = true;
            } else {
                this.moveLeft(this.speed);
                this.otherDirection = false;
            }
        }

        this.updateAnimation();
    }

    /**
     * Updates the current animation based on the enemy state.
     *
     * @returns {void}
     */
    updateAnimation() {
        if (this.isDead) {
            this.playAnimation(this.animations.dead, 8, false);
        } else {
            this.playAnimation(this.animations.walk, 8);
        }
    }

    /**
     * Handles enemy death logic and triggers the death sound.
     *
     * @returns {void}
     */
    die() {
        super.die();
        this.playDeathSound();
    }

    /**
     * Plays the death sound once.
     *
     * @returns {void}
     */
    playDeathSound() {
        if (this.deathSoundPlayed) return;
        this.deathSoundPlayed = true;
        soundManager.play("chicken_death", true);
    }
}

/**
 * Standard chicken enemy with default size and hitbox.
 *
 * @class
 * @extends Enemies
 */
class Chicken extends Enemies {
    /**
     * Creates a new chicken enemy.
     * If x is null or undefined, a random spawn position is used.
     *
     * @param {number|null|undefined} x - World x position or null/undefined for random.
     * @param {number} y - World y position in pixels.
     * @param {number} [width=90] - Width of the chicken sprite.
     * @param {number} [height=70] - Height of the chicken sprite.
     */
    constructor(x, y, width = 90, height = 70) {
        if (x == null) x = 400 + Math.random() * 2000;

        super(x, y, width, height, ASSETS.chicken_normal);

        this.setHitbox(10, 20, 80, 50);
    }
}

/**
 * Small chicken enemy variant with different size and hitbox.
 *
 * @class
 * @extends Enemies
 */
class SmallChicken extends Enemies {
    /**
     * Creates a new small chicken enemy.
     * If x is null or undefined, a random spawn position is used.
     *
     * @param {number|null|undefined} x - World x position or null/undefined for random.
     * @param {number} y - World y position in pixels.
     * @param {number} [width=60] - Width of the small chicken sprite.
     * @param {number} [height=45] - Height of the small chicken sprite.
     */
    constructor(x, y, width = 60, height = 45) {
        if (x == null) x = 200 + Math.random() * 2000;

        super(x, y, width, height, ASSETS.chicken_small);

        this.setHitbox(5, 5, 50, 40);
    }
}
