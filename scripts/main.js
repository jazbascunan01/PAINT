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
let undoStack = [];
let redoStack = [];
// Guardar estado con tipo de acción (trazo o filtro)
function saveState(type) {
    undoStack.push({ 
        data: canvas.toDataURL(), 
        type: type // 'draw' para trazos, 'filter' para filtros
    });
    redoStack = [];  // Limpiar el stack de rehacer después de una nueva acción
}

// Restaurar el estado del canvas
function restoreState(state) {
    let img = new Image();
    img.src = state;
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
}
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
    saveState('draw');  // Guardar el estado antes de comenzar una nueva acción de dibujo
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
// Manejo de deshacer
document.getElementById('undoButton').addEventListener('click', () => {
    if (undoStack.length > 0) {
        let lastAction = undoStack.pop();  // Obtener el último estado
        redoStack.push({
            data: canvas.toDataURL(),  // Guardar el estado actual para rehacer
            type: lastAction.type  // Guardar el tipo actual (trazo o filtro)
        });
        
        if (lastAction.type === 'filter') {
            imageHandler.restoreImageState(lastAction.data);  // Restaurar solo la imagen
        } else if (lastAction.type === 'draw') {
            restoreState(lastAction.data);  // Restaurar el estado del canvas (trazos y figuras)
        }
        else if( lastAction.type === 'image'){
            restoreState(lastAction.data);
        }
    }
});

// Manejo de rehacer
document.getElementById('redoButton').addEventListener('click', () => {
    if (redoStack.length > 0) {
        let nextState = redoStack.pop();  // Obtener el siguiente estado del stack de rehacer
        undoStack.push({
            data: canvas.toDataURL(),  // Guardar el estado actual en el stack de deshacer
            type: nextState.type  // Guardar el tipo de la acción
        });

        if (nextState.type === 'filter') {
            imageHandler.restoreImageState(nextState.data);  // Restaurar la imagen
        } else if (nextState.type === 'draw') {
            restoreState(nextState.data);  // Restaurar trazos y figuras
        }
        else if(nextState.type === 'image'){
            imageHandler.restoreImageState(nextState.data);
        }
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

