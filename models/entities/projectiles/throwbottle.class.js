/**
 * Configuration for thrown bottle projectiles.
 */
const THROW_BOTTLE_CONFIG = {
    width: 60,
    height: 60,
    speedX: 6,
    speedY: -7,
    lifeDuration: 2000,
    hitbox: { x: 20, y: 20, width: 20, height: 20 },
    rotationFps: 36,
    splashFps: 12
};

/**
 * Represents a thrown bottle projectile with gravity, lifetime and breaking logic.
 *
 * @class
 * @extends MovableObject
 */
class ThrowBottle extends MovableObject {
    /**
     * Collision category for the collision system.
     * @type {string}
     */
    collisionCategory = "projectile";

    /**
     * Indicates whether this bottle has already hit something or finished breaking.
     * @type {boolean}
     */
    hasHit = false;

    /**
     * Creates a new thrown bottle instance.
     *
     * @param {number} x - Initial world x position in pixels.
     * @param {number} y - Initial world y position in pixels.
     * @param {number} [direction=1] - Horizontal direction multiplier (1 = right, -1 = left).
     */
    constructor(x, y, direction = 1) {
        super();
        this.setupBasics(x, y);
        this.setupPhysics(direction);
        this.setupLifetime();
        this.setupGraphics();
        this.setupHitbox();
    }

    /**
     * Sets basic spatial properties such as position and size.
     *
     * @param {number} x - Initial world x position in pixels.
     * @param {number} y - Initial world y position in pixels.
     * @returns {void}
     */
    setupBasics(x, y) {
        this.width = THROW_BOTTLE_CONFIG.width;
        this.height = THROW_BOTTLE_CONFIG.height;
        this.x = x;
        this.y = y;
        this.hasHit = false;
    }

    /**
     * Configures the initial physics state (velocity and gravity).
     *
     * @param {number} direction - Horizontal direction multiplier.
     * @returns {void}
     */
    setupPhysics(direction) {
        this.speedX = THROW_BOTTLE_CONFIG.speedX * direction;
        this.speedY = THROW_BOTTLE_CONFIG.speedY;
        this.hasGravity = true;
    }

    /**
     * Initializes lifetime tracking for auto-breaking.
     *
     * @returns {void}
     */
    setupLifetime() {
        this.spawnTime = performance.now();
        this.lifeDuration = THROW_BOTTLE_CONFIG.lifeDuration;
    }

    /**
     * Initializes sprite animations and visual state.
     *
     * @returns {void}
     */
    setupGraphics() {
        this.animations = ASSETS.bottle;
        this.preloadAnimations(this.animations);
        this.loadImage(this.animations.rotation[0]);
        this.isBreaking = false;
    }

    /**
     * Configures the collision hitbox for the projectile.
     *
     * @returns {void}
     */
    setupHitbox() {
        const h = THROW_BOTTLE_CONFIG.hitbox;
        this.setHitbox(h.x, h.y, h.width, h.height);
    }

    /**
     * Updates physics, breaking state, and animation each frame.
     *
     * @returns {void}
     */
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

    /**
     * Handles the breaking animation and marks the bottle as dead when finished.
     *
     * @returns {boolean} True if the bottle is currently in breaking state.
     */
    handleBreakingState() {
        if (!this.isBreaking) return false;

        this.playAnimation(this.animations.splash, THROW_BOTTLE_CONFIG.splashFps, false, () => {
            this.isDead = true;
        });

        return true;
    }

    /**
     * Checks whether the bottle has reached the end of its lifetime or hit the ground.
     *
     * @returns {boolean} True if the bottle should start breaking.
     */
    shouldBreak() {
        const age = performance.now() - this.spawnTime;
        const lifetimeOver = age >= this.lifeDuration;
        const hitGround = this.bottom >= this.groundY;
        return lifetimeOver || hitGround;
    }

    /**
     * Plays the rotation animation while the bottle is flying.
     *
     * @returns {void}
     */
    playRotation() {
        if (this.animations.rotation) {
            this.playAnimation(this.animations.rotation, THROW_BOTTLE_CONFIG.rotationFps);
        }
    }

    /**
     * Starts the breaking sequence, stops movement and plays the breaking sound.
     *
     * @returns {void}
     */
    break() {
        if (this.isBreaking) return;

        soundManager.play("bottle_break", true);

        this.isBreaking = true;
        this.speedX = 0;
        this.speedY = 0;
        this.hasGravity = false;
        this.hasHit = true;
    }
}
