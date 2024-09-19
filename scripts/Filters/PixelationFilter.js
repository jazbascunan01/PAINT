class PixelationFilter extends Filtro {
    constructor(pixelSize = 10) {
        super();
        this.pixelSize = pixelSize;
    }

    apply(data) {
        const canvas = document.getElementById('canvas');
        const width = canvas.width;
        const height = canvas.height;

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = width;
        tempCanvas.height = height;
        tempCtx.drawImage(canvas, 0, 0);

        const imageData = tempCtx.getImageData(0, 0, width, height);
        const output = new Uint8ClampedArray(imageData.data.length);

        for (let y = 0; y < height; y += this.pixelSize) {
            for (let x = 0; x < width; x += this.pixelSize) {
                let avgR = 0, avgG = 0, avgB = 0, count = 0;

                for (let dy = 0; dy < this.pixelSize; dy++) {
                    for (let dx = 0; dx < this.pixelSize; dx++) {
                        const px = x + dx;
                        const py = y + dy;

                        if (px < width && py < height) {
                            const index = (px + (py * width)) * 4;
                            avgR += imageData.data[index];
                            avgG += imageData.data[index + 1];
                            avgB += imageData.data[index + 2];
                            count++;
                        }
                    }
                }

                avgR = Math.floor(avgR / count);
                avgG = Math.floor(avgG / count);
                avgB = Math.floor(avgB / count);

                for (let dy = 0; dy < this.pixelSize; dy++) {
                    for (let dx = 0; dx < this.pixelSize; dx++) {
                        const px = x + dx;
                        const py = y + dy;

                        if (px < width && py < height) {
                            const index = (px + (py * width)) * 4;
                            output[index] = avgR;
                            output[index + 1] = avgG;
                            output[index + 2] = avgB;
                            output[index + 3] = imageData.data[index + 3];
                        }
                    }
                }
            }
        }

        data.set(output);
    }
}
