class Coin extends Collectable {
    constructor(x, y) {
        super(x, y, 100, 100);

        this.animations = ASSETS.coin;

        this.loadImages(this.animations);
        this.loadImage(this.animations[0])

        this.baseY = y;
        this.bobAmplitude = 5;
        this.bobSpeed = 0.003;

        this.value = 1;

        this.setHitbox(40, 40, 20, 20);
    }

    update() {
        const t = performance.now();
        this.y = this.baseY + Math.sin(t * this.bobSpeed) * this.bobAmplitude;

        this.playAnimation(this.animations, 2);
    }

    onCollect(world) {
        world.coins = (world.coins) + this.value;
        super.onCollect(world);
        soundManager.play("player_collect_coin", true);
    }
}
