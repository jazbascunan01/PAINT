class SepiaFilter extends Filtro {
    apply(data) {
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            data[i] = this.clamp((r * 0.393) + (g * 0.769) + (b * 0.189));
            data[i + 1] = this.clamp((r * 0.349) + (g * 0.686) + (b * 0.168));
            data[i + 2] = this.clamp((r * 0.272) + (g * 0.534) + (b * 0.131));
        }
    }
}