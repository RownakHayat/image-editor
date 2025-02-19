export const getCroppedImg = async (
  imageSrc: string,
  crop: { width: number; height: number; x: number; y: number },
  targetWidth: number = 300,
  targetHeight: number = 300 
): Promise<string> => {
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous"); // To avoid CORS issues
      image.src = url;
    });

  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Set the canvas size to the crop area size
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height, // Crop area on the image
    0,
    0,
    targetWidth,
    targetHeight
  );

  // Convert the canvas to a base64-encoded image (you can also export it as a Blob if needed)
  return canvas.toDataURL("image/jpeg");
};
