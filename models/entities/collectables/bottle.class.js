/**
 * Represents a collectible bottle that the player can pick up.
 * @class
 * @extends Collectable
 */
class Bottle extends Collectable {
    /**
     * Collision category used by the collision system.
     * @type {string}
     */
    collisionCategory = "collectable";

    /**
     * Creates a new bottle instance at the given world position.
     *
     * @param {number} x - World x position in pixels.
     * @param {number} y - World y position in pixels.
     */
    constructor(x, y) {
        super(x, y, 60, 60);

        this.animations = ASSETS.bottle;
        this.snapToGround();

        this.loadImage(this.animations.on_ground[Math.floor(Math.random() * 2)]);

        this.value = 1;
        this.setHitbox(20, 10, 30, 40);
    }

    /**
     * Updates the bottle each frame.
     * Currently unused – consider removing if no per-frame logic is needed.
     *
     * @returns {void}
     */
    update() {
    }

    /**
     * Handles logic when the bottle is collected by the player.
     *
     * @param {World} world - The current game world instance.
     * @returns {void}
     */
    onCollect(world) {
        world.bottles += this.value;
        super.onCollect(world);
        soundManager.play("player_collect_bottle", true);
    }
}
