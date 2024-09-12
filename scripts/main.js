/** @type { HTMLCanvasElement} */
let canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext('2d');


let mouseDown = false;
let goma = new Eraser(ctx, 0, 0, 20);
let lapiz = new Pencil(ctx, 0, 0, 'black', 15);
// Detectar el cambio de color en el input y actualizar el lápiz
let activeTool = 'pencil';
document.getElementById('pencilTool').addEventListener('click', () => {
    activeTool = 'pencil';
});

document.getElementById('eraserTool').addEventListener('click', () => {
    activeTool = 'eraser';
});
document.getElementById('pencilColor').addEventListener('input', (e) => {
    const newColor = e.target.value;
    lapiz.setColor(newColor);
});

canvas.addEventListener('mousedown', (e) => {
    mouseDown = true;
    let pos = getMousePos(e);
    if (activeTool === 'pencil') {
        lapiz.setPosition(pos.x, pos.y);
    } else if (activeTool === 'eraser') {
        goma.setPosition(pos.x, pos.y);
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!mouseDown) return;
    let pos = getMousePos(e);
    if (activeTool === 'pencil') {
        lapiz.draw(pos.x, pos.y);
        lapiz.setPosition(pos.x, pos.y);
    } else if (activeTool === 'eraser') {
        goma.erase(pos.x, pos.y);
        goma.setPosition(pos.x, pos.y);
    }
});

canvas.addEventListener('mouseup', () => {
    mouseDown = false;
});

function getMousePos(e) {
    let x = e.offsetX;
    let y = e.offsetY;
    return { x, y };
}