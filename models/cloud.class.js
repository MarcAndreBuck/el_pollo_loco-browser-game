class Cloud extends MovableObject {
    x = 0;
    y = 0;
    height = 480;
    width = 720;

    constructor() {
        super().loadImage("assets/5_background/layers/4_clouds/1.png")
        this.x = Math.random() * 720;
        this.animate();
    }


    animate() {
        setInterval(() => {
            this.x -=  0.25;
        }, 1000 / 120)
    }
}