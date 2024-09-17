class ImageHandler {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.originalImageData = null;  // Imagen original
        this.filteredImageData = null;  // Imagen filtrada sin trazos
        this.displayedImageData = null; // Imagen visualizada con los trazos

        this.initialize();
    }

    initialize() {
        // Manejar el botón de cargar imagen
        document.getElementById('uploadImage').addEventListener('change', (e) => this.loadImage(e));
        
        // Botones para aplicar filtros
        document.getElementById('grayscaleFilter').addEventListener('click', () => this.applyFilter('grayscale'));
        document.getElementById('negativeFilter').addEventListener('click', () => this.applyFilter('negative'));
        document.getElementById('brightnessFilter').addEventListener('click', () => this.applyFilter('brightness'));
        document.getElementById('binarizationFilter').addEventListener('click', () => this.applyFilter('binarization'));
        document.getElementById('sepiaFilter').addEventListener('click', () => this.applyFilter('sepia'));

        // Manejar el botón de limpiar el lienzo
        document.getElementById('clearCanvas').addEventListener('click', () => this.clearCanvas());
    }

    loadImage(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new window.Image(); // Usar window.Image para evitar conflicto con la clase
                img.onload = () => {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
                    this.originalImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                    this.displayedImageData = this.originalImageData;
                    this.filteredImageData = null; // Resetear imagen filtrada
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
            e.target.value = ''; // Limpiar input
        }
    }

    createFilteredVersion(filter) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;

        if (this.filteredImageData) {
            tempCtx.putImageData(this.filteredImageData, 0, 0);
        } else {
            tempCtx.putImageData(this.originalImageData, 0, 0);
        }

        const tempImageData = tempCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = tempImageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i], g = data[i + 1], b = data[i + 2];

            switch (filter) {
                case 'grayscale':
                    const gray = (r + g + b) / 3;
                    data[i] = data[i + 1] = data[i + 2] = gray;
                    break;
                case 'negative':
                    data[i] = 255 - r;
                    data[i + 1] = 255 - g;
                    data[i + 2] = 255 - b;
                    break;
                case 'brightness':
                    const brightness = 50;
                    data[i] = this.clamp(r + brightness);
                    data[i + 1] = this.clamp(g + brightness);
                    data[i + 2] = this.clamp(b + brightness);
                    break;
                case 'binarization':
                    const threshold = 128;
                    const average = (r + g + b) / 3;
                    const binary = average > threshold ? 255 : 0;
                    data[i] = data[i + 1] = data[i + 2] = binary;
                    break;
                case 'sepia':
                    data[i] = this.clamp((r * 0.393) + (g * 0.769) + (b * 0.189));
                    data[i + 1] = this.clamp((r * 0.349) + (g * 0.686) + (b * 0.168));
                    data[i + 2] = this.clamp((r * 0.272) + (g * 0.534) + (b * 0.131));
                    break;
                default:
                    break;
            }
        }

        this.filteredImageData = tempImageData; // Guardar la nueva versión filtrada sin trazos
    }

    applyFilter(filter) {
        if (!this.originalImageData) return;

        // Crear la versión filtrada sin trazos
        this.createFilteredVersion(filter);

        // Aplicar el filtro sobre la imagen visualizada (incluyendo los trazos)
        const tempImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = tempImageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i], g = data[i + 1], b = data[i + 2];

            switch (filter) {
                case 'grayscale':
                    const gray = (r + g + b) / 3;
                    data[i] = data[i + 1] = data[i + 2] = gray;
                    break;
                case 'negative':
                    data[i] = 255 - r;
                    data[i + 1] = 255 - g;
                    data[i + 2] = 255 - b;
                    break;
                case 'brightness':
                    const brightness = 50;
                    data[i] = this.clamp(r + brightness);
                    data[i + 1] = this.clamp(g + brightness);
                    data[i + 2] = this.clamp(b + brightness);
                    break;
                case 'binarization':
                    const threshold = 128;
                    const average = (r + g + b) / 3;
                    const binary = average > threshold ? 255 : 0;
                    data[i] = data[i + 1] = data[i + 2] = binary;
                    break;
                case 'sepia':
                    data[i] = this.clamp((r * 0.393) + (g * 0.769) + (b * 0.189));
                    data[i + 1] = this.clamp((r * 0.349) + (g * 0.686) + (b * 0.168));
                    data[i + 2] = this.clamp((r * 0.272) + (g * 0.534) + (b * 0.131));
                    break;
                default:
                    break;
            }
        }

        this.ctx.putImageData(tempImageData, 0, 0);
        this.displayedImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.originalImageData = null;
        this.filteredImageData = null;
        this.displayedImageData = null;
    }

    clamp(value) {
        return Math.max(0, Math.min(255, value));
    }
}
