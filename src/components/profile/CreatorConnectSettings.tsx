
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, EyeOff } from 'lucide-react';

export const CreatorConnectSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stopSharing, setStopSharing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchPrivacySettings();
    }
  }, [user?.id]);

  const fetchPrivacySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_privacy_settings')
        .select('share_progress_on_creator_connect')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching privacy settings:', error);
        return;
      }

      if (data) {
        // Invert the value since we're now showing "stop sharing" instead of "share"
        setStopSharing(!data.share_progress_on_creator_connect);
      } else {
        // Default to false (meaning they ARE sharing by default)
        setStopSharing(false);
      }
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleChange = async (checked: boolean) => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      // Invert the value since the toggle is now for "stop sharing"
      const shareProgress = !checked;
      
      const { error } = await supabase
        .from('user_privacy_settings')
        .upsert({
          user_id: user.id,
          share_progress_on_creator_connect: shareProgress,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error updating privacy settings:', error);
        toast({
          title: "Error",
          description: "Failed to update privacy settings. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setStopSharing(checked);
      toast({
        title: "Settings Updated",
        description: checked 
          ? "Your profile has been hidden from Creator Connect." 
          : "Your progress is now visible on Creator Connect!",
      });
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast({
        title: "Error",
        description: "Failed to update privacy settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Users className="h-4 w-4 md:h-5 md:w-5" />
            Creator Connect
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <div className="animate-pulse">
            <div className="h-3 md:h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 md:pb-3">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Users className="h-4 w-4 md:h-5 md:w-5" />
          Creator Connect
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4 p-3 md:p-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="stop-sharing"
            checked={stopSharing}
            onCheckedChange={handleToggleChange}
            disabled={isSaving}
          />
          <Label htmlFor="stop-sharing" className="flex items-center gap-2 text-sm">
            <EyeOff className="h-3 w-3 md:h-4 md:w-4" />
            Stop sharing my progress on Creator Connect
          </Label>
        </div>
        
        <div className="text-xs md:text-sm text-gray-600">
          <p className="mb-2">
            {stopSharing 
              ? "Your profile is currently hidden from other creators."
              : "Other creators can discover your profile and see:"
            }
          </p>
          {!stopSharing && (
            <ul className="list-disc list-inside space-y-0.5 text-xs">
              <li>Your current streak and total points</li>
              <li>Your level and achievements</li>
              <li>When you joined CHICHI</li>
            </ul>
          )}
          <p className="mt-2 text-xs text-gray-500">
            You can change this setting anytime.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
