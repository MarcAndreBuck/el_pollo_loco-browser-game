let canvas;
let world;
let keyboard = new Keyboard();
let level = level1;
let screenManager;

const GAME_WIDTH = 720;
const GAME_HEIGHT = 480;

init();

function init() {
    canvas = document.getElementById("canvas");

    screenManager = new ScreenManager(canvas, GAME_WIDTH, GAME_HEIGHT);

    world = new World(canvas, keyboard, level, screenManager);
    window.orientationManager = new OrientationManager(world, screenManager);
}
