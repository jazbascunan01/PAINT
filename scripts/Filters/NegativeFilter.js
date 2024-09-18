class NegativeFilter extends Filtro {
    apply(data) {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];         // Rojo
            data[i + 1] = 255 - data[i + 1]; // Verde
            data[i + 2] = 255 - data[i + 2]; // Azul
        }
    }
}