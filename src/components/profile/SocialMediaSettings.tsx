
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Instagram, Music, Twitter, Pin, Youtube, ExternalLink } from 'lucide-react';

interface SocialLink {
  platform: string;
  handle: string;
  url?: string;
}

const socialPlatforms = [
  { key: 'instagram', name: 'Instagram', icon: Instagram, baseUrl: 'https://www.instagram.com/', placeholder: 'territhesupernova' },
  { key: 'tiktok', name: 'TikTok', icon: Music, baseUrl: 'https://tiktok.com/@', placeholder: 'yourhandle' },
  { key: 'twitter', name: 'X (Twitter)', icon: Twitter, baseUrl: 'https://twitter.com/', placeholder: 'yourhandle' },
  { key: 'pinterest', name: 'Pinterest', icon: Pin, baseUrl: 'https://pinterest.com/', placeholder: 'yourhandle' },
  { key: 'youtube', name: 'YouTube', icon: Youtube, baseUrl: 'https://youtube.com/@', placeholder: 'yourhandle' },
];

export const SocialMediaSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchSocialLinks();
    }
  }, [user?.id]);

  const fetchSocialLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('user_social_links')
        .select('platform, handle')
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error fetching social links:', error);
        return;
      }

      const linksMap: Record<string, string> = {};
      data?.forEach(link => {
        linksMap[link.platform] = link.handle;
      });
      setSocialLinks(linksMap);
    } catch (error) {
      console.error('Error fetching social links:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (platform: string, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const generateUrl = (platform: string, handle: string) => {
    const platformConfig = socialPlatforms.find(p => p.key === platform);
    if (!platformConfig || !handle) return '';
    return platformConfig.baseUrl + handle.replace('@', '');
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      // Delete existing links
      await supabase
        .from('user_social_links')
        .delete()
        .eq('user_id', user.id);

      // Insert new links
      const linksToInsert = Object.entries(socialLinks)
        .filter(([_, handle]) => handle.trim())
        .map(([platform, handle]) => ({
          user_id: user.id,
          platform,
          handle: handle.trim(),
          url: generateUrl(platform, handle.trim())
        }));

      if (linksToInsert.length > 0) {
        const { error } = await supabase
          .from('user_social_links')
          .insert(linksToInsert);

        if (error) {
          throw error;
        }
      }

      toast({
        title: "Social Media Updated",
        description: "Your social media handles have been saved successfully!",
      });
    } catch (error) {
      console.error('Error saving social links:', error);
      toast({
        title: "Error",
        description: "Failed to save social media handles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {socialPlatforms.map(platform => {
          const IconComponent = platform.icon;
          const handle = socialLinks[platform.key] || '';
          const url = generateUrl(platform.key, handle);
          
          return (
            <div key={platform.key} className="space-y-2">
              <Label htmlFor={platform.key} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                {platform.name}
              </Label>
              <div className="flex gap-2">
                <Input
                  id={platform.key}
                  placeholder={platform.placeholder}
                  value={handle}
                  onChange={(e) => handleInputChange(platform.key, e.target.value)}
                />
                {url && (
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        
        <div className="pt-4">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? 'Saving...' : 'Save Social Media'}
          </Button>
        </div>

        <div className="text-sm text-gray-600 mt-4 space-y-2">
          <p><strong>How to use:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Enter only your username/handle (e.g., "territhesupernova")</li>
            <li>Don't include @ symbols or full URLs</li>
            <li>We'll automatically create the proper links for you</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
