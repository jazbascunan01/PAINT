class HalftoneFilter extends Filtro {
    apply(pixels) {
        const width = canvas.width;
        const height = canvas.height;
        const dotSize = 6;  // Tamaño de los puntos (ajustar según se necesite)

        for (let y = 0; y < height; y += dotSize) {
            for (let x = 0; x < width; x += dotSize) {
                const i = (y * width + x) * 4;
                const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;

                const color = avg > 128 ? 255 : 0;

                for (let dy = 0; dy < dotSize; dy++) {
                    for (let dx = 0; dx < dotSize; dx++) {
                        const index = ((y + dy) * width + (x + dx)) * 4;
                        pixels[index] = color;
                        pixels[index + 1] = color;
                        pixels[index + 2] = color;
                    }
                }
            }
        }
    }
}
