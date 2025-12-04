/**
 * Base status bar for displaying a value as segmented images (e.g. health, bottles, boss HP).
 *
 * @class
 * @extends DrawableObject
 */
class Statusbar extends DrawableObject {
    /**
     * Current percentage value (0–100).
     * @type {number}
     */
    percentage = 100;

    /**
     * @param {number} x - X position in world or HUD space.
     * @param {number} y - Y position in world or HUD space.
     * @param {string[]} animations - Array of image paths from empty to full.
     * @param {number} width - Width of the bar.
     * @param {number} height - Height of the bar.
     */
    constructor(x, y, animations, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.animations = animations;
        this.loadImages(this.animations);
        this.updateImage();
    }

    /**
     * Updates the status bar based on a current value and a max value.
     *
     * @param {number} value - Current absolute value.
     * @param {number} [maxValue=100] - Maximum value that maps to 100%.
     * @returns {void}
     */
    setStatusbarGrowth(value, maxValue = 100) {
        const ratio = Math.max(0, Math.min(value / maxValue, 1));
        this.percentage = ratio * 100;
        this.updateImage();
    }

    /**
     * Resolves the image index based on the current percentage.
     *
     * @returns {number} Index in the animations array.
     */
    resolveImageIndex() {
        if (this.percentage == 100) return 5;
        if (this.percentage >= 70) return 4;
        if (this.percentage >= 45) return 3;
        if (this.percentage >= 20) return 2;
        if (this.percentage >= 1) return 1;
        return 0;
    }

    /**
     * Updates the displayed image according to the current percentage.
     *
     * @returns {void}
     */
    updateImage() {
        const index = this.resolveImageIndex();
        const path = this.animations[index];
        this.img = this.imageCache[path];
    }
}

/**
 * Status bar that reflects the player's health.
 *
 * @class
 * @extends Statusbar
 */
class HealthBar extends Statusbar {
    /**
     * @param {number} x - X position in HUD space.
     * @param {number} y - Y position in HUD space.
     * @param {World} world - World instance to read character health from.
     */
    constructor(x, y, world) {
        super(x, y, ASSETS.statusbar.health.green, 200, 50);
        this.world = world;
    }

    /**
     * Updates the bar based on the current character health.
     *
     * @returns {void}
     */
    update() {
        const character = this.world.character;

        const currentHealth = character.health ?? 0;
        const maxHealth = character.maxHealth ?? 100;

        this.setStatusbarGrowth(currentHealth, maxHealth);
    }
}

/**
 * Status bar that reflects the number of collected bottles.
 *
 * @class
 * @extends Statusbar
 */
class BottleBar extends Statusbar {
    /**
     * @param {number} x - X position in HUD space.
     * @param {number} y - Y position in HUD space.
     * @param {World} world - World instance to read bottle count from.
     */
    constructor(x, y, world) {
        super(x, y, ASSETS.statusbar.bottle.blue, 200, 50);
        this.world = world;
    }

    /**
     * Updates the bar based on the current bottle count.
     *
     * @returns {void}
     */
    update() {
        const currentBottles = this.world.bottles ?? 0;
        const maxBottles = this.world.maxBottles || 1;
        this.setStatusbarGrowth(currentBottles, maxBottles);
    }
}

/**
 * Configuration for the coin counter UI element.
 */
const COIN_COUNTER_CONFIG = {
    width: 40,
    height: 40,
    font: "24px Arial",
    color: "#ffffff",
    offsetX: 40
};

/**
 * Displays the coin icon and numeric coin count in the HUD.
 *
 * @class
 * @extends DrawableObject
 */
class CoinCounter extends DrawableObject {
    /**
     * @param {number} positionX - X position in HUD space.
     * @param {number} positionY - Y position in HUD space.
     */
    constructor(positionX, positionY) {
        super();
        this.x = positionX;
        this.y = positionY;
        this.width = COIN_COUNTER_CONFIG.width;
        this.height = COIN_COUNTER_CONFIG.height;

        this.loadImage(ASSETS.statusbar.coin.icon[0]);
    }

    /**
     * Draws the coin icon and current coin count.
     *
     * @param {CanvasRenderingContext2D} ctx - Rendering context.
     * @param {World} world - World instance to read coin count from.
     * @returns {void}
     */
    draw(ctx, world) {
        const coins = world.coins ?? 0;

        if (this.img) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }

        ctx.save();
        ctx.fillStyle = COIN_COUNTER_CONFIG.color;
        ctx.font = COIN_COUNTER_CONFIG.font;
        ctx.textBaseline = "middle";
        ctx.fillText(`x ${coins}`, this.x + COIN_COUNTER_CONFIG.offsetX, this.y + this.height / 2);
        ctx.restore();
    }
}

/**
 * Status bar that reflects the boss health and is anchored to the HUD.
 *
 * @class
 * @extends Statusbar
 */
class ChickenBossHealth extends Statusbar {
    /**
     * @param {World} world - World instance to read boss health and screen size from.
     */
    constructor(world) {
        const width = 200;
        const height = 50;
        const margin = 60;
        const baseWidth = world.screenManager.baseWidth;
        const x = baseWidth - width - margin;
        const y = margin;

        super(x, y, ASSETS.statusbar.endboss.orange, width, height);
        this.world = world;
    }

    /**
     * Updates the bar based on the endboss health.
     *
     * @returns {void}
     */
    update() {
        const boss = this.world.endboss;

        const currentHealth = boss.health ?? 0;
        const maxHealth = boss.maxHealth ?? 100;

        this.setStatusbarGrowth(currentHealth, maxHealth);
    }
}
