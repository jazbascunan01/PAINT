class ArtisticStyleFilter extends Filtro {
    apply(pixels) {
        const width = canvas.width;
        const height = canvas.height;
        const intensity = 5;  // Intensidad de la aleatoriedad (ajustar según se necesite)

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const randX = x + Math.floor(Math.random() * intensity - intensity / 2);
                const randY = y + Math.floor(Math.random() * intensity - intensity / 2);

                if (randX >= 0 && randX < width && randY >= 0 && randY < height) {
                    const index = (randY * width + randX) * 4;

                    pixels[(y * width + x) * 4] = pixels[index];       // Red
                    pixels[(y * width + x) * 4 + 1] = pixels[index + 1]; // Green
                    pixels[(y * width + x) * 4 + 2] = pixels[index + 2]; // Blue
                    pixels[(y * width + x) * 4 + 3] = pixels[index + 3]; // Alpha
                }
            }
        }
    }
}
