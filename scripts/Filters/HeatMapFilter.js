class HeatMapFilter extends Filtro {
    apply(data) {
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg > 128 ? 255 : 0;         // Rojo
            data[i + 1] = avg > 128 ? 0 : 0;       // Verde
            data[i + 2] = avg > 128 ? 0 : 255;     // Azul
        }
    }
}
