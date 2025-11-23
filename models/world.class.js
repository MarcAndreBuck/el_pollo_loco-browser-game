const DEBUG_HITBOXES = true;

const HITBOX_VISIBILITY = {
    player: true,
    enemy: true,
    boss: true,
    collectable: false,
    projectile: true,
    other: false,
};

const HITBOX_COLORS = {
    player: "#2196f3",
    enemy: "#f44336",
    boss: "#9c27b0",
    collectable: "#4caf50",
    projectile: "#ffeb3b",
    other: "#ff9800",
};

function getObjectCategory(gameObject) {
    return gameObject?.collisionCategory || "other";
}

function isHitboxVisibleFor(gameObject) {
    return !!HITBOX_VISIBILITY[getObjectCategory(gameObject)];
}

function getHitboxColorFor(gameObject) {
    return HITBOX_COLORS[getObjectCategory(gameObject)] || HITBOX_COLORS.other;
}

class World {
    character;
    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    worldWidth;


    constructor(canvas, keyboard, level) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.character = new Character();
        this.level = level;
        this.worldWidth = CONFIG.world.width;

        this.gameLoop();
    }

    get enemies() {
        return this.level.enemies;
    }

    get clouds() {
        return this.level.clouds;
    }

    get backgroundObjects() {
        return this.level.backgroundObjects;
    }

    get collectables() {
        return this.level.collectables;
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        this.character.update();
        this.keepCharacterInBounds();
        this.updateCamera();

        this.enemies.forEach(e => e.update && e.update());
        this.clouds.forEach(c => c.update && c.update());
        this.collectables.forEach(c => c.update && c.update());

        this.checkCollisions();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addObjectToMap(this.backgroundObjects);
        this.addObjectToMap(this.clouds);
        this.addObjectToMap(this.collectables);
        this.addObjectToMap(this.enemies);
        this.addToMap(this.character);

        if (DEBUG_HITBOXES) {
            this.drawHitboxes();
        }
    }

    addObjectToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    addToMap(mo) {
        if (!mo.img) return;

        const drawX = mo.x - this.camera_x;

        this.ctx.save();

        if (mo.otherDirection) {
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(
                mo.img,
                -drawX - mo.width,
                mo.y,
                mo.width,
                mo.height
            );
        } else {
            this.ctx.drawImage(
                mo.img,
                drawX,
                mo.y,
                mo.width,
                mo.height
            );
        }

        this.ctx.restore();
    }


    drawHitboxes() {
        this.drawHitboxFor(this.character);
        this.enemies.forEach(enemy => this.drawHitboxFor(enemy));
        this.collectables.forEach(item => this.drawHitboxFor(item));
    }

    drawHitboxFor(gameObject) {
        if (!isHitboxVisibleFor(gameObject)) return;

        const hitbox = gameObject.getHitbox();
        const drawX = hitbox.x - this.camera_x;
        const color = getHitboxColorFor(gameObject);

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(drawX, hitbox.y, hitbox.width, hitbox.height);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
        this.ctx.restore();
    }


    areObjectsColliding(objectA, objectB) {
        const hitboxA = objectA.getHitbox();
        const hitboxB = objectB.getHitbox();

        const overlapsHorizontally =
            hitboxA.x < hitboxB.x + hitboxB.width &&
            hitboxA.x + hitboxA.width > hitboxB.x;

        const overlapsVertically =
            hitboxA.y < hitboxB.y + hitboxB.height &&
            hitboxA.y + hitboxA.height > hitboxB.y;

        return overlapsHorizontally && overlapsVertically;
    }

    checkCollisions() {
        this.enemies.forEach(enemy => {
            if (!this.areObjectsColliding(this.character, enemy)) {
                return;
            }

            if (this.isStompFromAbove(this.character, enemy)) {
                console.log("Stomp: Character trifft Enemy von oben:", enemy);
                if (!enemy.isDead && typeof enemy.die === "function") {
                    enemy.die();
                }
                this.character.speedY = -2;
                return;
            }

            console.log("Character bekommt Schaden vom Enemy:", enemy);
            this.character.takeDamage(1);
        });

        this.collectables.forEach(item => {
            if (this.areObjectsColliding(this.character, item)) {
                console.log("Character collected item:", item);
                // TODO: Einsammeln, Score, etc.
            }
        });
    }


    keepCharacterInBounds() {
        const rightBoundary = this.worldWidth - this.character.width;

        if (this.character.x < 0) {
            this.character.x = 0;
        }

        if (this.character.x > rightBoundary) {
            this.character.x = rightBoundary;
        }
    }

    updateCamera() {
        const screenOffsetX = (this.canvas.width - this.character.width) / 2;

        this.camera_x = this.character.x - screenOffsetX;

        if (this.camera_x < 0) {
            this.camera_x = 0;
        }

        const maxCameraX = this.worldWidth - this.canvas.width;
        if (this.camera_x > maxCameraX) {
            this.camera_x = maxCameraX;
        }
    }


    isStompFromAbove(player, enemy) {
        const playerHitbox = player.getHitbox();
        const enemyHitbox = enemy.getHitbox();

        const playerBottom = playerHitbox.y + playerHitbox.height;
        const enemyMiddleY = enemyHitbox.y + enemyHitbox.height * 0.5;
        const playerIsFalling = player.speedY > 0;

        return playerIsFalling && playerBottom <= enemyMiddleY;
    }
}
