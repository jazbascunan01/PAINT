class EdgeDetectionFilter extends Filtro {
    constructor() {
        super();
        this.kernel = [
            [-1, -1, -1],
            [-1, 8, -1],
            [-1, -1, -1]
        ];
    }

    apply(data) {
        const canvas = document.getElementById('canvas');
        const width = canvas.width;
        const height = canvas.height;
        const imageData = new Uint8ClampedArray(data);
        const kernelSize = this.kernel.length;
        const half = Math.floor(kernelSize / 2);
        const output = new Uint8ClampedArray(data.length);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let sumR = 0, sumG = 0, sumB = 0;

                for (let ky = 0; ky < kernelSize; ky++) {
                    for (let kx = 0; kx < kernelSize; kx++) {
                        let offsetX = x + kx - half;
                        let offsetY = y + ky - half;

                        // Asegurarse de que las coordenadas estén dentro del rango
                        if (offsetX >= 0 && offsetX < width && offsetY >= 0 && offsetY < height) {
                            let index = (offsetX + (offsetY * width)) * 4;
                            let weight = this.kernel[ky][kx];

                            sumR += data[index] * weight;
                            sumG += data[index + 1] * weight;
                            sumB += data[index + 2] * weight;
                        }
                    }
                }

                let index = (x + (y * width)) * 4;
                output[index] = this.clamp(sumR);
                output[index + 1] = this.clamp(sumG);
                output[index + 2] = this.clamp(sumB);
                output[index + 3] = data[index + 3];  // Alpha
            }
        }

        data.set(output);
    }
}
