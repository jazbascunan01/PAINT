
/** @type { HTMLCanvasElement } */
let canvas = document.getElementById('canvas');
/** @type { CanvasRenderingContext2D } */
let ctx = canvas.getContext('2d');

let mouseDown = false;
let lapiz = new Pencil(ctx, 0, 0, 'black', 15);
let activeTool = 'pencil';
let imageHandler = new ImageHandler(ctx, canvas);
let goma = new Eraser(ctx, 20, imageHandler);

// Manejar el botón de cargar imagen
document.getElementById('uploadImage').addEventListener('change', (e) => {
    imageHandler.loadImage(e);
});

// Cambiar entre lápiz y goma de borrar
document.getElementById('pencilTool').addEventListener('click', () => {
    activeTool = 'pencil';
});
// Cambiar el grosor del lápiz
document.getElementById('pencilWidth').addEventListener('input', (e) => {
    const newWidth = e.target.value;
    lapiz.setWidth(newWidth);
});
// Cambiar el tamaño de la goma
document.getElementById('eraserSize').addEventListener('input', (e) => {
    const newSize = e.target.value;
    goma.setSize(newSize);
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
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    return { x, y };
}

document.addEventListener('DOMContentLoaded', () => {
    const descargarImagenBtn = document.getElementById('saveImage');
    if (descargarImagenBtn) {
        descargarImagenBtn.addEventListener('click', handleDownloadButton);
    } else {
        console.error('El botón con id "saveImage" no se encontró.');
    }

    function handleDownloadButton() {
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'canvas_image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        } else {
            console.error('El elemento canvas no se encontró.');
        }
    }
});


