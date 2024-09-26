/** @type { HTMLCanvasElement } */
let canvas = document.getElementById('canvas');
/** @type { CanvasRenderingContext2D } */
let ctx = canvas.getContext('2d');

let mouseDown = false;
let lapiz = new Pencil(ctx, 0, 0, 'black', 15);
let activeTool = 'pencil';
const manejadorDeFiguras = new ManejadorDeFiguras(canvas, ctx, null);
const imageHandler = new ImageHandler(ctx, canvas, manejadorDeFiguras);

// Asignar la referencia de imageHandler a manejadorDeFiguras
manejadorDeFiguras.imageHandler = imageHandler;
let goma = new Eraser(ctx, 20, imageHandler);
let undoStack = [];
let redoStack = [];

/**
 * Guarda el estado actual del canvas con el tipo de acción especificada.
 * @param {string} type - El tipo de acción a guardar (trazo o filtro).
 */
function saveState(type) {
    undoStack.push({
        data: canvas.toDataURL(),
        type: type // 'draw' para trazos, 'filter' para filtros
    });
    redoStack = [];  // Limpiar el stack de rehacer después de una nueva acción
    updateUndoRedoButtons();  // Actualizar los botones
}

/**
 * Restaura el estado del canvas usando la URL de la imagen guardada.
 * @param {string} state - La URL del estado del canvas a restaurar.
 */
function restoreState(state) {
    let img = new Image();
    img.src = state;
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
}

/**
 * Inicializa los botones principales del programa y asigna los manejadores de eventos correspondientes.
 */
function initializeMainButtons() {
    const buttonsWithEvents = [
        { id: 'pencilTool', event: 'click', handler: () => { activeTool = 'pencil'; } },
        { id: 'pencilWidth', event: 'input', handler: (e) => { const newWidth = e.target.value; lapiz.setWidth(newWidth); } },
        { id: 'eraserSize', event: 'input', handler: (e) => { const newSize = e.target.value; goma.setSize(newSize); } },
        { id: 'eraserTool', event: 'click', handler: () => { activeTool = 'eraser'; } },
        { id: 'pencilColor', event: 'input', handler: (e) => { const newColor = e.target.value; lapiz.setColor(newColor); } },
        { id: 'undoButton', event: 'click', handler: handleUndo },
        { id: 'redoButton', event: 'click', handler: handleRedo },
        { id: 'saveImage', event: 'click', handler: handleDownloadButton },
        { id: 'rectTool', event: 'click', handler: () => { activeTool = 'rectangle'; manejadorDeFiguras.activeTool = 'rectangle'; } },
        { id: 'circleTool', event: 'click', handler: () => { activeTool = 'circle'; manejadorDeFiguras.activeTool = 'circle'; console.log("circulo"); } },
        { id: 'triangleTool', event: 'click', handler: () => { activeTool = 'triangle'; manejadorDeFiguras.activeTool = 'triangle'; console.log("Triangulo"); } },
        { id: 'backgroundColor', event: 'input', handler: (e) => { const newBgColor = e.target.value; setBackgroundColor(newBgColor); } }
    ];

    buttonsWithEvents.forEach(button => {
        const domElement = document.getElementById(button.id);
        if (domElement) {
            domElement.addEventListener(button.event, button.handler);
        } else {
            console.error(`El botón con id "${button.id}" no se encontró.`);
        }
    });
}

/**
 * Maneja la acción de deshacer (undo), restaurando el último estado guardado.
 */
function handleUndo() {
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
        } else if (lastAction.type === 'image') {
            restoreState(lastAction.data);
            document.getElementById('filtersTabButton').disabled = true;
            updateTabs('toolsTab'); // Habilitar y activar la solapa de herramientas
        }
    }
    updateUndoRedoButtons();
}

/**
 * Maneja la acción de rehacer (redo), aplicando el siguiente estado guardado.
 */
function handleRedo() {
    if (redoStack.length > 0) {
        let nextState = redoStack.pop();  // Obtener el siguiente estado
        undoStack.push({
            data: canvas.toDataURL(),  // Guardar el estado actual en el stack de deshacer
            type: nextState.type  // Guardar el tipo de la acción
        });

        if (nextState.type === 'filter') {
            imageHandler.restoreImageState(nextState.data);  // Restaurar la imagen
        } else if (nextState.type === 'draw') {
            restoreState(nextState.data);  // Restaurar trazos y figuras
        } else if (nextState.type === 'image') {
            imageHandler.restoreImageState(nextState.data);
            document.getElementById('filtersTabButton').disabled = false;
        }
        updateUndoRedoButtons();
    }
}

/**
 * Descarga la imagen del canvas en formato PNG.
 */
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

/**
 * Cambia el color de fondo del canvas.
 * @param {string} color - El color de fondo a aplicar.
 */
function setBackgroundColor(color) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
}

/**
 * Actualiza los botones de deshacer (undo) y rehacer (redo) según las acciones disponibles.
 */
function updateUndoRedoButtons() {
    const undoButton = document.getElementById('undoButton');
    const redoButton = document.getElementById('redoButton');
    undoButton.disabled = undoStack.length === 0;
    redoButton.disabled = redoStack.length === 0;
}

/**
 * Configura la navegación de pestañas, permitiendo cambiar entre herramientas y filtros.
 */
function setupTabNavigation() {
    const tabs = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(btn => btn.classList.remove('active'));  // Limpiar todas las solapas activas
            this.classList.add('active');  // Activar la solapa actual

            tabContents.forEach(content => content.classList.remove('active'));  // Ocultar todo el contenido
            const selectedTab = this.getAttribute('data-tab');
            document.getElementById(selectedTab).classList.add('active');
        });
    });
}

/**
 * Actualiza la interfaz de las solapas, mostrando la solapa seleccionada y desactivando las otras.
 * @param {string} tabId - El ID de la solapa a activar.
 */
function updateTabs(tabId) {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// Llamar a la función cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    initializeMainButtons();
    setupTabNavigation();
    document.getElementById('filtersTabButton').disabled = true;
    document.getElementById('undoButton').disabled = true;
    document.getElementById('redoButton').disabled = true;
});

// Eventos de mouse en el canvas
canvas.addEventListener('mousedown', (e) => {
    mouseDown = true;
    saveState('draw');
    let pos = getMousePos(e);
    if (activeTool === 'pencil') {
        lapiz.setPosition(pos.x, pos.y);
    } else if (activeTool === 'eraser') {
        goma.startErase(pos.x, pos.y);
    } else if (['rectangle', 'circle', 'triangle'].includes(activeTool)) {
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
    } else if (['rectangle', 'circle', 'triangle'].includes(activeTool)) {
        manejadorDeFiguras.onMouseMove(e);
    }
});

canvas.addEventListener('mouseup', () => {
    mouseDown = false;
    if (['rectangle', 'circle', 'triangle'].includes(activeTool)) {
        manejadorDeFiguras.onMouseUp();
    }
});

/**
 * Obtiene la posición del mouse en el canvas.
 * @param {MouseEvent} e - El evento del mouse.
 * @returns {Object} La posición x e y del mouse.
 */
function getMousePos(e) {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    return { x, y };
}
