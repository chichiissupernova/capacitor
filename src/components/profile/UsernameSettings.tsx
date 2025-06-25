
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Check, X } from 'lucide-react';

export const UsernameSettings: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState(user?.username || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck || usernameToCheck.length < 3) {
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('username', usernameToCheck.toLowerCase())
        .neq('id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking username:', error);
        throw error;
      }
      
      setIsAvailable(!data);
    } catch (error) {
      console.error('Error checking username:', error);
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleUsernameChange = (value: string) => {
    // Only allow alphanumeric characters and underscores
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(cleanValue);
    
    // Reset availability when typing
    setIsAvailable(null);
    
    // Debounce the availability check
    const timeoutId = setTimeout(() => {
      if (cleanValue && cleanValue !== user?.username) {
        checkUsernameAvailability(cleanValue);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleSaveUsername = async () => {
    if (!username || username.length < 3) {
      toast({
        title: "Invalid Username",
        description: "Username must be at least 3 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (isAvailable === false) {
      toast({
        title: "Username Taken",
        description: "This username is already taken. Please choose another.",
        variant: "destructive",
      });
      return;
    }

    if (username === user?.username) {
      toast({
        title: "No Changes",
        description: "Username is already set to this value.",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Updating username to:', username);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ username: username.toLowerCase() })
        .eq('id', user?.id);

      if (error) {
        console.error('Supabase error updating username:', error);
        throw error;
      }

      console.log('Username updated successfully in database');

      // Refresh the user data to get the updated username
      await refreshUser();
      
      toast({
        title: "Username Updated",
        description: "Your username has been successfully updated!",
      });
      
    } catch (error) {
      console.error('Error updating username:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update username. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUsernameStatus = () => {
    if (!username || username.length < 3) return null;
    if (username === user?.username) return null; // No need to show status for current username
    if (isChecking) return { icon: null, text: "Checking...", color: "text-gray-500" };
    if (isAvailable === true) return { icon: Check, text: "Available", color: "text-green-600" };
    if (isAvailable === false) return { icon: X, text: "Taken", color: "text-red-600" };
    return null;
  };

  const status = getUsernameStatus();
  const isCurrentUsername = username === user?.username;

  return (
    <Card>
      <CardHeader className="pb-2 md:pb-3">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <User className="h-4 w-4 md:h-5 md:w-5" />
          Username
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4 p-3 md:p-6">
        <div className="space-y-1 md:space-y-2">
          <Label htmlFor="username" className="text-sm">Username</Label>
          <div className="relative">
            <Input
              id="username"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="Enter your username"
              className="pr-16 md:pr-20 text-sm h-8 md:h-10"
            />
            {status && (
              <div className={`absolute right-2 md:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs md:text-sm ${status.color}`}>
                {status.icon && <status.icon className="h-3 w-3 md:h-4 md:w-4" />}
                <span className="hidden sm:inline">{status.text}</span>
              </div>
            )}
          </div>
          <p className="text-xs md:text-sm text-gray-600">
            This will be your display name and how other users find you.
            Only letters, numbers, and underscores allowed.
          </p>
          {user?.username && (
            <p className="text-xs md:text-sm text-blue-600">
              Current username: @{user.username}
            </p>
          )}
        </div>

        <Button
          onClick={handleSaveUsername}
          disabled={isLoading || !username || username.length < 3 || isAvailable === false || isCurrentUsername}
          className="w-full text-sm h-8 md:h-10"
        >
          {isLoading ? 'Saving...' : isCurrentUsername ? 'Username Saved' : 'Save Username'}
        </Button>
      </CardContent>
    </Card>
  );
};
