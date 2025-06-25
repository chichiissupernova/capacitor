
import React from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';

export const BrandVaultComingSoon: React.FC = () => {
  return (
    <div className="text-center py-16 relative">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-purple-200 rounded-full flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-chichi-orange" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-6 w-6 text-chichi-purple animate-pulse" />
          </div>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Brand Marketplace Coming Soon! 🛍️
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Get ready to redeem your points for exclusive brand partnerships, 
        premium products, and amazing collaboration opportunities in our marketplace.
      </p>
    </div>
  );
};
