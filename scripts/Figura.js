class Figura {
    constructor(x, y, color, filter = 'none') {
        this.x = x;
        this.y = y;
        this.color = color;
        this.selected = false;
        this.filter = filter;  // Añadir la propiedad filter para manejar filtros
        this.resizeHandles = [];  // Para manejar redimensionamiento
    }

    draw(ctx) {
        // Se implementa en subclases (Rectángulo, Círculo, Triángulo)
    }

    // Método para verificar si el mouse está dentro de la figura
    isInside(mx, my) {
        // Lógica específica en subclases
    }

    // Mostrar los manejadores de redimensionamiento cuando está seleccionada
    drawResizeHandles(ctx) {
        // Dibujar pequeños cuadros en las esquinas para redimensionar
    }

    // Métodos para mover la figura
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    // Métodos para redimensionar la figura
    resize(handleIndex, dx, dy) {
        // Implementación para cambiar tamaño según la esquina o lado arrastrado
    }
    applyFilter(ctx) {
        // Aplicar el filtro almacenado a esta figura
        ctx.filter = this.filter || 'none';
    }
    resetFilter(ctx) {
        // Restablecer el filtro al valor predeterminado
        ctx.filter = 'none';
    }
}