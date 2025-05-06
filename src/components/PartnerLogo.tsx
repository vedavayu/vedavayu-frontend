import React from 'react';

interface PartnerCardProps {
  name: string;
  logo: string;
  ownerPhoto: string;
  altLogo: string;
  altOwner: string;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ name, logo, ownerPhoto, altLogo, altOwner }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-4 mb-2">
        <img 
          src={ownerPhoto} 
          alt={altOwner} 
          className="w-16 h-16 rounded-full object-cover"
        />
        <img 
          src={logo} 
          alt={altLogo} 
        />
      </div>
      <p className="text-center text-neutral-600 text-sm">{name}</p>
    </div>
  );
};

export default PartnerCard;