class Character extends MovableObject {
    x = 50;
    y = 50;
    height = 400;
    width = 180;
    speed = 3;
    isMoving = false;
    isJumping = false;
    lastActionTime = Date.now();


    constructor() {
        super();

        this.animations = ASSETS.character;

        this.preloadAnimations(this.animations);

        this.loadImage(this.animations.idle[0]);
    }


    checkMovement() {
        if (keyboard.RIGHT) {
            this.x += this.speed;
            this.isMoving = true;
            this.resetIdleTimer();
            return;
        }

        if (keyboard.LEFT) {
            this.x -= this.speed;
            this.isMoving = true;
            this.resetIdleTimer();
            return;
        }

        this.isMoving = false;
    }

    resetIdleTimer() {
        this.lastActionTime = Date.now();
    }

    idleTooLong() {
        return Date.now() - this.lastActionTime > 4000;
    }



    updateAnimation() {
        if (this.isJumping && this.animations.jump) {
            this.playAnimation(this.animations.jump, 12);  
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
        this.updateAnimation();
    }

}