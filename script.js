document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("tangramCanvas")
  const ctx = canvas.getContext("2d")

  // Tamaño de diseño base para escalar las figuras
  const DESIGN_WIDTH = 600
  const DESIGN_HEIGHT = 400

  // --- Definición del estado de las piezas del Tangram ---
  // Cada pieza tiene un estado inicial (ensamblada) y final (desarmada).
  // Añadimos 'initialZ' y 'endZ' para la posición en profundidad
  // Y 'depthThickness' para el grosor visual de la figura
  // Y 'depthDirection' para controlar la dirección de la extrusión
  const pieces = [
    {
      type: "triangle",
      color: "#000080", // 5. Azul (grande)
      legLength: 90,
      startX: 292,
      startY: 243,
      startRotation: 180,
      initialZ: 0,
      // Azul: hacia la izquierda (disminuir endX)
      endX: 50,
      endY: 243,
      endRotation: 220,
      endZ: 70,
      // ⭐ ACTIVADO: Grosor 3D para el triángulo azul grande
      depthThickness: 16,
      depthDirection: "backward",
    },
    {
      type: "triangle",
      color: "#FF7F50", // 1. Naranja (pequeño)
      legLength: 45,
      startX: 202,
      startY: 242.5,
      startRotation: 0,
      initialZ: 0,
      // Naranja: Diagonal hacia la izquierda y abajo
      endX: 50,
      endY: 300,
      endRotation: -45,
      endZ: 50,
      // ⭐ ACTIVADO: Grosor 3D para el triángulo naranja
      depthThickness: 12, // Grosor de la pieza
      depthDirection: "right", // Mantener la profundidad si no se especifica un cambio
    },
    {
      type: "rect",
      color: "#00B050", // 2. Verde (cuadrado)
      width: 45,
      height: 45,
      startX: 397,
      startY: 58,
      startRotation: 90,
      initialZ: 0,
      // Verde: hacia arriba (disminuir endY)
      endX: 382,
      endY: 10,
      endRotation: 0,
      endZ: 30,
      // ⭐ ACTIVADO: Grosor 3D para el cuadrado verde
      depthThickness: 15,
      depthDirection: "backward",
    },
    {
      type: "triangle",
      color: "#008080", // 3. Teal (pequeño)
      legLength: 55,
      startX: 392,
      startY: 108,
      startRotation: 90,
      initialZ: 0,
      // Teal: hacia la derecha (aumentar endX)
      endX: 550,
      endY: 108,
      endRotation: 135,
      endZ: 40,
      // ⭐ ACTIVADO: Grosor 3D para el triángulo teal
      depthThickness: 10,
      depthDirection: "backward",
    },
    {
      type: "parallelogram",
      color: "#FFDB58", // 6. Amarillo (paralelogramo)
      baseWidth: 50,
      height: 45,
      skewOffset: 45,
      startX: 250,
      startY: 265,
      startRotation: 180,
      initialZ: 0,
      // Paralelogramo: hacia abajo (aumentar endY)
      endX: 248,
      endY: 350,
      endRotation: 135,
      endZ: 55,
      // ⭐ ACTIVADO: Grosor 3D para el paralelogramo amarillo
      depthThickness: 14,
      depthDirection: "backward",
    },
    {
      type: "triangle",
      color: "#800080", // 7. Morado (mediano)
      legLength: 65,
      startX: 337,
      startY: 108,
      startRotation: 45,
      initialZ: 0,
      // Morado: hacia arriba (disminuir endY)
      endX: 337,
      endY: 10,
      endRotation: 90,
      endZ: 45,
      // ⭐ ACTIVADO: Grosor 3D para el triángulo morado mediano
      depthThickness: 13,
      depthDirection: "right",
    },
    {
      type: "triangle",
      color: "#FF00FF", // 4. Fucsia (grande)
      legLength: 90,
      startX: 293,
      startY: 154,
      startRotation: 0,
      initialZ: 0,
      // Fucsia: hacia la derecha (aumentar endX)
      endX: 500,
      endY: 154,
      endRotation: 20,
      endZ: 60,
      // ⭐ ACTIVADO: Grosor 3D para el triángulo fucsia grande
      depthThickness: 18,
      depthDirection: "forward",
    },
  ]

  // --- Helper para obtener un color más oscuro (para la profundidad) ---
  function darkenColor(hex, percent) {
    const f = Number.parseInt(hex.slice(1), 16),
      t = percent < 0 ? 0 : 255,
      p = percent < 0 ? percent * -1 : percent,
      R = f >> 16,
      G = (f >> 8) & 0x00ff,
      B = f & 0x0000ff
    return (
      "#" +
      (
        0x1000000 +
        (Math.round((t - R) * p) + R) * 0x10000 +
        (Math.round((t - G) * p) + G) * 0x100 +
        (Math.round((t - B) * p) + B)
      )
        .toString(16)
        .slice(1)
    )
  }

  // --- Funciones de dibujo (modificadas para la extrusión y dirección) ---

  // drawTriangle con profundidad y dirección
  function drawTriangle(color, x, y, z, legWidth, legHeight, rotation, thickness, depthDirection = "forward") {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate((rotation * Math.PI) / 180)

    const darkColor = darkenColor(color, 0.3) // Aumenté el contraste para mejor efecto 3D
    let ox = 0 // offset x (usado para la extrusión)
    let oy = 0 // offset y (usado para la extrusión)

    // Ajustar offset según la dirección de extrusión (controla hacia dónde se ve la profundidad)
    if (depthDirection === "right") {
      ox = thickness
    } else if (depthDirection === "left") {
      ox = -thickness
    } else if (depthDirection === "up") {
      oy = -thickness
    } else if (depthDirection === "down") {
      oy = thickness
    } else if (depthDirection === "forward") {
      // Diagonal abajo-derecha (la más común para 2.5D)
      ox = thickness * 0.5
      oy = thickness * 0.5
    } else if (depthDirection === "backward") {
      // Diagonal arriba-izquierda
      ox = -thickness * 0.5
      oy = -thickness * 0.5
    }

    // Vértices de la cara frontal (relativos a 0,0, que es el punto superior izquierdo en tu base)
    const v1 = { x: 0, y: 0 } // Top vertex (or origin)
    const v2 = { x: legWidth, y: 0 } // Right vertex (along x-axis)
    const v3 = { x: 0, y: legHeight } // Bottom vertex (along y-axis)

    // Vértices de la cara trasera (desplazados)
    const v1_back = { x: v1.x + ox, y: v1.y + oy }
    const v2_back = { x: v2.x + ox, y: v2.y + oy }
    const v3_back = { x: v3.x + ox, y: v3.y + oy }

    // --- Dibujar caras laterales y trasera (ordenadas por profundidad) ---
    ctx.fillStyle = darkColor

    // Cara trasera (se dibuja primero para estar "detrás")
    ctx.beginPath()
    ctx.moveTo(v1_back.x, v1_back.y)
    ctx.lineTo(v2_back.x, v2_back.y)
    ctx.lineTo(v3_back.x, v3_back.y)
    ctx.closePath()
    ctx.fill()

    // Dibujar caras laterales condicionalmente
    // Lado 1: v1-v2 (base horizontal)
    ctx.beginPath()
    ctx.moveTo(v1.x, v1.y)
    ctx.lineTo(v2.x, v2.y)
    ctx.lineTo(v2_back.x, v2_back.y)
    ctx.lineTo(v1_back.x, v1_back.y)
    ctx.closePath()
    ctx.fill()

    // Lado 2: v2-v3 (hipotenusa)
    ctx.beginPath()
    ctx.moveTo(v2.x, v2.y)
    ctx.lineTo(v3.x, v3.y)
    ctx.lineTo(v3_back.x, v3_back.y)
    ctx.lineTo(v2_back.x, v2_back.y)
    ctx.closePath()
    ctx.fill()

    // Lado 3: v3-v1 (lado vertical)
    ctx.beginPath()
    ctx.moveTo(v3.x, v3.y)
    ctx.lineTo(v1.x, v1.y)
    ctx.lineTo(v1_back.x, v1_back.y)
    ctx.lineTo(v3_back.x, v3_back.y)
    ctx.closePath()
    ctx.fill()

    // --- Dibujar la cara principal (frontal) - Esta es la cara que se ve normalmente ---
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(v1.x, v1.y)
    ctx.lineTo(v2.x, v2.y)
    ctx.lineTo(v3.x, v3.y)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
  }

  // drawRect con profundidad y dirección
  function drawRect(color, x, y, z, width, height, rotation, thickness, depthDirection = "forward") {
    ctx.save()
    ctx.translate(x + width / 2, y + height / 2) // Rotar alrededor del centro
    ctx.rotate((rotation * Math.PI) / 180)

    const darkColor = darkenColor(color, 0.3)
    let ox = 0 // offset x (usado para la extrusión)
    let oy = 0 // offset y (usado para la extrusión)

    // Ajustar offset según la dirección de extrusión
    if (depthDirection === "right") {
      ox = thickness
    } else if (depthDirection === "left") {
      ox = -thickness
    } else if (depthDirection === "up") {
      oy = -thickness
    } else if (depthDirection === "down") {
      oy = thickness
    } else if (depthDirection === "forward") {
      // Diagonal abajo-derecha (la más común para 2.5D)
      ox = thickness * 0.5
      oy = thickness * 0.5
    } else if (depthDirection === "backward") {
      // Diagonal arriba-izquierda
      ox = -thickness * 0.5
      oy = -thickness * 0.5
    }

    const halfW = width / 2
    const halfH = height / 2

    // Vértices de la cara frontal (relativos al centro 0,0)
    const v1 = { x: -halfW, y: -halfH } // Top-left
    const v2 = { x: halfW, y: -halfH } // Top-right
    const v3 = { x: halfW, y: halfH } // Bottom-right
    const v4 = { x: -halfW, y: halfH } // Bottom-left

    // Vértices de la cara trasera (desplazados)
    const v1_back = { x: v1.x + ox, y: v1.y + oy }
    const v2_back = { x: v2.x + ox, y: v2.y + oy }
    const v3_back = { x: v3.x + ox, y: v3.y + oy }
    const v4_back = { x: v4.x + ox, y: v4.y + oy }

    // --- Dibujar caras laterales y trasera (ordenadas por profundidad) ---
    ctx.fillStyle = darkColor

    // Cara trasera (se dibuja primero para estar "detrás")
    ctx.beginPath()
    ctx.moveTo(v1_back.x, v1_back.y)
    ctx.lineTo(v2_back.x, v2_back.y)
    ctx.lineTo(v3_back.x, v3_back.y)
    ctx.lineTo(v4_back.x, v4_back.y)
    ctx.closePath()
    ctx.fill()

    // Dibujar caras laterales condicionalmente para evitar redundancia
    if (ox > 0) {
      // Si hay extrusión hacia la derecha (dibujar cara derecha)
      ctx.beginPath()
      ctx.moveTo(v2.x, v2.y)
      ctx.lineTo(v2_back.x, v2_back.y)
      ctx.lineTo(v3_back.x, v3_back.y)
      ctx.lineTo(v3.x, v3.y)
      ctx.closePath()
      ctx.fill()
    } else if (ox < 0) {
      // Si hay extrusión hacia la izquierda (dibujar cara izquierda)
      ctx.beginPath()
      ctx.moveTo(v4.x, v4.y)
      ctx.lineTo(v4_back.x, v4_back.y)
      ctx.lineTo(v1_back.x, v1_back.y)
      ctx.lineTo(v1.x, v1.y)
      ctx.closePath()
      ctx.fill()
    }

    if (oy > 0) {
      // Si hay extrusión hacia abajo (dibujar cara inferior)
      ctx.beginPath()
      ctx.moveTo(v3.x, v3.y)
      ctx.lineTo(v3_back.x, v3_back.y)
      ctx.lineTo(v4_back.x, v4_back.y)
      ctx.lineTo(v4.x, v4.y)
      ctx.closePath()
      ctx.fill()
    } else if (oy < 0) {
      // Si hay extrusión hacia arriba (dibujar cara superior)
      ctx.beginPath()
      ctx.moveTo(v1.x, v1.y)
      ctx.lineTo(v1_back.x, v1_back.y)
      ctx.lineTo(v2_back.x, v2_back.y)
      ctx.lineTo(v2.x, v2.y)
      ctx.closePath()
      ctx.fill()
    }

    // --- Dibujar la cara principal (frontal) ---
    ctx.fillStyle = color
    ctx.fillRect(-halfW, -halfH, width, height)

    ctx.restore()
  }

  // drawParallelogram con profundidad y dirección
  function drawParallelogram(
    color,
    x,
    y,
    z,
    baseWidth,
    height,
    skewOffset,
    rotation,
    thickness,
    depthDirection = "forward",
  ) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate((rotation * Math.PI) / 180)

    const darkColor = darkenColor(color, 0.3)
    let offsetX = 0
    let offsetY = 0

    // Ajustar offset según la dirección de extrusión
    if (depthDirection === "right") {
      offsetX = thickness
      offsetY = 0
    } else if (depthDirection === "left") {
      offsetX = -thickness
      offsetY = 0
    } else if (depthDirection === "up") {
      offsetX = 0
      offsetY = -thickness
    } else if (depthDirection === "down") {
      offsetX = 0
      offsetY = thickness
    } else if (depthDirection === "forward") {
      offsetX = thickness * 0.5
      offsetY = thickness * 0.5
    } else if (depthDirection === "backward") {
      offsetX = -thickness * 0.5
      offsetY = -thickness * 0.5
    }

    // Coordenadas relativas de la cara frontal
    const p1x = 0,
      p1y = 0
    const p2x = baseWidth,
      p2y = 0
    const p3x = baseWidth - skewOffset,
      p3y = height
    const p4x = -skewOffset,
      p4y = height

    // Cálculo del centro local para la rotación
    const minLocalX = Math.min(p1x, p2x, p3x, p4x)
    const maxLocalX = Math.max(p1x, p2x, p3x, p4x)
    const minLocalY = Math.min(p1y, p2y, p3y, p4y)
    const maxLocalY = Math.max(p1y, p2y, p3y, p4y)
    const centerLocalX = (minLocalX + maxLocalX) / 2
    const centerLocalY = (minLocalY + maxLocalY) / 2

    // Ajustar los puntos para que el centro sea (0,0) local
    const v1x = p1x - centerLocalX,
      v1y = p1y - centerLocalY
    const v2x = p2x - centerLocalX,
      v2y = p2y - centerLocalY
    const v3x = p3x - centerLocalX,
      v3y = p3y - centerLocalY
    const v4x = p4x - centerLocalX,
      v4y = p4y - centerLocalY

    // --- Dibujar caras laterales de la extrusión ---
    ctx.fillStyle = darkColor

    // Cara superior (v1-v2)
    ctx.beginPath()
    ctx.moveTo(v1x, v1y)
    ctx.lineTo(v1x + offsetX, v1y + offsetY)
    ctx.lineTo(v2x + offsetX, v2y + offsetY)
    ctx.lineTo(v2x, v2y)
    ctx.closePath()
    ctx.fill()

    // Cara derecha (v2-v3)
    ctx.beginPath()
    ctx.moveTo(v2x, v2y)
    ctx.lineTo(v2x + offsetX, v2y + offsetY)
    ctx.lineTo(v3x + offsetX, v3y + offsetY)
    ctx.lineTo(v3x, v3y)
    ctx.closePath()
    ctx.fill()

    // Cara inferior (v3-v4)
    ctx.beginPath()
    ctx.moveTo(v3x, v3y)
    ctx.lineTo(v3x + offsetX, v3y + offsetY)
    ctx.lineTo(v4x + offsetX, v4y + offsetY)
    ctx.lineTo(v4x, v4y)
    ctx.closePath()
    ctx.fill()

    // Cara izquierda (v4-v1)
    ctx.beginPath()
    ctx.moveTo(v4x, v4y)
    ctx.lineTo(v4x + offsetX, v4y + offsetY)
    ctx.lineTo(v1x + offsetX, v1y + offsetY)
    ctx.lineTo(v1x, v1y)
    ctx.closePath()
    ctx.fill()

    // --- Dibujar la cara principal (frontal) ---
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(v1x, v1y)
    ctx.lineTo(v2x, v2y)
    ctx.lineTo(v3x, v3y)
    ctx.lineTo(v4x, v4y)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
  }

  // --- Lógica de Animación ---
  let animationStartTime = 0
  let animationFrameId

  const INITIAL_PAUSE_DURATION = 500 // 0.5 segundos de pausa inicial con la figura ensamblada (más rápido)
  const DISASSEMBLE_DURATION = 1500// 1.5 segundos para desarmar (más rápido)
  const REASSEMBLE_DURATION = 1500 // 1.5 segundos para rearmar (más rápido)

  const CYCLE_DURATION = INITIAL_PAUSE_DURATION + DISASSEMBLE_DURATION + REASSEMBLE_DURATION

  function lerp(start, end, t) {
    return start * (1 - t) + end * t
  }

  // Easing function (ease-in-out cubic) para un movimiento más suave
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  function animate(timestamp) {
    if (!animationStartTime) {
      animationStartTime = timestamp
    }

    const elapsedTime = (timestamp - animationStartTime) % CYCLE_DURATION

    let progress

    if (elapsedTime < INITIAL_PAUSE_DURATION) {
      progress = 0
    } else if (elapsedTime < INITIAL_PAUSE_DURATION + DISASSEMBLE_DURATION) {
      const currentPhaseProgress = (elapsedTime - INITIAL_PAUSE_DURATION) / DISASSEMBLE_DURATION
      progress = easeInOutCubic(currentPhaseProgress)
    } else {
      const currentPhaseProgress = (elapsedTime - (INITIAL_PAUSE_DURATION + DISASSEMBLE_DURATION)) / REASSEMBLE_DURATION
      progress = easeInOutCubic(1 - currentPhaseProgress)
    }

    drawScene(progress)

    animationFrameId = requestAnimationFrame(animate)
  }

  // --- Función principal de dibujo ---
  function drawScene(progress = 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const scale = Math.min(canvas.width / DESIGN_WIDTH, canvas.height / DESIGN_HEIGHT)
    const offsetX = (canvas.width - DESIGN_WIDTH * scale) / 2
    const offsetY = (canvas.height - DESIGN_HEIGHT * scale) / 2

    ctx.save()
    ctx.translate(offsetX, offsetY)
    ctx.scale(scale, scale)

    pieces.forEach((p) => {
      const currentX = lerp(p.startX, p.endX, progress)
      const currentY = lerp(p.startY, p.endY, progress)
      const currentRotation = lerp(p.startRotation, p.endRotation, progress)
      const currentZ = lerp(p.initialZ, p.endZ, progress)

      // Se añade el thickness a las propiedades de la pieza para que sea usado en el dibujo.
      // Si la pieza no tiene un depthThickness definido, se usa 0 para no mostrar extrusión.
      const pieceThickness = p.depthThickness !== undefined ? p.depthThickness : 0

      switch (p.type) {
        case "triangle":
          drawTriangle(
            p.color,
            currentX,
            currentY,
            currentZ,
            p.legLength,
            p.legLength,
            currentRotation,
            pieceThickness,
            p.depthDirection,
          )
          break
        case "rect":
          drawRect(
            p.color,
            currentX,
            currentY,
            currentZ,
            p.width,
            p.height,
            currentRotation,
            pieceThickness,
            p.depthDirection,
          )
          break
        case "parallelogram":
          drawParallelogram(
            p.color,
            currentX,
            currentY,
            currentZ,
            p.baseWidth,
            p.height,
            p.skewOffset,
            currentRotation,
            pieceThickness,
            p.depthDirection,
          )
          break
      }
    })
    ctx.restore()
  }

  // --- Controlador de inicio y redimensionamiento ---
  function startAnimationCycle() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    animationStartTime = 0
    animationFrameId = requestAnimationFrame(animate)
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    startAnimationCycle()
  }

  window.addEventListener("resize", resizeCanvas)
  resizeCanvas()
})
