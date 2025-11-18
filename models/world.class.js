class World {

    character = new Character();
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken(),
    ]
    background = [
        new BackgroundObject("assets/5_background/layers/air.png", 0, 0),
        new BackgroundObject("assets/5_background/layers/3_third_layer/1.png", 0, 0),
        new BackgroundObject("assets/5_background/layers/2_second_layer/1.png", 0, 0),
        new BackgroundObject("assets/5_background/layers/1_first_layer/1.png", 0, 0)
    ]
    cloud = [
        new Cloud(),
    ]

    
    ctx;
    canvas;

    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.draw();
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addObjectToMap(this.background);
        this.addObjectToMap(this.enemies);
        this.addObjectToMap(this.cloud)
        this.addToMap(this.character);


        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectToMap(object) {
        object.forEach(o => this.addToMap(o))
    }

    addToMap(mo) {
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height)
    }
}