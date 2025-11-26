class CollisionSystem {
    constructor(world) {
        this.world = world;
    }

    update() {
        this.handleEnemyCollisions();
        this.handleCollectableCollisions();
    }

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
                character.speedY = -6;  // TODO: bearbeiten des Rebounce beim stomp
                return;
            }
            character.takeDamage(1);
        });
    }

    handleCollectableCollisions() {
        const { character, collectables } = this.world;

        collectables.forEach(item => {
            if (!this.hitTest(character, item)) return;

            item.onCollect(this.world)
        });
    }

    handleProjectileCollisions() {
    const { projectiles, enemies, endboss } = this.world;

    projectiles.forEach(p => {
        enemies.forEach(enemy => {
            if (enemy.isDead) return;
            if (!this.hitTest(p, enemy)) return;

            enemy.takeDamage?.(1);
            p.break();
        });

        if (endboss && !endboss.isDead && this.hitTest(p, endboss)) {
            endboss.takeDamage(1);
            p.break();
        }
    });
}

}
