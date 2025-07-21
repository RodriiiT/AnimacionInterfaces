document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("tangramCanvas");
  const ctx = canvas.getContext("2d");

  const DESIGN_WIDTH = 600;
  const DESIGN_HEIGHT = 400;

  // Combined piece data, using dimensions from script.js for consistency
  const finalPiecesData = [
    // Azul (grande)
    {
      type: "triangle", color: "#000080", legLength: 90,
      s_startX: 292, s_startY: 243, s_startRotation: 180, s_initialZ: 0, s_endX: 50, s_endY: 243, s_endRotation: 220, s_endZ: 70, s_depthThickness: 16, s_depthDirection: "backward",
      s2_startX: 238, s2_startY: 240, s2_startRotation: 270, s2_initialZ: 0, s2_endX: 50, s2_endY: 240, s2_endRotation: 220, s2_endZ: 70, s2_depthThickness: 16, s2_depthDirection: "down",
    },
    // Naranja (pequeño)
    {
      type: "triangle", color: "#FF7F50", legLength: 45,
      s_startX: 202, s_startY: 242.5, s_startRotation: 0, s_initialZ: 0, s_endX: 50, s_endY: 300, s_endRotation: -45, s_endZ: 50, s_depthThickness: 12, s_depthDirection: "right",
      s2_startX: 372.5, s2_startY: 286, s2_startRotation: 180, s2_initialZ: 0, s2_endX: 550, s2_endY: 286, s2_endRotation: -45, s2_endZ: 50, s2_depthThickness: 12, s2_depthDirection: ["down", "left"],
    },
    // Verde (cuadrado)
    {
      type: "rect", color: "#00B050", width: 45, height: 45,
      s_startX: 397, s_startY: 58, s_startRotation: 90, s_initialZ: 0, s_endX: 382, s_endY: 10, s_endRotation: 0, s_endZ: 30, s_depthThickness: 15, s_depthDirection: "backward",
      s2_startX: 238, s2_startY: 240, s2_startRotation: 90, s2_initialZ: 0, s2_endX: 238, s2_endY: 350, s2_endRotation: 0, s2_endZ: 30, s2_depthThickness: 15, s2_depthDirection: "backward",
    },
    // Teal (pequeño)
    {
      type: "triangle", color: "#008080", legLength: 55,
      s_startX: 392, s_startY: 108, s_startRotation: 90, s_initialZ: 0, s_endX: 550, s_endY: 108, s_endRotation: 135, s_endZ: 40, s_depthThickness: 10, s_depthDirection: "backward",
      s2_startX: 328, s2_startY: 151, s2_startRotation: 0, s2_initialZ: 0, s2_endX: 550, s2_endY: -50, s2_endRotation: 135, s2_endZ: 40, s2_depthThickness: 17, s2_depthDirection: ["forward", "up"],
    },
    // Amarillo (paralelogramo)
    {
      type: "parallelogram", color: "#FFDB58", baseWidth: 50, height: 45, skewOffset: 45,
      s_startX: 250, s_startY: 265, s_startRotation: 180, s_initialZ: 0, s_endX: 248, s_endY: 350, s_endRotation: 135, s_endZ: 55, s_depthThickness: 14, s_depthDirection: "backward",
      s2_startX: 350.5, s2_startY: 194, s2_startRotation: 270, s2_initialZ: 0, s2_endX: 550, s2_endY: 196, s2_endRotation: 135, s2_endZ: 55, s2_depthThickness: 14, s2_depthDirection: ["down"],
    },
    // Morado (mediano)
    {
      type: "triangle", color: "#800080", legLength: 65,
      s_startX: 337, s_startY: 108, s_startRotation: 45, s_initialZ: 0, s_endX: 337, s_endY: 10, s_endRotation: 90, s_endZ: 45, s_depthThickness: 13, s_depthDirection: "right",
      s2_startX: 329, s2_startY: 286, s2_startRotation: 225, s2_initialZ: 0, s2_endX: 450, s2_endY: 380, s2_endRotation: 90, s2_endZ: 45, s2_depthThickness: 13, s2_depthDirection: ["down"],
    },
    // Fucsia (grande)
    {
      type: "triangle", color: "#FF00FF", legLength: 90,
      s_startX: 293, s_startY: 154, s_startRotation: 0, s_initialZ: 0, s_endX: 500, s_endY: 154, s_endRotation: 20, s_endZ: 60, s_depthThickness: 18, s_depthDirection: "forward",
      s2_startX: 327, s2_startY: 151.5, s2_startRotation: 90, s2_initialZ: 0, s2_endX: 180, s2_endY: 10, s2_endRotation: 20, s2_endZ: 60, s2_depthThickness: 18, s2_depthDirection: "backward",
    },
  ];

  // Helper para obtener un color más oscuro (para la profundidad)
  function darkenColor(hex, percent) {
    const f = parseInt(hex.slice(1), 16),
      t = percent < 0 ? 0 : 255,
      p = percent < 0 ? percent * -1 : percent,
      R = f >> 16,
      G = (f >> 8) & 0x00ff,
      B = f & 0x0000ff;
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
    );
  }

  // Funciones de dibujo (modificadas para la extrusión y dirección)
  function drawTriangle(
    color,
    x,
    y,
    z,
    legWidth,
    legHeight,
    rotation,
    thickness,
    depthDirection = "forward",
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);

    const darkColor = darkenColor(color, 0.3);
    let ox = 0;
    let oy = 0;

    const directions = Array.isArray(depthDirection)
      ? depthDirection
      : [depthDirection];

    directions.forEach((dir) => {
      if (dir === "right") {
        ox += thickness;
      } else if (dir === "left") {
        ox += -thickness;
      } else if (dir === "up") {
        oy += -thickness;
      } else if (dir === "down") {
        oy += thickness;
      } else if (dir === "forward") {
        ox += thickness * 0.5;
        oy += thickness * 0.5;
      } else if (dir === "backward") {
        ox += -thickness * 0.5;
        oy += -thickness * 0.5;
      }
    });

    const v1 = { x: 0, y: 0 };
    const v2 = { x: legWidth, y: 0 };
    const v3 = { x: 0, y: legHeight };

    const v1_back = { x: v1.x + ox, y: v1.y + oy };
    const v2_back = { x: v2.x + ox, y: v2.y + oy };
    const v3_back = { x: v3.x + ox, y: v3.y + oy };

    ctx.fillStyle = darkColor;

    ctx.beginPath();
    ctx.moveTo(v1_back.x, v1_back.y);
    ctx.lineTo(v2_back.x, v2_back.y);
    ctx.lineTo(v3_back.x, v3_back.y);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.lineTo(v2_back.x, v2_back.y);
    ctx.lineTo(v1_back.x, v1_back.y);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(v2.x, v2.y);
    ctx.lineTo(v3.x, v3.y);
    ctx.lineTo(v3_back.x, v3_back.y);
    ctx.lineTo(v2_back.x, v2_back.y);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(v3.x, v3.y);
    ctx.lineTo(v1.x, v1.y);
    ctx.lineTo(v1_back.x, v1_back.y);
    ctx.lineTo(v3_back.x, v3_back.y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.lineTo(v3.x, v3.y);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

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
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    const darkColor = darkenColor(color, 0.3);
    let ox = 0;
    let oy = 0;

    const directions = Array.isArray(depthDirection)
      ? depthDirection
      : [depthDirection];

    directions.forEach((dir) => {
      if (dir === "right") {
        ox += thickness;
      } else if (dir === "left") {
        ox += -thickness;
      } else if (dir === "up") {
        oy += -thickness;
      } else if (dir === "down") {
        oy += thickness;
      } else if (dir === "forward") {
        ox += thickness * 0.5;
        oy += thickness * 0.5;
      } else if (dir === "backward") {
        ox += -thickness * 0.5;
        oy += -thickness * 0.5;
      }
    });

    const halfW = width / 2;
    const halfH = height / 2;

    const v1 = { x: -halfW, y: -halfH };
    const v2 = { x: halfW, y: -halfH };
    const v3 = { x: halfW, y: halfH };
    const v4 = { x: -halfW, y: halfH };

    const v1_back = { x: v1.x + ox, y: v1.y + oy };
    const v2_back = { x: v2.x + ox, y: v2.y + oy };
    const v3_back = { x: v3.x + ox, y: v3.y + oy };
    const v4_back = { x: v4.x + ox, y: v4.y + oy };

    ctx.fillStyle = darkColor;

    ctx.beginPath();
    ctx.moveTo(v1_back.x, v1_back.y);
    ctx.lineTo(v2_back.x, v2_back.y);
    ctx.lineTo(v3_back.x, v3_back.y);
    ctx.lineTo(v4_back.x, v4_back.y);
    ctx.closePath();
    ctx.fill();

    if (ox > 0) {
      ctx.beginPath();
      ctx.moveTo(v2.x, v2.y);
      ctx.lineTo(v2_back.x, v2_back.y);
      ctx.lineTo(v3_back.x, v3_back.y);
      ctx.lineTo(v3.x, v3.y);
      ctx.closePath();
      ctx.fill();
    } else if (ox < 0) {
      ctx.beginPath();
      ctx.moveTo(v4.x, v4.y);
      ctx.lineTo(v4_back.x, v4_back.y);
      ctx.lineTo(v1_back.x, v1_back.y);
      ctx.lineTo(v1.x, v1.y);
      ctx.closePath();
      ctx.fill();
    }

    if (oy > 0) {
      ctx.beginPath();
      ctx.moveTo(v3.x, v3.y);
      ctx.lineTo(v3_back.x, v3_back.y);
      ctx.lineTo(v4_back.x, v4_back.y);
      ctx.lineTo(v4.x, v4.y);
      ctx.closePath();
      ctx.fill();
    } else if (oy < 0) {
      ctx.beginPath();
      ctx.moveTo(v1.x, v1.y);
      ctx.lineTo(v1_back.x, v1_back.y);
      ctx.lineTo(v2_back.x, v2_back.y);
      ctx.lineTo(v2.x, v2.y);
      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = color;
    ctx.fillRect(-halfW, -halfH, width, height);

    ctx.restore();
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
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);

    const darkColor = darkenColor(color, 0.3);
    let offsetX = 0;
    let offsetY = 0;

    const directions = Array.isArray(depthDirection)
      ? depthDirection
      : [depthDirection];

    directions.forEach((dir) => {
      if (dir === "right") {
        offsetX += thickness;
      } else if (dir === "left") {
        offsetX += -thickness;
      } else if (dir === "up") {
        offsetY += -thickness;
      } else if (dir === "down") {
        offsetY += thickness;
      } else if (dir === "forward") {
        offsetX += thickness * 0.5;
        offsetY += thickness * 0.5;
      } else if (dir === "backward") {
        offsetX += -thickness * 0.5;
        offsetY += -thickness * 0.5;
      }
    });

    const p1x = 0,
      p1y = 0;
    const p2x = baseWidth,
      p2y = 0;
    const p3x = baseWidth - skewOffset,
      p3y = height;
    const p4x = -skewOffset,
      p4y = height;

    const minLocalX = Math.min(p1x, p2x, p3x, p4x);
    const maxLocalX = Math.max(p1x, p2x, p3x, p4x);
    const minLocalY = Math.min(p1y, p1y, p3y, p4y);
    const maxLocalY = Math.max(p1y, p2y, p3y, p4y);
    const centerLocalX = (minLocalX + maxLocalX) / 2;
    const centerLocalY = (minLocalY + maxLocalY) / 2;

    const v1x = p1x - centerLocalX,
      v1y = p1y - centerLocalY;
    const v2x = p2x - centerLocalX,
      v2y = p2y - centerLocalY;
    const v3x = p3x - centerLocalX,
      v3y = p3y - centerLocalY;
    const v4x = p4x - centerLocalX,
      v4y = p4y - centerLocalY;

    ctx.fillStyle = darkColor;

    ctx.beginPath();
    ctx.moveTo(v1x, v1y);
    ctx.lineTo(v1x + offsetX, v1y + offsetY);
    ctx.lineTo(v2x + offsetX, v2y + offsetY);
    ctx.lineTo(v2x, v2y);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(v2x, v2y);
    ctx.lineTo(v2x + offsetX, v2y + offsetY);
    ctx.lineTo(v3x + offsetX, v3y + offsetY);
    ctx.lineTo(v3x, v3y);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(v3x, v3y);
    ctx.lineTo(v3x + offsetX, v3y + offsetY);
    ctx.lineTo(v4x + offsetX, v4y + offsetY);
    ctx.lineTo(v4x, v4y);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(v4x, v4y);
    ctx.lineTo(v4x + offsetX, v4y + offsetY);
    ctx.lineTo(v1x + offsetX, v1y + offsetY);
    ctx.lineTo(v1x, v1y);
    ctx.closePath();
    ctx.fill();

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

  // Linear interpolation function
  function lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  // Easing function (ease-in-out cubic) for smoother movement
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Animation phase durations
  const INITIAL_PAUSE_DURATION_S2 = 500;
  const DISASSEMBLE_DURATION_S2 = 1500;
  const REASSEMBLE_DURATION_S2 = 1500;
  const S2_CYCLE_DURATION = INITIAL_PAUSE_DURATION_S2 + DISASSEMBLE_DURATION_S2 + REASSEMBLE_DURATION_S2;
  const S2_CYCLES_BEFORE_TRANSITION = 1; // Run script2 animation once before transitioning

  const TRANSITION_PAUSE_AFTER_S2_DISASSEMBLE = 500; // Pause briefly after s2 disassemble
  const TRANSITION_DURATION = 2000; // Duration for the smooth transition between animations
  const TRANSITION_PAUSE_BEFORE_S_ASSEMBLE = 500; // Pause briefly before s assemble

  const INITIAL_PAUSE_DURATION_S = 500;
  const DISASSEMBLE_DURATION_S = 1500;
  const REASSEMBLE_DURATION_S = 1500;
  const S_CYCLE_DURATION = INITIAL_PAUSE_DURATION_S + DISASSEMBLE_DURATION_S + REASSEMBLE_DURATION_S;

  let animationStartTime = 0;
  let animationFrameId;

  function drawPiece(p, x, y, z, rotation, thickness, depthDirection) {
    switch (p.type) {
      case "triangle":
        drawTriangle(p.color, x, y, z, p.legLength, p.legLength, rotation, thickness, depthDirection);
        break;
      case "rect":
        drawRect(p.color, x, y, z, p.width, p.height, rotation, thickness, depthDirection);
        break;
      case "parallelogram":
        drawParallelogram(p.color, x, y, z, p.baseWidth, p.height, p.skewOffset, rotation, thickness, depthDirection);
        break;
    }
  }

  function animate(timestamp) {
    if (!animationStartTime) {
      animationStartTime = timestamp;
    }

    const totalElapsedTime = timestamp - animationStartTime;

    const s2AnimationEndTime = S2_CYCLES_BEFORE_TRANSITION * S2_CYCLE_DURATION;
    const transitionStartTime = s2AnimationEndTime;
    const transitionEndTime = transitionStartTime + TRANSITION_PAUSE_AFTER_S2_DISASSEMBLE + TRANSITION_DURATION + TRANSITION_PAUSE_BEFORE_S_ASSEMBLE;
    const sAnimationStartTime = transitionEndTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = Math.min(canvas.width / DESIGN_WIDTH, canvas.height / DESIGN_HEIGHT);
    const offsetX = (canvas.width - DESIGN_WIDTH * scale) / 2;
    const offsetY = (canvas.height - DESIGN_HEIGHT * scale) / 2;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    let currentX, currentY, currentRotation, currentZ, pieceThickness, depthDirection;

    if (totalElapsedTime < s2AnimationEndTime) {
      // Phase 1: script2.js animation cycle
      const cycleElapsedTime = totalElapsedTime % S2_CYCLE_DURATION;
      let progress;
      if (cycleElapsedTime < INITIAL_PAUSE_DURATION_S2) {
        progress = 0; // Assembled state of script2
      } else if (cycleElapsedTime < INITIAL_PAUSE_DURATION_S2 + DISASSEMBLE_DURATION_S2) {
        const currentPhaseProgress = (cycleElapsedTime - INITIAL_PAUSE_DURATION_S2) / DISASSEMBLE_DURATION_S2;
        progress = easeInOutCubic(currentPhaseProgress); // Disassemble
      } else {
        const currentPhaseProgress = (cycleElapsedTime - (INITIAL_PAUSE_DURATION_S2 + DISASSEMBLE_DURATION_S2)) / REASSEMBLE_DURATION_S2;
        progress = easeInOutCubic(1 - currentPhaseProgress); // Reassemble
      }

      finalPiecesData.forEach(p => {
        currentX = lerp(p.s2_startX, p.s2_endX, progress);
        currentY = lerp(p.s2_startY, p.s2_endY, progress);
        currentRotation = lerp(p.s2_startRotation, p.s2_endRotation, progress);
        currentZ = lerp(p.s2_initialZ, p.s2_endZ, progress);
        pieceThickness = p.s2_depthThickness !== undefined ? p.s2_depthThickness : 0;
        depthDirection = p.s2_depthDirection;

        drawPiece(p, currentX, currentY, currentZ, currentRotation, pieceThickness, depthDirection);
      });

    } else if (totalElapsedTime < transitionEndTime) {
      // Phase 2: Transition from script2.js disassembled to script.js assembled
      const transitionPhaseElapsedTime = totalElapsedTime - transitionStartTime;
      let transitionProgress;

      if (transitionPhaseElapsedTime < TRANSITION_PAUSE_AFTER_S2_DISASSEMBLE) {
          transitionProgress = 0; // Pause after s2 disassemble
      } else if (transitionPhaseElapsedTime < TRANSITION_PAUSE_AFTER_S2_DISASSEMBLE + TRANSITION_DURATION) {
          const currentProgress = (transitionPhaseElapsedTime - TRANSITION_PAUSE_AFTER_S2_DISASSEMBLE) / TRANSITION_DURATION;
          transitionProgress = easeInOutCubic(currentProgress); // Smooth transition
      } else {
          transitionProgress = 1; // Pause before s assemble
      }

      finalPiecesData.forEach(p => {
        // Source for transition: s2_end properties (disassembled state of script2)
        const sourceX = p.s2_endX;
        const sourceY = p.s2_endY;
        const sourceRotation = p.s2_endRotation;
        const sourceZ = p.s2_endZ;
        const sourceThickness = p.s2_depthThickness;
        const sourceDirection = p.s2_depthDirection;

        // Target for transition: s_start properties (assembled state of script)
        const targetX = p.s_startX;
        const targetY = p.s_startY;
        const targetRotation = p.s_startRotation;
        const targetZ = p.s_initialZ;
        const targetThickness = p.s_depthThickness; // Use script.js's depth for target

        currentX = lerp(sourceX, targetX, transitionProgress);
        currentY = lerp(sourceY, targetY, transitionProgress);
        currentRotation = lerp(sourceRotation, targetRotation, transitionProgress);
        currentZ = lerp(sourceZ, targetZ, transitionProgress);
        pieceThickness = lerp(sourceThickness, targetThickness, transitionProgress);
        depthDirection = sourceDirection; // Keeping source direction for smooth depth appearance

        drawPiece(p, currentX, currentY, currentZ, currentRotation, pieceThickness, depthDirection);
      });

    } else {
      // Phase 3: script.js animation cycle
      const sAnimationPhaseElapsedTime = totalElapsedTime - sAnimationStartTime;
      const cycleElapsedTime = sAnimationPhaseElapsedTime % S_CYCLE_DURATION;
      let progress;
      if (cycleElapsedTime < INITIAL_PAUSE_DURATION_S) {
        progress = 0; // Assembled state of script
      } else if (cycleElapsedTime < INITIAL_PAUSE_DURATION_S + DISASSEMBLE_DURATION_S) {
        const currentPhaseProgress = (cycleElapsedTime - INITIAL_PAUSE_DURATION_S) / DISASSEMBLE_DURATION_S;
        progress = easeInOutCubic(currentPhaseProgress); // Disassemble
      } else {
        const currentPhaseProgress = (cycleElapsedTime - (INITIAL_PAUSE_DURATION_S + DISASSEMBLE_DURATION_S)) / REASSEMBLE_DURATION_S;
        progress = easeInOutCubic(1 - currentPhaseProgress); // Reassemble
      }

      finalPiecesData.forEach(p => {
        currentX = lerp(p.s_startX, p.s_endX, progress);
        currentY = lerp(p.s_startY, p.s_endY, progress);
        currentRotation = lerp(p.s_startRotation, p.s.endRotation, progress);
        currentZ = lerp(p.s_initialZ, p.s_endZ, progress);
        pieceThickness = p.s_depthThickness !== undefined ? p.s_depthThickness : 0;
        depthDirection = p.s_depthDirection;

        drawPiece(p, currentX, currentY, currentZ, currentRotation, pieceThickness, depthDirection);
      });
    }

    ctx.restore();
    animationFrameId = requestAnimationFrame(animate);
  }

  function startAnimationCycle() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    animationStartTime = 0; // Reset animation start time to restart the sequence
    animationFrameId = requestAnimationFrame(animate);
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    startAnimationCycle();
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas(); // Initial call to set canvas size and start animation
});