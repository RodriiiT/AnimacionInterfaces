document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("tangramCanvas");
  const ctx = canvas.getContext("2d");
  const propertiesPanel = document.getElementById("propertiesPanel");
  const propType = document.getElementById("propType");
  const propColor = document.getElementById("propColor");
  const propX = document.getElementById("propX");
  const propY = document.getElementById("propY");
  const propRotation = document.getElementById("propRotation");
  const propSize = document.getElementById("propSize");
  const propThickness = document.getElementById("propThickness");
  // New DOM elements for inversion and 3D controls
  const propFlipX = document.getElementById("propFlipX");
  const propFlipY = document.getElementById("propFlipY");
  const propIs3D = document.getElementById("propIs3D");
  const propDepthDirection = document.getElementById("propDepthDirection");

  const DESIGN_WIDTH = 600;
  const DESIGN_HEIGHT = 400;

  // Initial piece data (from script.js assembled state)
  let pieces = [
    {
      type: "triangle", color: "#000080", legLength: 90,
      x: 293.7, y: 214.7, rotation: 45, z: 0,
      depthThickness: 16, depthDirection: "backward",
      flipX: false, flipY: false, is3D: true, // Added flip and is3D
      originalDepthThickness: 16, // Store original for 3D toggle
    },
    {
      type: "triangle", color: "#FF7F50", legLength: 45,
      x: 340.5, y: 207.6, rotation: 0, z: 0,
      depthThickness: 12, depthDirection: "right",
      flipX: false, flipY: false, is3D: true, // Added flip and is3D
      originalDepthThickness: 12, // Store original for 3D toggle
    },
    {
      type: "rect", color: "#00B050", width: 45, height: 45,
      x: 272.3, y: 124.9, rotation: 90, z: 0,
      depthThickness: 15, depthDirection: "backward",
      flipX: false, flipY: false, is3D: true, // Added flip and is3D
      originalDepthThickness: 15, // Store original for 3D toggle
    },
    {
      type: "triangle", color: "#008080", legLength: 55,
      x: 384.5, y: 207.8, rotation: 180, z: 0,
      depthThickness: 10, depthDirection: "backward",
      flipX: false, flipY: false, is3D: true, // Added flip and is3D
      originalDepthThickness: 10, // Store original for 3D toggle
    },
    {
      type: "parallelogram", color: "#FFDB58", baseWidth: 50, height: 45, skewOffset: 45,
      x: 224.6, y: 211.8, rotation: 90, z: 0,
      depthThickness: 14, depthDirection: "backward",
      flipX: false, flipY: false, is3D: true, // Added flip and is3D
      originalDepthThickness: 14, // Store original for 3D toggle
    },
    {
      type: "triangle", color: "#800080", legLength: 65,
      x: 294.2, y: 215.3, rotation: 135, z: 0,
      depthThickness: 13, depthDirection: "right",
      flipX: false, flipY: false, is3D: true, // Added flip and is3D
      originalDepthThickness: 13, // Store original for 3D toggle
    },
    {
      type: "triangle", color: "#FF00FF", legLength: 90,
      x: 340, y: 169.8, rotation: 90, z: 0,
      depthThickness: 18, depthDirection: "forward",
      flipX: false, flipY: false, is3D: true, // Added flip and is3D
      originalDepthThickness: 18, // Store original for 3D toggle
    },
  ];

  let selectedPiece = null;
  let isDragging = false;
  let isResizing = false;
  let dragStartX, dragStartY;
  let resizeHandle = null; // 'top-left', 'top-right', etc. or 'rotate'

  let currentScale = 1;
  let currentOffsetX = 0;
  let currentOffsetY = 0;

  // Helper functions
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

  // Drawing functions (kept mostly the same, adapted to current piece properties)
  function drawTriangle(
    color,
    x,
    y,
    rotation,
    legWidth, // Using legWidth directly
    legHeight, // Using legHeight directly
    thickness,
    depthDirection = "forward",
    drawHandles = false,
    flipX = false,
    flipY = false
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1); // Apply flip

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

    // Draw handles if selected
    if (drawHandles) {
      ctx.fillStyle = 'red';
      const handleSize = 8;
      const handles = [
        {x: v1.x, y: v1.y, name: 'top-left'},
        {x: v2.x, y: v2.y, name: 'top-right'},
        {x: v3.x, y: v3.y, name: 'bottom-left'},
        {x: (v1.x + v2.x + v3.x) / 3, y: (v1.y + v2.y + v3.y) / 3, name: 'rotate'} // Center for rotation
      ];
      handles.forEach(h => {
        ctx.beginPath();
        ctx.arc(h.x, h.y, handleSize / 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.restore();
  }

  function drawRect(
    color,
    x,
    y,
    rotation,
    width,
    height,
    thickness,
    depthDirection = "forward",
    drawHandles = false,
    flipX = false,
    flipY = false
  ) {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1); // Apply flip

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

    // Draw handles if selected
    if (drawHandles) {
      ctx.fillStyle = 'red';
      const handleSize = 8;
      const handles = [
        {x: v1.x, y: v1.y, name: 'top-left'},
        {x: v2.x, y: v2.y, name: 'top-right'},
        {x: v3.x, y: v3.y, name: 'bottom-right'},
        {x: v4.x, y: v4.y, name: 'bottom-left'},
        {x: 0, y: 0, name: 'rotate'} // Center for rotation
      ];
      handles.forEach(h => {
        ctx.beginPath();
        ctx.arc(h.x, h.y, handleSize / 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.restore();
  }

  function drawParallelogram(
    color,
    x,
    y,
    rotation,
    baseWidth,
    height,
    skewOffset,
    thickness,
    depthDirection = "forward",
    drawHandles = false,
    flipX = false,
    flipY = false
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1); // Apply flip

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

    const p1x = 0, p1y = 0;
    const p2x = baseWidth, p2y = 0;
    const p3x = baseWidth - skewOffset, p3y = height;
    const p4x = -skewOffset, p4y = height;

    const minLocalX = Math.min(p1x, p2x, p3x, p4x);
    const maxLocalX = Math.max(p1x, p2x, p3x, p4x);
    const minLocalY = Math.min(p1y, p1y, p3y, p4y);
    const maxLocalY = Math.max(p1y, p2y, p3y, p4y);
    const centerLocalX = (minLocalX + maxLocalX) / 2;
    const centerLocalY = (minLocalY + maxLocalY) / 2;

    const v1x = p1x - centerLocalX, v1y = p1y - centerLocalY;
    const v2x = p2x - centerLocalX, v2y = p2y - centerLocalY;
    const v3x = p3x - centerLocalX, v3y = p3y - centerLocalY;
    const v4x = p4x - centerLocalX, v4y = p4y - centerLocalY;

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

    // Draw handles if selected
    if (drawHandles) {
      ctx.fillStyle = 'red';
      const handleSize = 8;
      const handles = [
        {x: v1x, y: v1y, name: 'top-left'},
        {x: v2x, y: v2y, name: 'top-right'},
        {x: v3x, y: v3y, name: 'bottom-right'},
        {x: v4x, y: v4y, name: 'bottom-left'},
        {x: 0, y: 0, name: 'rotate'} // Center for rotation
      ];
      handles.forEach(h => {
        ctx.beginPath();
        ctx.arc(h.x, h.y, handleSize / 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.restore();
  }

  // --- Hit testing functions ---
  function getTransformedPoint(x, y) {
    const rect = canvas.getBoundingClientRect();
    const clientX = x - rect.left;
    const clientY = y - rect.top;

    // Convert canvas coordinates to design coordinates
    const designX = (clientX - currentOffsetX) / currentScale;
    const designY = (clientY - currentOffsetY) / currentScale;
    return { x: designX, y: designY };
  }

  function rotatePoint(px, py, cx, cy, angleDeg) {
    const angleRad = angleDeg * Math.PI / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    const translatedX = px - cx;
    const translatedY = py - cy;
    const rotatedX = translatedX * cos - translatedY * sin;
    const rotatedY = translatedX * sin + translatedY * cos;
    return { x: rotatedX + cx, y: rotatedY + cy };
  }

  function isPointInTriangle(pointX, pointY, triX, triY, rotation, legLength, legHeight) {
    // Translate point to piece's local coordinate system (origin at triX, triY)
    // and then rotate it back to 0 degrees for hit testing
    const rotatedPoint = rotatePoint(pointX, pointY, triX, triY, -rotation);
    const localX = rotatedPoint.x - triX;
    const localY = rotatedPoint.y - triY;

    // Triangle vertices in local, unrotated coordinates (0,0), (legLength, 0), (0, legHeight)
    // Check if point is within the triangle formed by (0,0), (legLength,0), (0,legHeight)
    // Using barycentric coordinates or line equations
    const s = localY / legHeight;
    const t = localX / legLength;

    return (s >= 0 && t >= 0 && (s + t <= 1));
  }

  function isPointInRect(pointX, pointY, rectX, rectY, rotation, width, height) {
    // Translate point to rectangle's local coordinate system (origin at center)
    // and then rotate it back to 0 degrees for hit testing
    const centerX = rectX + width / 2;
    const centerY = rectY + height / 2;
    const rotatedPoint = rotatePoint(pointX, pointY, centerX, centerY, -rotation);
    const localX = rotatedPoint.x - centerX;
    const localY = rotatedPoint.y - centerY;

    // Check if within bounds of unrotated rectangle
    return (localX >= -width / 2 && localX <= width / 2 &&
            localY >= -height / 2 && localY <= height / 2);
  }

  function isPointInParallelogram(pointX, pointY, paraX, paraY, rotation, baseWidth, height, skewOffset) {
    // Translate point to parallelogram's local coordinate system (origin at visual center)
    const p1x = 0, p1y = 0;
    const p2x = baseWidth, p2y = 0;
    const p3x = baseWidth - skewOffset, p3y = height;
    const p4x = -skewOffset, p4y = height;

    const minLocalX = Math.min(p1x, p2x, p3x, p4x);
    const maxLocalX = Math.max(p1x, p2x, p3x, p4x);
    const minLocalY = Math.min(p1y, p1y, p3y, p4y);
    const maxLocalY = Math.max(p1y, p2y, p3y, p4y);
    const centerX = paraX + (minLocalX + maxLocalX) / 2;
    const centerY = paraY + (minLocalY + maxLocalY) / 2;

    const rotatedPoint = rotatePoint(pointX, pointY, centerX, centerY, -rotation);
    const localX = rotatedPoint.x - centerX;
    const localY = rotatedPoint.y - centerY;

    // Check if point is within the parallelogram using standard point-in-polygon
    // This is a simplified check for a parallelogram
    // Convert to normalized coordinates relative to bounding box and skew
    const scaledX = localX + skewOffset * (localY / height);
    return (scaledX >= 0 && scaledX <= baseWidth &&
            localY >= 0 && localY <= height);
  }

  function getHandle(pointX, pointY, piece) {
    const handleSize = 8 / currentScale; // Account for current canvas scale

    let vertices;
    let centerX, centerY;

    if (piece.type === 'triangle') {
      vertices = [
        {x: 0, y: 0},
        {x: piece.legLength, y: 0},
        {x: 0, y: piece.legLength}
      ];
      centerX = piece.x;
      centerY = piece.y;
    } else if (piece.type === 'rect') {
      vertices = [
        {x: -piece.width / 2, y: -piece.height / 2},
        {x: piece.width / 2, y: -piece.height / 2},
        {x: piece.width / 2, y: piece.height / 2},
        {x: -piece.width / 2, y: piece.height / 2}
      ];
      centerX = piece.x + piece.width / 2;
      centerY = piece.y + piece.height / 2;
    } else if (piece.type === 'parallelogram') {
      const p1x = 0, p1y = 0;
      const p2x = piece.baseWidth, p2y = 0;
      const p3x = piece.baseWidth - piece.skewOffset, p3y = piece.height;
      const p4x = -piece.skewOffset, p4y = piece.height;

      const minLocalX = Math.min(p1x, p2x, p3x, p4x);
      const maxLocalX = Math.max(p1x, p2x, p3x, p4x);
      const minLocalY = Math.min(p1y, p1y, p3y, p4y);
      const maxLocalY = Math.max(p1y, p2y, p3y, p4y);

      vertices = [
        {x: p1x - (minLocalX + maxLocalX) / 2, y: p1y - (minLocalY + maxLocalY) / 2},
        {x: p2x - (minLocalX + maxLocalX) / 2, y: p2y - (minLocalY + maxLocalY) / 2},
        {x: p3x - (minLocalX + maxLocalX) / 2, y: p3y - (minLocalY + maxLocalY) / 2},
        {x: p4x - (minLocalX + maxLocalX) / 2, y: p4y - (minLocalY + maxLocalY) / 2}
      ];
      centerX = piece.x + (minLocalX + maxLocalX) / 2;
      centerY = piece.y + (minLocalY + maxLocalY) / 2;
    }

    // Check resize handles
    for (let i = 0; i < vertices.length; i++) {
      const v = vertices[i];
      const rotatedHandle = rotatePoint(v.x + centerX, v.y + centerY, centerX, centerY, piece.rotation);
      if (Math.abs(pointX - rotatedHandle.x) < handleSize && Math.abs(pointY - rotatedHandle.y) < handleSize) {
        return ['top-left', 'top-right', 'bottom-right', 'bottom-left'][i % vertices.length];
      }
    }

    // Check rotate handle (center of the piece)
    const rotateHandleX = centerX;
    const rotateHandleY = centerY;
    if (Math.abs(pointX - rotateHandleX) < handleSize && Math.abs(pointY - rotateHandleY) < handleSize) {
        return 'rotate';
    }

    return null;
  }

  function isPointInPiece(pointX, pointY, piece) {
      if (piece.type === 'triangle') {
          return isPointInTriangle(pointX, pointY, piece.x, piece.y, piece.rotation, piece.legLength, piece.legLength);
      } else if (piece.type === 'rect') {
          return isPointInRect(pointX, pointY, piece.x, piece.y, piece.rotation, piece.width, piece.height);
      } else if (piece.type === 'parallelogram') {
          return isPointInParallelogram(pointX, pointY, piece.x, piece.y, piece.rotation, piece.baseWidth, piece.height, piece.skewOffset);
      }
      return false;
  }


  function updatePropertiesPanel() {
    if (selectedPiece) {
      propertiesPanel.style.display = 'block';
      propType.textContent = selectedPiece.type;
      propColor.textContent = selectedPiece.color;
      propX.textContent = selectedPiece.x.toFixed(1);
      propY.textContent = selectedPiece.y.toFixed(1);
      propRotation.textContent = selectedPiece.rotation.toFixed(1);
      propThickness.textContent = selectedPiece.depthThickness.toFixed(1);

      // Set inversion checkboxes
      propFlipX.checked = selectedPiece.flipX;
      propFlipY.checked = selectedPiece.flipY;

      // Set 3D toggle
      propIs3D.checked = selectedPiece.is3D;
      propDepthDirection.value = selectedPiece.depthDirection;

      let sizeText = '';
      if (selectedPiece.type === 'triangle') {
        sizeText = `Lado: ${selectedPiece.legLength.toFixed(1)}`;
      } else if (selectedPiece.type === 'rect') {
        sizeText = `Ancho: ${selectedPiece.width.toFixed(1)}, Alto: ${selectedPiece.height.toFixed(1)}`;
      } else if (selectedPiece.type === 'parallelogram') {
        sizeText = `Base: ${selectedPiece.baseWidth.toFixed(1)}, Alto: ${selectedPiece.height.toFixed(1)}, Skew: ${selectedPiece.skewOffset.toFixed(1)}`;
      }
      propSize.textContent = sizeText;
    } else {
      propertiesPanel.style.display = 'none';
    }
  }

  // Event listeners for new properties panel controls
  propFlipX.addEventListener('change', () => {
    if (selectedPiece) {
      selectedPiece.flipX = propFlipX.checked;
      drawScene();
    }
  });

  propFlipY.addEventListener('change', () => {
    if (selectedPiece) {
      selectedPiece.flipY = propFlipY.checked;
      drawScene();
    }
  });

  propIs3D.addEventListener('change', () => {
    if (selectedPiece) {
      selectedPiece.is3D = propIs3D.checked;
      if (selectedPiece.is3D) {
        selectedPiece.depthThickness = selectedPiece.originalDepthThickness || 0;
      } else {
        selectedPiece.depthThickness = 0;
      }
      drawScene();
    }
  });

  propDepthDirection.addEventListener('change', () => {
    if (selectedPiece) {
      selectedPiece.depthDirection = propDepthDirection.value;
      drawScene();
    }
  });


  function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentScale = Math.min(canvas.width / DESIGN_WIDTH, canvas.height / DESIGN_HEIGHT);
    currentOffsetX = (canvas.width - DESIGN_WIDTH * currentScale) / 2;
    currentOffsetY = (canvas.height - DESIGN_HEIGHT * currentScale) / 2;

    ctx.save();
    ctx.translate(currentOffsetX, currentOffsetY);
    ctx.scale(currentScale, currentScale);

    // Sort pieces by Z-index or drawing order if needed (not implemented here)
    // For now, draw in array order.
    pieces.forEach(p => {
      const drawHandles = (p === selectedPiece);
      const currentThickness = p.is3D ? p.depthThickness : 0; // Use 0 if 3D is off
      if (p.type === 'triangle') {
        drawTriangle(p.color, p.x, p.y, p.rotation, p.legLength, p.legLength, currentThickness, p.depthDirection, drawHandles, p.flipX, p.flipY);
      } else if (p.type === 'rect') {
        drawRect(p.color, p.x, p.y, p.rotation, p.width, p.height, currentThickness, p.depthDirection, drawHandles, p.flipX, p.flipY);
      } else if (p.type === 'parallelogram') {
        drawParallelogram(p.color, p.x, p.y, p.rotation, p.baseWidth, p.height, p.skewOffset, currentThickness, p.depthDirection, drawHandles, p.flipX, p.flipY);
      }
    });

    ctx.restore();
    updatePropertiesPanel();
  }

  // --- Mouse Events for Interaction ---
  canvas.addEventListener('mousedown', (e) => {
    const { x, y } = getTransformedPoint(e.clientX, e.clientY);

    // Check if clicking on a resize handle first
    if (selectedPiece) {
        resizeHandle = getHandle(x, y, selectedPiece);
        if (resizeHandle) {
          isResizing = true;
          dragStartX = x;
          dragStartY = y;
          return;
        }
    }

    // If not resizing, try to select a piece
    selectedPiece = null;
    for (let i = pieces.length - 1; i >= 0; i--) { // Iterate backwards to select top-most piece
      const piece = pieces[i];
      if (isPointInPiece(x, y, piece)) {
        selectedPiece = piece;
        isDragging = true;
        dragStartX = x;
        dragStartY = y;
        // Bring selected piece to front (optional, but good for interaction)
        pieces.splice(i, 1);
        pieces.push(selectedPiece);
        break;
      }
    }
    drawScene();
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!selectedPiece) return;

    const { x, y } = getTransformedPoint(e.clientX, e.clientY);
    const dx = x - dragStartX;
    const dy = y - dragStartY;

    if (isDragging) {
      selectedPiece.x += dx;
      selectedPiece.y += dy;
    } else if (isResizing) {
      if (resizeHandle === 'rotate') {
        let centerX, centerY;
        if (selectedPiece.type === 'triangle') {
            centerX = selectedPiece.x;
            centerY = selectedPiece.y;
        } else if (selectedPiece.type === 'rect') {
            centerX = selectedPiece.x + selectedPiece.width / 2;
            centerY = selectedPiece.y + selectedPiece.height / 2;
        } else if (selectedPiece.type === 'parallelogram') {
            const p1x = 0, p1y = 0; const p2x = selectedPiece.baseWidth, p2y = 0;
            const p3x = selectedPiece.baseWidth - selectedPiece.skewOffset, p3y = selectedPiece.height;
            const p4x = -selectedPiece.skewOffset, p4y = selectedPiece.height;
            const minLocalX = Math.min(p1x, p2x, p3x, p4x); const maxLocalX = Math.max(p1x, p2x, p3x, p4x);
            const minLocalY = Math.min(p1y, p1y, p3y, p4y); const maxLocalY = Math.max(p1y, p2y, p3y, p4y);
            centerX = selectedPiece.x + (minLocalX + maxLocalX) / 2;
            centerY = selectedPiece.y + (minLocalY + maxLocalY) / 2;
        }

        const angleRad = Math.atan2(y - centerY, x - centerX);
        let newRotation = angleRad * 180 / Math.PI;
        // Normalize rotation to 0-360 degrees
        selectedPiece.rotation = (newRotation % 360 + 360) % 360;

      } else {
        const scaleFactor = 1 + (dx + dy) / 200;
        if (selectedPiece.type === 'triangle') {
          selectedPiece.legLength = Math.max(10, selectedPiece.legLength * scaleFactor);
        } else if (selectedPiece.type === 'rect') {
          selectedPiece.width = Math.max(10, selectedPiece.width * scaleFactor);
          selectedPiece.height = Math.max(10, selectedPiece.height * scaleFactor);
        } else if (selectedPiece.type === 'parallelogram') {
          selectedPiece.baseWidth = Math.max(10, selectedPiece.baseWidth * scaleFactor);
          selectedPiece.height = Math.max(10, selectedPiece.height * scaleFactor);
          selectedPiece.skewOffset = selectedPiece.skewOffset * scaleFactor;
        }
      }
    }

    dragStartX = x; // Update start for next move event
    dragStartY = y;
    drawScene();
  });

  canvas.addEventListener('mouseup', () => {
    isDragging = false;
    isResizing = false;
    resizeHandle = null;
    drawScene();
  });

  // Handle clicks outside a piece to deselect
  canvas.addEventListener('click', (e) => {
    const { x, y } = getTransformedPoint(e.clientX, e.clientY);
    let clickedOnPiece = false;
    for (let i = pieces.length - 1; i >= 0; i--) {
      const piece = pieces[i];
      if (isPointInPiece(x, y, piece)) {
        clickedOnPiece = true;
        break;
      }
    }
    if (!clickedOnPiece) {
      selectedPiece = null;
      drawScene(); // Redraw to hide handles and panel
    }
  });

  // --- Initial setup and resize handling ---
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawScene(); // Redraw scene on resize
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas(); // Initial call
});