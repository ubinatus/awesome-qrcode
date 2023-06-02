import { createCanvas, Image, type CanvasRenderingContext2D } from "canvas";
import qrGenerator from "qrcode-generator";

import {
  type Coordinates,
  type CornerRadii,
  type DefaultOptions,
  type EyeColor,
  type InnerOuterRadii,
  type Options,
} from "./types";

export type { Options };

export async function generateQR(_options: Options) {
  const options: Options & DefaultOptions = Object.assign(
    {
      value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      ecLevel: "M",
      enableCORS: false,
      size: 150,
      quietZone: 10,
      bgColor: "#FFFFFF",
      fgColor: "#000000",
      logoOpacity: 1,
      qrStyle: "squares",
      eyeRadius: [0, 0, 0],
      logoPaddingStyle: "square",
      logoWidth: 0,
      logoHeight: 0,
      logoPadding: 0,
    },
    _options,
  );
  const {
    value,
    size,
    quietZone,
    ecLevel,
    // enableCORS,
    bgColor,
    fgColor,
    logoImage,
    logoWidth,
    logoHeight,
    logoPadding,
    logoOpacity,
    logoOnLoad,
    removeQrCodeBehindLogo,
    qrStyle,
    eyeRadius,
    eyeColor,
    logoPaddingStyle,
  } = options;

  const qrCode = qrGenerator(0, ecLevel);
  qrCode.addData(utf16to8(value));
  qrCode.make();

  const canvas = createCanvas(size, size);

  const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

  const canvasSize = size + 2 * quietZone;
  const length = qrCode.getModuleCount();
  const cellSize = size / length;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  const offset = quietZone;

  const positioningZones: Coordinates[] = [
    { row: 0, col: 0 },
    { row: 0, col: length - 7 },
    { row: length - 7, col: 0 },
  ];

  ctx.strokeStyle = fgColor;
  if (qrStyle === "dots") {
    ctx.fillStyle = fgColor;
    const radius = cellSize / 2;
    for (let row = 0; row < length; row++) {
      for (let col = 0; col < length; col++) {
        if (
          qrCode.isDark(row, col) &&
          !isInPositioninZone(row, col, positioningZones)
        ) {
          ctx.beginPath();
          ctx.arc(
            Math.round(col * cellSize) + radius + offset,
            Math.round(row * cellSize) + radius + offset,
            (radius / 100) * 75,
            0,
            2 * Math.PI,
            false,
          );
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  } else {
    for (let row = 0; row < length; row++) {
      for (let col = 0; col < length; col++) {
        if (
          qrCode.isDark(row, col) &&
          !isInPositioninZone(row, col, positioningZones)
        ) {
          ctx.fillStyle = fgColor;
          const w =
            Math.ceil((col + 1) * cellSize) - Math.floor(col * cellSize);
          const h =
            Math.ceil((row + 1) * cellSize) - Math.floor(row * cellSize);
          ctx.fillRect(
            Math.round(col * cellSize) + offset,
            Math.round(row * cellSize) + offset,
            w,
            h,
          );
        }
      }
    }
  }

  // Draw positioning patterns
  let i = 0;
  for (const { row, col } of positioningZones) {
    let radii: CornerRadii | [CornerRadii, CornerRadii, CornerRadii] =
      eyeRadius;
    let color: EyeColor | [EyeColor, EyeColor, EyeColor];
    if (Array.isArray(radii)) {
      radii = radii[i] as CornerRadii;
    }
    if (typeof radii == "number") {
      radii = [radii, radii, radii, radii];
    }

    if (!eyeColor) {
      // if not specified, eye color is the same as foreground,
      color = fgColor;
    } else {
      if (Array.isArray(eyeColor)) {
        // if array, we pass the single color
        color = eyeColor[i] as EyeColor;
      } else {
        color = eyeColor;
      }
    }

    drawPositioningPattern(
      ctx,
      cellSize,
      offset,
      row,
      col,
      color,
      radii as CornerRadii,
    );
    i++;
  }

  if (logoImage) {
    try {
      const image = await loadImage("https://example.com/my-image.jpg");
      ctx.save();

      const dWidthLogo = logoWidth || size * 0.2;
      const dHeightLogo = logoHeight || dWidthLogo;
      const dxLogo = (size - dWidthLogo) / 2;
      const dyLogo = (size - dHeightLogo) / 2;

      if (removeQrCodeBehindLogo || logoPadding) {
        ctx.beginPath();

        ctx.strokeStyle = bgColor;
        ctx.fillStyle = bgColor;

        const dWidthLogoPadding = dWidthLogo + 2 * logoPadding;
        const dHeightLogoPadding = dHeightLogo + 2 * logoPadding;
        const dxLogoPadding = dxLogo + offset - logoPadding;
        const dyLogoPadding = dyLogo + offset - logoPadding;

        if (logoPaddingStyle === "circle") {
          const dxCenterLogoPadding = dxLogoPadding + dWidthLogoPadding / 2;
          const dyCenterLogoPadding = dyLogoPadding + dHeightLogoPadding / 2;
          ctx.ellipse(
            dxCenterLogoPadding,
            dyCenterLogoPadding,
            dWidthLogoPadding / 2,
            dHeightLogoPadding / 2,
            0,
            0,
            2 * Math.PI,
          );
          ctx.stroke();
          ctx.fill();
        } else {
          ctx.fillRect(
            dxLogoPadding,
            dyLogoPadding,
            dWidthLogoPadding,
            dHeightLogoPadding,
          );
        }
      }

      ctx.globalAlpha = logoOpacity;
      ctx.drawImage(
        image,
        dxLogo + offset,
        dyLogo + offset,
        dWidthLogo,
        dHeightLogo,
      );
      ctx.restore();
      if (logoOnLoad) {
        logoOnLoad();
      }
    } catch (e) {
      console.error(e);
    }
  }

  return canvas.toDataURL();
}

async function loadImage(url: string): Promise<Image> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = function () {
      resolve(image);
    };

    image.onerror = function () {
      reject(new Error(`Failed to load image's URL: ${url}`));
    };

    // if (enableCORS) {
    //   image.crossOrigin = "Anonymous";
    // }

    image.src = url;
  });
}

function utf16to8(str: string): string {
  let out = "";
  let i: number;
  let c: number;
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
function drawRoundedSquare(
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
function drawPositioningPattern(
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

  let colorOuter;
  let colorInner;
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
function isInPositioninZone(col: number, row: number, zones: Coordinates[]) {
  return zones.some(
    (zone) =>
      row >= zone.row &&
      row <= zone.row + 7 &&
      col >= zone.col &&
      col <= zone.col + 7,
  );
}
