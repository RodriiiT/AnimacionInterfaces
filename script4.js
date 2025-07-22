document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("tangramCanvas")
  const ctx = canvas.getContext("2d")

  const DESIGN_WIDTH = 600
  const DESIGN_HEIGHT = 400

  // === CONFIGURACIONES DE LOS 3 TANGRAMS ORGANIZADAS POR COLOR ===

  // Tangram 81 (configuración inicial)
  const tangram81 = {
    "#00B050": {
      // Verde (cuadrado)
      type: "rect",
      color: "#00B050",
      width: 45,
      height: 45,
      startX: 238,
      startY: 240,
      startRotation: 90,
      depthThickness: 15,
      depthDirection: "backward",
    },
    "#FF7F50": {
      // Naranja (pequeño)
      type: "triangle",
      color: "#FF7F50",
      legLength: 43.5,
      startX: 372.5,
      startY: 286,
      startRotation: 180,
      depthThickness: 12,
      depthDirection: ["down", "left"],
    },
    "#800080": {
      // Morado (mediano)
      type: "triangle",
      color: "#800080",
      legLength: 65,
      startX: 329,
      startY: 286,
      startRotation: 225,
      depthThickness: 13,
      depthDirection: ["down"],
    },
    "#000080": {
      // Azul (grande)
      type: "triangle",
      color: "#000080",
      legLength: 88,
      startX: 238,
      startY: 240,
      startRotation: 270,
      depthThickness: 16,
      depthDirection: "down",
    },
    "#FF00FF": {
      // Fucsia (grande)
      type: "triangle",
      color: "#FF00FF",
      legLength: 89,
      startX: 327,
      startY: 151.5,
      startRotation: 90,
      depthThickness: 18,
      depthDirection: "backward",
    },
    "#FFDB58": {
      // Amarillo (paralelogramo)
      type: "parallelogram",
      color: "#FFDB58",
      baseWidth: 48,
      height: 45,
      skewOffset: -45,
      startX: 350.5,
      startY: 194,
      startRotation: 270,
      depthThickness: 14,
      depthDirection: ["down"],
    },
    "#008080": {
      // Teal (pequeño)
      type: "triangle",
      color: "#008080",
      legLength: 45,
      startX: 328,
      startY: 151,
      startRotation: 0,
      depthThickness: 17,
      depthDirection: ["forward", "up"],
    },
  }

  // Tangram 83 (segunda configuración)
  const tangram83 = {
    "#000080": {
      // Azul (grande)
      type: "triangle",
      color: "#000080",
      legLength: 90,
      startX: 292,
      startY: 243,
      startRotation: 180,
      depthThickness: 16,
      depthDirection: "backward",
    },
    "#FF7F50": {
      // Naranja (pequeño)
      type: "triangle",
      color: "#FF7F50",
      legLength: 45,
      startX: 202,
      startY: 242.5,
      startRotation: 0,
      depthThickness: 12,
      depthDirection: "right",
    },
    "#00B050": {
      // Verde (cuadrado)
      type: "rect",
      color: "#00B050",
      width: 45,
      height: 45,
      startX: 397,
      startY: 58,
      startRotation: 90,
      depthThickness: 15,
      depthDirection: "backward",
    },
    "#008080": {
      // Teal (pequeño)
      type: "triangle",
      color: "#008080",
      legLength: 55,
      startX: 392,
      startY: 108,
      startRotation: 90,
      depthThickness: 10,
      depthDirection: "backward",
    },
    "#FFDB58": {
      // Amarillo (paralelogramo)
      type: "parallelogram",
      color: "#FFDB58",
      baseWidth: 50,
      height: 45,
      skewOffset: 45,
      startX: 250,
      startY: 265,
      startRotation: 180,
      depthThickness: 14,
      depthDirection: "backward",
    },
    "#800080": {
      // Morado (mediano)
      type: "triangle",
      color: "#800080",
      legLength: 65,
      startX: 337,
      startY: 108,
      startRotation: 45,
      depthThickness: 13,
      depthDirection: "right",
    },
    "#FF00FF": {
      // Fucsia (grande)
      type: "triangle",
      color: "#FF00FF",
      legLength: 90,
      startX: 293,
      startY: 154,
      startRotation: 0,
      depthThickness: 18,
      depthDirection: "forward",
    },
  }

  // Tangram 188 (tercera configuración)
  const tangram188 = {
    "#FFDB58": {
      // Amarillo (paralelogramo)
      type: "parallelogram",
      color: "#FFDB58",
      baseWidth: 50,
      height: 45,
      skewOffset: 45,
      startX: 224.6,
      startY: 211.8,
      startRotation: 90,
      depthThickness: 14,
      depthDirection: ["backward"],
    },
    "#800080": {
      // Morado (mediano)
      type: "triangle",
      color: "#800080",
      legLength: 65,
      startX: 295.8,
      startY: 216,
      startRotation: 135,
      depthThickness: 13,
      depthDirection: ["left"],
    },
    "#000080": {
      // Azul (grande)
      type: "triangle",
      color: "#000080",
      legLength: 90,
      startX: 293.7,
      startY: 214.7,
      startRotation: 45,
      depthThickness: 13,
      depthDirection: ["up"],
    },
    "#FF00FF": {
      // Fucsia (grande)
      type: "triangle",
      color: "#FF00FF",
      legLength: 90,
      startX: 340,
      startY: 170,
      startRotation: 90,
      depthThickness: 18,
      depthDirection: "backward",
    },
    "#008080": {
      // Teal (pequeño)
      type: "triangle",
      color: "#008080",
      legLength: 45,
      startX: 384.5,
      startY: 207.8,
      startRotation: 180,
      depthThickness: 12.3,
      depthDirection: ["left"],
    },
    "#FF7F50": {
      // Naranja (pequeño)
      type: "triangle",
      color: "#FF7F50",
      legLength: 45,
      startX: 340.5,
      startY: 207.6,
      startRotation: 0,
      depthThickness: 12,
      depthDirection: ["right"],
    },
    "#00B050": {
      // Verde (cuadrado)
      type: "rect",
      color: "#00B050",
      width: 45,
      height: 45,
      startX: 272,
      startY: 125,
      startRotation: 90,
      depthThickness: 15,
      depthDirection: "backward",
    },
  }

  // === SISTEMA DE ANIMACIÓN SIMPLIFICADO ===
  let animationStartTime = 0
  let animationFrameId

  // Duraciones de cada fase (en milisegundos)
  const PAUSE_DURATION = 2000 // Pausa con tangram ensamblado
  const TRANSITION_DURATION = 2500 // Tiempo para moverse a la siguiente configuración

  // Duración total de un ciclo completo (3 tangrams)
  const SINGLE_TANGRAM_CYCLE = PAUSE_DURATION + TRANSITION_DURATION
  const TOTAL_CYCLE_DURATION = SINGLE_TANGRAM_CYCLE * 3

  // Colores de las piezas para mapeo consistente
  const PIECE_COLORS = ["#00B050", "#FF7F50", "#800080", "#000080", "#FF00FF", "#FFDB58", "#008080"]

  // Helper functions
  function lerp(start, end, t) {
    return start * (1 - t) + end * t
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

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

  // Función para obtener las configuraciones actuales
  function getCurrentConfigurations(elapsedTime) {
    const cycleTime = elapsedTime % TOTAL_CYCLE_DURATION
    const tangramIndex = Math.floor(cycleTime / SINGLE_TANGRAM_CYCLE)
    const phaseTime = cycleTime % SINGLE_TANGRAM_CYCLE

    const configs = [tangram81, tangram83, tangram188]
    const currentConfig = configs[tangramIndex]
    const nextConfig = configs[(tangramIndex + 1) % 3]

    return { currentConfig, nextConfig, phaseTime, tangramIndex }
  }

  // Función principal de animación
  function animate(timestamp) {
    if (!animationStartTime) {
      animationStartTime = timestamp
    }

    const elapsedTime = timestamp - animationStartTime
    const { currentConfig, nextConfig, phaseTime, tangramIndex } = getCurrentConfigurations(elapsedTime)

    let transitionProgress = 0

    if (phaseTime < PAUSE_DURATION) {
      // Fase 1: Pausa con tangram ensamblado
      transitionProgress = 0
    } else {
      // Fase 2: Transición directa a la siguiente configuración
      const phaseProgress = (phaseTime - PAUSE_DURATION) / TRANSITION_DURATION
      transitionProgress = easeInOutCubic(phaseProgress)
    }

    drawScene(currentConfig, nextConfig, transitionProgress)
    animationFrameId = requestAnimationFrame(animate)
  }

  // Función de dibujo principal
  function drawScene(currentConfig, nextConfig, transitionProgress) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const scale = Math.min(canvas.width / DESIGN_WIDTH, canvas.height / DESIGN_HEIGHT)
    const offsetX = (canvas.width - DESIGN_WIDTH * scale) / 2
    const offsetY = (canvas.height - DESIGN_HEIGHT * scale) / 2

    ctx.save()
    ctx.translate(offsetX, offsetY)
    ctx.scale(scale, scale)

    // Dibujar cada pieza mapeada por color
    PIECE_COLORS.forEach((color) => {
      const currentPiece = currentConfig[color]
      const nextPiece = nextConfig[color]

      if (!currentPiece || !nextPiece) return

      // Interpolar entre configuración actual y siguiente
      const currentX = lerp(currentPiece.startX, nextPiece.startX, transitionProgress)
      const currentY = lerp(currentPiece.startY, nextPiece.startY, transitionProgress)
      const currentRotation = lerp(currentPiece.startRotation, nextPiece.startRotation, transitionProgress)

      // Interpolar propiedades de profundidad y dimensiones
      const currentThickness = lerp(currentPiece.depthThickness, nextPiece.depthThickness, transitionProgress)

      // Interpolar dimensiones si son diferentes
      let currentWidth = currentPiece.width
      let currentHeight = currentPiece.height
      let currentLegLength = currentPiece.legLength
      let currentBaseWidth = currentPiece.baseWidth

      if (currentPiece.width !== undefined && nextPiece.width !== undefined) {
        currentWidth = lerp(currentPiece.width, nextPiece.width, transitionProgress)
      }
      if (currentPiece.height !== undefined && nextPiece.height !== undefined) {
        currentHeight = lerp(currentPiece.height, nextPiece.height, transitionProgress)
      }
      if (currentPiece.legLength !== undefined && nextPiece.legLength !== undefined) {
        currentLegLength = lerp(currentPiece.legLength, nextPiece.legLength, transitionProgress)
      }
      if (currentPiece.baseWidth !== undefined && nextPiece.baseWidth !== undefined) {
        currentBaseWidth = lerp(currentPiece.baseWidth, nextPiece.baseWidth, transitionProgress)
      }

      // Determinar dirección de profundidad (cambiar gradualmente)
      const depthDirection = transitionProgress < 0.5 ? currentPiece.depthDirection : nextPiece.depthDirection

      // Dibujar la pieza
      switch (currentPiece.type) {
        case "triangle":
          drawTriangle(
            color,
            currentX,
            currentY,
            0,
            currentLegLength,
            currentLegLength,
            currentRotation,
            currentThickness,
            depthDirection,
          )
          break
        case "rect":
          drawRect(
            color,
            currentX,
            currentY,
            0,
            currentWidth,
            currentHeight,
            currentRotation,
            currentThickness,
            depthDirection,
          )
          break
        case "parallelogram":
          // Interpolar skewOffset también
          const currentSkewOffset = lerp(currentPiece.skewOffset, nextPiece.skewOffset, transitionProgress)
          drawParallelogram(
            color,
            currentX,
            currentY,
            0,
            currentBaseWidth,
            currentHeight,
            currentSkewOffset,
            currentRotation,
            currentThickness,
            depthDirection,
          )
          break
      }
    })

    ctx.restore()
  }

  // === FUNCIONES DE DIBUJO 3D ===

  function drawTriangle(color, x, y, z, legWidth, legHeight, rotation, thickness, depthDirection = "forward") {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate((rotation * Math.PI) / 180)

    const darkColor = darkenColor(color, 0.3)
    let ox = 0,
      oy = 0

    const directions = Array.isArray(depthDirection) ? depthDirection : [depthDirection]
    directions.forEach((dir) => {
      if (dir === "right") ox += thickness
      else if (dir === "left") ox += -thickness
      else if (dir === "up") oy += -thickness
      else if (dir === "down") oy += thickness
      else if (dir === "forward") {
        ox += thickness * 0.5
        oy += thickness * 0.5
      } else if (dir === "backward") {
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

    // Dibujar caras de profundidad
    ctx.fillStyle = darkColor
    ctx.beginPath()
    ctx.moveTo(v1_back.x, v1_back.y)
    ctx.lineTo(v2_back.x, v2_back.y)
    ctx.lineTo(v3_back.x, v3_back.y)
    ctx.closePath()
    ctx.fill()

    // Caras laterales
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

    // Cara frontal
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(v1.x, v1.y)
    ctx.lineTo(v2.x, v2.y)
    ctx.lineTo(v3.x, v3.y)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
  }

  function drawRect(color, x, y, z, width, height, rotation, thickness, depthDirection = "forward") {
    ctx.save()
    ctx.translate(x + width / 2, y + height / 2)
    ctx.rotate((rotation * Math.PI) / 180)

    const darkColor = darkenColor(color, 0.3)
    let ox = 0,
      oy = 0

    const directions = Array.isArray(depthDirection) ? depthDirection : [depthDirection]
    directions.forEach((dir) => {
      if (dir === "right") ox += thickness
      else if (dir === "left") ox += -thickness
      else if (dir === "up") oy += -thickness
      else if (dir === "down") oy += thickness
      else if (dir === "forward") {
        ox += thickness * 0.5
        oy += thickness * 0.5
      } else if (dir === "backward") {
        ox += -thickness * 0.5
        oy += -thickness * 0.5
      }
    })

    const halfW = width / 2,
      halfH = height / 2
    const v1 = { x: -halfW, y: -halfH }
    const v2 = { x: halfW, y: -halfH }
    const v3 = { x: halfW, y: halfH }
    const v4 = { x: -halfW, y: halfH }
    const v1_back = { x: v1.x + ox, y: v1.y + oy }
    const v2_back = { x: v2.x + ox, y: v2.y + oy }
    const v3_back = { x: v3.x + ox, y: v3.y + oy }
    const v4_back = { x: v4.x + ox, y: v4.y + oy }

    // Cara trasera
    ctx.fillStyle = darkColor
    ctx.beginPath()
    ctx.moveTo(v1_back.x, v1_back.y)
    ctx.lineTo(v2_back.x, v2_back.y)
    ctx.lineTo(v3_back.x, v3_back.y)
    ctx.lineTo(v4_back.x, v4_back.y)
    ctx.closePath()
    ctx.fill()

    // Caras laterales
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

    // Cara frontal
    ctx.fillStyle = color
    ctx.fillRect(-halfW, -halfH, width, height)
    ctx.restore()
  }

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
    let offsetX = 0,
      offsetY = 0

    const directions = Array.isArray(depthDirection) ? depthDirection : [depthDirection]
    directions.forEach((dir) => {
      if (dir === "right") offsetX += thickness
      else if (dir === "left") offsetX += -thickness
      else if (dir === "up") offsetY += -thickness
      else if (dir === "down") offsetY += thickness
      else if (dir === "forward") {
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
    const minLocalY = Math.min(p1y, p2y, p3y, p4y)
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

    // Caras laterales
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

    // Cara frontal
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

  // === INICIALIZACIÓN ===
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
