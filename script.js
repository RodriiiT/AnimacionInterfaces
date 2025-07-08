document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tangramCanvas');
    const ctx = canvas.getContext('2d');

    // Tamaño de diseño base para escalar las figuras
    const DESIGN_WIDTH = 600;
    const DESIGN_HEIGHT = 400;

    // --- Definición del estado de las piezas del Tangram ---
    // Cada pieza tiene un estado inicial (ensamblada) y final (desarmada).
    // Añadimos 'initialZ' y 'endZ' para la posición en profundidad
    // Y 'depthThickness' para el grosor visual de la figura
    // Y 'depthDirection' para controlar la dirección de la extrusión
    const pieces = [
        {
            type: 'triangle',
            color: '#FF7F50', // 1. Naranja (pequeño)
            legLength: 45,
            startX: 202, startY: 243, startRotation: 0, initialZ: 0,
            endX: 50, endY: 250, endRotation: -45, endZ: 50, // Se mueve hacia adelante
            depthThickness: 10, // Grosor de la pieza
            depthDirection: 'forward' // Dirección por defecto
        },
        {
            type: 'rect',
            color: '#00B050', // 2. Verde (cuadrado)
            width: 45, height: 45,
            startX: 376, startY: 70, startRotation: 45, initialZ: 0,
            endX: 500, endY: 80, endRotation: 0, endZ: 30,
            depthThickness: 10,
            depthDirection: 'forward'
        },
        {
            type: 'triangle',
            color: '#008080', // 3. Teal (pequeño)
            legLength: 45,
            startX: 382, startY: 108, startRotation: 90, initialZ: 0,
            endX: 550, endY: 150, endRotation: 135, endZ: 40,
            depthThickness: 10,
            depthDirection: 'forward'
        },
        {
            type: 'triangle',
            color: '#FF00FF', // 4. Fucsia (grande)
            legLength: 90,
            startX: 292, startY: 154, startRotation: 0, initialZ: 0,
            endX: 100, endY: 100, endRotation: 20, endZ: 60,
            depthThickness: 10,
            depthDirection: 'forward'
        },
        {
            type: 'triangle',
            color: '#000080', // 5. Azul (grande)
            legLength: 90,
            startX: 292, startY: 243, startRotation: 180, initialZ: 0,
            endX: 580, endY: 300, endRotation: 220, endZ: 70,
            depthThickness: 10,
            depthDirection: 'right' // Profundidad hacia la derecha
        },
        {
            type: 'parallelogram',
            color: '#FFDB58', // 6. Amarillo (paralelogramo)
            baseWidth: 48, height: 45, skewOffset: 45,
            startX: 248, startY: 266, startRotation: 180, initialZ: 0,
            endX: 80, endY: 350, endRotation: 135, endZ: 55,
            depthThickness: 10,
            depthDirection: 'right' // Profundidad hacia la derecha
        },
        {
            type: 'triangle',
            color: '#800080', // 7. Morado (mediano)
            legLength: 65,
            startX: 337, startY: 108, startRotation: 45, initialZ: 0,
            endX: 300, endY: 500, endRotation: 90, endZ: 45,
            depthThickness: 10,
            depthDirection: 'forward'
        }
    ];

    // --- Helper para obtener un color más oscuro (para la profundidad) ---
    function darkenColor(hex, percent) {
        let f = parseInt(hex.slice(1), 16),
            t = percent < 0 ? 0 : 255,
            p = percent < 0 ? percent * -1 : percent,
            R = f >> 16,
            G = (f >> 8) & 0x00FF,
            B = f & 0x0000FF;
        return "#" + (
            0x1000000 +
            (Math.round((t - R) * p) + R) * 0x10000 +
            (Math.round((t - G) * p) + G) * 0x100 +
            (Math.round((t - B) * p) + B)
        ).toString(16).slice(1);
    }

    // --- Funciones de dibujo (modificadas para la extrusión y dirección) ---

    // drawTriangle con profundidad y dirección
    function drawTriangle(color, x, y, z, legWidth, legHeight, rotation, thickness, depthDirection = 'forward') {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);

        const darkColor = darkenColor(color, 0.2);
        let offsetX = 0;
        let offsetY = 0;

        // Determinar el offset de la extrusión basado en depthDirection
        if (depthDirection === 'right') {
            offsetX = thickness;
            offsetY = 0; // No hay desplazamiento vertical para extrusión puramente a la derecha
        } else if (depthDirection === 'left') {
            offsetX = -thickness;
            offsetY = 0;
        } else if (depthDirection === 'forward') { // Default: abajo-derecha
            offsetX = thickness * 0.5;
            offsetY = thickness * 0.5;
        } else if (depthDirection === 'backward') { // Arriba-izquierda
            offsetX = -thickness * 0.5;
            offsetY = -thickness * 0.5;
        }

        // --- Dibujar caras laterales de la extrusión ---
        ctx.fillStyle = darkColor;

        // Cara que conecta el lado horizontal (base del triángulo)
        ctx.beginPath();
        ctx.moveTo(0, 0); // Vértice frontal 1
        ctx.lineTo(offsetX, offsetY); // Vértice trasero 1
        ctx.lineTo(legWidth + offsetX, offsetY); // Vértice trasero 2
        ctx.lineTo(legWidth, 0); // Vértice frontal 2
        ctx.closePath();
        ctx.fill();

        // Cara que conecta el lado vertical (altura del triángulo)
        ctx.beginPath();
        ctx.moveTo(0, 0); // Vértice frontal 1
        ctx.lineTo(offsetX, offsetY); // Vértice trasero 1
        ctx.lineTo(offsetX, legHeight + offsetY); // Vértice trasero 3
        ctx.lineTo(0, legHeight); // Vértice frontal 3
        ctx.closePath();
        ctx.fill();

        // Cara que conecta la hipotenusa (la "base" inclinada del prisma)
        ctx.beginPath();
        ctx.moveTo(legWidth, 0); // Vértice frontal 2
        ctx.lineTo(legWidth + offsetX, offsetY); // Vértice trasero 2
        ctx.lineTo(offsetX, legHeight + offsetY); // Vértice trasero 3
        ctx.lineTo(0, legHeight); // Vértice frontal 3
        ctx.closePath();
        ctx.fill();

        // --- Dibujar la cara principal (frontal) ---
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(legWidth, 0);
        ctx.lineTo(0, legHeight);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    // drawRect con profundidad y dirección
    function drawRect(color, x, y, z, width, height, rotation, thickness, depthDirection = 'forward') {
        ctx.save();
        ctx.translate(x + width / 2, y + height / 2);
        ctx.rotate(rotation * Math.PI / 180);

        const darkColor = darkenColor(color, 0.2);
        let offsetX = 0;
        let offsetY = 0;

        if (depthDirection === 'right') {
            offsetX = thickness;
            offsetY = 0;
        } else if (depthDirection === 'left') {
            offsetX = -thickness;
            offsetY = 0;
        } else if (depthDirection === 'forward') {
            offsetX = thickness * 0.5;
            offsetY = thickness * 0.5;
        } else if (depthDirection === 'backward') {
            offsetX = -thickness * 0.5;
            offsetY = -thickness * 0.5;
        }

        const halfW = width / 2;
        const halfH = height / 2;

        // Vértices de la cara frontal (relativos al centro 0,0)
        const v1x = -halfW, v1y = -halfH; // Top-left
        const v2x = halfW, v2y = -halfH; // Top-right
        const v3x = halfW, v3y = halfH;   // Bottom-right
        const v4x = -halfW, v4y = halfH;  // Bottom-left

        // --- Dibujar caras laterales de la extrusión ---
        ctx.fillStyle = darkColor;

        // Cara superior
        ctx.beginPath();
        ctx.moveTo(v1x, v1y); // Front top-left
        ctx.lineTo(v1x + offsetX, v1y + offsetY); // Back top-left
        ctx.lineTo(v2x + offsetX, v2y + offsetY); // Back top-right
        ctx.lineTo(v2x, v2y); // Front top-right
        ctx.closePath();
        ctx.fill();

        // Cara derecha
        ctx.beginPath();
        ctx.moveTo(v2x, v2y); // Front top-right
        ctx.lineTo(v2x + offsetX, v2y + offsetY); // Back top-right
        ctx.lineTo(v3x + offsetX, v3y + offsetY); // Back bottom-right
        ctx.lineTo(v3x, v3y); // Front bottom-right
        ctx.closePath();
        ctx.fill();

        // Cara inferior
        ctx.beginPath();
        ctx.moveTo(v3x, v3y); // Front bottom-right
        ctx.lineTo(v3x + offsetX, v3y + offsetY); // Back bottom-right
        ctx.lineTo(v4x + offsetX, v4y + offsetY); // Back bottom-left
        ctx.lineTo(v4x, v4y); // Front bottom-left
        ctx.closePath();
        ctx.fill();

        // Cara izquierda
        ctx.beginPath();
        ctx.moveTo(v4x, v4y); // Front bottom-left
        ctx.lineTo(v4x + offsetX, v4y + offsetY); // Back bottom-left
        ctx.lineTo(v1x + offsetX, v1y + offsetY); // Back top-left
        ctx.lineTo(v1x, v1y); // Front top-left
        ctx.closePath();
        ctx.fill();

        // --- Dibujar la cara principal (frontal) ---
        ctx.fillStyle = color;
        ctx.fillRect(-halfW, -halfH, width, height);

        ctx.restore();
    }

    // drawParallelogram con profundidad y dirección
    function drawParallelogram(color, x, y, z, baseWidth, height, skewOffset, rotation, thickness, depthDirection = 'forward') {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);

        const darkColor = darkenColor(color, 0.2);
        let offsetX = 0;
        let offsetY = 0;

        if (depthDirection === 'right') {
            offsetX = thickness;
            offsetY = 0;
        } else if (depthDirection === 'left') {
            offsetX = -thickness;
            offsetY = 0;
        } else if (depthDirection === 'forward') {
            offsetX = thickness * 0.5;
            offsetY = thickness * 0.5;
        } else if (depthDirection === 'backward') {
            offsetX = -thickness * 0.5;
            offsetY = -thickness * 0.5;
        }

        // Coordenadas relativas de la cara frontal (sin el offset del centro aún)
        const p1x = 0, p1y = 0;
        const p2x = baseWidth, p2y = 0;
        const p3x = baseWidth - skewOffset, p3y = height;
        const p4x = -skewOffset, p4y = height;

        // Cálculo del centro local para la rotación (no cambia)
        const minLocalX = Math.min(p1x, p2x, p3x, p4x);
        const maxLocalX = Math.max(p1x, p2x, p3x, p4x);
        const minLocalY = Math.min(p1y, p2y, p3y, p4y);
        const maxLocalY = Math.max(p1y, p2y, p3y, p4y);
        const centerLocalX = (minLocalX + maxLocalX) / 2;
        const centerLocalY = (minLocalY + maxLocalY) / 2;

        // Ajustar los puntos para que el centro sea (0,0) local
        const v1x = p1x - centerLocalX, v1y = p1y - centerLocalY;
        const v2x = p2x - centerLocalX, v2y = p2y - centerLocalY;
        const v3x = p3x - centerLocalX, v3y = p3y - centerLocalY;
        const v4x = p4x - centerLocalX, v4y = p4y - centerLocalY;

        // --- Dibujar caras laterales de la extrusión ---
        ctx.fillStyle = darkColor;

        // Cara superior (v1-v2)
        ctx.beginPath();
        ctx.moveTo(v1x, v1y);
        ctx.lineTo(v1x + offsetX, v1y + offsetY); // Punto trasero de v1
        ctx.lineTo(v2x + offsetX, v2y + offsetY); // Punto trasero de v2
        ctx.lineTo(v2x, v2y);
        ctx.closePath();
        ctx.fill();

        // Cara derecha (v2-v3)
        ctx.beginPath();
        ctx.moveTo(v2x, v2y);
        ctx.lineTo(v2x + offsetX, v2y + offsetY);
        ctx.lineTo(v3x + offsetX, v3y + offsetY);
        ctx.lineTo(v3x, v3y);
        ctx.closePath();
        ctx.fill();

        // Cara inferior (v3-v4)
        ctx.beginPath();
        ctx.moveTo(v3x, v3y);
        ctx.lineTo(v3x + offsetX, v3y + offsetY);
        ctx.lineTo(v4x + offsetX, v4y + offsetY);
        ctx.lineTo(v4x, v4y);
        ctx.closePath();
        ctx.fill();

        // Cara izquierda (v4-v1)
        ctx.beginPath();
        ctx.moveTo(v4x, v4y);
        ctx.lineTo(v4x + offsetX, v4y + offsetY);
        ctx.lineTo(v1x + offsetX, v1y + offsetY);
        ctx.lineTo(v1x, v1y);
        ctx.closePath();
        ctx.fill();

        // --- Dibujar la cara principal (frontal) ---
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(v1x, v1y);
        ctx.lineTo(v2x, v2y);
        ctx.lineTo(v3x, v3y);
        ctx.lineTo(v4x, v4y);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    // --- Lógica de Animación ---
    let animationStartTime = 0;
    let animationFrameId;

    const INITIAL_PAUSE_DURATION = 1000; // 1 segundo de pausa inicial con la figura ensamblada
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

        const elapsedTime = (timestamp - animationStartTime) % CYCLE_DURATION;

        let progress;

        if (elapsedTime < INITIAL_PAUSE_DURATION) {
            progress = 0;
        } else if (elapsedTime < INITIAL_PAUSE_DURATION + DISASSEMBLE_DURATION) {
            const currentPhaseProgress = (elapsedTime - INITIAL_PAUSE_DURATION) / DISASSEMBLE_DURATION;
            progress = easeInOutCubic(currentPhaseProgress);
        } else {
            const currentPhaseProgress = (elapsedTime - (INITIAL_PAUSE_DURATION + DISASSEMBLE_DURATION)) / REASSEMBLE_DURATION;
            progress = easeInOutCubic(1 - currentPhaseProgress);
        }

        drawScene(progress);

        animationFrameId = requestAnimationFrame(animate);
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
            const currentZ = lerp(p.initialZ, p.endZ, progress);

            switch (p.type) {
                case 'triangle':
                    drawTriangle(p.color, currentX, currentY, currentZ, p.legLength, p.legLength, currentRotation, p.depthThickness, p.depthDirection);
                    break;
                case 'rect':
                    drawRect(p.color, currentX, currentY, currentZ, p.width, p.height, currentRotation, p.depthThickness, p.depthDirection);
                    break;
                case 'parallelogram':
                    drawParallelogram(p.color, currentX, currentY, currentZ, p.baseWidth, p.height, p.skewOffset, currentRotation, p.depthThickness, p.depthDirection);
                    break;
            }
        });
        ctx.restore();
    }

    // --- Controlador de inicio y redimensionamiento ---
    function startAnimationCycle() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        animationStartTime = 0;
        animationFrameId = requestAnimationFrame(animate);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        startAnimationCycle();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
});