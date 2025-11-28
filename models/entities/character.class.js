class Character extends MovableObject {
    collisionCategory = "player";

    isMoving = false;
    lastActionTime = Date.now();
    deathFinished = false;

    constructor(x = 50, y = 0, width = 112, height = 250) {
        super(x, y, width, height);

        this.speed = 3;
        this.health = 100;

        this.animations = ASSETS.character;
        this.preloadAnimations(this.animations);
        this.loadImage(this.animations.idle[0]);

        this.setHitbox(20, 120, 60, 120);
        this.snapToGround();
    }

    /* ---------- Input / Movement ---------- */

    checkMovement() {
        this.isMoving = false;

        if (this.handleHorizontalMovement()) return;
        if (this.handleThrowInput()) return;
    }

    handleHorizontalMovement() {
        if (keyboard.RIGHT) {
            this.moveRight(this.speed);
            this.otherDirection = false;
            this.resetIdleTimer();
            return true;
        }

        if (keyboard.LEFT) {
            this.moveLeft(this.speed);
            this.otherDirection = true;
            this.resetIdleTimer();
            return true;
        }

        return false;
    }

    handleThrowInput() {
        if (!keyboard.THROW) return false;

        this.resetIdleTimer();
        return true;
    }


    handleJumpInput() {
        if (keyboard.SPACE) this.jump();
    }

    jump() {
        if (!this.isGrounded) return;
        this.speedY = -8;
        this.isGrounded = false;
        this.resetIdleTimer();
    }

    /* ---------- Idle / Timer ---------- */

    resetIdleTimer() {
        this.lastActionTime = Date.now();
        this.isMoving = true;
    }

    idleTooLong() {
        return Date.now() - this.lastActionTime > 4000;
    }

    isHurtActive() {
        return this.isHurt && performance.now() <= this.hurtUntil;
    }

    /* ---------- Animation ---------- */

    updateAnimation() {
        if (this.handleDeathAnimation()) return;
        if (this.handleHurtAnimation()) return;
        if (this.handleAirAnimation()) return;
        if (this.handleWalkAnimation()) return;
        if (this.handleLongIdleAnimation()) return;

        this.playAnimation(this.animations.idle, 8);
    }

    handleDeathAnimation() {
        if (!this.isDead) return false;
        this.playAnimation(this.animations.dead, 8, false, () => {
            this.deathFinished = true;
        });
        return true;
    }

    handleHurtAnimation() {
        if (!this.isHurtActive()) return false;
        this.playAnimation(this.animations.hurt, 10);
        return true;
    }

    handleAirAnimation() {
        if (this.isGrounded) return false;
        this.updateJumpFrame();
        return true;
    }

    handleWalkAnimation() {
        if (!this.isMoving) return false;
        this.playAnimation(this.animations.walk, 12);
        return true;
    }

    handleLongIdleAnimation() {
        if (!this.idleTooLong()) return false;
        this.playAnimation(this.animations.long_idle, 8);
        return true;
    }


    update() {
        if (this.isDead) {
            this.applyGravity();
            this.updateAnimation();
            return;
        }

        this.checkMovement();
        this.handleJumpInput();
        this.wasGrounded = this.isGrounded;
        this.applyGravity();
        this.updateAnimation();
    }

    /* ---------- Jump-Frames ---------- */

    updateJumpFrame() {
        const frames = this.animations.jump;

        const d = this.distanceToGround;
        const v = this.speedY;
        const margin = 10;

        let idx = this.getLandingFrameIndex(d, v, margin, frames.length);
        if (idx === null) {
            idx = this.getAirFrameIndex(v);
        }

        this.img = this.imageCache[frames[idx]];
    }

    getLandingFrameIndex(d, v, margin, frameCount) {
        const isNearGround = d > 0 && d <= margin;
        const isFallingDown = v > 0;

        if (!isNearGround || !isFallingDown || frameCount < 9) return null;

        if (d > margin * (2 / 3)) return 6;
        if (d > margin * (1 / 3)) return 7;
        return 8;
    }

    getAirFrameIndex(v) {
        if (v < -15) return 0;
        if (v < -12) return 1;
        if (v < -10) return 2;
        if (v < 0) return 3;
        if (v < 2) return 4;
        return 5;
    }
}
