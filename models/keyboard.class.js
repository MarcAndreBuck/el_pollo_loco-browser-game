class Keyboard {
    constructor() {

        this.bindings = {
            LEFT: ["ArrowLeft"],
            RIGHT: ["ArrowRight"],
            UP: ["ArrowUp"],
            DOWN: ["ArrowDown"],
            SPACE: ["Space"],
            THROW: ["KeyF"],
        };

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

    updateState(event, isDown) {
        const code = event.code;

        for (const action in this.bindings) {
            if (this.bindings[action].includes(code)) {
                this.state[action] = isDown;
                event.preventDefault();
            }
        }
    }

    rebind(action, newKey) {
        this.bindings[action] = [newKey];
    }

    get LEFT() { return this.state.LEFT; }
    get RIGHT() { return this.state.RIGHT; }
    get UP() { return this.state.UP; }
    get DOWN() { return this.state.DOWN; }
    get SPACE() { return this.state.SPACE; }
    get THROW() { return this.state.THROW; }
}
