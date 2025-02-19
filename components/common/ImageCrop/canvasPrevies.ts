import { PixelCrop } from 'react-image-crop'

const TO_RADIANS = Math.PI / 180

export async function canvasPreview(
  imageSrc: HTMLImageElement,  // Image to crop
  crop: PixelCrop,            // Crop coordinates and size
  rotate: number,             // Rotation angle in degrees
  scale: number = 1           // Scale factor for image (default is 1)
): Promise<string> {          // Returns a data URL of the cropped image
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous"); // To avoid CORS issues
      image.src = url;
    });

  // Load the image asynchronously
  const image = await createImage(imageSrc.src);
  
  // Get canvas and context
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Get the image scale based on natural size vs displayed size
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Device pixel ratio for high DPI displays (Retina)
  const pixelRatio = window.devicePixelRatio;

  // Calculate the canvas size based on crop size and pixel ratio
  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  // Scale the canvas context to handle higher DPI
  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  // Translate the crop position based on the scale
  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  // Convert the rotate value to radians
  const rotateRads = rotate * TO_RADIANS;

  // Center of the image (for rotation)
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  // Save the current canvas context state
  ctx.save();

  // Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);

  // Move the origin to the center of the image
  ctx.translate(centerX, centerY);

  // Rotate the image around its center
  ctx.rotate(rotateRads);

  // Scale the image if necessary
  ctx.scale(scale, scale);

  // Move the center back to its original position
  ctx.translate(-centerX, -centerY);

  // Draw the image onto the canvas
  ctx.drawImage(
    image,
    0, 0, image.naturalWidth, image.naturalHeight,  // Source image size
    0, 0, image.naturalWidth, image.naturalHeight   // Destination canvas size
  );

  // Restore the context to its original state
  ctx.restore();

  // Return the image as a data URL (base64 encoded) of the cropped and processed image
  return canvas.toDataURL();  // You can also return `canvas.toBlob()` for direct uploading
}

