/**
 * Converts a relative image path to a full URL
 * 
 * @param imagePath The image path or URL
 * @returns A complete URL for the image
 */
export const getImageUrl = (imagePath: string) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  
  // Empty path handling - return a placeholder URL
  if (!imagePath || imagePath.trim() === '') {
    console.warn('Empty image path provided to getImageUrl');
    return '';
  }
  
  // Handle Cloudinary URLs - already complete URLs
  if (imagePath.includes('cloudinary.com') || imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Handle relative paths with leading slash (from server uploads directory)
  if (imagePath.startsWith('/uploads/')) {
    return `${baseUrl}${imagePath}`;
  }
  
  // Handle relative paths without leading slash
  if (imagePath.startsWith('uploads/')) {
    return `${baseUrl}/${imagePath}`;
  }
  
  // Handle just the filename (needs to be prefixed with uploads path)
  return `${baseUrl}/uploads/${imagePath}`;
};

/**
 * Optimize Cloudinary image URL with specified transformations
 * 
 * @param cloudinaryUrl Original Cloudinary URL
 * @param width Desired width
 * @param height Desired height
 * @param crop Crop mode (fit, fill, etc.)
 * @returns Optimized Cloudinary URL
 */
export const optimizeCloudinaryUrl = (
  cloudinaryUrl: string,
  width?: number,
  height?: number,
  crop: 'fill' | 'fit' | 'crop' = 'fill'
): string => {
  if (!cloudinaryUrl || cloudinaryUrl.trim() === '') {
    console.warn('Empty Cloudinary URL provided to optimizeCloudinaryUrl');
    return '';
  }

  if (!cloudinaryUrl.includes('cloudinary.com')) {
    console.warn('Non-Cloudinary URL provided to optimizeCloudinaryUrl:', cloudinaryUrl);
    return cloudinaryUrl;
  }

  try {
    // Extract parts of the Cloudinary URL
    const urlParts = cloudinaryUrl.split('/upload/');
    if (urlParts.length !== 2) {
      console.warn('Invalid Cloudinary URL format:', cloudinaryUrl);
      return cloudinaryUrl;
    }

    // Build transformation parameters
    let transformations = 'f_auto,q_auto'; // Auto format and quality
    
    if (width) transformations += `,w_${width}`;
    if (height) transformations += `,h_${height}`;
    if (crop) transformations += `,c_${crop}`;

    // Construct the new URL with transformations
    return `${urlParts[0]}/upload/${transformations}/${urlParts[1]}`;
  } catch (error) {
    console.error('Error optimizing Cloudinary URL:', error);
    return cloudinaryUrl; // Return original URL on error
  }
};
  
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};