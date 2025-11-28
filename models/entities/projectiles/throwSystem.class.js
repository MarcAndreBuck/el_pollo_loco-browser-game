class ThrowSystem {
    constructor(world) {
        this.world = world;
        this.lastThrowTime = 0;
    }

    update() {
        this.handleThrow();
        this.updateProjectiles();
    }

    handleThrow() {
        const now = performance.now();
        const COOLDOWN = 300;

        const { keyboard, character, bottles } = this.world;

        if (!keyboard.THROW) return;
        if (now - this.lastThrowTime < COOLDOWN) return;
        if (bottles <= 0) return;

        this.spawnThrowBottle();
        this.world.bottles--;
        this.lastThrowTime = now;
    }

    spawnThrowBottle() {
        const { character, projectiles } = this.world;

        const dir = character.otherDirection ? -1 : 1;
        const startX = character.x + (dir > 0 ? character.width * 0.6 : -10);
        const startY = character.y + character.height * 0.5;

        projectiles.push(new ThrowBottle(startX, startY, dir));
    }

    updateProjectiles() {
        const { projectiles } = this.world;

        projectiles.forEach(p => p.update());
        this.world.projectiles = projectiles.filter(p => !p.isDead);
    }
}
