import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { getBanners, Banner } from '../Api/api';

interface BannerProps {
  className?: string;
}

const BannerComponent: React.FC<BannerProps> = ({ className = '' }) => {
  const [currentBanner, setCurrentBanner] = useState<number>(0);
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getBanners();
        setBanners(data);
      } catch (err) {
        console.error('Error fetching banners:', err);
        setBanners([]); // Ensure banners array is empty on error
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className={`bg-primary-600 text-white overflow-hidden ${className}`}>
      <div className="container mx-auto relative">
        <div className="flex items-center py-3 px-4">
          <div className="flex-shrink-0 mr-4">
            <Calendar size={24} className="text-secondary-400" />
          </div>
          
          <div className="overflow-hidden flex-grow">
            <div className="relative h-6">
              {banners.map((banner, index) => (
                <div
                  key={banner._id}
                  className={`absolute w-full transition-all duration-500 ${
                    index === currentBanner 
                      ? 'top-0 opacity-100' 
                      : '-top-8 opacity-0'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      Upcoming Event: {banner.title}
                    </p>
                    <div className="hidden md:flex items-center ml-4">
                      <Clock size={16} className="mr-1 text-secondary-400" />
                      <span className="text-sm">{banner.date} | {banner.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-shrink-0 ml-4">
            <a
              href={banners[currentBanner]?.registrationLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-secondary-500 hover:bg-secondary-600 px-3 py-1 rounded transition-colors whitespace-nowrap"
            >
              Register Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerComponent;