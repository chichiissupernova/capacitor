
import React from 'react';
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { useIsMobile } from '@/hooks/use-mobile';

export const DashboardHeader: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex justify-between items-center mb-1 md:mb-6">
      <div className="flex items-center">
        <WelcomeBanner />
      </div>
    </div>
  );
};
