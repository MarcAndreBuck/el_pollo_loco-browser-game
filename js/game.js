let canvas;
let world;
let keyboard;
let screenManager;
let levelManager;

/** @type {number} Base internal game width for logical rendering. */
const GAME_WIDTH = 720;

/** @type {number} Base internal game height for logical rendering. */
const GAME_HEIGHT = 480;

init();

/**
 * Initializes core game systems, including canvas, input,
 * screen scaling, level management, orientation handling,
 * and world creation.
 *
 * @returns {void}
 */
function init() {
    canvas = document.getElementById("canvas");
    keyboard = new Keyboard();
    screenManager = new ScreenManager(canvas, GAME_WIDTH, GAME_HEIGHT);

    levelManager = new LevelManager();
    const level = levelManager.getCurrentLevel();

    world = new World(canvas, keyboard, level, screenManager);
    window.orientationManager = new OrientationManager(world, screenManager);
}

/**
 * Restarts the current level by delegating
 * the logic to the LevelManager.
 *
 * @returns {void}
 */
function restartGame() {
    levelManager.restartCurrentLevel(world);
}
