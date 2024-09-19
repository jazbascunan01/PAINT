class ComicFilter extends Filtro {
    apply(data) {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Obtener los datos originales de la imagen
        const imageData = ctx.getImageData(0, 0, width, height);
        const originalData = imageData.data;

        // Aplicar desenfoque sutil antes de la detección de bordes para suavizar y redondear
        const blurredData = this.applyBlur(originalData, width, height);

        // Simplificación de colores más equilibrada (conserva viveza)
        for (let i = 0; i < data.length; i += 4) {
            data[i] = this.adjustColor(blurredData[i], 30);       // Rojo
            data[i + 1] = this.adjustColor(blurredData[i + 1], 20); // Verde
            data[i + 2] = this.adjustColor(blurredData[i + 2], 25); // Azul
        }

        // Aplicar contornos suaves
        const edgeImageData = this.applySubtleEdges(blurredData, width, height);
        for (let i = 0; i < data.length; i += 4) {
            data[i] = this.mix(data[i], edgeImageData[i], 0.1); // Contorno más sutil
            data[i + 1] = this.mix(data[i + 1], edgeImageData[i + 1], 0.1);
            data[i + 2] = this.mix(data[i + 2], edgeImageData[i + 2], 0.1);
        }

        // Actualizar el canvas con los nuevos datos
        ctx.putImageData(imageData, 0, 0);
    }

    // Ajustar color suavemente pero manteniendo saturación (no gris)
    adjustColor(color, offset) {
        if (color > 200) return Math.min(255, color + offset);  // Mantiene colores brillantes
        if (color > 128) return Math.max(150, color - offset);  // Colores medios menos alterados
        return Math.min(100, color + offset);                   // Mantiene colores oscuros
    }

    // Aplicar desenfoque sutil
    applyBlur(data, width, height) {
        const blurredData = new Uint8ClampedArray(data.length);
        for (let x = 1; x < width - 1; x++) {
            for (let y = 1; y < height - 1; y++) {
                const idx = (y * width + x) * 4;

                for (let channel = 0; channel < 3; channel++) { // Rojo, Verde, Azul
                    const sum =
                        data[idx - 4 + channel] +
                        data[idx + 4 + channel] +
                        data[idx - width * 4 + channel] +
                        data[idx + width * 4 + channel];

                    blurredData[idx + channel] = Math.floor(sum / 4);
                }
                blurredData[idx + 3] = 255; // Opacidad completa
            }
        }
        return blurredData;
    }

    // Bordes más suaves
    applySubtleEdges(data, width, height) {
        const edgeData = new Uint8ClampedArray(data.length);

        for (let x = 1; x < width - 1; x++) {
            for (let y = 1; y < height - 1; y++) {
                const idx = (y * width + x) * 4;

                const dx =
                    (data[idx - 4] - data[idx + 4]) + // Diferencia en rojo
                    (data[idx - 3] - data[idx + 5]) + // Diferencia en verde
                    (data[idx - 2] - data[idx + 6]);  // Diferencia en azul

                const dy =
                    (data[idx - width * 4] - data[idx + width * 4]) +
                    (data[idx - width * 4 + 1] - data[idx + width * 4 + 1]) +
                    (data[idx - width * 4 + 2] - data[idx + width * 4 + 2]);

                const magnitude = Math.sqrt(dx * dx + dy * dy);

                const edge = magnitude > 80 ? 0 : 255;  // Bordes más suaves y menos sensibles

                edgeData[idx] = edge;
                edgeData[idx + 1] = edge;
                edgeData[idx + 2] = edge;
                edgeData[idx + 3] = 255; // Opacidad completa
            }
        }
        return edgeData;
    }

    // Mezcla colores con un peso más bajo (10%)
    mix(color1, color2, weight) {
        return Math.round(color1 * (1 - weight) + color2 * weight);
    }
}
