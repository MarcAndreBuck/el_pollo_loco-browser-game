let canvas;
let world;
let keyboard;
let screenManager;
let levelManager;

const GAME_WIDTH = 720;
const GAME_HEIGHT = 480;

init();

function init() {
    canvas = document.getElementById("canvas");
    keyboard = new Keyboard();
    screenManager = new ScreenManager(canvas, GAME_WIDTH, GAME_HEIGHT);

    levelManager = new LevelManager();
    const level = levelManager.getCurrentLevel();

    world = new World(canvas, keyboard, level, screenManager);
    window.orientationManager = new OrientationManager(world, screenManager);
}

function restartGame() {
    levelManager.restartCurrentLevel(world);
}
