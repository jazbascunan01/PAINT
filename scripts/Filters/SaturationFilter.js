class SaturationFilter extends Filtro {
    constructor(amount = 1) {
        super();
        this.amount = amount; // valor entre 0 y 2
    }

    apply(data) {
        // Recorrer cada píxel (los valores están en RGBA, por eso el salto de 4)
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Calcular el promedio para la saturación
            const avg = (r + g + b) / 3;

            // Ajustar la saturación para cada canal de color
            data[i] = this.clamp(avg + (r - avg) * this.amount);
            data[i + 1] = this.clamp(avg + (g - avg) * this.amount);
            data[i + 2] = this.clamp(avg + (b - avg) * this.amount);
        }
    }
}
