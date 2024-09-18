class BrightnessFilter extends Filtro {
    apply(data) {
        const brightness = 50;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = this.clamp(data[i] + brightness);         // Rojo
            data[i + 1] = this.clamp(data[i + 1] + brightness); // Verde
            data[i + 2] = this.clamp(data[i + 2] + brightness); // Azul
        }
    }
}