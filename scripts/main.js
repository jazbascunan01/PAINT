/** @type { HTMLCanvasElement } */
let canvas = document.getElementById('canvas');
/** @type { CanvasRenderingContext2D } */
let ctx = canvas.getContext('2d');

let mouseDown = false;
let lapiz = new Pencil(ctx, 0, 0, 'black', 15);
let activeTool = 'pencil';
const manejadorDeFiguras = new ManejadorDeFiguras(canvas, ctx, null);
const imageHandler = new ImageHandler(ctx, canvas, manejadorDeFiguras);

// Luego, asignar la referencia de imageHandler a manejadorDeFiguras
manejadorDeFiguras.imageHandler = imageHandler;
let goma = new Eraser(ctx, 20, imageHandler);

// Manejar el botón de cargar imagen
/* document.getElementById('uploadImage').addEventListener('change', (e) => {
    imageHandler.loadImage(e);
}); */

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
    else if (activeTool === 'rectangle' || activeTool === 'circle' || activeTool === 'triangle') {
        manejadorDeFiguras.onMouseDown(e);
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
    } else if (activeTool === 'rectangle' || activeTool === 'circle' || activeTool === 'triangle') {
        manejadorDeFiguras.onMouseMove(e);
    }
});
canvas.addEventListener('mouseup', () => {
    mouseDown = false;
    if (['rectangle', 'circle', 'triangle', 'hexagon', 'diamond', 'heart', 'arrowUp', 'arrowDown', 'arrowLeft', 'arrowRight', 'star', 'speechBubble'].includes(activeTool)) {
        manejadorDeFiguras.onMouseUp();
    }
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

// Cambiar herramientas de figuras
document.getElementById('rectTool').addEventListener('click', () => {
    activeTool = 'rectangle';
    manejadorDeFiguras.activeTool = 'rectangle';
});

document.getElementById('circleTool').addEventListener('click', () => {
    activeTool = 'circle';
    manejadorDeFiguras.activeTool = 'circle';
    console.log("circulo");
});

document.getElementById('triangleTool').addEventListener('click', () => {
    activeTool = 'triangle';
    manejadorDeFiguras.activeTool = 'triangle';
    console.log("Triangulo");
});

// Función para guardar el estado del rectángulo actual antes de redimensionar
function saveRectState(rect) {
    rectState.x = rect.x;
    rectState.y = rect.y;
    rectState.width = rect.width;
    rectState.height = rect.height;
}
// Seleccionar el color de fondo
document.getElementById('backgroundColor').addEventListener('input', (e) => {
    const newBgColor = e.target.value;
    setBackgroundColor(newBgColor);
});

function setBackgroundColor(color) {
    // Crear un nuevo canvas temporal para preservar el contenido actual del canvas
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    // Configurar el tamaño del canvas temporal al tamaño del canvas original
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // Copiar el contenido actual del canvas al canvas temporal
    tempCtx.drawImage(canvas, 0, 0);

    // Aplicar el color de fondo al canvas original
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redibujar el contenido guardado del canvas temporal sobre el canvas original
    ctx.drawImage(tempCanvas, 0, 0);
}

