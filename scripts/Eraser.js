class Eraser extends Pencil {

    constructor(ctx, x, y, size) {
        super(ctx, x, y, '#FFFFFF', size); // Hereda de Pencil pero ignora el color
        this.size = size;
    }

    erase(x, y) {
        // Borrar el área en la posición (x, y)
        this.ctx.clearRect(x - this.size / 2, y - this.size / 2, this.size, this.size);
    }
}