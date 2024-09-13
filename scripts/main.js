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
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                // Guardar los datos originales de la imagen
                originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }
});
function applyFilter(filter) {
    if (!originalImageData) return;
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        switch (filter) {
            case 'grayscale':
                let gray = (r + g + b) / 3;
                data[i] = data[i + 1] = data[i + 2] = gray;
                break;

            case 'negative':
                data[i] = 255 - r;
                data[i + 1] = 255 - g;
                data[i + 2] = 255 - b;
                break;

            case 'brightness':
                let brightness = 50;  // Ajustar el brillo (+ o -)
                data[i] = clamp(r + brightness);
                data[i + 1] = clamp(g + brightness);
                data[i + 2] = clamp(b + brightness);
                break;

            case 'binarization':
                let threshold = 128;  // Umbral para binarización
                let average = (r + g + b) / 3;
                let binary = average > threshold ? 255 : 0;
                data[i] = data[i + 1] = data[i + 2] = binary;
                break;

            case 'sepia':
                data[i] = clamp((r * 0.393) + (g * 0.769) + (b * 0.189)); // Red
                data[i + 1] = clamp((r * 0.349) + (g * 0.686) + (b * 0.168)); // Green
                data[i + 2] = clamp((r * 0.272) + (g * 0.534) + (b * 0.131)); // Blue
                break;

            default:
                break;
        }
    }

    // Poner los datos filtrados en el lienzo
    ctx.putImageData(imageData, 0, 0);
}

function clamp(value) {
    return Math.max(0, Math.min(255, value));  // Asegura que los valores estén entre 0 y 255
}

// Botones para aplicar filtros
document.getElementById('grayscaleFilter').addEventListener('click', () => {
    applyFilter('grayscale');
});

document.getElementById('negativeFilter').addEventListener('click', () => {
    applyFilter('negative');
});

document.getElementById('brightnessFilter').addEventListener('click', () => {
    applyFilter('brightness');
});

document.getElementById('binarizationFilter').addEventListener('click', () => {
    applyFilter('binarization');
});

document.getElementById('sepiaFilter').addEventListener('click', () => {
    applyFilter('sepia');
});

// Manejar el botón de limpiar el lienzo
document.getElementById('clearCanvas').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el lienzo
    originalImageData = null; // Reiniciar la imagen original si se limpia el lienzo
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