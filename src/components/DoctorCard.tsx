import React, { useState, useEffect } from 'react';
import { getImageUrl, optimizeCloudinaryUrl } from '../utils/fileUtils';
import { User } from 'lucide-react';

interface DoctorCardProps {
  image: string;
  name: string;
  specialty: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ image, name, specialty }) => {
  const [imageError, setImageError] = useState(false);
  const [finalImageUrl, setFinalImageUrl] = useState('');

  // Process the image URL when component mounts or image changes
  useEffect(() => {
    // If no image is provided or it's an empty string, set error state immediately
    if (!image || image.trim() === '') {
      console.log(`No image provided for ${name}, using fallback`);
      setImageError(true);
      return;
    }

    // Log the original image URL for debugging
    console.log(`Processing image URL for ${name}:`, image);

    try {
      const processedUrl = image.includes('cloudinary.com')
        ? optimizeCloudinaryUrl(image, 300, 300, 'fill')
        : getImageUrl(image);

      console.log(`Processed URL for ${name}:`, processedUrl);

      // If the URL is empty after processing, switch to fallback
      if (!processedUrl || processedUrl.trim() === '') {
        console.log(`Processed URL is empty for ${name}, using fallback`);
        setImageError(true);
        return;
      }

      setFinalImageUrl(processedUrl);
    } catch (error) {
      console.error(`Error processing image URL for ${name}:`, error);
      setImageError(true);
    }
  }, [image, name]);

  const handleImageError = () => {
    console.error(`Image load error for ${name}:`, finalImageUrl || '<empty URL>');
    setImageError(true);
  };

  // Calculate initials for the fallback
  const initials = name
    ? name.split(' ')
      .filter(part => part.length > 0)
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
    : '';

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden group transition-transform duration-300 hover:-translate-y-2"
    >
      <div className="relative overflow-hidden">
        {/* Image Container */}
        <div className="h-64 overflow-hidden">
          {imageError || !finalImageUrl ? (
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white/90 flex items-center justify-center">
                {initials ? (
                  <span className="text-3xl font-bold text-primary-600">{initials}</span>
                ) : (
                  <User size={48} className="text-primary-600" />
                )}
              </div>
            </div>
          ) : (
            <img
              src={finalImageUrl}
              alt={name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              onError={handleImageError}
            />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-primary-800">{name}</h3>
        <div className="inline-block px-3 py-1 bg-primary-50 text-primary-600 text-sm font-medium rounded-full mb-3">
          {specialty}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;