
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { ShoppingBag, Star } from 'lucide-react';

const BrandVaultPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-12">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-chichi-orange" />
            Brand Marketplace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-chichi-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Brand Marketplace Coming Soon!</h3>
              <p className="text-gray-600 mb-4">
                Your one-stop destination to redeem points for brand partnerships, 
                exclusive products, and collaboration opportunities.
              </p>
            </div>
            
            {user ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Hello, {user.name || user.email}!
                </p>
                <div className="text-lg font-semibold text-chichi-orange">
                  Available Points: {(user.points || 0).toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Keep creating content to earn more points for the marketplace
                </p>
              </div>
            ) : (
              <p className="mb-6 text-gray-600">
                Please log in to see your available points for the marketplace.
              </p>
            )}
            
            <Button className="bg-chichi-orange hover:bg-chichi-orange/90" disabled>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Browse Marketplace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandVaultPage;
