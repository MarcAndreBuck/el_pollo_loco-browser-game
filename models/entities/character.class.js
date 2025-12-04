/**
 * Configuration for player character stats, dimensions and behavior.
 */
const CHARACTER_CONFIG = {
    startX: 50,
    startY: 0,
    width: 112,
    height: 250,
    speed: 3,
    health: 100,
    hitbox: { x: 20, y: 120, width: 60, height: 120 },
    jumpSpeed: -8,
    idleTimeoutMs: 4000
};

/**
 * Main player character, handling movement, input, animations and state.
 *
 * @class
 * @extends MovableObject
 */
class Character extends MovableObject {
    /**
     * Collision category used by the collision system.
     * @type {string}
     */
    collisionCategory = "player";

    /**
     * Whether the character is currently moving horizontally.
     * @type {boolean}
     */
    isMoving = false;

    /**
     * Timestamp of the last player action in milliseconds.
     * Used to detect long idle periods.
     * @type {number}
     */
    lastActionTime = Date.now();

    /**
     * Indicates whether the death animation has fully finished.
     * @type {boolean}
     */
    deathFinished = false;

    /**
     * Indicates whether the snore sound is currently active.
     * @type {boolean}
     */
    playerSnorr = false;

    /**
     * Creates a new character instance.
     *
     * @param {number} [x=CHARACTER_CONFIG.startX] - Initial world x position.
     * @param {number} [y=CHARACTER_CONFIG.startY] - Initial world y position.
     * @param {number} [width=CHARACTER_CONFIG.width] - Character sprite width.
     * @param {number} [height=CHARACTER_CONFIG.height] - Character sprite height.
     */
    constructor(
        x = CHARACTER_CONFIG.startX,
        y = CHARACTER_CONFIG.startY,
        width = CHARACTER_CONFIG.width,
        height = CHARACTER_CONFIG.height
    ) {
        super(x, y, width, height);

        this.speed = CHARACTER_CONFIG.speed;
        this.health = CHARACTER_CONFIG.health;

        this.animations = ASSETS.character;
        this.preloadAnimations(this.animations);
        this.loadImage(this.animations.idle[0]);

        const h = CHARACTER_CONFIG.hitbox;
        this.setHitbox(h.x, h.y, h.width, h.height);
        this.snapToGround();
    }

    /**
     * Checks input and updates movement flags.
     *
     * @returns {void}
     */
    checkMovement() {
        this.isMoving = false;
        if (this.handleHorizontalMovement()) return;
        if (this.handleThrowInput()) return;
    }

    /**
     * Handles left/right movement based on keyboard input.
     *
     * @private
     * @returns {boolean} True if any horizontal movement was handled.
     */
    handleHorizontalMovement() {
        if (keyboard.RIGHT) {
            this.characterMoveRight();
        }
        if (keyboard.LEFT) {
            this.characterMoveLeft();
        }
        return false;
    }

    /**
     * Moves the character to the right and updates facing and idle timer.
     *
     * @private
     * @returns {boolean} Always true once called.
     */
    characterMoveRight() {
        this.moveRight(this.speed);
        this.otherDirection = false;
        this.resetIdleTimer();
        this.isMoving = true;
        return true;
    }

    /**
     * Moves the character to the left and updates facing and idle timer.
     *
     * @private
     * @returns {boolean} Always true once called.
     */
    characterMoveLeft() {
        this.moveLeft(this.speed);
        this.otherDirection = true;
        this.resetIdleTimer();
        this.isMoving = true;
        return true;
    }

    /**
     * Handles throw input and resets idle timer when triggering a throw.
     *
     * @private
     * @returns {boolean} True if throw input was detected.
     */
    handleThrowInput() {
        if (!keyboard.THROW) return false;
        this.resetIdleTimer();
        return true;
    }

    /**
     * Handles jump input and triggers jump if allowed.
     *
     * @private
     * @returns {void}
     */
    handleJumpInput() {
        if (keyboard.SPACE) this.jump();
    }

    /**
     * Performs a jump if the character is grounded.
     *
     * @returns {void}
     */
    jump() {
        if (!this.isGrounded) return;
        this.speedY = CHARACTER_CONFIG.jumpSpeed;
        this.isGrounded = false;
        this.resetIdleTimer();
        soundManager.play("player_jump");
    }

    /**
     * Resets the idle timer to the current timestamp.
     *
     * @returns {void}
     */
    resetIdleTimer() {
        this.lastActionTime = Date.now();
    }

    /**
     * Checks whether the character has been idle for too long.
     *
     * @returns {boolean} True if the idle timeout has been exceeded.
     */
    idleTooLong() {
        return Date.now() - this.lastActionTime > CHARACTER_CONFIG.idleTimeoutMs;
    }

    /**
     * Checks whether the hurt state is still active.
     *
     * @returns {boolean} True if the character is currently hurt.
     */
    isHurtActive() {
        return this.isHurt && performance.now() <= this.hurtUntil;
    }

    /**
     * Updates the character animation according to the current state.
     *
     * @returns {void}
     */
    updateAnimation() {
        if (this.handleDeathAnimation()) return;
        if (this.handleHurtAnimation()) return;
        if (this.handleAirAnimation()) return;
        if (this.handleWalkAnimation()) return;
        if (this.handleLongIdleAnimation()) return;
        this.playAnimation(this.animations.idle, 8);
    }

    /**
     * Handles death animation and sets the `deathFinished` flag when done.
     *
     * @private
     * @returns {boolean} True if death animation is playing.
     */
    handleDeathAnimation() {
        if (!this.isDead) return false;
        this.playAnimation(this.animations.dead, 8, false, () => {
            this.deathFinished = true;
        });

        return true;
    }

    /**
     * Handles hurt animation while the hurt state is active.
     *
     * @private
     * @returns {boolean} True if hurt animation is playing.
     */
    handleHurtAnimation() {
        if (!this.isHurtActive()) return false;
        this.playAnimation(this.animations.hurt, 10);
        soundManager.play("player_hurt");
        return true;
    }

    /**
     * Handles jump / air animation when the character is not grounded.
     *
     * @private
     * @returns {boolean} True if air animation is active.
     */
    handleAirAnimation() {
        if (this.isGrounded) return false;
        this.updateJumpFrame();
        return true;
    }

    /**
     * Handles walking animation while moving.
     *
     * @private
     * @returns {boolean} True if walk animation is active.
     */
    handleWalkAnimation() {
        if (!this.isMoving) return false;
        this.playAnimation(this.animations.walk, 12);
        soundManager.play("player_step");
        return true;
    }

    /**
     * Handles long idle animation and snore sound after extended inactivity.
     *
     * @private
     * @returns {boolean} True if long idle animation is active.
     */
    handleLongIdleAnimation() {
        if (!this.idleTooLong() || !this.isGrounded) {
            this.stopSnoreIfNeeded();
            return false;
        }
        this.playAnimation(this.animations.long_idle, 8);
        this.startSnoreIfNeeded();
        return true;
    }

    /**
     * Starts the snore sound if it is not already playing.
     *
     * @private
     * @returns {void}
     */
    startSnoreIfNeeded() {
        if (this.playerSnorr) return;
        soundManager.play("player_snore");
        this.playerSnorr = true;
    }

    /**
     * Stops the snore sound if it is currently active.
     *
     * @private
     * @returns {void}
     */
    stopSnoreIfNeeded() {
        if (!this.playerSnorr) return;
        soundManager.stop("player_snore");
        this.playerSnorr = false;
    }

    /**
     * Updates the character state depending on whether it is alive or dead.
     *
     * @returns {void}
     */
    update() {
        if (this.isDead) {
            this.updateDead();
            return;
        }
        this.updateAlive();
    }

    /**
     * Updates physics and animation while the character is dead.
     *
     * @private
     * @returns {void}
     */
    updateDead() {
        this.applyGravity();
        this.updateAnimation();
    }

    /**
     * Updates input, physics and animation while the character is alive.
     *
     * @private
     * @returns {void}
     */
    updateAlive() {
        this.checkMovement();
        this.handleJumpInput();
        this.wasGrounded = this.isGrounded;
        this.applyGravity();
        this.updateAnimation();
    }

    /**
     * Chooses the correct jump frame based on vertical speed and distance to ground.
     *
     * @private
     * @returns {void}
     */
    updateJumpFrame() {
        const frames = this.animations.jump;
        const distance = this.distanceToGround;
        const velocity = this.speedY;
        const margin = 10;
        let index = this.getLandingFrameIndex(distance, velocity, margin, frames.length);
        if (index === null) {
            index = this.getAirFrameIndex(velocity);
        }
        this.img = this.imageCache[frames[index]];
    }

    /**
     * Calculates landing frame index when close to the ground and falling.
     *
     * @private
     * @param {number} distance - Distance to ground.
     * @param {number} velocity - Current vertical speed.
     * @param {number} margin - Distance threshold treated as "near ground".
     * @param {number} frameCount - Total available jump frames.
     * @returns {number|null} Landing frame index or null if not applicable.
     */
    getLandingFrameIndex(distance, velocity, margin, frameCount) {
        const isNearGround = distance > 0 && distance <= margin;
        const isFallingDown = velocity > 0;
        if (!isNearGround || !isFallingDown || frameCount < 9) return null;
        if (distance > margin * (2 / 3)) return 6;
        if (distance > margin * (1 / 3)) return 7;
        return 8;
    }

    /**
     * Calculates jump frame index based on vertical velocity while in the air.
     *
     * @private
     * @param {number} velocity - Current vertical speed.
     * @returns {number} Index of the air frame to display.
     */
    getAirFrameIndex(velocity) {
        if (velocity < -15) return 0;
        if (velocity < -12) return 1;
        if (velocity < -10) return 2;
        if (velocity < 0) return 3;
        if (velocity < 2) return 4;
        return 5;
    }
}
