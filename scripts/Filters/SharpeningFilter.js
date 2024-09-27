class SharpeningFilter extends Filtro{
    apply(data) {
        const width = canvas.width;
        const height = canvas.height;
        const sharpenKernel = [
            0,  -0.5, 0,
            -0.5, 3, -0.5,
            0,  -0.5, 0
        ];

        const tempData = new Uint8ClampedArray(data.length); // Crear un nuevo array para los datos temporales
        tempData.set(data); // Copiar los datos originales al array temporal

        const getPixel = (x, y, i) => (y * width + x) * 4 + i;

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                for (let i = 0; i < 3; i++) { // Para R, G, B
                    let sum = 0;
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const pixel = getPixel(x + kx, y + ky, i);
                            const kernelValue = sharpenKernel[(ky + 1) * 3 + (kx + 1)];
                            sum += tempData[pixel] * kernelValue;
                        }
                    }
                    const currentPixel = getPixel(x, y, i);
                    data[currentPixel] = Math.min(Math.max(sum, 0), 255); // Limitar los valores entre 0 y 255
                }
            }
        }
    }
}
