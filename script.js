document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tangramCanvas');
    const ctx = canvas.getContext('2d');

    // Tamaño de diseño base para escalar las figuras
    const DESIGN_WIDTH = 600;
    const DESIGN_HEIGHT = 400;

    // --- Definición del estado de las piezas del Tangram ---
    // Cada pieza tiene un estado inicial (ensamblada) y final (desarmada).
    const pieces = [
        {
            type: 'triangle',
            color: '#FF7F50', // 1. Naranja (pequeño)
            legLength: 45,
            startX: 202, startY: 243, startRotation: 0,
            endX: 50, endY: 250, endRotation: -45 // Ajusta endX/Y para que no salga completamente
        },
        {
            type: 'rect',
            color: '#00B050', // 2. Verde (cuadrado)
            width: 45, height: 45,
            startX: 376, startY: 70, startRotation: 45,
            endX: 500, endY: 80, endRotation: 0
        },
        {
            type: 'triangle',
            color: '#008080', // 3. Teal (pequeño)
            legLength: 45,
            startX: 382, startY: 108, startRotation: 90,
            endX: 550, endY: 150, endRotation: 135
        },
        {
            type: 'triangle',
            color: '#FF00FF', // 4. Fucsia (grande)
            legLength: 90,
            startX: 292, startY: 154, startRotation: 0,
            endX: 100, endY: 100, endRotation: 20
        },
        {
            type: 'triangle',
            color: '#000080', // 5. Azul (grande)
            legLength: 90,
            startX: 292, startY: 243, startRotation: 180,
            endX: 580, endY: 300, endRotation: 220
        },
        {
            type: 'parallelogram',
            color: '#FFDB58', // 6. Amarillo (paralelogramo)
            baseWidth: 48, height: 45, skewOffset: 45,
            startX: 248, startY: 266, startRotation: 180,
            endX: 80, endY: 350, endRotation: 135
        },
        {
            type: 'triangle',
            color: '#800080', // 7. Morado (mediano)
            legLength: 65,
            startX: 337, startY: 108, startRotation: 45,
            endX: 300, endY: 500, endRotation: 90
        }
    ];

    // --- Funciones de dibujo (sin cambios) ---
    // Añado legHeight a drawTriangle para ser consistente con el uso posterior
    function drawTriangle(color, x, y, legWidth, legHeight, rotation = 0) {
        ctx.save(); ctx.fillStyle = color; ctx.translate(x, y); ctx.rotate(rotation * Math.PI / 180);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(legWidth, 0); ctx.lineTo(0, legHeight);
        ctx.closePath(); ctx.fill(); ctx.restore();
    }
    function drawRect(color, x, y, width, height, rotation = 0) {
        ctx.save(); ctx.fillStyle = color; ctx.translate(x + width / 2, y + height / 2);
        ctx.rotate(rotation * Math.PI / 180); ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.restore();
    }
    function drawParallelogram(color, x, y, baseWidth, height, skewOffset, rotation = 0) {
        ctx.save(); ctx.fillStyle = color;
        const p1x = 0, p1y = 0; const p2x = baseWidth, p2y = 0;
        const p3x = baseWidth - skewOffset, p3y = height; const p4x = -skewOffset, p4y = height;
        
        // Ajuste del cálculo del centro local para mayor precisión
        const minLocalX = Math.min(p1x, p2x, p3x, p4x);
        const maxLocalX = Math.max(p1x, p2x, p3x, p4x);
        const minLocalY = Math.min(p1y, p2y, p3y, p4y);
        const maxLocalY = Math.max(p1y, p2y, p3y, p4y);
        
        const centerLocalX = (minLocalX + maxLocalX) / 2;
        const centerLocalY = (minLocalY + maxLocalY) / 2;

        ctx.translate(x, y); ctx.rotate(rotation * Math.PI / 180);
        ctx.beginPath(); ctx.moveTo(p1x - centerLocalX, p1y - centerLocalY); ctx.lineTo(p2x - centerLocalX, p2y - centerLocalY);
        ctx.lineTo(p3x - centerLocalX, p3y - centerLocalY); ctx.lineTo(p4x - centerLocalX, p4y - centerLocalY);
        ctx.closePath(); ctx.fill(); ctx.restore();
    }

    // --- Lógica de Animación ---
    let animationStartTime = 0;
    let animationFrameId;

    const INITIAL_PAUSE_DURATION = 1000; // 1 segundos de pausa inicial con la figura ensamblada
    const DISASSEMBLE_DURATION = 2000; // 2 segundos para desarmar
    const REASSEMBLE_DURATION = 2000; // 2 segundos para rearmar

    const CYCLE_DURATION = INITIAL_PAUSE_DURATION + DISASSEMBLE_DURATION + REASSEMBLE_DURATION;

    function lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    // Easing function (ease-in-out cubic) para un movimiento más suave
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animate(timestamp) {
        if (!animationStartTime) {
            animationStartTime = timestamp;
        }

        // Calcula el tiempo transcurrido dentro del ciclo actual usando el operador módulo (%)
        const elapsedTime = (timestamp - animationStartTime) % CYCLE_DURATION;

        let progress; // 0 para ensamblado, 1 para desarmado

        // Fase 1: Pausa inicial (Figura ensamblada)
        if (elapsedTime < INITIAL_PAUSE_DURATION) {
            progress = 0; // Se mantiene en el estado inicial (ensamblado)
        }
        // Fase 2: Desarmar (movimiento de startX/Y a endX/Y)
        else if (elapsedTime < INITIAL_PAUSE_DURATION + DISASSEMBLE_DURATION) {
            const currentPhaseProgress = (elapsedTime - INITIAL_PAUSE_DURATION) / DISASSEMBLE_DURATION;
            progress = easeInOutCubic(currentPhaseProgress); // Progreso de 0 a 1
        }
        // Fase 3: Rearmar (movimiento de endX/Y de vuelta a startX/Y)
        else {
            const currentPhaseProgress = (elapsedTime - (INITIAL_PAUSE_DURATION + DISASSEMBLE_DURATION)) / REASSEMBLE_DURATION;
            progress = easeInOutCubic(1 - currentPhaseProgress); // Progreso de 1 a 0
        }
        
        drawScene(progress);

        animationFrameId = requestAnimationFrame(animate); // Continúa el ciclo indefinidamente
    }

    // --- Función principal de dibujo ---
    function drawScene(progress = 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const scale = Math.min(canvas.width / DESIGN_WIDTH, canvas.height / DESIGN_HEIGHT);
        const offsetX = (canvas.width - DESIGN_WIDTH * scale) / 2;
        const offsetY = (canvas.height - DESIGN_HEIGHT * scale) / 2;

        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);

        pieces.forEach(p => {
            const currentX = lerp(p.startX, p.endX, progress);
            const currentY = lerp(p.startY, p.endY, progress);
            const currentRotation = lerp(p.startRotation, p.endRotation, progress);

            switch (p.type) {
                case 'triangle':
                    // Asegúrate de pasar legWidth y legHeight si drawTriangle lo espera
                    drawTriangle(p.color, currentX, currentY, p.legLength, p.legLength, currentRotation);
                    break;
                case 'rect':
                    drawRect(p.color, currentX, currentY, p.width, p.height, currentRotation);
                    break;
                case 'parallelogram':
                    drawParallelogram(p.color, currentX, currentY, p.baseWidth, p.height, p.skewOffset, currentRotation);
                    break;
            }
        });
        ctx.restore();
    }

    // --- Controlador de inicio y redimensionamiento ---
    function startAnimationCycle() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId); // Cancela cualquier animación previa
        }
        animationStartTime = 0; // Reinicia el tiempo de inicio de la animación para el nuevo ciclo
        animationFrameId = requestAnimationFrame(animate); // Inicia un nuevo ciclo de animación
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Al redimensionar, reiniciamos la animación para que se adapte al nuevo tamaño
        startAnimationCycle();
    }

    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Llama esto una vez para iniciar el dibujo y la animación al cargar la página
});