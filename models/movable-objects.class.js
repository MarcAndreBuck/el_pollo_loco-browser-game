class MovableObject {
    x = 120;
    y = 335;
    img;
    height = 100;
    width = 100;
    imageCache = {};
    currentImage = 0;
    animationFrame = 0;
    speed = 0.25;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    playAnimation(images, fps = 10) {
        const now = performance.now();
        const frameDuration = 1000 / fps;

        if (!this.lastFrameTime) {
            this.lastFrameTime = now;
        }

        if (now - this.lastFrameTime >= frameDuration) {
            this.currentImage = (this.currentImage + 1) % images.length;

            const path = images[this.currentImage];
            this.img = this.imageCache[path];

            this.lastFrameTime = now;
        }
    }

    preloadAnimations(animations) {
        Object.values(animations).forEach(frames => {
            this.loadImages(frames);
        });
    }
}
