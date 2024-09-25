class Triangulo extends Figura {
    constructor(x, y, sideLength, color=blue) {
        super(x, y, color);
        this.sideLength = sideLength; // Longitud de un lado del triángulo equilátero
        this.points = this.calculateVertices(x, y, sideLength);
    }

    calculateVertices(x, y, sideLength) {
        const height = (Math.sqrt(3) / 2) * sideLength; // Altura del triángulo equilátero
        return [
            { x: x, y: y }, // Vértice superior
            { x: x - sideLength / 2, y: y + height }, // Vértice inferior izquierdo
            { x: x + sideLength / 2, y: y + height }  // Vértice inferior derecho
        ];
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y); // Vértice superior
        ctx.lineTo(this.points[1].x, this.points[1].y); // Vértice inferior izquierdo
        ctx.lineTo(this.points[2].x, this.points[2].y); // Vértice inferior derecho
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}