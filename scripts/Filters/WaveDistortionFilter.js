class WaveDistortionFilter extends Filtro {
    apply(pixels) {
        const width = canvas.width;
        const height = canvas.height;

        const tempPixels = new Uint8ClampedArray(pixels); // Copiar los píxeles originales

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const offset = Math.sin((y + x) / 20) * 15; // Ajustar el offset y cambiar la fórmula para mejor distorsión
                const newY = Math.min(Math.max(y + offset, 0), height - 1); // Limitar la nueva posición Y entre los bordes
                const index = (Math.floor(newY) * width + x) * 4;

                // Asignar el color desde los píxeles originales
                pixels[(y * width + x) * 4] = tempPixels[index];       // Red
                pixels[(y * width + x) * 4 + 1] = tempPixels[index + 1]; // Green
                pixels[(y * width + x) * 4 + 2] = tempPixels[index + 2]; // Blue
                pixels[(y * width + x) * 4 + 3] = tempPixels[index + 3]; // Alpha
            }
        }
    }
}
