class Coin extends MovableObject {

    height = 80;
    widht = 20;

    constructor(x, y) {
        super();

        this.animations = ASSETS.coin; 
        this.x = x;
        this.baseY = y;        
        this.y = y;

        this.bobAmplitude = 5; 
        this.bobSpeed = 0.003;  


        this.loadImages(this.animations);    
        this.loadImage(this.animations[0]);
    }

    update() {
        const t = performance.now();

        this.y = this.baseY + Math.sin(t * this.bobSpeed) * this.bobAmplitude;

        this.playAnimation(this.animations, 2);
    }
}