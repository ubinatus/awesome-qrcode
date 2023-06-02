import * as React from "react";
import qrGenerator from "qrcode-generator";

import {
  drawPositioningPattern,
  isInPositioninZone,
  utf16to8,
  type Coordinates,
  type CornerRadii,
  type ECLevel,
  type EyeColor,
  type Props,
  type QRStyle,
} from "@awesome-qrcode/core";

export { ECLevel, QRStyle };

export interface AwesomeQRCodeProps extends Props {
  id?: string;
}

export interface AwesomeQRCodeRef {
  getUrl: () => string | null;
  regenerate: () => string | null;
}

export const AwesomeQRCode = React.forwardRef<
  AwesomeQRCodeRef,
  AwesomeQRCodeProps
>(
  (
    {
      id,
      value = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      size = 150,
      ecLevel = "M",
      enableCORS = false,
      quietZone = 10,
      bgColor = "#FFFFFF",
      fgColor = "#000000",
      logoImage,
      logoWidth = 0,
      logoHeight = 0,
      logoPadding = 0,
      logoOpacity = 0,
      logoOnLoad,
      removeQrCodeBehindLogo,
      logoPaddingStyle = "square",
      eyeRadius = [0, 0, 0],
      eyeColor,
      qrStyle = "squares",
    },
    ref,
  ) => {
    // Ref
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    // Generator function
    const generateQR = React.useCallback(() => {
      const qrCode = qrGenerator(0, ecLevel);
      qrCode.addData(utf16to8(value));
      qrCode.make();

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const canvasSize = size + 2 * quietZone;
      const length = qrCode.getModuleCount();
      const cellSize = size / length;
      const scale = window.devicePixelRatio || 1;
      canvas.height = canvas.width = canvasSize * scale;
      ctx.scale(scale, scale);

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
        let radii = eyeRadius;
        let color: EyeColor | [EyeColor, EyeColor, EyeColor];

        if (Array.isArray(radii)) {
          radii = radii[i];
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
            color = eyeColor[i];
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
        const image = new Image();
        if (enableCORS) {
          image.crossOrigin = "anonymous";
        }
        image.onload = () => {
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
              const dyCenterLogoPadding =
                dyLogoPadding + dHeightLogoPadding / 2;
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
        };
        image.src = logoImage;
      }
    }, [
      bgColor,
      ecLevel,
      enableCORS,
      eyeColor,
      eyeRadius,
      fgColor,
      logoHeight,
      logoImage,
      logoOnLoad,
      logoOpacity,
      logoPadding,
      logoPaddingStyle,
      logoWidth,
      qrStyle,
      quietZone,
      removeQrCodeBehindLogo,
      size,
      value,
    ]);

    function getUrl() {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      // This will return the image as data URL
      try {
        return canvas.toDataURL();
      } catch (error) {
        let message = "Oops! Something happened!";
        if (error instanceof Error) {
          message = error.message;
          if (message.includes("Tainted canvases may not be exported")) {
            message =
              "Seems there is an error with the `logoImage` and `crossOrigin`. If the image comes from a remote domain, please set `crossOrigin` as true";
          }
        }
        throw new Error(message);
      }
    }

    // Ref handler
    React.useImperativeHandle(ref, () => ({
      getUrl,
      regenerate: () => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        // Regenerate the canvas
        generateQR();

        // Return the regenerated canvas
        return getUrl();
      },
    }));

    // Lifecycle
    React.useEffect(() => {
      if (canvasRef.current) {
        generateQR();
      }
    }, [generateQR]);

    const qrSize = size + 2 * quietZone;
    return React.createElement("canvas", {
      ref: canvasRef,
      id: id ?? "awesome-qrcode",
      height: qrSize,
      width: qrSize,
      style: { height: qrSize, width: qrSize },
    });
  },
);

AwesomeQRCode.displayName = "AwesomeQRCode";
