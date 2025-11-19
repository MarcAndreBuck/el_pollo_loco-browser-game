class World {
    character;

    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    worldWidth = 0;

    constructor(canvas, keyboard, level) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.character = new Character();
        this.level = level;

        this.worldWidth = this.calculateWorldWidth(); 

        this.gameLoop();
    }

    get enemies() {
        return this.level.enemies;
    }

    get clouds() {
        return this.level.clouds;
    }

    get backgroundObjects() {
        return this.level.backgroundObjects;
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        this.character.update();
        this.keepCharacterInBounds();
        this.updateCamera();

        this.enemies.forEach(e => e.update && e.update());
        this.clouds.forEach(c => c.update && c.update());
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addObjectToMap(this.backgroundObjects);
        this.addObjectToMap(this.enemies);
        this.addObjectToMap(this.clouds);
        this.addToMap(this.character);
    }

    addObjectToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    addToMap(mo) {
        if (!mo.img) return;

        const drawX = mo.x - this.camera_x;

        this.ctx.save();

        if (mo.otherDirection) {
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(
                mo.img,
                -drawX - mo.width,
                mo.y,
                mo.width,
                mo.height
            );
        } else {
            this.ctx.drawImage(
                mo.img,
                drawX,
                mo.y,
                mo.width,
                mo.height
            );
        }

        this.ctx.restore();
    }

    keepCharacterInBounds() {
        const rightBoundary = this.worldWidth - this.character.width;

        if (this.character.x < 0) {
            this.character.x = 0;
        }

        if (this.character.x > rightBoundary) {
            this.character.x = rightBoundary;
        }
    }

    updateCamera() {
        const screenOffsetX = (this.canvas.width - this.character.width) / 2;

        this.camera_x = this.character.x - screenOffsetX;

        if (this.camera_x < 0) {
            this.camera_x = 0;
        }

        const maxCameraX = this.worldWidth - this.canvas.width;
        if (this.camera_x > maxCameraX) {
            this.camera_x = maxCameraX;
        }
    }

    calculateWorldWidth() {
        let max = 0;

        this.level.backgroundObjects.forEach(bg => {
            const end = bg.x + bg.width;
            if (end > max) {
                max = end;
            }
        });

        return max;
    }
}
