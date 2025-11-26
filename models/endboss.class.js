class Endboss extends MovableObject {
    collisionCategory = "boss";

    constructor(world) {
        super();

        this.world = world;

        this.height = 400;
        this.width = 400;

        this.animations = ASSETS.boss_chicken;
        this.feetOffset = 30;
        this.speed = 0.4;

        this.x = CONFIG.world.width - 300;
        this.snapToGround();

        this.preloadAnimations(this.animations);
        this.loadImage(this.animations.walk[0]);
        this.setHitbox(80, 150, 300, 200);

        this.health = 100;
        this.maxHealth = 100;

        // hurtUntil kommt aus takeDamage (MovableObject)
        // this.isHurt, this.hurtUntil werden dort gesetzt
    }

    update() {
        this.applyGravity();
        this.updateBehaviour();
    }

    /* ---------- Verhaltens-Kaskade ---------- */

    updateBehaviour() {
        if (this.handleDeath()) return;
        if (this.handleHurt()) return;
        if (this.handleAttack()) return;
        if (this.handleAlert()) return;

        this.handleWalk();
    }

    /* ---------- Einzelne Verhalten ---------- */

    handleDeath() {
        if (!this.isDead) return false;
        this.playAnimation(this.animations.dead, 8, false);
        return true;
    }

    handleHurt() {
        const now = performance.now();
        const stillHurt = this.isHurt && now < this.hurtUntil;

        if (!stillHurt) {
            this.isHurt = false;
            return false;
        }

        this.playAnimation(this.animations.hurt, 8);
        return true;
    }

    handleAttack() {
        const character = this.world.character;

        const distanceX = Math.abs(character.x - this.x);
        const ATTACK_RANGE = 150;

        if (distanceX > ATTACK_RANGE) return false;

        this.playAnimation(this.animations.attack, 8);
        return true;
    }

    handleAlert() {
        const character = this.world.character;

        const distanceX = Math.abs(character.x - this.x);
        const ALERT_RANGE = 400;

        if (distanceX > ALERT_RANGE) return false;

        this.playAnimation(this.animations.alert, 8);
        this.moveTowardsCharacter();
        return true;
    }

    handleWalk() {
        this.moveLeft(this.speed);
        this.playAnimation(this.animations.walk, 8);
    }

    /* ---------- Helper ---------- */

    moveTowardsCharacter() {
        const character = this.world.character;

        if (character.x < this.x) {
            this.moveLeft(this.speed);
            this.otherDirection = false;
        } else {
            this.moveRight(this.speed);
            this.otherDirection = true;
        }
    }

    takeDamage(amount = 1) {
        if (this.isDead) return;

        this.health = Math.max(0, this.health - amount);
        this.isHurt = true;
        this.hurtUntil = performance.now() + 400;

        if (this.health === 0) {
            this.die();
        }
    }
}
