/**
 * Base class for all collectible items in the world.
 * Provides shared collision behavior, hitbox setup, and collection logic.
 *
 * @class
 * @extends MovableObject
 */
class Collectable extends MovableObject {
    /**
     * Collision category for collision filtering.
     * @type {string}
     */
    collisionCategory = "collectable";

    /**
     * Whether this object has been collected.
     * @type {boolean}
     */
    isCollected = false;

    /**
     * Creates a new collectable instance.
     *
     * @param {number} x - World x position in pixels.
     * @param {number} y - World y position in pixels.
     * @param {number} [width=40] - Width of the collectible sprite.
     * @param {number} [height=40] - Height of the collectible sprite.
     */
    constructor(x, y, width = 40, height = 40) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.setHitbox(0, 0, this.width, this.height);
    }

    /**
     * Updates the collectible each frame.
     * Currently unused — safe to remove unless subclasses rely on overriding.
     *
     * @returns {void}
     */
    update() {
    }

    /**
     * Marks this collectible as collected.
     * Subclasses should call `super.onCollect(world)` when extending.
     *
     * @param {World} world - The current world instance.
     * @returns {void}
     */
    onCollect(world) {
        this.isCollected = true;
    }
}
