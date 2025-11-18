class Character extends MovableObject {
    x = 50;
    y = 50;
    height = 400;
    width = 180;

    constructor() {
        super();
        this.loadImage("assets/2_character_pepe/1_idle/idle/I-1.png");

        this.animate("assets/2_character_pepe/1_idle/idle/I-", 1, 10,4);
    }

    jump() {

    }
}