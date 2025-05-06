import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Skeleton } from '@mui/material';
import { fetchGalleryImages, GalleryImage } from '../Api/api';
import { optimizeCloudinaryUrl, getImageUrl } from '../utils/fileUtils';

const Gallery: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        console.log('Fetching gallery images for homepage...');
        setLoading(true);
        const images = await fetchGalleryImages();
        console.log('Gallery images loaded:', images);
        setGalleryImages(images);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadGalleryImages();
  }, []);

  // Process image URL to ensure it displays correctly
  const processImageUrl = (url: string) => {
    if (!url) return '';
    
    return url.includes('cloudinary.com') 
      ? optimizeCloudinaryUrl(url, 1200, 800, 'fill') 
      : getImageUrl(url);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    fade: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="w-full h-[450px] md:h-[600px]">
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      {galleryImages.length > 0 ? (
        <Slider {...settings}>
          {galleryImages.map((image) => (
            <div key={image._id} className="relative h-[450px] md:h-[600px] w-full">
              <img
                src={processImageUrl(image.url)}
                alt="Gallery image"
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  console.error(`Failed to load gallery image: ${image.url}`);
                  e.currentTarget.src = 'https://via.placeholder.com/1200x800?text=Image+Not+Found';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
              {/* Title and description display removed as requested */}
            </div>
          ))}
        </Slider>
      ) : (
        <div className="w-full h-[450px] md:h-[600px] bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;