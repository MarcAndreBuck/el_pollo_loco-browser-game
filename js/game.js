let canvas;
let world;
let keyboard = new Keyboard();


init()

function init() {
    canvas = document.getElementById("canvas")
    world = new World(canvas, keyboard);

    console.log("My Character is", world.character);
    
}

document.addEventListener("keydown", (event) => {
    console.log(event)
})