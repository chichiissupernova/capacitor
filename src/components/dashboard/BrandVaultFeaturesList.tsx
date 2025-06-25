
import React from 'react';

export const BrandVaultFeaturesList: React.FC = () => {
  const features = [
    { color: 'chichi-orange', text: 'Redeem points for brand partnership opportunities' },
    { color: 'chichi-purple', text: 'Exclusive product collaborations and freebies' },
    { color: 'chichi-lime', text: 'Premium brand marketplace access' },
    { color: 'chichi-pink', text: 'Points-to-rewards exchange program' }
  ];

  return (
    <div className="bg-gradient-to-r from-orange-50 to-purple-50 border border-orange-200 rounded-lg p-4 mb-6">
      <h4 className="font-semibold text-gray-900 mb-2">Redeem Your Points For:</h4>
      <div className="text-left space-y-2 text-sm text-gray-700">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-2 h-2 bg-${feature.color} rounded-full`}></div>
            <span>{feature.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
