class Statusbar extends DrawableObject {
    percentage = 100;

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

    setStatusbarGrowth(value, maxValue = 100) {
        const ratio = Math.max(0, Math.min(value / maxValue, 1));
        this.percentage = ratio * 100;
        this.updateImage();
    }

    resolveImageIndex() {
        if (this.percentage === 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }

    updateImage() {
        const index = this.resolveImageIndex();
        const path = this.animations[index];
        this.img = this.imageCache[path];
    }
}


class HealthBar extends Statusbar {
    constructor(x, y, world) {
        super(x, y, ASSETS.statusbar.health.green, 200, 50);
        this.world = world;
    }

    update() {
        const character = this.world.character;

        const currentHealth = character.health ?? 0;
        const maxHealth = character.maxHealth ?? 100;

        this.setStatusbarGrowth(currentHealth, maxHealth);
    }

    draw(ctx) {
        super.draw(ctx);
    }
}




class BottleBar extends Statusbar {
    constructor(x, y, world) {
        super(x, y, ASSETS.statusbar.bottle.blue, 200, 50);
        this.world = world;
    }

    update() {
        const currentBottles = this.world.bottles ?? 0;
        const maxBottles = this.world.maxBottles || 1; 

        this.setStatusbarGrowth(currentBottles, maxBottles);
    }

    draw(ctx) {
        super.draw(ctx);
    }
}


class CoinCounter extends DrawableObject {
    constructor(positionX, positionY) {
        super();
        this.x = positionX;
        this.y = positionY;
        this.width = 40;
        this.height = 40;

        this.loadImage(ASSETS.statusbar.coin.icon[0]);
    }

    draw(ctx, world) {
        const coins = world.coins ?? 0;

        if (this.img) {
            ctx.drawImage(
                this.img,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }

        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.font = "24px Arial";
        ctx.textBaseline = "middle";
        ctx.fillText(`x ${coins}`, this.x + 40, this.y + this.height / 2);
        ctx.restore();
    }
}


class ChickenBossHealth extends Statusbar {
    constructor(x, y, world) {
        super(x, y, ASSETS.statusbar.endboss.orange, 200, 50);
        this.world = world;
    }

    update() {
        const boss = this.world.endboss;

        const currentHealth = boss.health ?? 0;
        const maxHealth = boss.maxHealth ?? 100;

        this.setStatusbarGrowth(currentHealth, maxHealth);
    }

    draw(ctx) {
        super.draw(ctx);
    }
}