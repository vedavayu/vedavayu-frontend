// src/components/ServiceCard.tsx
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard: React.FC<Props> = ({ icon, title, description }) => {
  const handleBookAppointment = () => {
    window.open(
      `https://wa.me/+919401986069?text=Hi, I’d like to book the ${title} service`,
      '_blank'
    );
  };

  return (
    <div className="service-card bg-white rounded-lg shadow-md overflow-hidden h-full">
      <div className="p-6">
        <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary-50 text-primary-600">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3 text-primary-800">{title}</h3>
        <p className="text-neutral-600 mb-6">{description}</p>
        <button 
          onClick={handleBookAppointment}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          Book Appointment <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;