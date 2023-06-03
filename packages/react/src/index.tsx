import * as React from "react";
import qrGenerator from "qrcode-generator";

import {
  drawPositioningPattern,
  isInPositioninZone,
  utf16to8,
} from "./utils";
import type {
  Coordinates,
  DataStyle,
  ECLevel,
  Props,
} from "./types";

export { ECLevel, DataStyle };

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
      value = "Awesome QRCode",
      dataStyle = "squares",
      size = 150,
      ecLevel = "M",
      quietZone = 10,
      bgColor = "#FFFFFF",
      fgColor = "#000000",
      logoImage,
      logoWidth = 0,
      logoHeight = 0,
      logoPadding = 0,
      logoOpacity = 0,
      removeQrCodeBehindLogo,
      logoRadiusStyle = "square",
      eyeRadius = 0,
      eyeColor,
      onLoad,
      onError,
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
      if (dataStyle === "dots") {
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
      for (const { row, col } of positioningZones) {
        drawPositioningPattern(
          ctx,
          cellSize,
          offset,
          row,
          col,
          eyeColor || fgColor,
          eyeRadius,
        );
      }

      if (logoImage) {
        void fetch(logoImage)
          .then((response) => response.blob())
          .then((blob) => createImageBitmap(blob))
          .then((imageBitmap) => {
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

              if (logoRadiusStyle === "circle") {
                const dxCenterLogoPadding =
                  dxLogoPadding + dWidthLogoPadding / 2;
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
              imageBitmap,
              dxLogo + offset,
              dyLogo + offset,
              dWidthLogo,
              dHeightLogo,
            );
            ctx.restore();
            if (onLoad) {
              onLoad();
            }
          })
          .catch((err) => {
            if (onError) {
              onError(
                err instanceof Error
                  ? err.message
                  : "Failed to generate QRCode with logo",
              );
            }
          });
      } else {
        if (onLoad) {
          onLoad();
        }
      }
    }, [
      ecLevel,
      value,
      size,
      quietZone,
      bgColor,
      fgColor,
      dataStyle,
      logoImage,
      eyeRadius,
      eyeColor,
      logoWidth,
      logoHeight,
      removeQrCodeBehindLogo,
      logoPadding,
      logoOpacity,
      onLoad,
      logoRadiusStyle,
      onError,
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
