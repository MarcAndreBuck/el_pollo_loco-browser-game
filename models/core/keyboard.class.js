/**
 * Handles keyboard input for player actions.
 * Maps key codes to game actions and exposes simple getters.
 */
class Keyboard {
    constructor() {
        /**
         * Key bindings for each action.
         * @type {Object<string, string[]>}
         */
        this.bindings = {
            LEFT: ["ArrowLeft"],
            RIGHT: ["ArrowRight"],
            UP: ["ArrowUp"],
            DOWN: ["ArrowDown"],
            SPACE: ["Space"],
            THROW: ["KeyF"],
        };

        /**
         * Current on/off state of each action.
         * @type {Object<string, boolean>}
         */
        this.state = {
            LEFT: false,
            RIGHT: false,
            UP: false,
            DOWN: false,
            SPACE: false,
            THROW: false,
        };

        window.addEventListener("keydown", (e) => this.updateState(e, true));
        window.addEventListener("keyup", (e) => this.updateState(e, false));
    }

    /**
     * Updates action state when a key is pressed or released.
     * @param {KeyboardEvent} event - Key event.
     * @param {boolean} isDown - True when key is pressed.
     */
    updateState(event, isDown) {
        const code = event.code;

        for (const action in this.bindings) {
            if (this.bindings[action].includes(code)) {
                this.state[action] = isDown;
                event.preventDefault();
            }
        }
    }

    /**
     * Rebinds an action to a new key code.
     * @param {string} action - Action name (e.g., "LEFT").
     * @param {string} newKey - New KeyboardEvent.code value.
     */
    rebind(action, newKey) {
        this.bindings[action] = [newKey];
    }

    get LEFT() { return this.state.LEFT; }
    get RIGHT() { return this.state.RIGHT; }
    get UP() { return this.state.UP; }
    get DOWN() { return this.state.DOWN; }
    get SPACE() { return this.state.SPACE; }
    get THROW() { return this.state.THROW; }

    set LEFT(v) { this.state.LEFT = v; }
    set RIGHT(v) { this.state.RIGHT = v; }
    set UP(v) { this.state.UP = v; }
    set DOWN(v) { this.state.DOWN = v; }
    set SPACE(v) { this.state.SPACE = v; }
    set THROW(v) { this.state.THROW = v; }
}
