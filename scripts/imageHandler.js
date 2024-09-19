// Clase para gestionar la imagen
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
        document.getElementById('grayscaleFilter').addEventListener('click', () => this.applyFilter(new GrayscaleFilter()));
        document.getElementById('negativeFilter').addEventListener('click', () => this.applyFilter(new NegativeFilter()));
        document.getElementById('brightnessFilter').addEventListener('click', () => this.applyFilter(new BrightnessFilter()));
        document.getElementById('binarizationFilter').addEventListener('click', () => this.applyFilter(new BinarizationFilter()));
        document.getElementById('sepiaFilter').addEventListener('click', () => this.applyFilter(new SepiaFilter()));
        document.getElementById('blurFilter').addEventListener('click', () => this.applyFilter(new BlurFilter()));
        document.getElementById('edgeDetectionFilter').addEventListener('click', () => this.applyFilter(new EdgeDetectionFilter()));
        document.getElementById('saturationFilter').addEventListener('click', () => this.applyFilter(new SaturationFilter(1.5)));
        document.getElementById('EmbossFilter').addEventListener('click', () => this.applyFilter(new EmbossFilter()));
        document.getElementById('HeatMapFilter').addEventListener('click', () => this.applyFilter(new HeatMapFilter()));
        document.getElementById('PosterizeFilter').addEventListener('click', () => this.applyFilter(new PosterizeFilter()));
        document.getElementById('PixelationFilter').addEventListener('click', () => this.applyFilter(new PixelationFilter()));
        document.getElementById('ComicFilter').addEventListener('click', () => this.applyFilter(new ComicFilter()));
        document.getElementById('BrokenMirrorFilter').addEventListener('click', () => this.applyFilter(new BrokenMirrorFilter()));
        

        // Manejar el botón de limpiar el lienzo
        document.getElementById('clearCanvas').addEventListener('click', () => this.clearCanvas());
    }

    loadImage(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new window.Image();
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
        filter.apply(tempImageData.data);
        this.filteredImageData = tempImageData; // Guardar la nueva versión filtrada sin trazos
    }

    applyFilter(filter) {
        if (!this.originalImageData) return;

        // Crear la versión filtrada sin trazos
        this.createFilteredVersion(filter);

        // Aplicar el filtro sobre la imagen visualizada (incluyendo los trazos)
        const tempImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        filter.apply(tempImageData.data);
        this.ctx.putImageData(tempImageData, 0, 0);
        this.displayedImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.originalImageData = null;
        this.filteredImageData = null;
        this.displayedImageData = null;
    }
}