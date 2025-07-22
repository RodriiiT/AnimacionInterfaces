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
      depthThickness: 16,
      depthDirection: "forward",
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

  // === RUTAS COREOGRAFIADAS PARA EVITAR COLISIONES ===

  // Rutas del Tangram 81 al 83
  const choreographedPaths_81_to_83 = {
    "#00B050": {
      // Verde (cuadrado): izquierda → arriba → derecha → posición final
      waypoints: [
        { x: 238, y: 240, rotation: 90, delay: 0, duration: 0.8 }, // Inicio
        { x: 100, y: 240, rotation: 90, delay: 0, duration: 0.2 }, // Izquierda
        { x: 100, y: 58, rotation: 90, delay: 0.8, duration: 0.2 }, // Arriba
        { x: 397, y: 58, rotation: 90, delay: 1.5, duration: 0.8 }, // Derecha (final)
      ],
    },
    "#000080": {
      // Azul (grande): ligeramente izquierda → posición final
      waypoints: [
        { x: 238, y: 240, rotation: 270, delay: 0.3, duration: 0.6 }, // Inicio
        { x: 200, y: 240, rotation: 200, delay: 0.3, duration: 0.6 }, // Ligeramente izquierda
        { x: 292, y: 243, rotation: 180, delay: 0.9, duration: 0.8 }, // Posición final
      ],
    },
    "#FF00FF": {
      // Fucsia (grande): derecha → posición final
      waypoints: [
        { x: 327, y: 151.5, rotation: 90, delay: 0.2, duration: 0.7 }, // Inicio
        { x: 380, y: 151.5, rotation: 50, delay: 0.2, duration: 0.7 }, // Derecha
        { x: 293, y: 154, rotation: 0, delay: 0.9, duration: 0.8 }, // Posición final
      ],
    },
    "#FF7F50": {
      // Naranja (pequeño): abajo → posición final
      waypoints: [
        { x: 372.5, y: 286, rotation: 180, delay: 0.4, duration: 0.8 }, // Inicio
        { x: 372.5, y: 350, rotation: 120, delay: 0.4, duration: 0.8 }, // Abajo
        { x: 202, y: 242.5, rotation: 0, delay: 1.2, duration: 0.9 }, // Posición final
      ],
    },
    "#800080": {
      // Morado (mediano): baja → izquierda → sube → posición final
      waypoints: [
        { x: 329, y: 380, rotation: 225, delay: 0, duration: 0.7 }, // Baja (desde el inicio)
        { x: 100, y: 380, rotation: 180, delay: 0.7, duration: 0.8 }, // Izquierda (desde el punto anterior)
        { x: 100, y: 108, rotation: 90, delay: 1.5, duration: 0.7 }, // Sube (desde el punto anterior)
        { x: 337, y: 108, rotation: 45, delay: 2.2, duration: 0.8 }, // Posición final (desde el punto anterior)
      ],
    },
    "#FFDB58": {
      // Amarillo (paralelogramo): movimiento en sentido horario
      waypoints: [
        { x: 350.5, y: 194, rotation: 270, delay: 0.1, duration: 0.7 }, // Inicio
        { x: 500, y: 194, rotation: 320, delay: 0.3, duration: 0.7 }, // Derecha
        { x: 500, y: 265, rotation: 10, delay: 1.2, duration: 0.6 }, // Abajo
        { x: 250, y: 265, rotation: 180, delay: 1.8, duration: 0.8 }, // Posición final
      ],
    },
    "#008080": {
      // Teal (pequeño): derecha → posición final
      waypoints: [
        { x: 328, y: 151, rotation: 0, delay: 0.2, duration: 0.8 }, // Inicio
        { x: 500, y: 100, rotation: 45, delay: 0.3, duration: 0.7 }, // Derecha
        { x: 400, y: 100, rotation: 45, delay: 0.7, duration: 0.7 },
        { x: 392, y: 108, rotation: 90, delay: 1.5, duration: 0.7 }, // Posición final
      ],
    },
  }

  // Rutas del Tangram 83 al 188 - NUEVAS COREOGRAFÍAS ESPECÍFICAS
  const choreographedPaths_83_to_188 = {
    "#00B050": {
      // Verde (cuadrado): sube → izquierda → baja → posición final
      waypoints: [
        { x: 397, y: 58, rotation: 90, delay: 0, duration: 0.6 }, // Inicio
        { x: 397, y: 20, rotation: 90, delay: 0, duration: 0.6 }, // Sube
        { x: 200, y: 20, rotation: 90, delay: 0.6, duration: 0.8 }, // Izquierda
        { x: 272, y: 125, rotation: 90, delay: 1.4, duration: 0.8 }, // Baja a posición final
      ],
    },
    "#008080": {
      // Teal (pequeño): derecha → baja → se inserta en posición final
      waypoints: [
        { x: 392, y: 108, rotation: 90, delay: 0.2, duration: 0.7 }, // Inicio
        { x: 480, y: 108, rotation: 120, delay: 0.2, duration: 0.7 }, // Derecha
        { x: 480, y: 207.8, rotation: 150, delay: 0.9, duration: 0.6 }, // Baja
        { x: 384.5, y: 207.8, rotation: 180, delay: 1.5, duration: 0.7 }, // Se inserta
      ],
    },
    "#800080": {
      // Morado (mediano): izquierda → baja → posición final
      waypoints: [
        { x: 337, y: 108, rotation: 45, delay: 0.3, duration: 0.7 }, // Inicio
        { x: 200, y: 108, rotation: 90, delay: 0.3, duration: 0.7 }, // Izquierda
        { x: 295.8, y: 216, rotation: 135, delay: 1.0, duration: 0.8 }, // Baja a posición final
      ],
    },
    "#FFDB58": {
      // Amarillo (paralelogramo): baja → izquierda → sube → se inserta
      waypoints: [
        { x: 250, y: 265, rotation: 180, delay: 0.1, duration: 0.6 }, // Inicio
        { x: 250, y: 350, rotation: 180, delay: 0.1, duration: 0.6 }, // Baja
        { x: 150, y: 350, rotation: 150, delay: 0.7, duration: 0.7 }, // Izquierda
        { x: 150, y: 211.8, rotation: 120, delay: 1.4, duration: 0.6 }, // Sube
        { x: 224.6, y: 211.8, rotation: 90, delay: 2.0, duration: 0.5 }, // Se inserta
      ],
    },
    "#000080": {
      // Azul (grande): simplemente baja
      waypoints: [
        { x: 292, y: 243, rotation: 180, delay: 0.4, duration: 0.8 }, // Inicio
        { x: 293.7, y: 214.7, rotation: 45, delay: 1.2, duration: 0.8 }, // Baja a posición final
      ],
    },
    "#FF00FF": {
      // Fucsia (grande): movimiento para evitar colisiones
      waypoints: [
        { x: 293, y: 154, rotation: 0, delay: 0.5, duration: 0.6 }, // Inicio
        { x: 380, y: 120, rotation: 30, delay: 0.5, duration: 0.6 }, // Se aleja para evitar colisiones
        { x: 340, y: 170, rotation: 90, delay: 1.1, duration: 0.9 }, // Posición final
      ],
    },
    "#FF7F50": {
      // Naranja (pequeño): baja → derecha (bastante) → sube → se inserta
      waypoints: [
        { x: 202, y: 242.5, rotation: 0, delay: 0.6, duration: 0.6 }, // Inicio
        { x: 202, y: 350, rotation: -30, delay: 0.6, duration: 0.6 }, // Baja
        { x: 450, y: 350, rotation: -60, delay: 1.2, duration: 0.8 }, // Derecha (bastante)
        { x: 450, y: 207.6, rotation: -30, delay: 2.0, duration: 0.6 }, // Sube
        { x: 340.5, y: 207.6, rotation: 0, delay: 2.6, duration: 0.7 }, // Se inserta
      ],
    },
  }

  // Rutas del Tangram 188 al 81 - EFECTO EXPLOSIÓN Y REAGRUPACIÓN
  const choreographedPaths_188_to_81 = {
    "#FFDB58": {
      // Amarillo: explota hacia la izquierda y luego viene desde fuera
      waypoints: [
        { x: 224.6, y: 211.8, rotation: 90, delay: 0, duration: 0.4 }, // Inicio
        { x: -100, y: 150, rotation: 180, delay: 0, duration: 0.4 }, // Explota fuera de pantalla (izquierda)
        { x: -100, y: 194, rotation: 220, delay: 0.4, duration: 0.3 }, // Reposiciona fuera
        { x: 350.5, y: 194, rotation: 270, delay: 0.7, duration: 1.2 }, // Viene desde fuera
      ],
    },
    "#800080": {
      // Morado: explota hacia abajo y viene desde abajo
      waypoints: [
        { x: 295.8, y: 216, rotation: 135, delay: 0.1, duration: 0.4 }, // Inicio
        { x: 295.8, y: 500, rotation: 180, delay: 0.1, duration: 0.4 }, // Explota hacia abajo
        { x: 329, y: 500, rotation: 200, delay: 0.5, duration: 0.3 }, // Reposiciona fuera
        { x: 329, y: 286, rotation: 225, delay: 0.8, duration: 1.1 }, // Viene desde abajo
      ],
    },
    "#000080": {
      // Azul: explota hacia la derecha y viene desde la derecha
      waypoints: [
        { x: 293.7, y: 214.7, rotation: 45, delay: 0.2, duration: 0.4 }, // Inicio
        { x: 700, y: 214.7, rotation: 90, delay: 0.2, duration: 0.4 }, // Explota hacia la derecha
        { x: -700, y: 240, rotation: 220, delay: 0.6, duration: 0.3 }, // Reposiciona fuera
        { x: 238, y: 240, rotation: 270, delay: 0.9, duration: 1.0 }, // Viene desde la derecha
      ],
    },
    "#FF00FF": {
      // Fucsia: explota hacia arriba y viene desde arriba
      waypoints: [
        { x: 340, y: 170, rotation: 90, delay: 0.05, duration: 0.4 }, // Inicio
        { x: 340, y: -100, rotation: 45, delay: 0.05, duration: 0.4 }, // Explota hacia arriba
        { x: 327, y: -100, rotation: 60, delay: 0.45, duration: 0.3 }, // Reposiciona fuera
        { x: 327, y: 151.5, rotation: 90, delay: 0.75, duration: 1.15 }, // Viene desde arriba
      ],
    },
    "#008080": {
      // Teal: explota hacia la esquina superior derecha y viene desde allí
      waypoints: [
        { x: 384.5, y: 207.8, rotation: 180, delay: 0.15, duration: 0.4 }, // Inicio
        { x: 700, y: -50, rotation: 270, delay: 0.15, duration: 0.4 }, // Explota hacia esquina superior derecha
        { x: -600, y: 50, rotation: 320, delay: 0.55, duration: 0.3 }, // Reposiciona fuera
        { x: 328, y: 151, rotation: 0, delay: 0.85, duration: 1.05 }, // Viene desde la esquina
      ],
    },
    "#FF7F50": {
      // Naranja: explota hacia la esquina inferior derecha y viene desde allí
      waypoints: [
        { x: 340.5, y: 207.6, rotation: 0, delay: 0.25, duration: 0.4 }, // Inicio
        { x: 700, y: 500, rotation: 90, delay: 0.25, duration: 0.4 }, // Explota hacia esquina inferior derecha
        { x: 500, y: 500, rotation: 120, delay: 0.65, duration: 0.3 }, // Reposiciona fuera
        { x: 372.5, y: 286, rotation: 180, delay: 0.95, duration: 0.95 }, // Viene desde la esquina
      ],
    },
    "#00B050": {
      // Verde: explota hacia la esquina inferior izquierda y viene desde allí
      waypoints: [
        { x: 272, y: 125, rotation: 90, delay: 0.3, duration: 0.4 }, // Inicio
        { x: -100, y: 500, rotation: 45, delay: 0.3, duration: 0.4 }, // Explota hacia esquina inferior izquierda
        { x: 100, y: 500, rotation: 60, delay: 0.7, duration: 0.3 }, // Reposiciona fuera
        { x: 238, y: 240, rotation: 90, delay: 1.0, duration: 0.9 }, // Viene desde la esquina
      ],
    },
  }

  // === SISTEMA DE ANIMACIÓN CON RUTAS COREOGRAFIADAS ===
  let animationStartTime = 0
  let animationFrameId

  const PAUSE_DURATION = 2000
  const TRANSITION_DURATION = 3000 // Aumentado para acomodar las rutas complejas
  const SINGLE_TANGRAM_CYCLE = PAUSE_DURATION + TRANSITION_DURATION
  const TOTAL_CYCLE_DURATION = SINGLE_TANGRAM_CYCLE * 3

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

  // Función para obtener las rutas coreografiadas según la transición
  function getChoreographedPaths(tangramIndex) {
    switch (tangramIndex) {
      case 0:
        return choreographedPaths_81_to_83 // 81 → 83
      case 1:
        return choreographedPaths_83_to_188 // 83 → 188
      case 2:
        return choreographedPaths_188_to_81 // 188 → 81
      default:
        return choreographedPaths_81_to_83
    }
  }

  // Función para calcular la posición actual en una ruta de waypoints
  function calculateWaypointPosition(waypoints, transitionProgress, transitionDuration) {
    const totalTime = transitionDuration / 1000 // Convertir a segundos
    const currentTime = transitionProgress * totalTime

    // Encontrar el segmento actual de la ruta
    for (let i = 0; i < waypoints.length - 1; i++) {
      const currentWaypoint = waypoints[i]
      const nextWaypoint = waypoints[i + 1]

      const segmentStart = currentWaypoint.delay
      const segmentEnd = nextWaypoint.delay + nextWaypoint.duration

      if (currentTime >= segmentStart && currentTime <= segmentEnd) {
        const segmentProgress = (currentTime - segmentStart) / (segmentEnd - segmentStart)
        const easedProgress = easeInOutCubic(Math.max(0, Math.min(1, segmentProgress)))

        return {
          x: lerp(currentWaypoint.x, nextWaypoint.x, easedProgress),
          y: lerp(currentWaypoint.y, nextWaypoint.y, easedProgress),
          rotation: lerp(currentWaypoint.rotation, nextWaypoint.rotation, easedProgress),
        }
      }
    }

    // Si estamos antes del primer waypoint o después del último
    if (currentTime < waypoints[0].delay) {
      return { x: waypoints[0].x, y: waypoints[0].y, rotation: waypoints[0].rotation }
    } else {
      const lastWaypoint = waypoints[waypoints.length - 1]
      return { x: lastWaypoint.x, y: lastWaypoint.y, rotation: lastWaypoint.rotation }
    }
  }

  function getCurrentConfigurations(elapsedTime) {
    const cycleTime = elapsedTime % TOTAL_CYCLE_DURATION
    const tangramIndex = Math.floor(cycleTime / SINGLE_TANGRAM_CYCLE)
    const phaseTime = cycleTime % SINGLE_TANGRAM_CYCLE

    const configs = [tangram81, tangram83, tangram188]
    const currentConfig = configs[tangramIndex]
    const nextConfig = configs[(tangramIndex + 1) % 3]

    return { currentConfig, nextConfig, phaseTime, tangramIndex }
  }

  function animate(timestamp) {
    if (!animationStartTime) {
      animationStartTime = timestamp
    }

    const elapsedTime = timestamp - animationStartTime
    const { currentConfig, nextConfig, phaseTime, tangramIndex } = getCurrentConfigurations(elapsedTime)

    let transitionProgress = 0

    if (phaseTime < PAUSE_DURATION) {
      transitionProgress = 0
    } else {
      const phaseProgress = (phaseTime - PAUSE_DURATION) / TRANSITION_DURATION
      transitionProgress = phaseProgress // Sin easing aquí, se aplica en los waypoints
    }

    drawScene(currentConfig, nextConfig, transitionProgress, tangramIndex)
    animationFrameId = requestAnimationFrame(animate)
  }

  function drawScene(currentConfig, nextConfig, transitionProgress, tangramIndex) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const scale = Math.min(canvas.width / DESIGN_WIDTH, canvas.height / DESIGN_HEIGHT)
    const offsetX = (canvas.width - DESIGN_WIDTH * scale) / 2
    const offsetY = (canvas.height - DESIGN_HEIGHT * scale) / 2

    ctx.save()
    ctx.translate(offsetX, offsetY)
    ctx.scale(scale, scale)

    const choreographedPaths = getChoreographedPaths(tangramIndex)

    PIECE_COLORS.forEach((color) => {
      const currentPiece = currentConfig[color]
      const nextPiece = nextConfig[color]

      if (!currentPiece || !nextPiece) return

      let currentX, currentY, currentRotation

      if (choreographedPaths[color] && transitionProgress > 0) {
        // Usar ruta coreografiada
        const position = calculateWaypointPosition(
          choreographedPaths[color].waypoints,
          transitionProgress,
          TRANSITION_DURATION,
        )
        currentX = position.x
        currentY = position.y
        currentRotation = position.rotation
      } else {
        // Posición inicial
        currentX = currentPiece.startX
        currentY = currentPiece.startY
        currentRotation = currentPiece.startRotation
      }

      // Interpolar otras propiedades
      const currentThickness = lerp(currentPiece.depthThickness, nextPiece.depthThickness, transitionProgress)

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

  // === FUNCIONES DE DIBUJO 3D (sin cambios) ===

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
