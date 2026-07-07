/**
 * Cloudinary Image Optimization Helper
 * 
 * Automatically injects Cloudinary transformations (auto format, auto quality, optional resizing)
 * into image URLs to reduce bandwidth, convert to modern WebP/AVIF formats on-the-fly,
 * and accelerate image load speeds significantly.
 */
export function optimizeImageUrl(url: string, width?: number): string {
  if (!url || typeof url !== "string") return url;
  
  // Only apply optimization if it's a Cloudinary URL
  if (url.includes("cloudinary.com")) {
    try {
      // Split by '/upload/' to insert dynamic transformation parameters
      const parts = url.split("/upload/");
      if (parts.length === 2) {
        // Build transformation string
        const transform = width 
          ? `f_auto,q_auto,w_${width},c_limit` 
          : "f_auto,q_auto";
        return `${parts[0]}/upload/${transform}/${parts[1]}`;
      }
    } catch (e) {
      console.error("Error optimizing Cloudinary URL:", e);
    }
  }
  
  return url;
}
