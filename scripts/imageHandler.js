let originalImageData = null;  // Imagen original
let filteredImageData = null;  // Imagen filtrada sin trazos
let displayedImageData = null; // Imagen visualizada con los trazos

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
                originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                displayedImageData = originalImageData;
                filteredImageData = null; // Resetear imagen filtrada
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }
});

// Crear versión filtrada de la imagen sin trazos
function createFilteredVersion(filter) {
    let tempCanvas = document.createElement('canvas');
    let tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // Dibujar la imagen original en el canvas temporal
    tempCtx.putImageData(originalImageData, 0, 0);
    let tempImageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
    let data = tempImageData.data;

    // Aplicar filtro a la imagen original (sin los trazos)
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
                let brightness = 50;
                data[i] = clamp(r + brightness);
                data[i + 1] = clamp(g + brightness);
                data[i + 2] = clamp(b + brightness);
                break;
            case 'binarization':
                let threshold = 128;
                let average = (r + g + b) / 3;
                let binary = average > threshold ? 255 : 0;
                data[i] = data[i + 1] = data[i + 2] = binary;
                break;
            case 'sepia':
                data[i] = clamp((r * 0.393) + (g * 0.769) + (b * 0.189));
                data[i + 1] = clamp((r * 0.349) + (g * 0.686) + (b * 0.168));
                data[i + 2] = clamp((r * 0.272) + (g * 0.534) + (b * 0.131));
                break;
            default:
                break;
        }
    }

    // Guardar la versión filtrada sin trazos
    filteredImageData = tempImageData;
}

// Aplicar filtro y visualizar la imagen filtrada con trazos
function applyFilter(filter) {
    if (!originalImageData) return;

    // Crear la versión filtrada sin trazos y guardarla
    createFilteredVersion(filter);

    // Aplicar filtro sobre la imagen visualizada (incluyendo los trazos)
    let tempImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = tempImageData.data;

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
                let brightness = 50;
                data[i] = clamp(r + brightness);
                data[i + 1] = clamp(g + brightness);
                data[i + 2] = clamp(b + brightness);
                break;
            case 'binarization':
                let threshold = 128;
                let average = (r + g + b) / 3;
                let binary = average > threshold ? 255 : 0;
                data[i] = data[i + 1] = data[i + 2] = binary;
                break;
            case 'sepia':
                data[i] = clamp((r * 0.393) + (g * 0.769) + (b * 0.189));
                data[i + 1] = clamp((r * 0.349) + (g * 0.686) + (b * 0.168));
                data[i + 2] = clamp((r * 0.272) + (g * 0.534) + (b * 0.131));
                break;
            default:
                break;
        }
    }

    // Visualizar la imagen filtrada con los trazos
    ctx.putImageData(tempImageData, 0, 0);
    displayedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}
function clamp(value) {
    return Math.max(0, Math.min(255, value));
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    originalImageData = null;
    filteredImageData = null;
    displayedImageData = null;
});
