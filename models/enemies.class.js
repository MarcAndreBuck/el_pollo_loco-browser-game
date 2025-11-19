class Chicken extends MovableObject {

    CHICKEN_NORMAL_WALK = [
        "assets/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "assets/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "assets/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
    ];

    constructor() {
        super();

        this.animations = ASSETS.chicken_normal;

        this.speed = 0.2 + Math.random() * 0.4;

        this.x = 200 + Math.random() * 500;
        this.y = 350;

        this.preloadAnimations(this.animations);
        this.loadImage(this.animations.walk[0]);
    }

    update() {
        this.x -= this.speed;
        this.playAnimation(this.animations.walk, 8);
    }
}
