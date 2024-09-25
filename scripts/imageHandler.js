// Clase para gestionar la imagen
class ImageHandler {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.originalImageData = null;  // Imagen original
        this.filteredImageData = null;  // Imagen filtrada sin trazos
        this.displayedImageData = null; // Imagen visualizada con los trazos
        this.manejadorDeFiguras = manejadorDeFiguras; // Guardar la referencia
        this.initialize();
    }

    initialize() {
        // Manejar el botón de cargar imagen
        /*  document.getElementById('uploadImage').addEventListener('change', (e) => this.loadImage(e)); */
        // Manejar el botón de cargar imagen expandida
        document.getElementById('uploadImageExpanded').addEventListener('change', (e) => this.loadImage(e, true));

        // Manejar el botón de cargar imagen ajustada
        document.getElementById('uploadImageAdjusted').addEventListener('change', (e) => this.loadImage(e, false));
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


    loadImage(e, expanded) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new window.Image();
                img.onload = () => {
                    saveState('image');
                    this.currentImage = img;  // Guarda la imagen actual
                    this.manejadorDeFiguras.clearShapes(); // Llama al método que limpia las figuras
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    if (expanded) {
                        this.insertImageExpanded(img);
                    } else {
                        this.insertImageAdjusted(img);
                    }
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
    renderImage() {
        if (this.currentImage) {
            this.ctx.drawImage(this.currentImage, 0, 0, this.canvas.width, this.canvas.height);
        }
    }


    // Método para insertar la imagen expandida
    insertImageExpanded(img) {
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    }

    // Método para insertar la imagen ajustada manteniendo proporciones
    insertImageAdjusted(img) {
        const canvasAspectRatio = this.canvas.width / this.canvas.height;
        const imageAspectRatio = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (imageAspectRatio > canvasAspectRatio) {
            // Ajustar según el ancho del canvas
            drawWidth = this.canvas.width;
            drawHeight = this.canvas.width / imageAspectRatio;
            offsetX = 0;
            offsetY = (this.canvas.height - drawHeight) / 2;
        } else {
            // Ajustar según la altura del canvas
            drawHeight = this.canvas.height;
            drawWidth = this.canvas.height * imageAspectRatio;
            offsetX = (this.canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
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
        saveState('filter');
        if (!this.originalImageData) return;

        // Crear la versión filtrada sin trazos
        this.createFilteredVersion(filter);

        // Aplicar el filtro sobre la imagen visualizada (incluyendo los trazos)
        const tempImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        filter.apply(tempImageData.data);
        this.ctx.putImageData(tempImageData, 0, 0);
        this.displayedImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
    restoreImageState(imageState) {
        let img = new Image();
        img.src = imageState;
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);  // Limpiar el canvas
            this.ctx.drawImage(img, 0, 0);  // Redibujar la imagen
            this.manejadorDeFiguras.redrawShapes();  // Redibujar los trazos si es necesario
        };
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.originalImageData = null;
        this.filteredImageData = null;
        this.displayedImageData = null;
    }
}