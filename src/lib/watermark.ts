const MAX_IMAGE_EDGE = 2200;
const JPEG_QUALITY = 0.92;
const LOGO_PATH = "/images/clinic-logo-official.png";

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error(`Could not load image: ${source}`));
    image.src = source;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("Could not create the watermarked image.")),
      type,
      quality
    );
  });
}

function fitInside(width: number, height: number, maxEdge: number) {
  const scale = Math.min(1, maxEdge / Math.max(width, height));

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function drawRoundedRectangle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

export async function addClinicWatermark(file: File): Promise<File> {
  console.log("WATERMARK FUNCTION CALLED:", file.name);

  if (!file.type.startsWith("image/")) {
    throw new Error(`${file.name} is not a supported image file.`);
  }

  const sourceUrl = URL.createObjectURL(file);

  try {
    const sourceImage = await loadImage(sourceUrl);

    const dimensions = fitInside(
      sourceImage.naturalWidth,
      sourceImage.naturalHeight,
      MAX_IMAGE_EDGE
    );

    const canvas = document.createElement("canvas");
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Your browser could not process this photograph.");
    }

    context.drawImage(
      sourceImage,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const shortestEdge = Math.min(canvas.width, canvas.height);
    const margin = Math.max(12, Math.round(shortestEdge * 0.025));
    const panelHeight = Math.max(100, Math.round(shortestEdge * 0.18));

    const desiredPanelWidth = Math.max(
      390,
      Math.round(canvas.width * 0.78)
    );

    const panelWidth = Math.max(
      1,
      Math.min(canvas.width - margin * 2, desiredPanelWidth)
    );

    const panelX = canvas.width - panelWidth - margin;
    const panelY = canvas.height - panelHeight - margin;
    const cornerRadius = Math.max(12, Math.round(panelHeight * 0.15));

    context.save();

    drawRoundedRectangle(
      context,
      panelX,
      panelY,
      panelWidth,
      panelHeight,
      cornerRadius
    );

    context.fillStyle = "rgba(0, 0, 0, 0.62)";
    context.fill();

    drawRoundedRectangle(
      context,
      panelX,
      panelY,
      panelWidth,
      panelHeight,
      cornerRadius
    );

    context.strokeStyle = "rgba(255, 255, 255, 0.65)";
    context.lineWidth = Math.max(1, shortestEdge * 0.002);
    context.stroke();

    const horizontalPadding = Math.round(panelHeight * 0.14);
    const logoSize = Math.round(panelHeight * 0.68);
    const logoX = panelX + horizontalPadding;
    const logoY = panelY + (panelHeight - logoSize) / 2;

    let textX = panelX + horizontalPadding;

    try {
      const logo = await loadImage(LOGO_PATH);

      context.save();
      context.globalAlpha = 0.96;
      context.drawImage(logo, logoX, logoY, logoSize, logoSize);
      context.restore();

      textX = logoX + logoSize + Math.round(panelHeight * 0.13);
    } catch (logoError) {
      console.warn(
        "Clinic logo could not be loaded. Text watermark will still be applied.",
        logoError
      );
    }

    const rightPadding = horizontalPadding;
    const availableWidth =
      panelX + panelWidth - rightPadding - textX;
    const watermarkContext = context;

    context.textAlign = "left";
    context.textBaseline = "middle";
    context.shadowColor = "rgba(0, 0, 0, 0.9)";
    context.shadowBlur = Math.max(2, shortestEdge * 0.005);

    function drawFittedText(
      text: string,
      startingSize: number,
      weight: number,
      y: number,
      opacity = 0.98
    ) {
      let fontSize = startingSize;

      while (fontSize > 9) {
        watermarkContext.font =
          `${weight} ${fontSize}px Arial, Helvetica, sans-serif`;

        if (watermarkContext.measureText(text).width <= availableWidth) {
          break;
        }

        fontSize -= 1;
      }

      watermarkContext.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      watermarkContext.fillText(text, textX, y);
    }

    drawFittedText(
      "Family Dental Clinic & Implant Center",
      Math.max(15, Math.round(panelHeight * 0.21)),
      800,
      panelY + panelHeight * 0.28
    );

    context.beginPath();
    context.moveTo(textX, panelY + panelHeight * 0.48);
    context.lineTo(
      panelX + panelWidth - rightPadding,
      panelY + panelHeight * 0.48
    );
    context.strokeStyle = "rgba(255, 255, 255, 0.6)";
    context.lineWidth = Math.max(1, shortestEdge * 0.0015);
    context.stroke();

    drawFittedText(
      "Dr. Anita Dental Clinic & Implant Center",
      Math.max(13, Math.round(panelHeight * 0.17)),
      700,
      panelY + panelHeight * 0.66
    );

    drawFittedText(
      "Siwan, Bihar",
      Math.max(11, Math.round(panelHeight * 0.135)),
      600,
      panelY + panelHeight * 0.86,
      0.9
    );

    context.restore();

    const blob = await canvasToBlob(
      canvas,
      "image/jpeg",
      JPEG_QUALITY
    );

    const originalBaseName =
      file.name.replace(/\.[^.]+$/, "") || "clinical-photo";

    return new File(
      [blob],
      `${originalBaseName}-watermarked.jpg`,
      {
        type: "image/jpeg",
        lastModified: Date.now(),
      }
    );
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}
