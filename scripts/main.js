/** @type { HTMLCanvasElement} */
let canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext('2d');

let mouseDown = false;
let goma = new Eraser(ctx, 20);
let lapiz = new Pencil(ctx, 0, 0, 'black', 15);
let activeTool = 'pencil';

// Cambiar entre lápiz y goma de borrar
document.getElementById('pencilTool').addEventListener('click', () => {
    activeTool = 'pencil';
});

document.getElementById('eraserTool').addEventListener('click', () => {
    activeTool = 'eraser';
});

// Cambiar el color del lápiz
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
        goma.startErase(pos.x, pos.y);
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
    }
});

canvas.addEventListener('mouseup', () => {
    mouseDown = false;
});

// Obtener las coordenadas correctas del mouse respecto al lienzo
function getMousePos(e) {
    let rect = canvas.getBoundingClientRect(); // Obtener la posición del lienzo
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    return { x, y };
}
