import {
  type Coordinates,
  type CornerRadii,
  type EyeColor,
  type InnerOuterRadii,
} from "./types";

/**
 * Converts a UTF-16 encoded string to a UTF-8 encoded string.
 * @param str The UTF-16 encoded string to convert.
 * @returns The UTF-8 encoded version of the input string.
 */
export function utf16to8(str: string): string {
  const out: string[] = [];
  let i: number;
  let c: number;
  for (i = 0; i < str.length; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x0001 && c <= 0x007f) {
      out.push(str.charAt(i));
    } else if (c > 0x07ff) {
      out.push(String.fromCharCode(0xe0 | ((c >> 12) & 0x0f)));
      out.push(String.fromCharCode(0x80 | ((c >> 6) & 0x3f)));
      out.push(String.fromCharCode(0x80 | ((c >> 0) & 0x3f)));
    } else {
      out.push(String.fromCharCode(0xc0 | ((c >> 6) & 0x1f)));
      out.push(String.fromCharCode(0x80 | ((c >> 0) & 0x3f)));
    }
  }
  return out.join("");
}

/**
 * Draw a rounded square in the canvas
 * @param lineWidth Width of the line to draw.
 * @param x X-coordinate of the square.
 * @param y Y-coordinate of the square.
 * @param size Size of the square.
 * @param color Color of the square.
 * @param radii Radius of the rounded corners. Can be a single value or an array of four values (top-left, top-right, bottom-right, bottom-left).
 * @param fill Whether to fill the square.
 * @param ctx The canvas context.
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
 * @param ctx The canvas context.
 * @param cellSize Size of each cell.
 * @param offset Offset from the edges.
 * @param row Row number.
 * @param col Column number.
 * @param color Color of the eye.
 * @param [radii=[0, 0, 0, 0]] Radii of the rounded corners.
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
 * Check if a dot is inside a positional pattern zone.
 * @param col Column number.
 * @param row Row number.
 * @param zones List of positional pattern zones.
 * @returns True if the dot is in a positional pattern zone, false otherwise.
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
