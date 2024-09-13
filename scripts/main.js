/** @type { HTMLCanvasElement} */
let canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext('2d');

let originalImageData = null;  // Almacena los datos de la imagen original
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

// Manejar el botón de cargar imagen
document.getElementById('uploadImage').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el lienzo antes de cargar la imagen
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Ajustar la imagen al tamaño del lienzo

                // Guardar los datos de la imagen original
                originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);

        // Limpiar el valor del input después de cargar la imagen
        e.target.value = '';
    }
});

// Manejar el botón de limpiar el lienzo
document.getElementById('clearCanvas').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el lienzo
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
    let x = e.clientX - rect.left; // Coordenada X relativa al lienzo
    let y = e.clientY - rect.top;  // Coordenada Y relativa al lienzo
    return { x, y };
}