/**
 * Represents a collectible coin that floats and animates.
 * @class
 * @extends Collectable
 */
class Coin extends Collectable {
    /**
     * Creates a new coin at the given world position.
     *
     * @param {number} x - World x position in pixels.
     * @param {number} y - World y position in pixels.
     */
    constructor(x, y) {
        super(x, y, 100, 100);

        this.animations = ASSETS.coin;

        this.loadImages(this.animations);
        this.loadImage(this.animations[0]);

        this.baseY = y;
        this.bobAmplitude = 5;
        this.bobSpeed = 0.003;

        this.value = 1;

        this.setHitbox(35, 35, 30, 30);
    }

    /**
     * Updates the coin bobbing animation and sprite animation.
     *
     * @returns {void}
     */
    update() {
        const t = performance.now();
        this.y = this.baseY + Math.sin(t * this.bobSpeed) * this.bobAmplitude;
        this.playAnimation(this.animations, 2);
    }

    /**
     * Handles logic when the coin is collected by the player.
     *
     * @param {World} world - The current game world instance.
     * @returns {void}
     */
    onCollect(world) {
        world.coins += this.value;
        super.onCollect(world);
        soundManager.play("player_collect_coin", true);
    }
}
