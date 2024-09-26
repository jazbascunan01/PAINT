// Clase para gestionar la imagen
class ImageHandler {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.originalImageData = null;  // Imagen original
        this.filteredImageData = null;  // Imagen filtrada sin trazos
        this.displayedImageData = null; // Imagen visualizada con los trazos
        this.manejadorDeFiguras = manejadorDeFiguras; // Guardar la referencia
        this.isInitialized = false;  // Estado para saber si ya se inicializó
        this.initialize();
    }

    initialize() {
        // Solo inicializa si no se ha hecho antes
        if (this.isInitialized) return;

        // Array de objetos con los elementos y sus respectivos eventos
        const elementsWithEvents = [
            { id: 'uploadImageExpanded', event: 'change', handler: (e) => this.loadImage(e, true) },
            { id: 'uploadImageAdjusted', event: 'change', handler: (e) => this.loadImage(e, false) },
            { id: 'grayscaleFilter', event: 'click', handler: () => this.applyFilter(new GrayscaleFilter()) },
            { id: 'negativeFilter', event: 'click', handler: () => this.applyFilter(new NegativeFilter()) },
            { id: 'brightnessFilter', event: 'click', handler: () => this.applyFilter(new BrightnessFilter()) },
            { id: 'binarizationFilter', event: 'click', handler: () => this.applyFilter(new BinarizationFilter()) },
            { id: 'sepiaFilter', event: 'click', handler: () => this.applyFilter(new SepiaFilter()) },
            { id: 'blurFilter', event: 'click', handler: () => this.applyFilter(new BlurFilter()) },
            { id: 'edgeDetectionFilter', event: 'click', handler: () => this.applyFilter(new EdgeDetectionFilter()) },
            { id: 'saturationFilter', event: 'click', handler: () => this.applyFilter(new SaturationFilter(1.5)) },
            { id: 'EmbossFilter', event: 'click', handler: () => this.applyFilter(new EmbossFilter()) },
            { id: 'HeatMapFilter', event: 'click', handler: () => this.applyFilter(new HeatMapFilter()) },
            { id: 'PosterizeFilter', event: 'click', handler: () => this.applyFilter(new PosterizeFilter()) },
            { id: 'PixelationFilter', event: 'click', handler: () => this.applyFilter(new PixelationFilter()) },
            { id: 'ComicFilter', event: 'click', handler: () => this.applyFilter(new ComicFilter()) },
            { id: 'BrokenMirrorFilter', event: 'click', handler: () => this.applyFilter(new BrokenMirrorFilter()) },
            { id: 'clearCanvas', event: 'click', handler: () => this.clearCanvas() },
        ];

        // Iterar sobre los elementos y agregar los eventListeners solo si están presentes en el DOM
        elementsWithEvents.forEach(element => {
            const domElement = document.getElementById(element.id);
            if (domElement) {
                domElement.addEventListener(element.event, element.handler);
            }
        });

        // Marcar como inicializado
        this.isInitialized = true;
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
            document.getElementById('filtersTabButton').disabled = false;
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
        document.getElementById('filtersTabButton').disabled = true;
         // Deshabilitar filtersTabButton y eliminar la clase 'active' de todas las pestañas
         document.getElementById('filtersTabButton').disabled = true;
         document.querySelectorAll('.tab-button').forEach(button => {
             button.classList.remove('active');
         });

         // Agregar la clase 'active' solo a toolsTab
         document.querySelector('[data-tab="toolsTab"]').classList.add('active');

         // Mostrar el contenido correspondiente (ocultar los otros tabs)
         document.querySelectorAll('.tab-content').forEach(content => {
             content.classList.remove('active');
         });
         document.getElementById('toolsTab').classList.add('active');

    }
}