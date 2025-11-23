class Bottle extends MovableObject {
    constructor(x, y) {
        super();

        this.animations = ASSETS.bottle; 
        this.x = x;
        this.snapToGround() ;

        this.loadImage(this.animations.on_ground[0]); 
    }

    update() {
     
    }
}