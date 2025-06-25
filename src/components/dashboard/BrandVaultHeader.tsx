
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';

export const BrandVaultHeader: React.FC = () => {
  return (
    <CardHeader className="pb-4">
      <CardTitle className="text-xl font-semibold flex items-center gap-2">
        <ShoppingBag className="h-5 w-5 text-chichi-orange" />
        Brand Marketplace
      </CardTitle>
    </CardHeader>
  );
};
