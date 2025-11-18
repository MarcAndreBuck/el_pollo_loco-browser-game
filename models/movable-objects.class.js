class MovableObject {
    x = 120;
    y = 335;
    img;
    height = 100;
    width = 100;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;

    }

    moveLeft() {
        console.log("move left");
    }

    moveRight() {
        console.log("move left");
    }

    animate(basePath, start, end, fps = 12) {
        let current = start;

        setInterval(() => {
            this.loadImage(`${basePath}${current}.png`);
            current = (current < end) ? current + 1 : start;
        }, 1000 / fps);
    }

}