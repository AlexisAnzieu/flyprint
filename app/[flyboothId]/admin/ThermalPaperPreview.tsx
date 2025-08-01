"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  uploadedImageUrl: string | null;
  logoWidth: number;
  logoHeight: number;
  text?: string;
  hasTime: boolean;
};

function atkinsonDither(imageData: ImageData) {
  const w = imageData.width;
  const h = imageData.height;
  const d = imageData.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const oldPixel = d[i];
      const newPixel = oldPixel < 128 ? 0 : 255;
      d[i] = d[i + 1] = d[i + 2] = newPixel;

      const quantError = oldPixel - newPixel;
      const spread = [
        [1, 0, 1 / 8],
        [2, 0, 1 / 8],
        [-1, 1, 1 / 8],
        [0, 1, 1 / 8],
        [1, 1, 1 / 8],
        [0, 2, 1 / 8],
      ];

      for (const [dx, dy, factor] of spread) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const ni = (ny * w + nx) * 4;
          d[ni] = Math.max(0, Math.min(255, d[ni] + quantError * factor));
          d[ni + 1] = d[ni];
          d[ni + 2] = d[ni];
        }
      }
    }
  }
  return imageData;
}

// Thermal printer specifications
const THERMAL_SPECS = {
  DPI: 203,
  PAPER_WIDTH_MM: 80,
  PRINT_WIDTH_MM: 72,
  POINTS_PER_LINE: 576,
  // Calculate margins in pixels
  get PAPER_WIDTH_PX() {
    return Math.round((this.PAPER_WIDTH_MM / 25.4) * this.DPI);
  },
  get PRINT_WIDTH_PX() {
    return this.POINTS_PER_LINE;
  },
  get MARGIN_PX() {
    return Math.round((this.PAPER_WIDTH_PX - this.PRINT_WIDTH_PX) / 2);
  },
};

// Image size constants
const PICTURE_WIDTH = 528;
const PICTURE_HEIGHT = 712;

const ThermalPaperPreview: React.FC<Props> = ({
  uploadedImageUrl,
  logoWidth,
  logoHeight,
  text = "",
  hasTime = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cssWidthPx, setCssWidthPx] = React.useState<number>(0);

  // Calculate proper CSS width based on screen DPI for accurate physical representation
  React.useEffect(() => {
    const calculatePhysicalWidth = () => {
      // Create a test element to measure actual screen DPI
      const testDiv = document.createElement("div");
      testDiv.style.width = "1in";
      testDiv.style.height = "1in";
      testDiv.style.position = "absolute";
      testDiv.style.visibility = "hidden";
      testDiv.style.left = "-1000px";
      document.body.appendChild(testDiv);

      const screenDPI = testDiv.offsetWidth;
      document.body.removeChild(testDiv);

      // Calculate CSS width to display 80mm at actual physical size
      const physicalWidthInches = THERMAL_SPECS.PAPER_WIDTH_MM / 25.4;
      const cssWidth = Math.round(physicalWidthInches * screenDPI);

      setCssWidthPx(cssWidth);
    };

    calculatePhysicalWidth();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn("Canvas ref not available");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Could not get 2D context from canvas");
      return;
    }

    // Wait for next frame to ensure canvas is properly mounted
    requestAnimationFrame(() => {
      // Clear entire canvas with paper background (light gray for margins)
      ctx.fillStyle = "#f8f8f8";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw printable area (white background)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(
        THERMAL_SPECS.MARGIN_PX,
        0,
        THERMAL_SPECS.PRINT_WIDTH_PX,
        canvas.height
      );

      // Draw margin guides (very light lines)
      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(THERMAL_SPECS.MARGIN_PX, 0);
      ctx.lineTo(THERMAL_SPECS.MARGIN_PX, canvas.height);
      ctx.moveTo(THERMAL_SPECS.MARGIN_PX + THERMAL_SPECS.PRINT_WIDTH_PX, 0);
      ctx.lineTo(
        THERMAL_SPECS.MARGIN_PX + THERMAL_SPECS.PRINT_WIDTH_PX,
        canvas.height
      );
      ctx.stroke();
      ctx.setLineDash([]);

      if (uploadedImageUrl) {
        const img = new Image();
        img.crossOrigin = "Anonymous";

        img.onload = () => {
          // Define top and bottom margins (in pixels) to simulate newlines
          const IMAGE_TOP_MARGIN = 30;
          const IMAGE_BOTTOM_MARGIN = 30;

          // Use dynamic logo dimensions from props
          const logoW = logoWidth;
          const logoH = logoHeight;

          // Center logo within printable area, apply top margin
          const logoX =
            THERMAL_SPECS.MARGIN_PX +
            (THERMAL_SPECS.PRINT_WIDTH_PX - logoW) / 2;
          const logoY = IMAGE_TOP_MARGIN;

          // Draw image with dynamic dimensions (thermal printer will scale accordingly)
          ctx.drawImage(img, logoX, logoY, logoW, logoH);

          // Get image data and convert to grayscale with proper luminance
          let logoData = ctx.getImageData(logoX, logoY, logoW, logoH);
          for (let i = 0; i < logoData.data.length; i += 4) {
            const avg =
              0.299 * logoData.data[i] + // Red
              0.587 * logoData.data[i + 1] + // Green
              0.114 * logoData.data[i + 2]; // Blue
            logoData.data[i] =
              logoData.data[i + 1] =
              logoData.data[i + 2] =
                avg;
          }

          // Apply Atkinson dithering for thermal printer simulation
          logoData = atkinsonDither(logoData);
          ctx.putImageData(logoData, logoX, logoY);

          // Add sample thermal content directly below the logo plus bottom margin
          addSampleContent(ctx, logoY + logoH + IMAGE_BOTTOM_MARGIN);
        };

        img.onerror = () => {
          console.error("Failed to load image");
          // Draw sample image at the top of the printable area
          addSampleContent(ctx, 0);
        };

        img.src = uploadedImageUrl;
      } else {
        // No image uploaded, show sample content at the top of the printable area
        addSampleContent(ctx, 0);
      }
    });
  }, [uploadedImageUrl, logoWidth, logoHeight, text, hasTime]);

  // Use the dimensions defined at the top level

  const addSampleContent = (ctx: CanvasRenderingContext2D, startY: number) => {
    if (!canvasRef.current) return;

    // Create a temporary canvas for the sample content
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = THERMAL_SPECS.PRINT_WIDTH_PX;
    tempCanvas.height = PICTURE_HEIGHT + 120; // Increased height for more space below image
    const tempCtx = tempCanvas.getContext("2d");

    if (tempCtx) {
      // Fill with white background
      tempCtx.fillStyle = "#ffffff";
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Center the picture within printable area
      const pictureX = (tempCanvas.width - PICTURE_WIDTH) / 2;
      const pictureY = 20;

      // Draw photo border
      tempCtx.strokeStyle = "#000000";
      tempCtx.lineWidth = 2;
      tempCtx.strokeRect(pictureX, pictureY, PICTURE_WIDTH, PICTURE_HEIGHT);

      // Add placeholder text inside the image border
      tempCtx.fillStyle = "#000000";
      tempCtx.font = "18px Arial";
      tempCtx.textAlign = "center";

      const centerX = pictureX + PICTURE_WIDTH / 2;
      const centerY = pictureY + PICTURE_HEIGHT / 2;

      tempCtx.fillText("BLACK AND WHITE", centerX, centerY - 10);
      tempCtx.fillText("IMAGE HERE", centerX, centerY + 20);

      // Add user text below the image border, bigger font
      tempCtx.font = " 28px Arial";
      tempCtx.textAlign = "center";
      const lines = text.split("\n").filter((l) => l.trim() !== "");
      let y = pictureY + PICTURE_HEIGHT + 40;
      for (const line of lines) {
        tempCtx.fillText(line, centerX, y);
        y += 34; // Space between lines
      }

      // Optionally add date/time if hasTime is true
      if (hasTime) {
        tempCtx.font = "bold 22px";
        tempCtx.fillStyle = "#444";
        const date = new Date();
        const dateString = date.toLocaleString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Montreal",
        });
        tempCtx.fillText(dateString, centerX, y + 25);
      }

      // Get the image data and apply dithering
      const imageData = tempCtx.getImageData(
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      );

      // Convert to grayscale
      for (let i = 0; i < imageData.data.length; i += 4) {
        const avg =
          0.299 * imageData.data[i] +
          0.587 * imageData.data[i + 1] +
          0.114 * imageData.data[i + 2];
        imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = avg;
      }

      // Apply dithering for thermal printer simulation
      const ditheredImage = atkinsonDither(imageData);

      // Draw the finished content to the main canvas
      ctx.putImageData(ditheredImage, THERMAL_SPECS.MARGIN_PX, startY);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={THERMAL_SPECS.PAPER_WIDTH_PX} // Full paper width (80mm at 203 DPI)
          height={THERMAL_SPECS.PAPER_WIDTH_PX * 2} // Show full paper height (2x width for portrait orientation)
          className={`h-auto bg-white rounded-lg shadow-md border border-gray-200 ${
            cssWidthPx ? "" : "max-w-[320px]"
          }`}
          style={cssWidthPx ? { width: `${cssWidthPx}px` } : undefined}
        />
      </div>
      <div className="text-slate-400 text-xs mt-3 text-center space-y-1">
        <div>Aperçu simulé à l&apos;échelle physique • 203 DPI</div>
        <div>
          Papier: {THERMAL_SPECS.PAPER_WIDTH_MM}mm • Zone d&apos;impression:{" "}
          {THERMAL_SPECS.PRINT_WIDTH_MM}mm • {THERMAL_SPECS.POINTS_PER_LINE}{" "}
          points/ligne
        </div>
        <div className="text-slate-500">
          Les zones grises représentent les marges non-imprimables
        </div>
      </div>
    </div>
  );
};

export default ThermalPaperPreview;
