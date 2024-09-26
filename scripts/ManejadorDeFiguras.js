class ManejadorDeFiguras {
    constructor(canvas, ctx, imageHandler) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.imageHandler = imageHandler;
        this.activeTool = null;
        this.shapes = [];  // Array para almacenar las figuras
        this.scaleFactor = 1; // Factor de escala predeterminado
        this.isDrawing = false; // Bandera para saber si estamos dibujando
        this.currentShape = null; // Figura que se está dibujando actualmente
        this.savedCanvasData = null; // Para almacenar el estado del canvas antes de dibujar
    }

    onMouseDown(e) {
        const pos = this.getMousePos(e);
        // Guardar el estado actual del canvas antes de empezar a dibujar una figura
        this.savedCanvasData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        switch (this.activeTool) {
            case 'rectangle':
                this.isDrawing = true;
                this.currentShape = new Rectangulo(pos.x, pos.y, 0, 0, 'blue'); // Crear un rectángulo inicial
                this.shapes.push(this.currentShape);
                break;
            case 'circle':
                this.isDrawing = true;
                this.currentShape = new Circulo(pos.x, pos.y, 0, 'blue');
                this.shapes.push(this.currentShape);
                break;
            case 'triangle':
                this.isDrawing = true;
                this.currentShape = new Triangulo(pos.x, pos.y, 0, 'blue');
                this.shapes.push(this.currentShape);
                break;
        }
    }

    onMouseMove(e) {
        if (!this.isDrawing) return;
    
        const pos = this.getMousePos(e);
        if (this.currentShape) {
            // Actualizar las dimensiones de la figura según la herramienta activa
            switch (this.activeTool) {
                case 'rectangle':
                    let newWidth = pos.x - this.currentShape.x;
                    let newHeight = pos.y - this.currentShape.y;
                    if (newWidth < 0) {
                        this.currentShape.x = pos.x;
                        newWidth = Math.abs(newWidth);
                    }
                    if (newHeight < 0) {
                        this.currentShape.y = pos.y;
                        newHeight = Math.abs(newHeight);
                    }
                    this.currentShape.width = newWidth;
                    this.currentShape.height = newHeight;
                    break;
    
                case 'circle':
                    const radius = Math.sqrt(Math.pow(pos.x - this.currentShape.originalX, 2) + Math.pow(pos.y - this.currentShape.originalY, 2));
                    this.currentShape.radius = radius;
                    break;
    
                case 'triangle':
                    const sideLength = Math.sqrt(Math.pow(pos.x - this.currentShape.x, 2) + Math.pow(pos.y - this.currentShape.y, 2));
                    this.currentShape.sideLength = sideLength;
                    this.currentShape.points = this.currentShape.calculateVertices(this.currentShape.x, this.currentShape.y, sideLength);
                    break;
            }
    
            // Restaurar el canvas al estado guardado antes de dibujar la nueva figura
            this.ctx.putImageData(this.savedCanvasData, 0, 0);
    
            // Dibujar solo la figura actual
            this.drawShape(this.currentShape);
        }
    }
    

    onMouseUp() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.currentShape = null; // Finalizamos el dibujo
        }
    }

    // Método para redibujar el canvas con todas las figuras y trazos previos
    redrawShapes() {
        if (this.savedCanvasData) {
            // Restaurar el estado del canvas antes de dibujar la nueva figura
            this.ctx.putImageData(this.savedCanvasData, 0, 0);
        }

        // Ahora redibuja todas las figuras almacenadas
        this.shapes.forEach((shape) => {
            this.drawShape(shape);
            if (shape instanceof Triangulo) {
                shape.draw(this.ctx); //llamar al método draw del triángulo
            } 
        });
    }

    drawShape(shape) {
        this.ctx.save();  // Guardar el estado actual del contexto
    
        this.ctx.beginPath();
    
        if (shape instanceof Rectangulo) {
            this.ctx.rect(shape.x, shape.y, shape.width, shape.height);
            this.ctx.fillStyle = shape.color;  // Usar el color de la figura
            this.ctx.fill();
        } else if (shape instanceof Circulo) {
            this.ctx.arc(shape.originalX, shape.originalY, shape.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = shape.color;
            this.ctx.fill();
        } else if (shape instanceof Triangulo) {
            this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
            this.ctx.lineTo(shape.points[1].x, shape.points[1].y);
            this.ctx.lineTo(shape.points[2].x, shape.points[2].y);
            this.ctx.closePath();
            this.ctx.fillStyle = shape.color;
            this.ctx.fill();
        }
    
        this.ctx.restore();  // Restaurar el estado del contexto
    }
    

    // Obtener las coordenadas correctas del mouse respecto al lienzo
    getMousePos(e) {
        let rect = this.canvas.getBoundingClientRect();
        let x = (e.clientX - rect.left) / this.scaleFactor;
        let y = (e.clientY - rect.top) / this.scaleFactor;
        return { x, y };
    }

    clearShapes() {
        this.shapes = []; // Limpiar el array de figuras
        this.redrawShapes(); // Redibujar el canvas vacío
    }
}