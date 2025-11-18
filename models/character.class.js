class Character extends MovableObject {
    x = 50;
    y = 50;
    height = 400;
    width = 180;

    CHARAKTER_IDLE = [
        "assets/2_character_pepe/1_idle/idle/I-1.png",
        "assets/2_character_pepe/1_idle/idle/I-2.png",
        "assets/2_character_pepe/1_idle/idle/I-3.png",
        "assets/2_character_pepe/1_idle/idle/I-4.png",
        "assets/2_character_pepe/1_idle/idle/I-5.png",
        "assets/2_character_pepe/1_idle/idle/I-6.png",
        "assets/2_character_pepe/1_idle/idle/I-7.png",
        "assets/2_character_pepe/1_idle/idle/I-8.png",
        "assets/2_character_pepe/1_idle/idle/I-9.png",
        "assets/2_character_pepe/1_idle/idle/I-10.png"
    ];

    constructor() {
        super();
        
        this.loadImages(this.CHARAKTER_IDLE);
        this.loadImage(this.CHARAKTER_IDLE[0]);
        
        this.animate(this.CHARAKTER_IDLE, 4);
    }

    jump() {}
}
