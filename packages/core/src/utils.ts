import {
  type Coordinates,
  type CornerRadii,
  type EyeColor,
  type InnerOuterRadii,
} from "./types";

/**
 * Converts a UTF-16 encoded string to a UTF-8 encoded string.
 * @param {string} str - The UTF-16 encoded string to convert.
 * @returns {string} - The UTF-8 encoded version of the input string.
 */
export function utf16to8(str: string): string {
  let out = "",
    i: number,
    c: number;
  const len: number = str.length;
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x0001 && c <= 0x007f) {
      out += str.charAt(i);
    } else if (c > 0x07ff) {
      out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
    } else {
      out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
    }
  }
  return out;
}

/**
 * Draw a rounded square in the canvas
 */
export function drawRoundedSquare(
  lineWidth: number,
  x: number,
  y: number,
  size: number,
  color: string,
  radii: number | number[],
  fill: boolean,
  ctx: CanvasRenderingContext2D,
) {
  ctx.lineWidth = lineWidth;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  // Adjust coordinates so that the outside of the stroke is aligned to the edges
  y += lineWidth / 2;
  x += lineWidth / 2;
  size -= lineWidth;

  if (!Array.isArray(radii)) {
    radii = [radii, radii, radii, radii];
  }

  // Radius should not be greater than half the size or less than zero
  radii = radii.map((r) => {
    r = Math.min(r, size / 2);
    return r < 0 ? 0 : r;
  });

  const rTopLeft = radii[0] || 0;
  const rTopRight = radii[1] || 0;
  const rBottomRight = radii[2] || 0;
  const rBottomLeft = radii[3] || 0;

  ctx.beginPath();

  ctx.moveTo(x + rTopLeft, y);

  ctx.lineTo(x + size - rTopRight, y);
  if (rTopRight) ctx.quadraticCurveTo(x + size, y, x + size, y + rTopRight);

  ctx.lineTo(x + size, y + size - rBottomRight);
  if (rBottomRight)
    ctx.quadraticCurveTo(x + size, y + size, x + size - rBottomRight, y + size);

  ctx.lineTo(x + rBottomLeft, y + size);
  if (rBottomLeft) ctx.quadraticCurveTo(x, y + size, x, y + size - rBottomLeft);

  ctx.lineTo(x, y + rTopLeft);
  if (rTopLeft) ctx.quadraticCurveTo(x, y, x + rTopLeft, y);

  ctx.closePath();

  ctx.stroke();
  if (fill) {
    ctx.fill();
  }
}

/**
 * Draw a single positional pattern eye.
 */
export function drawPositioningPattern(
  ctx: CanvasRenderingContext2D,
  cellSize: number,
  offset: number,
  row: number,
  col: number,
  color: EyeColor,
  radii: CornerRadii = [0, 0, 0, 0],
) {
  const lineWidth = Math.ceil(cellSize);

  let radiiOuter: InnerOuterRadii["outer"];
  let radiiInner: InnerOuterRadii["inner"];
  if (typeof radii !== "number" && !Array.isArray(radii)) {
    radiiOuter = radii.outer || 0;
    radiiInner = radii.inner || 0;
  } else {
    radiiOuter = radii;
    radiiInner = radiiOuter;
  }

  let colorOuter: string;
  let colorInner: string;
  if (typeof color !== "string") {
    colorOuter = color.outer;
    colorInner = color.inner;
  } else {
    colorOuter = color;
    colorInner = color;
  }

  let y = row * cellSize + offset;
  let x = col * cellSize + offset;
  let size = cellSize * 7;

  // Outer box
  drawRoundedSquare(lineWidth, x, y, size, colorOuter, radiiOuter, false, ctx);

  // Inner box
  size = cellSize * 3;
  y += cellSize * 2;
  x += cellSize * 2;
  drawRoundedSquare(lineWidth, x, y, size, colorInner, radiiInner, true, ctx);
}

/**
 * Is this dot inside a positional pattern zone.
 */
export function isInPositioninZone(
  col: number,
  row: number,
  zones: Coordinates[],
) {
  return zones.some(
    (zone) =>
      row >= zone.row &&
      row <= zone.row + 7 &&
      col >= zone.col &&
      col <= zone.col + 7,
  );
}
