/**
 * Configuration for the throw system timing and spawn offsets.
 */
const THROW_SYSTEM_CONFIG = {
    cooldownMs: 530,
    spawnOffsetFactorX: 0.6,
    spawnOffsetLeftX: -10,
    spawnOffsetFactorY: 0.5
};

/**
 * Manages bottle throwing input, cooldowns and projectile updates.
 *
 * @class
 */
class ThrowEngine {
    /**
     * Creates a new throw system instance for the given world.
     *
     * @param {World} world - The current world instance.
     */
    constructor(world) {
        this.world = world;
        this.lastThrowTime = 0;
    }

    /**
     * Updates throw handling and all active projectiles.
     *
     * @returns {void}
     */
    update() {
        this.handleThrow();
        this.updateProjectiles();
    }

    /**
     * Handles input, cooldown and bottle consumption for throwing.
     *
     * @private
     * @returns {void}
     */
    handleThrow() {
        const now = performance.now();
        const { keyboard, character, bottles } = this.world;

        if (!keyboard.THROW) return;
        if (now - this.lastThrowTime < THROW_SYSTEM_CONFIG.cooldownMs) return;
        if (bottles <= 0) return;
        if (!character) return;

        this.spawnThrowBottle();
        this.world.bottles--;
        this.lastThrowTime = now;
    }

    /**
     * Spawns a new thrown bottle in front of the character.
     *
     * @private
     * @returns {void}
     */
    spawnThrowBottle() {
        const { character, projectiles } = this.world;
        const dir = character.otherDirection ? -1 : 1;

        const startX = character.x + (dir > 0
            ? character.width * THROW_SYSTEM_CONFIG.spawnOffsetFactorX
            : THROW_SYSTEM_CONFIG.spawnOffsetLeftX);

        const startY = character.y + character.height * THROW_SYSTEM_CONFIG.spawnOffsetFactorY;

        projectiles.push(new ThrowBottle(startX, startY, dir));
    }

    /**
     * Updates all active projectiles and removes dead ones.
     *
     * @private
     * @returns {void}
     */
    updateProjectiles() {
        const { projectiles } = this.world;

        projectiles.forEach(p => p.update());
        this.world.projectiles = projectiles.filter(p => !p.isDead);
    }
}
