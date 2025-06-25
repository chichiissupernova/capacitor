
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface SocialLinksProps {
  socialLinks: Record<string, { handle: string; url: string; }>;
}

const socialPlatforms = {
  instagram: { name: 'Instagram', icon: '📷', baseUrl: 'https://www.instagram.com/' },
  tiktok: { name: 'TikTok', icon: '🎵', baseUrl: 'https://tiktok.com/@' },
  twitter: { name: 'X (Twitter)', icon: '🐦', baseUrl: 'https://twitter.com/' },
  pinterest: { name: 'Pinterest', icon: '📌', baseUrl: 'https://pinterest.com/' },
  youtube: { name: 'YouTube', icon: '📺', baseUrl: 'https://youtube.com/@' }
};

export function UserProfileSocialLinks({ socialLinks }: SocialLinksProps) {
  if (!socialLinks || Object.keys(socialLinks).length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="font-medium mb-3">Social Media</h4>
      <div className="space-y-2">
        {Object.entries(socialLinks).map(([platform, data]) => {
          const platformInfo = socialPlatforms[platform as keyof typeof socialPlatforms];
          if (!platformInfo || !data.handle) return null;
          
          const url = data.url || `${platformInfo.baseUrl}${data.handle}`;
          
          return (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span>{platformInfo.icon}</span>
                <span className="font-medium">{platformInfo.name}</span>
                <span className="text-gray-600">@{data.handle}</span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
