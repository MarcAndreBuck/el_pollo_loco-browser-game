class MovableObject {
    x = 120;
    y = 335;
    img;
    height = 100;
    width = 100;
    imageCache = {};
    currentImage = 0;
    speed = 0.25;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img
        });
    }

    moveLeft(speed = this.speed) {
        setInterval(() => {
            this.x -= speed;
        }, 1000 / 60);
    }

    moveRight() {
        console.log("move left");
    }


    animate(arr, fps = 12) {
        let i = 0;
        setInterval(() => {
            const path = arr[i];
            this.img = this.imageCache[path];
            i = (i + 1) % arr.length;
        }, 1000 / fps);
    }
}