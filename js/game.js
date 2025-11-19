let canvas;
let world;
let keyboard = new Keyboard();


init()

function init() {
    canvas = document.getElementById("canvas")
    world = new World(canvas, keyboard, level1);
}
