/**
 * Configuration for background objects such as parallax layers.
 */
const BACKGROUND_CONFIG = {
    width: 720,
    height: 480
};

/**
 * Represents a static or scrolling background element.
 *
 * @class
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
    /**
     * Initial horizontal position of the background element.
     * @type {number}
     */
    x = 0;

    /**
     * Initial vertical position of the background element.
     * @type {number}
     */
    y = 0;

    /**
     * Width of the background element in pixels.
     * @type {number}
     */
    width = BACKGROUND_CONFIG.width;

    /**
     * Height of the background element in pixels.
     * @type {number}
     */
    height = BACKGROUND_CONFIG.height;

    /**
     * Creates a new background object at the given world position.
     *
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - World x position in pixels.
     * @param {number} y - World y position in pixels.
     */
    constructor(imagePath, x, y) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = y;
    }
}
