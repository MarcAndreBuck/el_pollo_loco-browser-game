class CollisionSystem {
    constructor(world) {
        this.world = world;
    }

    update() {
        this.keepCharacterInBounds();
        this.keepEnemiesInBounds();
        this.handleEnemyCollisions();
        this.handleCollectableCollisions();
        this.handleProjectileCollisions();
    }

    /* ---------- Bounds ---------- */

    keepCharacterInBounds() {
        const { character, worldWidth } = this.world;
        const maxX = worldWidth - character.width;

        character.x = Math.max(0, Math.min(character.x, maxX));
    }

    keepEnemiesInBounds() {
        const { enemies, worldWidth, endboss } = this.world;

        enemies.forEach(enemy => {
            if (enemy === endboss) return; 

            const maxX = worldWidth - enemy.width;

            if (enemy.x < 0) {
                enemy.x = 0;
                enemy.movingRight = true;   
            } else if (enemy.x > maxX) {
                enemy.x = maxX;
                enemy.movingRight = false;  
            }
        });
    }

    /* ---------- Collision Helpers ---------- */

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

    isStompFromAbove(player, enemy) {
        const p = player.getHitbox();
        const e = enemy.getHitbox();

        const playerBottom = p.y + p.height;
        const enemyMiddleY = e.y + e.height * 0.5;
        const playerIsFalling = player.speedY > 0;

        return playerIsFalling && playerBottom <= enemyMiddleY;
    }

    handleEnemyCollisions() {
        const { character, enemies } = this.world;

        enemies.forEach(enemy => {
            if (enemy.isDead) return;
            if (!this.hitTest(character, enemy)) return;

            if (this.isStompFromAbove(character, enemy)) {
                if (!enemy.isDead) {
                    enemy.die();
                }
                character.speedY = -6;
                return;
            }

            character.takeDamage(1);
        });
    }

    handleCollectableCollisions() {
        const { character, collectables } = this.world;

        collectables.forEach(item => {
            if (!this.hitTest(character, item)) return;

            item.onCollect(this.world);
        });
    }

    handleProjectileCollisions() {
        const { projectiles, enemies, endboss } = this.world;

        projectiles.forEach(bottle => {
            if (bottle.hasHit) return;

            enemies.forEach(enemy => {
                if (enemy.isDead || enemy === endboss) return;
                if (!this.hitTest(bottle, enemy)) return;

                enemy.takeDamage(1);
                bottle.break();
            });

            if (endboss && !endboss.isDead && this.hitTest(bottle, endboss)) {
                endboss.takeDamage(20);
                bottle.break();
            }
        });
    }
}
