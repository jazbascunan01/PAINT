class HandDrawnSketchFilter extends Filtro {
    apply(pixels) {
        const width = canvas.width;
        const height = canvas.height;
        const threshold = 20; // Sensibilidad para detectar bordes (ajustado a un valor más bajo)
        
        const tempPixels = new Uint8ClampedArray(pixels); // Copiar los píxeles originales

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;

                // Detectar el cambio de color entre píxeles vecinos
                const pixelAbove = (y > 0) ? ((y - 1) * width + x) * 4 : index;
                const pixelLeft = (x > 0) ? (y * width + (x - 1)) * 4 : index;

                const diffAbove = Math.abs(tempPixels[index] - tempPixels[pixelAbove]);
                const diffLeft = Math.abs(tempPixels[index] - tempPixels[pixelLeft]);

                const edge = (diffAbove + diffLeft) > threshold ? 0 : 255;

                // Aplicar un efecto de suavizado con un poco de color
                const colorValue = (edge === 0) ? 0 : 255; // Negros para bordes, blancos para no bordes
                pixels[index] = colorValue;       // Red
                pixels[index + 1] = colorValue;   // Green
                pixels[index + 2] = colorValue;   // Blue
                pixels[index + 3] = 255;          // Alpha (opacidad)
            }
        }
    }
}
