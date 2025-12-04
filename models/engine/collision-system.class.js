/**
 * Handles all collision logic for the world.
 * Keeps objects within bounds and resolves hits between player, enemies,
 * collectables and projectiles.
 */
class CollisionSystem {
    /**
     * @param {World} world - Active game world instance.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Updates all collision-related checks for the current frame.
     */
    update() {
        this.keepCharacterInBounds();
        this.keepEnemiesInBounds();
        this.handleEnemyCollisions();
        this.handleCollectableCollisions();
        this.handleProjectileCollisions();
    }

    /**
     * Prevents the character from leaving the horizontal level bounds.
     */
    keepCharacterInBounds() {
        const { character, worldWidth } = this.world;
        const maxX = worldWidth - character.width;

        character.x = Math.max(0, Math.min(character.x, maxX));
    }

    /**
     * Prevents all enemies from leaving the level bounds.
     */
    keepEnemiesInBounds() {
        const { enemies } = this.world;
        enemies.forEach(enemy => this.keepSingleEnemyInBounds(enemy));
    }

    /**
     * Keeps a single enemy within bounds and flips direction at edges.
     * The endboss is excluded from this logic.
     * @param {Enemies} enemy
     */
    keepSingleEnemyInBounds(enemy) {
        const { worldWidth, endboss } = this.world;
        if (enemy === endboss) return;

        const maxX = worldWidth - enemy.width;

        if (enemy.x < 0) {
            enemy.x = 0;
            enemy.movingRight = true;
        } else if (enemy.x > maxX) {
            enemy.x = maxX;
            enemy.movingRight = false;
        }
    }

    /**
     * Axis-aligned bounding box collision test between two objects.
     * @param {MovableObject} a
     * @param {MovableObject} b
     * @returns {boolean} True if hitboxes overlap.
     */
    hitTest(a, b) {
        const boxA = a.getHitbox();
        const boxB = b.getHitbox();

        return (
            boxA.x < boxB.x + boxB.width &&
            boxA.x + boxA.width > boxB.x &&
            boxA.y < boxB.y + boxB.height &&
            boxA.y + boxA.height > boxB.y
        );
    }

    /**
     * Checks if the player hits an enemy from above (stomp).
     * @param {Character} player
     * @param {Enemies} enemy
     * @returns {boolean} True if stomp criteria are met.
     */
    isStompFromAbove(player, enemy) {
        const p = player.getHitbox();
        const e = enemy.getHitbox();

        const playerBottom = p.y + p.height;
        const enemyMiddleY = e.y + e.height * 0.5;
        const playerIsFalling = player.speedY > 0;

        return playerIsFalling && playerBottom <= enemyMiddleY;
    }

    /**
     * Resolves collisions between the player and all enemies.
     */
    handleEnemyCollisions() {
        const { character, enemies } = this.world;
        enemies.forEach(enemy => this.handleSingleEnemyCollision(character, enemy));
    }

    /**
     * Handles collision between the player and a single enemy.
     * Supports stomping from above or taking damage.
     * @param {Character} character
     * @param {Enemies} enemy
     */
    handleSingleEnemyCollision(character, enemy) {
        if (enemy.isDead) return;
        if (!this.hitTest(character, enemy)) return;

        if (this.isStompFromAbove(character, enemy)) {
            enemy.die();
            character.speedY = -6;
            return;
        }

        character.takeDamage(0.2);
    }

    /**
     * Resolves collisions between the player and collectable items.
     */
    handleCollectableCollisions() {
        const { character, collectables } = this.world;

        collectables.forEach(item => {
            if (!this.hitTest(character, item)) return;
            item.onCollect(this.world);
        });
    }

    /**
     * Resolves all projectile-related collisions in the world.
     */
    handleProjectileCollisions() {
        const { projectiles } = this.world;

        projectiles.forEach(bottle => {
            if (bottle.hasHit) return;
            this.handleProjectileEnemyHits(bottle);
            this.handleProjectileBossHit(bottle);
        });
    }

    /**
     * Checks bottle collisions with regular enemies.
     * @param {MovableObject} bottle
     */
    handleProjectileEnemyHits(bottle) {
        const { enemies, endboss } = this.world;

        enemies.forEach(enemy => {
            if (enemy.isDead || enemy === endboss) return;
            if (!this.hitTest(bottle, enemy)) return;

            enemy.takeDamage(1);
            bottle.break();
        });
    }

    /**
     * Checks bottle collisions with the endboss.
     * @param {MovableObject} bottle
     */
    handleProjectileBossHit(bottle) {
        const { endboss } = this.world;
        if (!endboss || endboss.isDead) return;
        if (!this.hitTest(bottle, endboss)) return;

        endboss.takeDamage(20);
        bottle.break();
    }
}
