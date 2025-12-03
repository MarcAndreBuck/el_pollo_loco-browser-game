class Endboss extends MovableObject {
    collisionCategory = "boss";
    static TRIGGER_RATIO = 0.6;
    lastAttackTime = 0;
    attackCooldown = 250;
    deathSoundPlayed = false;


    constructor(world) {
        super();
        this.world = world;

        this.initDimensions();
        this.initMovement();
        this.initPosition();
        this.initStats();
    }

    initDimensions() {
        this.height = 400;
        this.width = 400;
        this.feetOffset = 30;
    }

    initMovement() {
        this.speed = 0.4;
    }

    initPosition() {
        this.x = this.world.worldWidth - 300;
        this.snapToGround();
    }

    initStats() {
        this.animations = ASSETS.boss_chicken;
        this.preloadAnimations(this.animations);
        this.loadImage(this.animations.walk[0]);
        this.setHitbox(80, 150, 300, 200);
        this.health = 100;
        this.maxHealth = 100;
    }

    static ensureSpawned(world) {
        if (world.bossFightStarted) return;
        const triggerX = world.worldWidth * Endboss.TRIGGER_RATIO;
        if (world.character.x < triggerX) return;
        soundManager.playMusic("music_boss");
        const boss = new Endboss(world);
        boss.x = world.worldWidth - 350;
        world.endboss = boss;
        world.level.enemies.push(boss);
        world.bossHealthBar = new ChickenBossHealth(world.canvas.width - 240, 60, world);
        world.bossFightStarted = true;
    }


    update() {
        this.applyGravity();
        this.updateBehaviour();
    }


    updateBehaviour() {
        if (this.handleDeath()) return;
        if (this.handleHurt()) return;
        if (this.handleAttack()) return;
        if (this.handleAlert()) return;

        this.handleWalk();
    }


    handleDeath() {
        if (!this.isDead) return false;

        this.playAnimation(this.animations.dead, 8, false, () => { this.world.setState(GAME_STATE.WON) });
        this.playDeathSound()

        return true;
    }

    playDeathSound() {
        if (this.deathSoundPlayed) return;
        this.deathSoundPlayed = true;
        soundManager.play("boss_death", true);
    }


    handleHurt() {
        const now = performance.now();
        const stillHurt = this.isHurt && now < this.hurtUntil;

        if (!stillHurt) {
            this.isHurt = false;
            return false;
        }

        soundManager.play("boss_hurt", true);
        this.playAnimation(this.animations.hurt, 8);
        return true;
    }


    handleAttack() {
        const ATTACK_RANGE = 100;
        if (!this.isCharacterInRange(ATTACK_RANGE)) return false;

        this.playAnimation(this.animations.attack, 8);
        soundManager.play("boss_attack");

        if (!this.canDealDamage()) return true;

        this.dealAttackDamage();
        return true;
    }

    canDealDamage() {
        const now = performance.now();
        const timeSinceLastAttack = now - this.lastAttackTime;
        return timeSinceLastAttack >= this.attackCooldown;
    }

    dealAttackDamage() {
        this.lastAttackTime = performance.now();
        this.world.character.takeDamage(5);
    }


    handleAlert() {
        const ALERT_RANGE = 300;

        if (!this.isCharacterInRange(ALERT_RANGE)) return false;

        this.playAnimation(this.animations.alert, 8);
        soundManager.play("boss_alert");
        this.moveTowardsCharacter();
        return true;
    }

    handleWalk() {
        this.moveLeft(this.speed);
        this.playAnimation(this.animations.walk, 8);
        // soundManager.play("boss_idle"); 
    }


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

    isCharacterInRange(range) {
        const character = this.world.character;
        const distanceX = Math.abs(character.x - this.x);
        return distanceX <= range;
    }
}
