class Rectangulo extends Figura {
    constructor(x, y, width, height, color, filter = 'none') {
        super(x, y, color);
        this.width = width;
        this.height = height;
        this.isResizing = false;  // Agregar estado de redimensionamiento
        this.filter = filter; // Nueva propiedad para el filtro
    }

    // Sobrescribir el método para dibujar el rectángulo
    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.closePath();
    }

    // Actualizar el tamaño del rectángulo basado en el movimiento del mouse
    resize(mx, my) {
        // Redimensionar hacia adentro si el mouse se mueve en dirección opuesta
        this.width = mx - this.x;
        this.height = my - this.y;
    }

    // Método para verificar si el mouse está dentro del rectángulo
    isInside(mx, my) {
        return mx >= this.x && mx <= this.x + this.width && my >= this.y && my <= this.y + this.height;
    }
}