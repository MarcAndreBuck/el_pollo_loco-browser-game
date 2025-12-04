/**
 * Camera system that follows the player with smooth look-ahead behavior.
 * Adjusts horizontal offset based on direction and viewport size.
 */
class Camera {
    /**
     * @param {number} worldWidth - Total width of the game world.
     * @param {number} viewportWidth - Visible width of the camera viewport.
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
     * Updates camera position based on the player's location and direction.
     * Applies smooth look-ahead interpolation.
     * @param {Object} character - The player character the camera follows.
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
