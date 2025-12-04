/**
 * Configuration for the end boss stats, dimensions, and behavior.
 */
const BOSS_CONFIG = {
    width: 400,
    height: 400,
    feetOffset: 30,

    spawnOffsetX: 300,
    hitbox: { x: 80, y: 150, width: 300, height: 200 },

    health: 100,

    movementSpeed: 0.4,
    movementSpeedAlert: 0.8,

    triggerRatio: 0.6,
    hurtDuration: 400,

    attack: {
        range: 130,
        cooldown: 120,
        damage: 5,
    },

    alertRange: 300
};

/**
 * Controls the behavior, movement, and combat logic of the end boss.
 *
 * @class
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    collisionCategory = "boss";
    static TRIGGER_RATIO = BOSS_CONFIG.triggerRatio;

    lastAttackTime = 0;
    attackCooldown = BOSS_CONFIG.attack.cooldown;

    deathSoundPlayed = false;

    /**
     * Creates a new end boss instance.
     *
     * @param {World} world - The current world instance.
     */
    constructor(world) {
        super();
        this.world = world;

        this.initDimensions();
        this.initMovement();
        this.initPosition();
        this.initStats();
    }

    /** @returns {void} */
    initDimensions() {
        this.width = BOSS_CONFIG.width;
        this.height = BOSS_CONFIG.height;
        this.feetOffset = BOSS_CONFIG.feetOffset;
    }

    /** @returns {void} */
    initMovement() {
        this.speed = BOSS_CONFIG.movementSpeed;
        this.speedAlert = BOSS_CONFIG.movementSpeedAlert
    }

    /** @returns {void} */
    initPosition() {
        this.x = this.world.worldWidth - BOSS_CONFIG.spawnOffsetX;
        this.snapToGround();
    }

    /** @returns {void} */
    initStats() {
        this.animations = ASSETS.boss_chicken;

        this.preloadAnimations(this.animations);
        this.loadImage(this.animations.walk[0]);

        const h = BOSS_CONFIG.hitbox;
        this.setHitbox(h.x, h.y, h.width, h.height);

        this.health = BOSS_CONFIG.health;
        this.maxHealth = BOSS_CONFIG.health;
    }

    /**
     * Ensures the boss is only spawned once.
     *
     * @param {World} world
     * @returns {void}
     */
    static ensureSpawned(world) {
        if (world.bossFightStarted) return;

        const triggerX = world.worldWidth * Endboss.TRIGGER_RATIO;
        if (world.character.x < triggerX) return;
        soundManager.playMusic("music_boss");
        const boss = new Endboss(world);
        world.endboss = boss;
        world.level.enemies.push(boss);
        world.bossHealthBar = new ChickenBossHealth(world);

        world.bossFightStarted = true;
    }

    /** @returns {void} */
    update() {
        this.applyGravity();
        this.updateBehaviour();
    }

    /** @returns {void} */
    updateBehaviour() {
        if (this.handleDeath()) return;
        if (this.handleHurt()) return;
        if (this.handleAttack()) return;
        if (this.handleAlert()) return;
        this.handleWalk();
    }

    /** @returns {boolean} */
    handleDeath() {
        if (!this.isDead) return false;

        this.playAnimation(this.animations.dead, 8, false, () => {
            this.world.setState(GAME_STATE.WON);
        });

        this.playDeathSound();
        return true;
    }

    /** @returns {void} */
    playDeathSound() {
        if (this.deathSoundPlayed) return;
        this.deathSoundPlayed = true;
        soundManager.play("boss_death", true);
    }

    /** @returns {boolean} */
    handleHurt() {
        const now = performance.now();
        const stillHurt = this.isHurt && now < this.hurtUntil;
        if (!stillHurt) {
            this.isHurt = false;
            return false;
        }
        soundManager.play("boss_hurt", true);
        this.playAnimation(this.animations.hurt, 8);
        if (this.isCharacterInRange(BOSS_CONFIG.attack.range) && this.canDealDamage()) {
            this.dealAttackDamage();
        }
        return true;
    }

    /** @returns {boolean} */
    handleAttack() {
        const range = BOSS_CONFIG.attack.range;
        if (!this.isCharacterInRange(range)) return false;

        this.playAnimation(this.animations.attack, 8);
        soundManager.play("boss_attack");

        if (!this.canDealDamage()) return true;

        this.dealAttackDamage();
        return true;
    }

    /** @returns {boolean} */
    canDealDamage() {
        const now = performance.now();
        return now - this.lastAttackTime >= this.attackCooldown;
    }

    /** @returns {void} */
    dealAttackDamage() {
        this.lastAttackTime = performance.now();
        this.world.character.takeDamage(BOSS_CONFIG.attack.damage);
    }

    /** @returns {boolean} */
    handleAlert() {
        const range = BOSS_CONFIG.alertRange;
        if (!this.isCharacterInRange(range)) return false;

        this.playAnimation(this.animations.alert, 8);
        soundManager.play("boss_alert");
        this.moveLeft(2);

        this.moveTowardsCharacter();
        return true;
    }

    /** @returns {void} */
    handleWalk() {
        this.moveLeft(this.speed);
        this.playAnimation(this.animations.walk, 8);
    }

    /** @returns {void} */
    moveTowardsCharacter() {
        const character = this.world.character;

        if (character.x < this.x) {
            this.moveLeft(this.speedAlert);
            this.otherDirection = false;
        } else {
            this.moveRight(this.speedAlert);
            this.otherDirection = true;
        }
    }

    /**
     * @param {number} [amount=1]
     * @returns {void}
     */
    takeDamage(amount = 1) {
        if (this.isDead) return;

        this.health = Math.max(0, this.health - amount);
        this.isHurt = true;
        this.hurtUntil = performance.now() + BOSS_CONFIG.hurtDuration;

        if (this.health === 0) this.die();
    }

    /**
     * @param {number} range
     * @returns {boolean}
     */
    isCharacterInRange(range) {
        const character = this.world.character;
        return Math.abs(character.x - this.x) <= range;
    }
}
