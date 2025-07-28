
import React from 'react';
import AdBanner from './AdBanner';

interface AdSectionProps {
  position: 'top' | 'middle' | 'bottom' | 'sidebar-top' | 'sidebar-bottom';
  className?: string;
}

const AdSection: React.FC<AdSectionProps> = ({ position, className = "" }) => {
  const getAdContent = () => {
    switch (position) {
      case 'top':
        return {
          type: 'leaderboard' as const,
          label: 'Sponsored Content',
          description: 'Advertisement'
        };
      case 'middle':
        return {
          type: 'rectangle' as const,
          label: 'You might also like',
          description: 'Promoted Content'
        };
      case 'bottom':
        return {
          type: 'leaderboard' as const,
          label: 'Related Offers',
          description: 'Advertisement'
        };
      case 'sidebar-top':
      case 'sidebar-bottom':
        return {
          type: 'sidebar' as const,
          label: 'Sponsored',
          description: 'Advertisement'
        };
      default:
        return {
          type: 'rectangle' as const,
          label: 'Advertisement',
          description: 'Sponsored Content'
        };
    }
  };

  const adConfig = getAdContent();

  return (
    <div className={`ad-section ${className}`}>
      <div className="text-center mb-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          {adConfig.label}
        </span>
      </div>
      <AdBanner type={adConfig.type} />
      <div className="text-center mt-1">
        <span className="text-xs text-muted-foreground">
          {adConfig.description}
        </span>
      </div>
    </div>
  );
};

export default AdSection;
