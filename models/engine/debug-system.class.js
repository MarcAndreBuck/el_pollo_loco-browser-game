/**
 * Default visibility flags for hitbox categories.
 */
const DEFAULT_HITBOX_VISIBILITY = {
    player: true,
    enemy: true,
    boss: true,
    collectable: true,
    projectile: true,
    other: false,
};

/**
 * Default colors used for hitbox rendering by category.
 */
const DEFAULT_HITBOX_COLORS = {
    player: "#2196f3",
    enemy: "#f44336",
    boss: "#9c27b0",
    collectable: "#4caf50",
    projectile: "#ff3b3bff",
    other: "#ff9800",
};

/**
 * Debug system for visualizing hitboxes and collisions.
 * Can be toggled on/off and configured per category.
 */
class DebugSystem {
    /**
     * @param {World} world - Active game world instance.
     */
    constructor(world) {
        this.world = world;
        this.hitboxEnabled = false;
        this.hitboxConfig = this.createDefaultHitboxConfig();
    }

    /**
     * Creates the default hitbox configuration.
     * @returns {{visibility: Object, colors: Object, lineWidth: number}}
     */
    createDefaultHitboxConfig() {
        return {
            visibility: { ...DEFAULT_HITBOX_VISIBILITY },
            colors: { ...DEFAULT_HITBOX_COLORS },
            lineWidth: 2,
        };
    }

    /**
     * Returns the collision category of a game object.
     * @param {Object} gameObject
     * @returns {string} Category key, e.g. "player" or "enemy".
     */
    getCategory(gameObject) {
        return gameObject.collisionCategory || "other";
    }

    /**
     * Checks whether hitboxes should be visible for a given object.
     * @param {Object} gameObject
     * @returns {boolean} True if hitboxes are enabled for this category.
     */
    isHitboxVisibleFor(gameObject) {
        const cat = this.getCategory(gameObject);
        return !!this.hitboxConfig.visibility[cat];
    }

    /**
     * Returns the stroke color configured for a given game object.
     * @param {Object} gameObject
     * @returns {string} CSS color string.
     */
    getHitboxColorFor(gameObject) {
        const cat = this.getCategory(gameObject);
        const colors = this.hitboxConfig.colors;
        return colors[cat] || colors.other;
    }

    /**
     * Draws a hitbox for the given object if enabled and supported.
     * @param {Object} gameObject
     */
    drawHitbox(gameObject) {
        if (!this.shouldDrawHitbox(gameObject)) return;

        const { ctx, camera } = this.world;
        const hitbox = gameObject.getHitbox();
        const drawX = hitbox.x - camera.x;
        const color = this.getHitboxColorFor(gameObject);

        this.strokeHitboxRect(ctx, drawX, hitbox, color);
    }

    /**
     * Checks whether a hitbox can and should be rendered.
     * @param {Object} gameObject
     * @returns {boolean} True if drawing is allowed.
     */
    shouldDrawHitbox(gameObject) {
        if (!gameObject.getHitbox) return false;
        return this.isHitboxVisibleFor(gameObject);
    }

    /**
     * Draws a stroked rectangle representing a hitbox.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x - X position adjusted for camera.
     * @param {{x:number,y:number,width:number,height:number}} hitbox
     * @param {string} color - Stroke color.
     */
    strokeHitboxRect(ctx, x, hitbox, color) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, hitbox.y, hitbox.width, hitbox.height);
        ctx.lineWidth = this.hitboxConfig.lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.restore();
    }

    /**
     * Draws all enabled hitboxes for the current world state.
     */
    drawHitboxes() {
        if (!this.hitboxEnabled) return;

        const { character, enemies, collectables, projectiles } = this.world;
        const objects = [character, ...enemies, ...collectables, ...projectiles];

        objects.forEach(obj => this.drawHitbox(obj));
    }
}
