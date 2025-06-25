import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth';
import { Settings, Upload, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StorageService } from '@/services/StorageService';

export const ProfileSettings: React.FC = () => {
  const { user, signOut, updateUserAvatar, refreshUser } = useAuth();
  const { toast } = useToast();
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show loading state if no user yet
  if (!user) {
    return (
      <Card>
        <CardContent className="p-3 md:p-6">
          <div className="flex items-center justify-center py-4 md:py-8">
            <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-chichi-purple"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) {
      console.log('No file selected or user not authenticated');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingAvatar(true);
    try {
      console.log('Uploading avatar for user:', user.id);
      
      // Upload the file to Supabase storage
      const avatarUrl = await StorageService.uploadAvatar(user.id, file);
      
      if (avatarUrl && updateUserAvatar) {
        console.log('Avatar uploaded, updating user profile with URL:', avatarUrl);
        await updateUserAvatar(avatarUrl);
        if (refreshUser) {
          await refreshUser();
        }
        
        toast({
          title: "Avatar Updated",
          description: "Your profile picture has been updated successfully!",
        });
      } else {
        throw new Error('Failed to upload avatar or update function not available');
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update profile picture.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingAvatar(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader className="pb-2 md:pb-3">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-white">
          <Settings className="h-4 w-4 md:h-5 md:w-5" />
          Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6 p-3 md:p-6">
        {/* Profile Picture Section */}
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 md:h-20 md:w-20 cursor-pointer" onClick={handleAvatarClick}>
                <AvatarImage src={user?.avatarUrl || ""} alt={user?.username || user?.name || "User"} />
                <AvatarFallback className="text-base md:text-lg">
                  {(user?.username || user?.name)?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              {/* Upload overlay */}
              <div 
                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleAvatarClick}
              >
                <Camera className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              {isUpdatingAvatar && (
                <div className="absolute inset-0 bg-black bg-opacity-70 rounded-full flex items-center justify-center">
                  <Upload className="h-5 w-5 md:h-6 md:w-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm md:text-base">{user?.username || user?.name || 'User'}</h3>
              <p className="text-xs md:text-sm text-gray-600">{user?.email}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-xs md:text-sm h-7 md:h-8"
                onClick={handleAvatarClick}
                disabled={isUpdatingAvatar}
              >
                {isUpdatingAvatar ? (
                  <>
                    <Upload className="h-3 w-3 md:h-4 md:w-4 mr-1 animate-spin" />
                    <span className="hidden sm:inline">Uploading...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Camera className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    <span className="hidden sm:inline">Change Photo</span>
                    <span className="sm:hidden">Photo</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />

          <p className="text-xs md:text-sm text-gray-600">
            Click on your avatar or the "Change Photo" button to upload a new profile picture. Maximum size: 5MB.
          </p>
        </div>

        {/* Basic Info */}
        <div className="space-y-3 md:space-y-4">
          <div className="space-y-1 md:space-y-2">
            <Label htmlFor="email" className="text-sm">Email Address</Label>
            <Input
              id="email"
              value={user?.email || ''}
              readOnly
              className="bg-gray-50 text-sm h-8 md:h-10"
            />
            <p className="text-xs md:text-sm text-gray-600">
              Email address cannot be changed
            </p>
          </div>
        </div>

        {/* Account Actions */}
        <div className="pt-3 md:pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={signOut}
            className="w-full text-sm h-8 md:h-10"
          >
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
