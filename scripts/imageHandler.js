class ImageHandler {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.originalImageData = null;  // Imagen original
        this.filteredImageData = null;  // Imagen filtrada sin trazos
        this.displayedImageData = null; // Imagen visualizada con los trazos
        this.drawnPaths = []; // Almacenar los trazos
        this.currentImage = null; // Guardar la imagen actual para redimensionarla
        this.mode = 'fit'; // Modo inicial, ajustado por defecto
        this.appliedFilters = []; // Guardar todos los filtros aplicados

        this.initialize();
    }

    initialize() {
        // Manejar el botón de cargar imagen
        document.getElementById('uploadImage').addEventListener('change', (e) => this.loadImage(e));

        // Manejar botones de modos de imagen
        document.getElementById('modeExpand').addEventListener('click', () => this.setMode('expand'));
        document.getElementById('modeFit').addEventListener('click', () => this.setMode('fit'));

        // Botones para aplicar filtros (como antes)
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

    setMode(mode) {
        this.mode = mode;
        if (this.currentImage) {
            this.renderImage(); // Redibujar la imagen según el nuevo modo
        }
    }

    loadImage(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new window.Image();
                img.onload = () => {
                    this.currentImage = img; // Guardar la imagen actual
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Limpiar el canvas antes de dibujar

                    // Dibujar la imagen según el modo (ajustado o expandido)
                    this.renderImage();

                    // Guardar los datos de la imagen original en el canvas
                    this.originalImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                    this.displayedImageData = this.originalImageData; // Inicialmente, la imagen visualizada es la original
                    this.filteredImageData = null; // Resetear cualquier filtro anterior

                    // Limpiar la lista de filtros aplicados
                    this.appliedFilters = [];

                    // Restaurar los trazos (si los hay)
                    this.restoreDrawings();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
            e.target.value = ''; // Limpiar input
        }
    }

    renderImage() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Limpiar el lienzo
    
        if (!this.currentImage) return; // Si no hay imagen cargada, no hacemos nada
    
        if (this.mode === 'expand') {
            // Imagen expandida para llenar el canvas
            this.ctx.drawImage(this.currentImage, 0, 0, this.canvas.width, this.canvas.height);
        } else if (this.mode === 'fit') {
            // Imagen ajustada conservando la proporción
            let scale = Math.min(this.canvas.width / this.currentImage.width, this.canvas.height / this.currentImage.height);
            let x = (this.canvas.width / 2) - (this.currentImage.width / 2) * scale;
            let y = (this.canvas.height / 2) - (this.currentImage.height / 2) * scale;
            this.ctx.drawImage(this.currentImage, x, y, this.currentImage.width * scale, this.currentImage.height * scale);
        }
    
        // Aplicar todos los filtros acumulados
        this.appliedFilters.forEach(filter => this.applyFilter(filter, true));
    
        // Restaurar los trazos después de redibujar la imagen
        this.restoreDrawings();
    }
    

    applyFilter(filter, skipSave = false) {
        if (!this.originalImageData) return;

        // Crear la versión filtrada sin trazos
        this.createFilteredVersion(filter);

        // Aplicar el filtro sobre la imagen visualizada (incluyendo los trazos)
        const tempImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        filter.apply(tempImageData.data);
        this.ctx.putImageData(tempImageData, 0, 0);
        this.displayedImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        // Restaurar los trazos sobre la imagen filtrada
        this.restoreDrawings();

        // Guardar el filtro actual en la lista de filtros aplicados si no se indica saltar el guardado
        if (!skipSave) {
            this.appliedFilters.push(filter);
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

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.originalImageData = null;
        this.filteredImageData = null;
        this.displayedImageData = null;
        this.drawnPaths = []; // Limpiar trazos
        this.appliedFilters = []; // Limpiar la lista de filtros aplicados
    }
    restoreDrawings() {
        this.ctx.beginPath();
        this.drawnPaths.forEach(path => {
            if (path.tool === 'pencil') {
                this.ctx.strokeStyle = path.color;
                this.ctx.lineWidth = path.size;
                this.ctx.lineTo(path.x, path.y);
                this.ctx.stroke();
            } else if (path.tool === 'eraser') {
                this.ctx.clearRect(path.x - path.size / 2, path.y - path.size / 2, path.size, path.size);
            }
        });
        this.ctx.closePath();
    }
}
