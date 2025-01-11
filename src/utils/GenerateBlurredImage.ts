export default async function generateBlurredImage(file: File): Promise<Blob> {
  const img = new Image();
  const imageURL = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Apply blur filter
      ctx.filter = "blur(20px)"; // Adjust blur radius as needed

      // Draw the image on the canvas with the blur filter
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Convert the canvas to a Blob
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to generate blurred image"));
      }, file.type);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = imageURL;
  });
}
