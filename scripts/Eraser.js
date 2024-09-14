class Eraser {
    constructor(ctx, size) {
        this.ctx = ctx;
        this.size = size;
        this.lastX = null;  // Almacena la última posición X del mouse
        this.lastY = null;  // Almacena la última posición Y del mouse
    }

    startErase(x, y) {
        // Iniciar la goma de borrar y guardar la posición inicial
        this.lastX = Math.floor(x);
        this.lastY = Math.floor(y);
        this.erase(this.lastX, this.lastY);  // Empezar a borrar en la primera posición
    }

    erase(x, y) {
        // Interpolar entre el último punto y el actual para borrar todo el camino
        this.interpolateErase(this.lastX, this.lastY, Math.floor(x), Math.floor(y));

        // Actualizar la última posición
        this.lastX = Math.floor(x);
        this.lastY = Math.floor(y);
    }

    interpolateErase(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let steps = Math.ceil(distance / (this.size / 2));

        for (let i = 0; i <= steps; i++) {
            let t = i / steps;
            let interpolatedX = Math.floor(x1 + dx * t);
            let interpolatedY = Math.floor(y1 + dy * t);
            this.eraseAt(interpolatedX, interpolatedY);
        }
    }

    eraseAt(x, y) {
        let offsetX = Math.floor(x - this.size / 2);
        let offsetY = Math.floor(y - this.size / 2);
        let width = Math.ceil(this.size);
        let height = Math.ceil(this.size);

        // Verificar si hay una imagen original para restaurar
        if (originalImageData) {
            // Obtener los datos originales de la región actual desde la imagen original
            let regionData = this.getRegionFromOriginal(offsetX, offsetY, width, height);
            if (regionData && offsetX >= 0 && offsetY >= 0) {  // Validar que las coordenadas sean válidas
                this.ctx.putImageData(regionData, offsetX, offsetY);  // Asegurar que los valores sean enteros
            }
        } else {
            // Si no hay imagen cargada, simplemente pintar de blanco
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(offsetX, offsetY, width, height);
        }
    }

    getRegionFromOriginal(x, y, width, height) {
        // Limitar los valores de x e y para que no excedan los límites del canvas
        let maxX = Math.min(x + width, canvas.width);
        let maxY = Math.min(y + height, canvas.height);

        // Verificar que originalImageData no sea nulo o indefinido
        if (!originalImageData) return null;

        let data = this.ctx.createImageData(width, height);

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                let sourceX = x + i;
                let sourceY = y + j;
                // Verificación para evitar accesos fuera de los límites del canvas
                if (sourceX < 0 || sourceX >= canvas.width || sourceY < 0 || sourceY >= canvas.height) {
                    continue;
                }

                let sourceIndex = (sourceY * canvas.width + sourceX) * 4;
                let targetIndex = (j * width + i) * 4;

                // Copiar los valores RGBA desde originalImageData
                data.data[targetIndex] = originalImageData.data[sourceIndex];
                data.data[targetIndex + 1] = originalImageData.data[sourceIndex + 1];
                data.data[targetIndex + 2] = originalImageData.data[sourceIndex + 2];
                data.data[targetIndex + 3] = originalImageData.data[sourceIndex + 3];
            }
        }

        return data;
    }
}
