class Character extends MovableObject {
    x = 50;
    y = 0;
    height = 250;
    width = 112;
    speed = 3;

    isMoving = false;
    lastActionTime = Date.now();

    constructor() {
        super();

        this.animations = ASSETS.character;
        this.preloadAnimations(this.animations);
        this.loadImage(this.animations.idle[0]);
    }

    checkMovement() {
        if (keyboard.RIGHT) {
            this.moveRight(this.speed)
            this.otherDirection = false;
            this.isMoving = true;
            this.resetIdleTimer();
            return;
        }

        if (keyboard.LEFT) {
            this.moveLeft(this.speed)
            this.otherDirection = true;
            this.isMoving = true;
            this.resetIdleTimer();
            return;
        }

        this.isMoving = false;
    }

    handleJumpInput() {
        if (keyboard.SPACE) {
            this.jump();
        }
    }

    jump() {
        if (!this.isGrounded) return;
        this.speedY = -8;
        this.isGrounded = false;
        this.resetIdleTimer();
    }

    resetIdleTimer() {
        this.lastActionTime = Date.now();
    }

    idleTooLong() {
        return Date.now() - this.lastActionTime > 4000;
    }

    updateAnimation() {
        if (!this.isGrounded && this.animations.jump) {
            this.updateJumpFrame();
            return;
        }

        if (this.isMoving && this.animations.walk) {
            this.playAnimation(this.animations.walk, 12);
            return;
        }

        if (this.idleTooLong() && this.animations.long_idle) {
            this.playAnimation(this.animations.long_idle, 8);
            return;
        }

        this.playAnimation(this.animations.idle, 8);
    }

    update() {
        this.checkMovement();
        this.handleJumpInput();
        this.wasGrounded = this.isGrounded;
        this.applyGravity();
        this.updateAnimation();
    }


    updateJumpFrame() {
        const frames = this.animations.jump;
        const v = this.speedY;
        const d = this.distanceToGround;
        const margin = 10;
        let idx;


        if (d > 0 && d <= margin && v > 0 && frames.length >= 9) {

            if (d > margin * (2 / 3)) {
                idx = 6;
            } else if (d > margin * (1 / 3)) {
                idx = 7
            } else {
                idx = 8
            }

            this.img = this.imageCache[frames[idx]];
            return;
        }




        if (v < -15) {
            idx = 0;
        } else if (v < -12) {
            idx = 1;
        } else if (v < -10) {
            idx = 2;
        } else if (v < 0) {
            idx = 3;
        } else if (v < 4) {
            idx = 4;
        } else {
            idx = 5;
        }

        const path = frames[idx];
        this.img = this.imageCache[path];
    }
}
