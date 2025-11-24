class CollisionSystem {
    constructor(world) {
        this.world = world;
    }

    update() {
        this.handleEnemyCollisions();
        this.handleCollectableCollisions();
    }

    static hitTest(a, b) {
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
            if (!CollisionSystem.hitTest(character, enemy)) return;

            if (this.isStompFromAbove(character, enemy)) {
                if (!enemy.isDead && typeof enemy.die === "function") {
                    enemy.die();
                }
                character.speedY = -2;
                return;
            }

            character.takeDamage(1);
        });
    }

    handleCollectableCollisions() {
        const { character, collectables } = this.world;

        collectables.forEach(item => {
            if (!CollisionSystem.hitTest(character, item)) return;

            console.log("Character collected item:", item);
            // TODO: Score erhöhen, Item entfernen etc.
        });
    }
}
