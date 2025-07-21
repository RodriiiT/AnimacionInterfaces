document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("tangramCanvas")
  const ctx = canvas.getContext("2d")

  const DESIGN_WIDTH = 600
  const DESIGN_HEIGHT = 400

  // === CONFIGURACIONES DE LOS 3 TANGRAMS ===

  // Tangram 81 (script2)
  const tangram81 = [
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

  // Tangram 83 (script original)
  const tangram83 = [
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

  // Tangram 188 (script3)
  const tangram188 = [
    {
      type: "parallelogram",
      color: "#FFDB58", // 6. Amarillo (paralelogramo) - EXTENDIDO
      baseWidth: 50, // ⭐ AUMENTADO de 45 a 67 para llenar el espacio
      height: 45,
      skewOffset: 45, // Inverted for mirror effect
      startX: 224.6, // ⭐ AJUSTADO ligeramente la posición X para centrar mejor
      startY: 211.8,
      startRotation: 90,
      initialZ: 0,
      // Paralelogramo: //hacia la izquierda y luego arriba
      endX: -100, // Modified: Moved further right
      endY: 100,
      endRotation: 135,
      endZ: 55,
      depthThickness: 14, // Activated
      depthDirection: ["backward"], 
    },
    
    {
      type: "triangle",
      color: "#800080", // 7. Morado (mediano)
      legLength: 65,
      startX: 295.8,
      startY: 216,
      startRotation: 135,
      initialZ: 0,
      // Morado: //hacia la izquierda
      endX: -10, // Ajustado para ir más a la derecha después de bajar
      endY: 380, // Ajustado para bajar más
      endRotation: 90,
      endZ: 45,
      depthThickness: 13, // Activated
      depthDirection: ["left"],
    },

    {
      type: "triangle",
      color: "#000080", // 5. Azul (grande)
      legLength: 90,
      startX: 293.7,
      startY: 214.7,
      startRotation: 45,
      initialZ: 0,
      // Azul: hacia la abajo
      endX: 500,
      endY: 300,
      endRotation: 90,
      endZ: 0,
      depthThickness: 13, // Activated
      depthDirection: ["up"],
    },
    {
      type: "triangle",
      color: "#FF00FF", // 4. Fucsia (grande)
      legLength: 90,
      startX: 340,
      startY: 170,
      startRotation: 90,
      initialZ: 0,
      // Fucsia: arriba
      endX: 180, // Ajustado para ir más a la izquierda
      endY: 10, // Se mantiene arriba
      endRotation: 20,
      endZ: 60,
      depthThickness: 18, // Activated
      depthDirection: "backward",
    },
    {
      type: "triangle",
      color: "#008080", // 3. Teal (pequeño)
      legLength: 45,
      startX: 384.5,
      startY: 207.8,
      startRotation: 180,
      initialZ: 0,
      // Teal: derecha full
      endX: 550, // Adjusted to go further right
      endY: -50, // Modified: Moved further up
      endRotation: 135,
      endZ: 40,
      depthThickness: 12.3, // Activated
      depthDirection: ["left"],
    },
    {
      type: "triangle",
      color: "#FF7F50", // 1. Naranja (pequeño) - Moverlo aquí para que actúe luego.
      legLength: 45,
      startX: 340.5,
      startY: 207.6,
      startRotation: 0,
      initialZ: 0,
      // Naranja: hacia abajo y luego derecha
      endX: 550,
      endY: 286,
      endRotation: -45,
      endZ: 50,
      depthThickness: 12, // Activated
      depthDirection: ["right"],
    },
   

    {
      type: "rect",
      color: "#00B050", // 2. Verde (cuadrado)
      width: 45,
      height: 45,
      startX: 272,
      startY: 125,
      startRotation: 90,
      initialZ: 0,
      // Verde: hacia arriba y luego hacia la derecha
      endX: 238,
      endY: -50,
      endRotation: 0,
      endZ: 30,
      depthThickness: 15, // Activated
      depthDirection: "backward",
    },
  ]

  // === SISTEMA DE ANIMACIÓN UNIFICADO ===
  let animationStartTime = 0
  let animationFrameId

  // Duraciones de cada fase (en milisegundos)
  const PAUSE_DURATION = 800 // Pausa con tangram ensamblado
  const DISASSEMBLE_DURATION = 1200 // Tiempo para desarmar
  const TRANSITION_DURATION = 1500 // Tiempo para moverse a la siguiente configuración
  const REASSEMBLE_DURATION = 1200 // Tiempo para rearmar

  // Duración total de un ciclo completo (3 tangrams)
  const SINGLE_TANGRAM_CYCLE = PAUSE_DURATION + DISASSEMBLE_DURATION + TRANSITION_DURATION + REASSEMBLE_DURATION
  const TOTAL_CYCLE_DURATION = SINGLE_TANGRAM_CYCLE * 3

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

  // Función para obtener la configuración actual y la siguiente
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

    let assemblyProgress = 0
    let transitionProgress = 0

    if (phaseTime < PAUSE_DURATION) {
      // Fase 1: Pausa con tangram ensamblado
      assemblyProgress = 0
      transitionProgress = 0
    } else if (phaseTime < PAUSE_DURATION + DISASSEMBLE_DURATION) {
      // Fase 2: Desarmar
      const phaseProgress = (phaseTime - PAUSE_DURATION) / DISASSEMBLE_DURATION
      assemblyProgress = easeInOutCubic(phaseProgress)
      transitionProgress = 0
    } else if (phaseTime < PAUSE_DURATION + DISASSEMBLE_DURATION + TRANSITION_DURATION) {
      // Fase 3: Transición a la siguiente configuración
      const phaseProgress = (phaseTime - PAUSE_DURATION - DISASSEMBLE_DURATION) / TRANSITION_DURATION
      assemblyProgress = 1
      transitionProgress = easeInOutCubic(phaseProgress)
    } else {
      // Fase 4: Rearmar en la nueva configuración
      const phaseProgress =
        (phaseTime - PAUSE_DURATION - DISASSEMBLE_DURATION - TRANSITION_DURATION) / REASSEMBLE_DURATION
      assemblyProgress = easeInOutCubic(1 - phaseProgress)
      transitionProgress = 1
    }

    drawScene(currentConfig, nextConfig, assemblyProgress, transitionProgress)
    animationFrameId = requestAnimationFrame(animate)
  }

  // Función de dibujo principal
  function drawScene(currentConfig, nextConfig, assemblyProgress, transitionProgress) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const scale = Math.min(canvas.width / DESIGN_WIDTH, canvas.height / DESIGN_HEIGHT)
    const offsetX = (canvas.width - DESIGN_WIDTH * scale) / 2
    const offsetY = (canvas.height - DESIGN_HEIGHT * scale) / 2

    ctx.save()
    ctx.translate(offsetX, offsetY)
    ctx.scale(scale, scale)

    currentConfig.forEach((currentPiece, index) => {
      const nextPiece = nextConfig[index]

      // Interpolar entre configuración actual y siguiente
      const baseStartX = lerp(currentPiece.startX, nextPiece.startX, transitionProgress)
      const baseStartY = lerp(currentPiece.startY, nextPiece.startY, transitionProgress)
      const baseStartRotation = lerp(currentPiece.startRotation, nextPiece.startRotation, transitionProgress)

      const baseEndX = lerp(currentPiece.endX, nextPiece.endX, transitionProgress)
      const baseEndY = lerp(currentPiece.endY, nextPiece.endY, transitionProgress)
      const baseEndRotation = lerp(currentPiece.endRotation, nextPiece.endRotation, transitionProgress)

      // Interpolar propiedades de profundidad
      const baseThickness = lerp(currentPiece.depthThickness, nextPiece.depthThickness, transitionProgress)

      // Para las dimensiones (si son diferentes entre configuraciones)
      let baseWidth = currentPiece.width
      let baseHeight = currentPiece.height
      let baseLegLength = currentPiece.legLength
      let baseBaseWidth = currentPiece.baseWidth

      if (nextPiece.width !== undefined) {
        baseWidth = lerp(currentPiece.width, nextPiece.width, transitionProgress)
      }
      if (nextPiece.height !== undefined) {
        baseHeight = lerp(currentPiece.height, nextPiece.height, transitionProgress)
      }
      if (nextPiece.legLength !== undefined) {
        baseLegLength = lerp(currentPiece.legLength, nextPiece.legLength, transitionProgress)
      }
      if (nextPiece.baseWidth !== undefined) {
        baseBaseWidth = lerp(currentPiece.baseWidth, nextPiece.baseWidth, transitionProgress)
      }

      // Posición y rotación actuales basadas en el progreso de ensamblaje
      const currentX = lerp(baseStartX, baseEndX, assemblyProgress)
      const currentY = lerp(baseStartY, baseEndY, assemblyProgress)
      const currentRotation = lerp(baseStartRotation, baseEndRotation, assemblyProgress)

      // Determinar dirección de profundidad (usar la de la configuración actual)
      const depthDirection = transitionProgress < 0.5 ? currentPiece.depthDirection : nextPiece.depthDirection

      // Dibujar la pieza
      switch (currentPiece.type) {
        case "triangle":
          drawTriangle(
            currentPiece.color,
            currentX,
            currentY,
            0,
            baseLegLength,
            baseLegLength,
            currentRotation,
            baseThickness,
            depthDirection,
          )
          break
        case "rect":
          drawRect(
            currentPiece.color,
            currentX,
            currentY,
            0,
            baseWidth,
            baseHeight,
            currentRotation,
            baseThickness,
            depthDirection,
          )
          break
        case "parallelogram":
          drawParallelogram(
            currentPiece.color,
            currentX,
            currentY,
            0,
            baseBaseWidth,
            baseHeight,
            currentPiece.skewOffset,
            currentRotation,
            baseThickness,
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
