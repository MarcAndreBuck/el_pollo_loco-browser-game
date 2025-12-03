class Camera {
    /**
     * 
     * @param {*} worldWidth 
     * @param {*} viewportWidth 
     */
    constructor(worldWidth, viewportWidth) {
        this.worldWidth = worldWidth;
        this.viewportWidth = viewportWidth;

        this.lookAheadRight = 0.33; 
        this.lookAheadLeft = 0.66;  

        this.activeLookAhead = this.lookAheadRight;

        this.lookTransitionSpeed = 0.05;

        this.x = 0;
    }


    /**
     * 
     * @param {*} character 
     */
    update(character) {
        const targetLookAhead = character.otherDirection
            ? this.lookAheadLeft
            : this.lookAheadRight;

        this.activeLookAhead +=
            (targetLookAhead - this.activeLookAhead) * this.lookTransitionSpeed;

        const playerCenter = character.x + character.width / 2;
        const targetX = playerCenter - this.viewportWidth * this.activeLookAhead;

        const maxX = this.worldWidth - this.viewportWidth;
        this.x = Math.max(0, Math.min(targetX, maxX));
    }
}
