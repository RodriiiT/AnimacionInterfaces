document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("tangramCanvas")
  const ctx = canvas.getContext("2d")

  const DESIGN_WIDTH = 600
  const DESIGN_HEIGHT = 400

  const pieces = [
    {
      type: "rect",
      color: "#00B050", // 2. Verde (cuadrado)
      width: 45,
      height: 45,
      startX: 238,
      startY: 240,
      startRotation: 90,
      initialZ: 0,
      // Verde: hacia abajo (aumentar endY)
      endX: 238,
      endY: 350,
      endRotation: 0,
      endZ: 30,
      depthThickness: 15, // Activated
      depthDirection: "backward",
    },

    {
      type: "triangle",
      color: "#FF7F50", // 1. Naranja (pequeño) - Moverlo aquí para que actúe luego.
      legLength: 43.5,
      startX: 372.5,
      startY: 286,
      startRotation: 180,
      initialZ: 0,
      // Naranja: hacia la derecha
      endX: 550,
      endY: 286,
      endRotation: -45,
      endZ: 50,
      depthThickness: 12, // Activated
      depthDirection: ["down", "left"],
    },
    {
      type: "triangle",
      color: "#800080", // 7. Morado (mediano)
      legLength: 65,
      startX: 329,
      startY: 286,
      startRotation: 225,
      initialZ: 0,
      // Morado: hacia abajo y luego hacia la derecha
      endX: 450, // Ajustado para ir más a la derecha después de bajar
      endY: 380, // Ajustado para bajar más
      endRotation: 90,
      endZ: 45,
      depthThickness: 13, // Activated
      depthDirection: ["down"],
    },

    {
      type: "triangle",
      color: "#000080", // 5. Azul (grande)
      legLength: 88,
      startX: 238,
      startY: 240,
      startRotation: 270,
      initialZ: 0,
      // Azul: hacia la izquierda (disminuir endX)
      endX: 50,
      endY: 240,
      endRotation: 220,
      endZ: 70,
      depthThickness: 16, // Activated
      depthDirection: "down",
    },
    {
      type: "triangle",
      color: "#FF00FF", // 4. Fucsia (grande)
      legLength: 89,
      startX: 327,
      startY: 151.5,
      startRotation: 90,
      initialZ: 0,
      // Fucsia: hacia arriba y hacia la izquierda
      endX: 180, // Ajustado para ir más a la izquierda
      endY: 10, // Se mantiene arriba
      endRotation: 20,
      endZ: 60,
      depthThickness: 18, // Activated
      depthDirection: "backward",
    },
    {
      type: "parallelogram",
      color: "#FFDB58", // 6. Amarillo (paralelogramo) - EXTENDIDO
      baseWidth: 48, // ⭐ AUMENTADO de 45 a 67 para llenar el espacio
      height: 45,
      skewOffset: -45, // Inverted for mirror effect
      startX: 350.5, // ⭐ AJUSTADO ligeramente la posición X para centrar mejor
      startY: 194,
      startRotation: 270,
      initialZ: 0,
      // Paralelogramo: hacia la derecha (aumentar endX)
      endX: 550, // Modified: Moved further right
      endY: 196,
      endRotation: 135,
      endZ: 55,
      depthThickness: 14, // Activated
      depthDirection: ["down"],
    },

    {
      type: "triangle",
      color: "#008080", // 3. Teal (pequeño)
      legLength: 45,
      startX: 328,
      startY: 151,
      startRotation: 0,
      initialZ: 0,
      // Teal: hacia arriba y hacia la derecha
      endX: 550, // Adjusted to go further right
      endY: -50, // Modified: Moved further up
      endRotation: 135,
      endZ: 40,
      depthThickness: 17, // Activated
      depthDirection: ["forward", "up"],
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

  // --- Funciones de dibujo modificadas ---
  function drawTriangle(
    color,
    x,
    y,
    z,
    legWidth,
    legHeight,
    rotation,
    thickness,
    depthDirection = "forward", // Puede ser string o array de strings
  ) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate((rotation * Math.PI) / 180)

    const darkColor = darkenColor(color, 0.3)
    let ox = 0
    let oy = 0

    // ✨ CAMBIO IMPORTANTE AQUÍ: Permitir múltiples direcciones
    const directions = Array.isArray(depthDirection)
      ? depthDirection
      : [depthDirection]

    directions.forEach((dir) => {
      if (dir === "right") {
        ox += thickness
      } else if (dir === "left") {
        ox += -thickness
      } else if (dir === "up") {
        oy += -thickness
      } else if (dir === "down") {
        oy += thickness
      } else if (dir === "forward") {
        // Diagonal abajo-derecha
        ox += thickness * 0.5
        oy += thickness * 0.5
      } else if (dir === "backward") {
        // Diagonal arriba-izquierda
        ox += -thickness * 0.5
        oy += -thickness * 0.5
      }
    })

    const v1 = { x: 0, y: 0 }
    const v2 = { x: legWidth, y: 0 }
    const v3 = { x: 0, y: legHeight }

    const v1_back = { x: v1.x + ox, y: v1.y + oy }
    const v2_back = { x: v2.x + ox, y: v2.y + oy }
    const v3_back = { x: v3.x + ox, y: v3.y + oy }

    ctx.fillStyle = darkColor

    ctx.beginPath()
    ctx.moveTo(v1_back.x, v1_back.y)
    ctx.lineTo(v2_back.x, v2_back.y)
    ctx.lineTo(v3_back.x, v3_back.y)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(v1.x, v1.y)
    ctx.lineTo(v2.x, v2.y)
    ctx.lineTo(v2_back.x, v2_back.y)
    ctx.lineTo(v1_back.x, v1_back.y)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(v2.x, v2.y)
    ctx.lineTo(v3.x, v3.y)
    ctx.lineTo(v3_back.x, v3_back.y)
    ctx.lineTo(v2_back.x, v2_back.y)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(v3.x, v3.y)
    ctx.lineTo(v1.x, v1.y)
    ctx.lineTo(v1_back.x, v1_back.y)
    ctx.lineTo(v3_back.x, v3_back.y)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(v1.x, v1.y)
    ctx.lineTo(v2.x, v2.y)
    ctx.lineTo(v3.x, v3.y)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
  }

  // La función drawRect no necesita cambios a menos que quieras que también soporte múltiples direcciones de profundidad
  function drawRect(
    color,
    x,
    y,
    z,
    width,
    height,
    rotation,
    thickness,
    depthDirection = "forward",
  ) {
    ctx.save()
    ctx.translate(x + width / 2, y + height / 2)
    ctx.rotate((rotation * Math.PI) / 180)

    const darkColor = darkenColor(color, 0.3)
    let ox = 0
    let oy = 0

    // ✨ CAMBIO OPCIONAL AQUÍ: Para que drawRect también soporte múltiples direcciones
    const directions = Array.isArray(depthDirection)
      ? depthDirection
      : [depthDirection]

    directions.forEach((dir) => {
      if (dir === "right") {
        ox += thickness
      } else if (dir === "left") {
        ox += -thickness
      } else if (dir === "up") {
        oy += -thickness
      } else if (dir === "down") {
        oy += thickness
      } else if (dir === "forward") {
        ox += thickness * 0.5
        oy += thickness * 0.5
      } else if (dir === "backward") {
        ox += -thickness * 0.5
        oy += -thickness * 0.5
      }
    })

    const halfW = width / 2
    const halfH = height / 2

    const v1 = { x: -halfW, y: -halfH }
    const v2 = { x: halfW, y: -halfH }
    const v3 = { x: halfW, y: halfH }
    const v4 = { x: -halfW, y: halfH }

    const v1_back = { x: v1.x + ox, y: v1.y + oy }
    const v2_back = { x: v2.x + ox, y: v2.y + oy }
    const v3_back = { x: v3.x + ox, y: v3.y + oy }
    const v4_back = { x: v4.x + ox, y: v4.y + oy }

    ctx.fillStyle = darkColor

    ctx.beginPath()
    ctx.moveTo(v1_back.x, v1_back.y)
    ctx.lineTo(v2_back.x, v2_back.y)
    ctx.lineTo(v3_back.x, v3_back.y)
    ctx.lineTo(v4_back.x, v4_back.y)
    ctx.closePath()
    ctx.fill()

    if (ox > 0) {
      ctx.beginPath()
      ctx.moveTo(v2.x, v2.y)
      ctx.lineTo(v2_back.x, v2_back.y)
      ctx.lineTo(v3_back.x, v3_back.y)
      ctx.lineTo(v3.x, v3.y)
      ctx.closePath()
      ctx.fill()
    } else if (ox < 0) {
      ctx.beginPath()
      ctx.moveTo(v4.x, v4.y)
      ctx.lineTo(v4_back.x, v4_back.y)
      ctx.lineTo(v1_back.x, v1_back.y)
      ctx.lineTo(v1.x, v1.y)
      ctx.closePath()
      ctx.fill()
    }

    if (oy > 0) {
      ctx.beginPath()
      ctx.moveTo(v3.x, v3.y)
      ctx.lineTo(v3_back.x, v3_back.y)
      ctx.lineTo(v4_back.x, v4_back.y)
      ctx.lineTo(v4.x, v4.y)
      ctx.closePath()
      ctx.fill()
    } else if (oy < 0) {
      ctx.beginPath()
      ctx.moveTo(v1.x, v1.y)
      ctx.lineTo(v1_back.x, v1_back.y)
      ctx.lineTo(v2_back.x, v2_back.y)
      ctx.lineTo(v2.x, v2.y)
      ctx.closePath()
      ctx.fill()
    }

    ctx.fillStyle = color
    ctx.fillRect(-halfW, -halfH, width, height)

    ctx.restore()
  }

  // La función drawParallelogram no necesita cambios a menos que quieras que también soporte múltiples direcciones de profundidad
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

    // ✨ CAMBIO OPCIONAL AQUÍ: Para que drawParallelogram también soporte múltiples direcciones
    const directions = Array.isArray(depthDirection)
      ? depthDirection
      : [depthDirection]

    directions.forEach((dir) => {
      if (dir === "right") {
        offsetX += thickness
      } else if (dir === "left") {
        offsetX += -thickness
      } else if (dir === "up") {
        offsetY += -thickness
      } else if (dir === "down") {
        offsetY += thickness
      } else if (dir === "forward") {
        offsetX += thickness * 0.5
        offsetY += thickness * 0.5
      } else if (dir === "backward") {
        offsetX += -thickness * 0.5
        offsetY += -thickness * 0.5
      }
    })

    const p1x = 0,
      p1y = 0
    const p2x = baseWidth,
      p2y = 0
    const p3x = baseWidth - skewOffset,
      p3y = height
    const p4x = -skewOffset,
      p4y = height

    const minLocalX = Math.min(p1x, p2x, p3x, p4x)
    const maxLocalX = Math.max(p1x, p2x, p3x, p4x)
    const minLocalY = Math.min(p1y, p1y, p3y, p4y)
    const maxLocalY = Math.max(p1y, p2y, p3y, p4y)
    const centerLocalX = (minLocalX + maxLocalX) / 2
    const centerLocalY = (minLocalY + maxLocalY) / 2

    const v1x = p1x - centerLocalX,
      v1y = p1y - centerLocalY
    const v2x = p2x - centerLocalX,
      v2y = p2y - centerLocalY
    const v3x = p3x - centerLocalX,
      v3y = p3y - centerLocalY
    const v4x = p4x - centerLocalX,
      v4y = p4y - centerLocalY

    ctx.fillStyle = darkColor

    ctx.beginPath()
    ctx.moveTo(v1x, v1y)
    ctx.lineTo(v1x + offsetX, v1y + offsetY)
    ctx.lineTo(v2x + offsetX, v2y + offsetY)
    ctx.lineTo(v2x, v2y)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(v2x, v2y)
    ctx.lineTo(v2x + offsetX, v2y + offsetY)
    ctx.lineTo(v3x + offsetX, v3y + offsetY)
    ctx.lineTo(v3x, v3y)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(v3x, v3y)
    ctx.lineTo(v3x + offsetX, v3y + offsetY)
    ctx.lineTo(v4x + offsetX, v4y + offsetY)
    ctx.lineTo(v4x, v4y)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(v4x, v4y)
    ctx.lineTo(v4x + offsetX, v4y + offsetY)
    ctx.lineTo(v1x + offsetX, v1y + offsetY)
    ctx.lineTo(v1x, v1y)
    ctx.closePath()
    ctx.fill()

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

  let animationStartTime = 0
  let animationFrameId

  const INITIAL_PAUSE_DURATION = 500
  const DISASSEMBLE_DURATION = 1500
  const REASSEMBLE_DURATION = 1500

  const CYCLE_DURATION =
    INITIAL_PAUSE_DURATION + DISASSEMBLE_DURATION + REASSEMBLE_DURATION

  function lerp(start, end, t) {
    return start * (1 - t) + end * t
  }

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
      const currentPhaseProgress =
        (elapsedTime - INITIAL_PAUSE_DURATION) / DISASSEMBLE_DURATION
      progress = easeInOutCubic(currentPhaseProgress)
    } else {
      const currentPhaseProgress =
        (elapsedTime - (INITIAL_PAUSE_DURATION + DISASSEMBLE_DURATION)) /
        REASSEMBLE_DURATION
      progress = easeInOutCubic(1 - currentPhaseProgress)
    }

    drawScene(progress)

    animationFrameId = requestAnimationFrame(animate)
  }

  function drawScene(progress = 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const scale = Math.min(
      canvas.width / DESIGN_WIDTH,
      canvas.height / DESIGN_HEIGHT,
    )
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

      const pieceThickness =
        p.depthThickness !== undefined ? p.depthThickness : 0

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