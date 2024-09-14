class Eraser {
    constructor(ctx, size) {
        this.ctx = ctx;
        this.size = size;
        this.lastX = null;
        this.lastY = null;
    }

    startErase(x, y) {
        this.lastX = Math.floor(x);
        this.lastY = Math.floor(y);
        this.erase(this.lastX, this.lastY);
    }

    erase(x, y) {
        this.interpolateErase(this.lastX, this.lastY, Math.floor(x), Math.floor(y));
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

        // Verificar si estamos borrando sobre una imagen filtrada o la original
        if (filteredImageData) {
            let regionData = this.getRegionFromFiltered(offsetX, offsetY, width, height);
            if (regionData) {
                this.ctx.putImageData(regionData, offsetX, offsetY);
            }
        } else if (originalImageData) {
            let regionData = this.getRegionFromOriginal(offsetX, offsetY, width, height);
            if (regionData) {
                this.ctx.putImageData(regionData, offsetX, offsetY);
            }
        } else {
            this.ctx.clearRect(offsetX, offsetY, width, height);
        }
    }

    // Corregido: Verificar límites antes de extraer la región de la imagen original
    getRegionFromOriginal(x, y, width, height) {
        let validWidth = Math.min(width, originalImageData.width - x); // Asegura que no salga de los límites del canvas
        let validHeight = Math.min(height, originalImageData.height - y); // Limitar al tamaño de la imagen

        // Solo intentar si el área solicitada está dentro de los límites de la imagen
        if (validWidth > 0 && validHeight > 0) {
            let tempCanvas = document.createElement('canvas');
            let tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = validWidth;
            tempCanvas.height = validHeight;
            tempCtx.putImageData(originalImageData, -x, -y);
            return tempCtx.getImageData(0, 0, validWidth, validHeight);
        } else {
            return null;  // Retorna nulo si la región es inválida
        }
    }

    getRegionFromFiltered(x, y, width, height) {
        let validWidth = Math.min(width, filteredImageData.width - x);
        let validHeight = Math.min(height, filteredImageData.height - y);

        if (validWidth > 0 && validHeight > 0) {
            let tempCanvas = document.createElement('canvas');
            let tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = validWidth;
            tempCanvas.height = validHeight;
            tempCtx.putImageData(filteredImageData, -x, -y);
            return tempCtx.getImageData(0, 0, validWidth, validHeight);
        } else {
            return null;  // Retorna nulo si la región es inválida
        }
    }
}
