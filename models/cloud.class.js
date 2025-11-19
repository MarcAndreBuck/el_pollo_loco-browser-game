class Cloud extends MovableObject {
    constructor() {
        super();
        this.x = Math.random() * 720;
        this.y = 0;
        this.height = 480;
        this.width = 720;
        this.speed = 0.1; 

        this.loadImage("assets/5_background/layers/4_clouds/1.png");
    }

    update() {
        this.x -= this.speed;

        if (this.x + this.width < 0) {
            this.x = this.x + this.width + 720; 
        }
    }
}
