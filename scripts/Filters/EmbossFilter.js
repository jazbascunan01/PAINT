class EmbossFilter extends Filtro {
    apply(data) {
        const kernel = [
            [-2, -1, 0],
            [-1, 1, 1],
            [0, 1, 2]
        ];
        this.applyConvolution(data, kernel);
    }

    applyConvolution(data, kernel) {
        const canvas = document.getElementById('canvas');
        const width = canvas.width;
        const height = canvas.height;
        const output = new Uint8ClampedArray(data.length);
        const size = kernel.length;
        const half = Math.floor(size / 2);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let sumR = 0, sumG = 0, sumB = 0;

                for (let ky = 0; ky < size; ky++) {
                    for (let kx = 0; kx < size; kx++) {
                        let offsetX = x + kx - half;
                        let offsetY = y + ky - half;

                        // Asegurarse de que las coordenadas estén dentro del rango
                        if (offsetX >= 0 && offsetX < width && offsetY >= 0 && offsetY < height) {
                            let index = (offsetX + (offsetY * width)) * 4;
                            let weight = kernel[ky][kx];

                            sumR += data[index] * weight;
                            sumG += data[index + 1] * weight;
                            sumB += data[index + 2] * weight;
                        }
                    }
                }

                let index = (x + (y * width)) * 4;
                output[index] = this.clamp(sumR + 128);  // Ajustar brillo
                output[index + 1] = this.clamp(sumG + 128);  // Ajustar brillo
                output[index + 2] = this.clamp(sumB + 128);  // Ajustar brillo
                output[index + 3] = data[index + 3];  // Alpha
            }
        }

        data.set(output);
    }
}
