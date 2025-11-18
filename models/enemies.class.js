class Chicken extends MovableObject {

    CHICKEN_NORMAL_WALK = [
        "assets/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "assets/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "assets/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
    ];

    constructor() {
        super();

        this.speed = 0.2 + Math.random() * 0.4;

        this.x = 200 + Math.random() * 500;

        this.loadImages(this.CHICKEN_NORMAL_WALK);
        this.loadImage(this.CHICKEN_NORMAL_WALK[0]);

        this.animate(this.CHICKEN_NORMAL_WALK, 6);

        this.moveLeft(this.speed);
    }
}