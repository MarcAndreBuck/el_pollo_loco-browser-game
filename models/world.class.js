class World {
    character;
    enemies;
    background;
    clouds;

    ctx;
    canvas;
    keyboard;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.character = new Character(); 
        this.enemies = [
            new Chicken(),
            new Chicken(),
            new Chicken(),
        ];
        this.background = [
            new BackgroundObject("assets/5_background/layers/air.png", 0, 0),
            new BackgroundObject("assets/5_background/layers/3_third_layer/1.png", 0, 0),
            new BackgroundObject("assets/5_background/layers/2_second_layer/1.png", 0, 0),
            new BackgroundObject("assets/5_background/layers/1_first_layer/1.png", 0, 0)
        ];
        this.clouds = [
            new Cloud(),
        ];

        this.gameLoop();
    }

    gameLoop() {
        this.update();
        this.draw();

        let self = this
        requestAnimationFrame(() => self.gameLoop());
    }

    update() {
        this.character.update();
        this.enemies.forEach(e => e.update && e.update());
        this.clouds.forEach(c => c.update && c.update());
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addObjectToMap(this.background);
        this.addObjectToMap(this.enemies);
        this.addObjectToMap(this.clouds);
        this.addToMap(this.character);
    }

    addObjectToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    addToMap(mo) {
        if (!mo.img) return;
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    }
}
