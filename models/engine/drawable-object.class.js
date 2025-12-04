/**
 * Base class for all drawable objects on the canvas.
 * Provides image loading and cached image handling.
 */
class DrawableObject {
    /** @type {number} X position on canvas */ x = 0;
    /** @type {number} Y position on canvas */ y = 0;
    /** @type {HTMLImageElement|null} Current image */ img = null;
    /** @type {number} Width of object */ width = 100;
    /** @type {number} Height of object */ height = 100;
    /** @type {Record<string, HTMLImageElement>} Cached images */ imageCache = {};

    /**
     * Loads a single image and assigns it as the current sprite.
     * @param {string} path - Image file path.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Preloads multiple images into the image cache.
     * @param {string[]} arr - List of image paths.
     */
    loadImages(arr) {
        arr.forEach(path => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the current image at its position and size.
     * @param {CanvasRenderingContext2D} ctx - Rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}
