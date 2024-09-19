class BrokenMirrorFilter extends Filtro {
    constructor() {
        super();
        this.displacement = 15; // Controla el desplazamiento de los fragmentos
    }

    apply(data) {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Guardar la imagen original
        const originalImage = ctx.getImageData(0, 0, width, height);

        // Generar un diseño fijo de fragmentos
        const fragments = this.generateFixedFragments(width, height);

        // Crear un canvas temporal para aplicar el efecto de espejo roto
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');

        // Dibujar la imagen original en el canvas temporal
        tempCtx.putImageData(originalImage, 0, 0);

        // Aplicar el efecto de espejo roto
        this.applyBrokenEffect(fragments, tempCtx, width, height);

        // Volcar el contenido del canvas temporal al canvas original
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(tempCanvas, 0, 0);

        // Dibujar las grietas entre los fragmentos desplazados con líneas de grosor irregular
        this.drawCracks(fragments, ctx);
    }

    // Generar un diseño fijo de fragmentos irregulares
    generateFixedFragments(width, height) {
        return [
            [{x: 0, y: 0}, {x: width * 0.4, y: 0}, {x: width * 0.2, y: height * 0.3}],
            [{x: width * 0.4, y: 0}, {x: width * 0.6, y: height * 0.1}, {x: width * 0.4, y: height * 0.4}],
            [{x: width * 0.6, y: height * 0.1}, {x: width, y: 0}, {x: width * 0.8, y: height * 0.3}],
            [{x: 0, y: height * 0.3}, {x: width * 0.2, y: height * 0.3}, {x: width * 0.1, y: height * 0.6}],
            [{x: width * 0.2, y: height * 0.3}, {x: width * 0.4, y: height * 0.4}, {x: width * 0.3, y: height * 0.7}],
            [{x: width * 0.4, y: height * 0.4}, {x: width * 0.6, y: height * 0.6}, {x: width * 0.4, y: height * 0.8}],
            [{x: 0, y: height * 0.6}, {x: width * 0.1, y: height * 0.6}, {x: 0, y: height}],
            [{x: width * 0.1, y: height * 0.6}, {x: width * 0.3, y: height * 0.7}, {x: width * 0.2, y: height}],
            [{x: width * 0.3, y: height * 0.7}, {x: width * 0.4, y: height * 0.8}, {x: width * 0.3, y: height}],
            [{x: width * 0.6, y: height * 0.6}, {x: width, y: height * 0.7}, {x: width * 0.8, y: height * 0.9}],
            [{x: width * 0.4, y: height * 0.8}, {x: width * 0.8, y: height * 0.9}, {x: width * 0.4, y: height}]
        ];
    }

    // Aplica el desplazamiento a los fragmentos de la imagen
    applyBrokenEffect(fragments, tempCtx, width, height) {
        fragments.forEach(fragment => {
            tempCtx.save();
            tempCtx.beginPath();
            tempCtx.moveTo(fragment[0].x, fragment[0].y);
            fragment.forEach(point => tempCtx.lineTo(point.x, point.y));
            tempCtx.closePath();
            tempCtx.clip();

            const offsetX = Math.random() * this.displacement - this.displacement / 2;
            const offsetY = Math.random() * this.displacement - this.displacement / 2;

            const fragmentImage = this.getFragmentImage(tempCtx, fragment, width, height);

            const fragmentCanvas = document.createElement('canvas');
            fragmentCanvas.width = width;
            fragmentCanvas.height = height;
            const fragmentCtx = fragmentCanvas.getContext('2d');

            fragmentCtx.putImageData(fragmentImage, 0, 0);

            tempCtx.drawImage(fragmentCanvas, offsetX, offsetY);

            tempCtx.restore();
        });
    }

    getFragmentImage(tempCtx, fragment, width, height) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx2 = tempCanvas.getContext('2d');

        tempCtx2.drawImage(tempCtx.canvas, 0, 0);

        tempCtx2.save();
        tempCtx2.beginPath();
        tempCtx2.moveTo(fragment[0].x, fragment[0].y);
        fragment.forEach(point => tempCtx2.lineTo(point.x, point.y));
        tempCtx2.closePath();
        tempCtx2.clip();

        const fragmentImage = tempCtx2.getImageData(0, 0, width, height);
        tempCtx2.restore();

        return fragmentImage;
    }

    // Dibujar las grietas con líneas de grosor variable
    drawCracks(fragments, ctx) {
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';

        fragments.forEach(fragment => {
            fragment.forEach((point, index) => {
                if (index < fragment.length - 1) {
                    // Dibujar una línea con grosor variable
                    this.drawVariableWidthLine(ctx, fragment[index], fragment[index + 1]);
                }
            });
        });

        ctx.restore();
    }

    // Dibujar una línea con grosor variable de principio a fin
    drawVariableWidthLine(ctx, startPoint, endPoint) {
        const steps = 20; // Número de pasos para interpolar el grosor
        const dx = (endPoint.x - startPoint.x) / steps;
        const dy = (endPoint.y - startPoint.y) / steps;

        let currentX = startPoint.x;
        let currentY = startPoint.y;

        for (let i = 0; i < steps; i++) {
            const nextX = currentX + dx;
            const nextY = currentY + dy;
            const lineWidth = Math.random() * 3 + 1; // Grosor variable en cada paso

            
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(currentX, currentY);
            ctx.lineTo(nextX, nextY);
            ctx.stroke();

            currentX = nextX;
            currentY = nextY;
        }
    }
}
