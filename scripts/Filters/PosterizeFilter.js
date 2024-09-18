class PosterizeFilter extends Filtro {
    constructor(levels) {
        super();
        this.levels = levels || 4; // Número de niveles de color
    }

    apply(data) {
        const factor = 255 / (this.levels - 1);
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.round(data[i] / factor) * factor;
            data[i + 1] = Math.round(data[i + 1] / factor) * factor;
            data[i + 2] = Math.round(data[i + 2] / factor) * factor;
        }
    }
}
