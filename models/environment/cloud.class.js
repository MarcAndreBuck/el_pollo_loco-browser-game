class Cloud extends MovableObject {
    constructor(x) {
        super();
        this.x = x;
        this.y = 0;
        this.height = 480;
        this.width = 720;
        this.speed = 0.1;
        const randomNumber = Math.random() < 0.5 ? 1 : 2;
        this.loadImage(`assets/5_background/layers/4_clouds/${randomNumber}.png`);
    }

    update() {
        this.moveLeft(this.speed)

        if (this.x + this.width < 0) {
            this.x = this.x + this.width + this.worldWidth;
        }
    }
}
