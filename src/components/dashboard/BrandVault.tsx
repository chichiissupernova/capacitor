
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BrandVaultHeader } from './BrandVaultHeader';
import { BrandVaultComingSoon } from './BrandVaultComingSoon';
import { BrandVaultFeaturesList } from './BrandVaultFeaturesList';
import { BrandVaultUserStatus } from './BrandVaultUserStatus';

interface BrandVaultProps {
  userPoints: number;
}

export const BrandVault: React.FC<BrandVaultProps> = ({ userPoints }) => {
  return (
    <Card className="p-4 md:p-6 relative overflow-hidden">
      <BrandVaultHeader />
      
      <CardContent>
        <BrandVaultComingSoon />
        <BrandVaultFeaturesList />
        <BrandVaultUserStatus userPoints={userPoints} />
      </CardContent>
    </Card>
  );
};
