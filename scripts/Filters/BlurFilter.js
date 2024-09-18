// Clase para el filtro Blur
class BlurFilter extends Filtro {
    constructor() {
        super();
        this.kernelSize = 3;
        this.kernel = [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ]; // Un kernel simple de 3x3 para el desenfoque
    }

    apply(data) {
        const canvas = document.getElementById('canvas');
        const width = canvas.width;
        const height = canvas.height;

        let imageData = new Uint8ClampedArray(data); // Clonar los datos de la imagen original
        let kernelSize = this.kernelSize;
        let half = Math.floor(kernelSize / 2);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let sumR = 0, sumG = 0, sumB = 0, count = 0;

                for (let i = 0; i < kernelSize; i++) {
                    for (let j = 0; j < kernelSize; j++) {
                        let offsetX = x + i - half;
                        let offsetY = y + j - half;

                        // Asegurarse de que las coordenadas estén dentro del rango
                        if (offsetX >= 0 && offsetX < width && offsetY >= 0 && offsetY < height) {
                            let index = (offsetX + (offsetY * width)) * 4;

                            sumR += data[index] * this.kernel[i][j];
                            sumG += data[index + 1] * this.kernel[i][j];
                            sumB += data[index + 2] * this.kernel[i][j];
                            count += this.kernel[i][j];
                        }
                    }
                }

                let index = (x + (y * width)) * 4;
                imageData[index] = this.clamp(sumR / count);
                imageData[index + 1] = this.clamp(sumG / count);
                imageData[index + 2] = this.clamp(sumB / count);
            }
        }

        // Copiar los datos procesados de nuevo a 'data'
        for (let i = 0; i < data.length; i++) {
            data[i] = imageData[i];
        }
    }
}
