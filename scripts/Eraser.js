
class Eraser {
    constructor(ctx, size) {
        this.ctx = ctx;
        this.size = size;
        this.lastX = null;  // Almacena la última posición X del mouse
        this.lastY = null;  // Almacena la última posición Y del mouse
    }

    startErase(x, y) {
        // Iniciar la goma de borrar y guardar la posición inicial
        this.lastX = x;
        this.lastY = y;
        this.erase(x, y);  // Empezar a borrar en la primera posición
    }

    erase(x, y) {
        if (!originalImageData) return;  // Si no hay imagen original, no se puede borrar

        // Interpolar entre el último punto y el actual para borrar todo el camino
        this.interpolateErase(this.lastX, this.lastY, x, y);

        // Actualizar la última posición
        this.lastX = x;
        this.lastY = y;
    }

    interpolateErase(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let steps = Math.ceil(distance / (this.size / 2));

        for (let i = 0; i <= steps; i++) {
            let t = i / steps;
            let interpolatedX = x1 + dx * t;
            let interpolatedY = y1 + dy * t;
            this.eraseAt(interpolatedX, interpolatedY);
        }
    }

    eraseAt(x, y) {
        let offsetX = Math.floor(x - this.size / 2);
        let offsetY = Math.floor(y - this.size / 2);
        let width = Math.ceil(this.size);
        let height = Math.ceil(this.size);

        // Obtener los datos originales de la región actual desde la imagen original
        let regionData = this.getRegionFromOriginal(offsetX, offsetY, width, height);

        // Restaurar los datos originales de la imagen
        this.ctx.putImageData(regionData, offsetX, offsetY);
    }

    getRegionFromOriginal(x, y, width, height) {
        // Extrae una región de la imagen original almacenada
        let data = this.ctx.createImageData(width, height);

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                let sourceX = x + i;
                let sourceY = y + j;
                if (sourceX < 0 || sourceX >= canvas.width || sourceY < 0 || sourceY >= canvas.height) {
                    continue; // Evitar fuera de límites
                }

                let sourceIndex = (sourceY * canvas.width + sourceX) * 4;
                let targetIndex = (j * width + i) * 4;

                data.data[targetIndex] = originalImageData.data[sourceIndex];
                data.data[targetIndex + 1] = originalImageData.data[sourceIndex + 1];
                data.data[targetIndex + 2] = originalImageData.data[sourceIndex + 2];
                data.data[targetIndex + 3] = originalImageData.data[sourceIndex + 3];
            }
        }

        return data;
    }
}