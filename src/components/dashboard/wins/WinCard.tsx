
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Instagram, Music, Youtube, Globe } from 'lucide-react';
import { Win } from '@/hooks/useWins';

interface WinCardProps {
  win: Win;
}

const platformIcons = {
  Instagram: Instagram,
  TikTok: Music,
  YouTube: Youtube,
  Other: Globe,
};

export function WinCard({ win }: WinCardProps) {
  const PlatformIcon = platformIcons[win.platform as keyof typeof platformIcons] || Globe;
  
  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-sm">{win.title}</h4>
          <div className="flex items-center text-xs text-gray-500 ml-2">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(win.date).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <PlatformIcon className="h-3 w-3" />
            {win.platform}
          </div>
        </div>
        
        {win.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {win.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {win.screenshot_url && (
          <div className="mb-3">
            <img 
              src={win.screenshot_url} 
              alt="Win screenshot" 
              className="w-full h-24 object-cover rounded-md"
            />
          </div>
        )}
        
        {win.description && (
          <p className="text-xs text-gray-600 line-clamp-2">{win.description}</p>
        )}
      </CardContent>
    </Card>
  );
}
