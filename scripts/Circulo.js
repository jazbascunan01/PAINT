class Circulo extends Figura {
    constructor(x, y, radius, color) {
        super(x, y, color);
        this.radius = radius;
        this.originalX = x; // Guarda la posición original para calcular el radio
        this.originalY = y; // Guarda la posición original para calcular el radio
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.originalX, this.originalY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    // Este método se puede utilizar para ajustar la posición
    updatePosition(newX, newY) {
        this.radius = Math.sqrt(Math.pow(newX - this.originalX, 2) + Math.pow(newY - this.originalY, 2));
    }

    isInside(mx, my) {
        const dx = mx - this.originalX;
        const dy = my - this.originalY;
        return Math.sqrt(dx * dx + dy * dy) <= this.radius;
    }
}