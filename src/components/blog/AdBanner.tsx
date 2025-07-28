
import React from 'react';

interface AdBannerProps {
  type: 'leaderboard' | 'rectangle' | 'sidebar';
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ type, className }) => {
  // Define height and width based on ad type
  const dimensions = {
    leaderboard: { height: "90px", width: "100%" },
    rectangle: { height: "250px", width: "100%" },
    sidebar: { height: "250px", width: "100%" }
  };

  return (
    <div 
      className={`bg-gray-100 border border-gray-200 flex items-center justify-center ${className || ''}`}
      style={{
        height: dimensions[type].height,
        width: dimensions[type].width
      }}
    >
      <span className="text-gray-500 text-sm font-medium">Advertisement</span>
    </div>
  );
};

export default AdBanner;
