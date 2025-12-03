class Character extends MovableObject {
    collisionCategory = "player";

    isMoving = false;
    lastActionTime = Date.now();
    deathFinished = false;
    playerSnorr = false;

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
            characterMoveRight()
        }

        if (keyboard.LEFT) {
            characterMoveLeft()
        }

        return false;
    }

    characterMoveRight() {
        this.moveRight(this.speed);
        this.otherDirection = false;
        this.resetIdleTimer();
        this.isMoving = true;
        return true;
    }

    characterMoveLeft() {
        this.moveLeft(this.speed);
        this.otherDirection = true;
        this.resetIdleTimer();
        this.isMoving = true;
        return true;
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
        soundManager.play("player_jump");
    }

    /* ---------- Idle / Timer ---------- */

    resetIdleTimer() {
        this.lastActionTime = Date.now();
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
        soundManager.play("player_hurt");
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
        soundManager.play("player_step");
        return true;
    }

    handleLongIdleAnimation() {
        if (!this.idleTooLong() || !this.isGrounded) {
            this.stopSnoreIfNeeded();
            return false;
        }

        this.playAnimation(this.animations.long_idle, 8);
        this.startSnoreIfNeeded();
        return true;
    }

    startSnoreIfNeeded() {
        if (this.playerSnorr) return;
        soundManager.play("player_snore");
        this.playerSnorr = true;
    }

    stopSnoreIfNeeded() {
        if (!this.playerSnorr) return;
        soundManager.stop("player_snore");
        this.playerSnorr = false;
    }

    /* ---------- Update ---------- */

    update() {
        if (this.isDead) {
            this.updateDead();
            return;
        }
        this.updateAlive();
    }

    updateDead() {
        this.applyGravity();
        this.updateAnimation();
    }

    updateAlive() {
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
