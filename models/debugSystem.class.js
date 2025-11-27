class DebugSystem {
    constructor(world) {
        this.world = world;
        this.hitboxEnabled = true;

        this.hitboxConfig = {
            visibility: {
                player: true,
                enemy: true,
                boss: true,
                collectable: true,
                projectile: true,
                other: false,
            },
            colors: {
                player: "#2196f3",
                enemy: "#f44336",
                boss: "#9c27b0",
                collectable: "#4caf50",
                projectile: "#ff3b3bff",
                other: "#ff9800",
            },
            lineWidth: 2,
        };
    }

    getCategory(gameObject) {
        return gameObject.collisionCategory || "other";
    }

    isHitboxVisibleFor(gameObject) {
        const cat = this.getCategory(gameObject);
        return !!this.hitboxConfig.visibility[cat];
    }

    getHitboxColorFor(gameObject) {
        const cat = this.getCategory(gameObject);
        const colors = this.hitboxConfig.colors;
        return colors[cat] || colors.other;
    }

    drawHitbox(gameObject) {
        const { ctx, camera } = this.world;
        if (!gameObject.getHitbox) return;
        if (!this.isHitboxVisibleFor(gameObject)) return;

        const hitbox = gameObject.getHitbox();
        const drawX = hitbox.x - camera.x;
        const color = this.getHitboxColorFor(gameObject);

        ctx.save();
        ctx.beginPath();
        ctx.rect(drawX, hitbox.y, hitbox.width, hitbox.height);
        ctx.lineWidth = this.hitboxConfig.lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.restore();
    }

    drawHitboxes() {
        if (!this.hitboxEnabled) return;

        const { character, enemies, collectables, projectiles } = this.world;
        const objects = [character, ...enemies, ...collectables, ...projectiles];

        objects.forEach(obj => this.drawHitbox(obj));
    }
}
