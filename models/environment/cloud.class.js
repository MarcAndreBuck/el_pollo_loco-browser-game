/**
 * Configuration for cloud background objects.
 */
const CLOUD_CONFIG = {
    width: 720,
    height: 480,
    speed: 0.1,
    assetPath: "assets/5_background/layers/4_clouds/"
};

/**
 * Represents a scrolling cloud in the background layer.
 *
 * @class
 * @extends MovableObject
 */
class Cloud extends MovableObject {
    /**
     * Creates a new cloud instance at the given x-position.
     *
     * @param {number} x - Initial world x position in pixels.
     */
    constructor(x) {
        super();

        this.x = x;
        this.y = 0;
        this.width = CLOUD_CONFIG.width;
        this.height = CLOUD_CONFIG.height;
        this.speed = CLOUD_CONFIG.speed;

        const randomNumber = Math.random() < 0.5 ? 1 : 2;
        this.loadImage(`${CLOUD_CONFIG.assetPath}${randomNumber}.png`);
    }

    /**
     * Updates movement for the cloud and resets position once it leaves the screen.
     *
     * @returns {void}
     */
    update() {
        this.moveLeft(this.speed);

        if (this.x + this.width < 0) {
            this.x = this.x + this.width + this.worldWidth;
        }
    }
}
